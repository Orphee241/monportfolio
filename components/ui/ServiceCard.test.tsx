// Feature: portfolio-modernization, Property 6: Services display required content
// Validates: Requirements 3.2

import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import ServiceCard from "./ServiceCard";
import { Service } from "@/types";

describe("ServiceCard Property Tests", () => {
  it("Property 6: For any service object, when rendered, the service card should display both a title and description in the DOM", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
        (title, description, technologies) => {
          const service: Service = {
            id: "test-service",
            title,
            description,
            icon: "bi-laptop",
            technologies,
          };

          const { container } = render(<ServiceCard service={service} />);

          // Verify the service title is present in the DOM
          const titleElements = container.querySelectorAll("h3");
          const titleElement = Array.from(titleElements).find(
            (el) => el.textContent === title
          );
          expect(titleElement).toBeDefined();
          expect(titleElement).toBeInTheDocument();

          // Verify the service description is present in the DOM
          const descriptionElements = container.querySelectorAll("p");
          const descriptionElement = Array.from(descriptionElements).find(
            (el) => el.textContent === description
          );
          expect(descriptionElement).toBeDefined();
          expect(descriptionElement).toBeInTheDocument();

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
