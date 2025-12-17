# Images Directory

Ce dossier contient toutes les images optimisées pour le portfolio.

## Structure

- **profile/** - Images de profil de GONA
  - `gona.png` - Photo de profil principale (PNG avec fond transparent)
  - `glen-orphee.jpg` - Photo de profil alternative

- **portfolio/** - Captures d'écran des projets web
  - `portfoliodavys.png` - Portfolio de Davys
  - `portfolionmcg.png` - Portfolio NMCG
  - `ecole241business.png` - Site Ecole 241 Business
  - `gocgo.png` - Application Gocgo

- **graphic-design/** - Réalisations en design graphique
  - Affiches et flyers
  - Logos et identités visuelles
  - Publications et communications

## Optimisation

Les images sont automatiquement optimisées par Next.js Image component:
- Conversion en WebP avec fallback
- Redimensionnement responsive
- Lazy loading pour les images below-the-fold
- Compression automatique

## Utilisation

```tsx
import Image from 'next/image';

<Image
  src="/images/profile/gona.png"
  alt="Glen Orphée NZIENGUI-AKOUMBOU"
  width={400}
  height={400}
  priority // Pour les images above-the-fold
/>
```
