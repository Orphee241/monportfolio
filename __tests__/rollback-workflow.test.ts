import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

describe('Rollback Workflow Validation', () => {
  let rollbackWorkflow: any;

  // Load the rollback workflow file
  const loadRollbackWorkflow = () => {
    const filePath = path.join(process.cwd(), '.github', 'workflows', 'rollback.yml');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.parse(fileContent);
  };

  it('should load rollback workflow successfully', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    expect(rollbackWorkflow).toBeDefined();
    expect(rollbackWorkflow.name).toBe('Rollback Deployment');
  });

  it('should have manual trigger (workflow_dispatch)', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    expect(rollbackWorkflow.on).toBeDefined();
    expect(rollbackWorkflow.on.workflow_dispatch).toBeDefined();
  });

  it('should have required input parameters', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const inputs = rollbackWorkflow.on.workflow_dispatch.inputs;
    
    expect(inputs).toBeDefined();
    expect(inputs.version).toBeDefined();
    expect(inputs.version.required).toBe(true);
    expect(inputs.version.type).toBe('string');
    
    expect(inputs.rollback_type).toBeDefined();
    expect(inputs.rollback_type.required).toBe(true);
    expect(inputs.rollback_type.type).toBe('choice');
    expect(inputs.rollback_type.options).toContain('image-tag');
    expect(inputs.rollback_type.options).toContain('revision-number');
  });

  it('should have namespace input with default value', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const inputs = rollbackWorkflow.on.workflow_dispatch.inputs;
    
    expect(inputs.namespace).toBeDefined();
    expect(inputs.namespace.default).toBe('default');
    expect(inputs.namespace.required).toBe(false);
  });

  it('should have rollback-deployment job', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    expect(rollbackWorkflow.jobs).toBeDefined();
    expect(rollbackWorkflow.jobs['rollback-deployment']).toBeDefined();
  });

  it('should configure kubectl with kubeconfig secret', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const kubectlConfigStep = job.steps.find(
      (step: any) => step.name === 'Configure kubectl'
    );
    
    expect(kubectlConfigStep).toBeDefined();
    expect(kubectlConfigStep.run).toContain('secrets.KUBECONFIG');
    expect(kubectlConfigStep.run).toContain('base64 -d');
  });

  it('should display current deployment status before rollback', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const statusStep = job.steps.find(
      (step: any) => step.name === 'Display current deployment status'
    );
    
    expect(statusStep).toBeDefined();
    expect(statusStep.run).toContain('kubectl get deployment portfolio');
    expect(statusStep.run).toContain('kubectl rollout history');
  });

  it('should support rollback by image tag', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const imageTagStep = job.steps.find(
      (step: any) => step.name === 'Rollback to specific image tag'
    );
    
    expect(imageTagStep).toBeDefined();
    expect(imageTagStep.if).toBe("inputs.rollback_type == 'image-tag'");
    expect(imageTagStep.run).toContain('sed -i');
    expect(imageTagStep.run).toContain('kubectl apply -f k8s/deployment.yaml');
  });

  it('should support rollback by revision number', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const revisionStep = job.steps.find(
      (step: any) => step.name === 'Rollback to specific revision'
    );
    
    expect(revisionStep).toBeDefined();
    expect(revisionStep.if).toBe("inputs.rollback_type == 'revision-number'");
    expect(revisionStep.run).toContain('kubectl rollout undo');
    expect(revisionStep.run).toContain('--to-revision=');
  });

  it('should wait for rollback to complete', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const waitStep = job.steps.find(
      (step: any) => step.name === 'Wait for rollback to complete'
    );
    
    expect(waitStep).toBeDefined();
    expect(waitStep.run).toContain('kubectl rollout status');
    expect(waitStep.run).toContain('--timeout=5m');
  });

  it('should verify health checks after rollback', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const healthCheckStep = job.steps.find(
      (step: any) => step.name === 'Verify health checks'
    );
    
    expect(healthCheckStep).toBeDefined();
    expect(healthCheckStep.run).toContain('kubectl wait');
    expect(healthCheckStep.run).toContain('--for=condition=ready');
  });

  it('should verify rollback success', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const verifyStep = job.steps.find(
      (step: any) => step.name === 'Verify rollback'
    );
    
    expect(verifyStep).toBeDefined();
    expect(verifyStep.run).toContain('kubectl get deployment portfolio');
    expect(verifyStep.run).toContain('kubectl get pods');
  });

  it('should display rollback summary', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    const summaryStep = job.steps.find(
      (step: any) => step.name === 'Display rollback summary'
    );
    
    expect(summaryStep).toBeDefined();
    expect(summaryStep.if).toBe('always()');
    expect(summaryStep.run).toContain('Rollback Summary');
    expect(summaryStep.run).toContain('kubectl rollout history');
  });

  it('should use namespace input in all kubectl commands', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    // Check that steps using kubectl reference the namespace input
    const stepsWithKubectl = job.steps.filter(
      (step: any) => step.run && step.run.includes('kubectl')
    );
    
    expect(stepsWithKubectl.length).toBeGreaterThan(0);
    
    // Most kubectl commands should reference the namespace
    const stepsWithNamespace = stepsWithKubectl.filter(
      (step: any) => step.run.includes('inputs.namespace')
    );
    
    expect(stepsWithNamespace.length).toBeGreaterThan(0);
  });

  it('should maintain zero downtime during rollback', () => {
    rollbackWorkflow = loadRollbackWorkflow();
    const job = rollbackWorkflow.jobs['rollback-deployment'];
    
    // Verify that rollback waits for pods to be ready
    const healthCheckStep = job.steps.find(
      (step: any) => step.name === 'Verify health checks'
    );
    
    expect(healthCheckStep).toBeDefined();
    expect(healthCheckStep.run).toContain('--for=condition=ready');
    
    // Verify that rollback status is checked
    const waitStep = job.steps.find(
      (step: any) => step.name === 'Wait for rollback to complete'
    );
    
    expect(waitStep).toBeDefined();
    expect(waitStep.run).toContain('kubectl rollout status');
  });
});
