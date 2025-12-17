# Guide de Déploiement - Portfolio Next.js sur Kubernetes

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture CI/CD](#architecture-cicd)
3. [Prérequis](#prérequis)
4. [Configuration Initiale](#configuration-initiale)
5. [Secrets GitHub Requis](#secrets-github-requis)
6. [Ressources Kubernetes](#ressources-kubernetes)
7. [Instructions de Déploiement](#instructions-de-déploiement)
8. [Monitoring avec Lens](#monitoring-avec-lens)
9. [Guide de Dépannage](#guide-de-dépannage)

---

## Vue d'ensemble

Ce système implémente un pipeline de déploiement continu (CI/CD) professionnel pour le portfolio Next.js. Il utilise GitHub Actions pour l'automatisation et Kubernetes pour l'orchestration des conteneurs.

### Fonctionnalités Principales

- ✅ Déploiement automatique sur push vers la branche `main`
- ✅ Build et tests automatisés avant déploiement
- ✅ Conteneurisation avec Docker multi-stage
- ✅ Déploiement Kubernetes avec zero downtime
- ✅ Rollback automatique en cas d'échec
- ✅ HTTPS automatique avec cert-manager
- ✅ Monitoring via Lens
- ✅ Health checks et auto-healing

---

## Architecture CI/CD

### Flux de Déploiement

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE CI/CD COMPLET                        │
└─────────────────────────────────────────────────────────────────┘

1. DÉVELOPPEUR
   │
   ├─> Push code vers GitHub (branche main)
   │
   ▼

2. GITHUB ACTIONS - Phase Build & Test
   │
   ├─> Checkout du code
   ├─> Installation des dépendances (npm ci)
   ├─> Linting (ESLint)
   ├─> Tests unitaires (Vitest)
   ├─> Tests property-based (fast-check)
   ├─> Build Next.js
   │
   ▼

3. GITHUB ACTIONS - Phase Conteneurisation
   │
   ├─> Build image Docker (multi-stage)
   ├─> Tag avec SHA commit + "latest"
   ├─> Push vers Container Registry
   │
   ▼

4. GITHUB ACTIONS - Phase Déploiement
   │
   ├─> Connexion au cluster Kubernetes
   ├─> Mise à jour du manifest avec nouveau tag
   ├─> Application des manifests (kubectl apply)
   ├─> Attente du rollout complet
   │
   ▼

5. KUBERNETES CLUSTER
   │
   ├─> Rolling update (3 replicas)
   ├─> Health checks (liveness + readiness)
   ├─> Load balancing automatique
   ├─> Exposition via Ingress (HTTPS)
   │
   ▼

6. MONITORING
   │
   └─> Lens Dashboard (état temps réel)
```

### Composants du Système

| Composant | Rôle | Technologie |
|-----------|------|-------------|
| **GitHub Actions** | Orchestration CI/CD | Workflows YAML |
| **Docker** | Conteneurisation | Multi-stage build |
| **Container Registry** | Stockage images | GitHub CR / Docker Hub |
| **Kubernetes** | Orchestration | Deployment, Service, Ingress |
| **cert-manager** | Certificats TLS | Let's Encrypt |
| **Lens** | Monitoring | Interface graphique K8s |

---

## Prérequis

### Infrastructure Requise

1. **Cluster Kubernetes**
   - Version 1.20+ recommandée
   - Accès via `kubectl` configuré
   - Ingress Controller installé (nginx, traefik, etc.)
   - cert-manager installé (pour HTTPS automatique)

2. **Container Registry**
   - GitHub Container Registry (recommandé) OU
   - Docker Hub OU
   - Registry privé

3. **Outils Locaux**
   - `kubectl` installé et configuré
   - Lens Desktop installé
   - Docker Desktop (pour tests locaux)
   - Node.js 18+ et npm

4. **Accès GitHub**
   - Repository avec permissions admin
   - Accès aux GitHub Secrets
   - GitHub Actions activé

### Vérification des Prérequis

```bash
# Vérifier kubectl
kubectl version --client
kubectl cluster-info

# Vérifier Docker
docker --version
docker ps

# Vérifier Node.js
node --version
npm --version

# Vérifier l'accès au cluster
kubectl get nodes
kubectl get namespaces
```

---

## Configuration Initiale

### Étape 1: Cloner le Repository

```bash
git clone https://github.com/votre-username/monportfolio.git
cd monportfolio
```

### Étape 2: Installer les Dépendances

```bash
npm install
```

### Étape 3: Tester Localement

```bash
# Build de l'application
npm run build

# Lancer en mode développement
npm run dev

# Exécuter les tests
npm test
```

### Étape 4: Tester le Build Docker Localement

```bash
# Build de l'image
docker build -t portfolio:test .

# Lancer le conteneur
docker run -p 3000:3000 portfolio:test

# Tester l'endpoint de health check
curl http://localhost:3000/api/health
```

### Étape 5: Configurer le Cluster Kubernetes

```bash
# Créer le namespace (optionnel)
kubectl create namespace portfolio

# Vérifier l'Ingress Controller
kubectl get pods -n ingress-nginx

# Vérifier cert-manager
kubectl get pods -n cert-manager
```

---

## Secrets GitHub Requis

Les secrets suivants doivent être configurés dans **Settings → Secrets and variables → Actions** de votre repository GitHub.

### Secrets pour Container Registry

#### Option A: GitHub Container Registry (Recommandé)

| Secret | Description | Comment l'obtenir |
|--------|-------------|-------------------|
| `GHCR_TOKEN` | Personal Access Token GitHub | 1. GitHub → Settings → Developer settings → Personal access tokens<br>2. Generate new token (classic)<br>3. Cocher: `write:packages`, `read:packages`, `delete:packages` |

#### Option B: Docker Hub

| Secret | Description | Comment l'obtenir |
|--------|-------------|-------------------|
| `DOCKER_USERNAME` | Nom d'utilisateur Docker Hub | Votre username Docker Hub |
| `DOCKER_PASSWORD` | Mot de passe ou token Docker Hub | 1. Docker Hub → Account Settings → Security<br>2. New Access Token |

### Secrets pour Kubernetes

#### Option A: Kubeconfig Complet (Recommandé)

| Secret | Description | Comment l'obtenir |
|--------|-------------|-------------------|
| `KUBECONFIG` | Fichier kubeconfig encodé en base64 | ```bash<br>cat ~/.kube/config \| base64 -w 0<br>``` |

#### Option B: Credentials Individuels

| Secret | Description | Comment l'obtenir |
|--------|-------------|-------------------|
| `K8S_CLUSTER_URL` | URL du cluster Kubernetes | `kubectl cluster-info` |
| `K8S_TOKEN` | Token de service account | ```bash<br>kubectl create serviceaccount github-deployer<br>kubectl create clusterrolebinding github-deployer --clusterrole=cluster-admin --serviceaccount=default:github-deployer<br>kubectl create token github-deployer<br>``` |

### Secrets Optionnels

| Secret | Description | Valeur par défaut |
|--------|-------------|-------------------|
| `K8S_NAMESPACE` | Namespace Kubernetes cible | `default` |
| `REGISTRY_URL` | URL du registry personnalisé | `ghcr.io` ou `docker.io` |

### Configuration des Secrets

1. Aller sur GitHub → Votre Repository
2. Settings → Secrets and variables → Actions
3. Cliquer sur "New repository secret"
4. Ajouter chaque secret avec son nom et sa valeur
5. Sauvegarder

**⚠️ Important**: Ne jamais commiter les secrets dans le code source!

---

## Ressources Kubernetes

### Structure des Manifests

```
k8s/
├── deployment.yaml      # Définition du Deployment (3 replicas)
├── service.yaml         # Service ClusterIP (load balancing interne)
├── ingress.yaml         # Ingress pour accès HTTPS externe
├── configmap.yaml       # Variables d'environnement non-sensibles
└── secrets.yaml.example # Template pour les secrets
```

### 1. Deployment

**Fichier**: `k8s/deployment.yaml`

**Caractéristiques**:
- **Replicas**: 3 pods pour haute disponibilité
- **Stratégie**: Rolling update avec zero downtime
- **Resources**: 
  - Requests: 256Mi RAM, 100m CPU
  - Limits: 512Mi RAM, 500m CPU
- **Health Checks**:
  - Liveness probe: `/api/health` (détecte pods morts)
  - Readiness probe: `/api/health` (contrôle le trafic)

**Commandes utiles**:
```bash
# Voir le status du deployment
kubectl get deployment portfolio

# Voir les détails
kubectl describe deployment portfolio

# Voir l'historique des rollouts
kubectl rollout history deployment/portfolio
```

### 2. Service

**Fichier**: `k8s/service.yaml`

**Caractéristiques**:
- **Type**: ClusterIP (interne au cluster)
- **Port**: 80 → 3000 (mapping)
- **Selector**: `app: portfolio`
- **Load Balancing**: Automatique entre les 3 replicas

**Commandes utiles**:
```bash
# Voir le service
kubectl get service portfolio-service

# Tester depuis l'intérieur du cluster
kubectl run -it --rm debug --image=alpine --restart=Never -- sh
wget -O- http://portfolio-service/api/health
```

### 3. Ingress

**Fichier**: `k8s/ingress.yaml`

**Caractéristiques**:
- **Host**: Votre domaine (à configurer)
- **TLS**: Certificat automatique via cert-manager
- **Annotations**:
  - Redirection HTTP → HTTPS
  - Let's Encrypt issuer

**Configuration requise**:
```yaml
spec:
  tls:
  - hosts:
    - votre-domaine.com  # ← À MODIFIER
    secretName: portfolio-tls
  rules:
  - host: votre-domaine.com  # ← À MODIFIER
```

**Commandes utiles**:
```bash
# Voir l'ingress
kubectl get ingress portfolio-ingress

# Voir les détails (IP externe)
kubectl describe ingress portfolio-ingress

# Vérifier le certificat
kubectl get certificate portfolio-tls
```

### 4. ConfigMap

**Fichier**: `k8s/configmap.yaml`

**Usage**: Variables d'environnement non-sensibles

**Exemple**:
```yaml
data:
  NODE_ENV: "production"
  NEXT_PUBLIC_API_URL: "https://api.example.com"
```

### 5. Secrets

**Fichier**: `k8s/secrets.yaml` (à créer depuis le template)

**Création**:
```bash
# Copier le template
cp k8s/secrets.yaml.example k8s/secrets.yaml

# Encoder les valeurs en base64
echo -n "ma-valeur-secrete" | base64

# Éditer secrets.yaml avec les valeurs encodées
nano k8s/secrets.yaml

# Appliquer (NE PAS COMMITER CE FICHIER!)
kubectl apply -f k8s/secrets.yaml
```

---

## Instructions de Déploiement

### Déploiement Automatique (Recommandé)

Le déploiement se fait automatiquement à chaque push sur `main`:

```bash
# 1. Faire vos modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 2. Pusher vers GitHub
git push origin main

# 3. Le workflow GitHub Actions se déclenche automatiquement
# 4. Suivre la progression sur GitHub → Actions
```

### Déploiement Manuel

Si vous devez déployer manuellement:

```bash
# 1. Build de l'image Docker
docker build -t ghcr.io/votre-username/portfolio:manual .

# 2. Push vers le registry
docker push ghcr.io/votre-username/portfolio:manual

# 3. Mettre à jour le manifest
# Éditer k8s/deployment.yaml et changer l'image tag

# 4. Appliquer les manifests
kubectl apply -f k8s/

# 5. Vérifier le rollout
kubectl rollout status deployment/portfolio
```

### Premier Déploiement

Pour le tout premier déploiement:

```bash
# 1. Configurer tous les secrets GitHub (voir section précédente)

# 2. Modifier k8s/ingress.yaml avec votre domaine

# 3. Créer les secrets Kubernetes si nécessaire
kubectl apply -f k8s/secrets.yaml

# 4. Appliquer tous les manifests
kubectl apply -f k8s/

# 5. Pusher le code pour déclencher le workflow
git push origin main

# 6. Monitorer dans GitHub Actions et Lens
```

### Vérification du Déploiement

```bash
# Vérifier que tous les pods sont Running
kubectl get pods -l app=portfolio

# Vérifier le service
kubectl get service portfolio-service

# Vérifier l'ingress et obtenir l'IP externe
kubectl get ingress portfolio-ingress

# Vérifier les logs
kubectl logs -l app=portfolio --tail=50

# Tester l'endpoint de health
curl https://votre-domaine.com/api/health
```

---

## Monitoring avec Lens

### Installation de Lens

1. Télécharger depuis [k8slens.dev](https://k8slens.dev)
2. Installer l'application
3. Lancer Lens

### Connexion au Cluster

1. Lens détecte automatiquement votre `~/.kube/config`
2. Ou: File → Add Cluster → Coller votre kubeconfig
3. Sélectionner le cluster dans la sidebar

### Monitoring du Portfolio

#### Vue d'ensemble

1. **Workloads → Deployments**
   - Voir `portfolio` deployment
   - Status: 3/3 replicas ready
   - Stratégie de mise à jour
   - Historique des révisions

2. **Workloads → Pods**
   - Voir les 3 pods du portfolio
   - Status de chaque pod (Running, Pending, etc.)
   - Utilisation CPU/RAM en temps réel
   - Logs en direct

3. **Network → Services**
   - Voir `portfolio-service`
   - Endpoints (IPs des pods)
   - Port mapping

4. **Network → Ingresses**
   - Voir `portfolio-ingress`
   - Règles de routage
   - Status TLS/certificat
   - IP externe

#### Visualisation des Logs

1. Workloads → Pods
2. Cliquer sur un pod `portfolio-xxx`
3. Onglet "Logs"
4. Options:
   - Suivre en temps réel (Follow)
   - Filtrer par timestamp
   - Rechercher dans les logs
   - Télécharger les logs

#### Monitoring des Ressources

1. Workloads → Pods
2. Vue graphique:
   - CPU usage par pod
   - Memory usage par pod
   - Network I/O
   - Disk I/O

3. Alertes visuelles:
   - 🟢 Vert: Tout va bien
   - 🟡 Jaune: Avertissement (ressources élevées)
   - 🔴 Rouge: Erreur (pod crashé, OOMKilled, etc.)

#### Inspection d'un Pod

1. Cliquer sur un pod
2. Onglets disponibles:
   - **Overview**: Status, IP, node, etc.
   - **Logs**: Logs en temps réel
   - **Shell**: Terminal interactif dans le pod
   - **Events**: Événements Kubernetes
   - **Metrics**: Graphiques de ressources

#### Exécuter des Commandes

1. Cliquer sur un pod
2. Onglet "Shell"
3. Terminal interactif:
```bash
# Vérifier les fichiers
ls -la

# Tester l'application
curl localhost:3000/api/health

# Voir les variables d'environnement
env | grep NEXT
```

---

## Guide de Dépannage

Voir le fichier [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) pour un guide complet de dépannage incluant:

- Problèmes courants et solutions
- Commandes de debugging
- Procédures de rollback
- Récupération après incident
- FAQ

### Liens Rapides vers les Sections de Dépannage

- [Échecs de Build et Tests](./TROUBLESHOOTING.md#échecs-de-build-et-tests)
- [Problèmes Docker](./TROUBLESHOOTING.md#problèmes-docker)
- [Échecs de Déploiement Kubernetes](./TROUBLESHOOTING.md#échecs-de-déploiement-kubernetes)
- [Problèmes de Health Check](./TROUBLESHOOTING.md#problèmes-de-health-check)
- [Problèmes de Certificats TLS](./TROUBLESHOOTING.md#problèmes-de-certificats-tls)
- [Procédures de Rollback](./TROUBLESHOOTING.md#procédures-de-rollback)

---

## Ressources Additionnelles

### Documentation Officielle

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Lens Documentation](https://docs.k8slens.dev/)
- [cert-manager](https://cert-manager.io/docs/)

### Commandes Utiles

```bash
# Voir tous les pods
kubectl get pods --all-namespaces

# Voir les événements récents
kubectl get events --sort-by='.lastTimestamp'

# Décrire une ressource
kubectl describe <resource-type> <resource-name>

# Voir les logs
kubectl logs <pod-name> -f

# Exécuter une commande dans un pod
kubectl exec -it <pod-name> -- /bin/sh

# Port-forward pour accès local
kubectl port-forward service/portfolio-service 3000:80
```

### Support

Pour toute question ou problème:

1. Consulter ce guide et le guide de dépannage
2. Vérifier les logs dans Lens
3. Consulter les logs GitHub Actions
4. Vérifier les événements Kubernetes: `kubectl get events`

---

**Dernière mise à jour**: Décembre 2024  
**Version**: 1.0.0
