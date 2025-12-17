/**
 * Feature: portfolio-modernization, Property 2: Below-fold images use lazy loading
 * Validates: Requirements 1.3
 *
 * For any image element that is positioned below the initial viewport,
 * the image should have the loading="lazy" attribute set
 */

import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import AboutSection from "@/components/sections/AboutSection";
import PortfolioCarousel from "@/components/ui/PortfolioCarousel";
import { PersonalInfo, Education, Experience, PortfolioItem } from "@/types";

describe("Image Lazy Loading Property Tests", () => {
  it("Property 2: AboutSection profile image (below-the-fold) uses lazy loading", () => {
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

          // Find all Next.js Image components rendered as img tags
          const images = container.querySelectorAll("img");

          // AboutSection's profile image should have loading attribute
          // Next.js Image component with loading="lazy" will render with loading="lazy"
          let foundLazyImage = false;
          images.forEach((img) => {
            const loading = img.getAttribute("loading");
            if (loading === "lazy") {
              foundLazyImage = true;
            }
          });

          // Verify that at least one image has lazy loading
          // (AboutSection profile image is below-the-fold)
          expect(foundLazyImage).toBe(true);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 2: PortfolioCarousel images (below-the-fold) use lazy loading", { timeout: 30000 }, () => {
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

          // Find all Next.js Image components rendered as img tags
          const images = container.querySelectorAll("img");

          // All portfolio images should have lazy loading
          // since they are below-the-fold
          let allImagesHaveLazyLoading = true;
          images.forEach((img) => {
            const loading = img.getAttribute("loading");
            if (loading !== "lazy") {
              allImagesHaveLazyLoading = false;
            }
          });

          // Verify that all images have lazy loading
          expect(allImagesHaveLazyLoading).toBe(true);
          expect(images.length).toBeGreaterThan(0);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
