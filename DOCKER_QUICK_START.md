# 🐳 Docker Quick Start

## Validation (sans Docker Desktop)

Vous pouvez valider la configuration sans démarrer Docker :

```bash
# Valider le Dockerfile
node validate-dockerfile.js

# Valider next.config.js
node validate-nextconfig.js
```

## Test complet (avec Docker Desktop)

### 1. Prérequis
- Docker Desktop doit être démarré
- Vérifier : `docker ps`

### 2. Build
```bash
docker build -t portfolio:latest .
```

### 3. Run
```bash
docker run -p 3000:3000 portfolio:latest
```

### 4. Test
- Application : http://localhost:3000
- Health check : http://localhost:3000/api/health

## Fichiers créés

| Fichier | Description |
|---------|-------------|
| `Dockerfile` | Multi-stage build optimisé (3 stages) |
| `.dockerignore` | Exclusions pour optimiser le contexte |
| `next.config.js` | Modifié avec `output: 'standalone'` |
| `validate-dockerfile.js` | Script de validation |
| `validate-nextconfig.js` | Script de validation config |
| `test-docker-build.md` | Guide de test détaillé |
| `DOCKER_IMPLEMENTATION.md` | Documentation complète |

## Caractéristiques

✅ Multi-stage build (3 stages)
✅ Image Alpine (~150-200MB vs ~1.2GB)
✅ Standalone output Next.js
✅ Utilisateur non-root
✅ Health check intégré
✅ Optimisations de cache

## Prochaine étape

Tâche 3 : Créer les manifests Kubernetes
