# Rollback Test Execution Guide

## Prerequisites

Before running the rollback tests, ensure:

1. ✅ The application is currently deployed and healthy in Kubernetes
2. ✅ You have kubectl configured with access to the cluster
3. ✅ You have access to GitHub Actions workflows
4. ✅ You have Lens installed (optional, for visual monitoring)
5. ✅ You have the necessary permissions to push to the main branch

## Test Execution Steps

### Phase 1: Pre-Test Verification

1. **Verify Current Deployment Status**

```bash
cd monportfolio
chmod +x scripts/test-rollback.sh
./scripts/test-rollback.sh --auto
```

This will show:
- Current deployment status
- Pod health
- Deployment history
- Current image version

2. **Record Baseline Information**

Note the following for comparison:
- Current image tag: `kubectl get deployment portfolio -o jsonpath='{.spec.template.spec.containers[0].image}'`
- Current revision: `kubectl rollout history deployment/portfolio`
- Number of healthy pods: `kubectl get pods -l app=portfolio`

### Phase 2: Test Automatic Rollback

#### Step 1: Introduce Breaking Change

```bash
cd monportfolio
chmod +x scripts/introduce-breaking-change.sh
./scripts/introduce-breaking-change.sh
```

Select option 1 (Return 500 error) for the most predictable test.

#### Step 2: Commit and Push

```bash
git add app/api/health/route.ts
git commit -m "test: introduce breaking change for rollback testing"
git push origin main
```

#### Step 3: Monitor GitHub Actions

1. Go to GitHub Actions: `https://github.com/<your-repo>/actions`
2. Watch the "Deploy to Kubernetes" workflow
3. Observe:
   - ✅ Build and test job should pass (breaking change is in health endpoint, not build)
   - ✅ Docker build and push should succeed
   - ⚠️ Deploy to Kubernetes job should show issues

#### Step 4: Monitor Kubernetes Deployment

Open a terminal and run:

```bash
# Watch deployment status
watch kubectl get deployment portfolio

# In another terminal, watch pods
watch kubectl get pods -l app=portfolio

# In another terminal, watch events
watch "kubectl get events --sort-by='.lastTimestamp' | tail -20"
```

Or use the interactive script:

```bash
./scripts/test-rollback.sh
# Select option 1 to show current status
# Select option 2 to monitor rollout
# Select option 3 to check pod health
```

#### Step 5: Observe Automatic Rollback Behavior

Expected observations:

1. **New ReplicaSet Created**: New pods are created with the broken image
2. **Health Checks Fail**: Readiness probes fail on new pods
3. **No Traffic Routing**: New pods never become "Ready"
4. **Old Pods Remain**: Previous version continues serving traffic
5. **Timeout Occurs**: After progressDeadlineSeconds (default 600s), deployment fails
6. **Automatic Rollback**: Kubernetes scales down the new ReplicaSet

Verify with:

```bash
# Check ReplicaSets
kubectl get replicasets -l app=portfolio

# Check deployment status
kubectl describe deployment portfolio

# Check pod logs for health check failures
kubectl logs <new-pod-name>
```

#### Step 6: Verify Zero Downtime

During the entire process, the application should remain accessible:

```bash
# If you have an Ingress configured
curl -I https://your-domain.com

# Or port-forward to test
kubectl port-forward service/portfolio-service 8080:80
curl http://localhost:8080/api/health
```

The old version should continue responding successfully.

#### Step 7: Document Results

Record in `docs/ROLLBACK_TEST_PLAN.md`:
- ✅ Did new pods fail health checks?
- ✅ Did old pods continue serving traffic?
- ✅ Was there zero downtime?
- ✅ Did automatic rollback occur?
- ✅ What was the timeline (how long until rollback)?

### Phase 3: Test Manual Rollback

#### Step 1: Restore Health Check

```bash
./scripts/introduce-breaking-change.sh
# Select option 5 to restore from backup
```

#### Step 2: Commit and Deploy Fixed Version

```bash
git add app/api/health/route.ts
git commit -m "fix: restore health check endpoint"
git push origin main
```

Wait for deployment to complete successfully.

#### Step 3: Introduce Another Breaking Change

```bash
./scripts/introduce-breaking-change.sh
# Select option 2 (Throw exception)

git add app/api/health/route.ts
git commit -m "test: introduce second breaking change"
git push origin main
```

#### Step 4: Perform Manual Rollback via GitHub Actions

1. Go to GitHub Actions
2. Select "Rollback Deployment" workflow
3. Click "Run workflow"
4. Fill in:
   - **Version**: Previous working SHA (e.g., `sha-abc1234`) or revision number
   - **Rollback type**: Choose `image-tag` or `revision-number`
   - **Namespace**: `default` (or your namespace)
