# Dégradés Aléatoires - Portfolio GONA

## Vue d'ensemble

Le portfolio utilise maintenant des dégradés aléatoires des couleurs #000000, #2E1A36 et #321011 sur tout le fond, créant une ambiance dynamique et immersive.

## Système de Dégradés Multi-Couches

### 1. Body Background (Couche de Base)

#### Pseudo-élément ::before
```css
background: 
  radial-gradient(circle at 20% 30%, rgba(46, 26, 54, 0.4) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(50, 16, 17, 0.3) 0%, transparent 50%),
  radial-gradient(circle at 40% 70%, rgba(46, 26, 54, 0.35) 0%, transparent 50%),
  radial-gradient(circle at 90% 80%, rgba(50, 16, 17, 0.4) 0%, transparent 50%),
  radial-gradient(circle at 10% 90%, rgba(46, 26, 54, 0.3) 0%, transparent 50%),
  linear-gradient(135deg, #000000 0%, #2E1A36 50%, #321011 100%);
```

**Caractéristiques** :
- 5 gradients radiaux positionnés aléatoirement
- 1 gradient linéaire de base
- Animation : gradient-shift (20s)
- Position : fixed (suit le scroll)

#### Pseudo-élément ::after (Orbes Flottants)
```css
background: 
  radial-gradient(circle at 30% 40%, rgba(46, 26, 54, 0.15) 0%, transparent 25%),
  radial-gradient(circle at 70% 60%, rgba(50, 16, 17, 0.15) 0%, transparent 25%),
  radial-gradient(circle at 50% 80%, rgba(46, 26, 54, 0.1) 0%, transparent 20%);
```

**Caractéristiques** :
- 3 orbes flottants
- Animation : float-orbs (30s)
- Rotation et translation
- Taille : 200% x 200%

### 2. Sections (Variations par Section)

#### Sections Impaires (odd)
```css
background: radial-gradient(
  ellipse at top left, 
  rgba(46, 26, 54, 0.3) 0%, 
  transparent 60%
);
```

#### Sections Paires (even)
```css
background: radial-gradient(
  ellipse at top right, 
  rgba(50, 16, 17, 0.3) 0%, 
  transparent 60%
);
```

### 3. Hero Section (Multi-Couches)

#### Couche 1 : Base
```css
bg-gradient-to-br from-[#000000] via-[#2E1A36] to-[#321011]
```

#### Couche 2 : Overlay Diagonal
```css
bg-gradient-to-tr from-[#321011]/30 via-transparent to-[#2E1A36]/30
```

#### Couche 3 : Overlay Droite
```css
bg-gradient-to-l from-[#321011]/40 via-[#2E1A36]/20 to-transparent
Width: 60%
```

#### Couche 4 : Overlay Bas-Gauche
```css
bg-gradient-to-tr from-[#2E1A36]/30 to-transparent
Width: 50%, Height: 50%
```

#### Orbes Animés (4 orbes)
- Top-left : 64x64, #2E1A36/20, blur-3xl
- Top-right : 48x48, #321011/20, blur-3xl
- Bottom-left : 56x56, #2E1A36/15, blur-3xl
- Bottom-right : 40x40, #321011/15, blur-3xl

### 4. About Section

**Orbes** :
- Top-right : 96x96 (384px), #321011/20
- Bottom-left : 80x80 (320px), #2E1A36/20

### 5. Skills Section

**Orbes** :
- Top-left (1/4) : 72x72 (288px), #2E1A36/25
- Bottom-right (1/4) : 64x64 (256px), #321011/25

### 6. Services Section

**Orbes** :
- Top-left (1/4) : 80x80 (320px), #321011/20
- Bottom-right (1/4) : 72x72 (288px), #2E1A36/20

### 7. Portfolio Section

**Orbes** :
- Top-right (1/3) : 96x96 (384px), #2E1A36/20
- Bottom-left (1/3) : 80x80 (320px), #321011/20

### 8. Contact Section

**Orbes** (3 orbes) :
- Top-left : 72x72 (288px), #321011/25
- Bottom-right : 64x64 (256px), #2E1A36/25
- Center : 56x56 (224px), #321011/15

## Animations

### gradient-shift (20s)
```css
0%, 100% { opacity: 1; }
50% { opacity: 0.8; }
```
**Effet** : Pulsation douce du fond

### float-orbs (30s)
```css
0%, 100% { transform: translate(0, 0) rotate(0deg); }
33% { transform: translate(5%, 5%) rotate(120deg); }
66% { transform: translate(-5%, 3%) rotate(240deg); }
```
**Effet** : Orbes qui flottent et tournent

### pulse (Tailwind)
**Appliqué sur** : Tous les orbes dans les sections
**Effet** : Pulsation continue

## Opacités Utilisées

| Élément | Opacité | Usage |
|---------|---------|-------|
| Body gradients | 0.3-0.4 | Base visible |
| Body orbs | 0.1-0.15 | Très subtil |
| Section overlays | 0.3 | Modéré |
| Section orbs | 0.15-0.25 | Subtil à modéré |
| Hero overlays | 0.2-0.4 | Visible |

## Positions Aléatoires

### Body (5 gradients radiaux)
- 20% 30% (top-left)
- 80% 20% (top-right)
- 40% 70% (center-bottom)
- 90% 80% (bottom-right)
- 10% 90% (bottom-left)

### Body Orbs (3 orbes)
- 30% 40% (center-left)
- 70% 60% (center-right)
- 50% 80% (bottom-center)

### Sections
- Variations top-left, top-right, bottom-left, bottom-right
- Positions 1/4, 1/3 pour décalage

## Effet Visuel Global

### Profondeur
- ✅ Multiple couches de dégradés
- ✅ Différentes opacités
- ✅ Blur effects (blur-3xl)

### Mouvement
- ✅ Animations douces (20-30s)
- ✅ Orbes flottants
- ✅ Pulsations

### Variation
- ✅ Chaque section unique
- ✅ Positions aléatoires
- ✅ Tailles variées

### Cohérence
- ✅ Même palette (#000000, #2E1A36, #321011)
- ✅ Même style (radial gradients + blur)
- ✅ Même timing (animations synchronisées)

## Performance

### Optimisations
- `pointer-events: none` sur overlays
- `position: fixed` pour body (1 seul repaint)
- `transform` pour animations (GPU)
- `will-change` implicite via animations

### Z-index
- Body ::before : -1
- Body ::after : -1
- Section overlays : -10
- Section content : 1

## Résultat

Le portfolio a maintenant :
- ✅ Fond dynamique avec 8+ couches de dégradés
- ✅ Orbes flottants animés
- ✅ Variations uniques par section
- ✅ Ambiance immersive et mystérieuse
- ✅ Mouvement subtil et élégant
- ✅ Performance optimisée

🎨 **Effet** : Fond vivant et organique qui évolue constamment !
