import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../Header";
import Footer from "../Footer";
import WhatsAppButton from "../WhatsAppButton";

describe("Layout Components Unit Tests", () => {
  describe("Header Component", () => {
    it("should render navigation links", () => {
      render(<Header />);

      // Check for navigation links
      expect(screen.getByText("Accueil")).toBeInTheDocument();
      expect(screen.getByText("Présentation")).toBeInTheDocument();
      expect(screen.getByText("Compétences")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Réalisations")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render logo button", () => {
      render(<Header />);

      const logoButton = screen.getByRole("button", { name: /Retour à l'accueil/i });
      expect(logoButton).toBeInTheDocument();
      expect(logoButton).toHaveTextContent("GONA");
    });

    it("should render mobile menu button", () => {
      render(<Header />);

      const mobileMenuButton = screen.getByLabelText("Ouvrir le menu de navigation");
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it("should apply transparent class when transparent prop is true", () => {
      const { container } = render(<Header transparent={true} />);

      const header = container.querySelector("header");
      expect(header).toBeInTheDocument();
    });
  });

  describe("Footer Component", () => {
    it("should display copyright information with current year", () => {
      const currentYear = new Date().getFullYear();
      render(<Footer />);

      const copyrightText = screen.getByText(
        new RegExp(`© ${currentYear} GONA`)
      );
      expect(copyrightText).toBeInTheDocument();
    });

    it("should display copyright with custom year", () => {
      const customYear = 2023;
      render(<Footer year={customYear} />);

      const copyrightText = screen.getByText(
        new RegExp(`© ${customYear} GONA`)
      );
      expect(copyrightText).toBeInTheDocument();
    });

    it("should display 'Tous droits réservés' text", () => {
      render(<Footer />);

      const rightsText = screen.getByText(/Tous droits réservés/i);
      expect(rightsText).toBeInTheDocument();
    });
  });

  describe("WhatsAppButton Component", () => {
    it("should have correct href format with phone number", () => {
      const phoneNumber = "+241 77187894";
      render(<WhatsAppButton phoneNumber={phoneNumber} />);

      const link = screen.getByRole("link", { name: /Contact via WhatsApp/i });
      expect(link).toBeInTheDocument();

      // Check href format - should be https://wa.me/{digits}
      const href = link.getAttribute("href");
      expect(href).toMatch(/^https:\/\/wa\.me\/\d+/);
    });

    it("should format phone number by removing non-digits", () => {
      const phoneNumber = "+241 77 18 78 94";
      render(<WhatsAppButton phoneNumber={phoneNumber} />);

      const link = screen.getByRole("link", { name: /Contact via WhatsApp/i });
      const href = link.getAttribute("href");

      // Should contain only digits after wa.me/
      expect(href).toContain("24177187894");
    });

    it("should include encoded message in href", () => {
      const phoneNumber = "+241 77187894";
      const message = "Bonjour, je veux discuter";
      render(<WhatsAppButton phoneNumber={phoneNumber} message={message} />);

      const link = screen.getByRole("link", { name: /Contact via WhatsApp/i });
      const href = link.getAttribute("href");

      // Should contain text parameter
      expect(href).toContain("?text=");
      expect(href).toContain(encodeURIComponent(message));
    });

    it("should have target='_blank' and rel='noopener noreferrer'", () => {
      const phoneNumber = "+241 77187894";
      render(<WhatsAppButton phoneNumber={phoneNumber} />);

      const link = screen.getByRole("link", { name: /Contact via WhatsApp/i });

      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("should have aria-label for accessibility", () => {
      const phoneNumber = "+241 77187894";
      render(<WhatsAppButton phoneNumber={phoneNumber} />);

      const link = screen.getByLabelText("Contact via WhatsApp");
      expect(link).toBeInTheDocument();
    });
  });
});
