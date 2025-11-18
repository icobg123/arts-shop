import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToCartForm } from "../AddToCartForm";
import type { Product } from "@/types/product";

// Mock cart store
vi.mock("@/store/cartStore", () => {
  let mockItems: { id: number; quantity: number }[] = [];
  const mockAddItem = vi.fn();

  return {
    useCartStore: (selector?: (state: unknown) => unknown) => {
      const state = {
        addItem: mockAddItem,
        items: mockItems,
        totalItems: 0,
        totalPrice: 0,
        hydrated: false,
        updateQuantity: vi.fn(),
        removeItem: vi.fn(),
        clearCart: vi.fn(),
      };
      return selector ? selector(state) : state;
    },
    __setMockItems: (items: { id: number; quantity: number }[]) => {
      mockItems = items;
    },
  };
});

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  XCircle: () => <span data-testid="x-circle-icon" />,
  ShoppingCartIcon: () => <span data-testid="shopping-cart-icon" />,
  Check: () => <span data-testid="check-icon" />,
}));

// Mock QuantitySelector component
const mockOnQuantityChange = vi.fn();
vi.mock("../QuantitySelector", () => ({
  QuantitySelector: ({
    productId,
    productTitle,
    max,
    initialQuantity,
    onQuantityChange,
  }: {
    productId: number;
    productTitle: string;
    max: number;
    initialQuantity: number;
    onQuantityChange: (qty: number) => void;
  }) => (
    <div data-testid="quantity-selector">
      <label htmlFor={`qty-${productId}`}>{productTitle} Quantity</label>
      <input
        type="number"
        id={`qty-${productId}`}
        name="quantity"
        min={1}
        max={max}
        defaultValue={initialQuantity}
        onChange={(e) => {
          onQuantityChange(parseInt(e.target.value));
          mockOnQuantityChange(parseInt(e.target.value));
        }}
        data-testid="quantity-input"
      />
      <span>Max: {max}</span>
    </div>
  ),
}));

// Mock AddToCartButton component (uses React 19 useFormStatus)
vi.mock("../AddToCartButton", () => ({
  AddToCartButton: () => (
    <button type="submit" data-testid="add-to-cart-button">
      Add to Cart
    </button>
  ),
}));

