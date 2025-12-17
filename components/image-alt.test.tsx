import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as fc from "fast-check";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import PortfolioCarousel from "@/components/ui/PortfolioCarousel";
import { PortfolioItem, PersonalInfo, Education, Experience } from "@/types";

// Feature: portfolio-modernization, Property 14: Images include alt attributes
// Validates: Requirements 6.3, 7.3

describe("Property 14: Images include alt attributes", () => {
  it("should have descriptive alt text on hero profile image", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 50 }),
        fc.string({ minLength: 5, maxLength: 100 }),
        fc.string({ minLength: 10, maxLength: 200 }),
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
          const images = container.querySelectorAll("img");
          expect(images.length).toBeGreaterThan(0);
          images.forEach((img) => {
            expect(img).toHaveAttribute("alt");
            const altText = img.getAttribute("alt");
            expect(altText).toBeTruthy();
            expect(altText?.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have descriptive alt text on about section profile image", () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 3, maxLength: 50 }),
          fullName: fc.string({ minLength: 5, maxLength: 100 }),
          title: fc.string({ minLength: 5, maxLength: 100 }),
          description: fc.string({ minLength: 10, maxLength: 200 }),
          email: fc.emailAddress(),
          phone: fc.array(fc.string({ minLength: 10, maxLength: 15 }), {
            minLength: 1,
            maxLength: 3,
          }),
          location: fc.string({ minLength: 5, maxLength: 50 }),
          birthDate: fc.string({ minLength: 8, maxLength: 20 }),
          nationality: fc.string({ minLength: 3, maxLength: 30 }),
          profileImage: fc.constant("/images/profile.jpg"),
        }),
        fc.array(
          fc.record({
            title: fc.string({ minLength: 5, maxLength: 100 }),
            institution: fc.string({ minLength: 5, maxLength: 100 }),
            period: fc.string({ minLength: 5, maxLength: 50 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.array(
          fc.record({
            role: fc.string({ minLength: 5, maxLength: 100 }),
            company: fc.string({ minLength: 5, maxLength: 100 }),
            period: fc.option(fc.string({ minLength: 5, maxLength: 50 })),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.constant("/images/profile.jpg"),
        (
          personalInfo: PersonalInfo,
          education: Education[],
          experiences: Experience[],
          profileImage
        ) => {
          const { container } = render(
            <AboutSection
              personalInfo={personalInfo}
              education={education}
              experiences={experiences}
              profileImage={profileImage}
            />
          );
          const images = container.querySelectorAll("img");
          expect(images.length).toBeGreaterThan(0);
          images.forEach((img) => {
            expect(img).toHaveAttribute("alt");
            const altText = img.getAttribute("alt");
            expect(altText).toBeTruthy();
            expect(altText?.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have descriptive alt text on portfolio images", { timeout: 15000 }, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 3, maxLength: 20 }),
            title: fc.string({ minLength: 3, maxLength: 50 }),
            description: fc.option(
              fc.string({ minLength: 10, maxLength: 200 })
            ),
            image: fc.constant("/images/portfolio/project.jpg"),
            category: fc.constantFrom("web" as const, "graphic" as const),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items: PortfolioItem[]) => {
          const { container } = render(
            <PortfolioCarousel items={items} onItemClick={() => {}} />
          );
          const images = container.querySelectorAll("img");
          expect(images.length).toBeGreaterThan(0);
          images.forEach((img) => {
            expect(img).toHaveAttribute("alt");
            const altText = img.getAttribute("alt");
            expect(altText).toBeTruthy();
            expect(altText?.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have non-empty alt text for all images", { timeout: 15000 }, () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 3, maxLength: 20 }),
            title: fc.string({ minLength: 3, maxLength: 50 }),
            description: fc.option(
              fc.string({ minLength: 10, maxLength: 200 })
            ),
            image: fc.constant("/images/test.jpg"),
            category: fc.constantFrom("web" as const, "graphic" as const),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (items: PortfolioItem[]) => {
          const { container } = render(
            <PortfolioCarousel items={items} onItemClick={() => {}} />
          );
          const images = container.querySelectorAll("img");
          images.forEach((img) => {
            const altText = img.getAttribute("alt");
            // Alt text should exist and not be empty
            expect(altText).not.toBe("");
            expect(altText).not.toBe(null);
            // Alt text should have meaningful content (more than just whitespace)
            expect(altText?.trim().length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should use description as alt text when available for portfolio items", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 3, maxLength: 20 }),
            title: fc.string({ minLength: 3, maxLength: 50 }),
            description: fc.string({ minLength: 10, maxLength: 200 }),
            image: fc.constant("/images/test.jpg"),
            category: fc.constantFrom("web" as const, "graphic" as const),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (items: PortfolioItem[]) => {
          const { container } = render(
            <PortfolioCarousel items={items} onItemClick={() => {}} />
          );
          const images = container.querySelectorAll("img");
          // Each image should have alt text that matches either description or title
          images.forEach((img, index) => {
            const altText = img.getAttribute("alt");
            const item = items[index];
            if (item) {
              // Alt should be description if available, otherwise title
              const expectedAlt = item.description || item.title;
              expect(altText).toBe(expectedAlt);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
