/**
 * Feature: portfolio-modernization, Property 3: Images use modern formats with fallback
 * Validates: Requirements 1.4
 *
 * For any image rendered through Next.js Image component, the system should serve
 * WebP format with automatic fallback to original format
 */

import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import PortfolioCarousel from "@/components/ui/PortfolioCarousel";
import { PersonalInfo, Education, Experience, PortfolioItem } from "@/types";

describe("Image Format Property Tests", () => {
  it("Property 3: HeroSection uses Next.js Image component for modern format support", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0),
        fc
          .string({ minLength: 1, maxLength: 100 })
          .filter((s) => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.constant("/images/profile.jpg"),
        (name, title, description, profileImage) => {
          const { container } = render(
            <HeroSection
              name={name}
              title={title}
              description={description}
              profileImage={profileImage}
            />
          );

          // Next.js Image component renders with specific attributes
          // that enable modern format support (WebP/AVIF)
          const images = container.querySelectorAll("img");

          // Verify that images exist and are rendered by Next.js Image component
          expect(images.length).toBeGreaterThan(0);

          images.forEach((img) => {
            // Next.js Image component adds specific attributes
            // srcset is used for responsive images and format negotiation
            const srcset = img.getAttribute("srcset");

            // Next.js Image component should generate srcset for format optimization
            // The presence of srcset indicates Next.js is handling the image
            expect(srcset).toBeTruthy();
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 3: AboutSection uses Next.js Image component for modern format support", () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc
            .string({ minLength: 1, maxLength: 50 })
            .filter((s) => s.trim().length > 0),
          fullName: fc
            .string({ minLength: 1, maxLength: 100 })
            .filter((s) => s.trim().length > 0),
          title: fc
            .string({ minLength: 1, maxLength: 100 })
            .filter((s) => s.trim().length > 0),
          description: fc.string({ minLength: 1, maxLength: 500 }),
          email: fc.emailAddress(),
          phone: fc.array(fc.string({ minLength: 10, maxLength: 15 }), {
            minLength: 1,
            maxLength: 3,
          }),
          location: fc.string({ minLength: 1, maxLength: 100 }),
          birthDate: fc.string({ minLength: 1, maxLength: 50 }),
          nationality: fc.string({ minLength: 1, maxLength: 50 }),
          profileImage: fc.constant("/images/profile.jpg"),
        }),
        fc.array(
          fc.record({
            title: fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            institution: fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            period: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.array(
          fc.record({
            role: fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            company: fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            period: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (personalInfo, education, experiences) => {
          const { container } = render(
            <AboutSection
              personalInfo={personalInfo as PersonalInfo}
              education={education as Education[]}
              experiences={experiences as Experience[]}
              profileImage={personalInfo.profileImage}
            />
          );

          const images = container.querySelectorAll("img");
          expect(images.length).toBeGreaterThan(0);

          images.forEach((img) => {
            const srcset = img.getAttribute("srcset");
            expect(srcset).toBeTruthy();
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 3: PortfolioCarousel uses Next.js Image component for modern format support", { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            title: fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            image: fc.constant("/images/portfolio/test.jpg"),
            category: fc.constantFrom("web" as const, "graphic" as const),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items) => {
          const portfolioItems: PortfolioItem[] = items;
          const { container } = render(
            <PortfolioCarousel items={portfolioItems} />
          );

          const images = container.querySelectorAll("img");
          expect(images.length).toBeGreaterThan(0);

          images.forEach((img) => {
            const srcset = img.getAttribute("srcset");
            // Next.js Image component should generate srcset
            expect(srcset).toBeTruthy();
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 3: All images have proper sizes attribute for responsive optimization", { timeout: 15000 }, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 50 }),
            title: fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            image: fc.constant("/images/portfolio/test.jpg"),
            category: fc.constantFrom("web" as const, "graphic" as const),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items) => {
          const portfolioItems: PortfolioItem[] = items;
          const { container } = render(
            <PortfolioCarousel items={portfolioItems} />
          );

          const images = container.querySelectorAll("img");
          expect(images.length).toBeGreaterThan(0);

          images.forEach((img) => {
            // Next.js Image component with sizes prop should render sizes attribute
            const sizes = img.getAttribute("sizes");
            expect(sizes).toBeTruthy();
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
