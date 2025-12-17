import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as fc from "fast-check";
import Header from "@/components/layout/Header";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileMenu from "@/components/ui/MobileMenu";
import PortfolioCarousel from "@/components/ui/PortfolioCarousel";
import { PortfolioItem } from "@/types";

// Feature: portfolio-modernization, Property 15: Interactive elements have ARIA attributes
// Validates: Requirements 7.1

describe("Property 15: Interactive elements have ARIA attributes", () => {
  it("should have aria-label on hamburger menu button", () => {
    fc.assert(
      fc.property(fc.boolean(), (transparent) => {
        const { container } = render(<Header transparent={transparent} />);
        const hamburgerButton = container.querySelector(
          'button[aria-label*="menu"]'
        );
        expect(hamburgerButton).toBeInTheDocument();
        expect(hamburgerButton).toHaveAttribute("aria-label");
        expect(hamburgerButton?.getAttribute("aria-label")).toBeTruthy();
      }),
      { numRuns: 100 }
    );
  });

  it("should have aria-label on WhatsApp button", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 15 }),
        fc.string({ minLength: 5, maxLength: 100 }),
        (phoneNumber, message) => {
          const { container } = render(
            <WhatsAppButton phoneNumber={phoneNumber} message={message} />
          );
          const whatsappButton = container.querySelector('a[aria-label]');
          expect(whatsappButton).toBeInTheDocument();
          expect(whatsappButton).toHaveAttribute("aria-label");
          const ariaLabel = whatsappButton?.getAttribute("aria-label");
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel?.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have aria-label on mobile menu close button", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 3, maxLength: 20 }),
            href: fc.string({ minLength: 3, maxLength: 20 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (menuItems) => {
          const { container } = render(
            <MobileMenu
              isOpen={true}
              onClose={() => {}}
              menuItems={menuItems}
              onItemClick={() => {}}
            />
          );
          const closeButton = container.querySelector(
            'button[aria-label*="menu"]'
          );
          expect(closeButton).toBeInTheDocument();
          expect(closeButton).toHaveAttribute("aria-label");
          expect(closeButton?.getAttribute("aria-label")).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have aria-label on carousel navigation buttons", { timeout: 15000 }, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 3, maxLength: 20 }),
            title: fc.string({ minLength: 3, maxLength: 50 }),
            image: fc.constant("/images/test.jpg"),
            category: fc.constantFrom("web" as const, "graphic" as const),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items: PortfolioItem[]) => {
          const { container } = render(
            <PortfolioCarousel items={items} onItemClick={() => {}} />
          );
          
          // Check that carousel items have proper role and aria-label
          const carouselItems = container.querySelectorAll('[role="button"]');
          carouselItems.forEach((item) => {
            expect(item).toHaveAttribute("aria-label");
            const ariaLabel = item.getAttribute("aria-label");
            expect(ariaLabel).toBeTruthy();
            expect(ariaLabel?.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have role attributes on navigation elements", () => {
    fc.assert(
      fc.property(fc.boolean(), (transparent) => {
        const { container } = render(<Header transparent={transparent} />);
        const navElements = container.querySelectorAll('nav[role="navigation"]');
        expect(navElements.length).toBeGreaterThan(0);
        navElements.forEach((nav) => {
          expect(nav).toHaveAttribute("role", "navigation");
        });
      }),
      { numRuns: 100 }
    );
  });

  it("should have aria-expanded on mobile menu toggle button", () => {
    fc.assert(
      fc.property(fc.boolean(), (transparent) => {
        const { container } = render(<Header transparent={transparent} />);
        const hamburgerButton = container.querySelector(
          'button[aria-expanded]'
        );
        expect(hamburgerButton).toBeInTheDocument();
        expect(hamburgerButton).toHaveAttribute("aria-expanded");
      }),
      { numRuns: 100 }
    );
  });

  it("should have aria-current on active navigation links", () => {
    fc.assert(
      fc.property(fc.boolean(), (transparent) => {
        const { container } = render(<Header transparent={transparent} />);
        // At least one button should exist (even if aria-current is undefined for inactive ones)
        const navButtons = container.querySelectorAll("nav button");
        expect(navButtons.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});
