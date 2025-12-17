# Kubernetes Manifests

Ce répertoire contient tous les manifests Kubernetes nécessaires pour déployer le portfolio Next.js sur un cluster Kubernetes.

## Fichiers

### deployment.yaml
Définit le Deployment Kubernetes avec :
- **3 replicas** pour la haute disponibilité
- **Rolling update strategy** avec maxUnavailable=0 pour zero downtime
- **Resource limits** : 256Mi-512Mi RAM, 100m-500m CPU
- **Health checks** : liveness et readiness probes sur `/api/health`
- **ConfigMap** : référence à `portfolio-config` pour les variables d'environnement

### service.yaml
Définit le Service Kubernetes avec :
- **Type** : ClusterIP (exposition interne uniquement)
- **Port** : 80 (externe) → 3000 (container)
- **Selector** : app=portfolio

### ingress.yaml
Définit l'Ingress pour l'accès externe avec :
- **TLS/HTTPS** : Configuration automatique via cert-manager
- **Redirect HTTP→HTTPS** : Automatique via annotations nginx
- **Host** : portfolio.example.com (à remplacer par votre domaine)
- **Path** : / (root path)

### configmap.yaml
Définit le ConfigMap avec les variables d'environnement non-sensibles :
- Configuration de l'application
- URLs publiques
- Feature flags
- Paramètres de logging

### secrets.yaml.example
Template pour créer les Secrets Kubernetes :
- **NE PAS** commiter de vraies valeurs
- Copier vers `secrets.yaml` et remplir avec des valeurs base64
- Ou utiliser `kubectl create secret` directement

## Ordre d'application

Pour déployer l'application, appliquez les manifests dans cet ordre :

```bash
# 1. ConfigMap (configuration non-sensible)
kubectl apply -f configmap.yaml

# 2. Secrets (si nécessaire)
kubectl create secret generic portfolio-secrets \
  --from-literal=API_KEY="your-api-key"

# 3. Deployment (pods)
kubectl apply -f deployment.yaml

# 4. Service (exposition interne)
kubectl apply -f service.yaml

# 5. Ingress (exposition externe)
kubectl apply -f ingress.yaml
```

Ou appliquer tous les manifests en une fois :
```bash
kubectl apply -f k8s/
```

## Vérification

Après le déploiement, vérifiez l'état :

```bash
# Vérifier les pods
kubectl get pods -l app=portfolio

# Vérifier le deployment
kubectl get deployment portfolio

# Vérifier le service
kubectl get service portfolio-service

# Vérifier l'ingress
kubectl get ingress portfolio-ingress

# Voir les logs
kubectl logs -l app=portfolio --tail=100 -f
```

## Configuration requise

### Prérequis du cluster

1. **Ingress Controller** : nginx-ingress doit être installé
   ```bash
   kubectl get pods -n ingress-nginx
   ```

2. **cert-manager** : Pour les certificats TLS automatiques
   ```bash
   kubectl get pods -n cert-manager
   ```

3. **ClusterIssuer** : Pour Let's Encrypt
   ```bash
   kubectl get clusterissuer letsencrypt-prod
   ```

### Variables à personnaliser

Avant de déployer, modifiez ces valeurs :

1. **ingress.yaml** :
   - Remplacer `portfolio.example.com` par votre domaine
   - Vérifier le nom du ClusterIssuer cert-manager

2. **configmap.yaml** :
   - Mettre à jour `NEXT_PUBLIC_APP_URL` avec votre domaine
   - Ajuster les autres variables selon vos besoins

3. **deployment.yaml** :
   - L'image sera mise à jour automatiquement par CI/CD
   - Les placeholders `REGISTRY_PLACEHOLDER` et `TAG_PLACEHOLDER` seront remplacés

## Mise à jour

Pour mettre à jour l'application :

```bash
# Via CI/CD (automatique)
git push origin main

# Manuellement
kubectl set image deployment/portfolio \
  portfolio=your-registry/portfolio:new-tag

# Vérifier le rollout
kubectl rollout status deployment/portfolio
```

## Rollback

En cas de problème :

```bash
# Rollback automatique (si health checks échouent)
# Kubernetes le fait automatiquement

# Rollback manuel
kubectl rollout undo deployment/portfolio

# Rollback vers une version spécifique
kubectl rollout undo deployment/portfolio --to-revision=2

# Voir l'historique
kubectl rollout history deployment/portfolio
```

## Monitoring avec Lens

1. Ouvrir Lens et se connecter au cluster
2. Naviguer vers **Workloads** → **Deployments**
3. Sélectionner `portfolio`
4. Voir :
   - Status des pods
   - Resource usage (CPU, RAM)
   - Logs en temps réel
   - Events et erreurs

## Troubleshooting

### Pods en CrashLoopBackOff
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Image pull errors
```bash
# Vérifier les secrets du registry
kubectl get secrets
kubectl describe secret <registry-secret>
```

### Health check failures
```bash
# Tester le endpoint localement
kubectl port-forward deployment/portfolio 3000:3000
curl http://localhost:3000/api/health
```

### Ingress non accessible
```bash
# Vérifier l'ingress
kubectl describe ingress portfolio-ingress

# Vérifier les logs nginx
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### Certificat TLS non provisionné
```bash
# Vérifier cert-manager
kubectl get certificate
kubectl describe certificate portfolio-tls

# Vérifier les challenges
kubectl get challenges
```

## Sécurité

- ✅ Secrets chiffrés au repos dans Kubernetes
- ✅ TLS/HTTPS obligatoire via Ingress
- ✅ Pas de secrets hardcodés dans les manifests
- ✅ Resource limits pour éviter la surconsommation
- ✅ Health checks pour la détection automatique des problèmes
- ✅ Rolling updates pour zero downtime

## Support

Pour plus d'informations, consultez :
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation nginx-ingress](https://kubernetes.github.io/ingress-nginx/)
- [Documentation cert-manager](https://cert-manager.io/docs/)
- [Documentation Lens](https://docs.k8slens.dev/)
