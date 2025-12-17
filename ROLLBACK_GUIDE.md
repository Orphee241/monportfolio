# Guide de Rollback - Déploiement Kubernetes

Ce guide explique comment effectuer un rollback (retour en arrière) de votre déploiement portfolio sur Kubernetes en cas de problème.

## Vue d'ensemble

Le workflow de rollback permet de revenir rapidement à une version stable de l'application en cas de :
- Déploiement défectueux
- Bugs critiques en production
- Échec des health checks
- Problèmes de performance

## Types de Rollback

### 1. Rollback Automatique

Kubernetes effectue automatiquement un rollback si :
- Les health checks (liveness/readiness probes) échouent
- Les nouveaux pods ne démarrent pas correctement
- Le déploiement dépasse le délai de progression

**Configuration** : Définie dans `k8s/deployment.yaml`
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

### 2. Rollback Manuel

Utilisez le workflow GitHub Actions pour un rollback manuel contrôlé.

## Utilisation du Workflow de Rollback

### Prérequis

- Accès au repository GitHub avec permissions Actions
- Secrets GitHub configurés :
  - `KUBECONFIG` : Configuration kubectl encodée en base64
  - `K8S_NAMESPACE` (optionnel) : Namespace Kubernetes

### Étapes pour effectuer un rollback

#### Option A : Rollback par Tag d'Image

1. **Accédez à GitHub Actions**
   - Allez sur votre repository GitHub
   - Cliquez sur l'onglet "Actions"
   - Sélectionnez "Rollback Deployment" dans la liste des workflows

2. **Lancez le workflow**
   - Cliquez sur "Run workflow"
   - Remplissez les paramètres :
     - **Version** : Le tag de l'image (ex: `sha-abc1234` ou `latest`)
     - **Rollback Type** : Sélectionnez `image-tag`
     - **Namespace** : Laissez `default` ou spécifiez votre namespace

3. **Exemple de tags d'image**
   ```
   sha-a1b2c3d    # Version spécifique par commit SHA
   latest         # Dernière version buildée
   sha-e4f5g6h    # Version précédente
   ```

4. **Cliquez sur "Run workflow"**

#### Option B : Rollback par Numéro de Révision

1. **Trouvez le numéro de révision**
   
   Via Lens :
   - Ouvrez Lens
   - Naviguez vers Workloads → Deployments
   - Sélectionnez le deployment `portfolio`
   - Consultez l'historique des révisions

   Via kubectl :
   ```bash
   kubectl rollout history deployment/portfolio
   ```

2. **Lancez le workflow**
   - Accédez à GitHub Actions → "Rollback Deployment"
   - Cliquez sur "Run workflow"
   - Remplissez les paramètres :
     - **Version** : Le numéro de révision (ex: `2`, `3`)
     - **Rollback Type** : Sélectionnez `revision-number`
     - **Namespace** : Laissez `default` ou spécifiez votre namespace

3. **Cliquez sur "Run workflow"**

### Que fait le workflow ?

Le workflow de rollback effectue les actions suivantes :

1. **Affichage du statut actuel**
   - État du deployment
   - Liste des pods
   - Historique des déploiements

2. **Exécution du rollback**
   - Par image tag : Met à jour le manifest et applique les changements
   - Par révision : Utilise `kubectl rollout undo`

3. **Attente de la complétion**
   - Attend que le rollback soit terminé (timeout: 5 minutes)
   - Vérifie que les pods sont prêts

4. **Vérification de la santé**
   - Vérifie que tous les pods passent les health checks
   - Confirme que l'application est accessible

5. **Résumé du rollback**
   - Affiche le statut final
   - Liste les pods actifs
   - Montre l'historique des déploiements

## Rollback via Kubectl (Ligne de commande)

Si vous avez accès direct au cluster via kubectl :

### Rollback à la révision précédente
```bash
kubectl rollout undo deployment/portfolio -n default
```

### Rollback à une révision spécifique
```bash
kubectl rollout undo deployment/portfolio -n default --to-revision=3
```

### Vérifier le statut du rollback
```bash
kubectl rollout status deployment/portfolio -n default
```

### Voir l'historique des déploiements
```bash
kubectl rollout history deployment/portfolio -n default
```

### Voir les détails d'une révision
```bash
kubectl rollout history deployment/portfolio -n default --revision=3
```

## Rollback via Lens

Lens offre une interface graphique pour gérer les rollbacks :

1. **Ouvrez Lens** et connectez-vous à votre cluster

2. **Naviguez vers le deployment**
   - Workloads → Deployments
   - Sélectionnez `portfolio`

3. **Consultez l'historique**
   - Cliquez sur l'onglet "Revisions"
   - Vous verrez toutes les révisions précédentes

4. **Effectuez le rollback**
   - Cliquez sur le bouton "Rollback" à côté de la révision souhaitée
   - Confirmez l'action

5. **Surveillez le rollback**
   - Observez les pods se recréer
   - Vérifiez que les nouveaux pods sont "Running" et "Ready"

## Vérification après Rollback

### 1. Vérifier les pods
```bash
kubectl get pods -l app=portfolio -n default
```

Tous les pods doivent être dans l'état `Running` avec `READY 1/1`.

### 2. Vérifier les logs
```bash
kubectl logs -l app=portfolio -n default --tail=50
```

### 3. Tester l'application
- Accédez à votre application via l'URL Ingress
- Vérifiez que l'application fonctionne correctement
- Testez les fonctionnalités critiques

### 4. Vérifier les health checks
```bash
kubectl describe pods -l app=portfolio -n default | grep -A 10 "Liveness\|Readiness"
```

## Scénarios Courants

