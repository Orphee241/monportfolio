# 🧩 Guide des Composants

## Classes CSS Réutilisables

### 1. **Buttons**

#### Button Primary
```tsx
<button className="px-btn px-btn-primary">
  Mon Bouton
</button>
```

#### Button avec Icône
```tsx
<button className="px-btn px-btn-primary group">
  <span className="flex items-center gap-2">
    Texte
    <BiRightArrowAlt className="text-xl group-hover:translate-x-1 transition-transform" />
  </span>
</button>
```

#### Button Outline
```tsx
<button className="px-btn border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
  Outline Button
</button>
```

### 2. **Cards**

#### Service Card
```tsx
<div className="feature-box-01">
  <div className="icon">
    <BiCode />
  </div>
  <div className="feature-content">
    <h5>Titre du Service</h5>
    <p>Description du service...</p>
  </div>
</div>
```

#### Portfolio Card
```tsx
<div className="portfolio-card">
  <Image src="/image.jpg" alt="Project" />
  <div className="portfolio-overlay">
    <h3>Titre du Projet</h3>
    <p>Description</p>
  </div>
</div>
```

### 3. **Text Styles**

#### Titre avec Gradient
```tsx
<h1>
  Texte normal <span className="text-theme">Texte gradient</span>
</h1>
```

#### Section Heading
```tsx
<div className="section-heading text-center">
  <h3>
    <span className="text-theme">Mon Titre</span>
  </h3>
</div>
```

### 4. **Progress Bars**

```tsx
<div className="mb-6">
  <div className="flex justify-between items-center mb-2">
    <span className="text-white font-medium">Compétence</span>
    <span className="bar-percent">90%</span>
  </div>
  <div className="bar">
    <div className="bar-inner" style={{ width: "90%" }} />
  </div>
</div>
```

### 5. **Info Items**

```tsx
<div className="info-item">
  <BiEnvelope className="text-primary" />
  <span>email@example.com</span>
</div>
```

### 6. **Sections**

#### Section Standard
```tsx
<section className="section border-top-g">
  <div className="container mx-auto px-4">
    {/* Contenu */}
  </div>
</section>
```

#### Section avec Heading
```tsx
<section className="section border-top-g">
  <div className="container mx-auto px-4">
    <div className="section-heading text-center">
      <h3>
        <span className="text-theme">Titre</span>
      </h3>
    </div>
    {/* Contenu */}
  </div>
</section>
```

## 🎨 Utility Classes

### Couleurs
```css
.text-primary     /* #12c2e9 */
.text-white       /* #ffffff */
.text-light       /* #e0e0e0 */
.text-muted       /* #a0a0a0 */
.text-theme       /* Gradient animé */
```

### Backgrounds
```css
.bg-gradient-main   /* Gradient principal */
.bg-card           /* Background card */
```

### Shadows
```css
.shadow-glow       /* Ombre avec glow */
.shadow-glow-lg    /* Ombre glow large */
```

### Animations
```css
.animate-fade-in-up      /* Entrée depuis le bas */
.animate-fade-in-right   /* Entrée depuis la droite */
.animate-shimmer         /* Effet brillant */
.animate-float           /* Mouvement flottant */
.animate-pulse-slow      /* Pulsation lente */
```

## 🎯 Patterns Communs

### 1. **Card avec Hover Effect**
```tsx
<div className="relative group">
  <div className="feature-box-01">
    <div className="icon group-hover:scale-110 transition-transform">
      <BiIcon />
    </div>
    <div className="feature-content">
      <h5 className="group-hover:text-primary transition-colors">Titre</h5>
      <p>Description</p>
    </div>
  </div>
</div>
```

### 2. **Grid Responsive**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### 3. **Flex avec Gap**
```tsx
<div className="flex flex-wrap gap-4">
  {/* Items */}
</div>
```

### 4. **Container Centré**
```tsx
<div className="container mx-auto px-4">
  {/* Contenu */}
</div>
```

## 🔧 Personnalisation

### Créer une Nouvelle Card
```tsx
// 1. Structure HTML
<div className="custom-card">
  <div className="card-content">
    {/* Contenu */}
  </div>
</div>

// 2. Styles CSS
.custom-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}
```

### Ajouter une Animation
```css
/* 1. Définir le keyframe */
@keyframes myAnimation {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 2. Appliquer l'animation */
.my-element {
  animation: myAnimation 0.6s ease-out;
}
```

### Créer un Gradient Personnalisé
```css
.my-gradient {
  background: linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## 📱 Responsive Helpers

### Breakpoints
```tsx
{/* Mobile only */}
<div className="block md:hidden">Mobile</div>

{/* Desktop only */}
<div className="hidden md:block">Desktop</div>

{/* Responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Items */}
</div>
```

### Responsive Text
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Titre Responsive
</h1>
```

### Responsive Spacing
```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Contenu */}
</div>
```

## 🎨 Exemples Complets

### Card de Service Complète
```tsx
<div className="feature-box-01 group">
  <div className="icon">
    <BiCode className="text-2xl" />
  </div>
  <div className="feature-content">
    <h5 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
      Développement Web
    </h5>
    <p className="text-muted group-hover:text-light transition-colors">
      Création de sites web modernes et performants avec les dernières technologies.
    </p>
  </div>
</div>
```

### Section About Complète
```tsx
<section className="section border-top-g">
  <div className="container mx-auto px-4">
    <div className="section-heading text-center">
      <h3>
        <span className="text-theme">À Propos</span>
      </h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="about-img">
        <Image src="/profile.jpg" alt="Profile" />
      </div>
      
      <div className="about-text">
        <div className="about-row">
          <h3>Présentation</h3>
          <p>Votre texte ici...</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

## 🚀 Best Practices

1. **Toujours utiliser les variables CSS** pour les couleurs
2. **Préférer les transitions CSS** aux animations JavaScript
3. **Utiliser cubic-bezier** pour des transitions fluides
4. **Tester sur mobile** avant de valider
5. **Optimiser les images** avec Next.js Image
6. **Garder les animations subtiles** (< 0.6s)
7. **Utiliser les classes Tailwind** quand possible
8. **Documenter les composants** personnalisés

---

**Astuce** : Utilisez les DevTools pour inspecter et copier les styles existants !
