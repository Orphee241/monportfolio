# Migration des Assets - Portfolio Modernization

Ce document décrit la migration des assets statiques de l'ancien portfolio vers la nouvelle structure Next.js.

## Structure des Dossiers Créée

```
monportfolio/
├── components/
│   ├── layout/          # Composants de mise en page (Header, Footer, WhatsAppButton)
│   ├── sections/        # Composants de sections (Hero, About, Skills, etc.)
│   └── ui/              # Composants UI réutilisables (SkillBar, ServiceCard, etc.)
├── lib/
│   ├── data/            # Fichiers de données (personal-info, skills, services, portfolio)
│   ├── utils/           # Fonctions utilitaires (scroll, etc.)
│   └── metadata.ts      # Configuration des métadonnées du site
├── types/
│   └── index.ts         # Définitions TypeScript pour tous les types
└── public/
    ├── images/
    │   ├── profile/     # Images de profil
    │   ├── portfolio/   # Captures d'écran des projets web
    │   └── graphic-design/  # Réalisations en design graphique
    └── favicon.ico      # Favicon du site
```

## Images Migrées

### Images de Profil (public/images/profile/)
- `gona.png` - Photo de profil principale (PNG avec fond transparent)
- `glen-orphee.jpg` - Photo de profil alternative

### Projets Web (public/images/portfolio/)
- `portfoliodavys.png` - Portfolio de Davys
- `portfolionmcg.png` - Portfolio NMCG
- `ecole241business.png` - Site Ecole 241 Business
- `gocgo.png` - Application Gocgo

### Design Graphique (public/images/graphic-design/)

**Affiches et Flyers:**
- `affiche-ingenieur-son.jpg`
- `boostagcom.jpg`
- `cours-vacances.jpg`
- `danny.jpg`
- `eric-concert.jpg`
- `formations-agcom.jpg`
- `formations-conduite-agcom.jpg`
- `ndami-pub.jpg`
- `regis.jpg`

**Logos:**
- `airtel-logo.png`
- `bgfi-logo.png`
- `bicig-logo.png`

**Images Supplémentaires:**
- `img-2625.png`
- `img-2626.png`
- `img-2758.png`

## Optimisation des Images

Les images seront automatiquement optimisées par Next.js via le composant `Image`:

1. **Conversion WebP**: Next.js convertit automatiquement les images en WebP avec fallback
2. **Redimensionnement**: Les images sont redimensionnées selon les besoins
3. **Lazy Loading**: Les images below-the-fold sont chargées en différé
4. **Compression**: Compression automatique pour réduire la taille des fichiers

## Utilisation dans les Composants

```tsx
import Image from 'next/image';

// Image de profil (above-the-fold)
<Image
  src="/images/profile/gona.png"
  alt="Glen Orphée NZIENGUI-AKOUMBOU"
  width={400}
  height={400}
  priority
/>

// Image de portfolio (below-the-fold)
<Image
  src="/images/portfolio/portfoliodavys.png"
  alt="Portfolio de Davys"
  width={800}
  height={600}
  loading="lazy"
/>
```

## Types TypeScript Créés

Le fichier `types/index.ts` contient toutes les définitions TypeScript nécessaires:

- `PersonalInfo` - Informations personnelles
- `Education` - Formation
- `Experience` - Expériences professionnelles
- `Skill` - Compétences et outils
- `Service` - Services proposés
- `PortfolioItem` - Projets du portfolio
- `ContactInfo` - Informations de contact
- Props pour tous les composants

## Métadonnées du Site

Le fichier `lib/metadata.ts` contient:

- Titre et description du site
- Mots-clés SEO
- Informations Open Graph et Twitter Card
- Coordonnées de contact
- Liens sociaux

## Prochaines Étapes

1. Créer les fichiers de données dans `lib/data/`
2. Développer les composants dans `components/`
3. Implémenter les sections dans `app/page.tsx`
4. Configurer les métadonnées dans `app/layout.tsx`

## Notes Importantes

- Les images originales sont conservées dans `assets/img/` pour référence
- Le favicon a été copié dans `public/favicon.ico`
- Tous les noms de fichiers ont été normalisés (minuscules, tirets)
- La structure est prête pour le développement des composants Next.js
