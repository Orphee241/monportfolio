# Checklist de Déploiement Initial - Portfolio Kubernetes

Ce document vous guide pas à pas pour effectuer et vérifier votre premier déploiement.

## 📋 Vue d'Ensemble

Vous êtes sur le point de déployer votre portfolio Next.js sur Kubernetes avec un pipeline CI/CD complet. Cette checklist vous assure que tout est configuré correctement.

## ⏱️ Temps Estimé

- **Configuration initiale**: 15-30 minutes
- **Premier déploiement**: 10-20 minutes
- **Vérification complète**: 10-15 minutes
- **Total**: ~45-65 minutes

---

## 🚀 Phase 1: Préparation (Avant le Déploiement)

### ✅ 1.1 Vérifier les Prérequis

- [ ] **Cluster Kubernetes accessible**
  ```bash
  kubectl cluster-info
  kubectl get nodes
  ```

- [ ] **Ingress Controller installé**
  ```bash
  kubectl get pods -n ingress-nginx
  # ou
  kubectl get pods -n traefik
  ```

- [ ] **cert-manager installé (pour HTTPS)**
  ```bash
  kubectl get pods -n cert-manager
  ```

- [ ] **Lens installé et connecté**
  - Télécharger depuis [k8slens.dev](https://k8slens.dev)
  - Connecter au cluster

- [ ] **kubectl configuré localement**
  ```bash
  kubectl version --client
  ```

### ✅ 1.2 Configurer les Secrets GitHub

Allez sur GitHub → Repository → Settings → Secrets and variables → Actions

**Secrets pour Container Registry:**

- [ ] **Option A: GitHub Container Registry (Recommandé)**
  - `GHCR_TOKEN`: Personal Access Token avec permissions `write:packages`
  - Ou utiliser `GITHUB_TOKEN` (automatique)

- [ ] **Option B: Docker Hub**
  - `DOCKER_USERNAME`: Votre username Docker Hub
  - `DOCKER_PASSWORD`: Token d'accès Docker Hub

**Secrets pour Kubernetes:**

- [ ] **Option A: Kubeconfig complet (Recommandé)**
  - `KUBECONFIG`: Fichier kubeconfig encodé en base64
  ```bash
  cat ~/.kube/config | base64 -w 0
  # Windows PowerShell:
  [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content ~/.kube/config -Raw)))
  ```

- [ ] **Option B: Credentials individuels**
  - `K8S_CLUSTER_URL`: URL du cluster
  - `K8S_TOKEN`: Token de service account

**Secrets optionnels:**

- [ ] `K8S_NAMESPACE`: Namespace cible (défaut: `default`)

### ✅ 1.3 Configurer le Domaine

- [ ] **Modifier `k8s/ingress.yaml`**
  ```yaml
  spec:
    tls:
    - hosts:
      - VOTRE-DOMAINE.COM  # ← Remplacer ici
      secretName: portfolio-tls
    rules:
    - host: VOTRE-DOMAINE.COM  # ← Et ici
  ```

- [ ] **Configurer le DNS**
  - Obtenir l'IP externe de l'Ingress Controller
  - Créer un enregistrement A pointant vers cette IP
  - Attendre la propagation DNS (peut prendre quelques minutes)

### ✅ 1.4 Vérifier les Fichiers Localement

- [ ] **Tester le build local**
  ```bash
  cd monportfolio
  npm install
  npm run build
  npm run lint
  npm test
  ```

- [ ] **Tester le Docker build local**
  ```bash
  docker build -t portfolio:test .
  docker run -p 3000:3000 portfolio:test
  # Tester: http://localhost:3000
  ```

- [ ] **Valider les manifests Kubernetes**
  ```bash
  kubectl apply --dry-run=client -f k8s/
  ```

---

## 🎯 Phase 2: Déploiement Initial

### ✅ 2.1 Déclencher le Premier Déploiement

**Option A: Push vers main (Automatique)**

```bash
# S'assurer d'être sur main
git checkout main

# Créer un commit de déploiement
git commit --allow-empty -m "chore: trigger initial deployment"

# Pusher vers GitHub
git push origin main
```

**Option B: Déclenchement manuel**

1. GitHub → Repository → Actions
2. Sélectionner "Deploy to Kubernetes"
3. Run workflow → main → Run workflow

### ✅ 2.2 Monitorer le Workflow GitHub Actions

- [ ] **Accéder à l'onglet Actions**
  - GitHub → Repository → Actions
  - Cliquer sur le workflow run le plus récent

- [ ] **Vérifier Job 1: build-and-test** (~3-5 min)
  - ✅ Checkout code
  - ✅ Setup Node.js
  - ✅ Install dependencies
  - ✅ Run linting
  - ✅ Run tests
  - ✅ Build application

- [ ] **Vérifier Job 2: build-and-push-image** (~5-10 min)
  - ✅ Setup Docker Buildx
  - ✅ Login to Container Registry
  - ✅ Build and push Docker image
  - Noter le tag de l'image (sha-xxxxxxx)

- [ ] **Vérifier Job 3: deploy-to-kubernetes** (~2-3 min)
  - ✅ Setup kubectl
  - ✅ Update deployment manifest
  - ✅ Apply Kubernetes manifests
  - ✅ Wait for rollout to complete
  - ✅ Verify deployment

- [ ] **Workflow complet en statut ✅ Success**

**⏱️ Temps total attendu: 10-18 minutes**

---

## 🔍 Phase 3: Vérification du Déploiement

### ✅ 3.1 Vérification Automatique (Recommandé)

**Utiliser le script de vérification:**

```bash
# Linux/macOS
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh

# Windows PowerShell
.\scripts\verify-deployment.ps1
```

Le script vérifie automatiquement:
- Deployment et replicas
- Pods et leur statut
- Service et endpoints
- Ingress et IP externe
- Certificat TLS
- Health check endpoint
- Logs et événements

**Résultat attendu:**
```
🎉 Tous les tests sont passés! Le déploiement est en bon état.
```

### ✅ 3.2 Vérification Manuelle via kubectl

Si vous préférez vérifier manuellement:

- [ ] **Vérifier le Deployment**
  ```bash
  kubectl get deployment portfolio
  # Attendu: 3/3 replicas ready
  ```

- [ ] **Vérifier les Pods**
  ```bash
  kubectl get pods -l app=portfolio
  # Attendu: 3 pods en Running, 1/1 Ready
  ```

- [ ] **Vérifier le Service**
  ```bash
  kubectl get service portfolio-service
  # Attendu: ClusterIP avec 3 endpoints
  ```

- [ ] **Vérifier l'Ingress**
  ```bash
  kubectl get ingress portfolio-ingress
  # Attendu: Adresse IP externe visible
  ```

- [ ] **Vérifier les logs**
  ```bash
  kubectl logs -l app=portfolio --tail=50
  # Attendu: "Ready in XXXms" de Next.js
  ```

### ✅ 3.3 Vérification via Lens

- [ ] **Ouvrir Lens et se connecter au cluster**

- [ ] **Vérifier le Deployment**
  - Workloads → Deployments → portfolio
  - Status: ✅ 3/3 replicas ready

- [ ] **Vérifier les Pods**
  - Workloads → Pods
  - Filtrer par `app=portfolio`
  - 3 pods en Running, tous Ready

- [ ] **Consulter les logs**
  - Cliquer sur un pod
  - Onglet Logs
  - Vérifier que Next.js a démarré

- [ ] **Vérifier les métriques**
  - CPU: ~50-100m (sous 500m)
  - Memory: ~150-250Mi (sous 512Mi)

### ✅ 3.4 Vérifier l'Image dans le Registry

**GitHub Container Registry:**

- [ ] Aller sur GitHub → Profil → Packages
- [ ] Voir le package `monportfolio` ou `portfolio`
- [ ] Vérifier les tags: `sha-xxxxxxx` et `latest`

**Docker Hub (si utilisé):**

- [ ] Se connecter à hub.docker.com
- [ ] Repositories → portfolio
- [ ] Vérifier les tags

---

## 🌐 Phase 4: Vérification de l'Accessibilité

### ✅ 4.1 Vérifier le DNS

```bash
# Vérifier que le domaine résout
nslookup votre-domaine.com
# ou
dig votre-domaine.com

# L'IP doit correspondre à l'IP de l'Ingress
kubectl get ingress portfolio-ingress
```

### ✅ 4.2 Tester HTTP (Redirection)

```bash
# Tester la redirection HTTP → HTTPS
curl -I http://votre-domaine.com
# Attendu: HTTP/1.1 308 Permanent Redirect
```

### ✅ 4.3 Tester l'Application

- [ ] **Ouvrir dans le navigateur**
  - Aller sur `https://votre-domaine.com`
  - La page d'accueil doit s'afficher

- [ ] **Vérifier le health check**
  ```bash
  curl https://votre-domaine.com/api/health
  # Attendu: {"status":"healthy","timestamp":"..."}
  ```

- [ ] **Tester la navigation**
  - Cliquer sur les différentes sections
  - Vérifier que tout fonctionne
  - Pas d'erreurs dans la console du navigateur

---

## 🔒 Phase 5: Vérification HTTPS et Certificat

### ✅ 5.1 Vérifier le Certificat via kubectl

```bash
# Vérifier le Certificate resource
kubectl get certificate portfolio-tls
# Attendu: READY = True

# Détails du certificat
kubectl describe certificate portfolio-tls

# Vérifier le secret TLS
kubectl get secret portfolio-tls
```

### ✅ 5.2 Vérifier le Certificat via Lens

- [ ] Custom Resources → certificates.cert-manager.io
- [ ] Cliquer sur `portfolio-tls`
- [ ] Status: Ready
- [ ] Issuer: letsencrypt-prod
- [ ] Not After: ~90 jours dans le futur

### ✅ 5.3 Tester HTTPS

```bash
# Test SSL
curl -vI https://votre-domaine.com 2>&1 | grep -A 10 "SSL certificate"

# Vérifier avec openssl
openssl s_client -connect votre-domaine.com:443 -servername votre-domaine.com < /dev/null
```

### ✅ 5.4 Vérifier dans le Navigateur

- [ ] **Ouvrir `https://votre-domaine.com`**
- [ ] **Vérifier le cadenas 🔒**
  - Cliquer sur le cadenas
  - "Connection is secure"
  - Certificat émis par Let's Encrypt
  - Pas d'avertissement de sécurité

### ✅ 5.5 Test SSL Labs (Optionnel)

- [ ] Aller sur [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)
- [ ] Entrer votre domaine
- [ ] Lancer le test
- [ ] Viser un score A ou A+

---

## ✅ Phase 6: Checklist Finale

### Déploiement

- [ ] Workflow GitHub Actions réussi (✅ Success)
- [ ] Image Docker dans le registry
- [ ] Tags corrects (sha-xxx et latest)

### Kubernetes

- [ ] Deployment: 3/3 replicas ready
- [ ] Pods: 3 en Running, tous Ready
- [ ] Service: 3 endpoints
- [ ] Ingress: Adresse IP externe
- [ ] ConfigMap existe
- [ ] Certificat TLS: Ready

### Application

- [ ] Health check répond: `/api/health`
- [ ] Page d'accueil accessible
- [ ] Navigation fonctionne
- [ ] Pas d'erreurs 404/500
- [ ] Logs propres (pas d'erreurs)

### Sécurité

- [ ] HTTPS fonctionne
- [ ] HTTP redirige vers HTTPS
- [ ] Certificat valide (Let's Encrypt)
- [ ] Pas d'avertissement de sécurité
- [ ] Cadenas visible dans le navigateur

### Monitoring

- [ ] Lens connecté et fonctionnel
- [ ] Métriques visibles
- [ ] Logs accessibles
- [ ] Pas d'alertes ou erreurs

---

## 🎉 Félicitations!

Si toutes les cases sont cochées, votre déploiement initial est réussi!

### Prochaines Étapes

1. **Documenter votre configuration**
   - Noter votre domaine
   - Noter l'IP de l'Ingress
   - Sauvegarder votre kubeconfig

2. **Configurer le monitoring continu**
   - Ajouter Lens à vos favoris
   - Configurer des alertes (optionnel)

3. **Tester le rollback** (Tâche 9)
   - Introduire un changement cassant
   - Vérifier le rollback automatique
   - Tester le rollback manuel

4. **Optimiser si nécessaire**
   - Ajuster les ressources
   - Configurer l'autoscaling (optionnel)
   - Ajouter un CDN (optionnel)

---

## 🆘 En Cas de Problème

### Workflow GitHub Actions Échoue

1. Vérifier les logs du job qui a échoué
2. Vérifier que tous les secrets sont configurés
3. Consulter [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### Pods en CrashLoopBackOff

```bash
# Voir les logs
kubectl logs <pod-name>

# Voir les events
kubectl describe pod <pod-name>
```

### Certificat Non Émis

```bash
# Vérifier le status
kubectl describe certificate portfolio-tls

# Vérifier les logs cert-manager
kubectl logs -n cert-manager -l app=cert-manager
```

### Site Inaccessible

1. Vérifier le DNS: `nslookup votre-domaine.com`
2. Vérifier l'Ingress: `kubectl get ingress`
3. Vérifier les pods: `kubectl get pods -l app=portfolio`

### Ressources Additionnelles

- [Guide de Déploiement Complet](docs/DEPLOYMENT.md)
- [Guide de Vérification Détaillé](docs/DEPLOYMENT_VERIFICATION.md)
- [Guide de Dépannage](docs/TROUBLESHOOTING.md)
- [README des Scripts](scripts/README.md)

---

## 📊 Métriques de Succès

Votre déploiement est considéré comme réussi si:

- ✅ Workflow GitHub Actions: 100% success
- ✅ Pods: 3/3 Running et Ready
- ✅ Health checks: 100% passing
- ✅ Uptime: 100% (pas de downtime)
- ✅ HTTPS: Certificat valide
- ✅ Response time: < 500ms
- ✅ Erreurs: 0 dans les logs

---

**Bonne chance avec votre déploiement! 🚀**

**Dernière mise à jour:** Décembre 2024  
**Version:** 1.0.0
