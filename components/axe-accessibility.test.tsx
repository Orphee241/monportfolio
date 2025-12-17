import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Header from "@/components/layout/Header";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileMenu from "@/components/ui/MobileMenu";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import PortfolioCarousel from "@/components/ui/PortfolioCarousel";
import { PortfolioItem, PersonalInfo, Education, Experience } from "@/types";

expect.extend(toHaveNoViolations);

// Feature: portfolio-modernization, Accessibility Audit with axe-core
// Validates: Requirements 7.1, 7.3, 7.5

describe("Accessibility Audit with axe-core", () => {
  it("Header component should have no accessibility violations", async () => {
    const { container } = render(<Header transparent={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("WhatsAppButton component should have no accessibility violations", async () => {
    const { container } = render(
      <WhatsAppButton
        phoneNumber="+241066666666"
        message="Bonjour, je souhaite discuter d'un projet"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("MobileMenu component should have no accessibility violations", async () => {
    const menuItems = [
      { label: "Accueil", href: "accueil" },
      { label: "À propos", href: "about" },
      { label: "Services", href: "services" },
    ];
    const { container } = render(
      <MobileMenu
        isOpen={true}
        onClose={() => {}}
        menuItems={menuItems}
        onItemClick={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("HeroSection component should have no accessibility violations", async () => {
    const { container } = render(
      <HeroSection
        name="GONA"
        title="Développeur Full Stack"
        description="Passionné par le développement web et le design graphique"
        profileImage="/images/profile.jpg"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("AboutSection component should have no accessibility violations", async () => {
    const personalInfo: PersonalInfo = {
      name: "GONA",
      fullName: "Glen Orphée NZIENGUI-AKOUMBOU",
      title: "Développeur Full Stack",
      description: "Développeur passionné",
      email: "gona@example.com",
      phone: ["+241066666666"],
      location: "Libreville, Gabon",
      birthDate: "01/01/1990",
      nationality: "Gabonaise",
      profileImage: "/images/profile.jpg",
    };

    const education: Education[] = [
      {
        title: "Licence en Informatique",
        institution: "Université Omar Bongo",
        period: "2015-2018",
      },
    ];

    const experiences: Experience[] = [
      {
        role: "Développeur Full Stack",
        company: "Tech Company",
        period: "2018-2023",
      },
    ];

    const { container } = render(
      <AboutSection
        personalInfo={personalInfo}
        education={education}
        experiences={experiences}
        profileImage="/images/profile.jpg"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("PortfolioCarousel component should have no accessibility violations", async () => {
    const items: PortfolioItem[] = [
      {
        id: "project1",
        title: "Portfolio NMCH",
        description: "Portfolio moderne avec Next.js",
        image: "/images/portfolio/project1.jpg",
        category: "web",
        link: "https://example.com",
      },
      {
        id: "project2",
        title: "Design Graphique",
        description: "Création graphique originale",
        image: "/images/graphic-design/design1.jpg",
        category: "graphic",
      },
    ];

    const { container } = render(
      <PortfolioCarousel items={items} onItemClick={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
