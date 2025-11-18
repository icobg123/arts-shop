import { describe, it, expect } from "vitest";
import { ProductSchema } from "../product.schema";

describe("ProductSchema", () => {
  const validProduct = {
    id: 1,
    title: "iPhone 15",
    description: "A great smartphone",
    category: "smartphones",
    price: 999.99,
    discountPercentage: 15,
    rating: 4.5,
    stock: 50,
    tags: ["smartphone", "apple"],
    sku: "SKU123",
    weight: 0.2,
    dimensions: { width: 7, height: 15, depth: 1 },
    warrantyInformation: "1 year",
    shippingInformation: "Ships in 1-2 days",
    availabilityStatus: "In Stock",
    returnPolicy: "30 days",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      barcode: "123456789",
      qrCode: "qr123",
    },
    thumbnail: "https://example.com/thumb.jpg",
    images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  };

  describe("Basic validation", () => {
    it("should validate a correct product", () => {
      const result = ProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it("should require all mandatory fields", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { title, ...incomplete } = validProduct;
      const result = ProductSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });

    it("should allow optional brand field", () => {
      const productWithBrand = { ...validProduct, brand: "Apple" };
      const result = ProductSchema.safeParse(productWithBrand);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.brand).toBe("Apple");
      }
    });
  });

  describe("discountPercentage transform", () => {
    it("should keep percentage values as-is (0-100 range)", () => {
      const product = { ...validProduct, discountPercentage: 15 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountPercentage).toBe(15);
      }
    });

    it("should convert decimal to percentage (< 1)", () => {
      const product = { ...validProduct, discountPercentage: 0.16 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountPercentage).toBe(16);
      }
    });

    it("should handle 0% discount", () => {
      const product = { ...validProduct, discountPercentage: 0 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountPercentage).toBe(0);
      }
    });

    it("should handle 100% discount", () => {
      const product = { ...validProduct, discountPercentage: 100 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountPercentage).toBe(100);
      }
    });

    it("should handle decimal edge case (0.99)", () => {
      const product = { ...validProduct, discountPercentage: 0.99 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountPercentage).toBe(99);
      }
    });

    it("should reject negative discount", () => {
      const product = { ...validProduct, discountPercentage: -5 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it("should reject discount over 100", () => {
      const product = { ...validProduct, discountPercentage: 101 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });
  });

  describe("Price validation", () => {
    it("should accept positive prices", () => {
      const product = { ...validProduct, price: 1.99 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it("should reject zero price", () => {
      const product = { ...validProduct, price: 0 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it("should reject negative price", () => {
      const product = { ...validProduct, price: -10 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });
  });

  describe("Rating validation", () => {
    it("should accept ratings between 0 and 5", () => {
      const ratings = [0, 2.5, 5];
      ratings.forEach((rating) => {
        const product = { ...validProduct, rating };
        const result = ProductSchema.safeParse(product);
        expect(result.success).toBe(true);
      });
    });

    it("should reject ratings below 0", () => {
      const product = { ...validProduct, rating: -1 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it("should reject ratings above 5", () => {
      const product = { ...validProduct, rating: 5.1 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });
  });

  describe("Stock validation", () => {
    it("should accept non-negative integer stock", () => {
      const product = { ...validProduct, stock: 0 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it("should reject negative stock", () => {
      const product = { ...validProduct, stock: -1 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it("should reject decimal stock values", () => {
      const product = { ...validProduct, stock: 10.5 };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });
  });

  describe("URL validation", () => {
    it("should require valid thumbnail URL", () => {
      const product = { ...validProduct, thumbnail: "not-a-url" };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it("should require valid image URLs", () => {
      const product = {
        ...validProduct,
        images: ["https://valid.com/img.jpg", "not-a-url"],
      };
      const result = ProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });
  });
});
