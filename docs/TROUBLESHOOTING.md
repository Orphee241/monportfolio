# Guide de Dépannage - Déploiement Kubernetes CI/CD

## Table des Matières

1. [Problèmes Courants](#problèmes-courants)
   - [Échecs de Build et Tests](#échecs-de-build-et-tests)
   - [Problèmes Docker](#problèmes-docker)
   - [Échecs de Déploiement Kubernetes](#échecs-de-déploiement-kubernetes)
   - [Problèmes de Health Check](#problèmes-de-health-check)
   - [Problèmes de Certificats TLS](#problèmes-de-certificats-tls)
   - [Problèmes de Secrets](#problèmes-de-secrets)
2. [Commandes de Debugging](#commandes-de-debugging)
3. [Procédures de Déploiement Manuel](#procédures-de-déploiement-manuel)
4. [Procédures de Rollback](#procédures-de-rollback)
5. [Utilisation de Lens pour le Debugging](#utilisation-de-lens-pour-le-debugging)
6. [Récupération après Incident](#récupération-après-incident)
7. [FAQ](#faq)

---

## Problèmes Courants

### Échecs de Build et Tests

#### Problème: Le workflow GitHub Actions échoue à l'étape de build

**Symptômes**:
- ❌ Job "build-and-test" échoue
- Erreur: `npm run build` retourne un code d'erreur
- Message: "Build failed" dans les logs GitHub Actions

**Causes possibles**:
1. Erreurs de syntaxe dans le code
2. Dépendances manquantes ou incompatibles
3. Variables d'environnement manquantes
4. Erreurs TypeScript

**Solutions**:

```bash
# 1. Tester le build localement
npm install
npm run build

# 2. Vérifier les erreurs TypeScript
npm run type-check

# 3. Vérifier le linting
npm run lint

# 4. Nettoyer et réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Vérification dans Lens**: N/A (problème avant le déploiement)

---

#### Problème: Les tests échouent dans le pipeline

**Symptômes**:
- ❌ Job "build-and-test" échoue à l'étape de test
- Message: "Tests failed" avec des détails de tests

**Causes possibles**:
1. Tests cassés par des changements récents
2. Tests flaky (instables)
3. Dépendances de test manquantes

**Solutions**:

```bash
# 1. Exécuter les tests localement
npm test

# 2. Exécuter les tests en mode watch pour debugging
npm test -- --watch

# 3. Exécuter un test spécifique
npm test -- path/to/test.test.ts

# 4. Voir la couverture de tests
npm test -- --coverage
```

**Prévention**:
- Toujours exécuter les tests localement avant de pusher
- Utiliser des hooks pre-commit pour automatiser les vérifications

---

#### Problème: Erreur "ENOSPC: System limit for number of file watchers reached"

**Symptômes**:
- Erreur lors du build ou des tests
- Message contenant "ENOSPC" ou "file watchers"

**Solution (Linux)**:

```bash
# Augmenter la limite de watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### Problèmes Docker

#### Problème: Échec du build Docker

**Symptômes**:
- ❌ Job "build-and-push-image" échoue
- Erreur: "docker build failed"
- Message d'erreur dans les logs Docker

**Causes possibles**:
1. Erreurs dans le Dockerfile
2. Fichiers manquants (non copiés)
3. Problèmes de permissions
4. Manque d'espace disque

**Solutions**:

```bash
# 1. Tester le build Docker localement
docker build -t portfolio:test .

# 2. Build avec logs détaillés
docker build --progress=plain -t portfolio:test .

# 3. Vérifier le contexte de build
docker build --no-cache -t portfolio:test .

# 4. Nettoyer les images inutilisées
docker system prune -a

# 5. Vérifier l'espace disque
df -h
docker system df
```

**Vérification du Dockerfile**:

```dockerfile
# Vérifier que toutes les étapes sont correctes
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

#### Problème: Impossible de pusher l'image vers le registry

**Symptômes**:
- ❌ Job "build-and-push-image" échoue à l'étape push
- Erreur: "unauthorized" ou "access denied"
- Message: "failed to push image"

**Causes possibles**:
1. Credentials incorrects ou expirés
2. Permissions insuffisantes
3. Registry inaccessible

**Solutions**:

```bash
# 1. Vérifier les credentials localement
# Pour GitHub Container Registry:
echo $GHCR_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pour Docker Hub:
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

# 2. Tester le push manuellement
docker tag portfolio:test ghcr.io/username/portfolio:test
docker push ghcr.io/username/portfolio:test
```

**Vérification des Secrets GitHub**:
1. Aller sur GitHub → Settings → Secrets and variables → Actions
2. Vérifier que `GHCR_TOKEN` ou `DOCKER_USERNAME`/`DOCKER_PASSWORD` existent
3. Régénérer le token si nécessaire:
   - GitHub: Settings → Developer settings → Personal access tokens
   - Permissions requises: `write:packages`, `read:packages`

---

#### Problème: Image trop volumineuse

**Symptômes**:
- Build réussit mais prend beaucoup de temps
- Image > 500MB
- Push lent vers le registry

**Solutions**:

```bash
# 1. Vérifier la taille de l'image
docker images | grep portfolio

# 2. Analyser les layers
docker history portfolio:test

# 3. Utiliser .dockerignore
cat > .dockerignore << EOF
node_modules
.next
.git
.github
*.md
.env*
.vscode
.idea
coverage
EOF

# 4. Optimiser le Dockerfile
# - Utiliser Alpine images
# - Multi-stage build
# - Copier seulement les fichiers nécessaires
```

---

### Échecs de Déploiement Kubernetes

#### Problème: Les pods ne démarrent pas (ImagePullBackOff)

**Symptômes**:
- 🔴 Pods en état `ImagePullBackOff` ou `ErrImagePull`
- Message: "Failed to pull image"

**Causes possibles**:
1. Image n'existe pas dans le registry
2. Tag d'image incorrect
3. Credentials de registry manquants
4. Registry inaccessible depuis le cluster

**Solutions**:

```bash
# 1. Vérifier que l'image existe
docker pull ghcr.io/username/portfolio:tag

# 2. Vérifier le tag dans le deployment
kubectl get deployment portfolio -o yaml | grep image:

# 3. Vérifier les secrets de registry
kubectl get secrets
kubectl describe secret regcred

# 4. Créer un secret de registry si nécessaire
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=USERNAME \
  --docker-password=TOKEN \
  --docker-email=EMAIL

# 5. Ajouter le secret au deployment
kubectl patch deployment portfolio -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"regcred"}]}}}}'
```

**Vérification dans Lens**:
1. Workloads → Pods
2. Cliquer sur le pod en erreur
3. Onglet "Events" → Voir les messages d'erreur détaillés
4. Vérifier la section "Image Pull" dans les événements

---

#### Problème: Pods en CrashLoopBackOff

**Symptômes**:
- 🔴 Pods redémarrent continuellement
- État: `CrashLoopBackOff`
- Restart count augmente constamment

**Causes possibles**:
1. Application crash au démarrage
2. Port déjà utilisé
3. Variables d'environnement manquantes
4. Erreurs de configuration

**Solutions**:

```bash
# 1. Voir les logs du pod
kubectl logs <pod-name>
kubectl logs <pod-name> --previous  # Logs du container précédent

# 2. Voir les événements
kubectl describe pod <pod-name>

# 3. Exécuter un shell dans le pod (si possible)
kubectl exec -it <pod-name> -- /bin/sh

# 4. Vérifier les variables d'environnement
kubectl exec <pod-name> -- env

# 5. Tester l'application localement avec la même config
docker run -it portfolio:test /bin/sh
node server.js
```

**Vérification dans Lens**:
1. Workloads → Pods
2. Cliquer sur le pod crashé
3. Onglet "Logs" → Voir les erreurs
4. Onglet "Events" → Voir l'historique des crashes
5. Vérifier les "Container Status" pour voir la raison du crash

**Causes communes et solutions**:

| Erreur dans les logs | Solution |
|---------------------|----------|
| `Error: Cannot find module` | Vérifier que tous les fichiers sont copiés dans l'image |
| `EADDRINUSE: address already in use` | Vérifier le port dans le Dockerfile (doit être 3000) |
| `Error: Missing environment variable` | Ajouter la variable dans ConfigMap ou Secret |
| `Permission denied` | Vérifier les permissions des fichiers dans l'image |

---

#### Problème: Pods en état Pending

**Symptômes**:
- 🟡 Pods restent en état `Pending`
- Ne passent jamais à `Running`

**Causes possibles**:
1. Ressources insuffisantes dans le cluster
2. Aucun node disponible
3. PersistentVolume non disponible
4. Contraintes de scheduling non satisfaites

**Solutions**:

```bash
# 1. Voir pourquoi le pod est pending
kubectl describe pod <pod-name>

# 2. Vérifier les ressources du cluster
kubectl top nodes
kubectl describe nodes

# 3. Vérifier les events
kubectl get events --sort-by='.lastTimestamp' | grep <pod-name>

# 4. Réduire les resource requests si nécessaire
kubectl edit deployment portfolio
# Modifier requests.memory et requests.cpu
```

**Vérification dans Lens**:
1. Workloads → Pods
2. Cliquer sur le pod Pending
3. Onglet "Events" → Chercher "FailedScheduling"
4. Cluster → Nodes → Vérifier les ressources disponibles

**Messages courants**:

| Message | Solution |
|---------|----------|
| `Insufficient cpu` | Réduire les CPU requests ou ajouter des nodes |
| `Insufficient memory` | Réduire les memory requests ou ajouter des nodes |
| `No nodes available` | Vérifier que le cluster a des nodes actifs |
| `PersistentVolumeClaim not found` | Créer le PVC ou retirer la dépendance |

---

#### Problème: Deployment bloqué (Progressing)

**Symptômes**:
- ⏳ Deployment reste en état "Progressing"
- Rollout ne se termine jamais
- Anciens pods restent actifs

**Causes possibles**:
1. Nouveaux pods ne passent pas les health checks
2. Stratégie de rolling update bloquée
3. Ressources insuffisantes

**Solutions**:

```bash
# 1. Voir le status du rollout
kubectl rollout status deployment/portfolio

# 2. Voir l'historique
kubectl rollout history deployment/portfolio

# 3. Voir les détails du deployment
kubectl describe deployment portfolio

# 4. Annuler le rollout en cours
kubectl rollout undo deployment/portfolio

# 5. Forcer un nouveau rollout
kubectl rollout restart deployment/portfolio
```

**Vérification dans Lens**:
1. Workloads → Deployments → portfolio
2. Voir "Conditions" → Chercher "Progressing"
3. Vérifier "Replicas": devrait être "3/3"
4. Onglet "Pods" → Vérifier l'état de chaque pod

---

### Problèmes de Health Check

#### Problème: Readiness probe échoue

**Symptômes**:
- 🟡 Pods en état `Running` mais pas `Ready`
- Indicateur: `0/1` dans la colonne READY
- Pas de trafic routé vers les pods

**Causes possibles**:
1. Endpoint `/api/health` ne répond pas
2. Application démarre lentement
3. Port incorrect dans la probe
4. Délai initial trop court

**Solutions**:

```bash
# 1. Tester l'endpoint depuis le pod
kubectl exec <pod-name> -- wget -O- http://localhost:3000/api/health

# 2. Voir les logs de l'application
kubectl logs <pod-name>

# 3. Vérifier la configuration de la probe
kubectl get deployment portfolio -o yaml | grep -A 10 readinessProbe

# 4. Augmenter le délai initial si nécessaire
kubectl patch deployment portfolio -p '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [{
          "name": "portfolio",
          "readinessProbe": {
            "initialDelaySeconds": 15
          }
        }]
      }
    }
  }
}'
```

**Configuration recommandée**:

```yaml
readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5   # Attendre 5s après le démarrage
  periodSeconds: 5         # Vérifier toutes les 5s
  timeoutSeconds: 3        # Timeout après 3s
  successThreshold: 1      # 1 succès = ready
  failureThreshold: 3      # 3 échecs = not ready
```

**Vérification dans Lens**:
1. Workloads → Pods
2. Cliquer sur le pod
3. Section "Conditions" → Vérifier "Ready: False"
4. Onglet "Events" → Chercher "Readiness probe failed"

---

#### Problème: Liveness probe échoue (pods redémarrent)

**Symptômes**:
- 🔴 Pods redémarrent fréquemment
- Restart count augmente
- Message: "Liveness probe failed"

**Causes possibles**:
1. Application devient non-responsive
2. Probe trop agressive
3. Ressources insuffisantes (CPU throttling)
4. Deadlock dans l'application

**Solutions**:

```bash
# 1. Voir les logs avant le restart
kubectl logs <pod-name> --previous

# 2. Vérifier la configuration de la liveness probe
kubectl get deployment portfolio -o yaml | grep -A 10 livenessProbe

# 3. Augmenter les seuils de tolérance
kubectl patch deployment portfolio -p '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [{
          "name": "portfolio",
          "livenessProbe": {
            "initialDelaySeconds": 30,
            "periodSeconds": 10,
            "timeoutSeconds": 5,
            "failureThreshold": 5
          }
        }]
      }
    }
  }
}'

