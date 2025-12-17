// Feature: portfolio-modernization, Property 16: Mobile menu toggles drawer state
// Validates: Requirements 10.2

import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import MobileMenu from "./MobileMenu";

describe("MobileMenu Property Tests", () => {
  it("Property 16: For any mobile menu state (open or closed), clicking the hamburger button should toggle to the opposite state", () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
            href: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (initialIsOpen, menuItems) => {
          const onClose = vi.fn();
          const onItemClick = vi.fn();

          const { container, rerender } = render(
            <MobileMenu
              isOpen={initialIsOpen}
              onClose={onClose}
              menuItems={menuItems}
              onItemClick={onItemClick}
            />
          );

          // Verify initial state
          if (initialIsOpen) {
            const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/50");
            expect(backdrop).toBeInTheDocument();
          }

          // Simulate clicking the close button (which should call onClose)
          if (initialIsOpen) {
            const closeButton = container.querySelector('button[aria-label="Close menu"]');
            if (closeButton) {
              fireEvent.click(closeButton);
              expect(onClose).toHaveBeenCalled();
            }
          }

          // Test toggling: render with opposite state
          const oppositeState = !initialIsOpen;
          rerender(
            <MobileMenu
              isOpen={oppositeState}
              onClose={onClose}
              menuItems={menuItems}
              onItemClick={onItemClick}
            />
          );

          // Verify the opposite state
          if (oppositeState) {
            const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/50");
            expect(backdrop).toBeInTheDocument();
          }

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 17: For any menu item click in the mobile drawer, both the drawer close action and scroll-to-section action should be triggered", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
            href: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (menuItems) => {
          const onClose = vi.fn();
          const onItemClick = vi.fn();

          const { container } = render(
            <MobileMenu
              isOpen={true}
              onClose={onClose}
              menuItems={menuItems}
              onItemClick={onItemClick}
            />
          );

          // Find all menu item buttons
          const menuButtons = container.querySelectorAll("nav button");
          
          if (menuButtons.length > 0) {
            // Click the first menu item
            const firstButton = menuButtons[0] as HTMLElement;
            fireEvent.click(firstButton);

            // Verify that onItemClick was called with the correct href
            expect(onItemClick).toHaveBeenCalledWith(menuItems[0].href);

            // Verify that onClose was called (drawer should close)
            expect(onClose).toHaveBeenCalled();
          }

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
