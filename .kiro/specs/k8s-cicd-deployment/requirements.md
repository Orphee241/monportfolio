# Requirements Document

## Introduction

Ce document définit les exigences pour un système de déploiement continu (CI/CD) du portfolio Next.js sur Kubernetes via Lens, utilisant GitHub Actions pour automatiser le processus de build, test et déploiement. Le système doit être professionnel, simple à maintenir, et permettre des mises à jour automatiques à chaque push sur la branche principale.

## Glossary

- **Portfolio System**: L'application Next.js du portfolio personnel à déployer
- **CI/CD Pipeline**: Le système d'intégration et de déploiement continu basé sur GitHub Actions
- **Kubernetes Cluster**: L'environnement d'orchestration de conteneurs accessible via Lens
- **Container Registry**: Le registre Docker (GitHub Container Registry ou Docker Hub) stockant les images
- **Deployment Manifest**: Les fichiers YAML Kubernetes définissant les ressources à déployer
- **Lens**: L'interface graphique Kubernetes pour gérer et monitorer le cluster
- **GitHub Actions**: Le service d'automatisation CI/CD intégré à GitHub
- **Ingress Controller**: Le composant Kubernetes gérant le routage HTTP/HTTPS externe
- **Secret Manager**: Le système de gestion des secrets Kubernetes pour les credentials sensibles

## Requirements

### Requirement 1

**User Story:** En tant que développeur, je veux que mon portfolio soit automatiquement construit et testé à chaque push, afin de détecter les erreurs avant le déploiement.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch, THEN the CI/CD Pipeline SHALL trigger a build workflow automatically
2. WHEN the build workflow executes, THEN the CI/CD Pipeline SHALL install dependencies and build the Next.js application
3. WHEN the build completes, THEN the CI/CD Pipeline SHALL execute all tests and linting checks
4. IF any test or build step fails, THEN the CI/CD Pipeline SHALL halt the deployment process and report the failure
5. WHEN all checks pass, THEN the CI/CD Pipeline SHALL proceed to the containerization step

### Requirement 2

**User Story:** En tant que développeur, je veux que mon application soit automatiquement conteneurisée et publiée dans un registre, afin de faciliter le déploiement sur Kubernetes.

#### Acceptance Criteria

1. WHEN the build succeeds, THEN the CI/CD Pipeline SHALL create a Docker image from the Portfolio System
2. WHEN creating the Docker image, THEN the CI/CD Pipeline SHALL tag it with the git commit SHA and "latest" tag
3. WHEN the image is built, THEN the CI/CD Pipeline SHALL push it to the Container Registry
4. WHEN pushing to the registry, THEN the CI/CD Pipeline SHALL authenticate using stored GitHub secrets
5. WHEN the image is published, THEN the Container Registry SHALL make it available for Kubernetes deployment

### Requirement 3

**User Story:** En tant que développeur, je veux que mon application soit automatiquement déployée sur Kubernetes après un build réussi, afin d'avoir des mises à jour continues sans intervention manuelle.

#### Acceptance Criteria

1. WHEN the Docker image is published, THEN the CI/CD Pipeline SHALL update the Deployment Manifest with the new image tag
2. WHEN the manifest is updated, THEN the CI/CD Pipeline SHALL apply the changes to the Kubernetes Cluster
3. WHEN applying changes, THEN the CI/CD Pipeline SHALL authenticate to the cluster using stored kubeconfig credentials
4. WHEN the deployment is triggered, THEN the Kubernetes Cluster SHALL perform a rolling update without downtime
5. IF the deployment fails, THEN the Kubernetes Cluster SHALL automatically rollback to the previous working version

### Requirement 4

**User Story:** En tant que développeur, je veux des manifests Kubernetes bien structurés et maintenables, afin de gérer facilement les ressources de mon application.

#### Acceptance Criteria

1. THE Deployment Manifest SHALL define a Deployment resource with appropriate replicas and resource limits
2. THE Deployment Manifest SHALL define a Service resource exposing the Portfolio System internally
3. THE Deployment Manifest SHALL define an Ingress resource for l'accès HTTP/HTTPS externe
4. THE Deployment Manifest SHALL include health checks (liveness and readiness probes) for the application
5. THE Deployment Manifest SHALL use ConfigMaps for configuration non-sensible and Secrets for données sensibles