# 4. Vérifier l'utilisation des ressources
kubectl top pod <pod-name>
```

**Configuration recommandée**:

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30  # Attendre 30s (temps de démarrage)
  periodSeconds: 10        # Vérifier toutes les 10s
  timeoutSeconds: 5        # Timeout après 5s
  failureThreshold: 3      # 3 échecs consécutifs = restart
```

**Vérification dans Lens**:
1. Workloads → Pods
2. Voir la colonne "Restarts" (devrait être 0 ou faible)
3. Cliquer sur un pod avec restarts élevés
4. Onglet "Events" → Chercher "Liveness probe failed"
5. Onglet "Logs" → Sélectionner "Previous" pour voir les logs avant restart

---

### Problèmes de Certificats TLS

#### Problème: Certificat non provisionné

**Symptômes**:
- ⚠️ HTTPS ne fonctionne pas
- Erreur: "Certificate not found"
- Ingress sans TLS

**Causes possibles**:
1. cert-manager non installé
2. ClusterIssuer non configuré
3. DNS non configuré correctement
4. Challenge Let's Encrypt échoue

**Solutions**:

```bash
# 1. Vérifier que cert-manager est installé
kubectl get pods -n cert-manager

# 2. Vérifier le ClusterIssuer
kubectl get clusterissuer
kubectl describe clusterissuer letsencrypt-prod

# 3. Vérifier le Certificate
kubectl get certificate portfolio-tls
kubectl describe certificate portfolio-tls

# 4. Voir les challenges en cours
kubectl get challenges
kubectl describe challenge <challenge-name>

# 5. Vérifier les logs de cert-manager
kubectl logs -n cert-manager deployment/cert-manager
```

