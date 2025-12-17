# Script de Vérification du Déploiement
# Ce script vérifie automatiquement l'état du déploiement Kubernetes

# Configuration
$DeploymentName = "portfolio"
$ServiceName = "portfolio-service"
$IngressName = "portfolio-ingress"
$ConfigMapName = "portfolio-config"
$CertificateName = "portfolio-tls"
$Namespace = if ($env:K8S_NAMESPACE) { $env:K8S_NAMESPACE } else { "default" }
$AppLabel = "app=portfolio"

# Compteurs
$Script:Passed = 0
$Script:Failed = 0
$Script:Warnings = 0

# Fonctions utilitaires
function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================`n" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
    $Script:Passed++
}

function Write-Failure {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
    $Script:Failed++
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
    $Script:Warnings++
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# Vérifier que kubectl est installé
function Test-Kubectl {
    try {
        $null = kubectl version --client 2>&1
        Write-Success "kubectl est installé"
        return $true
    }
    catch {
        Write-Failure "kubectl n'est pas installé"
        return $false
    }
}

# Vérifier la connexion au cluster
function Test-ClusterConnection {
    try {
        $clusterInfo = kubectl cluster-info 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Connexion au cluster Kubernetes réussie"
            $clusterInfo | Select-Object -First 1 | Write-Host
            return $true
        }
        else {
            Write-Failure "Impossible de se connecter au cluster Kubernetes"
            return $false
        }
    }
    catch {
        Write-Failure "Erreur lors de la connexion au cluster: $_"
        return $false
    }
}

# Vérifier le namespace
function Test-Namespace {
    try {
        $null = kubectl get namespace $Namespace 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Namespace '$Namespace' existe"
        }
        else {
            Write-Warning "Namespace '$Namespace' n'existe pas (utilisation de 'default')"
            $Script:Namespace = "default"
        }
    }
    catch {
        Write-Warning "Erreur lors de la vérification du namespace: $_"
    }
}

# Vérifier le Deployment
function Test-Deployment {
    Write-Header "Vérification du Deployment"
    
    try {
        $deployment = kubectl get deployment $DeploymentName -n $Namespace -o json 2>&1 | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Deployment '$DeploymentName' existe"
            
            $desired = $deployment.spec.replicas
            $ready = if ($deployment.status.readyReplicas) { $deployment.status.readyReplicas } else { 0 }
            $available = if ($deployment.status.availableReplicas) { $deployment.status.availableReplicas } else { 0 }
            
            Write-Host "  Replicas: Desired=$desired, Ready=$ready, Available=$available"
            
            if ($ready -eq $desired -and $available -eq $desired) {
                Write-Success "Toutes les replicas sont prêtes ($ready/$desired)"
            }
            else {
                Write-Failure "Replicas non prêtes: $ready/$desired ready, $available/$desired available"
            }
            
            # Afficher les détails
            kubectl get deployment $DeploymentName -n $Namespace
        }
        else {
            Write-Failure "Deployment '$DeploymentName' n'existe pas"
        }
    }
    catch {
        Write-Failure "Erreur lors de la vérification du deployment: $_"
    }
}

# Vérifier les Pods
function Test-Pods {
    Write-Header "Vérification des Pods"
    
    try {
        $pods = kubectl get pods -n $Namespace -l $AppLabel -o json 2>&1 | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0 -and $pods.items) {
            $podCount = $pods.items.Count
            Write-Info "Nombre de pods: $podCount"
            
            foreach ($pod in $pods.items) {
                $podName = $pod.metadata.name
                $status = $pod.status.phase
                $ready = "$($pod.status.containerStatuses[0].ready)/$($pod.spec.containers.Count)"
                $restarts = $pod.status.containerStatuses[0].restartCount
                
                if ($status -eq "Running" -and $pod.status.containerStatuses[0].ready) {
                    Write-Success "Pod $podName : $status, Ready: $ready, Restarts: $restarts"
                }
                elseif ($status -eq "Running") {
                    Write-Warning "Pod $podName : $status, Ready: $ready (pas complètement prêt), Restarts: $restarts"
                }
                else {
                    Write-Failure "Pod $podName : $status, Ready: $ready, Restarts: $restarts"
                }
            }
            
            Write-Host ""
            kubectl get pods -n $Namespace -l $AppLabel
        }
        else {
            Write-Failure "Aucun pod trouvé avec le label '$AppLabel'"
        }
    }
    catch {
        Write-Failure "Erreur lors de la vérification des pods: $_"
    }
}

# Vérifier le Service
function Test-Service {
    Write-Header "Vérification du Service"
    
    try {
        $service = kubectl get service $ServiceName -n $Namespace -o json 2>&1 | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Service '$ServiceName' existe"
            
            # Vérifier les endpoints
            $endpoints = kubectl get endpoints $ServiceName -n $Namespace -o json 2>&1 | ConvertFrom-Json
            
            if ($endpoints.subsets -and $endpoints.subsets[0].addresses) {
                $endpointCount = $endpoints.subsets[0].addresses.Count
                Write-Success "Service a $endpointCount endpoint(s)"
            }
            else {
                Write-Failure "Service n'a aucun endpoint"
            }
            
            kubectl get service $ServiceName -n $Namespace
        }
        else {
            Write-Failure "Service '$ServiceName' n'existe pas"
        }
    }
    catch {
        Write-Failure "Erreur lors de la vérification du service: $_"
    }
}

# Vérifier l'Ingress
function Test-Ingress {
    Write-Header "Vérification de l'Ingress"
    
    try {
        $ingress = kubectl get ingress $IngressName -n $Namespace -o json 2>&1 | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Ingress '$IngressName' existe"
            
            # Vérifier l'adresse IP
            if ($ingress.status.loadBalancer.ingress) {
                $address = $ingress.status.loadBalancer.ingress[0].ip
                Write-Success "Ingress a une adresse IP: $address"
            }
            else {
                Write-Warning "Ingress n'a pas encore d'adresse IP (peut prendre quelques minutes)"
            }
            
            # Vérifier le host
            if ($ingress.spec.rules) {
                $host = $ingress.spec.rules[0].host
                Write-Info "Host configuré: $host"
            }
            
            kubectl get ingress $IngressName -n $Namespace
        }
        else {
            Write-Failure "Ingress '$IngressName' n'existe pas"
        }
    }
    catch {
        Write-Failure "Erreur lors de la vérification de l'ingress: $_"
    }
}

# Vérifier le ConfigMap
function Test-ConfigMap {
    Write-Header "Vérification du ConfigMap"
    
    try {
        $configmap = kubectl get configmap $ConfigMapName -n $Namespace -o json 2>&1 | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "ConfigMap '$ConfigMapName' existe"
            
            if ($configmap.data) {
                $keyCount = ($configmap.data | Get-Member -MemberType NoteProperty).Count
                Write-Info "Nombre de clés de configuration: $keyCount"
            }
        }
        else {
            Write-Warning "ConfigMap '$ConfigMapName' n'existe pas"
        }
    }
    catch {
        Write-Warning "Erreur lors de la vérification du configmap: $_"
    }
}

# Vérifier le Certificat TLS
function Test-Certificate {
    Write-Header "Vérification du Certificat TLS"
    
    try {
        # Vérifier si cert-manager est installé
        $null = kubectl get crd certificates.cert-manager.io 2>&1
        
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "cert-manager n'est pas installé (CRD certificates.cert-manager.io non trouvé)"
            return
        }
        
        $certificate = kubectl get certificate $CertificateName -n $Namespace -o json 2>&1 | ConvertFrom-Json
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Certificate '$CertificateName' existe"
            
            # Vérifier le statut
            $readyCondition = $certificate.status.conditions | Where-Object { $_.type -eq "Ready" }
            
            if ($readyCondition -and $readyCondition.status -eq "True") {
                Write-Success "Certificat est prêt et valide"
                
                if ($certificate.status.notAfter) {
                    Write-Info "Expire le: $($certificate.status.notAfter)"
                }
            }
            else {
                Write-Warning "Certificat n'est pas encore prêt (peut prendre quelques minutes)"
                
                if ($readyCondition.message) {
                    Write-Info "Raison: $($readyCondition.message)"
                }
            }
            
            # Vérifier le secret TLS
            $null = kubectl get secret $CertificateName -n $Namespace 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Secret TLS '$CertificateName' existe"
            }
            else {
                Write-Failure "Secret TLS '$CertificateName' n'existe pas"
            }
        }
        else {
            Write-Warning "Certificate '$CertificateName' n'existe pas"
        }
    }
    catch {
        Write-Warning "Erreur lors de la vérification du certificat: $_"
    }
}

# Vérifier le Health Check Endpoint
function Test-HealthEndpoint {
    Write-Header "Vérification du Health Check Endpoint"
    
    try {
        $pods = kubectl get pods -n $Namespace -l $AppLabel -o json 2>&1 | ConvertFrom-Json
        
        if ($pods.items -and $pods.items.Count -gt 0) {
            $podName = $pods.items[0].metadata.name
            Write-Info "Test du health check sur le pod: $podName"
            
            $healthResponse = kubectl exec -n $Namespace $podName -- wget -q -O- http://localhost:3000/api/health 2>&1
            
            if ($LASTEXITCODE -eq 0 -and $healthResponse) {
                Write-Success "Health check endpoint répond"
                Write-Host "  Réponse: $healthResponse"
                
                if ($healthResponse -match "healthy") {
                    Write-Success "Status est 'healthy'"
                }
                else {
                    Write-Warning "Status n'est pas 'healthy'"
                }
            }
            else {
                Write-Failure "Health check endpoint ne répond pas"
            }
        }
        else {
            Write-Failure "Aucun pod disponible pour tester le health check"
        }
    }
    catch {
        Write-Failure "Erreur lors du test du health check: $_"
    }
}

# Vérifier les logs récents
function Test-Logs {
    Write-Header "Vérification des Logs Récents"
    
    try {
        $pods = kubectl get pods -n $Namespace -l $AppLabel -o json 2>&1 | ConvertFrom-Json
        
        if ($pods.items -and $pods.items.Count -gt 0) {
            $podName = $pods.items[0].metadata.name
            Write-Info "Logs récents du pod: $podName"
            Write-Host ""
            
            kubectl logs -n $Namespace $podName --tail=10
            Write-Host ""
            
            # Vérifier les erreurs
            $logs = kubectl logs -n $Namespace $podName --tail=100 2>&1
            $errorCount = ($logs | Select-String -Pattern "error" -AllMatches).Matches.Count
            
            if ($errorCount -eq 0) {
                Write-Success "Aucune erreur dans les logs récents"
            }
            else {
                Write-Warning "$errorCount erreur(s) trouvée(s) dans les logs récents"
            }
        }
        else {
            Write-Failure "Aucun pod disponible pour vérifier les logs"
        }
    }
    catch {
        Write-Failure "Erreur lors de la vérification des logs: $_"
    }
}

# Vérifier les événements récents
function Test-Events {
    Write-Header "Vérification des Événements Récents"
    
    try {
        Write-Host "Événements des 5 dernières minutes:"
        Write-Host ""
        
        kubectl get events -n $Namespace --sort-by='.lastTimestamp' | Select-Object -Last 10
        Write-Host ""
        
        # Vérifier les événements d'erreur
        $warningEvents = kubectl get events -n $Namespace --field-selector type=Warning --sort-by='.lastTimestamp' 2>&1 | Select-Object -Last 5
        
        if (-not $warningEvents -or $warningEvents.Count -eq 0) {
            Write-Success "Aucun événement d'avertissement récent"
        }
        else {
            Write-Warning "Événements d'avertissement trouvés:"
            $warningEvents | Write-Host
        }
    }
    catch {
        Write-Warning "Erreur lors de la vérification des événements: $_"
    }
}

# Résumé final
function Write-Summary {
    Write-Header "Résumé de la Vérification"
    
    $total = $Script:Passed + $Script:Failed + $Script:Warnings
    
    Write-Host "✓ Réussi: " -NoNewline -ForegroundColor Green
    Write-Host $Script:Passed
    
    Write-Host "✗ Échoué: " -NoNewline -ForegroundColor Red
    Write-Host $Script:Failed
    
    Write-Host "⚠ Avertissements: " -NoNewline -ForegroundColor Yellow
    Write-Host $Script:Warnings
    
    Write-Host "Total: $total vérifications"
    Write-Host ""
    
    if ($Script:Failed -eq 0 -and $Script:Warnings -eq 0) {
        Write-Host "🎉 Tous les tests sont passés! Le déploiement est en bon état." -ForegroundColor Green
        exit 0
    }
    elseif ($Script:Failed -eq 0) {
        Write-Host "⚠ Déploiement fonctionnel avec quelques avertissements." -ForegroundColor Yellow
        exit 0
    }
    else {
        Write-Host "❌ Des problèmes ont été détectés. Consultez les erreurs ci-dessus." -ForegroundColor Red
        exit 1
    }
}

# Script principal
function Main {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║   Script de Vérification du Déploiement Kubernetes        ║" -ForegroundColor Blue
    Write-Host "║   Portfolio Next.js                                        ║" -ForegroundColor Blue
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
    
    if (-not (Test-Kubectl)) {
        exit 1
    }
    
    if (-not (Test-ClusterConnection)) {
        exit 1
    }
    
    Test-Namespace
    Test-Deployment
    Test-Pods
    Test-Service
    Test-Ingress
    Test-ConfigMap
    Test-Certificate
    Test-HealthEndpoint
    Test-Logs
    Test-Events
    
    Write-Summary
}

# Exécuter le script
Main