### Scénario 1 : Déploiement avec bug critique

**Symptômes** :
- Application ne répond pas
- Erreurs 500
- Logs montrent des exceptions

**Solution** :
1. Identifiez la dernière version stable (ex: `sha-abc1234`)
2. Lancez le rollback par image tag
3. Vérifiez que l'application fonctionne
4. Corrigez le bug dans le code
5. Redéployez après tests

### Scénario 2 : Health checks échouent

**Symptômes** :
- Pods en état `CrashLoopBackOff`
- Readiness probe échoue
- Kubernetes effectue un rollback automatique

**Solution** :
1. Vérifiez les logs : `kubectl logs <pod-name>`
2. Si le rollback automatique n'a pas fonctionné, effectuez un rollback manuel
3. Corrigez le problème de health check
4. Redéployez

### Scénario 3 : Problème de configuration

**Symptômes** :
- Application démarre mais ne fonctionne pas correctement
- Variables d'environnement incorrectes

**Solution** :
1. Effectuez un rollback à la version précédente
2. Corrigez le ConfigMap ou les Secrets
3. Redéployez avec la configuration corrigée

### Scénario 4 : Problème de performance

**Symptômes** :
- Application lente
- Utilisation CPU/mémoire élevée
- Timeouts

**Solution** :
1. Effectuez un rollback immédiat
2. Analysez les métriques de performance
3. Optimisez le code ou ajustez les ressources
4. Testez en staging avant de redéployer

## Bonnes Pratiques

### Avant le Rollback

1. **Documentez le problème**
   - Capturez les logs
   - Notez les symptômes
   - Prenez des screenshots si nécessaire

2. **Identifiez la version stable**
   - Consultez l'historique des déploiements
   - Vérifiez les tags d'images dans le registry

3. **Communiquez**
   - Informez l'équipe
   - Notez l'heure du rollback

### Pendant le Rollback

1. **Surveillez le processus**
   - Observez les pods dans Lens
   - Vérifiez les logs en temps réel
   - Attendez que tous les pods soient prêts

2. **Ne paniquez pas**
   - Le rollback est conçu pour être sûr
   - Zero downtime grâce à la stratégie RollingUpdate

### Après le Rollback

1. **Vérifiez complètement**
   - Testez toutes les fonctionnalités critiques
   - Vérifiez les métriques
   - Consultez les logs

2. **Analysez la cause**
   - Identifiez ce qui a causé le problème
   - Documentez pour éviter la répétition

3. **Planifiez la correction**
   - Corrigez le bug
   - Testez en local et en staging
   - Redéployez quand prêt

## Prévention des Problèmes

### Tests avant déploiement

1. **Tests locaux**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

2. **Tests Docker**
   ```bash
   docker build -t portfolio:test .
   docker run -p 3000:3000 portfolio:test
   ```

3. **Tests Kubernetes (staging)**
   - Déployez d'abord en staging
   - Testez complètement
   - Puis déployez en production

### Monitoring continu

1. **Surveillez les métriques**
   - CPU et mémoire des pods
   - Taux d'erreur
   - Temps de réponse

2. **Configurez des alertes**
   - Health checks échouent
   - Pods redémarrent fréquemment
   - Utilisation des ressources élevée

3. **Revoyez régulièrement**
   - Historique des déploiements
   - Logs d'erreurs
   - Métriques de performance

## Dépannage

### Le rollback échoue

**Problème** : Le workflow de rollback échoue

**Solutions** :
1. Vérifiez que `KUBECONFIG` est correctement configuré dans les secrets GitHub
2. Vérifiez que l'image existe dans le registry
3. Vérifiez les permissions kubectl
4. Consultez les logs du workflow GitHub Actions

### Les pods ne démarrent pas après rollback

**Problème** : Les pods restent en `Pending` ou `CrashLoopBackOff`

**Solutions** :
1. Vérifiez les ressources du cluster : `kubectl describe nodes`
2. Vérifiez les logs : `kubectl logs <pod-name>`
3. Vérifiez les events : `kubectl get events --sort-by='.lastTimestamp'`
4. Vérifiez que l'image est accessible

### Health checks échouent après rollback

**Problème** : Les readiness probes échouent

**Solutions** :
1. Vérifiez que `/api/health` est accessible
2. Testez manuellement : `kubectl port-forward <pod-name> 3000:3000`
3. Vérifiez les logs de l'application
4. Ajustez les délais des probes si nécessaire

## Support et Ressources

### Documentation Kubernetes
- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Rolling Updates](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)
- [Rollback](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-back-a-deployment)

### Commandes Utiles

```bash
# Voir tous les déploiements
kubectl get deployments -n default

# Voir les pods
kubectl get pods -l app=portfolio -n default

# Voir les logs
kubectl logs -f <pod-name> -n default

# Décrire un pod
kubectl describe pod <pod-name> -n default

# Voir les events
kubectl get events -n default --sort-by='.lastTimestamp'

# Voir l'historique des rollouts
kubectl rollout history deployment/portfolio -n default

# Voir le statut du rollout
kubectl rollout status deployment/portfolio -n default

# Pause un rollout
kubectl rollout pause deployment/portfolio -n default

# Reprendre un rollout
kubectl rollout resume deployment/portfolio -n default
```

## Conclusion

Le système de rollback est conçu pour vous permettre de revenir rapidement à une version stable en cas de problème. Avec les rollbacks automatiques de Kubernetes et le workflow manuel GitHub Actions, vous avez plusieurs options pour maintenir votre application en état de fonctionnement.

N'oubliez pas : un bon rollback est rapide, mais une bonne prévention est encore meilleure. Testez toujours vos déploiements en staging avant la production !