**Installer cert-manager si nécessaire**:

```bash
# Installation via kubectl
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Créer un ClusterIssuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: votre-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

**Vérification dans Lens**:
1. Config → Certificates → Vérifier "portfolio-tls"
2. Status devrait être "Ready: True"
3. Si "Ready: False", voir les "Events" pour les erreurs
4. Network → Ingresses → Vérifier la section TLS

---

#### Problème: Certificat expiré ou invalide

**Symptômes**:
- ⚠️ Navigateur affiche "Certificate expired"
- HTTPS fonctionne mais avec avertissement

**Causes possibles**:
1. Renouvellement automatique échoué
2. Certificat de staging utilisé
3. DNS changé

**Solutions**:

```bash
# 1. Vérifier l'expiration du certificat
kubectl get certificate portfolio-tls -o yaml

# 2. Forcer le renouvellement
kubectl delete certificate portfolio-tls
# Le certificat sera recréé automatiquement

# 3. Vérifier que vous utilisez le bon issuer
kubectl get ingress portfolio-ingress -o yaml | grep issuer
# Devrait être: letsencrypt-prod (pas letsencrypt-staging)

# 4. Tester le certificat
openssl s_client -connect votre-domaine.com:443 -servername votre-domaine.com
```

**Vérification dans Lens**:
1. Config → Certificates → portfolio-tls
2. Vérifier "Not After" (date d'expiration)
3. Vérifier "Renewal Time" (date de renouvellement)

---

#### Problème: Redirection HTTP → HTTPS ne fonctionne pas

**Symptômes**:
- HTTP fonctionne mais pas de redirection vers HTTPS
- Accès en http:// reste en HTTP

**Solution**:

```bash
# Vérifier l'annotation dans l'Ingress
kubectl get ingress portfolio-ingress -o yaml | grep ssl-redirect

# Ajouter l'annotation si manquante
kubectl annotate ingress portfolio-ingress nginx.ingress.kubernetes.io/ssl-redirect="true"
```

**Configuration correcte de l'Ingress**:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - votre-domaine.com
    secretName: portfolio-tls
  rules:
  - host: votre-domaine.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: portfolio-service
            port:
              number: 80
```

---

### Problèmes de Secrets

#### Problème: Secrets non trouvés dans le cluster

**Symptômes**:
- Pods ne démarrent pas
- Erreur: "Secret not found"
- Variables d'environnement manquantes

**Solutions**:

```bash
# 1. Lister les secrets
kubectl get secrets

# 2. Vérifier un secret spécifique
kubectl describe secret <secret-name>

# 3. Créer un secret depuis un fichier
kubectl create secret generic portfolio-secrets \
  --from-literal=API_KEY=votre-cle \
  --from-literal=DATABASE_URL=votre-url

# 4. Créer depuis un fichier .env
kubectl create secret generic portfolio-secrets --from-env-file=.env

# 5. Vérifier que le deployment référence le bon secret
kubectl get deployment portfolio -o yaml | grep -A 5 secretRef
```

**Vérification dans Lens**:
1. Config → Secrets
2. Vérifier que le secret existe
3. Cliquer dessus pour voir les clés (valeurs masquées)
4. Workloads → Deployments → portfolio
5. Vérifier la section "Environment Variables"

---

#### Problème: Secrets exposés dans les logs GitHub Actions

**Symptômes**:
- Valeurs sensibles visibles dans les logs
- Avertissement de sécurité GitHub

**Solutions**:

```bash
# Les secrets GitHub sont automatiquement masqués
# Si un secret apparaît, c'est qu'il n'est pas stocké comme secret

# 1. Vérifier que la valeur est bien un secret GitHub
# GitHub → Settings → Secrets and variables → Actions

# 2. Utiliser les secrets correctement dans le workflow
# ✅ Correct:
echo "${{ secrets.DOCKER_PASSWORD }}" | docker login ...

# ❌ Incorrect (expose le secret):
echo "Password: ${{ secrets.DOCKER_PASSWORD }}"

# 3. Révoquer et régénérer tout secret exposé
```

**Bonnes pratiques**:
- Ne jamais echo ou print les secrets
- Utiliser `::add-mask::` pour masquer des valeurs dynamiques
- Révoquer immédiatement tout secret exposé

---

## Commandes de Debugging

### Commandes Kubernetes Essentielles

```bash
# ============================================
# PODS
# ============================================

# Lister tous les pods
kubectl get pods

# Lister avec plus de détails
kubectl get pods -o wide

# Voir les pods de tous les namespaces
kubectl get pods --all-namespaces

# Décrire un pod (événements, status, etc.)
kubectl describe pod <pod-name>

# Voir les logs d'un pod
kubectl logs <pod-name>

# Suivre les logs en temps réel
kubectl logs -f <pod-name>

# Voir les logs du container précédent (après crash)
kubectl logs <pod-name> --previous

# Logs de tous les pods d'un deployment
kubectl logs -l app=portfolio --tail=50

# Exécuter une commande dans un pod
kubectl exec <pod-name> -- ls -la

# Ouvrir un shell interactif
kubectl exec -it <pod-name> -- /bin/sh

# Copier des fichiers depuis/vers un pod
kubectl cp <pod-name>:/path/to/file ./local-file
kubectl cp ./local-file <pod-name>:/path/to/file

# ============================================
# DEPLOYMENTS
# ============================================

# Lister les deployments
kubectl get deployments

# Décrire un deployment
kubectl describe deployment portfolio

# Voir le status du rollout
kubectl rollout status deployment/portfolio

# Voir l'historique des rollouts
kubectl rollout history deployment/portfolio

# Voir les détails d'une révision
kubectl rollout history deployment/portfolio --revision=2

# Mettre à l'échelle un deployment
kubectl scale deployment portfolio --replicas=5

# Éditer un deployment
kubectl edit deployment portfolio

# Redémarrer un deployment (rolling restart)
kubectl rollout restart deployment/portfolio

# ============================================
# SERVICES
# ============================================

# Lister les services
kubectl get services

# Décrire un service
kubectl describe service portfolio-service

# Voir les endpoints (IPs des pods)
kubectl get endpoints portfolio-service

# Port-forward pour accès local
kubectl port-forward service/portfolio-service 8080:80

# ============================================
# INGRESS
# ============================================

# Lister les ingress
kubectl get ingress

# Décrire un ingress
kubectl describe ingress portfolio-ingress

# Voir l'IP externe
kubectl get ingress portfolio-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# ============================================
# CONFIGMAPS & SECRETS
# ============================================

# Lister les ConfigMaps
kubectl get configmaps

# Voir le contenu d'un ConfigMap
kubectl get configmap <name> -o yaml

# Lister les Secrets
kubectl get secrets

# Voir les clés d'un Secret (valeurs encodées)
kubectl get secret <name> -o yaml

# Décoder une valeur de secret
kubectl get secret <name> -o jsonpath='{.data.key}' | base64 -d

# ============================================
# ÉVÉNEMENTS
# ============================================

# Voir tous les événements récents
kubectl get events --sort-by='.lastTimestamp'

# Événements d'un namespace spécifique
kubectl get events -n default --sort-by='.lastTimestamp'

# Filtrer les événements par type
kubectl get events --field-selector type=Warning

# ============================================
# RESSOURCES & PERFORMANCE
# ============================================

# Voir l'utilisation des ressources des nodes
kubectl top nodes

# Voir l'utilisation des ressources des pods
kubectl top pods

# Voir l'utilisation d'un pod spécifique
kubectl top pod <pod-name>

# ============================================
# DEBUGGING AVANCÉ
# ============================================

# Créer un pod de debug temporaire
kubectl run debug --image=alpine --rm -it --restart=Never -- sh

# Tester la connectivité réseau
kubectl run debug --image=nicolaka/netshoot --rm -it --restart=Never -- sh

# Dans le pod de debug:
# curl http://portfolio-service/api/health
# nslookup portfolio-service
# ping portfolio-service

# Vérifier les DNS
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup portfolio-service

# ============================================
# NETTOYAGE
# ============================================

# Supprimer un pod (sera recréé par le deployment)
kubectl delete pod <pod-name>

# Supprimer un deployment
kubectl delete deployment portfolio

# Supprimer toutes les ressources d'un label
kubectl delete all -l app=portfolio

# Forcer la suppression d'un pod bloqué
kubectl delete pod <pod-name> --force --grace-period=0
```

