# Design Minimaliste - Portfolio GONA

## Philosophie de Design

Le nouveau design suit une approche **ultra-minimaliste et épurée** inspirée des portfolios modernes haut de gamme.

## Principes Clés

### 1. Typographie Épurée
- **Poids légers** : font-weight 300 (light) par défaut
- **Hiérarchie claire** : Tailles réduites et espacements généreux
- **Letterspacing subtil** : 0.3em pour les labels, -0.01em pour les titres
- **Couleurs neutres** : Blanc pur (#ffffff) pour les titres, gris (#6a6a6a) pour le corps

### 2. Palette de Couleurs Minimaliste
```css
Background: #000000 (noir pur)
Texte principal: #ffffff (blanc)
Texte secondaire: #6a6a6a (gris moyen)
Texte muted: #a0a0a0 (gris clair)
Bordures: #1a1a1a / #2a2a2a (gris très foncé)
Accent: #ffffff (blanc pour les CTA)
```

### 3. Espacement Généreux
- Sections: 120px padding vertical
- Entre éléments: 32-64px
- Marges internes: 48px pour les cards
- Container max-width: 1280px (7xl)

### 4. Formes et Bordures
- **Pas de border-radius** sur les cards (0px)
- **Border-radius subtil** sur les boutons (50px - pill shape)
- **Bordures fines** : 1px solid
- **Pas d'ombres agressives** : Ombres subtiles uniquement

### 5. Animations Discrètes
- **Pas d'animations automatiques** (shimmer, pulse, etc.)
- **Transitions simples** : 0.3s ease
- **Hover states subtils** : Changement de couleur uniquement
- **Pas de transformations** : scale/rotate minimisés

### 6. Images
- **Filtre grayscale léger** : 20% par défaut
- **Pas de border-radius** sur les images principales
- **Pas d'effets de glow** ou de halos colorés

## Composants Clés

### Header
- Fond noir semi-transparent avec blur subtil
- Hauteur fixe: 80px
- Navigation avec font-weight 300
- Bordure inférieure: 1px #1a1a1a

### Hero Section
- Layout 2 colonnes équilibrées
- Titre principal: 4xl-6xl, font-weight 300
- Sous-titre: 2xl, couleur cyan-400
- Boutons: Blanc sur noir (inversé)
- Stats: Minimalistes avec séparateur top

### Service Cards
- Fond transparent
- Bordure: 1px #1a1a1a
- Icônes: Cercle outline blanc
- Hover: Bordure plus claire uniquement

### Portfolio Cards
- Bordure carrée (border-radius: 0)
- Images avec grayscale 20%
- Overlay gradient noir au hover
- Pas d'effets de zoom agressifs

### Barres de Progression
- Hauteur: 2px
- Couleur: Blanc sur fond #1a1a1a
- Pas d'animations ou de glow

## Comparaison Avant/Après

### Avant (Trop chargé)
- ❌ Gradients colorés partout
- ❌ Animations multiples (shimmer, pulse, float)
- ❌ Border-radius arrondis (20px)
- ❌ Ombres colorées avec glow
- ❌ Fond avec gradients radiaux
- ❌ Typographie lourde (font-weight 600-700)

### Après (Épuré)
- ✅ Noir et blanc principalement
- ✅ Pas d'animations automatiques
- ✅ Formes carrées et épurées
- ✅ Ombres discrètes ou absentes
- ✅ Fond noir pur
- ✅ Typographie légère (font-weight 300-400)

## Inspiration
- Apple.com (minimalisme extrême)
- Stripe.com (typographie claire)
- Linear.app (design épuré)
- Vercel.com (noir et blanc)

## Résultat
Un portfolio qui respire, avec beaucoup d'espace blanc (noir), une typographie élégante et une hiérarchie visuelle claire. L'attention se porte sur le contenu plutôt que sur les effets visuels.
