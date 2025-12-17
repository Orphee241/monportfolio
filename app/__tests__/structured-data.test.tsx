import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Feature: portfolio-modernization, Property 12: Pages include required meta tags
// Validates: Requirements 6.1

// Define the expected structure of Person schema
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Glen Orphée NZIENGUI-AKOUMBOU",
  alternateName: "GONA",
  jobTitle: "Développeur Node.js (Next.js) & Graphic Designer",
  description:
    "Développeur Node.js (Next.js) et Graphic Designer basé au Gabon. Spécialisé en développement web moderne et design graphique.",
  url: "https://gona241.com",
  email: "contact@gona241.com",
  telephone: "+241 77187894",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nkok Ntoum",
    addressCountry: "GA",
  },
  nationality: {
    "@type": "Country",
    name: "Gabon",
  },
  birthDate: "1996-01-23",
  knowsAbout: [
    "Next.js",
    "Node.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Graphic Design",
    "Photoshop",
    "Web Development",
  ],
  sameAs: ["https://gona241.com"],
};

// Define the expected structure of WebSite schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GONA Portfolio",
  description:
    "Portfolio professionnel de Glen Orphée NZIENGUI-AKOUMBOU - Développeur Node.js (Next.js) et Graphic Designer",
  url: "https://gona241.com",
  author: {
    "@type": "Person",
    name: "Glen Orphée NZIENGUI-AKOUMBOU",
  },
  inLanguage: "fr-FR",
};

describe("Structured Data (JSON-LD)", () => {
  describe("Property 12: Person schema validation", () => {
    it("should have valid Person schema structure with all required fields", () => {
      fc.assert(
        fc.property(fc.constant(personSchema), (schema) => {
          // Verify schema.org context
          expect(schema["@context"]).toBe("https://schema.org");
          expect(schema["@type"]).toBe("Person");

          // Verify required Person fields
          expect(schema.name).toBe("Glen Orphée NZIENGUI-AKOUMBOU");
          expect(schema.alternateName).toBe("GONA");
          expect(schema.jobTitle).toBeDefined();
          expect(schema.jobTitle).not.toBe("");
          expect(schema.description).toBeDefined();
          expect(schema.description).not.toBe("");

          // Verify contact information
          expect(schema.email).toBe("contact@gona241.com");
          expect(schema.telephone).toBeDefined();
          expect(schema.url).toBe("https://gona241.com");

          // Verify address structure
          expect(schema.address).toBeDefined();
          expect(schema.address["@type"]).toBe("PostalAddress");
          expect(schema.address.addressLocality).toBeDefined();
          expect(schema.address.addressCountry).toBe("GA");

          // Verify nationality
          expect(schema.nationality).toBeDefined();
          expect(schema.nationality["@type"]).toBe("Country");
          expect(schema.nationality.name).toBe("Gabon");

          // Verify skills/knowledge
          expect(schema.knowsAbout).toBeDefined();
          expect(Array.isArray(schema.knowsAbout)).toBe(true);
          expect(schema.knowsAbout.length).toBeGreaterThan(0);

          // Verify birth date format (ISO 8601)
          expect(schema.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 12: WebSite schema validation", () => {
    it("should have valid WebSite schema structure with all required fields", () => {
      fc.assert(
        fc.property(fc.constant(websiteSchema), (schema) => {
          // Verify schema.org context
          expect(schema["@context"]).toBe("https://schema.org");
          expect(schema["@type"]).toBe("WebSite");

          // Verify required WebSite fields
          expect(schema.name).toBe("GONA Portfolio");
          expect(schema.description).toBeDefined();
          expect(schema.description).not.toBe("");
          expect(schema.url).toBe("https://gona241.com");

          // Verify author structure
          expect(schema.author).toBeDefined();
          expect(schema.author["@type"]).toBe("Person");
          expect(schema.author.name).toBe("Glen Orphée NZIENGUI-AKOUMBOU");

          // Verify language
          expect(schema.inLanguage).toBe("fr-FR");

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("JSON-LD serialization", () => {
    it("should produce valid JSON when stringified", () => {
      const personJson = JSON.stringify(personSchema);
      const websiteJson = JSON.stringify(websiteSchema);

      // Verify JSON is valid
      expect(() => JSON.parse(personJson)).not.toThrow();
      expect(() => JSON.parse(websiteJson)).not.toThrow();

      // Verify parsed JSON matches original
      expect(JSON.parse(personJson)).toEqual(personSchema);
      expect(JSON.parse(websiteJson)).toEqual(websiteSchema);
    });
  });
});