### Commandes Docker pour Tests Locaux

```bash
# ============================================
# BUILD & RUN
# ============================================

# Build de l'image
docker build -t portfolio:test .

# Build sans cache
docker build --no-cache -t portfolio:test .

# Build avec logs détaillés
docker build --progress=plain -t portfolio:test .

# Lancer le container
docker run -p 3000:3000 portfolio:test

# Lancer en mode détaché
docker run -d -p 3000:3000 --name portfolio-test portfolio:test

# Lancer avec variables d'environnement
docker run -p 3000:3000 -e NODE_ENV=production portfolio:test

# ============================================
# DEBUGGING
# ============================================

# Voir les containers en cours
docker ps

# Voir tous les containers (y compris arrêtés)
docker ps -a

# Voir les logs d'un container
docker logs portfolio-test

# Suivre les logs
docker logs -f portfolio-test

# Exécuter une commande dans un container
docker exec portfolio-test ls -la

# Ouvrir un shell dans un container
docker exec -it portfolio-test /bin/sh

# Inspecter un container
docker inspect portfolio-test

# Voir les stats en temps réel
docker stats portfolio-test

# ============================================
# IMAGES
# ============================================

# Lister les images
docker images

# Voir l'historique des layers
docker history portfolio:test

# Analyser la taille des layers
docker history portfolio:test --no-trunc

# Supprimer une image
docker rmi portfolio:test

# ============================================
# NETTOYAGE
# ============================================

# Arrêter un container
docker stop portfolio-test

# Supprimer un container
docker rm portfolio-test

# Arrêter et supprimer
docker rm -f portfolio-test

# Nettoyer les images inutilisées
docker image prune

# Nettoyer tout (images, containers, volumes, networks)
docker system prune -a

# Voir l'espace utilisé
docker system df
```

### Commandes GitHub Actions

```bash
# ============================================
# GITHUB CLI (gh)
# ============================================

# Installer GitHub CLI
# macOS: brew install gh
# Linux: voir https://cli.github.com/

# Se connecter
gh auth login

# Lister les workflows
gh workflow list

# Voir les runs d'un workflow
gh run list --workflow=deploy.yml

# Voir les détails d'un run
gh run view <run-id>

# Voir les logs d'un run
gh run view <run-id> --log

# Relancer un workflow échoué
gh run rerun <run-id>

# Déclencher un workflow manuellement
gh workflow run deploy.yml

# Voir le status du dernier run
gh run list --limit 1
```

---

## Procédures de Déploiement Manuel

### Déploiement Manuel Complet

Si le pipeline CI/CD ne fonctionne pas, voici comment déployer manuellement:

```bash
# ============================================
# ÉTAPE 1: BUILD LOCAL
# ============================================

# 1. Cloner le repository
git clone https://github.com/username/monportfolio.git
cd monportfolio

# 2. Installer les dépendances
npm install

# 3. Tester localement
npm run build
npm test

# ============================================
# ÉTAPE 2: BUILD DOCKER
# ============================================

# 4. Build de l'image Docker
docker build -t portfolio:manual-$(date +%Y%m%d-%H%M%S) .

# 5. Tagger l'image
docker tag portfolio:manual-$(date +%Y%m%d-%H%M%S) ghcr.io/username/portfolio:manual
docker tag portfolio:manual-$(date +%Y%m%d-%H%M%S) ghcr.io/username/portfolio:latest

# 6. Se connecter au registry
echo $GHCR_TOKEN | docker login ghcr.io -u username --password-stdin

# 7. Pusher l'image
docker push ghcr.io/username/portfolio:manual
docker push ghcr.io/username/portfolio:latest

# ============================================
# ÉTAPE 3: DÉPLOIEMENT KUBERNETES
# ============================================

# 8. Se connecter au cluster
export KUBECONFIG=~/.kube/config
kubectl cluster-info

# 9. Mettre à jour le tag dans le deployment
kubectl set image deployment/portfolio portfolio=ghcr.io/username/portfolio:manual

# Ou éditer directement:
kubectl edit deployment portfolio
# Changer .spec.template.spec.containers[0].image

# 10. Vérifier le rollout
kubectl rollout status deployment/portfolio

# 11. Vérifier que les pods sont Running
kubectl get pods -l app=portfolio

# 12. Tester l'application
kubectl port-forward service/portfolio-service 8080:80
curl http://localhost:8080/api/health

# ============================================
# ÉTAPE 4: VÉRIFICATION
# ============================================

# 13. Vérifier les logs
kubectl logs -l app=portfolio --tail=50

# 14. Vérifier l'Ingress
kubectl get ingress portfolio-ingress

# 15. Tester en production
curl https://votre-domaine.com/api/health
```

### Déploiement d'une Branche Spécifique

```bash
# 1. Checkout de la branche
git checkout feature-branch

# 2. Build avec un tag spécifique
docker build -t ghcr.io/username/portfolio:feature-branch .

# 3. Push
docker push ghcr.io/username/portfolio:feature-branch

# 4. Déployer dans un namespace séparé (staging)
kubectl create namespace staging

# 5. Copier les secrets dans le namespace staging
kubectl get secret portfolio-secrets -o yaml | \
  sed 's/namespace: default/namespace: staging/' | \
  kubectl apply -f -

# 6. Déployer avec le nouveau tag
kubectl apply -f k8s/ -n staging
kubectl set image deployment/portfolio portfolio=ghcr.io/username/portfolio:feature-branch -n staging

# 7. Vérifier
kubectl get pods -n staging
```

### Mise à Jour des Manifests Kubernetes

```bash
# Appliquer tous les manifests
kubectl apply -f k8s/

# Appliquer un manifest spécifique
kubectl apply -f k8s/deployment.yaml

# Dry-run pour vérifier sans appliquer
kubectl apply -f k8s/ --dry-run=client

# Voir les différences avant d'appliquer
kubectl diff -f k8s/

# Forcer le remplacement
kubectl replace --force -f k8s/deployment.yaml
```

---

## Procédures de Rollback

### Rollback Automatique

Kubernetes effectue un rollback automatique si:
- Les nouveaux pods ne passent pas les health checks
- Le deployment ne progresse pas après `progressDeadlineSeconds` (600s par défaut)

**Vérification**:
```bash
# Voir si un rollback automatique a eu lieu
kubectl describe deployment portfolio | grep -A 10 Conditions
```

### Rollback Manuel via kubectl

