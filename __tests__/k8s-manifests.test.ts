import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

// Helper function to load and parse YAML files
function loadYamlFile(filename: string): any {
  const filePath = path.join(process.cwd(), 'k8s', filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(fileContent);
}

describe('Kubernetes Manifests Validation - Requirements 4.1, 4.4', () => {
  describe('Deployment Manifest - deployment.yaml', () => {
    let deployment: any;

    it('should have valid YAML syntax', () => {
      expect(() => {
        deployment = loadYamlFile('deployment.yaml');
      }).not.toThrow();
    });

    it('should have correct apiVersion and kind', () => {
      deployment = loadYamlFile('deployment.yaml');
      expect(deployment.apiVersion).toBe('apps/v1');
      expect(deployment.kind).toBe('Deployment');
    });

    it('should have required metadata', () => {
      deployment = loadYamlFile('deployment.yaml');
      expect(deployment.metadata).toBeDefined();
      expect(deployment.metadata.name).toBe('portfolio');
      expect(deployment.metadata.labels).toBeDefined();
      expect(deployment.metadata.labels.app).toBe('portfolio');
    });

    it('should define 3 replicas - Requirement 4.1', () => {
      deployment = loadYamlFile('deployment.yaml');
      expect(deployment.spec.replicas).toBe(3);
    });

    it('should have rolling update strategy - Requirement 4.1', () => {
      deployment = loadYamlFile('deployment.yaml');
      expect(deployment.spec.strategy).toBeDefined();
      expect(deployment.spec.strategy.type).toBe('RollingUpdate');
      expect(deployment.spec.strategy.rollingUpdate).toBeDefined();
      expect(deployment.spec.strategy.rollingUpdate.maxSurge).toBeDefined();
      expect(deployment.spec.strategy.rollingUpdate.maxUnavailable).toBe(0);
    });

    it('should have proper selector matching labels', () => {
      deployment = loadYamlFile('deployment.yaml');
      expect(deployment.spec.selector).toBeDefined();
      expect(deployment.spec.selector.matchLabels).toBeDefined();
      expect(deployment.spec.selector.matchLabels.app).toBe('portfolio');
      expect(deployment.spec.template.metadata.labels.app).toBe('portfolio');
    });

    it('should have resource requests and limits - Requirement 4.1', () => {
      deployment = loadYamlFile('deployment.yaml');
      const container = deployment.spec.template.spec.containers[0];
      
      expect(container.resources).toBeDefined();
      expect(container.resources.requests).toBeDefined();
      expect(container.resources.requests.memory).toBeDefined();
      expect(container.resources.requests.cpu).toBeDefined();
      expect(container.resources.limits).toBeDefined();
      expect(container.resources.limits.memory).toBeDefined();
      expect(container.resources.limits.cpu).toBeDefined();
    });

    it('should have liveness probe pointing to /api/health - Requirement 4.4', () => {
      deployment = loadYamlFile('deployment.yaml');
      const container = deployment.spec.template.spec.containers[0];
      
      expect(container.livenessProbe).toBeDefined();
      expect(container.livenessProbe.httpGet).toBeDefined();
      expect(container.livenessProbe.httpGet.path).toBe('/api/health');
      expect(container.livenessProbe.httpGet.port).toBe(3000);
      expect(container.livenessProbe.initialDelaySeconds).toBeGreaterThan(0);
      expect(container.livenessProbe.periodSeconds).toBeGreaterThan(0);
    });

    it('should have readiness probe pointing to /api/health - Requirement 4.4', () => {
      deployment = loadYamlFile('deployment.yaml');
      const container = deployment.spec.template.spec.containers[0];
      
      expect(container.readinessProbe).toBeDefined();
      expect(container.readinessProbe.httpGet).toBeDefined();
      expect(container.readinessProbe.httpGet.path).toBe('/api/health');
      expect(container.readinessProbe.httpGet.port).toBe(3000);
      expect(container.readinessProbe.initialDelaySeconds).toBeGreaterThan(0);
      expect(container.readinessProbe.periodSeconds).toBeGreaterThan(0);
    });

    it('should have container port 3000 exposed', () => {
      deployment = loadYamlFile('deployment.yaml');
      const container = deployment.spec.template.spec.containers[0];
      
      expect(container.ports).toBeDefined();
      expect(container.ports.length).toBeGreaterThan(0);
      expect(container.ports[0].containerPort).toBe(3000);
    });

    it('should have image placeholder for CI/CD updates', () => {
      deployment = loadYamlFile('deployment.yaml');
      const container = deployment.spec.template.spec.containers[0];
      
      expect(container.image).toBeDefined();
      expect(typeof container.image).toBe('string');
      // Image should contain placeholders that will be replaced by CI/CD
      expect(container.image).toContain('PLACEHOLDER');
    });
  });

  describe('Service Manifest - service.yaml', () => {
    let service: any;

    it('should have valid YAML syntax', () => {
      expect(() => {
        service = loadYamlFile('service.yaml');
      }).not.toThrow();
    });

    it('should have correct apiVersion and kind - Requirement 4.2', () => {
      service = loadYamlFile('service.yaml');
      expect(service.apiVersion).toBe('v1');
      expect(service.kind).toBe('Service');
    });

    it('should have required metadata', () => {
      service = loadYamlFile('service.yaml');
      expect(service.metadata).toBeDefined();
      expect(service.metadata.name).toBe('portfolio-service');
      expect(service.metadata.labels).toBeDefined();
    });

    it('should be ClusterIP type - Requirement 4.2', () => {
      service = loadYamlFile('service.yaml');
      expect(service.spec.type).toBe('ClusterIP');
    });

    it('should expose port 80 targeting container port 3000 - Requirement 4.2', () => {
      service = loadYamlFile('service.yaml');
      expect(service.spec.ports).toBeDefined();
      expect(service.spec.ports.length).toBeGreaterThan(0);
      
      const port = service.spec.ports[0];
      expect(port.port).toBe(80);
      expect(port.targetPort).toBe(3000);
      expect(port.protocol).toBe('TCP');
    });

    it('should have selector matching deployment labels', () => {
      service = loadYamlFile('service.yaml');
      expect(service.spec.selector).toBeDefined();
      expect(service.spec.selector.app).toBe('portfolio');
    });
  });

  describe('Ingress Manifest - ingress.yaml', () => {
    let ingress: any;

    it('should have valid YAML syntax', () => {
      expect(() => {
        ingress = loadYamlFile('ingress.yaml');
      }).not.toThrow();
    });

    it('should have correct apiVersion and kind - Requirement 4.3', () => {
      ingress = loadYamlFile('ingress.yaml');
      expect(ingress.apiVersion).toBe('networking.k8s.io/v1');
      expect(ingress.kind).toBe('Ingress');
    });

    it('should have required metadata', () => {
      ingress = loadYamlFile('ingress.yaml');
      expect(ingress.metadata).toBeDefined();
      expect(ingress.metadata.name).toBe('portfolio-ingress');
    });

    it('should have cert-manager annotation for TLS - Requirement 9.3', () => {
      ingress = loadYamlFile('ingress.yaml');
      expect(ingress.metadata.annotations).toBeDefined();
      expect(ingress.metadata.annotations['cert-manager.io/cluster-issuer']).toBeDefined();
    });

    it('should have HTTPS redirect annotation - Requirement 9.1', () => {
      ingress = loadYamlFile('ingress.yaml');
      expect(ingress.metadata.annotations).toBeDefined();
      expect(
        ingress.metadata.annotations['nginx.ingress.kubernetes.io/ssl-redirect']
      ).toBe('true');
    });

    it('should have TLS configuration - Requirement 9.2, 9.5', () => {
      ingress = loadYamlFile('ingress.yaml');
      expect(ingress.spec.tls).toBeDefined();
      expect(ingress.spec.tls.length).toBeGreaterThan(0);
      
      const tls = ingress.spec.tls[0];
      expect(tls.hosts).toBeDefined();
      expect(tls.hosts.length).toBeGreaterThan(0);
      expect(tls.secretName).toBeDefined();
    });

    it('should have routing rules - Requirement 4.3', () => {
      ingress = loadYamlFile('ingress.yaml');
      expect(ingress.spec.rules).toBeDefined();
      expect(ingress.spec.rules.length).toBeGreaterThan(0);
      
      const rule = ingress.spec.rules[0];
      expect(rule.host).toBeDefined();
      expect(rule.http).toBeDefined();
      expect(rule.http.paths).toBeDefined();
      expect(rule.http.paths.length).toBeGreaterThan(0);
    });

    it('should route to portfolio-service on port 80', () => {
      ingress = loadYamlFile('ingress.yaml');
      const path = ingress.spec.rules[0].http.paths[0];
      
      expect(path.backend).toBeDefined();
      expect(path.backend.service).toBeDefined();
      expect(path.backend.service.name).toBe('portfolio-service');
      expect(path.backend.service.port.number).toBe(80);
    });

    it('should have root path configured', () => {
      ingress = loadYamlFile('ingress.yaml');
      const path = ingress.spec.rules[0].http.paths[0];
      
      expect(path.path).toBe('/');
      expect(path.pathType).toBe('Prefix');
    });
  });

  describe('ConfigMap Manifest - configmap.yaml', () => {
    let configMap: any;

    it('should have valid YAML syntax', () => {
      expect(() => {
        configMap = loadYamlFile('configmap.yaml');
      }).not.toThrow();
    });

    it('should have correct apiVersion and kind - Requirement 4.5', () => {
      configMap = loadYamlFile('configmap.yaml');
      expect(configMap.apiVersion).toBe('v1');
      expect(configMap.kind).toBe('ConfigMap');
    });

    it('should have required metadata', () => {
      configMap = loadYamlFile('configmap.yaml');
      expect(configMap.metadata).toBeDefined();
      expect(configMap.metadata.name).toBe('portfolio-config');
    });

    it('should have data section with configuration - Requirement 8.1', () => {
      configMap = loadYamlFile('configmap.yaml');
      expect(configMap.data).toBeDefined();
      expect(typeof configMap.data).toBe('object');
      expect(Object.keys(configMap.data).length).toBeGreaterThan(0);
    });

    it('should contain non-sensitive configuration only - Requirement 8.4', () => {
      configMap = loadYamlFile('configmap.yaml');
      const data = configMap.data;
      
      // Verify no obvious secrets (passwords, tokens, keys)
      const dataString = JSON.stringify(data).toLowerCase();
      expect(dataString).not.toContain('password');
      expect(dataString).not.toContain('secret');
      expect(dataString).not.toContain('token');
      expect(dataString).not.toContain('key');
    });
  });

  describe('Cross-Manifest Consistency', () => {
    it('should have consistent app labels across all manifests', () => {
      const deployment = loadYamlFile('deployment.yaml');
      const service = loadYamlFile('service.yaml');
      const ingress = loadYamlFile('ingress.yaml');
      const configMap = loadYamlFile('configmap.yaml');
      
      const appLabel = 'portfolio';
      
      expect(deployment.metadata.labels.app).toBe(appLabel);
      expect(service.metadata.labels.app).toBe(appLabel);
      expect(ingress.metadata.labels.app).toBe(appLabel);
      expect(configMap.metadata.labels.app).toBe(appLabel);
    });

    it('should have service selector matching deployment labels', () => {
      const deployment = loadYamlFile('deployment.yaml');
      const service = loadYamlFile('service.yaml');
      
      const deploymentLabels = deployment.spec.template.metadata.labels;
      const serviceSelector = service.spec.selector;
      
      expect(serviceSelector.app).toBe(deploymentLabels.app);
    });

    it('should have ingress routing to correct service', () => {
      const service = loadYamlFile('service.yaml');
      const ingress = loadYamlFile('ingress.yaml');
      
      const serviceName = service.metadata.name;
      const ingressBackend = ingress.spec.rules[0].http.paths[0].backend.service.name;
      
      expect(ingressBackend).toBe(serviceName);
    });

    it('should have matching ports between service and deployment', () => {
      const deployment = loadYamlFile('deployment.yaml');
      const service = loadYamlFile('service.yaml');
      
      const containerPort = deployment.spec.template.spec.containers[0].ports[0].containerPort;
      const serviceTargetPort = service.spec.ports[0].targetPort;
      
      expect(serviceTargetPort).toBe(containerPort);
    });

    it('should reference configmap in deployment', () => {
      const deployment = loadYamlFile('deployment.yaml');
      const configMap = loadYamlFile('configmap.yaml');
      
      const container = deployment.spec.template.spec.containers[0];
      const configMapName = configMap.metadata.name;
      
      // Check if deployment references the configmap
      expect(container.envFrom).toBeDefined();
      const configMapRef = container.envFrom.find(
        (ref: any) => ref.configMapRef && ref.configMapRef.name === configMapName
      );
      expect(configMapRef).toBeDefined();
    });
  });
});