### Requirement 5

**User Story:** En tant que développeur, je veux gérer les secrets de manière sécurisée, afin de protéger les credentials et tokens sensibles.

#### Acceptance Criteria

1. WHEN storing credentials, THEN the Secret Manager SHALL encrypt all sensitive data at rest
2. WHEN the CI/CD Pipeline needs credentials, THEN GitHub Actions SHALL retrieve them from GitHub Secrets
3. WHEN the Portfolio System needs credentials, THEN the Kubernetes Cluster SHALL inject them from Kubernetes Secrets
4. THE CI/CD Pipeline SHALL NOT log or expose secret values in build outputs
5. THE Deployment Manifest SHALL reference secrets by name without hardcoding values

### Requirement 6

**User Story:** En tant que développeur, je veux monitorer l'état de mes déploiements via Lens, afin de diagnostiquer rapidement les problèmes.

#### Acceptance Criteria

1. WHEN viewing the cluster in Lens, THEN the Portfolio System SHALL display its deployment status and pod health
2. WHEN a deployment is in progress, THEN Lens SHALL show the rolling update progress
3. WHEN pods are running, THEN Lens SHALL display resource usage (CPU, memory) for each pod
4. WHEN accessing logs, THEN Lens SHALL provide real-time log streaming from the Portfolio System pods
5. WHEN errors occur, THEN Lens SHALL highlight failed pods and display error messages

### Requirement 7

**User Story:** En tant que développeur, je veux un processus de rollback simple, afin de revenir rapidement à une version stable en cas de problème.

#### Acceptance Criteria

1. WHEN a deployment fails health checks, THEN the Kubernetes Cluster SHALL automatically rollback to the previous version
2. WHEN manual rollback is needed, THEN the CI/CD Pipeline SHALL provide a workflow to deploy a specific version
3. WHEN rolling back, THEN the Kubernetes Cluster SHALL maintain zero downtime during the transition
4. WHEN a rollback completes, THEN the Portfolio System SHALL serve the previous stable version
5. WHEN viewing deployment history in Lens, THEN the system SHALL display all previous revisions with timestamps

### Requirement 8

**User Story:** En tant que développeur, je veux une configuration d'environnement flexible, afin de gérer différents environnements (staging, production) facilement.

#### Acceptance Criteria

1. THE Deployment Manifest SHALL support environment-specific configurations via ConfigMaps
2. WHEN deploying to different environments, THEN the CI/CD Pipeline SHALL use environment-specific secrets
3. WHEN environment variables change, THEN the Kubernetes Cluster SHALL update pods with new configurations
4. THE Portfolio System SHALL read configuration from environment variables at runtime
5. THE CI/CD Pipeline SHALL support manual deployment triggers for specific environments

### Requirement 9

**User Story:** En tant que développeur, je veux que mon portfolio soit accessible via HTTPS avec un certificat valide, afin d'assurer la sécurité et la confiance des visiteurs.

#### Acceptance Criteria

1. WHEN the Ingress Controller receives HTTP requests, THEN it SHALL redirect them to HTTPS
2. WHEN serving HTTPS traffic, THEN the Ingress Controller SHALL use a valid TLS certificate
3. WHERE cert-manager is available, THEN the system SHALL automatically provision and renew certificates
4. WHEN certificates expire, THEN the system SHALL renew them automatically without downtime
5. THE Ingress resource SHALL define TLS configuration with the certificate secret reference

### Requirement 10

**User Story:** En tant que développeur, je veux une documentation claire du processus de déploiement, afin de comprendre et maintenir le système facilement.

#### Acceptance Criteria

1. THE system SHALL provide a README documenting the CI/CD pipeline architecture
2. THE system SHALL document all required GitHub Secrets and their purpose
3. THE system SHALL document the Kubernetes resources and their relationships
4. THE system SHALL provide troubleshooting guides for common deployment issues
5. THE system SHALL document the manual deployment and rollback procedures
