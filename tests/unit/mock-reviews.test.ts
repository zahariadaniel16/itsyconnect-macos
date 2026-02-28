import { describe, it, expect } from "vitest";
import { MOCK_REVIEWS, getMockCustomerReviews } from "@/lib/mock-reviews";

describe("mock-reviews", () => {
  describe("data shapes", () => {
    it("has entries with required fields", () => {
      expect(MOCK_REVIEWS.length).toBeGreaterThan(0);
      for (const r of MOCK_REVIEWS) {
        expect(r).toHaveProperty("id");
        expect(r).toHaveProperty("appId");
        expect(r).toHaveProperty("rating");
        expect(r).toHaveProperty("title");
        expect(r).toHaveProperty("body");
        expect(r).toHaveProperty("reviewerNickname");
        expect(r).toHaveProperty("territory");
        expect(r).toHaveProperty("createdDate");
      }
    });

    it("has unique IDs", () => {
      const ids = MOCK_REVIEWS.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("has ratings between 1 and 5", () => {
      for (const r of MOCK_REVIEWS) {
        expect(r.rating).toBeGreaterThanOrEqual(1);
        expect(r.rating).toBeLessThanOrEqual(5);
      }
    });

    it("has valid ISO 3166-1 alpha-3 territory codes (3 uppercase letters)", () => {
      for (const r of MOCK_REVIEWS) {
        expect(r.territory).toMatch(/^[A-Z]{3}$/);
      }
    });

    it("has valid ISO 8601 dates", () => {
      for (const r of MOCK_REVIEWS) {
        const d = new Date(r.createdDate);
        expect(d.getTime()).not.toBeNaN();
      }
    });

    it("responses have valid state values", () => {
      const withResponse = MOCK_REVIEWS.filter((r) => r.response);
      expect(withResponse.length).toBeGreaterThan(0);
      for (const r of withResponse) {
        expect(["PENDING_PUBLISH", "PUBLISHED"]).toContain(r.response!.state);
        expect(r.response!.responseBody.length).toBeGreaterThan(0);
        expect(r.response!.id.length).toBeGreaterThan(0);
      }
    });

    it("uses consistent app IDs from mock-data", () => {
      const validAppIds = new Set(["app-001", "app-002", "app-003"]);
      for (const r of MOCK_REVIEWS) {
        expect(validAppIds).toContain(r.appId);
      }
    });
  });

  describe("getMockCustomerReviews", () => {
    it("returns reviews for app-001", () => {
      const reviews = getMockCustomerReviews("app-001");
      expect(reviews.length).toBeGreaterThan(0);
      for (const r of reviews) {
        expect(r.appId).toBe("app-001");
      }
    });

    it("returns reviews for app-002", () => {
      const reviews = getMockCustomerReviews("app-002");
      expect(reviews.length).toBeGreaterThan(0);
      for (const r of reviews) {
        expect(r.appId).toBe("app-002");
      }
    });

    it("returns empty array for unknown app", () => {
      expect(getMockCustomerReviews("nonexistent")).toEqual([]);
    });
  });
});
