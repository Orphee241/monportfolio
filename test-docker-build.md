# Test Docker Build

## Prérequis
- Docker Desktop doit être démarré
- Assurez-vous que Docker est en cours d'exécution : `docker ps`

## Commandes de test

### 1. Build l'image Docker
```bash
docker build -t portfolio:latest .
```

### 2. Vérifier que l'image a été créée
```bash
docker images | grep portfolio
```

### 3. Tester l'image localement
```bash
docker run -p 3000:3000 portfolio:latest
```

### 4. Vérifier le health check
Ouvrir un navigateur et accéder à : http://localhost:3000/api/health

### 5. Arrêter le conteneur
```bash
docker ps
docker stop <container-id>
```

## Vérifications attendues
- ✅ Le build se termine sans erreur
- ✅ L'image finale est de taille réduite (Alpine)
- ✅ L'application démarre sur le port 3000
- ✅ Le health check endpoint répond avec status 200
- ✅ L'application est accessible via le navigateur

## Optimisations implémentées
- Multi-stage build (3 stages)
- Image Alpine pour réduire la taille
- Standalone output de Next.js
- Utilisateur non-root pour la sécurité
- Health check intégré
- Cache des layers Docker optimisé
