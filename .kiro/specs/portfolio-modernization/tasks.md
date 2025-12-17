# Implementation Plan - Portfolio Modernization

- [x] 1. Initialize Next.js project with TypeScript and Tailwind CSS
  - Create new Next.js 14+ project with App Router
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom configuration
  - Install required dependencies (Framer Motion, React Icons, Swiper, Headless UI)
  - Configure next.config.js for image optimization
  - Set up ESLint and Prettier
  - _Requirements: 8.1, 8.3_

- [x] 2. Set up project structure and migrate static assets
  - Create folder structure (components, lib, types, public)
  - Migrate and optimize images from old portfolio
  - Convert images to WebP format with fallbacks
  - Set up favicon and meta images
  - Create TypeScript type definitions file
  - _Requirements: 1.4, 8.1_

- [x] 3. Create data models and extract content
  - [x] 3.1 Create TypeScript interfaces for all data models
    - Define PersonalInfo, Skill, Service, PortfolioItem, Education, Experience interfaces
    - Export all types from types/index.ts
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.2 Extract personal information data
    - Create lib/data/personal-info.ts with GONA's information
    - Include name, title, description, contact details, education, experiences
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 3.3 Extract skills and tools data
    - Create lib/data/skills.ts with competences and tools
    - Include skill levels (0-100) for each item
    - _Requirements: 2.3, 2.4_

  - [x] 3.4 Extract services data
    - Create lib/data/services.ts with service offerings
    - Include titles, descriptions, and technologies
    - _Requirements: 3.1, 3.2_

  - [x] 3.5 Extract portfolio items data
    - Create lib/data/portfolio-items.ts with web and graphic design projects
    - Include project titles, images, links, and categories
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 3.6 Write property test for data completeness
    - **Property 4: Data sections render all required fields**
    - **Validates: Requirements 2.1, 2.2, 2.5, 5.1**

- [x] 4. Build layout components
  - [x] 4.1 Create Header component with navigation
    - Implement sticky header with scroll detection
    - Add navigation links with smooth scroll functionality
    - Implement active section highlighting
    - Add mobile hamburger menu button
    - _Requirements: 1.2, 10.1_

  - [x] 4.2 Create Footer component
    - Display copyright information with current year
    - Add simple styling consistent with design
    - _Requirements: N/A_

  - [x] 4.3 Create WhatsAppButton component
    - Implement fixed position floating button
    - Add pulse animation with CSS/Framer Motion
    - Make button responsive for mobile and desktop
    - _Requirements: 5.4, 5.5_

  - [x] 4.4 Write property test for contact link protocols
    - **Property 11: Contact links use correct protocols**
    - **Validates: Requirements 5.2, 5.3, 5.4**

  - [x] 4.5 Write unit tests for layout components
    - Test Header renders navigation links
    - Test Footer displays correct year
    - Test WhatsAppButton has correct href format
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 5. Build UI components
  - [x] 5.1 Create SkillBar component
    - Implement animated progress bar
    - Add percentage display
    - Use Intersection Observer for animation trigger
    - _Requirements: 2.3, 2.4_

  - [x] 5.2 Create ServiceCard component
    - Display service title and description
    - Add icon support with React Icons
    - Implement hover effects
    - _Requirements: 3.2, 3.3_

  - [x] 5.3 Create PortfolioCarousel component
    - Integrate Swiper React for carousel functionality
    - Add navigation controls (prev/next buttons)
    - Implement autoplay with pause on hover
    - Add touch/swipe support
    - Implement lazy loading for images
    - _Requirements: 4.2, 4.5, 10.4_

  - [x] 5.4 Create MobileMenu component
    - Implement slide-in drawer animation
    - Add backdrop overlay
    - Close menu on item click
    - Add close button
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 5.5 Write property test for skills rendering
    - **Property 5: Skills and tools render with visual indicators**
    - **Validates: Requirements 2.3, 2.4**

  - [x] 5.6 Write property test for services rendering
    - **Property 6: Services display required content**
    - **Validates: Requirements 3.2**

  - [x] 5.7 Write property test for carousel controls
    - **Property 7: Gallery navigation controls exist**
    - **Validates: Requirements 4.2**

  - [x] 5.8 Write property test for carousel autoplay
    - **Property 10: Carousel autoplay responds to hover**
    - **Validates: Requirements 4.5**

  - [x] 5.9 Write property test for mobile menu toggle
    - **Property 16: Mobile menu toggles drawer state**
    - **Validates: Requirements 10.2**

  - [x] 5.10 Write property test for menu item actions
    - **Property 17: Menu item selection triggers actions**
    - **Validates: Requirements 10.3**

  - [x] 5.11 Write property test for touch events
    - **Property 18: Carousels support touch events**
    - **Validates: Requirements 10.4**

