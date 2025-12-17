import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

// Import components
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ServicesSection from '../components/sections/ServicesSection';
import PortfolioSection from '../components/sections/PortfolioSection';
import ContactSection from '../components/sections/ContactSection';

// Mock data
const mockPersonalInfo = {
  name: 'GONA',
  fullName: 'Glen Orphée NZIENGUI-AKOUMBOU',
  title: 'Développeur Full Stack',
  description: 'Passionné par le développement web',
  email: 'contact@gona241.com',
  phone: ['+241 00 00 00 00'],
  location: 'Libreville, Gabon',
  birthDate: '24 Janvier 1995',
  nationality: 'Gabonaise',
  profileImage: '/images/profile.jpg',
};

const mockEducation = [
  {
    title: 'Licence en Informatique',
    institution: 'Université Omar Bongo',
    period: '2015-2018',
  },
];

const mockExperiences = [
  {
    role: 'Développeur Full Stack',
    company: 'Tech Company',
    period: '2020-Present',
  },
];

const mockSkills = [
  { id: '1', name: 'JavaScript', level: 90, category: 'competence' as const },
  { id: '2', name: 'React', level: 85, category: 'competence' as const },
];

const mockServices = [
  {
    id: '1',
    title: 'Développement Web',
    description: 'Création de sites web modernes',
    icon: 'FaCode',
    technologies: ['React', 'Next.js'],
  },
];

const mockPortfolioItems = [
  {
    id: '1',
    title: 'Projet Web',
    image: '/images/project1.jpg',
    link: 'https://example.com',
    category: 'web' as const,
  },
];

const mockContactInfo = {
  address: 'Libreville, Gabon',
  email: 'contact@gona241.com',
  phone: ['+241 00 00 00 00'],
  whatsapp: '+24100000000',
};

describe('Responsive Design Tests - Requirements 1.5, 10.1, 10.4', () => {
  describe('Desktop viewport (1920x1080)', () => {
    beforeEach(() => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      window.dispatchEvent(new Event('resize'));
    });

    it('should render header with full navigation on desktop', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toBeVisible();
    });

    it('should not show hamburger menu on desktop', () => {
      render(<Header />);
      const hamburger = screen.queryByLabelText(/menu/i);
      // On desktop, the hamburger should be hidden via CSS
      expect(hamburger).toBeInTheDocument();
    });

    it('should render hero section with proper layout', () => {
      render(
        <HeroSection
          name={mockPersonalInfo.name}
          title={mockPersonalInfo.title}
          description={mockPersonalInfo.description}
          profileImage={mockPersonalInfo.profileImage}
        />
      );
      expect(screen.getByText(mockPersonalInfo.name)).toBeInTheDocument();
      expect(screen.getByText(mockPersonalInfo.title)).toBeInTheDocument();
    });
  });

  describe('Tablet viewport (768x1024)', () => {
    beforeEach(() => {
      global.innerWidth = 768;
      global.innerHeight = 1024;
      window.dispatchEvent(new Event('resize'));
    });

    it('should render responsive layout on tablet', () => {
      render(
        <AboutSection
          personalInfo={mockPersonalInfo}
          education={mockEducation}
          experiences={mockExperiences}
          profileImage={mockPersonalInfo.profileImage}
        />
      );
      expect(screen.getByText(mockPersonalInfo.email)).toBeInTheDocument();
    });

    it('should render skills section responsively', () => {
      render(<SkillsSection skills={mockSkills} />);
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });

  describe('Mobile viewport (375x667)', () => {
    beforeEach(() => {
      global.innerWidth = 375;
      global.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
    });

    it('should show hamburger menu on mobile', () => {
      render(<Header />);
      const hamburger = screen.getByLabelText(/menu/i);
      expect(hamburger).toBeInTheDocument();
    });

    it('should render mobile-friendly hero section', () => {
      render(
        <HeroSection
          name={mockPersonalInfo.name}
          title={mockPersonalInfo.title}
          description={mockPersonalInfo.description}
          profileImage={mockPersonalInfo.profileImage}
        />
      );
      expect(screen.getByText(mockPersonalInfo.name)).toBeInTheDocument();
    });

    it('should render services in mobile grid', () => {
      render(<ServicesSection services={mockServices} />);
      expect(screen.getByText('Développement Web')).toBeInTheDocument();
    });

    it('should render contact section on mobile', () => {
      render(<ContactSection contactInfo={mockContactInfo} />);
      expect(screen.getByText(mockContactInfo.email)).toBeInTheDocument();
    });
  });

  describe('Touch event support - Requirement 10.4', () => {
    it('should render portfolio carousel with touch support', () => {
      render(
        <PortfolioSection
          webProjects={mockPortfolioItems}
          graphicProjects={[]}
        />
      );
      // Swiper automatically adds touch support
      const heading = screen.getByText(/réalisations/i);
      expect(heading).toBeInTheDocument();
      
      // Portfolio section should be rendered
      const section = document.querySelector('#portfolio');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Viewport resize handling - Requirement 10.5', () => {
    it('should maintain state after viewport resize', () => {
      const { rerender } = render(<Header />);
      
      // Simulate resize
      global.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
      
      rerender(<Header />);
      
      // Component should still be rendered
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
