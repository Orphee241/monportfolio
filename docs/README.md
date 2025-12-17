# Documentation du Déploiement Kubernetes

Bienvenue dans la documentation complète du système de déploiement CI/CD pour le portfolio Next.js sur Kubernetes.

## 📚 Table des Matières

### 🚀 Pour Commencer

1. **[DEPLOYMENT_READY.md](../DEPLOYMENT_READY.md)** - **COMMENCEZ ICI!**
   - Vue d'ensemble de ce qui a été créé
   - Prochaines étapes
   - Checklist rapide

2. **[DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md)** - **Guide Pas à Pas**
   - Checklist complète pour le premier déploiement
   - Étapes détaillées avec commandes
   - Vérifications à chaque phase

### 📖 Guides Complets

3. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - **Guide de Référence**
   - Architecture CI/CD détaillée
   - Configuration des secrets GitHub
   - Ressources Kubernetes expliquées
   - Instructions de déploiement
   - Monitoring avec Lens

4. **[DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)** - **Guide de Vérification**
   - Vérification étape par étape du déploiement
   - Tests pour chaque composant
   - Checklist de vérification complète
   - Commandes de validation

5. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - **Résolution de Problèmes**
   - Problèmes courants et solutions
   - Commandes de debugging
   - Procédures de rollback
   - FAQ

### 🛠️ Outils et Scripts

6. **[scripts/README.md](../scripts/README.md)** - **Documentation des Scripts**
   - Script de vérification automatique (Bash)
   - Script de vérification automatique (PowerShell)
   - Utilisation et personnalisation

---

## 🎯 Parcours Recommandé

### Pour un Premier Déploiement

```
1. DEPLOYMENT_READY.md
   ↓
2. DEPLOYMENT_CHECKLIST.md (suivre étape par étape)
   ↓
3. DEPLOYMENT_VERIFICATION.md (après le déploiement)
   ↓
4. TROUBLESHOOTING.md (si problèmes)
```

### Pour une Référence Rapide

```
DEPLOYMENT.md → Section spécifique
```

### Pour Débugger un Problème

```
TROUBLESHOOTING.md → Problème spécifique
```

---

## 📋 Résumé des Documents

### DEPLOYMENT_READY.md
**Quand l'utiliser:** Avant de commencer  
**Durée de lecture:** 5 minutes  
**Contenu:**
- ✅ Liste de ce qui a été créé
- 🎯 Prochaines étapes
- 📚 Index de la documentation
- 🔧 Commandes rapides

### DEPLOYMENT_CHECKLIST.md
**Quand l'utiliser:** Pendant le premier déploiement  
**Durée:** 45-65 minutes (avec le déploiement)  
**Contenu:**
- ✅ Checklist interactive
- 📝 Étapes détaillées
- ⏱️ Temps estimés
- 🔍 Vérifications à chaque phase

### DEPLOYMENT.md
**Quand l'utiliser:** Comme référence générale  
**Durée de lecture:** 20-30 minutes  
**Contenu:**
- 🏗️ Architecture complète
- 🔐 Configuration des secrets
- ☸️ Ressources Kubernetes
- 📊 Monitoring avec Lens
- 🔧 Commandes utiles

### DEPLOYMENT_VERIFICATION.md
**Quand l'utiliser:** Après chaque déploiement  
**Durée:** 10-15 minutes  
**Contenu:**
- ✅ Checklist de vérification
- 🧪 Tests pour chaque composant
- 🔍 Validation complète
- 📊 Métriques de succès

### TROUBLESHOOTING.md
**Quand l'utiliser:** En cas de problème  
**Durée:** Variable selon le problème  
**Contenu:**
- 🐛 Problèmes courants
- 💡 Solutions détaillées
- 🔧 Commandes de debugging
- 🔄 Procédures de rollback
- ❓ FAQ

### scripts/README.md
**Quand l'utiliser:** Pour utiliser les scripts  
**Durée de lecture:** 10 minutes  
**Contenu:**
- 📜 Documentation des scripts
- 🚀 Utilisation
- ⚙️ Configuration
- 🔧 Personnalisation

---

## 🔍 Recherche Rapide

### Par Sujet

#### Configuration Initiale
- Secrets GitHub → `DEPLOYMENT.md` Section "Secrets GitHub Requis"
- Domaine et DNS → `DEPLOYMENT_CHECKLIST.md` Phase 1.3
- Prérequis → `DEPLOYMENT.md` Section "Prérequis"

#### Déploiement
- Premier déploiement → `DEPLOYMENT_CHECKLIST.md`
- Déploiement automatique → `DEPLOYMENT.md` Section "Déploiement Automatique"
- Déploiement manuel → `DEPLOYMENT.md` Section "Déploiement Manuel"

