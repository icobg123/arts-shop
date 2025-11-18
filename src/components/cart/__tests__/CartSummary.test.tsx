import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CartSummary from "../CartSummary";

// Create mock state that can be updated per test
let mockCartState: {
  items: { id: number; title: string; price: number; quantity: number; discountPercentage: number }[];
  totalItems: number;
  totalPrice: number;
} = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

vi.mock("@/store/cartStore", () => ({
  useCartStore: (selector: (state: typeof mockCartState) => unknown) => {
    return selector(mockCartState);
  },
}));

describe("CartSummary Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCartState = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  });

  describe("Rendering", () => {
    it("should render order summary title", () => {
      render(<CartSummary />);
      expect(screen.getByText("Order Summary")).toBeInTheDocument();
    });

    it("should render checkout button", () => {
      render(<CartSummary />);
      expect(
        screen.getByRole("button", { name: /Proceed to Checkout/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Items count", () => {
    it("should display 0 items when cart is empty", () => {
      render(<CartSummary />);
      expect(screen.getByText("0 items")).toBeInTheDocument();
    });

    it("should display singular 'item' for 1 item", () => {
      mockCartState = {
        items: [{ id: 1, title: "Test", price: 10, quantity: 1, discountPercentage: 0 }],
        totalItems: 1,
        totalPrice: 10,
      };
      render(<CartSummary />);
      expect(screen.getByText("1 item")).toBeInTheDocument();
    });

    it("should display plural 'items' for multiple items", () => {
      mockCartState = {
        items: [{ id: 1, title: "Test", price: 10, quantity: 2, discountPercentage: 0 }],
        totalItems: 2,
        totalPrice: 20,
      };
      render(<CartSummary />);
      expect(screen.getByText("2 items")).toBeInTheDocument();
    });
  });

  describe("Price calculations", () => {
    it("should calculate tax as 10% of totalPrice", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 100, quantity: 2, discountPercentage: 0 }],
        totalItems: 2,
        totalPrice: 200,
      };
      render(<CartSummary />);
      // 10% of $200 = $20
      expect(screen.getByText("$20.00")).toBeInTheDocument();
    });

    it("should show savings when there are discounts", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 100, quantity: 2, discountPercentage: 20 }],
        totalItems: 2,
        totalPrice: 160, // $200 * 0.8
      };
      render(<CartSummary />);
      // Original price: $200, Total price: $160, Savings: $40
      expect(screen.getByText("Discount Savings")).toBeInTheDocument();
      expect(screen.getByText("-$40.00")).toBeInTheDocument();
    });

    it("should not show savings when there are no discounts", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 100, quantity: 2, discountPercentage: 0 }],
        totalItems: 2,
        totalPrice: 200,
      };
      render(<CartSummary />);
      expect(screen.queryByText("Discount Savings")).not.toBeInTheDocument();
    });
  });

  describe("Shipping logic", () => {
    it("should show FREE shipping for orders over $50", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 100, quantity: 1, discountPercentage: 0 }],
        totalItems: 1,
        totalPrice: 100,
      };
      render(<CartSummary />);
      expect(screen.getByText("FREE")).toBeInTheDocument();
    });

    it("should charge $5.99 for orders under $50", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 30, quantity: 1, discountPercentage: 0 }],
        totalItems: 1,
        totalPrice: 30,
      };
      render(<CartSummary />);
      expect(screen.getByText("$5.99")).toBeInTheDocument();
    });

    it("should show free shipping threshold message", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 30, quantity: 1, discountPercentage: 0 }],
        totalItems: 1,
        totalPrice: 30,
      };
      render(<CartSummary />);
      expect(screen.getByText("Add $20.00 more for free shipping")).toBeInTheDocument();
    });

    it("should not show threshold message when shipping is free", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 100, quantity: 1, discountPercentage: 0 }],
        totalItems: 1,
        totalPrice: 100,
      };
      render(<CartSummary />);
      expect(
        screen.queryByText(/Add .* more for free shipping/),
      ).not.toBeInTheDocument();
    });
  });

  describe("Final total calculation", () => {
    it("should calculate correct total with no shipping", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 100, quantity: 2, discountPercentage: 0 }],
        totalItems: 2,
        totalPrice: 200,
      };
      render(<CartSummary />);
      // $200 + $20 (tax) + $0 (free shipping) = $220
      expect(screen.getByText("$220.00")).toBeInTheDocument();
    });

    it("should calculate correct total with shipping", () => {
      mockCartState = {
        items: [{ id: 1, title: "Product", price: 40, quantity: 1, discountPercentage: 0 }],
        totalItems: 1,
        totalPrice: 40,
      };
      render(<CartSummary />);
      // $40 + $4 (tax) + $5.99 (shipping) = $49.99
      expect(screen.getByText("$49.99")).toBeInTheDocument();
    });
  });
});
