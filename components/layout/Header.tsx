"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaBars } from "react-icons/fa";
import {
  scrollToSection as scrollToSectionUtil,
  createScrollListener,
} from "@/lib/utils/scroll";

// Dynamic import for MobileMenu with code splitting
const MobileMenu = dynamic(() => import("@/components/ui/MobileMenu"), {
  ssr: false,
});

const navigationLinks = [
  { id: "accueil", label: "Accueil" },
  { id: "concept&formation", label: "Présentation" },
  { id: "competences", label: "Compétences" },
  { id: "services", label: "Services" },
  { id: "realisations", label: "Réalisations" },
  { id: "contact", label: "Contactez-moi" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Set up scroll listener for active section detection
  useEffect(() => {
    const sectionIds = navigationLinks.map((link) => link.id);
    const cleanup = createScrollListener(sectionIds, setActiveSection);
    return cleanup;
  }, []);

  // Set initial active section to "accueil"
  useEffect(() => {
    setActiveSection("accueil");
  }, []);

  // Detect scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId: string) => {
    scrollToSectionUtil(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Prepare menu items for MobileMenu component
  const menuItems = navigationLinks.map((link) => ({
    label: link.label,
    href: link.id,
  }));

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/20' 
          : 'bg-black/90 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-20 max-w-[1400px]">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-[60px]' : 'h-[70px]'
          }`}>
            {/* Logo */}
            <button
              onClick={() => handleNavigation("accueil")}
              className="text-[22px] font-bold text-cyan-400 hover:text-cyan-300 transition-all duration-300 tracking-wide hover:scale-105"
              aria-label="Retour à l'accueil"
            >
              GONA
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Navigation principale">
              {navigationLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.id)}
                  className={`group text-[13px] font-medium px-5 py-2.5 uppercase tracking-wider transition-all duration-300 relative rounded-lg ${
                    activeSection === link.id
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  aria-current={activeSection === link.id ? "page" : undefined}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                  {/* Underline effect */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-400 transition-all duration-300 ${
                    activeSection === link.id ? 'w-8' : 'w-0 group-hover:w-8'
                  }`} />
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-cyan-400 transition-colors"
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={isMobileMenuOpen}
            >
              <FaBars size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
        onItemClick={handleNavigation}
      />
    </>
  );
}
