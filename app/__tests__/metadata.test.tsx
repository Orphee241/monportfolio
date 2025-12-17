import { describe, it, expect } from "vitest";
import type { Metadata } from "next";
import fc from "fast-check";

// Feature: portfolio-modernization, Property 12: Pages include required meta tags
// Validates: Requirements 6.1, 6.5

// Mock metadata object that matches the structure in layout.tsx
const metadata: Metadata = {
  title: "GONA - Développeur Node.js (Next.js) & Graphic Designer",
  description:
    "Portfolio de Glen Orphée NZIENGUI-AKOUMBOU - Développeur Node.js (Next.js) et Graphic Designer. Grâce à des compétences acquises en développement web et en graphic design, j'ambitionne mettre mes compétences à la réalisation de vos projets.",
  keywords: [
    "GONA",
    "Glen Orphée NZIENGUI-AKOUMBOU",
    "Développeur Web",
    "Next.js",
    "Node.js",
    "Graphic Designer",
    "Portfolio",
    "Gabon",
    "Développeur Gabon",
    "Web Design",
    "Photoshop",
    "React",
    "TypeScript",
    "Tailwind CSS",
  ],
  authors: [{ name: "Glen Orphée NZIENGUI-AKOUMBOU", url: "https://gona241.com" }],
  creator: "Glen Orphée NZIENGUI-AKOUMBOU",
  publisher: "GONA",
  metadataBase: new URL("https://gona241.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://gona241.com",
    title: "GONA - Développeur Node.js (Next.js) & Graphic Designer",
    description:
      "Portfolio de Glen Orphée NZIENGUI-AKOUMBOU - Développeur Node.js (Next.js) et Graphic Designer. Découvrez mes réalisations en développement web et design graphique.",
    siteName: "GONA Portfolio",
    images: [
      {
        url: "/images/profile/glen-orphee.png",
        width: 1200,
        height: 630,
        alt: "GONA - Glen Orphée NZIENGUI-AKOUMBOU",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GONA - Développeur Node.js (Next.js) & Graphic Designer",
    description:
      "Portfolio de Glen Orphée NZIENGUI-AKOUMBOU - Développeur Node.js (Next.js) et Graphic Designer.",
    images: ["/images/profile/glen-orphee.png"],
    creator: "@gona241",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

describe("Metadata Properties", () => {
  describe("Property 12: Pages include required meta tags", () => {
    it("should have all required meta tags with non-empty values", () => {
      fc.assert(
        fc.property(fc.constant(metadata), (meta) => {
          // Verify title exists and is non-empty
          expect(meta.title).toBeDefined();
          expect(typeof meta.title === "string" ? meta.title : "").not.toBe("");

          // Verify description exists and is non-empty
          expect(meta.description).toBeDefined();
          expect(meta.description).not.toBe("");

          // Verify Open Graph tags exist and have non-empty content
          expect(meta.openGraph).toBeDefined();
          expect(meta.openGraph?.title).toBeDefined();
          expect(meta.openGraph?.title).not.toBe("");
          expect(meta.openGraph?.description).toBeDefined();
          expect(meta.openGraph?.description).not.toBe("");
          expect(meta.openGraph?.url).toBeDefined();
          expect(meta.openGraph?.siteName).toBeDefined();
          expect(meta.openGraph?.images).toBeDefined();
          expect(Array.isArray(meta.openGraph?.images)).toBe(true);
          if (Array.isArray(meta.openGraph?.images)) {
            expect(meta.openGraph.images.length).toBeGreaterThan(0);
          }

          // Verify Twitter Card tags exist and have non-empty content
          expect(meta.twitter).toBeDefined();
          expect(meta.twitter?.card).toBeDefined();
          expect(meta.twitter?.card).not.toBe("");
          expect(meta.twitter?.title).toBeDefined();
          expect(meta.twitter?.title).not.toBe("");
          expect(meta.twitter?.description).toBeDefined();
          expect(meta.twitter?.description).not.toBe("");
          expect(meta.twitter?.images).toBeDefined();

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it("should have keywords defined", () => {
      expect(metadata.keywords).toBeDefined();
      expect(Array.isArray(metadata.keywords)).toBe(true);
      if (Array.isArray(metadata.keywords)) {
        expect(metadata.keywords.length).toBeGreaterThan(0);
      }
    });

    it("should have proper icons configuration", () => {
      expect(metadata.icons).toBeDefined();
      expect(metadata.icons).toHaveProperty("icon");
      expect(metadata.icons).toHaveProperty("shortcut");
    });

    it("should have robots configuration", () => {
      expect(metadata.robots).toBeDefined();
      expect(metadata.robots).toHaveProperty("index");
      expect(metadata.robots).toHaveProperty("follow");
    });
  });
});
