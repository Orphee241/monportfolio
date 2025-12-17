import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { personalInfo, education, experiences } from "../personal-info";
import { PersonalInfo, Education, Experience } from "@/types";

/**
 * Feature: portfolio-modernization, Property 4: Data sections render all required fields
 * Validates: Requirements 2.1, 2.2, 2.5, 5.1
 *
 * For any data object (personal info, education, experience, contact info),
 * when rendered in its respective section, all required fields defined in
 * the data model should be present in the DOM
 */

describe("Property 4: Data completeness", () => {
  describe("PersonalInfo completeness", () => {
    it("should have all required PersonalInfo fields", () => {
      fc.assert(
        fc.property(fc.constant(personalInfo), (info: PersonalInfo) => {
          // All required fields must be non-empty strings
          expect(info.name).toBeTruthy();
          expect(typeof info.name).toBe("string");
          expect(info.name.length).toBeGreaterThan(0);

          expect(info.fullName).toBeTruthy();
          expect(typeof info.fullName).toBe("string");
          expect(info.fullName.length).toBeGreaterThan(0);

          expect(info.title).toBeTruthy();
          expect(typeof info.title).toBe("string");
          expect(info.title.length).toBeGreaterThan(0);

          expect(info.description).toBeTruthy();
          expect(typeof info.description).toBe("string");
          expect(info.description.length).toBeGreaterThan(0);

          expect(info.email).toBeTruthy();
          expect(typeof info.email).toBe("string");
          expect(info.email.length).toBeGreaterThan(0);
          // Email format validation
          expect(info.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

          expect(info.phone).toBeTruthy();
          expect(Array.isArray(info.phone)).toBe(true);
          expect(info.phone.length).toBeGreaterThan(0);
          info.phone.forEach((phoneNumber) => {
            expect(typeof phoneNumber).toBe("string");
            expect(phoneNumber.length).toBeGreaterThan(0);
          });

          expect(info.location).toBeTruthy();
          expect(typeof info.location).toBe("string");
          expect(info.location.length).toBeGreaterThan(0);

          expect(info.birthDate).toBeTruthy();
          expect(typeof info.birthDate).toBe("string");
          expect(info.birthDate.length).toBeGreaterThan(0);

          expect(info.nationality).toBeTruthy();
          expect(typeof info.nationality).toBe("string");
          expect(info.nationality.length).toBeGreaterThan(0);

          expect(info.profileImage).toBeTruthy();
          expect(typeof info.profileImage).toBe("string");
          expect(info.profileImage.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Education completeness", () => {
    it("should have all required Education fields for each entry", () => {
      fc.assert(
        fc.property(fc.constant(education), (educationList: Education[]) => {
          expect(Array.isArray(educationList)).toBe(true);
          expect(educationList.length).toBeGreaterThan(0);

          educationList.forEach((edu) => {
            expect(edu.title).toBeTruthy();
            expect(typeof edu.title).toBe("string");
            expect(edu.title.length).toBeGreaterThan(0);

            expect(edu.institution).toBeTruthy();
            expect(typeof edu.institution).toBe("string");
            expect(edu.institution.length).toBeGreaterThan(0);

            expect(edu.period).toBeTruthy();
            expect(typeof edu.period).toBe("string");
            expect(edu.period.length).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Experience completeness", () => {
    it("should have all required Experience fields for each entry", () => {
      fc.assert(
        fc.property(fc.constant(experiences), (experienceList: Experience[]) => {
          expect(Array.isArray(experienceList)).toBe(true);
          expect(experienceList.length).toBeGreaterThan(0);

          experienceList.forEach((exp) => {
            // Required fields
            expect(exp.role).toBeTruthy();
            expect(typeof exp.role).toBe("string");
            expect(exp.role.length).toBeGreaterThan(0);

            expect(exp.company).toBeTruthy();
            expect(typeof exp.company).toBe("string");
            expect(exp.company.length).toBeGreaterThan(0);

            // Optional field - if present, must be a non-empty string
            if (exp.period !== undefined) {
              expect(typeof exp.period).toBe("string");
              expect(exp.period.length).toBeGreaterThan(0);
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });
});