```bash
# ============================================
# MÉTHODE 1: Rollback à la révision précédente
# ============================================

# Annuler le dernier déploiement
kubectl rollout undo deployment/portfolio

# Vérifier le status
kubectl rollout status deployment/portfolio

# ============================================
# MÉTHODE 2: Rollback à une révision spécifique
# ============================================

# 1. Voir l'historique des déploiements
kubectl rollout history deployment/portfolio

# Sortie exemple:
# REVISION  CHANGE-CAUSE
# 1         <none>
# 2         Image updated to sha-abc123
# 3         Image updated to sha-def456

# 2. Voir les détails d'une révision
kubectl rollout history deployment/portfolio --revision=2

# 3. Rollback à cette révision
kubectl rollout undo deployment/portfolio --to-revision=2

# 4. Vérifier
kubectl rollout status deployment/portfolio
kubectl get pods -l app=portfolio

# ============================================
# MÉTHODE 3: Rollback via image tag
# ============================================

# 1. Lister les images disponibles dans le registry
# (via l'interface web du registry)

# 2. Déployer une version spécifique
kubectl set image deployment/portfolio \
  portfolio=ghcr.io/username/portfolio:sha-abc123

# 3. Vérifier
kubectl rollout status deployment/portfolio
```

### Rollback via Lens

**Procédure visuelle**:

1. **Ouvrir Lens**
2. **Naviguer vers Workloads → Deployments**
3. **Cliquer sur `portfolio`**
4. **Onglet "Revisions"**
   - Voir toutes les révisions avec timestamps
   - Voir les changements de chaque révision
5. **Sélectionner une révision précédente**
6. **Cliquer sur "Rollback to this revision"**
7. **Confirmer**
8. **Vérifier dans l'onglet "Pods"** que les nouveaux pods démarrent

**Avantages de Lens**:
- Interface visuelle claire
- Voir les différences entre révisions
- Rollback en un clic
- Monitoring en temps réel du rollback

### Rollback via GitHub Actions Workflow

Si vous avez créé le workflow de rollback (task 5):

```bash
# 1. Aller sur GitHub → Actions
# 2. Sélectionner le workflow "Rollback"
# 3. Cliquer sur "Run workflow"
# 4. Entrer le tag de l'image à déployer (ex: sha-abc123)
# 5. Cliquer sur "Run workflow"
# 6. Suivre l'exécution
```

**Ou via GitHub CLI**:

```bash
# Déclencher le workflow de rollback
gh workflow run rollback.yml -f image_tag=sha-abc123

# Suivre l'exécution
gh run watch
```

### Rollback d'Urgence (Downtime Acceptable)

Si vous devez rollback immédiatement et acceptez un court downtime:

```bash
# 1. Supprimer le deployment actuel
kubectl delete deployment portfolio

# 2. Réappliquer avec l'ancienne version
# Éditer k8s/deployment.yaml pour changer l'image tag
nano k8s/deployment.yaml

# 3. Réappliquer
kubectl apply -f k8s/deployment.yaml

# 4. Vérifier
kubectl get pods -l app=portfolio
```

### Vérification Après Rollback

```bash
# 1. Vérifier que tous les pods sont Running et Ready
kubectl get pods -l app=portfolio

# Sortie attendue:
# NAME                         READY   STATUS    RESTARTS   AGE
# portfolio-xxx                1/1     Running   0          2m
# portfolio-yyy                1/1     Running   0          2m
# portfolio-zzz                1/1     Running   0          2m

# 2. Vérifier les logs
kubectl logs -l app=portfolio --tail=20

# 3. Tester l'endpoint de health
kubectl port-forward service/portfolio-service 8080:80
curl http://localhost:8080/api/health

# 4. Tester en production
curl https://votre-domaine.com/api/health

# 5. Vérifier dans Lens
# - Tous les pods verts
# - Pas d'événements d'erreur
# - Métriques normales
```

### Prévention des Problèmes de Rollback

**Bonnes pratiques**:

1. **Toujours tester avant de déployer**
   ```bash
   npm test
   npm run build
   docker build -t test .
   docker run -p 3000:3000 test
   ```

2. **Utiliser des tags d'image explicites**
   - ✅ `sha-abc123` (traçable)
   - ❌ `latest` (ambigu)

3. **Garder un historique des déploiements**
   ```bash
   # Annoter les déploiements
   kubectl annotate deployment portfolio \
     kubernetes.io/change-cause="Deploy version 1.2.3 - Fix bug #123"
   ```

4. **Tester les health checks**
   - S'assurer que `/api/health` fonctionne toujours
   - Tester localement avant de déployer

5. **Monitorer après chaque déploiement**
   - Vérifier les logs pendant 5-10 minutes
   - Vérifier les métriques dans Lens
   - Tester les fonctionnalités critiques

---

## Utilisation de Lens pour le Debugging

### Installation et Configuration

```bash
# 1. Télécharger Lens depuis https://k8slens.dev
# 2. Installer l'application
# 3. Lancer Lens
# 4. Lens détecte automatiquement ~/.kube/config
```

### Navigation dans Lens

#### Vue d'Ensemble du Cluster

1. **Cluster → Overview**
   - Voir le nombre de nodes, pods, services
   - Voir l'utilisation globale des ressources
   - Voir les événements récents

2. **Cluster → Nodes**
   - Liste de tous les nodes
   - Utilisation CPU/RAM par node
   - Pods par node
   - Cliquer sur un node pour voir les détails

#### Debugging des Pods

**Étapes pour debugger un pod**:

1. **Workloads → Pods**
2. **Filtrer par label**: `app=portfolio`
3. **Identifier le pod problématique** (icône rouge/jaune)
4. **Cliquer sur le pod**

**Onglets disponibles**:

- **Overview**
  - Status du pod (Running, Pending, CrashLoopBackOff, etc.)
  - Node sur lequel il tourne
  - IP du pod
  - QoS Class
  - Conditions (Ready, Initialized, etc.)

- **Logs**
  - Logs en temps réel
  - Options:
    - Follow (suivre en temps réel)
    - Wrap (retour à la ligne)
    - Timestamps
    - Previous (logs du container précédent)
  - Recherche dans les logs (Ctrl+F)
  - Télécharger les logs

- **Shell**
  - Terminal interactif dans le pod
  - Commandes utiles:
    ```bash
    # Voir les fichiers
    ls -la
    
    # Tester l'application
    wget -O- http://localhost:3000/api/health
    
    # Voir les variables d'environnement
    env
    
    # Voir les processus
    ps aux
    
    # Tester la connectivité
    ping google.com
    ```

- **Events**
  - Historique des événements du pod
  - Erreurs de scheduling
  - Erreurs de pull d'image
  - Échecs de health checks
  - Restarts

#### Debugging des Deployments

1. **Workloads → Deployments**
2. **Cliquer sur `portfolio`**

**Informations disponibles**:

- **Overview**
  - Nombre de replicas (desired vs actual)
  - Stratégie de mise à jour
  - Conditions (Available, Progressing)
  - Sélecteurs et labels

- **Pods**
  - Liste des pods du deployment
  - Status de chaque pod
  - Accès rapide aux logs

- **Events**
  - Événements du deployment
  - Échecs de scaling
  - Problèmes de rollout

- **Revisions**
  - Historique des révisions
  - Changements entre révisions
  - Rollback en un clic

#### Debugging des Services et Ingress

**Services**:

1. **Network → Services**
2. **Cliquer sur `portfolio-service`**
3. **Voir**:
   - Type de service (ClusterIP, NodePort, LoadBalancer)
   - Ports exposés
   - Endpoints (IPs des pods)
   - Sélecteurs

