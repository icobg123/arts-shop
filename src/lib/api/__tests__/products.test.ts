import { describe, it, expect } from "vitest";
import { getProductUrl, getCategoryUrl } from "../products";

describe("URL Helper Functions", () => {
  describe("getProductUrl", () => {
    it("should generate correct product URL with category and ID", () => {
      expect(getProductUrl("laptops", 123)).toBe("/laptops/123");
    });

    it("should handle category with spaces", () => {
      expect(getProductUrl("mens-shirts", 456)).toBe("/mens-shirts/456");
    });

    it("should URL encode special characters in category", () => {
      expect(getProductUrl("beauty & health", 789)).toBe(
        "/beauty%20%26%20health/789",
      );
    });

    it("should handle numeric product IDs correctly", () => {
      expect(getProductUrl("smartphones", 1)).toBe("/smartphones/1");
      expect(getProductUrl("smartphones", 999999)).toBe("/smartphones/999999");
    });

    it("should handle category with hyphens", () => {
      expect(getProductUrl("home-decoration", 42)).toBe(
        "/home-decoration/42",
      );
    });
  });

  describe("getCategoryUrl", () => {
    it("should generate correct category URL", () => {
      expect(getCategoryUrl("laptops")).toBe("/laptops");
    });

    it("should handle category with hyphens", () => {
      expect(getCategoryUrl("mens-shirts")).toBe("/mens-shirts");
    });

    it("should URL encode special characters", () => {
      expect(getCategoryUrl("beauty & health")).toBe("/beauty%20%26%20health");
    });

    it("should handle empty string", () => {
      expect(getCategoryUrl("")).toBe("/");
    });

    it("should handle single character category", () => {
      expect(getCategoryUrl("a")).toBe("/a");
    });

    it("should preserve case", () => {
      expect(getCategoryUrl("MensShirts")).toBe("/MensShirts");
    });
  });
});
