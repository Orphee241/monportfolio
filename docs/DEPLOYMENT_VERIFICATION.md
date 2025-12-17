# Guide de Vérification du Déploiement Initial

Ce document vous guide à travers toutes les étapes pour vérifier que votre déploiement initial fonctionne correctement.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Étape 1: Déclencher le Premier Déploiement](#étape-1-déclencher-le-premier-déploiement)
3. [Étape 2: Monitorer l'Exécution du Workflow](#étape-2-monitorer-lexécution-du-workflow)
4. [Étape 3: Vérifier l'Image dans le Registry](#étape-3-vérifier-limage-dans-le-registry)
5. [Étape 4: Vérifier le Déploiement dans Kubernetes](#étape-4-vérifier-le-déploiement-dans-kubernetes)
6. [Étape 5: Vérifier le Statut et les Logs des Pods](#étape-5-vérifier-le-statut-et-les-logs-des-pods)
7. [Étape 6: Vérifier l'Accessibilité via Ingress](#étape-6-vérifier-laccessibilité-via-ingress)
8. [Étape 7: Tester HTTPS et le Certificat](#étape-7-tester-https-et-le-certificat)
9. [Checklist de Vérification Complète](#checklist-de-vérification-complète)
10. [Résolution des Problèmes](#résolution-des-problèmes)

---

## Prérequis

Avant de commencer, assurez-vous que:

- ✅ Tous les secrets GitHub sont configurés (voir [DEPLOYMENT.md](./DEPLOYMENT.md#secrets-github-requis))
- ✅ Le fichier `k8s/ingress.yaml` est configuré avec votre domaine
- ✅ Votre cluster Kubernetes est accessible
- ✅ Lens est installé et connecté à votre cluster
- ✅ `kubectl` est configuré localement

### Vérification Rapide des Prérequis

```bash
# Vérifier l'accès au cluster
kubectl cluster-info

# Vérifier que le namespace existe (ou utiliser default)
kubectl get namespace

# Vérifier l'Ingress Controller
kubectl get pods -n ingress-nginx

# Vérifier cert-manager
kubectl get pods -n cert-manager
```

---

## Étape 1: Déclencher le Premier Déploiement

### Option A: Push vers la Branche Main (Recommandé)

Le workflow se déclenche automatiquement sur tout push vers `main`:

```bash
# 1. Assurez-vous d'être sur la branche main
git checkout main

# 2. Créez un commit (même vide si nécessaire)
git commit --allow-empty -m "chore: trigger initial deployment"

# 3. Pushez vers GitHub
git push origin main
```

### Option B: Déclenchement Manuel

Si vous avez configuré un déclenchement manuel dans le workflow:

1. Allez sur GitHub → Votre Repository
2. Cliquez sur l'onglet **Actions**
3. Sélectionnez le workflow **Deploy to Kubernetes**
4. Cliquez sur **Run workflow**
5. Sélectionnez la branche `main`
6. Cliquez sur **Run workflow**

### Confirmation

Vous devriez voir:
- Un nouveau workflow run apparaître dans l'onglet Actions
- Le statut initial: 🟡 **In progress**

---

## Étape 2: Monitorer l'Exécution du Workflow

### Via GitHub Actions UI

1. **Accéder au Workflow**
   - GitHub → Repository → Onglet **Actions**
   - Cliquez sur le workflow run le plus récent

2. **Suivre la Progression**
   
   Le workflow comporte 3 jobs qui s'exécutent séquentiellement:

   ```
   ┌─────────────────────┐
   │  build-and-test     │  ← Job 1: Build et tests
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │ build-and-push-image│  ← Job 2: Docker build & push
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │ deploy-to-kubernetes│  ← Job 3: Déploiement K8s
   └─────────────────────┘
   ```

3. **Vérifier Chaque Job**

   **Job 1: build-and-test**
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Run linting
   - ✅ Run tests
   - ✅ Build application
   - ✅ Upload build artifacts

   **Job 2: build-and-push-image**
   - ✅ Checkout code
   - ✅ Set up Docker Buildx
   - ✅ Login to Container Registry
   - ✅ Extract Docker metadata
   - ✅ Build and push Docker image

   **Job 3: deploy-to-kubernetes**
   - ✅ Checkout code
   - ✅ Setup kubectl
   - ✅ Configure kubectl
   - ✅ Update deployment manifest
   - ✅ Apply Kubernetes manifests
   - ✅ Wait for rollout to complete
   - ✅ Verify deployment

4. **Vérifier les Logs**
   
   Cliquez sur chaque step pour voir les logs détaillés:
   
   ```bash
   # Exemple de logs attendus pour "Build and push Docker image"
   #1 [internal] load build definition from Dockerfile
   #2 [internal] load .dockerignore
   #3 [internal] load metadata for docker.io/library/node:20-alpine
   ...
   #15 exporting to image
   #15 pushing layers
   #15 pushing manifest for ghcr.io/username/portfolio:sha-abc1234
   ```

### Temps d'Exécution Attendu

- **Job 1** (build-and-test): ~3-5 minutes
- **Job 2** (build-and-push-image): ~5-10 minutes (premier build)
- **Job 3** (deploy-to-kubernetes): ~2-3 minutes
- **Total**: ~10-18 minutes pour le premier déploiement

### Statuts Possibles

- 🟡 **In progress**: Le workflow est en cours d'exécution
- ✅ **Success**: Tout s'est bien passé
- ❌ **Failure**: Une erreur s'est produite (voir [Résolution des Problèmes](#résolution-des-problèmes))
- ⚪ **Cancelled**: Le workflow a été annulé manuellement

---

## Étape 3: Vérifier l'Image dans le Registry

### GitHub Container Registry (GHCR)

1. **Via l'Interface Web**
   - Allez sur votre profil GitHub
   - Cliquez sur **Packages**
   - Vous devriez voir le package `portfolio` ou `monportfolio`
   - Cliquez dessus pour voir les détails

2. **Vérifier les Tags**
   
   Vous devriez voir au moins 2 tags:
   - `sha-abc1234` (le SHA court du commit)
   - `latest`

3. **Via la Ligne de Commande**

   ```bash
   # Lister les images (nécessite authentification)
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   
   # Pull l'image pour vérifier
   docker pull ghcr.io/USERNAME/monportfolio:latest
   
   # Inspecter l'image
   docker inspect ghcr.io/USERNAME/monportfolio:latest
   
   # Vérifier la taille
   docker images | grep portfolio
   ```

### Docker Hub (si utilisé)

1. **Via l'Interface Web**
   - Connectez-vous à [hub.docker.com](https://hub.docker.com)
   - Allez dans **Repositories**
   - Cliquez sur votre repository `portfolio`
   - Vérifiez les tags dans l'onglet **Tags**

2. **Via la Ligne de Commande**

   ```bash
   # Pull l'image
   docker pull USERNAME/portfolio:latest
   
   # Vérifier
   docker images | grep portfolio
   ```

### Vérifications à Effectuer

✅ **L'image existe dans le registry**
✅ **Les tags sont corrects** (sha-xxx et latest)
✅ **La taille de l'image est raisonnable** (~200-400 MB pour Next.js Alpine)
✅ **La date de création correspond au déploiement**

---

## Étape 4: Vérifier le Déploiement dans Kubernetes

### Via Lens (Recommandé)

1. **Ouvrir Lens**
   - Lancez l'application Lens
   - Sélectionnez votre cluster dans la sidebar

2. **Vérifier le Deployment**
   - Allez dans **Workloads → Deployments**
   - Cherchez `portfolio` dans la liste
   - Vérifiez le statut:
     ```
     Name: portfolio
     Namespace: default (ou votre namespace)
     Replicas: 3/3 (3 desired, 3 ready)
     Status: ✅ Running
     Age: Quelques minutes
     ```

3. **Vérifier le Service**
   - Allez dans **Network → Services**
   - Cherchez `portfolio-service`
   - Vérifiez:
     ```
     Name: portfolio-service
     Type: ClusterIP
     Cluster IP: 10.x.x.x
     Ports: 80:3000/TCP
     Endpoints: 3 (les IPs des 3 pods)
     ```

4. **Vérifier l'Ingress**
   - Allez dans **Network → Ingresses**
   - Cherchez `portfolio-ingress`
   - Vérifiez:
     ```
     Name: portfolio-ingress
     Hosts: votre-domaine.com
     Address: IP externe du load balancer
     TLS: portfolio-tls
     ```

### Via kubectl

```bash
# Vérifier le deployment
kubectl get deployment portfolio
# Sortie attendue:
# NAME        READY   UP-TO-DATE   AVAILABLE   AGE
# portfolio   3/3     3            3           5m

# Détails du deployment
kubectl describe deployment portfolio

# Vérifier le service
kubectl get service portfolio-service
# Sortie attendue:
# NAME                TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
# portfolio-service   ClusterIP   10.x.x.x       <none>        80/TCP    5m

# Vérifier l'ingress
kubectl get ingress portfolio-ingress
# Sortie attendue:
# NAME                CLASS   HOSTS              ADDRESS        PORTS     AGE
# portfolio-ingress   nginx   votre-domaine.com  x.x.x.x        80, 443   5m

# Vérifier tous les objets liés
kubectl get all -l app=portfolio
```

### Vérifications à Effectuer

✅ **Deployment existe et est prêt** (3/3 replicas)
✅ **Service existe et a des endpoints**
✅ **Ingress existe et a une adresse IP**
✅ **Tous les objets ont le bon label** (`app: portfolio`)

---

## Étape 5: Vérifier le Statut et les Logs des Pods

### Via Lens (Recommandé)

1. **Lister les Pods**
   - Allez dans **Workloads → Pods**
   - Filtrez par label: `app=portfolio`
   - Vous devriez voir 3 pods

2. **Vérifier le Statut de Chaque Pod**
   
   Pour chaque pod, vérifiez:
   ```
   Name: portfolio-xxxxxxxxxx-xxxxx
   Status: ✅ Running
   Ready: 1/1
   Restarts: 0
   Age: Quelques minutes
   Node: node-name
   IP: 10.x.x.x
   ```

3. **Vérifier les Ressources**
   - Cliquez sur un pod
   - Onglet **Overview**
   - Vérifiez l'utilisation CPU/RAM:
     ```
     CPU: ~50-100m (sous la limite de 500m)
     Memory: ~150-250Mi (sous la limite de 512Mi)
     ```

4. **Consulter les Logs**
   - Cliquez sur un pod
   - Onglet **Logs**
   - Activez **Follow** pour voir en temps réel
   
   Logs attendus:
   ```
   > next start
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Network:      http://0.0.0.0:3000
   
   ✓ Ready in XXXms
   ```

5. **Vérifier les Health Checks**
   - Onglet **Overview** du pod
   - Section **Conditions**:
     ```
     Ready: True
     ContainersReady: True
     PodScheduled: True
     ```
   - Section **Probes**:
     ```
     Liveness: ✅ Passing
     Readiness: ✅ Passing
     ```

### Via kubectl

```bash
# Lister les pods
kubectl get pods -l app=portfolio
# Sortie attendue:
# NAME                         READY   STATUS    RESTARTS   AGE
# portfolio-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
# portfolio-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
# portfolio-xxxxxxxxxx-xxxxx   1/1     Running   0          5m

# Détails d'un pod
kubectl describe pod <pod-name>

# Logs d'un pod
kubectl logs <pod-name>

# Logs en temps réel
kubectl logs -f <pod-name>

# Logs de tous les pods du deployment
kubectl logs -l app=portfolio --tail=50

# Vérifier les events
kubectl get events --field-selector involvedObject.name=<pod-name>
```

### Tester le Health Check Endpoint

```bash
# Port-forward vers un pod
kubectl port-forward <pod-name> 3000:3000

# Dans un autre terminal, tester l'endpoint
curl http://localhost:3000/api/health

# Sortie attendue:
# {"status":"healthy","timestamp":"2024-12-16T..."}
```

### Vérifications à Effectuer

✅ **3 pods sont en statut Running**
✅ **Tous les pods sont Ready (1/1)**
✅ **Aucun restart récent** (0 restarts)
✅ **Les logs montrent que Next.js a démarré**
✅ **Les health checks passent** (liveness et readiness)
✅ **L'utilisation des ressources est normale**
✅ **L'endpoint /api/health répond correctement**

---

## Étape 6: Vérifier l'Accessibilité via Ingress

### Prérequis DNS

Avant de tester, assurez-vous que votre DNS est configuré:

```bash
# Obtenir l'IP externe de l'Ingress
kubectl get ingress portfolio-ingress

# Vérifier que votre domaine pointe vers cette IP
nslookup votre-domaine.com
# ou
dig votre-domaine.com

# L'IP retournée doit correspondre à l'IP de l'Ingress
```

### Test HTTP (avant certificat)

```bash
# Test simple
curl -I http://votre-domaine.com

# Sortie attendue (redirection vers HTTPS):
# HTTP/1.1 308 Permanent Redirect
# Location: https://votre-domaine.com/
```

### Test de l'Application

```bash
# Tester la page d'accueil
curl http://votre-domaine.com

# Tester l'endpoint de health
curl http://votre-domaine.com/api/health

# Sortie attendue:
# {"status":"healthy","timestamp":"2024-12-16T..."}
```

### Via le Navigateur

1. **Ouvrir le Navigateur**
   - Allez sur `http://votre-domaine.com`
   - Vous devriez être redirigé vers `https://votre-domaine.com`

2. **Vérifier le Contenu**
   - La page d'accueil du portfolio doit s'afficher
   - Toutes les ressources (CSS, JS, images) doivent charger
   - Pas d'erreurs dans la console du navigateur

3. **Tester la Navigation**
   - Cliquez sur les différentes sections
   - Vérifiez que tout fonctionne correctement

### Vérifications à Effectuer

✅ **Le domaine résout vers l'IP correcte**
✅ **HTTP redirige vers HTTPS**
✅ **L'application est accessible**
✅ **L'endpoint /api/health répond**
✅ **Toutes les pages se chargent correctement**
✅ **Pas d'erreurs 404 ou 500**

---

## Étape 7: Tester HTTPS et le Certificat

### Vérifier le Certificat via cert-manager

```bash
# Vérifier le Certificate resource
kubectl get certificate portfolio-tls

# Sortie attendue:
# NAME            READY   SECRET          AGE
# portfolio-tls   True    portfolio-tls   5m

# Détails du certificat
kubectl describe certificate portfolio-tls

# Vérifier le secret TLS
kubectl get secret portfolio-tls

# Voir les détails du certificat
kubectl get secret portfolio-tls -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -text -noout
```

### Via Lens

1. **Vérifier le Certificate**
   - Allez dans **Custom Resources**
   - Cherchez **certificates.cert-manager.io**
   - Cliquez sur `portfolio-tls`
   - Vérifiez:
     ```
     Status: Ready
     Issuer: letsencrypt-prod
     Not Before: Date
     Not After: Date (dans ~90 jours)
     ```

2. **Vérifier le Secret**
   - Allez dans **Config → Secrets**
   - Cherchez `portfolio-tls`
   - Type: `kubernetes.io/tls`
   - Data: `tls.crt`, `tls.key`

### Test HTTPS

```bash
# Test simple
curl -I https://votre-domaine.com

# Sortie attendue:
# HTTP/2 200
# server: nginx
# ...

# Vérifier le certificat SSL
curl -vI https://votre-domaine.com 2>&1 | grep -A 10 "SSL certificate"

# Test avec openssl
openssl s_client -connect votre-domaine.com:443 -servername votre-domaine.com < /dev/null

# Vérifier la chaîne de certificats
echo | openssl s_client -showcerts -servername votre-domaine.com -connect votre-domaine.com:443 2>/dev/null | openssl x509 -inform pem -noout -text
```

### Via le Navigateur

1. **Ouvrir le Site en HTTPS**
   - Allez sur `https://votre-domaine.com`

2. **Vérifier le Cadenas**
   - Cliquez sur le cadenas 🔒 dans la barre d'adresse
   - Vérifiez: "Connection is secure"
   - Cliquez sur "Certificate is valid"

3. **Inspecter le Certificat**
   - Issued to: votre-domaine.com
   - Issued by: Let's Encrypt Authority
   - Valid from: Date actuelle
   - Valid to: Date + 90 jours
   - ✅ Pas d'avertissement de sécurité

### Test SSL Labs (Optionnel)

Pour une analyse complète de la configuration SSL:

1. Allez sur [SSL Labs](https://www.ssllabs.com/ssltest/)
2. Entrez votre domaine
3. Lancez le test
4. Attendez les résultats (quelques minutes)
5. Visez un score A ou A+

### Vérifications à Effectuer

✅ **Le certificat est émis par Let's Encrypt**
✅ **Le certificat est valide** (pas expiré)
✅ **Le certificat couvre le bon domaine**
✅ **HTTPS fonctionne sans avertissement**
✅ **HTTP redirige automatiquement vers HTTPS**
✅ **Le cadenas apparaît dans le navigateur**
✅ **Pas d'erreurs de certificat**

---

## Checklist de Vérification Complète

Utilisez cette checklist pour confirmer que tout fonctionne:

### ✅ Phase 1: Déploiement

- [ ] Code pushé vers GitHub
- [ ] Workflow GitHub Actions déclenché
- [ ] Job "build-and-test" réussi
- [ ] Job "build-and-push-image" réussi
- [ ] Job "deploy-to-kubernetes" réussi
- [ ] Workflow complet en statut ✅ Success

### ✅ Phase 2: Container Registry

- [ ] Image visible dans le registry (GHCR ou Docker Hub)
- [ ] Tag `sha-xxxxxxx` présent
- [ ] Tag `latest` présent
- [ ] Taille de l'image raisonnable (~200-400 MB)
- [ ] Date de création correcte

### ✅ Phase 3: Kubernetes Resources

- [ ] Deployment `portfolio` existe
- [ ] Deployment a 3/3 replicas ready
- [ ] Service `portfolio-service` existe
- [ ] Service a 3 endpoints
- [ ] Ingress `portfolio-ingress` existe
- [ ] Ingress a une adresse IP externe
- [ ] ConfigMap `portfolio-config` existe

### ✅ Phase 4: Pods

- [ ] 3 pods en statut Running
- [ ] Tous les pods sont Ready (1/1)
- [ ] Aucun restart (ou très peu)
- [ ] Logs montrent Next.js démarré
- [ ] Liveness probes passent
- [ ] Readiness probes passent
- [ ] Utilisation CPU/RAM normale
- [ ] Endpoint `/api/health` répond

### ✅ Phase 5: Networking

- [ ] DNS résout vers l'IP correcte
- [ ] Application accessible via HTTP
- [ ] HTTP redirige vers HTTPS
- [ ] Page d'accueil se charge
- [ ] Toutes les ressources chargent
- [ ] Navigation fonctionne
- [ ] Pas d'erreurs 404/500

### ✅ Phase 6: HTTPS/TLS

- [ ] Certificate `portfolio-tls` en statut Ready
- [ ] Secret TLS existe
- [ ] HTTPS fonctionne
- [ ] Certificat valide (Let's Encrypt)
- [ ] Pas d'avertissement de sécurité
- [ ] Cadenas visible dans le navigateur
- [ ] Certificat expire dans ~90 jours

### ✅ Phase 7: Monitoring

- [ ] Lens connecté au cluster
- [ ] Tous les objets visibles dans Lens
- [ ] Logs accessibles
- [ ] Métriques visibles
- [ ] Pas d'alertes ou erreurs

---

## Résolution des Problèmes

Si vous rencontrez des problèmes, consultez le [Guide de Dépannage](./TROUBLESHOOTING.md) pour des solutions détaillées.

### Problèmes Courants

#### 1. Workflow GitHub Actions Échoue

**Symptôme**: Job en statut ❌ Failure

**Solutions**:
- Vérifier les logs du job qui a échoué
- Vérifier que tous les secrets GitHub sont configurés
- Vérifier la syntaxe des fichiers YAML
- Voir [TROUBLESHOOTING.md - Échecs de Build](./TROUBLESHOOTING.md#échecs-de-build-et-tests)

#### 2. Image Non Trouvée dans le Registry

**Symptôme**: Pas d'image dans GHCR/Docker Hub

**Solutions**:
- Vérifier que le job "build-and-push-image" a réussi
- Vérifier les credentials du registry (secrets)
- Vérifier les permissions du package (doit être public ou accessible)
- Voir [TROUBLESHOOTING.md - Problèmes Docker](./TROUBLESHOOTING.md#problèmes-docker)

#### 3. Pods en CrashLoopBackOff

**Symptôme**: Pods redémarrent en boucle

**Solutions**:
```bash
# Voir les logs
kubectl logs <pod-name>

# Voir les events
kubectl describe pod <pod-name>
```

Causes possibles:
- Erreur au démarrage de l'application
- Health check qui échoue
- Ressources insuffisantes
- Voir [TROUBLESHOOTING.md - Problèmes de Pods](./TROUBLESHOOTING.md#pods-en-crashloopbackoff)

#### 4. Ingress Sans Adresse IP

**Symptôme**: `kubectl get ingress` ne montre pas d'ADDRESS

**Solutions**:
- Vérifier que l'Ingress Controller est installé
- Vérifier les logs de l'Ingress Controller
- Attendre quelques minutes (peut prendre du temps)
- Voir [TROUBLESHOOTING.md - Problèmes Ingress](./TROUBLESHOOTING.md#ingress-sans-adresse-ip)

#### 5. Certificat Non Émis

**Symptôme**: Certificate en statut False ou Pending

**Solutions**:
```bash
# Vérifier le status
kubectl describe certificate portfolio-tls

# Vérifier les CertificateRequests
kubectl get certificaterequest

# Vérifier les logs cert-manager
kubectl logs -n cert-manager -l app=cert-manager
```

Causes possibles:
- DNS pas encore propagé
- ClusterIssuer mal configuré
- Rate limit Let's Encrypt
- Voir [TROUBLESHOOTING.md - Certificats TLS](./TROUBLESHOOTING.md#problèmes-de-certificats-tls)

#### 6. Site Inaccessible

**Symptôme**: Timeout ou erreur de connexion

**Solutions**:
1. Vérifier le DNS: `nslookup votre-domaine.com`
2. Vérifier l'Ingress: `kubectl get ingress`
3. Vérifier les pods: `kubectl get pods -l app=portfolio`
4. Tester depuis l'intérieur du cluster:
   ```bash
   kubectl run -it --rm debug --image=alpine --restart=Never -- sh
   wget -O- http://portfolio-service/api/health
   ```

---

## Prochaines Étapes

Une fois que toutes les vérifications sont passées:

1. **Documenter votre Configuration**
   - Notez votre domaine
   - Notez l'IP de l'Ingress
   - Sauvegardez votre kubeconfig

2. **Configurer le Monitoring Continu**
   - Ajoutez Lens à vos favoris
   - Configurez des alertes (optionnel)
   - Mettez en place des dashboards (optionnel)

3. **Tester le Rollback**
   - Passez à la tâche 9 du plan d'implémentation
   - Testez la fonctionnalité de rollback

4. **Optimiser si Nécessaire**
   - Ajustez les ressources si besoin
   - Configurez l'autoscaling (optionnel)
   - Ajoutez un CDN (optionnel)

---

## Ressources Additionnelles

- [Guide de Déploiement Complet](./DEPLOYMENT.md)
- [Guide de Dépannage](./TROUBLESHOOTING.md)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Lens](https://docs.k8slens.dev/)
- [Documentation cert-manager](https://cert-manager.io/docs/)

---

**Félicitations! 🎉**

Si toutes les vérifications sont passées, votre déploiement initial est réussi et votre portfolio est maintenant en production sur Kubernetes avec un pipeline CI/CD fonctionnel!

---

**Dernière mise à jour**: Décembre 2024  
**Version**: 1.0.0
