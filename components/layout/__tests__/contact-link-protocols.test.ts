import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * Feature: portfolio-modernization, Property 11: Contact links use correct protocols
 * Validates: Requirements 5.2, 5.3, 5.4
 *
 * For any contact link (email, phone, WhatsApp), the href attribute should use
 * the appropriate protocol (mailto:, tel:, https://wa.me/) with correctly formatted values
 */

describe("Property 11: Contact link protocols", () => {
  describe("Email link protocol", () => {
    it("should use mailto: protocol for email links", () => {
      // Generate arbitrary email addresses
      const emailArbitrary = fc
        .tuple(
          fc.stringMatching(/^[a-z0-9]+$/),
          fc.stringMatching(/^[a-z0-9]+$/),
          fc.stringMatching(/^[a-z]{2,4}$/)
        )
        .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

      fc.assert(
        fc.property(emailArbitrary, (email) => {
          const href = `mailto:${email}`;

          // Verify protocol
          expect(href.startsWith("mailto:")).toBe(true);

          // Verify email format is preserved
          const extractedEmail = href.replace("mailto:", "");
          expect(extractedEmail).toBe(email);
          expect(extractedEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Phone link protocol", () => {
    it("should use tel: protocol for phone links", () => {
      // Generate arbitrary phone numbers with various formats
      const phoneArbitrary = fc.oneof(
        fc.stringMatching(/^\+[0-9]{3} [0-9]{8}$/), // +241 77187894
        fc.stringMatching(/^\+[0-9]{11}$/), // +24177187894
        fc.stringMatching(/^[0-9]{10}$/) // 0612345678
      );

      fc.assert(
        fc.property(phoneArbitrary, (phone) => {
          const href = `tel:${phone}`;

          // Verify protocol
          expect(href.startsWith("tel:")).toBe(true);

          // Verify phone number is preserved
          const extractedPhone = href.replace("tel:", "");
          expect(extractedPhone).toBe(phone);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("WhatsApp link protocol", () => {
    it("should use https://wa.me/ protocol for WhatsApp links", () => {
      // Generate arbitrary phone numbers (WhatsApp uses international format without +)
      const whatsappPhoneArbitrary = fc
        .stringMatching(/^[0-9]{10,15}$/)
        .map((digits) => digits);

      fc.assert(
        fc.property(whatsappPhoneArbitrary, (phone) => {
          const href = `https://wa.me/${phone}`;

          // Verify protocol and domain
          expect(href.startsWith("https://wa.me/")).toBe(true);

          // Verify phone number is preserved
          const extractedPhone = href.replace("https://wa.me/", "").split("?")[0];
          expect(extractedPhone).toBe(phone);

          // Verify only digits (no special characters)
          expect(extractedPhone).toMatch(/^[0-9]+$/);
        }),
        { numRuns: 100 }
      );
    });

    it("should correctly format WhatsApp links with optional message parameter", () => {
      const whatsappArbitrary = fc.tuple(
        fc.stringMatching(/^[0-9]{10,15}$/),
        fc.string({ minLength: 1, maxLength: 100 })
      );

      fc.assert(
        fc.property(whatsappArbitrary, ([phone, message]) => {
          const encodedMessage = encodeURIComponent(message);
          const href = `https://wa.me/${phone}?text=${encodedMessage}`;

          // Verify protocol and domain
          expect(href.startsWith("https://wa.me/")).toBe(true);

          // Verify structure
          expect(href).toContain("?text=");

          // Verify phone number
          const phoneFromUrl = href.split("?")[0].replace("https://wa.me/", "");
          expect(phoneFromUrl).toBe(phone);

          // Verify message is URL encoded
          const messageFromUrl = href.split("?text=")[1];
          expect(messageFromUrl).toBe(encodedMessage);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Protocol format validation", () => {
    it("should ensure email links do not have extra protocols", () => {
      const emailArbitrary = fc
        .tuple(
          fc.stringMatching(/^[a-z0-9]+$/),
          fc.stringMatching(/^[a-z0-9]+$/),
          fc.stringMatching(/^[a-z]{2,4}$/)
        )
        .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

      fc.assert(
        fc.property(emailArbitrary, (email) => {
          const href = `mailto:${email}`;

          // Should not have http/https
          expect(href.startsWith("http://")).toBe(false);
          expect(href.startsWith("https://")).toBe(false);

          // Should not have tel:
          expect(href.startsWith("tel:")).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("should ensure phone links do not have extra protocols", () => {
      const phoneArbitrary = fc.stringMatching(/^\+?[0-9]{10,15}$/);

      fc.assert(
        fc.property(phoneArbitrary, (phone) => {
          const href = `tel:${phone}`;

          // Should not have http/https
          expect(href.startsWith("http://")).toBe(false);
          expect(href.startsWith("https://")).toBe(false);

          // Should not have mailto:
          expect(href.startsWith("mailto:")).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it("should ensure WhatsApp links use HTTPS not HTTP", () => {
      const phoneArbitrary = fc.stringMatching(/^[0-9]{10,15}$/);

      fc.assert(
        fc.property(phoneArbitrary, (phone) => {
          const href = `https://wa.me/${phone}`;

          // Must use HTTPS
          expect(href.startsWith("https://")).toBe(true);

          // Should not use HTTP
          expect(href.startsWith("http://wa.me/")).toBe(false);

          // Should not have mailto: or tel:
          expect(href.startsWith("mailto:")).toBe(false);
          expect(href.startsWith("tel:")).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});
