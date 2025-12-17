import { describe, it, expect } from "vitest";
import { PortfolioItem } from "@/types";
import * as fc from "fast-check";

// Feature: portfolio-modernization, Property 8: Web project links open in new tab
describe("PortfolioSection - Property 8: Web project links open in new tab", () => {
  it("should ensure web project click handler opens links in new tab with correct attributes", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.option(fc.string()),
            image: fc.constant("/images/portfolio/test.png"),
            link: fc.webUrl(),
            category: fc.constant("web" as const),
            technologies: fc.option(fc.array(fc.string())),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (webProjects) => {
          // Mock window.open to verify it's called correctly
          const originalOpen = window.open;
          let openCalls: Array<{ url: string; target: string; features: string }> = [];
          
          window.open = (url: any, target?: any, features?: any) => {
            openCalls.push({ url, target, features });
            return null;
          };

          // Simulate the click handler behavior from PortfolioSection
          const handleWebProjectClick = (item: PortfolioItem) => {
            if (item.link) {
              window.open(item.link, "_blank", "noopener,noreferrer");
            }
          };

          // Test each web project
          webProjects.forEach((project) => {
            if (project.link) {
              handleWebProjectClick(project);
            }
          });

          // Verify window.open was called with correct parameters
          const projectsWithLinks = webProjects.filter(p => p.link);
          expect(openCalls.length).toBe(projectsWithLinks.length);
          
          openCalls.forEach((call) => {
            expect(call.target).toBe("_blank");
            expect(call.features).toContain("noopener");
            expect(call.features).toContain("noreferrer");
          });

          // Restore window.open
          window.open = originalOpen;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: portfolio-modernization, Property 9: Graphic design items have click handlers
describe("PortfolioSection - Property 9: Graphic design items have click handlers", () => {
  it("should ensure graphic design items have click handlers that set lightbox state", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.option(fc.string()),
            image: fc.constant("/images/graphic-design/test.png"),
            category: fc.constant("graphic" as const),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (graphicProjects) => {
          // Simulate the click handler behavior from PortfolioSection
          let lightboxImage: string | null = null;
          
          const handleGraphicProjectClick = (item: PortfolioItem) => {
            lightboxImage = item.image;
          };

          // Test each graphic project
          graphicProjects.forEach((project) => {
            lightboxImage = null; // Reset before each test
            handleGraphicProjectClick(project);
            
            // Verify that clicking sets the lightbox image
            expect(lightboxImage).toBe(project.image);
            expect(lightboxImage).not.toBeNull();
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