- [x] 6. Build section components
  - [x] 6.1 Create HeroSection component
    - Display name, title, and description
    - Add profile image with custom border radius
    - Implement responsive layout (text + image)
    - Add fade-in animation on load
    - _Requirements: 1.1, 1.5_

  - [x] 6.2 Create AboutSection component
    - Implement sticky sidebar with profile image
    - Display personal details with icons
    - Show education information
    - Display professional experiences
    - Make section scrollable and responsive
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 6.3 Create SkillsSection component
    - Display competences with SkillBar components
    - Display tools with SkillBar components
    - Group skills by category
    - Trigger animations on scroll into view
    - _Requirements: 2.3, 2.4_

  - [x] 6.4 Create ServicesSection component
    - Display services in responsive grid
    - Use ServiceCard components
    - Add section heading
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 6.5 Create PortfolioSection component
    - Create two separate carousels (web and graphic design)
    - Use PortfolioCarousel component
    - Implement lightbox for graphic design images
    - Add external links for web projects with target="\_blank"
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.6 Create ContactSection component
    - Display contact information cards
    - Add clickable email, phone, and WhatsApp links
    - Use appropriate protocols (mailto:, tel:, wa.me)
    - Display icons for each contact method
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.7 Write property test for web project links
    - **Property 8: Web project links open in new tab**
    - **Validates: Requirements 4.3**

  - [x] 6.8 Write property test for graphic design click handlers
    - **Property 9: Graphic design items have click handlers**
    - **Validates: Requirements 4.4**

- [-
] 7. Implement main page and layout
  - [ ] 7.1 Create app/layout.tsx with metadata
    - Set up HTML structure with proper lang attribute
    - Add meta tags (title, description, keywords)
    - Add Open Graph and Twitter Card meta tags
    - Include favicon and theme color
    - Import global CSS and fonts
    - _Requirements: 6.1, 6.5_

  - [ ] 7.2 Create app/page.tsx with all sections
    - Import and render all section components
    - Pass data from lib/data files to components
    - Ensure proper section ordering
    - Add semantic HTML5 elements (section, article, nav)
    - _Requirements: 6.2_

  - [ ] 7.3 Create app/globals.css with Tailwind and custom styles
    - Import Tailwind directives
    - Add custom CSS for animations
    - Define color palette variables
    - Add smooth scroll behavior
    - _Requirements: 1.2, 8.3_

  - [ ] 7.4 Write property test for meta tags
    - **Property 12: Pages include required meta tags**
    - **Validates: Requirements 6.1, 6.5**

  - [ ] 7.5 Write property test for semantic HTML
    - **Property 13: Sections use semantic HTML5 elements**
    - **Validates: Requirements 6.2**

- [x] 8. Implement smooth scrolling and navigation
  - [x] 8.1 Create scroll utility functions
    - Implement smooth scroll to section function
    - Add scroll event listener for active section detection
    - Create function to update URL hash without page reload
    - _Requirements: 1.2_

  - [x] 8.2 Integrate scroll utilities with Header
    - Connect navigation links to scroll functions
    - Update active link based on scroll position
    - Ensure mobile menu closes after navigation
    - _Requirements: 1.2, 10.3_

  - [x] 8.3 Write property test for SPA navigation
    - **Property 1: Navigation preserves SPA behavior**
    - **Validates: Requirements 1.2**

  - [x] 8.4 Write property test for viewport resize
    - **Property 19: Viewport resize maintains state**
    - **Validates: Requirements 10.5**

- [x] 9. Implement image optimization and lazy loading
  - [x] 9.1 Replace all img tags with Next.js Image component
    - Update HeroSection profile image
    - Update AboutSection profile image
    - Update PortfolioCarousel images
    - Configure Image component with proper sizes and priority
    - _Requirements: 1.3, 1.4_

  - [x] 9.2 Configure lazy loading for below-fold images
    - Set loading="lazy" for portfolio images
    - Set loading="lazy" for graphic design images
    - Set priority={true} for hero image
    - _Requirements: 1.3_

  - [x] 9.3 Write property test for lazy loading
    - **Property 2: Below-fold images use lazy loading**
    - **Validates: Requirements 1.3**

  - [x] 9.4 Write property test for image formats
    - **Property 3: Images use modern formats with fallback**
    - **Validates: Requirements 1.4**