**Ingress**:

1. **Network → Ingresses**
2. **Cliquer sur `portfolio-ingress`**
3. **Voir**:
   - Règles de routage
   - Configuration TLS
   - Backend services
   - Annotations

#### Debugging des ConfigMaps et Secrets

**ConfigMaps**:

1. **Config → ConfigMaps**
2. **Cliquer sur le ConfigMap**
3. **Voir les données** (en clair)
4. **Éditer directement** si nécessaire

**Secrets**:

1. **Config → Secrets**
2. **Cliquer sur le Secret**
3. **Voir les clés** (valeurs masquées par défaut)
4. **Révéler les valeurs** (icône œil)
5. **Éditer** si nécessaire

#### Monitoring des Ressources

**Métriques en temps réel**:

1. **Workloads → Pods**
2. **Voir les colonnes**:
   - CPU usage (%)
   - Memory usage (MB)
   - Restarts
   - Age

3. **Cliquer sur un pod → Metrics**
   - Graphiques CPU over time
   - Graphiques Memory over time
   - Network I/O

**Alertes visuelles**:

- 🟢 **Vert**: Tout va bien
- 🟡 **Jaune**: Avertissement (ressources élevées, restarts)
- 🔴 **Rouge**: Erreur (pod crashé, health check failed)

#### Fonctionnalités Avancées

**Port Forwarding**:

1. Cliquer sur un pod ou service
2. Cliquer sur l'icône "Port Forward"
3. Choisir le port local et le port du pod
4. Accéder à `localhost:<port>` dans le navigateur

**Exécution de Commandes**:

1. Workloads → Pods → Cliquer sur un pod
2. Onglet "Shell"
3. Terminal interactif complet

**Édition de Ressources**:

1. Cliquer sur n'importe quelle ressource
2. Bouton "Edit" (en haut à droite)
3. Éditer le YAML directement
4. Sauvegarder (applique les changements)

**Suppression de Ressources**:

1. Cliquer sur une ressource
2. Bouton "Delete" (en haut à droite)
3. Confirmer

### Scénarios de Debugging Courants avec Lens

#### Scénario 1: Pod ne démarre pas

1. **Workloads → Pods**
2. **Identifier le pod rouge**
3. **Cliquer dessus**
4. **Onglet "Events"** → Voir la raison (ImagePullBackOff, CrashLoopBackOff, etc.)
5. **Onglet "Logs"** → Voir les erreurs de l'application
6. **Corriger le problème**
7. **Supprimer le pod** (sera recréé automatiquement)

#### Scénario 2: Application lente ou non-responsive

1. **Workloads → Pods**
2. **Vérifier la colonne CPU/Memory**
3. **Identifier les pods avec haute utilisation**
4. **Cliquer sur le pod → Metrics**
5. **Voir les graphiques** pour identifier les pics
6. **Onglet "Shell"** → Investiguer dans le pod
7. **Ajuster les resource limits** si nécessaire

#### Scénario 3: Certificat TLS ne fonctionne pas

1. **Config → Certificates**
2. **Vérifier `portfolio-tls`**
3. **Status devrait être "Ready: True"**
4. **Si "Ready: False"**:
   - Cliquer dessus
   - Onglet "Events" → Voir les erreurs
   - Vérifier les challenges Let's Encrypt
5. **Network → Ingresses**
6. **Vérifier la configuration TLS**

#### Scénario 4: Rollback nécessaire

1. **Workloads → Deployments → portfolio**
2. **Onglet "Revisions"**
3. **Voir l'historique des déploiements**
4. **Sélectionner une révision stable**
5. **Cliquer "Rollback to this revision"**
6. **Confirmer**
7. **Onglet "Pods"** → Vérifier que les nouveaux pods démarrent

---

## Récupération après Incident

### Incident: Cluster Inaccessible

**Symptômes**:
- `kubectl` ne répond pas
- Lens ne peut pas se connecter
- Erreur: "Unable to connect to the server"

**Actions**:

```bash
# 1. Vérifier la connectivité réseau
ping <cluster-ip>

# 2. Vérifier le kubeconfig
kubectl config view
kubectl config get-contexts

# 3. Tester la connexion
kubectl cluster-info

# 4. Vérifier les credentials
kubectl config use-context <context-name>

# 5. Si le cluster est down, contacter l'administrateur
# ou redémarrer les nodes si vous avez accès
```

### Incident: Tous les Pods Crashent

**Symptômes**:
- Tous les pods en CrashLoopBackOff
- Application complètement down

**Actions**:

```bash
# 1. Rollback immédiat
kubectl rollout undo deployment/portfolio

# 2. Vérifier le status
kubectl rollout status deployment/portfolio

# 3. Si le rollback échoue, déployer une version connue
kubectl set image deployment/portfolio \
  portfolio=ghcr.io/username/portfolio:<version-stable>

# 4. Investiguer la cause
kubectl logs -l app=portfolio --previous --tail=100

# 5. Corriger et redéployer
```

### Incident: Certificat Expiré

**Symptômes**:
- HTTPS ne fonctionne plus
- Erreur: "Certificate expired"

**Actions**:

```bash
# 1. Vérifier l'expiration
kubectl get certificate portfolio-tls -o yaml

# 2. Forcer le renouvellement
kubectl delete certificate portfolio-tls

# 3. Vérifier que cert-manager fonctionne
kubectl get pods -n cert-manager

# 4. Attendre la création du nouveau certificat (2-5 minutes)
kubectl get certificate portfolio-tls --watch

# 5. Vérifier que le certificat est Ready
kubectl describe certificate portfolio-tls
```

### Incident: Ressources Épuisées

**Symptômes**:
- Pods en état Pending
- Message: "Insufficient cpu" ou "Insufficient memory"

**Actions**:

```bash
# 1. Vérifier les ressources du cluster
kubectl top nodes

# 2. Identifier les pods gourmands
kubectl top pods --all-namespaces --sort-by=memory
kubectl top pods --all-namespaces --sort-by=cpu

# 3. Option A: Réduire les replicas temporairement
kubectl scale deployment portfolio --replicas=1

# 4. Option B: Réduire les resource requests
kubectl edit deployment portfolio
# Modifier requests.memory et requests.cpu

# 5. Option C: Ajouter des nodes au cluster (si possible)

# 6. Nettoyer les ressources inutilisées
kubectl delete pods --field-selector=status.phase=Failed
kubectl delete pods --field-selector=status.phase=Succeeded
```

### Incident: Données Corrompues

**Symptômes**:
- Application démarre mais comportement anormal
- Erreurs de base de données

**Actions**:

```bash
# 1. Identifier le problème
kubectl logs -l app=portfolio --tail=100

# 2. Si c'est un problème de ConfigMap/Secret
kubectl get configmap portfolio-config -o yaml
kubectl get secret portfolio-secrets -o yaml

# 3. Corriger les données
kubectl edit configmap portfolio-config
kubectl edit secret portfolio-secrets

# 4. Redémarrer les pods pour charger les nouvelles données
kubectl rollout restart deployment/portfolio

# 5. Vérifier
kubectl logs -l app=portfolio --tail=50
```

### Plan de Récupération d'Urgence

**Checklist de récupération**:

1. ✅ **Évaluer la situation**
   - Quel est le problème exact?
   - Quelle est l'ampleur (1 pod, tous les pods, cluster entier)?
   - Y a-t-il des données perdues?

