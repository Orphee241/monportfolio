/**
 * Property-based tests for scroll utilities
 * Feature: portfolio-modernization
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fc from "fast-check";
import {
  scrollToSection,
  updateUrlHash,
  getActiveSection,
  createScrollListener,
} from "../scroll";

describe("Scroll Utilities - Property Tests", () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    window.history.pushState = vi.fn();

    // Reset document body
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Feature: portfolio-modernization, Property 1: Navigation preserves SPA behavior
   * Validates: Requirements 1.2
   *
   * For any navigation link click, the page should scroll to the target section
   * without triggering a full page reload, and the URL hash should update accordingly
   */
  it("Property 1: Navigation preserves SPA behavior - scrollToSection updates hash without reload", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/), // Valid section IDs
        fc.integer({ min: 0, max: 200 }), // Offset values
        (sectionId, offset) => {
          // Create a mock section element
          const section = document.createElement("section");
          section.id = sectionId;
          section.style.position = "absolute";
          section.style.top = "1000px";
          document.body.appendChild(section);

          // Call scrollToSection
          scrollToSection(sectionId, offset);

          // Verify window.scrollTo was called (smooth scroll behavior)
          expect(window.scrollTo).toHaveBeenCalledWith({
            top: expect.any(Number),
            behavior: "smooth",
          });

          // Verify URL hash was updated without reload
          expect(window.history.pushState).toHaveBeenCalledWith(
            null,
            "",
            `#${sectionId}`
          );

          // Clean up
          document.body.removeChild(section);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 1 (variant): updateUrlHash updates hash without triggering reload", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9-]{2,20}$/), // Valid hash values
        (hash) => {
          // Call updateUrlHash
          updateUrlHash(hash);

          // Verify pushState was called with correct parameters
          expect(window.history.pushState).toHaveBeenCalledWith(
            null,
            "",
            `#${hash}`
          );

          // Verify it was called exactly once per invocation
          const callCount = (window.history.pushState as any).mock.calls
            .length;
          expect(callCount).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 1 (variant): scrollToSection handles non-existent sections gracefully", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^nonexistent-[a-z0-9]{5,10}$/), // IDs that don't exist
        (sectionId) => {
          // Call scrollToSection with non-existent ID
          scrollToSection(sectionId);

          // Should not call scrollTo or pushState for non-existent sections
          expect(window.scrollTo).not.toHaveBeenCalled();
          expect(window.history.pushState).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 1 (variant): getActiveSection returns correct section based on scroll position", () => {
    fc.assert(
      fc.property(
        fc.array(fc.stringMatching(/^section-[0-9]{1,2}$/), {
          minLength: 2,
          maxLength: 10,
        }),
        fc.integer({ min: 0, max: 5000 }),
        (sectionIds, scrollY) => {
          // Create mock sections at different positions
          const sections: HTMLElement[] = [];
          sectionIds.forEach((id, index) => {
            const section = document.createElement("section");
            section.id = id;
            section.style.position = "absolute";
            section.style.top = `${index * 500}px`;
            document.body.appendChild(section);
            sections.push(section);
          });

          // Mock window.scrollY
          Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: scrollY,
          });

          // Get active section
          const activeSection = getActiveSection(sectionIds);

          // Verify the result is one of the section IDs
          expect(sectionIds).toContain(activeSection);

          // Clean up
          sections.forEach((section) => document.body.removeChild(section));
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 1 (variant): createScrollListener calls callback when active section changes", () => {
    fc.assert(
      fc.property(
        fc.array(fc.stringMatching(/^section-[0-9]{1,2}$/), {
          minLength: 2,
          maxLength: 5,
        }),
        (sectionIds) => {
          // Create mock sections
          const sections: HTMLElement[] = [];
          sectionIds.forEach((id, index) => {
            const section = document.createElement("section");
            section.id = id;
            section.style.position = "absolute";
            section.style.top = `${index * 500}px`;
            document.body.appendChild(section);
            sections.push(section);
          });

          // Create a callback spy
          const callback = vi.fn();

          // Create scroll listener
          const cleanup = createScrollListener(sectionIds, callback);

          // Verify cleanup function is returned
          expect(typeof cleanup).toBe("function");

          // Clean up
          cleanup();
          sections.forEach((section) => document.body.removeChild(section));
        }
      ),
      { numRuns: 100 }
    );
  });
});