#### Vérification
- Vérification automatique → `scripts/README.md`
- Vérification manuelle → `DEPLOYMENT_VERIFICATION.md`
- Vérification via Lens → `DEPLOYMENT.md` Section "Monitoring avec Lens"

#### Problèmes
- Workflow échoue → `TROUBLESHOOTING.md` Section "Échecs de Build"
- Pods crashent → `TROUBLESHOOTING.md` Section "Problèmes de Pods"
- Certificat non émis → `TROUBLESHOOTING.md` Section "Certificats TLS"
- Site inaccessible → `TROUBLESHOOTING.md` Section "Problèmes d'Accès"

#### Monitoring
- Lens → `DEPLOYMENT.md` Section "Monitoring avec Lens"
- kubectl → `DEPLOYMENT.md` Section "Commandes Utiles"
- Logs → `DEPLOYMENT_VERIFICATION.md` Étape 5

#### Rollback
- Rollback automatique → `TROUBLESHOOTING.md` Section "Rollback Automatique"
- Rollback manuel → `TROUBLESHOOTING.md` Section "Rollback Manuel"

---

## 🎓 Concepts Clés

### Pipeline CI/CD

Le pipeline automatise le processus de déploiement:

```
Code Push → Build → Test → Docker → Deploy → Verify
```

**Documentation:** `DEPLOYMENT.md` Section "Architecture CI/CD"

### Kubernetes Resources

Les ressources Kubernetes orchestrent l'application:

```
Ingress → Service → Deployment → Pods
```

**Documentation:** `DEPLOYMENT.md` Section "Ressources Kubernetes"

### Rolling Update

Mise à jour sans downtime:

```
Old Pods → Gradual Replacement → New Pods
```

**Documentation:** `DEPLOYMENT.md` Section "Deployment"

### Health Checks

Détection automatique des problèmes:

```
Liveness Probe → Restart if unhealthy
Readiness Probe → Remove from load balancer if not ready
```

**Documentation:** `DEPLOYMENT.md` Section "Health Checks"

---

## 🔧 Commandes Rapides

### Déploiement

```bash
# Déclencher un déploiement
git push origin main

# Vérifier le statut
./scripts/verify-deployment.sh

# Voir les logs
kubectl logs -l app=portfolio -f
```

### Monitoring

```bash
# Status général
kubectl get all -l app=portfolio

# Détails
kubectl describe deployment portfolio

# Événements
kubectl get events --sort-by='.lastTimestamp'
```

### Debugging

```bash
# Logs d'un pod
kubectl logs <pod-name>

# Shell dans un pod
kubectl exec -it <pod-name> -- sh

# Port-forward
kubectl port-forward service/portfolio-service 3000:80
```

### Rollback

```bash
# Rollback automatique
kubectl rollout undo deployment/portfolio

# Voir l'historique
kubectl rollout history deployment/portfolio
```

---

## 📊 Diagrammes

### Architecture Globale

```
┌─────────────────┐
│  GitHub Repo    │
└────────┬────────┘
         │ push
         ▼
┌─────────────────┐
│ GitHub Actions  │
│  (CI/CD)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Container       │
│ Registry        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Kubernetes      │
│ Cluster         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Lens Dashboard  │
└─────────────────┘
```

### Flux de Déploiement

```
1. Developer pushes code
2. GitHub Actions triggered
3. Build & Test
4. Docker image created
5. Image pushed to registry
6. Kubernetes deployment updated
7. Rolling update performed
8. Health checks validate
9. Traffic routed to new pods
10. Old pods terminated
```

---

## 🆘 Besoin d'Aide?

### Ordre de Consultation

1. **Chercher dans cette page** (index rapide)
2. **Consulter le document approprié** (voir ci-dessus)
3. **Utiliser le script de vérification** (`./scripts/verify-deployment.sh`)
4. **Consulter TROUBLESHOOTING.md**
5. **Vérifier les logs Kubernetes** (`kubectl logs`)

### Ressources Externes

- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Documentation Lens](https://docs.k8slens.dev/)
- [Documentation cert-manager](https://cert-manager.io/docs/)

---

## 📝 Contribution

Pour améliorer cette documentation:

1. Identifiez ce qui manque ou n'est pas clair
2. Proposez des améliorations
3. Ajoutez des exemples concrets
4. Partagez vos retours d'expérience

---

## ✅ Checklist de Documentation

Avant de déployer, assurez-vous d'avoir lu:

- [ ] DEPLOYMENT_READY.md (vue d'ensemble)
- [ ] DEPLOYMENT_CHECKLIST.md (guide pas à pas)
- [ ] Au moins survolé DEPLOYMENT.md (référence)
- [ ] Compris où trouver TROUBLESHOOTING.md (en cas de problème)

---

**Bonne lecture et bon déploiement! 🚀**

**Dernière mise à jour:** Décembre 2024  
**Version:** 1.0.0