2. ✅ **Stabiliser**
   - Rollback à une version stable
   - Réduire les replicas si nécessaire
   - Isoler les composants problématiques

3. ✅ **Communiquer**
   - Informer les utilisateurs (si applicable)
   - Documenter l'incident
   - Estimer le temps de résolution

4. ✅ **Investiguer**
   - Collecter les logs
   - Identifier la cause racine
   - Documenter les findings

5. ✅ **Corriger**
   - Appliquer le fix
   - Tester en staging (si disponible)
   - Déployer en production

6. ✅ **Vérifier**
   - Tous les pods Running?
   - Application accessible?
   - Fonctionnalités OK?
   - Métriques normales?

7. ✅ **Post-mortem**
   - Documenter l'incident
   - Identifier les améliorations
   - Mettre à jour les procédures

---

## FAQ

### Questions Générales

**Q: Combien de temps prend un déploiement?**

R: En moyenne:
- Build et tests: 3-5 minutes
- Build Docker: 2-3 minutes
- Push vers registry: 1-2 minutes
- Déploiement Kubernetes: 2-3 minutes
- **Total: 8-13 minutes**

---

**Q: Puis-je déployer sans passer par GitHub Actions?**

R: Oui, voir la section [Procédures de Déploiement Manuel](#procédures-de-déploiement-manuel).

---

**Q: Comment voir les logs en temps réel?**

R: Plusieurs options:
```bash
# Via kubectl
kubectl logs -f -l app=portfolio

# Via Lens
# Workloads → Pods → Cliquer sur un pod → Onglet "Logs" → Activer "Follow"
```

---

**Q: Comment tester l'application avant qu'elle soit accessible publiquement?**

R: Utiliser port-forward:
```bash
kubectl port-forward service/portfolio-service 8080:80
# Puis accéder à http://localhost:8080
```

---

### Questions sur les Déploiements

**Q: Pourquoi mon déploiement prend-il autant de temps?**

R: Causes possibles:
- Pull de l'image Docker lent (image volumineuse ou connexion lente)
- Health checks avec délai initial élevé
- Ressources insuffisantes (pods en attente de ressources)

Solution: Vérifier avec `kubectl describe deployment portfolio`

---

**Q: Puis-je déployer plusieurs versions en même temps?**

R: Oui, en utilisant des namespaces différents:
```bash
# Production
kubectl apply -f k8s/ -n production

# Staging
kubectl apply -f k8s/ -n staging
```

---

**Q: Comment annuler un déploiement en cours?**

R:
```bash
# Rollback immédiat
kubectl rollout undo deployment/portfolio

# Ou pause puis undo
kubectl rollout pause deployment/portfolio
kubectl rollout undo deployment/portfolio
kubectl rollout resume deployment/portfolio
```

---

### Questions sur les Erreurs

**Q: Que signifie "ImagePullBackOff"?**

R: Kubernetes ne peut pas télécharger l'image Docker. Causes:
- Image n'existe pas
- Tag incorrect
- Credentials manquants
- Registry inaccessible

Voir: [Problème: Les pods ne démarrent pas (ImagePullBackOff)](#problème-les-pods-ne-démarrent-pas-imagepullbackoff)

---

**Q: Que signifie "CrashLoopBackOff"?**

R: Le pod démarre puis crash immédiatement, et Kubernetes le redémarre en boucle. Causes:
- Erreur dans l'application
- Configuration incorrecte
- Dépendances manquantes

Voir: [Problème: Pods en CrashLoopBackOff](#problème-pods-en-crashloopbackoff)

---

**Q: Pourquoi mes pods sont "Running" mais pas "Ready"?**

R: Les readiness probes échouent. L'application démarre mais ne répond pas correctement au health check.

Voir: [Problème: Readiness probe échoue](#problème-readiness-probe-échoue)

---

### Questions sur Lens

**Q: Lens ne voit pas mon cluster**

R:
1. Vérifier que `~/.kube/config` existe et est valide
2. Dans Lens: File → Add Cluster → Coller le kubeconfig
3. Vérifier la connectivité: `kubectl cluster-info`

---

**Q: Comment voir les métriques dans Lens?**

R: Lens affiche automatiquement les métriques si metrics-server est installé dans le cluster:
```bash
# Vérifier metrics-server
kubectl get deployment metrics-server -n kube-system

# Installer si nécessaire
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

---

**Q: Puis-je éditer les ressources directement dans Lens?**

R: Oui:
1. Cliquer sur n'importe quelle ressource
2. Bouton "Edit" en haut à droite
3. Modifier le YAML
4. Sauvegarder (applique immédiatement)

---

### Questions sur la Sécurité

**Q: Mes secrets sont-ils sécurisés?**

R: Oui, si vous suivez les bonnes pratiques:
- ✅ Secrets stockés dans GitHub Secrets (chiffrés)
- ✅ Secrets Kubernetes (chiffrés at rest)
- ✅ Secrets masqués dans les logs GitHub Actions
- ❌ Ne jamais commiter de secrets dans le code
- ❌ Ne jamais logger les secrets

---

**Q: Comment changer un secret?**

R:
```bash
# Méthode 1: Éditer directement
kubectl edit secret portfolio-secrets

# Méthode 2: Recréer
kubectl delete secret portfolio-secrets
kubectl create secret generic portfolio-secrets \
  --from-literal=KEY=nouvelle-valeur

# Redémarrer les pods pour charger le nouveau secret
kubectl rollout restart deployment/portfolio
```

---

**Q: Comment savoir si mes secrets sont exposés?**

R: Vérifier:
1. Logs GitHub Actions (secrets automatiquement masqués)
2. Logs des pods: `kubectl logs <pod-name>` (ne devrait pas contenir de secrets)
3. Variables d'environnement: `kubectl exec <pod-name> -- env` (secrets visibles ici, c'est normal)

---

### Questions sur les Performances

**Q: Comment augmenter le nombre de replicas?**

R:
```bash
# Temporairement
kubectl scale deployment portfolio --replicas=5

# Définitivement
# Éditer k8s/deployment.yaml et changer replicas: 5
kubectl apply -f k8s/deployment.yaml
```

---

**Q: Comment activer l'autoscaling?**

R:
```bash
# Créer un HorizontalPodAutoscaler
kubectl autoscale deployment portfolio \
  --cpu-percent=70 \
  --min=3 \
  --max=10

# Vérifier
kubectl get hpa
```

---

**Q: Mon application est lente, comment investiguer?**

R:
1. Vérifier les ressources:
   ```bash
   kubectl top pods -l app=portfolio
   ```
2. Vérifier les logs pour des erreurs
3. Utiliser Lens pour voir les métriques en temps réel
4. Augmenter les resource limits si nécessaire

---

### Questions sur les Certificats

**Q: Combien de temps pour obtenir un certificat?**

R: Généralement 2-5 minutes après la création de l'Ingress. Let's Encrypt doit valider le domaine via HTTP-01 challenge.

---

**Q: Mon certificat est "Pending" depuis longtemps**

R: Vérifier:
```bash
# Status du certificat
kubectl describe certificate portfolio-tls

# Challenges en cours
kubectl get challenges

# Logs de cert-manager
kubectl logs -n cert-manager deployment/cert-manager
```

Causes courantes:
- DNS pas encore propagé
- Ingress Controller pas configuré correctement
- Firewall bloque le port 80

---

**Q: Puis-je utiliser mon propre certificat?**

R: Oui:
```bash
# Créer un secret TLS
kubectl create secret tls portfolio-tls \
  --cert=path/to/cert.crt \
  --key=path/to/cert.key

# Retirer l'annotation cert-manager de l'Ingress
kubectl annotate ingress portfolio-ingress cert-manager.io/cluster-issuer-
```

---

## Ressources Supplémentaires

### Documentation Officielle

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Lens Documentation](https://docs.k8slens.dev/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)

### Outils Utiles

- **kubectl**: CLI Kubernetes
- **Lens**: Interface graphique Kubernetes
- **k9s**: Terminal UI pour Kubernetes
- **stern**: Multi-pod log tailing
- **kubectx/kubens**: Changer de contexte/namespace rapidement

### Commandes d'Installation

```bash
# kubectl (si pas déjà installé)
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Lens
# Télécharger depuis https://k8slens.dev

# k9s (optionnel)
brew install k9s

# stern (optionnel)
brew install stern

# kubectx/kubens (optionnel)
brew install kubectx
```

---

**Dernière mise à jour**: Décembre 2024  
**Version**: 1.0.0

**Pour toute question ou problème non couvert dans ce guide, consulter**:
- [Guide de Déploiement](./DEPLOYMENT.md)
- [Documentation du projet](../README.md)
- Issues GitHub du projetnamespace: staging/' | \
  kubectl apply -f -

# 6. Déployer avec le nouveau tag
kubectl apply -f k8s/ -n staging
kubectl set image deployment/portfolio portfolio=ghcr.io/username/portfolio:feature-branch -n staging

# 7. Vérifier
kubectl get pods -n staging
```

### Mise à Jour des Manifests Kubernetes

```bash
# Appliquer tous les manifests
kubectl apply -f k8s/

# Appliquer un manifest spécifique
kubectl apply -f k8s/deployment.yaml

# Dry-run pour vérifier sans appliquer
kubectl apply -f k8s/ --dry-run=client

# Voir les différences avant d'appliquer
kubectl diff -f k8s/

# Forcer le remplacement
kubectl replace --force -f k8s/deployment.yaml
```

---

## Procédures de Rollback

### Rollback Automatique

Kubernetes effectue un rollback automatique si:
- Les nouveaux pods ne passent pas les health checks
- Le deployment ne progresse pas après `progressDeadlineSeconds` (600s par défaut)

**Vérification**:
```bash
# Voir si un rollback automatique a eu lieu
kubectl describe deployment portfolio | grep -A 10 Conditions
```

### Rollback Manuel via kubectl

```bash
# ============================================
# MÉTHODE 1: Rollback à la révision précédente
# ============================================

# Annuler le dernier déploiement
kubectl rollout undo deployment/portfolio

# Vérifier le status
kubectl rollout status deployment/portfolio

# ============================================
# MÉTHODE 2: Rollback à une révision spécifique
# ============================================

# 1. Voir l'historique des déploiements
kubectl rollout history deployment/portfolio

# Sortie exemple:
# REVISION  CHANGE-CAUSE
# 1         <none>
# 2         Image updated to sha-abc123
# 3         Image updated to sha-def456

# 2. Voir les détails d'une révision
kubectl rollout history deployment/portfolio --revision=2

# 3. Rollback à cette révision
kubectl rollout undo deployment/portfolio --to-revision=2

# 4. Vérifier
kubectl rollout status deployment/portfolio
kubectl get pods -l app=portfolio

# ============================================
# MÉTHODE 3: Rollback via image tag
# ============================================

# 1. Lister les images disponibles dans le registry
# (via l'interface web du registry)

# 2. Déployer une version spécifique
kubectl set image deployment/portfolio \
  portfolio=ghcr.io/username/portfolio:sha-abc123

# 3. Vérifier
kubectl rollout status deployment/portfolio
```

### Rollback via Lens

**Procédure visuelle**:

1. **Ouvrir Lens**
2. **Naviguer vers Workloads → Deployments**
3. **Cliquer sur `portfolio`**
4. **Onglet "Revisions"**
   - Voir toutes les révisions avec timestamps
   - Voir les changements de chaque révision
5. **Sélectionner une révision précédente**
6. **Cliquer sur "Rollback to this revision"**
7. **Confirmer**
8. **Vérifier dans l'onglet "Pods"** que les nouveaux pods démarrent

**Avantages de Lens**:
- Interface visuelle claire
- Voir les différences entre révisions
- Rollback en un clic
- Monitoring en temps réel du rollback

### Rollback via GitHub Actions Workflow

Si vous avez créé le workflow de rollback (task 5):

```bash
# 1. Aller sur GitHub → Actions
# 2. Sélectionner le workflow "Rollback"
# 3. Cliquer sur "Run workflow"
# 4. Entrer le tag de l'image à déployer (ex: sha-abc123)
# 5. Cliquer sur "Run workflow"
# 6. Suivre l'exécution
```

**Ou via GitHub CLI**:

```bash
# Déclencher le workflow de rollback
gh workflow run rollback.yml -f image_tag=sha-abc123

# Suivre l'exécution
gh run watch
```

### Rollback d'Urgence (Downtime Acceptable)

Si vous devez rollback immédiatement et acceptez un court downtime:

```bash
# 1. Supprimer le deployment actuel
kubectl delete deployment portfolio

# 2. Réappliquer avec l'ancienne version
# Éditer k8s/deployment.yaml pour changer l'image tag
nano k8s/deployment.yaml

# 3. Réappliquer
kubectl apply -f k8s/deployment.yaml

# 4. Vérifier
kubectl get pods -l app=portfolio
```

### Vérification Après Rollback

```bash
# 1. Vérifier que tous les pods sont Running et Ready
kubectl get pods -l app=portfolio

# Sortie attendue:
# NAME                         READY   STATUS    RESTARTS   AGE
# portfolio-xxx                1/1     Running   0          2m
# portfolio-yyy                1/1     Running   0          2m
# portfolio-zzz                1/1     Running   0          2m

# 2. Vérifier les logs
kubectl logs -l app=portfolio --tail=20

# 3. Tester l'endpoint de health
kubectl port-forward service/portfolio-service 8080:80
curl http://localhost:8080/api/health

# 4. T-

tiques

--nalités critionles fonc- Tester 
   ans Lenstriques d les méifier- Véres
   -10 minutdant 5s penes log Vérifier l*
   -ploiement* chaque déorer après
5. **Monitloyer
nt de dépnt avater localeme- Tes
   nne toujours` fonctioealthe `/api/hassurer qu   - S'h checks**
ealtes h*Tester l ```

4. *123"
   # bug3 - Fix 1.2.on versi"Deploye-cause=s.io/changbernete
     ku \oliotfpornt  deploymennotatekubectl as
   déploiementnnoter les    # Abash
``nts**
   `oiemes déple dehistoriqu*Garder un  *)

3.(ambiguest`   - ❌ `lattraçable)
 23` (bc1 - ✅ `sha-a*
  ites*icimage expls tags d'iser de
2. **Util
   ```
00 test00:30 run -p 30ckerest .
   douild -t t   docker b
 run build   npmm test
bash
   npr**
   ```éployeant de dter av tesoujours*T. ***:

1 pratiquesesck

**Bonne Rollbaes des Problèmntion d### Préve
les
```
 norma- Métriqueserreur
# nts d'vénemes d'é
# - Pavertsods ous les ps
# - Tdans Len Vérifier 
# 5.pi/health
maine.com/a://votre-dol httpsduction
curester en pro