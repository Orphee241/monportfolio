/**
 * Feature: portfolio-modernization, Property 19: Viewport resize maintains state
 * Validates: Requirements 10.5
 *
 * For any component state before viewport resize, after resizing the viewport,
 * the component should maintain its state without remounting
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import * as fc from "fast-check";
import Header from "../Header";
import MobileMenu from "@/components/ui/MobileMenu";

describe("Viewport Resize Property Tests", () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Store original viewport dimensions
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;

    // Mock window.scrollTo and history.pushState
    window.scrollTo = vi.fn();
    window.history.pushState = vi.fn();
  });

  afterEach(() => {
    // Restore original viewport dimensions
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });

    cleanup();
    vi.clearAllMocks();
  });

  it("Property 19: Header component maintains scroll state after viewport resize", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }), // Initial width
        fc.integer({ min: 568, max: 1080 }), // Initial height
        fc.integer({ min: 320, max: 1920 }), // New width
        fc.integer({ min: 568, max: 1080 }), // New height
        fc.integer({ min: 0, max: 100 }), // Scroll position
        (initialWidth, initialHeight, newWidth, newHeight, scrollY) => {
          // Set initial viewport dimensions
          Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: initialWidth,
          });
          Object.defineProperty(window, "innerHeight", {
            writable: true,
            configurable: true,
            value: initialHeight,
          });

          // Set scroll position
          Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: scrollY,
          });

          // Render Header
          const { container, rerender } = render(<Header />);

          // Get initial state (check if header has scrolled class)
          const header = container.querySelector("header");
          const initialHeaderClass = header?.className || "";

          // Resize viewport
          Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: newWidth,
          });
          Object.defineProperty(window, "innerHeight", {
            writable: true,
            configurable: true,
            value: newHeight,
          });

          // Trigger resize event
          window.dispatchEvent(new Event("resize"));

          // Rerender to simulate React's response to resize
          rerender(<Header />);

          // Get state after resize
          const headerAfterResize = container.querySelector("header");
          const afterResizeHeaderClass = headerAfterResize?.className || "";

          // Verify header still exists (component didn't unmount)
          expect(headerAfterResize).toBeInTheDocument();

          // Verify scroll-related state is maintained
          // If scrollY > 50, header should have scrolled styles
          if (scrollY > 50) {
            expect(afterResizeHeaderClass).toContain("bg-white");
            expect(afterResizeHeaderClass).toContain("shadow-md");
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 19: MobileMenu maintains open/closed state after viewport resize", () => {
    fc.assert(
      fc.property(
        fc.boolean(), // Initial menu state
        fc.integer({ min: 320, max: 1920 }), // Initial width
        fc.integer({ min: 320, max: 1920 }), // New width
        fc.array(
          fc.record({
            label: fc
              .string({ minLength: 1, maxLength: 50 })
              .filter((s) => s.trim().length > 0),
            href: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (isOpen, initialWidth, newWidth, menuItems) => {
          // Set initial viewport width
          Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: initialWidth,
          });

          const onClose = vi.fn();
          const onItemClick = vi.fn();

          // Render MobileMenu
          const { container, rerender } = render(
            <MobileMenu
              isOpen={isOpen}
              onClose={onClose}
              menuItems={menuItems}
              onItemClick={onItemClick}
            />
          );

          // Check initial state
          const initialBackdrop = container.querySelector(
            ".fixed.inset-0.bg-black\\/50"
          );
          if (isOpen) {
            expect(initialBackdrop).toBeInTheDocument();
          } else {
            expect(initialBackdrop).not.toBeInTheDocument();
          }

          // Resize viewport
          Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: newWidth,
          });

          // Trigger resize event
          window.dispatchEvent(new Event("resize"));

          // Rerender with same props
          rerender(
            <MobileMenu
              isOpen={isOpen}
              onClose={onClose}
              menuItems={menuItems}
              onItemClick={onItemClick}
            />
          );

          // Check state after resize - should be the same
          const afterResizeBackdrop = container.querySelector(
            ".fixed.inset-0.bg-black\\/50"
          );
          if (isOpen) {
            expect(afterResizeBackdrop).toBeInTheDocument();
          } else {
            expect(afterResizeBackdrop).not.toBeInTheDocument();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 19: Component state persists across multiple viewport changes", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 320, max: 1920 }), {
          minLength: 2,
          maxLength: 5,
        }), // Multiple viewport widths
        fc.boolean(), // Initial menu state
        (viewportWidths, initialMenuState) => {
          const menuItems = [
            { label: "Home", href: "home" },
            { label: "About", href: "about" },
          ];
          const onClose = vi.fn();
          const onItemClick = vi.fn();

          // Set initial viewport
          Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: viewportWidths[0],
          });

          const { container, rerender } = render(
            <MobileMenu
              isOpen={initialMenuState}
              onClose={onClose}
              menuItems={menuItems}
              onItemClick={onItemClick}
            />
          );

          // Apply multiple viewport changes
          for (let i = 1; i < viewportWidths.length; i++) {
            Object.defineProperty(window, "innerWidth", {
              writable: true,
              configurable: true,
              value: viewportWidths[i],
            });

            window.dispatchEvent(new Event("resize"));

            rerender(
              <MobileMenu
                isOpen={initialMenuState}
                onClose={onClose}
                menuItems={menuItems}
                onItemClick={onItemClick}
              />
            );
          }

          // Verify final state matches initial state
          const finalBackdrop = container.querySelector(
            ".fixed.inset-0.bg-black\\/50"
          );
          if (initialMenuState) {
            expect(finalBackdrop).toBeInTheDocument();
          } else {
            expect(finalBackdrop).not.toBeInTheDocument();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