- [x] 10. Implement accessibility features
  - [x] 10.1 Add ARIA labels to interactive elements
    - Add aria-label to hamburger menu button
    - Add aria-label to carousel navigation buttons
    - Add aria-label to WhatsApp button
    - Add role attributes where needed
    - _Requirements: 7.1_

  - [x] 10.2 Add alt text to all images
    - Write descriptive alt text for profile images
    - Write descriptive alt text for portfolio images
    - Write descriptive alt text for graphic design images
    - _Requirements: 6.3, 7.3_

  - [x] 10.3 Implement keyboard navigation
    - Ensure all interactive elements are focusable
    - Add visible focus indicators with CSS
    - Implement Escape key to close mobile menu
    - Test tab order through all sections
    - _Requirements: 7.2, 7.4_

  - [x] 10.4 Write property test for ARIA attributes
    - **Property 15: Interactive elements have ARIA attributes**
    - **Validates: Requirements 7.1**

  - [x] 10.5 Write property test for image alt attributes
    - **Property 14: Images include alt attributes**
    - **Validates: Requirements 6.3, 7.3**

  - [x] 10.6 Run accessibility audit with axe-core
    - Install @axe-core/react
    - Run automated accessibility tests
    - Fix any violations found
    - _Requirements: 7.1, 7.3, 7.5_

- [x] 11. Configure SEO and metadata
  - [x] 11.1 Create sitemap.xml
    - Generate sitemap for the portfolio page
    - Include lastmod and priority
    - _Requirements: 6.4_

  - [x] 11.2 Create robots.txt
    - Allow all crawlers
    - Reference sitemap location
    - _Requirements: 6.4_

  - [x] 11.3 Add structured data (JSON-LD)
    - Add Person schema for GONA
    - Add WebSite schema
    - Include in layout.tsx
    - _Requirements: 6.1_

- [x] 12. Optimize performance
  - [x] 12.1 Configure Tailwind CSS purge
    - Set up content paths in tailwind.config.ts
    - Verify unused styles are removed in production build
    - _Requirements: 8.3_

  - [x] 12.2 Implement code splitting for heavy components
    - Use dynamic imports for PortfolioCarousel
    - Use dynamic imports for MobileMenu
    - Use dynamic imports for Framer Motion animations
    - _Requirements: 1.1_

  - [x] 12.3 Optimize bundle size
    - Analyze bundle with @next/bundle-analyzer
    - Remove unused dependencies
    - Ensure JavaScript bundle < 200KB
    - _Requirements: 1.1_

  - [x] 12.4 Run Lighthouse audit
    - Test performance score (target > 90)
    - Test accessibility score (target > 90)
    - Test SEO score (target > 90)
    - Test best practices score (target > 90)
    - _Requirements: 1.1, 6.1, 7.5_

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Set up deployment configuration
  - [x] 14.1 Create vercel.json configuration
    - Configure redirects if needed
    - Set up headers for security
    - _Requirements: 9.1_

  - [x] 14.2 Create .env.example file
    - Document any environment variables needed
    - _Requirements: 8.5_

  - [x] 14.3 Test production build locally
    - Run `npm run build`
    - Run `npm run start`
    - Verify all functionality works in production mode
    - _Requirements: 9.3_

- [ ] 15. Deploy to Vercel
  - [ ] 15.1 Connect GitHub repository to Vercel
    - Create Vercel project
    - Link to GitHub repository
    - Configure automatic deployments
    - _Requirements: 9.1, 9.2_

  - [ ] 15.2 Configure custom domain
    - Add gona241.com to Vercel project
    - Configure DNS settings
    - Verify SSL certificate
    - _Requirements: 9.5_

  - [ ] 15.3 Set up Vercel Analytics
    - Enable Vercel Analytics
    - Monitor Core Web Vitals
    - _Requirements: 1.1_

- [x] 16. Final testing and validation
  - [x] 16.1 Test on multiple devices
    - Test on desktop (Chrome, Firefox, Safari)
    - Test on tablet (iPad)
    - Test on mobile (iPhone, Android)
    - _Requirements: 1.5, 10.1, 10.4_

  - [x] 16.2 Validate all links and functionality
    - Test all navigation links
    - Test all external portfolio links
    - Test email, phone, and WhatsApp links
    - Test carousel navigation and autoplay
    - Test mobile menu open/close
    - _Requirements: 1.2, 4.2, 4.3, 5.2, 5.3, 5.4, 10.2, 10.3_

  - [x] 16.3 Run final performance audit
    - Run Lighthouse on production URL
    - Verify page load time < 2 seconds
    - Verify all images are optimized
    - _Requirements: 1.1, 1.3, 1.4_

- [ ] 17. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
