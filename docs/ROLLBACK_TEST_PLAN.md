# Rollback Functionality Test Plan

## Overview

This document outlines the test plan for verifying the rollback functionality of the Kubernetes CI/CD deployment system. The tests validate both automatic rollback (triggered by health check failures) and manual rollback workflows.

## Test Scenarios

### Scenario 1: Automatic Rollback on Health Check Failure

**Objective**: Verify that Kubernetes automatically rolls back to the previous version when the new deployment fails health checks.

**Steps**:
1. Ensure the application is currently deployed and healthy
2. Introduce a breaking change that causes the health check endpoint to fail
3. Commit and push the breaking change to trigger deployment
4. Observe the deployment process in GitHub Actions
5. Monitor the Kubernetes deployment via kubectl or Lens
6. Verify that after health check failures, Kubernetes automatically rolls back
7. Confirm the application returns to the previous stable state

**Expected Results**:
- New pods fail readiness/liveness probes
- Kubernetes does not route traffic to failing pods
- After timeout (progressDeadlineSeconds), deployment is marked as failed
- Previous ReplicaSet is scaled back up automatically
- Application continues serving traffic from stable version
- Zero downtime during the rollback process

### Scenario 2: Manual Rollback via Workflow

**Objective**: Verify that the manual rollback workflow can successfully revert to a previous version.

**Steps**:
1. Note the current deployment version/revision
2. Trigger the manual rollback workflow from GitHub Actions
3. Specify a previous version (image tag or revision number)
4. Monitor the rollback process
5. Verify the deployment updates to the specified version
6. Confirm all pods are running and healthy
7. Verify the application is accessible and functioning

**Expected Results**:
- Rollback workflow executes successfully
- Deployment updates to the specified version
- Rolling update maintains zero downtime
- All pods pass health checks
- Application serves traffic from the rolled-back version

### Scenario 3: Manual Rollback via kubectl

**Objective**: Verify that manual rollback can be performed directly via kubectl commands.

**Steps**:
1. View deployment history: `kubectl rollout history deployment/portfolio`
2. Execute rollback: `kubectl rollout undo deployment/portfolio`
3. Monitor rollout status: `kubectl rollout status deployment/portfolio`
4. Verify pod status and health
5. Confirm application functionality

**Expected Results**:
- kubectl commands execute successfully
- Deployment rolls back to previous revision
- Pods are healthy and ready
- Application functions correctly

## Breaking Changes for Testing

### Option 1: Break Health Check Endpoint

Modify `app/api/health/route.ts` to return an error:

```typescript
export async function GET() {
  // Simulate a failing health check
  return NextResponse.json(
    { status: 'unhealthy', error: 'Simulated failure' },
    { status: 500 }
  );
}
```

### Option 2: Introduce Application Crash

Modify `app/api/health/route.ts` to throw an error:

```typescript
export async function GET() {
  throw new Error('Simulated application crash');
}
```

### Option 3: Break Container Startup

Modify `Dockerfile` to use an invalid command or missing dependency.

## Monitoring Commands

### Check Deployment Status
```bash
kubectl get deployment portfolio
kubectl describe deployment portfolio
kubectl rollout status deployment/portfolio
```

### Check Pod Status
```bash
kubectl get pods -l app=portfolio
kubectl describe pods -l app=portfolio
kubectl logs <pod-name>
```

### View Deployment History
```bash
kubectl rollout history deployment/portfolio
kubectl rollout history deployment/portfolio --revision=<number>
```

### Check ReplicaSets
```bash
kubectl get replicasets -l app=portfolio
```

### Monitor Events
```bash
kubectl get events --sort-by='.lastTimestamp' | grep portfolio
```

## Success Criteria

### Automatic Rollback
- ✅ New deployment with failing health checks does not receive traffic
- ✅ Kubernetes automatically reverts to previous version after timeout
- ✅ Zero downtime during rollback process
- ✅ Previous version continues serving traffic
- ✅ Deployment status reflects the failure and rollback

### Manual Rollback
- ✅ Rollback workflow can be triggered manually
- ✅ Specific versions can be targeted for rollback
- ✅ Rollback completes successfully with zero downtime
- ✅ Application returns to stable state
- ✅ Health checks pass after rollback

## Test Execution Log

### Test Run 1: [Date/Time]

**Scenario**: Automatic Rollback on Health Check Failure

**Current Version**: [Record current version]

**Breaking Change**: [Describe the change introduced]

**Observations**:
- [ ] Deployment triggered successfully
- [ ] New pods created
- [ ] Health checks failed as expected
- [ ] Kubernetes initiated automatic rollback
- [ ] Previous version restored
- [ ] Zero downtime maintained
- [ ] Application accessible throughout

**Result**: ✅ PASS / ❌ FAIL

**Notes**: [Any additional observations]

---

### Test Run 2: [Date/Time]

**Scenario**: Manual Rollback via Workflow

**Current Version**: [Record current version]

**Target Version**: [Version to rollback to]

**Observations**:
- [ ] Workflow triggered successfully
- [ ] Rollback initiated
- [ ] Deployment updated to target version
- [ ] Pods healthy and ready
- [ ] Application functioning correctly

**Result**: ✅ PASS / ❌ FAIL

**Notes**: [Any additional observations]

---

### Test Run 3: [Date/Time]

**Scenario**: Manual Rollback via kubectl

**Current Version**: [Record current version]

**Observations**:
- [ ] Rollback command executed
- [ ] Deployment reverted to previous revision
- [ ] Pods healthy and ready
- [ ] Application functioning correctly

**Result**: ✅ PASS / ❌ FAIL

**Notes**: [Any additional observations]

## Troubleshooting

### Issue: Rollback Not Triggering Automatically

**Possible Causes**:
- Health check configuration incorrect
- progressDeadlineSeconds too long
- minReadySeconds not configured

**Solutions**:
- Verify liveness and readiness probe configuration
- Check deployment strategy settings
- Review Kubernetes events for details

### Issue: Manual Rollback Fails

**Possible Causes**:
- Invalid version/revision specified
- Insufficient permissions
- Kubeconfig not configured correctly

**Solutions**:
- Verify version exists in deployment history
- Check RBAC permissions
- Validate kubeconfig credentials

### Issue: Pods Not Becoming Ready After Rollback

**Possible Causes**:
- Image pull errors
- Resource constraints
- Configuration issues

**Solutions**:
- Check pod logs: `kubectl logs <pod-name>`
- Verify image exists in registry
- Check resource availability in cluster
- Review ConfigMap and Secret configurations

## Cleanup

After testing, ensure the application is in a stable state:

1. Verify current deployment is healthy
2. Remove any test branches or commits if needed
3. Document test results
4. Update deployment documentation with findings

## References

- Requirements: 3.5, 7.1, 7.2, 7.3, 7.4, 7.5
- Design Document: Rollback Procedures section
- Deployment Documentation: docs/DEPLOYMENT.md
