# Rollback Testing Scripts

This directory contains scripts for testing the Kubernetes rollback functionality.

## Scripts Overview

### `verify-rollback-config.sh` (Bash)
**Purpose**: Verify rollback configuration without breaking the deployment

**Usage**:
```bash
bash scripts/verify-rollback-config.sh
```

**What it does**:
- Validates deployment manifest configuration
- Checks workflow files
- Verifies health check endpoint
- Tests Kubernetes cluster configuration (if connected)
- Runs 22 comprehensive tests

**When to use**: Before testing rollback functionality to ensure everything is configured correctly.

---

### `verify-rollback-config.ps1` (PowerShell)
**Purpose**: Windows-compatible version of the verification script

**Usage**:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-rollback-config.ps1
```

**What it does**: Same as the bash version, but runs on Windows PowerShell

**When to use**: On Windows systems where bash is not available.

---

### `test-rollback.sh` (Bash)
**Purpose**: Interactive tool for monitoring and testing rollback functionality

**Usage**:
```bash
# Interactive mode
bash scripts/test-rollback.sh

# Automated health check
bash scripts/test-rollback.sh --auto
```

**Features**:
1. Show current deployment status
2. Monitor rollout progress
3. Check pod health
4. Test health endpoint
5. Perform manual rollback (previous revision)
6. Perform manual rollback (specific revision)
7. Watch deployment events
8. Run full health check

**When to use**: During rollback testing to monitor the deployment and perform manual rollbacks.

---

### `introduce-breaking-change.sh` (Bash)
**Purpose**: Introduce controlled breaking changes for rollback testing

**Usage**:
```bash
bash scripts/introduce-breaking-change.sh
```

**Options**:
1. Return 500 error (health check fails)
2. Throw exception (application crash)
3. Return invalid JSON
4. Infinite loop (timeout)
5. Restore from backup

**What it does**:
- Creates a backup of the current health check
- Modifies the health check endpoint to fail
- Provides instructions for testing
- Can restore the original health check

**When to use**: When you want to test automatic rollback by introducing a failing deployment.

**⚠️ Warning**: This will break your health check endpoint. Always restore after testing!

---

## Testing Workflow

### 1. Verify Configuration
```bash
# Run verification script
bash scripts/verify-rollback-config.sh
```

Expected: All file-based tests should pass (15/15)

### 2. Test Automatic Rollback

```bash
# Step 1: Introduce breaking change
bash scripts/introduce-breaking-change.sh
# Select option 1

# Step 2: Commit and push
git add app/api/health/route.ts
git commit -m "test: introduce breaking change"
git push origin main

# Step 3: Monitor rollback
bash scripts/test-rollback.sh
# Select option 2 (Monitor rollout)
# Select option 3 (Check pod health)
```

### 3. Test Manual Rollback

```bash
# Option A: Via script
bash scripts/test-rollback.sh
# Select option 5 (Rollback to previous revision)

# Option B: Via kubectl
kubectl rollout undo deployment/portfolio
kubectl rollout status deployment/portfolio
```

### 4. Restore Health Check

```bash
bash scripts/introduce-breaking-change.sh
# Select option 5 (Restore from backup)

git add app/api/health/route.ts
git commit -m "fix: restore health check"
git push origin main
```

## Prerequisites

### For All Scripts
- Git repository with the portfolio application
- Access to the monportfolio directory

### For Kubernetes Tests
- kubectl installed and configured
- Access to Kubernetes cluster
- Deployment already running in cluster

### For Breaking Change Tests
- Write access to the repository
- Ability to push to main branch
- GitHub Actions configured

## Troubleshooting

### Script Won't Execute (Permission Denied)
```bash
chmod +x scripts/*.sh
```

### kubectl Not Found
Install kubectl:
- **Windows**: `choco install kubernetes-cli`
- **Mac**: `brew install kubectl`
- **Linux**: Follow [official docs](https://kubernetes.io/docs/tasks/tools/)

### Cannot Connect to Cluster
Verify kubeconfig:
```bash
kubectl cluster-info
kubectl config view
```

### Health Check Not Failing
Verify the breaking change was deployed:
```bash
kubectl get deployment portfolio -o jsonpath='{.spec.template.spec.containers[0].image}'
kubectl logs <pod-name>
```

## Documentation

For detailed testing procedures, see:
- `docs/ROLLBACK_TEST_PLAN.md` - Comprehensive test plan
- `docs/ROLLBACK_TEST_EXECUTION.md` - Step-by-step execution guide
- `docs/ROLLBACK_TEST_SUMMARY.md` - Summary and results

## Safety Notes

⚠️ **Important**:
- Always test in a non-production environment first
- Keep backups of working configurations
- Restore health check after testing
- Monitor the deployment during tests
- Have a rollback plan ready

✅ **Best Practices**:
- Run verification script before testing
- Document test results
- Test one scenario at a time
- Verify zero downtime during rollbacks
- Clean up after testing

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the documentation in `docs/`
3. Verify your Kubernetes cluster is accessible
4. Check GitHub Actions logs for deployment issues
