# Design Document - Portfolio Modernization

## Overview

This design document outlines the architecture and implementation strategy for modernizing GONA's portfolio from a static HTML/CSS/jQuery site to a modern Next.js 14+ application with Tailwind CSS. The solution will maintain the existing visual design while significantly improving performance, SEO, accessibility, and maintainability.

The application will be a single-page application (SPA) with smooth scrolling navigation, optimized images, and server-side rendering capabilities for improved SEO. All existing content will be preserved and enhanced with modern web standards.

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI (for accessible components)
- **Image Optimization**: Next.js Image component with WebP format
- **Animations**: Framer Motion
- **Icons**: React Icons (Bootstrap Icons, Font Awesome)
- **Carousel**: Swiper React
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: Vercel

### Project Structure

```
monportfolio-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── WhatsAppButton.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── PortfolioSection.tsx
│   │   │   └── ContactSection.tsx
│   │   └── ui/
│   │       ├── SkillBar.tsx
│   │       ├── ServiceCard.tsx
│   │       ├── PortfolioCarousel.tsx
│   │       └── MobileMenu.tsx
│   ├── lib/
│   │   ├── data/
│   │   │   ├── personal-info.ts
│   │   │   ├── skills.ts
│   │   │   ├── services.ts
│   │   │   └── portfolio-items.ts
│   │   └── utils/
│   │       └── scroll.ts
│   └── types/
│       └── index.ts
├── public/
│   ├── images/
│   │   ├── profile/
│   │   ├── portfolio/
│   │   └── graphic-design/
│   └── favicon.ico
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

## Components and Interfaces

### Core Components

#### 1. Layout Components

**Header Component**

```typescript
interface HeaderProps {
  transparent?: boolean;
}
```

**Footer Component**

```typescript
interface FooterProps {
  year: number;
}
```

**WhatsAppButton Component**

```typescript
interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}
```

#### 2. Section Components

**HeroSection**

```typescript
interface HeroSectionProps {
  name: string;
  title: string;
  description: string;
  profileImage: string;
}
```

**AboutSection**

```typescript
interface PersonalInfo {
  email: string;
  phone: string[];
  location: string;
  birthDate: string;
  nationality: string;
}

interface Education {
  title: string;
  institution: string;
  period: string;
}

interface Experience {
  role: string;
  company: string;
  period?: string;
}

interface AboutSectionProps {
  personalInfo: PersonalInfo;
  education: Education[];
  experiences: Experience[];
  profileImage: string;
}
```

**SkillsSection**

```typescript
interface Skill {
  name: string;
  level: number;
  category: "competence" | "tool";
}

interface SkillsSectionProps {
  skills: Skill[];
}
```

**ServicesSection**

```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServicesSectionProps {
  services: Service[];
}
```

**PortfolioSection**

```typescript
interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  link?: string;
  category: "web" | "graphic";
}

interface PortfolioSectionProps {
  webProjects: PortfolioItem[];
  graphicProjects: PortfolioItem[];
}
```

**ContactSection**

```typescript
interface ContactInfo {
  address: string;
  email: string;
  phone: string[];
  whatsapp: string;
}

interface ContactSectionProps {
  contactInfo: ContactInfo;
}
```

## Data Models

### Personal Information Model

```typescript
interface PersonalInfo {
  name: string;
  fullName: string;
  title: string;
  description: string;
  email: string;
  phone: string[];
  location: string;
  birthDate: string;
  nationality: string;
  profileImage: string;
}
```

### Skill Model

```typescript
interface Skill {
  id: string;
  name: string;
  level: number;
  category: "competence" | "tool";
}
```

### Service Model

```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  technologies: string[];
}
```

### Portfolio Item Model

```typescript
interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  category: "web" | "graphic";
  technologies?: string[];
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Property 1: Navigation preserves SPA behavior
_For any_ navigation link click, the page should scroll to the target section without triggering a full page reload, and the URL hash should update accordingly
**Validates: Requirements 1.2**

Property 2: Below-fold images use lazy loading
_For any_ image element that is positioned below the initial viewport, the image should have the loading="lazy" attribute set
**Validates: Requirements 1.3**

Property 3: Images use modern formats with fallback
_For any_ image rendered through Next.js Image component, the system should serve WebP format with automatic fallback to original format
**Validates: Requirements 1.4**

Property 4: Data sections render all required fields
_For any_ data object (personal info, education, experience, contact info), when rendered in its respective section, all required fields defined in the data model should be present in the DOM
**Validates: Requirements 2.1, 2.2, 2.5, 5.1**

Property 5: Skills and tools render with visual indicators
_For any_ skill or tool item, when rendered, the DOM should contain both the name and a visual progress indicator element with the correct level value
**Validates: Requirements 2.3, 2.4**

Property 6: Services display required content
_For any_ service object, when rendered, the service card should display both a title and description in the DOM
**Validates: Requirements 3.2**

Property 7: Gallery navigation controls exist
_For any_ portfolio gallery (web or graphic), the rendered carousel should include navigation control elements (previous/next buttons)
**Validates: Requirements 4.2**

Property 8: Web project links open in new tab
_For any_ web development portfolio item with a link, the anchor element should have target="\_blank" and rel="noopener noreferrer" attributes
**Validates: Requirements 4.3**

