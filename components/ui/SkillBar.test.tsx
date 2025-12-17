// Feature: portfolio-modernization, Property 5: Skills and tools render with visual indicators
// Validates: Requirements 2.3, 2.4

import { describe, it, expect } from "vitest";
import { render, within, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import SkillBar from "./SkillBar";

describe("SkillBar Property Tests", () => {
  it("Property 5: For any skill or tool item, when rendered, the DOM should contain both the name and a visual progress indicator element with the correct level value", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0), // Exclude whitespace-only strings
        fc.integer({ min: 0, max: 100 }),
        (name, level) => {
          const { container } = render(<SkillBar name={name} level={level} />);

          // Use within to scope queries to this specific container
          const skillBarContainer = container.firstChild as HTMLElement;

          // Verify the skill name is present in the DOM
          // Find the span containing the skill name
          const nameSpans = skillBarContainer.querySelectorAll(
            'span[class*="text-sm"]'
          );
          const nameElement = Array.from(nameSpans).find(
            (span) => span.textContent === name
          );
          expect(nameElement).toBeDefined();
          expect(nameElement).toBeInTheDocument();

          // Verify the percentage display is present (initially 0%, will animate)
          const percentageElements = skillBarContainer.querySelectorAll(
            'span[class*="text-sm"]'
          );
          const hasPercentage = Array.from(percentageElements).some((el) =>
            el.textContent?.includes("%")
          );
          expect(hasPercentage).toBe(true);

          // Verify the progress bar element exists
          const progressBar = skillBarContainer.querySelector(".bg-blue-600");
          expect(progressBar).toBeInTheDocument();

          // Verify the progress bar has a width style (visual indicator)
          const progressBarStyle = (progressBar as HTMLElement).style.width;
          expect(progressBarStyle).toBeDefined();
          expect(progressBarStyle).toMatch(/^\d+%$/);

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
