#!/usr/bin/env node

/**
 * Script de validation du Dockerfile
 * Vérifie la structure et les bonnes pratiques
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const DOCKERFILE_PATH = join(process.cwd(), 'Dockerfile');

function validateDockerfile() {
  console.log('🔍 Validation du Dockerfile...\n');
  
  let content;
  try {
    content = readFileSync(DOCKERFILE_PATH, 'utf-8');
  } catch (error) {
    console.error('❌ Erreur: Impossible de lire le Dockerfile');
    process.exit(1);
  }

  const checks = [
    {
      name: 'Multi-stage build (3 stages)',
      test: () => {
        const stages = content.match(/FROM .+ AS \w+/g) || [];
        return stages.length === 3;
      }
    },
    {
      name: 'Utilisation de Alpine',
      test: () => content.includes('node:20-alpine')
    },
    {
      name: 'Stage deps présent',
      test: () => content.includes('AS deps')
    },
    {
      name: 'Stage builder présent',
      test: () => content.includes('AS builder')
    },
    {
      name: 'Stage runner présent',
      test: () => content.includes('AS runner')
    },
    {
      name: 'Installation des dépendances (npm ci)',
      test: () => content.includes('npm ci')
    },
    {
      name: 'Build Next.js',
      test: () => content.includes('npm run build')
    },
    {
      name: 'Copie du standalone output',
      test: () => content.includes('.next/standalone')
    },
    {
      name: 'Copie des static files',
      test: () => content.includes('.next/static')
    },
    {
      name: 'Copie du dossier public',
      test: () => content.includes('/public')
    },
    {
      name: 'Utilisateur non-root',
      test: () => content.includes('USER nextjs')
    },
    {
      name: 'Variables d\'environnement production',
      test: () => content.includes('NODE_ENV=production')
    },
    {
      name: 'Port exposé (3000)',
      test: () => content.includes('EXPOSE 3000')
    },
    {
      name: 'Health check configuré',
      test: () => content.includes('HEALTHCHECK')
    },
    {
      name: 'Health check endpoint (/api/health)',
      test: () => content.includes('/api/health')
    },
    {
      name: 'Commande de démarrage (server.js)',
      test: () => content.includes('CMD ["node", "server.js"]')
    },
    {
      name: 'Optimisation: chown pour nextjs',
      test: () => content.includes('--chown=nextjs:nodejs')
    },
    {
      name: 'Optimisation: npm cache clean',
      test: () => content.includes('npm cache clean')
    }
  ];

  let passed = 0;
  let failed = 0;

  checks.forEach(check => {
    const result = check.test();
    if (result) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      failed++;
    }
  });

  console.log(`\n📊 Résultats: ${passed}/${checks.length} vérifications réussies`);

  if (failed > 0) {
    console.error(`\n❌ ${failed} vérification(s) échouée(s)`);
    process.exit(1);
  }

  console.log('\n✅ Dockerfile valide et optimisé!');
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. Démarrer Docker Desktop');
  console.log('   2. Exécuter: docker build -t portfolio:latest .');
  console.log('   3. Tester: docker run -p 3000:3000 portfolio:latest');
  
  process.exit(0);
}

validateDockerfile();
