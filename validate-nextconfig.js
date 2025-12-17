#!/usr/bin/env node

/**
 * Script de validation de la configuration Next.js
 * Vérifie que le mode standalone est activé
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'next.config.js');

function validateNextConfig() {
  console.log('🔍 Validation de next.config.js...\n');
  
  let content;
  try {
    content = readFileSync(CONFIG_PATH, 'utf-8');
  } catch (error) {
    console.error('❌ Erreur: Impossible de lire next.config.js');
    process.exit(1);
  }

  const checks = [
    {
      name: 'Mode standalone activé',
      test: () => content.includes("output: 'standalone'") || content.includes('output: "standalone"')
    },
    {
      name: 'Configuration images présente',
      test: () => content.includes('images:')
    },
    {
      name: 'React Strict Mode activé',
      test: () => content.includes('reactStrictMode: true')
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

  console.log('\n✅ Configuration Next.js valide pour Docker!');
  console.log('\n📝 Le mode standalone est activé:');
  console.log('   - Next.js générera un dossier .next/standalone');
  console.log('   - Ce dossier contient tout le nécessaire pour exécuter l\'app');
  console.log('   - Taille d\'image Docker optimisée');
  
  process.exit(0);
}

validateNextConfig();
