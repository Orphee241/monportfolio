# Structure du Projet - Portfolio Modernization

## Vue d'ensemble

Ce document décrit la structure complète du projet après la migration vers Next.js 14+ avec TypeScript et Tailwind CSS.

## Arborescence Complète

```
monportfolio/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal avec métadonnées
│   ├── page.tsx                 # Page d'accueil (toutes les sections)
│   └── globals.css              # Styles globaux avec Tailwind
│
├── components/                   # Composants React
│   ├── layout/                  # Composants de mise en page
│   │   ├── Header.tsx          # En-tête avec navigation
│   │   ├── Footer.tsx          # Pied de page
│   │   └── WhatsAppButton.tsx  # Bouton WhatsApp flottant
│   │
│   ├── sections/                # Composants de sections
│   │   ├── HeroSection.tsx     # Section d'accueil
│   │   ├── AboutSection.tsx    # Section présentation
│   │   ├── SkillsSection.tsx   # Section compétences
│   │   ├── ServicesSection.tsx # Section services
│   │   ├── PortfolioSection.tsx # Section réalisations
│   │   └── ContactSection.tsx  # Section contact
│   │
│   └── ui/                      # Composants UI réutilisables
│       ├── SkillBar.tsx        # Barre de progression pour compétences
│       ├── ServiceCard.tsx     # Carte de service
│       ├── PortfolioCarousel.tsx # Carrousel de portfolio
│       └── MobileMenu.tsx      # Menu mobile
│
├── lib/                         # Bibliothèques et utilitaires
│   ├── data/                   # Données du portfolio
│   │   ├── personal-info.ts   # Informations personnelles
│   │   ├── skills.ts          # Compétences et outils
│   │   ├── services.ts        # Services proposés
│   │   └── portfolio-items.ts # Projets du portfolio
│   │
│   ├── utils/                  # Fonctions utilitaires
│   │   └── scroll.ts          # Utilitaires de scroll
│   │
│   └── metadata.ts             # Configuration des métadonnées
│
├── types/                       # Définitions TypeScript
│   └── index.ts                # Tous les types et interfaces
│
├── public/                      # Assets statiques
│   ├── images/                 # Images optimisées
│   │   ├── profile/           # Photos de profil
│   │   │   ├── gona.png
│   │   │   └── glen-orphee.jpg
│   │   │
│   │   ├── portfolio/         # Projets web
│   │   │   ├── portfoliodavys.png
│   │   │   ├── portfolionmcg.png
│   │   │   ├── ecole241business.png
│   │   │   └── gocgo.png
│   │   │
│   │   └── graphic-design/    # Design graphique
│   │       ├── affiche-ingenieur-son.jpg
│   │       ├── boostagcom.jpg
│   │       ├── cours-vacances.jpg
│   │       ├── danny.jpg
│   │       ├── eric-concert.jpg
│   │       ├── formations-agcom.jpg
│   │       ├── formations-conduite-agcom.jpg
│   │       ├── ndami-pub.jpg
│   │       ├── regis.jpg
│   │       ├── airtel-logo.png
│   │       ├── bgfi-logo.png
│   │       ├── bicig-logo.png
│   │       ├── img-2625.png
│   │       ├── img-2626.png
│   │       └── img-2758.png
│   │
│   └── favicon.ico             # Favicon du site
│
├── assets/                      # Assets originaux (référence)
│   ├── img/                    # Images originales
│   ├── css/                    # CSS original
│   ├── js/                     # JavaScript original
│   └── vendor/                 # Bibliothèques tierces
│
├── .kiro/                       # Configuration Kiro
│   └── specs/                  # Spécifications du projet
│       └── portfolio-modernization/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
│
├── node_modules/                # Dépendances npm
│
├── .next/                       # Build Next.js
│
├── next.config.js              # Configuration Next.js
├── tailwind.config.ts          # Configuration Tailwind CSS
├── tsconfig.json               # Configuration TypeScript
├── postcss.config.js           # Configuration PostCSS
├── eslint.config.js            # Configuration ESLint
├── .prettierrc                 # Configuration Prettier
├── package.json                # Dépendances et scripts
├── .gitignore                  # Fichiers ignorés par Git
├── .env.example                # Variables d'environnement exemple
│
├── README.md                   # Documentation principale
├── SETUP.md                    # Guide d'installation
├── MIGRATION.md                # Documentation de migration
└── PROJECT_STRUCTURE.md        # Ce fichier
```

## Dépendances Principales

### Framework et Langages
- **Next.js 14+** - Framework React avec App Router
- **React 18+** - Bibliothèque UI
- **TypeScript** - Typage statique

### Styling
- **Tailwind CSS** - Framework CSS utility-first
- **PostCSS** - Transformation CSS
- **Autoprefixer** - Préfixes CSS automatiques

### UI et Animations
- **Framer Motion** - Animations fluides
- **React Icons** - Bibliothèque d'icônes
- **Swiper** - Carrousel/slider
- **Headless UI** - Composants accessibles

### Optimisation
- **Sharp** - Optimisation d'images (inclus avec Next.js)
- **next/image** - Composant Image optimisé

### Développement
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatage de code
- **TypeScript ESLint** - Linting TypeScript

## Scripts Disponibles

```bash
# Développement
npm run dev          # Démarre le serveur de développement

# Production
npm run build        # Compile le projet pour la production
npm run start        # Démarre le serveur de production

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
npm run format       # Formate le code avec Prettier

# TypeScript
npx tsc --noEmit    # Vérifie les types TypeScript
```

## Conventions de Nommage

### Fichiers
- **Composants React**: PascalCase (ex: `HeroSection.tsx`)
- **Utilitaires**: camelCase (ex: `scroll.ts`)
- **Données**: kebab-case (ex: `personal-info.ts`)
- **Types**: PascalCase (ex: `index.ts` avec exports PascalCase)

### Images
- **Format**: kebab-case (ex: `glen-orphee.jpg`)
- **Dossiers**: kebab-case (ex: `graphic-design/`)

### Variables et Fonctions
- **Variables**: camelCase (ex: `personalInfo`)
- **Constantes**: UPPER_SNAKE_CASE ou camelCase selon le contexte
- **Fonctions**: camelCase (ex: `scrollToSection`)
- **Composants**: PascalCase (ex: `HeroSection`)

## Prochaines Étapes

1. ✅ Structure de dossiers créée
2. ✅ Types TypeScript définis
3. ✅ Images migrées et organisées
4. ✅ Métadonnées configurées
5. ⏳ Créer les fichiers de données
6. ⏳ Développer les composants
7. ⏳ Implémenter les sections
8. ⏳ Configurer le layout
9. ⏳ Tests et optimisation
10. ⏳ Déploiement

## Notes Importantes

- Tous les chemins d'images utilisent `/images/` (relatif à `public/`)
- Les composants utilisent le composant `next/image` pour l'optimisation
- Les types sont centralisés dans `types/index.ts`
- Les données sont séparées de la logique dans `lib/data/`
- Le projet suit les conventions Next.js App Router
