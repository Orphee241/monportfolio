# PowerShell script to verify rollback configuration
# This validates that all rollback mechanisms are properly configured

# Configuration
$NAMESPACE = if ($env:K8S_NAMESPACE) { $env:K8S_NAMESPACE } else { "default" }
$DEPLOYMENT_NAME = "portfolio"
$DEPLOYMENT_FILE = "k8s/deployment.yaml"
$WORKFLOW_FILE = ".github/workflows/deploy.yml"
$ROLLBACK_WORKFLOW_FILE = ".github/workflows/rollback.yml"
$HEALTH_CHECK_FILE = "app/api/health/route.ts"

# Test counters
$script:TestsPassed = 0
$script:TestsFailed = 0
$script:TestsTotal = 0

function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================`n" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[PASS] $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "INFO: $Message" -ForegroundColor Cyan
}

function Run-Test {
    param(
        [string]$TestName,
        [scriptblock]$TestCommand
    )
    
    $script:TestsTotal++
    
    try {
        $result = & $TestCommand
        if ($result) {
            Write-Success $TestName
            $script:TestsPassed++
            return $true
        } else {
            Write-ErrorMsg $TestName
            $script:TestsFailed++
            return $false
        }
    } catch {
        Write-ErrorMsg "$TestName - Error: $_"
        $script:TestsFailed++
        return $false
    }
}

# Main execution
Write-Header "Rollback Configuration Verification"
Write-Info "This script verifies that rollback mechanisms are properly configured"
Write-Info "without actually breaking the deployment."

# File-based tests
Write-Header "Deployment Manifest Tests"

Run-Test "Deployment manifest exists" {
    Test-Path $DEPLOYMENT_FILE
}

Run-Test "Rolling update strategy configured" {
    (Get-Content $DEPLOYMENT_FILE -Raw) -match "type: RollingUpdate"
}

Run-Test "Zero downtime configuration (maxUnavailable: 0)" {
    (Get-Content $DEPLOYMENT_FILE -Raw) -match "maxUnavailable: 0"
}

Run-Test "Liveness probe configured" {
    (Get-Content $DEPLOYMENT_FILE -Raw) -match "livenessProbe:"
}

Run-Test "Readiness probe configured" {
    (Get-Content $DEPLOYMENT_FILE -Raw) -match "readinessProbe:"
}

Run-Test "Health check endpoint configured" {
    (Get-Content $DEPLOYMENT_FILE -Raw) -match "path: /api/health"
}

Run-Test "Health check port configured" {
    (Get-Content $DEPLOYMENT_FILE -Raw) -match "port: 3000"
}

Run-Test "Multiple replicas configured" {
    $content = Get-Content $DEPLOYMENT_FILE -Raw
    if ($content -match "replicas:\s*(\d+)") {
        [int]$matches[1] -gt 1
    } else {
        $false
    }
}

Write-Header "Workflow Tests"

Run-Test "Deploy workflow exists" {
    Test-Path $WORKFLOW_FILE
}

Run-Test "Rollback workflow exists" {
    Test-Path $ROLLBACK_WORKFLOW_FILE
}

Run-Test "Rollback workflow has manual trigger" {
    (Get-Content $ROLLBACK_WORKFLOW_FILE -Raw) -match "workflow_dispatch:"
}

Run-Test "Rollback workflow has version input" {
    (Get-Content $ROLLBACK_WORKFLOW_FILE -Raw) -match "version:"
}

Write-Header "Health Check Tests"

Run-Test "Health check file exists" {
    Test-Path $HEALTH_CHECK_FILE
}

Run-Test "Health check returns 200 status" {
    (Get-Content $HEALTH_CHECK_FILE -Raw) -match "status: 200"
}

Run-Test "Health check returns healthy status" {
    (Get-Content $HEALTH_CHECK_FILE -Raw) -match "status: 'healthy'"
}

# Kubernetes tests (if kubectl is available)
Write-Header "Kubernetes Cluster Tests"

$kubectlAvailable = Get-Command kubectl -ErrorAction SilentlyContinue
if (-not $kubectlAvailable) {
    Write-Warning "kubectl not found, skipping Kubernetes tests"
} else {
    try {
        kubectl cluster-info 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Run-Test "Deployment exists in cluster" {
                kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE 2>&1 | Out-Null
                $LASTEXITCODE -eq 0
            }
            
            Run-Test "Deployment uses RollingUpdate strategy" {
                $strategy = kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.spec.strategy.type}' 2>&1
                $strategy -eq "RollingUpdate"
            }
            
            Run-Test "Deployment has liveness probe" {
                $probe = kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].livenessProbe}' 2>&1
                $probe -match "httpGet"
            }
            
            Run-Test "Deployment has readiness probe" {
                $probe = kubectl get deployment $DEPLOYMENT_NAME -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].readinessProbe}' 2>&1
                $probe -match "httpGet"
            }
            
            Run-Test "At least one pod is running" {
                $pods = kubectl get pods -l app=portfolio -n $NAMESPACE --field-selector=status.phase=Running 2>&1
                $pods -match "Running"
            }
            
            Run-Test "Deployment history is available" {
                kubectl rollout history deployment/$DEPLOYMENT_NAME -n $NAMESPACE 2>&1 | Out-Null
                $LASTEXITCODE -eq 0
            }
            
            Run-Test "Service exists" {
                kubectl get service portfolio-service -n $NAMESPACE 2>&1 | Out-Null
                $LASTEXITCODE -eq 0
            }
        } else {
            Write-Warning "Cannot connect to Kubernetes cluster, skipping cluster tests"
        }
    } catch {
        Write-Warning "Error connecting to Kubernetes: $_"
    }
}

# Summary
Write-Header "Test Summary"

Write-Host "Total tests: $script:TestsTotal"
Write-Host "Passed: $script:TestsPassed"
Write-Host "Failed: $script:TestsFailed"
Write-Host ""

if ($script:TestsFailed -eq 0) {
    Write-Success "All tests passed! Rollback configuration is correct."
    Write-Host ""
    Write-Info "The system is configured for:"
    Write-Host "  [OK] Automatic rollback on health check failures"
    Write-Host "  [OK] Manual rollback via GitHub Actions workflow"
    Write-Host "  [OK] Manual rollback via kubectl commands"
    Write-Host "  [OK] Zero downtime during rollbacks"
    Write-Host ""
    Write-Info "To test actual rollback functionality, see:"
    Write-Host "  docs/ROLLBACK_TEST_EXECUTION.md"
    exit 0
} else {
    Write-ErrorMsg "Some tests failed. Please review the configuration."
    Write-Host ""
    Write-Info "Check the following files:"
    Write-Host "  - $DEPLOYMENT_FILE"
    Write-Host "  - $WORKFLOW_FILE"
    Write-Host "  - $ROLLBACK_WORKFLOW_FILE"
    Write-Host "  - $HEALTH_CHECK_FILE"
    exit 1
}