Property 9: Graphic design items have click handlers
_For any_ graphic design portfolio item, the rendered element should have an onClick handler or be wrapped in a clickable element for lightbox functionality
**Validates: Requirements 4.4**

Property 10: Carousel autoplay responds to hover
_For any_ carousel with autoplay enabled, hovering over the carousel should pause autoplay, and mouse leave should resume it
**Validates: Requirements 4.5**

Property 11: Contact links use correct protocols
_For any_ contact link (email, phone, WhatsApp), the href attribute should use the appropriate protocol (mailto:, tel:, https://wa.me/) with correctly formatted values
**Validates: Requirements 5.2, 5.3, 5.4**

Property 12: Pages include required meta tags
_For any_ page in the application, the HTML head should contain meta tags for title, description, Open Graph, and Twitter Card with non-empty content values
**Validates: Requirements 6.1, 6.5**

Property 13: Sections use semantic HTML5 elements
_For any_ major content section, the rendered markup should use semantic HTML5 elements (section, article, nav, header, footer) rather than generic div elements
**Validates: Requirements 6.2**

Property 14: Images include alt attributes
_For any_ image element in the DOM, the element should have an alt attribute with non-empty descriptive text
**Validates: Requirements 6.3, 7.3**

Property 15: Interactive elements have ARIA attributes
_For any_ interactive element (buttons, links, form inputs), the element should include appropriate ARIA attributes (aria-label, role, or aria-describedby)
**Validates: Requirements 7.1**

Property 16: Mobile menu toggles drawer state
_For any_ mobile menu state (open or closed), clicking the hamburger button should toggle to the opposite state
**Validates: Requirements 10.2**

Property 17: Menu item selection triggers actions
_For any_ menu item click in the mobile drawer, both the drawer close action and scroll-to-section action should be triggered
**Validates: Requirements 10.3**

Property 18: Carousels support touch events
_For any_ carousel component, the element should have touch event listeners (touchstart, touchmove, touchend) attached for swipe navigation
**Validates: Requirements 10.4**

Property 19: Viewport resize maintains state
_For any_ component state before viewport resize, after resizing the viewport, the component should maintain its state without remounting
**Validates: Requirements 10.5**

## Error Handling

### Image Loading Errors

- Use Next.js Image component's built-in error handling with fallback images
- Display a generic placeholder with appropriate alt text

### Navigation Errors

- Validate section IDs before scrolling
- Scroll to top if target section doesn't exist

### Browser Compatibility

- Use Next.js polyfills and modern browser features with fallbacks
- Target browsers supporting ES2020+

## Testing Strategy

### Unit Testing

**Framework**: Vitest with React Testing Library

**Coverage Areas**:

- Component rendering with various props
- User interaction handlers
- Utility functions
- Edge cases

### Property-Based Testing

**Framework**: fast-check

**Configuration**: Each property test should run a minimum of 100 iterations

**Test Tagging**: Each property-based test must include a comment:
`// Feature: portfolio-modernization, Property {number}: {property_text}`

**Coverage Areas**:

- Data rendering properties (Properties 4, 5, 6)
- Link format properties (Properties 8, 11)
- Accessibility properties (Properties 14, 15)
- Interactive behavior properties (Properties 10, 16, 17, 19)

## Performance Optimization

### Image Optimization

- Use Next.js Image component for automatic optimization
- Convert all images to WebP format with JPEG/PNG fallbacks
- Implement responsive images with srcset
- Lazy load all images below the fold

### Code Splitting

- Leverage Next.js automatic code splitting
- Dynamic imports for heavy components

### Asset Optimization

- Minify CSS and JavaScript in production
- Use Tailwind CSS purge to remove unused styles

## Deployment Strategy

### Build Process

1. Run TypeScript type checking
2. Run linting (ESLint)
3. Run unit tests
4. Run property-based tests
5. Build Next.js application
6. Deploy to Vercel

### Environment Configuration

- Development: `.env.local` for local development
- Production: Environment variables via Vercel dashboard

## Accessibility Considerations

### Keyboard Navigation

- All interactive elements accessible via Tab key
- Visible focus indicators
- Escape key closes mobile menu and modals

### Screen Reader Support

- Semantic HTML structure
- ARIA labels on icon-only buttons
- Descriptive alt text on all images

### Visual Accessibility

- WCAG AA contrast ratios (4.5:1 for text)
- Text resizable up to 200%
- No information conveyed by color alone

## SEO Optimization

### Meta Tags

- Unique title and description
- Open Graph tags for social sharing
- Twitter Card tags

### Structured Data

- JSON-LD schema for Person
- JSON-LD schema for WebSite

### Performance

- Server-side rendering for initial load
- Static generation where possible
- Optimized images

## Migration Strategy

### Phase 1: Setup and Structure

- Initialize Next.js project with TypeScript
- Configure Tailwind CSS
- Set up project structure
- Migrate static assets

### Phase 2: Component Development

- Build layout components
- Build section components
- Build UI components

### Phase 3: Data Migration

- Extract content from HTML to TypeScript data files
- Optimize and convert images

### Phase 4: Functionality Implementation

- Implement smooth scrolling
- Add carousel functionality
- Implement mobile menu

### Phase 5: Testing and Optimization

- Write unit tests
- Write property-based tests
- Run accessibility audits
- Optimize performance

### Phase 6: Deployment

- Deploy to Vercel
- Configure custom domain
- Monitor performance
