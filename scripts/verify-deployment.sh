#!/bin/bash

# Script de Vérification du Déploiement
# Ce script vérifie automatiquement l'état du déploiement Kubernetes

set -e

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_NAME="portfolio"
SERVICE_NAME="portfolio-service"
INGRESS_NAME="portfolio-ingress"
CONFIGMAP_NAME="portfolio-config"
CERTIFICATE_NAME="portfolio-tls"
NAMESPACE="${K8S_NAMESPACE:-default}"
APP_LABEL="app=portfolio"

# Compteurs
PASSED=0
FAILED=0
WARNINGS=0

# Fonctions utilitaires
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Vérifier que kubectl est installé
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl n'est pas installé"
        exit 1
    fi
    print_success "kubectl est installé"
}

# Vérifier la connexion au cluster
check_cluster_connection() {
    if kubectl cluster-info &> /dev/null; then
        print_success "Connexion au cluster Kubernetes réussie"
        kubectl cluster-info | head -n 1
    else
        print_error "Impossible de se connecter au cluster Kubernetes"
        exit 1
    fi
}

# Vérifier le namespace
check_namespace() {
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        print_success "Namespace '$NAMESPACE' existe"
    else
        print_warning "Namespace '$NAMESPACE' n'existe pas (utilisation de 'default')"
        NAMESPACE="default"
    fi
}

