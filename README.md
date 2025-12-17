# 🎨 Portfolio de GONA - Version 2.0

Portfolio personnel moderne et professionnel de Glen Orphée NZIENGUI-AKOUMBOU, développé avec Next.js 16, TypeScript et Tailwind CSS.

## ✨ Nouveautés Version 2.0

- 🎨 **Design modernisé** avec glassmorphism et animations fluides
- ✨ **Animations sophistiquées** (fade-in, shimmer, pulse effects)
- 💎 **Glassmorphism** sur les cards et composants
- 🎯 **Hero section améliorée** avec CTA et statistiques
- 📱 **Responsive optimisé** pour tous les écrans
- ⚡ **Performance** améliorée avec animations GPU-accelerated

👉 **[Voir tous les changements](./DESIGN_UPDATE_README.md)**

## Technologies utilisées

- **Framework**: Next.js 14+ (App Router)
- **Langage**: TypeScript (mode strict)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icônes**: React Icons
- **Carousel**: Swiper React
- **Composants UI**: Headless UI

## Installation

```bash
npm install
```

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée le build de production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run format` - Formate le code avec Prettier

## Structure du projet

```
monportfolio/
├── app/                    # Pages et layouts Next.js
├── components/             # Composants React réutilisables
├── lib/                    # Utilitaires et données
├── types/                  # Définitions TypeScript
├── public/                 # Assets statiques
└── assets/                 # Ancien portfolio (à migrer)
```

## Développement

Le projet utilise Next.js App Router avec TypeScript en mode strict. Tous les composants sont des composants fonctionnels React avec hooks.

## Déploiement

Le projet est configuré pour être déployé sur Vercel avec optimisation automatique des images et génération de pages statiques.

### Déploiement Kubernetes avec CI/CD

Le projet inclut un pipeline CI/CD complet pour déployer automatiquement sur Kubernetes via GitHub Actions.

#### Configuration des GitHub Secrets

Pour activer le déploiement automatique, vous devez configurer les secrets suivants dans votre repository GitHub :

**Accéder aux secrets** : `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

##### Secrets Requis pour Docker Registry

Choisissez **une** des deux options suivantes :

