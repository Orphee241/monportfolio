# GitHub Actions Workflows

Ce répertoire contient les workflows GitHub Actions pour le déploiement et la gestion du portfolio sur Kubernetes.

## Workflows Disponibles

### 1. Deploy to Kubernetes (`deploy.yml`)

**Déclenchement** : Automatique sur push vers la branche `main`

**Fonctionnalités** :
- Build et test de l'application Next.js
- Création et publication de l'image Docker
- Déploiement sur Kubernetes avec rolling update
- Vérification de la santé du déploiement

**Jobs** :
1. `build-and-test` : Compile, lint et teste l'application
2. `build-and-push-image` : Crée et publie l'image Docker
3. `deploy-to-kubernetes` : Déploie sur le cluster Kubernetes

### 2. Rollback Deployment (`rollback.yml`)

**Déclenchement** : Manuel via l'interface GitHub Actions

**Fonctionnalités** :
- Rollback à une version spécifique par tag d'image
- Rollback à une révision Kubernetes spécifique
- Vérification de la santé après rollback
- Affichage du statut et de l'historique

**Paramètres** :
- `version` : Tag d'image (ex: `sha-abc1234`) ou numéro de révision (ex: `2`)
- `rollback_type` : Type de rollback (`image-tag` ou `revision-number`)
- `namespace` : Namespace Kubernetes (défaut: `default`)

## Utilisation

### Déploiement Automatique

Le déploiement se déclenche automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
```

Le workflow :
1. Vérifie le code
2. Exécute les tests
3. Build l'image Docker
4. Déploie sur Kubernetes
5. Vérifie que tout fonctionne

### Rollback Manuel

#### Via l'interface GitHub

1. Allez sur **Actions** dans votre repository
2. Sélectionnez **Rollback Deployment**
3. Cliquez sur **Run workflow**
4. Remplissez les paramètres :
   - **Version** : `sha-abc1234` (pour rollback par image) ou `2` (pour rollback par révision)
   - **Rollback Type** : Choisissez le type approprié
   - **Namespace** : Laissez `default` ou spécifiez votre namespace
5. Cliquez sur **Run workflow**

#### Exemples de rollback

**Rollback par tag d'image** :
```
Version: sha-a1b2c3d
Rollback Type: image-tag
Namespace: default
```

**Rollback par numéro de révision** :
```
Version: 3
Rollback Type: revision-number
Namespace: default
```

## Secrets Requis

Les workflows nécessitent les secrets GitHub suivants :

### Obligatoires

- `KUBECONFIG` : Configuration kubectl encodée en base64
  ```bash
  cat ~/.kube/config | base64 -w 0
  ```

- `GITHUB_TOKEN` : Token automatiquement fourni par GitHub Actions (pour GitHub Container Registry)

### Optionnels

- `K8S_NAMESPACE` : Namespace Kubernetes personnalisé (défaut: `default`)
- `DOCKER_USERNAME` : Nom d'utilisateur Docker Hub (si vous utilisez Docker Hub au lieu de GHCR)
- `DOCKER_PASSWORD` : Mot de passe Docker Hub (si vous utilisez Docker Hub)

## Configuration des Secrets

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **New repository secret**
3. Ajoutez chaque secret avec son nom et sa valeur
4. Cliquez sur **Add secret**

## Monitoring

### Voir l'état d'un workflow

1. Allez sur **Actions**
2. Cliquez sur le workflow en cours
3. Consultez les logs de chaque job

### Vérifier le déploiement

Après un déploiement réussi, vérifiez :

```bash
# Via kubectl
kubectl get deployments
kubectl get pods -l app=portfolio
kubectl rollout status deployment/portfolio

# Via Lens
# Ouvrez Lens → Workloads → Deployments → portfolio
```

## Dépannage

### Le workflow échoue

1. **Vérifiez les logs** dans GitHub Actions
2. **Vérifiez les secrets** sont correctement configurés
3. **Vérifiez le cluster** est accessible

### Le déploiement échoue

1. **Vérifiez les pods** : `kubectl get pods -l app=portfolio`
2. **Consultez les logs** : `kubectl logs <pod-name>`
3. **Vérifiez les events** : `kubectl get events --sort-by='.lastTimestamp'`

### Le rollback échoue

1. **Vérifiez la version** existe dans le registry ou l'historique
2. **Vérifiez les permissions** kubectl
3. **Consultez les logs** du workflow de rollback

## Bonnes Pratiques

### Avant de pousser du code

1. Testez localement :
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

2. Testez avec Docker :
   ```bash
   docker build -t portfolio:test .
   docker run -p 3000:3000 portfolio:test
   ```

### Après un déploiement

1. Vérifiez que le workflow a réussi
2. Vérifiez l'application est accessible
3. Testez les fonctionnalités critiques
4. Surveillez les logs pour les erreurs

### En cas de problème

1. Ne paniquez pas - le rollback est là pour ça
2. Effectuez un rollback immédiat si nécessaire
3. Analysez les logs pour comprendre le problème
4. Corrigez et redéployez

## Ressources

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Guide de Rollback Complet](../../ROLLBACK_GUIDE.md)
- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Lens](https://docs.k8slens.dev/)

## Support

Pour plus d'informations sur le rollback, consultez le [Guide de Rollback](../../ROLLBACK_GUIDE.md).