# Vérifier le Deployment
check_deployment() {
    print_header "Vérification du Deployment"
    
    if kubectl get deployment "$DEPLOYMENT_NAME" -n "$NAMESPACE" &> /dev/null; then
        print_success "Deployment '$DEPLOYMENT_NAME' existe"
        
        # Vérifier les replicas
        DESIRED=$(kubectl get deployment "$DEPLOYMENT_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.replicas}')
        READY=$(kubectl get deployment "$DEPLOYMENT_NAME" -n "$NAMESPACE" -o jsonpath='{.status.readyReplicas}')
        AVAILABLE=$(kubectl get deployment "$DEPLOYMENT_NAME" -n "$NAMESPACE" -o jsonpath='{.status.availableReplicas}')
        
        echo "  Replicas: Desired=$DESIRED, Ready=$READY, Available=$AVAILABLE"
        
        if [ "$READY" == "$DESIRED" ] && [ "$AVAILABLE" == "$DESIRED" ]; then
            print_success "Toutes les replicas sont prêtes ($READY/$DESIRED)"
        else
            print_error "Replicas non prêtes: $READY/$DESIRED ready, $AVAILABLE/$DESIRED available"
        fi
        
        # Afficher les détails
        kubectl get deployment "$DEPLOYMENT_NAME" -n "$NAMESPACE"
    else
        print_error "Deployment '$DEPLOYMENT_NAME' n'existe pas"
    fi
}

# Vérifier les Pods
check_pods() {
    print_header "Vérification des Pods"
    
    PODS=$(kubectl get pods -n "$NAMESPACE" -l "$APP_LABEL" --no-headers 2>/dev/null)
    
    if [ -z "$PODS" ]; then
        print_error "Aucun pod trouvé avec le label '$APP_LABEL'"
        return
    fi
    
    POD_COUNT=$(echo "$PODS" | wc -l)
    print_info "Nombre de pods: $POD_COUNT"
    
    echo "$PODS" | while read -r line; do
        POD_NAME=$(echo "$line" | awk '{print $1}')
        STATUS=$(echo "$line" | awk '{print $3}')
        READY=$(echo "$line" | awk '{print $2}')
        RESTARTS=$(echo "$line" | awk '{print $4}')
        
        if [ "$STATUS" == "Running" ] && [ "$READY" == "1/1" ]; then
            print_success "Pod $POD_NAME: $STATUS, Ready: $READY, Restarts: $RESTARTS"
        elif [ "$STATUS" == "Running" ]; then
            print_warning "Pod $POD_NAME: $STATUS, Ready: $READY (pas complètement prêt), Restarts: $RESTARTS"
        else
            print_error "Pod $POD_NAME: $STATUS, Ready: $READY, Restarts: $RESTARTS"
        fi
    done
    
    # Afficher le tableau complet
    echo ""
    kubectl get pods -n "$NAMESPACE" -l "$APP_LABEL"
}

# Vérifier le Service
check_service() {
    print_header "Vérification du Service"
    
    if kubectl get service "$SERVICE_NAME" -n "$NAMESPACE" &> /dev/null; then
        print_success "Service '$SERVICE_NAME' existe"
        
        # Vérifier les endpoints
        ENDPOINTS=$(kubectl get endpoints "$SERVICE_NAME" -n "$NAMESPACE" -o jsonpath='{.subsets[*].addresses[*].ip}' | wc -w)
        
        if [ "$ENDPOINTS" -gt 0 ]; then
            print_success "Service a $ENDPOINTS endpoint(s)"
        else
            print_error "Service n'a aucun endpoint"
        fi
        
        # Afficher les détails
        kubectl get service "$SERVICE_NAME" -n "$NAMESPACE"
    else
        print_error "Service '$SERVICE_NAME' n'existe pas"
    fi
}

# Vérifier l'Ingress
check_ingress() {
    print_header "Vérification de l'Ingress"
    
    if kubectl get ingress "$INGRESS_NAME" -n "$NAMESPACE" &> /dev/null; then
        print_success "Ingress '$INGRESS_NAME' existe"
        
        # Vérifier l'adresse IP
        ADDRESS=$(kubectl get ingress "$INGRESS_NAME" -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        
        if [ -n "$ADDRESS" ]; then
            print_success "Ingress a une adresse IP: $ADDRESS"
        else
            print_warning "Ingress n'a pas encore d'adresse IP (peut prendre quelques minutes)"
        fi
        
        # Vérifier le host
        HOST=$(kubectl get ingress "$INGRESS_NAME" -n "$NAMESPACE" -o jsonpath='{.spec.rules[0].host}')
        print_info "Host configuré: $HOST"
        
        # Afficher les détails
        kubectl get ingress "$INGRESS_NAME" -n "$NAMESPACE"
    else
        print_error "Ingress '$INGRESS_NAME' n'existe pas"
    fi
}

# Vérifier le ConfigMap
check_configmap() {
    print_header "Vérification du ConfigMap"
    
    if kubectl get configmap "$CONFIGMAP_NAME" -n "$NAMESPACE" &> /dev/null; then
        print_success "ConfigMap '$CONFIGMAP_NAME' existe"
        
        # Compter les clés
        KEYS=$(kubectl get configmap "$CONFIGMAP_NAME" -n "$NAMESPACE" -o jsonpath='{.data}' | grep -o '"[^"]*"' | wc -l)
        print_info "Nombre de clés de configuration: $((KEYS / 2))"
    else
        print_warning "ConfigMap '$CONFIGMAP_NAME' n'existe pas"
    fi
}

# Vérifier le Certificat TLS
check_certificate() {
    print_header "Vérification du Certificat TLS"
    
    # Vérifier si cert-manager est installé
    if ! kubectl get crd certificates.cert-manager.io &> /dev/null; then
        print_warning "cert-manager n'est pas installé (CRD certificates.cert-manager.io non trouvé)"
        return
    fi
    
    if kubectl get certificate "$CERTIFICATE_NAME" -n "$NAMESPACE" &> /dev/null; then
        print_success "Certificate '$CERTIFICATE_NAME' existe"
        
        # Vérifier le statut
        READY=$(kubectl get certificate "$CERTIFICATE_NAME" -n "$NAMESPACE" -o jsonpath='{.status.conditions[?(@.type=="Ready")].status}')
        
        if [ "$READY" == "True" ]; then
            print_success "Certificat est prêt et valide"
            
            # Vérifier la date d'expiration
            NOT_AFTER=$(kubectl get certificate "$CERTIFICATE_NAME" -n "$NAMESPACE" -o jsonpath='{.status.notAfter}')
            if [ -n "$NOT_AFTER" ]; then
                print_info "Expire le: $NOT_AFTER"
            fi
        else
            print_warning "Certificat n'est pas encore prêt (peut prendre quelques minutes)"
            
            # Afficher la raison
            REASON=$(kubectl get certificate "$CERTIFICATE_NAME" -n "$NAMESPACE" -o jsonpath='{.status.conditions[?(@.type=="Ready")].message}')
            if [ -n "$REASON" ]; then
                print_info "Raison: $REASON"
            fi
        fi
        
        # Vérifier le secret TLS
        if kubectl get secret "$CERTIFICATE_NAME" -n "$NAMESPACE" &> /dev/null; then
            print_success "Secret TLS '$CERTIFICATE_NAME' existe"
        else
            print_error "Secret TLS '$CERTIFICATE_NAME' n'existe pas"
        fi
    else
        print_warning "Certificate '$CERTIFICATE_NAME' n'existe pas"
    fi
}

# Vérifier les Health Checks
check_health_endpoint() {
    print_header "Vérification du Health Check Endpoint"
    
    # Obtenir un pod
    POD_NAME=$(kubectl get pods -n "$NAMESPACE" -l "$APP_LABEL" -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -z "$POD_NAME" ]; then
        print_error "Aucun pod disponible pour tester le health check"
        return
    fi
    
    print_info "Test du health check sur le pod: $POD_NAME"
    
    # Tester l'endpoint
    HEALTH_RESPONSE=$(kubectl exec -n "$NAMESPACE" "$POD_NAME" -- wget -q -O- http://localhost:3000/api/health 2>/dev/null || echo "")
    
    if [ -n "$HEALTH_RESPONSE" ]; then
        print_success "Health check endpoint répond"
        echo "  Réponse: $HEALTH_RESPONSE"
        
        # Vérifier que la réponse contient "healthy"
        if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
            print_success "Status est 'healthy'"
        else
            print_warning "Status n'est pas 'healthy'"
        fi
    else
        print_error "Health check endpoint ne répond pas"
    fi
}

# Vérifier les logs récents
check_logs() {
    print_header "Vérification des Logs Récents"
    
    POD_NAME=$(kubectl get pods -n "$NAMESPACE" -l "$APP_LABEL" -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -z "$POD_NAME" ]; then
        print_error "Aucun pod disponible pour vérifier les logs"
        return
    fi
    
    print_info "Logs récents du pod: $POD_NAME"
    echo ""
    kubectl logs -n "$NAMESPACE" "$POD_NAME" --tail=10
    echo ""
    
    # Vérifier les erreurs
    ERROR_COUNT=$(kubectl logs -n "$NAMESPACE" "$POD_NAME" --tail=100 | grep -i "error" | wc -l)
    
    if [ "$ERROR_COUNT" -eq 0 ]; then
        print_success "Aucune erreur dans les logs récents"
    else
        print_warning "$ERROR_COUNT erreur(s) trouvée(s) dans les logs récents"
    fi
}

# Vérifier les événements récents
check_events() {
    print_header "Vérification des Événements Récents"
    
    echo "Événements des 5 dernières minutes:"
    echo ""
    kubectl get events -n "$NAMESPACE" --sort-by='.lastTimestamp' | tail -n 10
    echo ""
    
    # Vérifier les événements d'erreur
    ERROR_EVENTS=$(kubectl get events -n "$NAMESPACE" --field-selector type=Warning --sort-by='.lastTimestamp' | tail -n 5)
    
    if [ -z "$ERROR_EVENTS" ]; then
        print_success "Aucun événement d'avertissement récent"
    else
        print_warning "Événements d'avertissement trouvés:"
        echo "$ERROR_EVENTS"
    fi
}

# Résumé final
print_summary() {
    print_header "Résumé de la Vérification"
    
    TOTAL=$((PASSED + FAILED + WARNINGS))
    
    echo -e "${GREEN}✓ Réussi:${NC} $PASSED"
    echo -e "${RED}✗ Échoué:${NC} $FAILED"
    echo -e "${YELLOW}⚠ Avertissements:${NC} $WARNINGS"
    echo -e "Total: $TOTAL vérifications"
    echo ""
    
    if [ "$FAILED" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
        echo -e "${GREEN}🎉 Tous les tests sont passés! Le déploiement est en bon état.${NC}"
        exit 0
    elif [ "$FAILED" -eq 0 ]; then
        echo -e "${YELLOW}⚠ Déploiement fonctionnel avec quelques avertissements.${NC}"
        exit 0
    else
        echo -e "${RED}❌ Des problèmes ont été détectés. Consultez les erreurs ci-dessus.${NC}"
        exit 1
    fi
}

# Script principal
main() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║   Script de Vérification du Déploiement Kubernetes        ║"
    echo "║   Portfolio Next.js                                        ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_kubectl
    check_cluster_connection
    check_namespace
    
    check_deployment
    check_pods
    check_service
    check_ingress
    check_configmap
    check_certificate
    check_health_endpoint
    check_logs
    check_events
    
    print_summary
}

# Exécuter le script
main