5. Click "Run workflow"

#### Step 5: Monitor Manual Rollback

```bash
./scripts/test-rollback.sh
# Select option 2 to monitor rollout
# Select option 8 to run full health check
```

#### Step 6: Verify Successful Rollback

```bash
# Check current image
kubectl get deployment portfolio -o jsonpath='{.spec.template.spec.containers[0].image}'

# Check pod health
kubectl get pods -l app=portfolio

# Test health endpoint
kubectl exec <pod-name> -- wget -q -O- http://localhost:3000/api/health
```

Expected results:
- ✅ Deployment shows previous image version
- ✅ All pods are Running and Ready
- ✅ Health checks pass
- ✅ Application is accessible

#### Step 7: Test Manual Rollback via kubectl

```bash
# View deployment history
kubectl rollout history deployment/portfolio

# Rollback to previous revision
kubectl rollout undo deployment/portfolio

# Monitor rollback
kubectl rollout status deployment/portfolio

# Verify
./scripts/test-rollback.sh --auto
```

### Phase 4: Cleanup and Final Verification

#### Step 1: Restore to Stable State

```bash
./scripts/introduce-breaking-change.sh
# Select option 5 to restore from backup

git add app/api/health/route.ts
git commit -m "fix: restore health check to stable state"
git push origin main
```

#### Step 2: Verify Final Deployment

```bash
./scripts/test-rollback.sh --auto
```

Ensure:
- ✅ Deployment is healthy
- ✅ All pods are Running and Ready
- ✅ Health checks pass
- ✅ Application is accessible

#### Step 3: Clean Up Test Artifacts

```bash
# Remove backup file
rm app/api/health/route.ts.backup

# Commit cleanup
git add app/api/health/route.ts.backup
git commit -m "chore: clean up rollback test artifacts"
git push origin main
```

## Validation Checklist

### Automatic Rollback (Requirement 3.5, 7.1)
- [ ] New deployment with failing health checks was created
- [ ] Health check failures were detected by Kubernetes
- [ ] New pods never became Ready
- [ ] Old pods continued serving traffic
- [ ] Zero downtime was maintained
- [ ] Automatic rollback occurred after timeout
- [ ] Application returned to stable state

### Manual Rollback via Workflow (Requirement 7.2, 7.3)
- [ ] Rollback workflow can be triggered manually
- [ ] Specific versions can be targeted
- [ ] Rollback completes successfully
- [ ] Zero downtime during rollback
- [ ] Application returns to stable state
- [ ] Health checks pass after rollback

### Manual Rollback via kubectl (Requirement 7.4)
- [ ] kubectl rollback commands work
- [ ] Deployment history is visible
- [ ] Rollback to previous revision succeeds
- [ ] Application functions correctly after rollback

### Zero Downtime (Requirement 7.3)
- [ ] Application remained accessible during automatic rollback
- [ ] Application remained accessible during manual rollback
- [ ] No 503 or connection errors observed
- [ ] Traffic continued to be served throughout

### Deployment History (Requirement 7.5)
- [ ] Deployment history shows all revisions
- [ ] Timestamps are recorded
- [ ] Can view details of specific revisions
- [ ] History is accessible via kubectl and Lens

## Troubleshooting

### Issue: Automatic Rollback Not Occurring

**Check**:
```bash
kubectl describe deployment portfolio
```

Look for:
- `progressDeadlineSeconds` setting
- Deployment conditions
- ReplicaSet status

**Solution**: Verify deployment.yaml has correct rollback configuration:
```yaml
spec:
  progressDeadlineSeconds: 600
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

### Issue: Health Checks Not Failing

**Check**:
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

**Solution**: Verify the breaking change was actually deployed:
```bash
kubectl get deployment portfolio -o jsonpath='{.spec.template.spec.containers[0].image}'
```

### Issue: Manual Rollback Fails

**Check**:
```bash
kubectl rollout history deployment/portfolio
```

**Solution**: Ensure the target revision exists and use correct revision number.

## Success Criteria Summary

All tests pass if:

1. ✅ Automatic rollback prevents broken deployments from receiving traffic
2. ✅ Manual rollback workflows function correctly
3. ✅ Zero downtime is maintained throughout all rollback scenarios
4. ✅ Application returns to stable state after rollback
5. ✅ Deployment history is maintained and accessible

## References

- Requirements: 3.5, 7.1, 7.2, 7.3, 7.4, 7.5
- Design Document: Error Handling and Rollback Procedures
- Test Plan: docs/ROLLBACK_TEST_PLAN.md
- Deployment Documentation: docs/DEPLOYMENT.md