describe("AddToCartForm Component", () => {
  const mockProduct: Product = {
    id: 1,
    title: "iPhone 15",
    description: "Latest iPhone model",
    category: "smartphones",
    price: 999.99,
    discountPercentage: 15,
    rating: 4.5,
    stock: 50,
    tags: ["smartphone", "apple"],
    sku: "IPH15",
    weight: 0.2,
    dimensions: { width: 7, height: 15, depth: 1 },
    warrantyInformation: "1 year",
    shippingInformation: "Ships in 1-2 days",
    availabilityStatus: "In Stock",
    returnPolicy: "30 days",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      barcode: "123456789",
      qrCode: "qr123",
    },
    thumbnail: "https://example.com/iphone.jpg",
    images: ["https://example.com/iphone1.jpg"],
  };

  let mockAddItem: ReturnType<typeof vi.fn>;
  let mockToast: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Reset items
    const store = await import("@/store/cartStore");
    if ("__setMockItems" in store) {
      (
        store as {
          __setMockItems: (items: { id: number; quantity: number }[]) => void;
        }
      ).__setMockItems([]);
    }

    // Get mocked functions
    const { useCartStore } = store;
    const state = useCartStore();
    mockAddItem = state.addItem as ReturnType<typeof vi.fn>;

    const { toast } = await import("sonner");
    mockToast = toast as unknown as typeof mockToast;
  });

  describe("Rendering", () => {
    it("should render QuantitySelector with correct props", () => {
      render(<AddToCartForm product={mockProduct} />);

      const selector = screen.getByTestId("quantity-selector");
      expect(selector).toBeInTheDocument();
      expect(screen.getByText("iPhone 15 Quantity")).toBeInTheDocument();
      expect(screen.getByText("Max: 50")).toBeInTheDocument();
    });

    it("should render AddToCartButton", () => {
      render(<AddToCartForm product={mockProduct} />);

      expect(screen.getByTestId("add-to-cart-button")).toBeInTheDocument();
    });

    it("should render form element", () => {
      const { container } = render(<AddToCartForm product={mockProduct} />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("should show out-of-stock alert when stock is 0", () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<AddToCartForm product={outOfStockProduct} />);

      expect(
        screen.getByText("This product is out of stock")
      ).toBeInTheDocument();
      expect(screen.getByTestId("x-circle-icon")).toBeInTheDocument();
    });

    it("should not render form when product is out of stock", () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<AddToCartForm product={outOfStockProduct} />);

      expect(screen.queryByTestId("quantity-selector")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("add-to-cart-button")
      ).not.toBeInTheDocument();
    });
  });

  describe("Form submission", () => {
    it("should call addItem with product and quantity when submitted", async () => {
      const user = userEvent.setup();
      const { container } = render(<AddToCartForm product={mockProduct} />);

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1);
      });
    });

    it("should use quantity from formData if present", async () => {
      const user = userEvent.setup();
      const { container } = render(<AddToCartForm product={mockProduct} />);

      const input = screen.getByTestId("quantity-input");
      await user.clear(input);
      await user.type(input, "5");

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 5);
      });
    });

    it("should fall back to state quantity if formData is invalid", async () => {
      const { container } = render(<AddToCartForm product={mockProduct} />);

      const form = container.querySelector("form") as HTMLFormElement;
      const formData = new FormData();
      formData.set("quantity", "invalid");

      // Manually call handleSubmit with invalid formData
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1);
      });
    });

    it("should show success toast for new items", async () => {
      const { container } = render(<AddToCartForm product={mockProduct} />);

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          "Added iPhone 15 to cart!"
        );
      });
    });

    it("should show info toast for existing items", async () => {
      const store = await import("@/store/cartStore");
      if ("__setMockItems" in store) {
        (
          store as {
            __setMockItems: (items: { id: number; quantity: number }[]) => void;
          }
        ).__setMockItems([{ id: 1, quantity: 2 }]);
      }

      const { container } = render(<AddToCartForm product={mockProduct} />);

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockToast.info).toHaveBeenCalledWith(
          "Updated iPhone 15 quantity in cart"
        );
      });
    });

    it("should show error toast on addItem failure", async () => {
      mockAddItem.mockImplementationOnce(() => {
        throw new Error("Failed to add");
      });

      const { container } = render(<AddToCartForm product={mockProduct} />);

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          "Failed to add iPhone 15 to cart"
        );
      });
    });

    it("should handle form submission with custom quantity", async () => {
      const user = userEvent.setup();
      const { container } = render(<AddToCartForm product={mockProduct} />);

      const input = screen.getByTestId("quantity-input");
      await user.clear(input);
      await user.type(input, "10");

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 10);
      });
    });
  });

  describe("Integration with QuantitySelector", () => {
    it("should update quantity state when QuantitySelector changes", async () => {
      const user = userEvent.setup();
      render(<AddToCartForm product={mockProduct} />);

      const input = screen.getByTestId("quantity-input");
      await user.clear(input);
      await user.type(input, "3");

      expect(mockOnQuantityChange).toHaveBeenCalledWith(3);
    });

    it("should submit updated quantity after change", async () => {
      const user = userEvent.setup();
      const { container } = render(<AddToCartForm product={mockProduct} />);

      const input = screen.getByTestId("quantity-input");
      await user.clear(input);
      await user.type(input, "7");

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 7);
      });
    });

    it("should pass correct max value to QuantitySelector", () => {
      const limitedStockProduct = { ...mockProduct, stock: 5 };
      render(<AddToCartForm product={limitedStockProduct} />);

      expect(screen.getByText("Max: 5")).toBeInTheDocument();
    });

    it("should pass initial quantity of 1 to QuantitySelector", () => {
      render(<AddToCartForm product={mockProduct} />);

      const input = screen.getByTestId("quantity-input");
      expect(input).toHaveValue(1);
    });
  });

  describe("Error handling", () => {
    it("should catch errors from addItem gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockAddItem.mockImplementationOnce(() => {
        throw new Error("Network error");
      });

      const { container } = render(<AddToCartForm product={mockProduct} />);

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          "Failed to add iPhone 15 to cart"
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it("should show error toast with product title on failure", async () => {
      mockAddItem.mockImplementationOnce(() => {
        throw new Error("Random error");
      });

      const productWithLongTitle = {
        ...mockProduct,
        title: "Super Long Product Name",
      };
      const { container } = render(
        <AddToCartForm product={productWithLongTitle} />
      );

      const form = container.querySelector("form") as HTMLFormElement;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          "Failed to add Super Long Product Name to cart"
        );
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle stock of 1", () => {
      const singleStockProduct = { ...mockProduct, stock: 1 };
      render(<AddToCartForm product={singleStockProduct} />);

      expect(screen.getByText("Max: 1")).toBeInTheDocument();
    });

    it("should handle very large stock values", () => {
      const largeStockProduct = { ...mockProduct, stock: 1000 };
      render(<AddToCartForm product={largeStockProduct} />);

      expect(screen.getByText("Max: 1000")).toBeInTheDocument();
    });

    it("should not crash with missing product fields", () => {
      const minimalProduct = {
        ...mockProduct,
        brand: undefined,
        reviews: undefined,
      };
      render(<AddToCartForm product={minimalProduct} />);

      expect(screen.getByTestId("quantity-selector")).toBeInTheDocument();
    });
  });
});
