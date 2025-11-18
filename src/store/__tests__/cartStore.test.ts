import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../cartStore";
import type { Product } from "@/types/product";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("Cart Store", () => {
  const mockProduct: Product = {
    id: 1,
    title: "Test Product",
    price: 100,
    thumbnail: "https://example.com/image.jpg",
    stock: 10,
    discountPercentage: 0,
    category: "electronics",
    description: "A test product",
    rating: 4.5,
    tags: [],
    sku: "TEST123",
    weight: 1,
    dimensions: { width: 10, height: 10, depth: 10 },
    warrantyInformation: "1 year",
    shippingInformation: "Ships in 1-2 days",
    availabilityStatus: "In Stock",
    returnPolicy: "30 days",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      barcode: "123",
      qrCode: "qr123",
    },
    images: ["https://example.com/image.jpg"],
  };

  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      hydrated: false,
    });
    localStorageMock.clear();
  });

  describe("addItem", () => {
    it("should add a new item to the cart", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(1);
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[0].title).toBe("Test Product");
    });

    it("should update quantity when adding existing item", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct, 3);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it("should enforce stock constraints when adding new item", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 15); // Try to add more than stock (10)

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(10); // Capped at stock
    });

    it("should enforce stock constraints when updating existing item", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 7);
      addItem(mockProduct, 5); // Would be 12, but stock is 10

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(10); // Capped at stock
    });

    it("should calculate totalItems correctly", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 3);
      addItem({ ...mockProduct, id: 2 }, 2);

      const state = useCartStore.getState();
      expect(state.totalItems).toBe(5);
    });

    it("should calculate totalPrice without discount", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2); // 2 * $100 = $200

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(200);
    });

    it("should calculate totalPrice with discount", () => {
      const { addItem } = useCartStore.getState();
      const discountedProduct = { ...mockProduct, discountPercentage: 20 };
      addItem(discountedProduct, 2); // 2 * $100 * 0.8 = $160

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(160);
    });

    it("should handle 0% discount (same as no discount)", () => {
      const { addItem } = useCartStore.getState();
      addItem({ ...mockProduct, discountPercentage: 0 }, 1);

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(100);
    });

    it("should handle 100% discount", () => {
      const { addItem } = useCartStore.getState();
      addItem({ ...mockProduct, discountPercentage: 100 }, 1);

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(0);
    });

    it("should preserve all product fields in cart item", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1);

      const state = useCartStore.getState();
      const cartItem = state.items[0];
      expect(cartItem.id).toBe(mockProduct.id);
      expect(cartItem.title).toBe(mockProduct.title);
      expect(cartItem.price).toBe(mockProduct.price);
      expect(cartItem.thumbnail).toBe(mockProduct.thumbnail);
      expect(cartItem.stock).toBe(mockProduct.stock);
      expect(cartItem.category).toBe(mockProduct.category);
    });
  });

  describe("removeItem", () => {
    it("should remove item from cart", () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      removeItem(1);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should recalculate totalItems after removal", () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 3);
      addItem({ ...mockProduct, id: 2 }, 2);
      removeItem(1);

      const state = useCartStore.getState();
      expect(state.totalItems).toBe(2);
    });

    it("should recalculate totalPrice after removal", () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 2); // $200
      addItem({ ...mockProduct, id: 2, price: 50 }, 2); // $100
      removeItem(1);

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(100);
    });

    it("should handle removing non-existent item gracefully", () => {
      const { removeItem } = useCartStore.getState();
      removeItem(999);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it("should not affect other items when removing one", () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem({ ...mockProduct, id: 2 }, 3);
      removeItem(1);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(2);
      expect(state.items[0].quantity).toBe(3);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity(1, 5);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it("should enforce stock constraints", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity(1, 15); // More than stock (10)

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(10);
    });

    it("should remove item when quantity is 0", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity(1, 0);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should remove item when quantity is negative", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      updateQuantity(1, -1);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should recalculate totalItems", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem({ ...mockProduct, id: 2 }, 3);
      updateQuantity(1, 7);

      const state = useCartStore.getState();
      expect(state.totalItems).toBe(10);
    });

    it("should recalculate totalPrice", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 2); // $200
      updateQuantity(1, 5); // $500

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(500);
    });

    it("should handle updating non-existent item gracefully", () => {
      const { updateQuantity } = useCartStore.getState();
      updateQuantity(999, 5);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should allow quantity update to 1", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 5);
      updateQuantity(1, 1);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
      expect(state.items).toHaveLength(1);
    });
  });

  describe("clearCart", () => {
    it("should clear all items from cart", () => {
      const { addItem, clearCart } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem({ ...mockProduct, id: 2 }, 3);
      clearCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it("should handle clearing empty cart", () => {
      const { clearCart } = useCartStore.getState();
      clearCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe("Price calculations with multiple items", () => {
    it("should calculate total with mixed discounts", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1); // $100 no discount
      addItem({ ...mockProduct, id: 2, price: 50, discountPercentage: 20 }, 2); // $80

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(180);
    });

    it("should handle decimal prices correctly", () => {
      const { addItem } = useCartStore.getState();
      addItem({ ...mockProduct, price: 9.99 }, 3);

      const state = useCartStore.getState();
      expect(state.totalPrice).toBeCloseTo(29.97, 2);
    });

    it("should handle discount calculation precision", () => {
      const { addItem } = useCartStore.getState();
      // $99.99 with 15% discount = $84.9915 per item
      addItem({ ...mockProduct, price: 99.99, discountPercentage: 15 }, 1);

      const state = useCartStore.getState();
      expect(state.totalPrice).toBeCloseTo(84.99, 2);
    });
  });

  describe("Edge cases", () => {
    it("should handle item with 0 stock", () => {
      const { addItem } = useCartStore.getState();
      const zeroStockProduct = { ...mockProduct, stock: 0 };
      addItem(zeroStockProduct, 5);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(0);
    });

    it("should handle large quantities", () => {
      const { addItem } = useCartStore.getState();
      const largeStockProduct = { ...mockProduct, stock: 1000 };
      addItem(largeStockProduct, 999);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(999);
      expect(state.totalItems).toBe(999);
    });

    it("should handle very small prices", () => {
      const { addItem } = useCartStore.getState();
      const smallPriceProduct = { ...mockProduct, price: 0.01, stock: 100 };
      addItem(smallPriceProduct, 100);

      const state = useCartStore.getState();
      expect(state.totalPrice).toBeCloseTo(1.0, 2);
    });

    it("should handle 50% discount correctly", () => {
      const { addItem } = useCartStore.getState();
      addItem({ ...mockProduct, price: 100, discountPercentage: 50 }, 2);

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(100);
    });
  });
});
