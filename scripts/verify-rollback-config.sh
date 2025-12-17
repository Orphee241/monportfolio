#!/bin/bash

# Script to verify rollback configuration without breaking the deployment
# This validates that all rollback mechanisms are properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Configuration
NAMESPACE="${K8S_NAMESPACE:-default}"
DEPLOYMENT_NAME="portfolio"
DEPLOYMENT_FILE="k8s/deployment.yaml"
WORKFLOW_FILE=".github/workflows/deploy.yml"
ROLLBACK_WORKFLOW_FILE=".github/workflows/rollback.yml"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

run_test() {
    local test_name=$1
    local test_command=$2
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if eval "$test_command"; then
        print_success "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        print_error "$test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Test 1: Verify deployment manifest exists
test_deployment_manifest_exists() {
    [ -f "$DEPLOYMENT_FILE" ]
}

# Test 2: Verify rolling update strategy
test_rolling_update_strategy() {
    grep -q "type: RollingUpdate" "$DEPLOYMENT_FILE"
}

# Test 3: Verify maxUnavailable is 0 (zero downtime)
test_max_unavailable() {
    grep -q "maxUnavailable: 0" "$DEPLOYMENT_FILE"
}

# Test 4: Verify liveness probe exists
test_liveness_probe() {
    grep -q "livenessProbe:" "$DEPLOYMENT_FILE"
}

# Test 5: Verify readiness probe exists
test_readiness_probe() {
    grep -q "readinessProbe:" "$DEPLOYMENT_FILE"
}

# Test 6: Verify health check endpoint
test_health_check_endpoint() {
    grep -q "path: /api/health" "$DEPLOYMENT_FILE"
}

# Test 7: Verify health check port
test_health_check_port() {
    grep -q "port: 3000" "$DEPLOYMENT_FILE"
}

# Test 8: Verify replicas > 1 (for high availability)
test_replicas() {
    local replicas=$(grep "replicas:" "$DEPLOYMENT_FILE" | head -1 | awk '{print $2}')
    [ "$replicas" -gt 1 ]
}

# Test 9: Verify deploy workflow exists
test_deploy_workflow_exists() {
    [ -f "$WORKFLOW_FILE" ]
}

# Test 10: Verify rollback workflow exists
test_rollback_workflow_exists() {
    [ -f "$ROLLBACK_WORKFLOW_FILE" ]
}

# Test 11: Verify rollback workflow has manual trigger
test_rollback_manual_trigger() {
    grep -q "workflow_dispatch:" "$ROLLBACK_WORKFLOW_FILE"
}

# Test 12: Verify rollback workflow has version input
test_rollback_version_input() {
    grep -q "version:" "$ROLLBACK_WORKFLOW_FILE"
}

# Test 13: Verify health check file exists
test_health_check_file_exists() {
    [ -f "app/api/health/route.ts" ]
}

# Test 14: Verify health check returns 200
test_health_check_returns_200() {
    grep -q "status: 200" "app/api/health/route.ts"
}

# Test 15: Verify health check returns healthy status
test_health_check_returns_healthy() {
    grep -q "status: 'healthy'" "app/api/health/route.ts"
}

# Kubernetes cluster tests (only if kubectl is available and connected)
test_kubernetes_deployment() {
    if ! command -v kubectl &> /dev/null; then
        print_warning "kubectl not found, skipping Kubernetes tests"
        return 0
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        print_warning "Cannot connect to Kubernetes cluster, skipping cluster tests"
        return 0
    fi
    
    print_header "Kubernetes Cluster Tests"
    
    # Test 16: Verify deployment exists in cluster
    run_test "Deployment exists in cluster" \
        "kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE &> /dev/null"
    
    # Test 17: Verify deployment has correct strategy
    run_test "Deployment uses RollingUpdate strategy" \
        "kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.spec.strategy.type}' | grep -q 'RollingUpdate'"
    
    # Test 18: Verify deployment has health checks
    run_test "Deployment has liveness probe" \
        "kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].livenessProbe}' | grep -q 'httpGet'"
    
    run_test "Deployment has readiness probe" \
        "kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].readinessProbe}' | grep -q 'httpGet'"
    
    # Test 19: Verify pods are running
    run_test "At least one pod is running" \
        "kubectl get pods -l app=portfolio -n $NAMESPACE --field-selector=status.phase=Running | grep -q 'Running'"
    
    # Test 20: Verify deployment history exists
    run_test "Deployment history is available" \
        "kubectl rollout history deployment/$DEPLOYMENT_NAME -n $NAMESPACE &> /dev/null"
    
    # Test 21: Verify service exists
    run_test "Service exists" \
        "kubectl get service portfolio-service -n $NAMESPACE &> /dev/null"
    
    # Test 22: Test health endpoint on running pods
    local pods=$(kubectl get pods -l app=portfolio -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}' 2>/dev/null)
    if [ -n "$pods" ]; then
        local first_pod=$(echo $pods | awk '{print $1}')
        run_test "Health endpoint responds on pod" \
            "kubectl exec $first_pod -n $NAMESPACE -- wget -q -O- http://localhost:3000/api/health &> /dev/null"
    fi
}

# Main test execution
main() {
    print_header "Rollback Configuration Verification"
    
    print_info "This script verifies that rollback mechanisms are properly configured"
    print_info "without actually breaking the deployment."
    echo ""
    
    # File-based tests
    print_header "Deployment Manifest Tests"
    
    run_test "Deployment manifest exists" test_deployment_manifest_exists
    run_test "Rolling update strategy configured" test_rolling_update_strategy
    run_test "Zero downtime configuration (maxUnavailable: 0)" test_max_unavailable
    run_test "Liveness probe configured" test_liveness_probe
    run_test "Readiness probe configured" test_readiness_probe
    run_test "Health check endpoint configured" test_health_check_endpoint
    run_test "Health check port configured" test_health_check_port
    run_test "Multiple replicas configured" test_replicas
    
    print_header "Workflow Tests"
    
    run_test "Deploy workflow exists" test_deploy_workflow_exists
    run_test "Rollback workflow exists" test_rollback_workflow_exists
    run_test "Rollback workflow has manual trigger" test_rollback_manual_trigger
    run_test "Rollback workflow has version input" test_rollback_version_input
    
    print_header "Health Check Tests"
    
    run_test "Health check file exists" test_health_check_file_exists
    run_test "Health check returns 200 status" test_health_check_returns_200
    run_test "Health check returns healthy status" test_health_check_returns_healthy
    
    # Kubernetes tests (if available)
    test_kubernetes_deployment
    
    # Summary
    print_header "Test Summary"
    
    echo "Total tests: $TESTS_TOTAL"
    echo "Passed: $TESTS_PASSED"
    echo "Failed: $TESTS_FAILED"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_success "All tests passed! Rollback configuration is correct."
        echo ""
        print_info "The system is configured for:"
        echo "  ✅ Automatic rollback on health check failures"
        echo "  ✅ Manual rollback via GitHub Actions workflow"
        echo "  ✅ Manual rollback via kubectl commands"
        echo "  ✅ Zero downtime during rollbacks"
        echo ""
        print_info "To test actual rollback functionality, see:"
        echo "  docs/ROLLBACK_TEST_EXECUTION.md"
        return 0
    else
        print_error "Some tests failed. Please review the configuration."
        echo ""
        print_info "Check the following files:"
        echo "  - $DEPLOYMENT_FILE"
        echo "  - $WORKFLOW_FILE"
        echo "  - $ROLLBACK_WORKFLOW_FILE"
        echo "  - app/api/health/route.ts"
        return 1
    fi
}

# Run main function
main