**Option 1 : GitHub Container Registry (Recommandé)**
- `GHCR_TOKEN` : Personal Access Token GitHub avec permissions `write:packages` et `read:packages`
  - Créer un token : `Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)` → `Generate new token`
  - Sélectionner les scopes : `write:packages`, `read:packages`, `repo`
  - Copier le token généré (il ne sera affiché qu'une seule fois)

**Option 2 : Docker Hub**
- `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub
- `DOCKER_PASSWORD` : Votre mot de passe Docker Hub ou Access Token
  - Créer un Access Token : Docker Hub → `Account Settings` → `Security` → `New Access Token`

##### Secrets Requis pour Kubernetes

Choisissez **une** des deux options suivantes :

**Option 1 : Kubeconfig complet (Recommandé pour Lens)**
- `KUBECONFIG` : Contenu complet de votre fichier kubeconfig
  - Obtenir le kubeconfig : 
    ```bash
    # Afficher le contenu de votre kubeconfig
    cat ~/.kube/config
    
    # Ou depuis Lens : File → Preferences → Kubernetes → Copy kubeconfig
    ```
  - Copier tout le contenu YAML et le coller dans le secret GitHub

**Option 2 : Credentials séparés**
- `K8S_CLUSTER_URL` : URL de votre cluster Kubernetes (ex: `https://kubernetes.example.com:6443`)
- `K8S_TOKEN` : Token d'authentification pour le cluster
  - Obtenir le token :
    ```bash
    # Créer un service account
    kubectl create serviceaccount github-deployer
    
    # Créer un token pour le service account
    kubectl create token github-deployer --duration=87600h
    
    # Ou récupérer depuis un secret existant
    kubectl get secret <secret-name> -o jsonpath='{.data.token}' | base64 --decode
    ```

##### Secrets Optionnels

- `K8S_NAMESPACE` : Namespace Kubernetes cible (défaut: `default`)
  - Exemple : `production`, `staging`, `portfolio`

#### Vérification de la Configuration

Après avoir configuré les secrets, vérifiez que :

1. ✅ Tous les secrets requis sont présents dans `Settings` → `Secrets and variables` → `Actions`
2. ✅ Les secrets n'ont pas d'espaces ou de caractères invisibles au début/fin
3. ✅ Le token GitHub a les bonnes permissions (pour GHCR)
4. ✅ Le kubeconfig est valide et pointe vers le bon cluster
5. ✅ Le service account Kubernetes a les permissions nécessaires

#### Déclenchement du Déploiement

Une fois les secrets configurés, le déploiement se déclenche automatiquement :

```bash
# Pousser sur la branche main
git push origin main

# Le workflow GitHub Actions va :
# 1. Builder et tester l'application
# 2. Créer l'image Docker
# 3. Pousser l'image vers le registry
# 4. Déployer sur Kubernetes
```

#### Monitoring du Déploiement

- **GitHub Actions** : Onglet `Actions` de votre repository pour voir les logs du workflow
- **Lens** : Ouvrir Lens et naviguer vers votre cluster pour voir les pods et déploiements
- **Kubectl** : 
  ```bash
  # Vérifier le statut du déploiement
  kubectl get deployments
  kubectl get pods
  kubectl logs -f deployment/portfolio
  ```

#### Rollback Manuel

En cas de problème, vous pouvez effectuer un rollback :

```bash
# Via kubectl
kubectl rollout undo deployment/portfolio

# Via Lens
# Deployments → portfolio → Rollback
```

Pour plus de détails, consultez la [documentation complète du déploiement](./docs/DEPLOYMENT.md).

## 📚 Documentation

### Guides Principaux
- 📖 **[Vue d'ensemble](./DESIGN_UPDATE_README.md)** - Résumé complet des changements
- 👀 **[Guide visuel](./VOIR_LES_CHANGEMENTS.md)** - Voir les changements visuellement
- ⚡ **[Démarrage rapide](./QUICK_START.md)** - Commencer rapidement
- 🧩 **[Guide des composants](./COMPONENTS_GUIDE.md)** - Créer des composants
- 🔧 **[Détails techniques](./DESIGN_IMPROVEMENTS.md)** - Aspects techniques
- 📝 **[Résumé modifications](./RESUME_MODIFICATIONS.md)** - Liste des changements
- 📚 **[Index documentation](./INDEX_DOCUMENTATION.md)** - Navigation complète

### Démarrage Rapide
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

## 🎨 Fonctionnalités

### Design
- ✅ Glassmorphism avec backdrop blur
- ✅ Gradients modernes (Cyan → Violet → Rouge)
- ✅ Animations fluides et micro-interactions
- ✅ Hover effects sophistiqués
- ✅ Typographie hiérarchisée

### Animations
- ✅ Entrées de section (fade-in-up, fade-in-right)
- ✅ Effet shimmer sur textes gradient
- ✅ Pulse effects sur éléments clés
- ✅ Transitions cubic-bezier partout

### Performance
- ✅ Animations GPU-accelerated
- ✅ Lazy loading des images
- ✅ Code splitting optimisé
- ✅ Build time ~6 secondes

## 🎯 Personnalisation

### Changer les couleurs
Éditez `app/globals.css` :
```css
:root {
  --color-primary: #12c2e9;  /* Votre couleur */
}
```

### Modifier le contenu
Éditez `lib/data/personal-info.ts`

### Ajouter des projets
Éditez `lib/data/portfolio-items.ts`

## 📱 Responsive

Optimisé pour :
- 📱 Mobile (< 768px)
- 📱 Tablet (768-1024px)
- 💻 Desktop (> 1024px)

## 🚀 Performance

- ⚡ Lighthouse Score : 90+
- 📦 Bundle optimisé
- 🎯 First Paint < 1s
- ✅ SEO optimized

## 📄 License

MIT
