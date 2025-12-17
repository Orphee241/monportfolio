#!/bin/bash

# Rollback Functionality Test Script
# This script helps test the rollback functionality of the Kubernetes deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="${K8S_NAMESPACE:-default}"
DEPLOYMENT_NAME="portfolio"
APP_LABEL="app=portfolio"

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl not found. Please install kubectl."
        exit 1
    fi
    print_success "kubectl is installed"
    
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster. Check your kubeconfig."
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
    
    if ! kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE &> /dev/null; then
        print_error "Deployment '$DEPLOYMENT_NAME' not found in namespace '$NAMESPACE'"
        exit 1
    fi
    print_success "Deployment '$DEPLOYMENT_NAME' found"
}

# Display current status
show_current_status() {
    print_header "Current Deployment Status"
    
    echo "Deployment:"
    kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE
    
    echo -e "\nPods:"
    kubectl get pods -l $APP_LABEL -n $NAMESPACE
    
    echo -e "\nDeployment History:"
    kubectl rollout history deployment/$DEPLOYMENT_NAME -n $NAMESPACE
    
    echo -e "\nReplicaSets:"
    kubectl get replicasets -l $APP_LABEL -n $NAMESPACE
    
    echo -e "\nCurrent Image:"
    kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].image}'
    echo ""
}

# Monitor deployment rollout
monitor_rollout() {
    print_header "Monitoring Deployment Rollout"
    
    print_info "Watching rollout status (timeout: 5 minutes)..."
    if kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE --timeout=5m; then
        print_success "Rollout completed successfully"
        return 0
    else
        print_error "Rollout failed or timed out"
        return 1
    fi
}

# Check pod health
check_pod_health() {
    print_header "Checking Pod Health"
    
    local pods=$(kubectl get pods -l $APP_LABEL -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')
    
    if [ -z "$pods" ]; then
        print_error "No pods found"
        return 1
    fi
    
    local all_healthy=true
    
    for pod in $pods; do
        local ready=$(kubectl get pod $pod -n $NAMESPACE -o jsonpath='{.status.conditions[?(@.type=="Ready")].status}')
        local phase=$(kubectl get pod $pod -n $NAMESPACE -o jsonpath='{.status.phase}')
        
        echo -e "\nPod: $pod"
        echo "  Phase: $phase"
        echo "  Ready: $ready"
        
        if [ "$ready" != "True" ] || [ "$phase" != "Running" ]; then
            print_warning "Pod $pod is not healthy"
            all_healthy=false
            
            echo -e "\n  Recent events:"
            kubectl get events -n $NAMESPACE --field-selector involvedObject.name=$pod --sort-by='.lastTimestamp' | tail -5
            
            echo -e "\n  Container status:"
            kubectl get pod $pod -n $NAMESPACE -o jsonpath='{.status.containerStatuses[*]}' | jq '.'
        else
            print_success "Pod $pod is healthy"
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        print_success "All pods are healthy"
        return 0
    else
        print_error "Some pods are not healthy"
        return 1
    fi
}

# Test health endpoint
test_health_endpoint() {
    print_header "Testing Health Endpoint"
    
    local pods=$(kubectl get pods -l $APP_LABEL -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}')
    
    for pod in $pods; do
        echo -e "\nTesting pod: $pod"
        
        if kubectl exec $pod -n $NAMESPACE -- wget -q -O- http://localhost:3000/api/health 2>/dev/null; then
            print_success "Health endpoint responding on $pod"
        else
            print_error "Health endpoint not responding on $pod"
        fi
    done
}

# Perform manual rollback
manual_rollback() {
    print_header "Performing Manual Rollback"
    
    local revision=$1
    
    if [ -z "$revision" ]; then
        print_info "Rolling back to previous revision..."
        kubectl rollout undo deployment/$DEPLOYMENT_NAME -n $NAMESPACE
    else
        print_info "Rolling back to revision $revision..."
        kubectl rollout undo deployment/$DEPLOYMENT_NAME -n $NAMESPACE --to-revision=$revision
    fi
    
    monitor_rollout
}

# Watch deployment events
watch_events() {
    print_header "Recent Deployment Events"
    
    kubectl get events -n $NAMESPACE \
        --field-selector involvedObject.name=$DEPLOYMENT_NAME \
        --sort-by='.lastTimestamp' \
        | tail -20
}

# Main menu
show_menu() {
    echo -e "\n${BLUE}Rollback Test Menu${NC}"
    echo "1. Show current status"
    echo "2. Monitor rollout"
    echo "3. Check pod health"
    echo "4. Test health endpoint"
    echo "5. Perform manual rollback (previous revision)"
    echo "6. Perform manual rollback (specific revision)"
    echo "7. Watch deployment events"
    echo "8. Run full health check"
    echo "9. Exit"
    echo -n "Select option: "
}

# Full health check
full_health_check() {
    print_header "Running Full Health Check"
    
    show_current_status
    
    if check_pod_health; then
        test_health_endpoint
        print_success "Full health check passed"
        return 0
    else
        print_error "Full health check failed"
        return 1
    fi
}

# Main script
main() {
    print_header "Kubernetes Rollback Test Script"
    
    check_prerequisites
    
    if [ "$1" = "--auto" ]; then
        # Automated test mode
        show_current_status
        full_health_check
        exit 0
    fi
    
    # Interactive mode
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1) show_current_status ;;
            2) monitor_rollout ;;
            3) check_pod_health ;;
            4) test_health_endpoint ;;
            5) manual_rollback ;;
            6)
                echo -n "Enter revision number: "
                read -r revision
                manual_rollback "$revision"
                ;;
            7) watch_events ;;
            8) full_health_check ;;
            9)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid option"
                ;;
        esac
    done
}

# Run main function
main "$@"
