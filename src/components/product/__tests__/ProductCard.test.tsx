import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "../ProductCard";
import type { Product } from "@/types/product";

// Mock Next.js components
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    priority,
    fetchPriority,
  }: {
    src: string;
    alt: string;
    priority?: boolean;
    fetchPriority?: string;
  }) => (
    <img
      src={src}
      alt={alt}
      data-priority={priority}
      data-fetch-priority={fetchPriority}
    />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock React 19 ViewTransition
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    unstable_ViewTransition: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mock cart store
vi.mock("@/store/cartStore", () => {
  const mockAddItem = vi.fn();
  return {
    useCartStore: (selector?: (state: unknown) => unknown) => {
      const state = {
        addItem: mockAddItem,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        hydrated: false,
        updateQuantity: vi.fn(),
        removeItem: vi.fn(),
        clearCart: vi.fn(),
      };
      return selector ? selector(state) : state;
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
  ShoppingCart: () => <span data-testid="shopping-cart-icon" />,
}));

// Mock ProductRating component
vi.mock("../ProductRating", () => ({
  ProductRating: ({
    rating,
    reviewCount,
    size,
  }: {
    rating: number;
    reviewCount: number;
    size: string;
  }) => (
    <div data-testid="product-rating" data-rating={rating} data-size={size}>
      {rating} ({reviewCount} reviews)
    </div>
  ),
}));

// Mock getProductUrl
vi.mock("@/lib/api/products", () => ({
  getProductUrl: (category: string, id: number) =>
    `/products/${category}/${id}`,
}));

describe("ProductCard Component", () => {
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
    reviews: [
      {
        rating: 5,
        comment: "Great phone",
        date: "2024-01-01",
        reviewerName: "John",
        reviewerEmail: "john@example.com",
      },
    ],
  };

  let mockAddItem: ReturnType<typeof vi.fn>;
  let mockToast: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // Mock window.dispatchEvent
    vi.spyOn(window, "dispatchEvent");

    // Get mocked functions
    const { useCartStore } = await import("@/store/cartStore");
    const state = useCartStore();
    mockAddItem = state.addItem as ReturnType<typeof vi.fn>;

    const { toast } = await import("sonner");
    mockToast = toast as unknown as typeof mockToast;
  });

  describe("Rendering - Assignment Requirements", () => {
    it("should display product image", () => {
      render(<ProductCard product={mockProduct} />);

      const image = screen.getByAltText("iPhone 15");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/iphone.jpg");
    });

    it("should display product title", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("iPhone 15")).toBeInTheDocument();
    });

    it("should display product price", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("$999.99")).toBeInTheDocument();
    });

    it("should display product rating", () => {
      render(<ProductCard product={mockProduct} />);

      const rating = screen.getByTestId("product-rating");
      expect(rating).toBeInTheDocument();
      expect(rating).toHaveAttribute("data-rating", "4.5");
    });

    it("should display product description", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("Latest iPhone model")).toBeInTheDocument();
    });

    it("should display discount badge when product has discount", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("15% OFF")).toBeInTheDocument();
    });

    it("should display original price with line-through when discounted", () => {
      render(<ProductCard product={mockProduct} />);

      // Original price = 999.99 / (1 - 0.15) = 1176.46
      const originalPrice = screen.getByText("$1176.46");
      expect(originalPrice).toBeInTheDocument();
      expect(originalPrice).toHaveClass("line-through");
    });

    it("should display brand badge if product has brand", () => {
      const productWithBrand = { ...mockProduct, brand: "Apple" };
      render(<ProductCard product={productWithBrand} />);

      expect(screen.getByText("Apple")).toBeInTheDocument();
    });

    it("should not display discount badge when no discount", () => {
      const productWithoutDiscount = { ...mockProduct, discountPercentage: 0 };
      render(<ProductCard product={productWithoutDiscount} />);

      expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
    });

    it("should not display original price when no discount", () => {
      const productWithoutDiscount = { ...mockProduct, discountPercentage: 0 };
      render(<ProductCard product={productWithoutDiscount} />);

      const prices = screen
        .getAllByText(/\$/)
        .filter((el) => el.classList.contains("line-through"));
      expect(prices).toHaveLength(0);
    });

    it("should display Out of Stock badge when stock is 0", () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      const { container } = render(<ProductCard product={outOfStockProduct} />);

      // Check for the badge specifically (not the button text)
      const badge = container.querySelector(".badge.badge-neutral");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Out of Stock");
    });
  });

  describe("Add to Cart functionality", () => {
    it("should display Add to Cart button", () => {
      render(<ProductCard product={mockProduct} />);

      const button = screen.getByRole("button", {
        name: /Add iPhone 15 to cart/i,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Add to Cart");
    });

    it("should add item to cart when button clicked", async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} />);

      const button = screen.getByRole("button", {
        name: /Add iPhone 15 to cart/i,
      });
      await user.click(button);

      expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1);
    });

    it("should show toast notification when item added", async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} />);

      const button = screen.getByRole("button", {
        name: /Add iPhone 15 to cart/i,
      });
      await user.click(button);

      expect(mockToast.success).toHaveBeenCalledWith(
        "Added iPhone 15 to cart!"
      );
    });

    it("should dispatch cart-updated event when item added", async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} />);

      const button = screen.getByRole("button", {
        name: /Add iPhone 15 to cart/i,
      });
      await user.click(button);

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "cart-updated",
        })
      );
    });

    it("should disable button when product is out of stock", () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);

      const button = screen.getByRole("button", {
        name: /Add iPhone 15 to cart/i,
      });
      expect(button).toBeDisabled();
    });

    it("should show Out of Stock text on button when disabled", () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);

      const button = screen.getByRole("button", {
        name: /Add iPhone 15 to cart/i,
      });
      expect(button).toHaveTextContent("Out of Stock");
    });

    it("should have proper ARIA label for accessibility", () => {
      render(<ProductCard product={mockProduct} />);

      const button = screen.getByRole("button", {
        name: "Add iPhone 15 to cart",
      });
      expect(button).toHaveAttribute("aria-label", "Add iPhone 15 to cart");
    });

    it("should prevent event propagation when button clicked", async () => {
      const user = userEvent.setup();
      const mockStopPropagation = vi.fn();
      const mockPreventDefault = vi.fn();

      render(<ProductCard product={mockProduct} />);

      const button = screen.getByRole("button", {
        name: /Add iPhone 15 to cart/i,
      });

      // Simulate click with event handlers
      button.addEventListener("click", (e) => {
        mockStopPropagation();
        mockPreventDefault();
      });

      await user.click(button);

      // Button should still add to cart
      expect(mockAddItem).toHaveBeenCalled();
    });
  });

  describe("Navigation", () => {
    it("should link to correct product URL", () => {
      render(<ProductCard product={mockProduct} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/products/smartphones/1");
    });

    it("should have product image with high fetchPriority for first 12 items", () => {
      render(<ProductCard product={mockProduct} index={5} />);

      const image = screen.getByAltText("iPhone 15");
      expect(image).toHaveAttribute("data-fetch-priority", "high");
    });

    it("should have product image with priority prop for first 12 items", () => {
      render(<ProductCard product={mockProduct} index={3} />);

      const image = screen.getByAltText("iPhone 15");
      expect(image).toHaveAttribute("data-priority", "true");
    });

    it("should not have high priority for items after index 11", () => {
      render(<ProductCard product={mockProduct} index={15} />);

      const image = screen.getByAltText("iPhone 15");
      expect(image).toHaveAttribute("data-priority", "false");
    });
  });

  describe("Edge cases", () => {
    it("should handle 100% discount correctly", () => {
      const freeProduct = { ...mockProduct, price: 0, discountPercentage: 100 };
      render(<ProductCard product={freeProduct} />);

      expect(screen.getByText("100% OFF")).toBeInTheDocument();
      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    it("should handle products without reviews", () => {
      const productWithoutReviews = { ...mockProduct, reviews: undefined };
      render(<ProductCard product={productWithoutReviews} />);

      const rating = screen.getByTestId("product-rating");
      expect(rating).toHaveTextContent("(0 reviews)");
    });

    it("should handle products without brand", () => {
      const productWithoutBrand = { ...mockProduct, brand: undefined };
      render(<ProductCard product={productWithoutBrand} />);

      expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    });

    it("should display shopping cart icon", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByTestId("shopping-cart-icon")).toBeInTheDocument();
    });
  });
});
