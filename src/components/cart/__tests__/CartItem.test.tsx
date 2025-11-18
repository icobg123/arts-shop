import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartItem from "../CartItem";

// Mock dependencies
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUpdateQuantity = vi.fn();
const mockRemoveItem = vi.fn();

vi.mock("@/store/cartStore", () => ({
  useCartStore: (selector?: (state: unknown) => unknown) => {
    const state = {
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      hydrated: false,
      addItem: vi.fn(),
      clearCart: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

describe("CartItem Component", () => {
  const mockItem = {
    id: 1,
    title: "Test Product",
    price: 100,
    thumbnail: "https://example.com/image.jpg",
    quantity: 2,
    stock: 10,
    discountPercentage: 0,
    category: "electronics",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render product information", () => {
      render(<CartItem item={mockItem} />);

      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByAltText("Test Product")).toBeInTheDocument();
    });

    it("should display price without discount", () => {
      render(<CartItem item={mockItem} />);

      expect(screen.getByText("$100.00")).toBeInTheDocument();
    });

    it("should display discounted price with discount badge", () => {
      const discountedItem = { ...mockItem, discountPercentage: 20 };
      render(<CartItem item={discountedItem} />);

      // Discounted price: $100 * 0.8 = $80
      expect(screen.getByText("$80.00")).toBeInTheDocument();
      expect(screen.getByText("$100.00")).toBeInTheDocument(); // Original price
      expect(screen.getByText("-20%")).toBeInTheDocument();
    });

    it("should display item total without discount", () => {
      render(<CartItem item={mockItem} />);

      // 2 items * $100 = $200
      expect(screen.getByText("$200.00")).toBeInTheDocument();
    });

    it("should display item total with discount", () => {
      const discountedItem = { ...mockItem, discountPercentage: 25 };
      render(<CartItem item={discountedItem} />);

      // 2 items * ($100 * 0.75) = $150
      expect(screen.getByText("$150.00")).toBeInTheDocument();
    });

    it("should render remove button", () => {
      render(<CartItem item={mockItem} />);

      const removeBtn = screen.getByLabelText("Remove Test Product");
      expect(removeBtn).toBeInTheDocument();
    });

    it("should render quantity controls", () => {
      render(<CartItem item={mockItem} />);

      expect(screen.getByLabelText("Decrease quantity")).toBeInTheDocument();
      expect(screen.getByLabelText("Increase quantity")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    });
  });

  describe("Stock warning", () => {
    it("should show warning when quantity is at 80% of stock", () => {
      const item = { ...mockItem, quantity: 8, stock: 10 };
      render(<CartItem item={item} />);

      expect(screen.getByText("Only 10 left in stock")).toBeInTheDocument();
    });

    it("should show warning when quantity equals stock", () => {
      const item = { ...mockItem, quantity: 10, stock: 10 };
      render(<CartItem item={item} />);

      expect(screen.getByText("Only 10 left in stock")).toBeInTheDocument();
    });

    it("should not show warning when quantity is below 80% of stock", () => {
      const item = { ...mockItem, quantity: 5, stock: 10 };
      render(<CartItem item={item} />);

      expect(
        screen.queryByText("Only 10 left in stock"),
      ).not.toBeInTheDocument();
    });

    it("should show warning for low stock items", () => {
      const item = { ...mockItem, quantity: 2, stock: 2 };
      render(<CartItem item={item} />);

      expect(screen.getByText("Only 2 left in stock")).toBeInTheDocument();
    });
  });

  describe("Price calculations", () => {
    it("should calculate item total with 0% discount", () => {
      const item = { ...mockItem, quantity: 3, discountPercentage: 0 };
      render(<CartItem item={item} />);

      // 3 * $100 = $300
      expect(screen.getByText("$300.00")).toBeInTheDocument();
    });

    it("should calculate item total with 50% discount", () => {
      const item = { ...mockItem, quantity: 4, discountPercentage: 50 };
      render(<CartItem item={item} />);

      // 4 * ($100 * 0.5) = $200
      expect(screen.getByText("$200.00")).toBeInTheDocument();
    });

    it("should calculate item total with 100% discount", () => {
      const item = { ...mockItem, quantity: 2, discountPercentage: 100 };
      render(<CartItem item={item} />);

      // 2 * ($100 * 0) = $0
      const zeros = screen.getAllByText("$0.00");
      expect(zeros.length).toBeGreaterThan(0);
    });

    it("should handle decimal prices correctly", () => {
      const item = {
        ...mockItem,
        price: 9.99,
        quantity: 1,
        discountPercentage: 0,
      };
      render(<CartItem item={item} />);

      const prices = screen.getAllByText("$9.99");
      expect(prices.length).toBeGreaterThan(0);
    });

    it("should calculate discount price accurately", () => {
      const item = { ...mockItem, price: 99.99, discountPercentage: 15 };
      render(<CartItem item={item} />);

      // $99.99 * 0.85 = $84.9915 ≈ $84.99
      expect(screen.getByText("$84.99")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible remove button label", () => {
      render(<CartItem item={mockItem} />);

      const removeBtn = screen.getByLabelText("Remove Test Product");
      expect(removeBtn).toBeInTheDocument();
    });

    it("should have accessible quantity control labels", () => {
      render(<CartItem item={mockItem} />);

      expect(screen.getByLabelText("Decrease quantity")).toBeInTheDocument();
      expect(screen.getByLabelText("Increase quantity")).toBeInTheDocument();
    });

    it("should have proper image alt text", () => {
      render(<CartItem item={mockItem} />);

      const image = screen.getByAltText("Test Product");
      expect(image).toBeInTheDocument();
    });
  });

  describe("Links", () => {
    it("should have correct product URL", () => {
      render(<CartItem item={mockItem} />);

      const links = screen.getAllByRole("link");
      expect(links[0]).toHaveAttribute("href", "/electronics/1");
    });
  });

  describe("Button states", () => {
    it("should disable decrease button when quantity is 1", () => {
      const item = { ...mockItem, quantity: 1 };
      render(<CartItem item={item} />);

      const decreaseBtn = screen.getByLabelText("Decrease quantity");
      expect(decreaseBtn).toBeDisabled();
    });

    it("should disable increase button when quantity equals stock", () => {
      const item = { ...mockItem, quantity: 10, stock: 10 };
      render(<CartItem item={item} />);

      const increaseBtn = screen.getByLabelText("Increase quantity");
      expect(increaseBtn).toBeDisabled();
    });

    it("should enable both buttons when quantity is between 1 and stock", () => {
      const item = { ...mockItem, quantity: 5, stock: 10 };
      render(<CartItem item={item} />);

      const decreaseBtn = screen.getByLabelText("Decrease quantity");
      const increaseBtn = screen.getByLabelText("Increase quantity");
      expect(decreaseBtn).not.toBeDisabled();
      expect(increaseBtn).not.toBeDisabled();
    });
  });

  describe("Edge cases", () => {
    it("should handle items with no discount", () => {
      render(<CartItem item={mockItem} />);

      expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
    });

    it("should handle single quantity items", () => {
      const item = { ...mockItem, quantity: 1 };
      render(<CartItem item={item} />);

      const prices = screen.getAllByText("$100.00");
      expect(prices.length).toBeGreaterThan(0);
    });

    it("should handle items at maximum stock", () => {
      const item = { ...mockItem, quantity: 10, stock: 10 };
      render(<CartItem item={item} />);

      expect(screen.getByDisplayValue("10")).toBeInTheDocument();
      expect(screen.getByText("Only 10 left in stock")).toBeInTheDocument();
    });

    it("should display correct total for large quantities", () => {
      const item = { ...mockItem, quantity: 99, stock: 100 };
      render(<CartItem item={item} />);

      // 99 * $100 = $9900
      expect(screen.getByText("$9900.00")).toBeInTheDocument();
    });
  });

  describe("User interactions", () => {
    it("should call removeItem when remove button is clicked", async () => {
      const user = userEvent.setup();
      render(<CartItem item={mockItem} />);

      const removeBtn = screen.getByLabelText("Remove Test Product");
      await user.click(removeBtn);

      expect(mockRemoveItem).toHaveBeenCalledWith(1);
    });

    it("should call updateQuantity when increase button is clicked", async () => {
      const user = userEvent.setup();
      render(<CartItem item={mockItem} />);

      const increaseBtn = screen.getByLabelText("Increase quantity");
      await user.click(increaseBtn);

      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
    });

    it("should call updateQuantity when decrease button is clicked", async () => {
      const user = userEvent.setup();
      const item = { ...mockItem, quantity: 5 };
      render(<CartItem item={item} />);

      const decreaseBtn = screen.getByLabelText("Decrease quantity");
      await user.click(decreaseBtn);

      expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 4);
    });

    it("should handle quantity input changes", async () => {
      const user = userEvent.setup();
      render(<CartItem item={mockItem} />);

      const input = screen.getByDisplayValue("2");
      await user.clear(input);
      await user.type(input, "5");

      expect(mockUpdateQuantity).toHaveBeenCalled();
    });
  });
});
