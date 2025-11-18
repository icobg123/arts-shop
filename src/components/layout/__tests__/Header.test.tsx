import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../Header";

// Mock Next.js Link
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

// Mock CartIcon component
const mockCartIconClick = vi.fn();
vi.mock("@/components/cart/CartIcon", () => ({
  default: ({
    onClick,
    className,
  }: {
    onClick: () => void;
    className: string;
  }) => (
    <button
      onClick={onClick}
      className={className}
      data-testid="cart-icon"
      aria-label="Shopping cart"
    >
      Cart Icon
    </button>
  ),
}));

// Mock CartDropdown component
const mockOnClose = vi.fn();
vi.mock("@/components/cart/CartDropdown", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="cart-dropdown" onClick={onClose}>
      Cart Dropdown
    </div>
  ),
}));

// Mock CartModal component
vi.mock("@/components/cart/CartModal", () => ({
  default: vi.fn().mockImplementation(({ ref }: { ref: React.Ref<HTMLDialogElement> }) => {
    return (
      <dialog ref={ref} data-testid="cart-modal">
        Cart Modal
      </dialog>
    );
  }),
}));

// Mock ThemeSwitch component
vi.mock("@/components/layout/ThemeSwitch", () => ({
  ThemeSwitch: () => <div data-testid="theme-switch">Theme Switch</div>,
}));

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.innerWidth to desktop by default
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe("Rendering - Assignment Requirements", () => {
    it("should display site name ARTS", () => {
      render(<Header />);

      expect(screen.getByText("ARTS")).toBeInTheDocument();
    });

    it("should display site name Shop", () => {
      render(<Header />);

      expect(screen.getByText("Shop")).toBeInTheDocument();
    });

    it("should render CartIcon component", () => {
      render(<Header />);

      expect(screen.getByTestId("cart-icon")).toBeInTheDocument();
    });

    it("should render ThemeSwitch component", () => {
      render(<Header />);

      expect(screen.getByTestId("theme-switch")).toBeInTheDocument();
    });

    it("should link logo to home page", () => {
      render(<Header />);

      const logoLink = screen.getByRole("link", { name: /ARTS Shop/i });
      expect(logoLink).toHaveAttribute("href", "/");
    });
  });

  describe("Desktop cart dropdown behavior (width >= 640px)", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it("should not show dropdown initially", () => {
      render(<Header />);

      expect(screen.queryByTestId("cart-dropdown")).not.toBeInTheDocument();
    });

    it("should show dropdown when CartIcon clicked on desktop", async () => {
      const user = userEvent.setup();
      render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument();
    });

    it("should toggle dropdown when CartIcon clicked multiple times", async () => {
      const user = userEvent.setup();
      render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");

      // First click - open
      await user.click(cartIcon);
      expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument();

      // Second click - close
      await user.click(cartIcon);
      expect(screen.queryByTestId("cart-dropdown")).not.toBeInTheDocument();
    });

    it("should close dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument();

      // Click outside the dropdown
      const header = screen.getByRole("banner");
      fireEvent.mouseDown(header);

      await waitFor(() => {
        expect(screen.queryByTestId("cart-dropdown")).not.toBeInTheDocument();
      });
    });

    it("should close dropdown when Escape key pressed", async () => {
      const user = userEvent.setup();
      render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByTestId("cart-dropdown")).not.toBeInTheDocument();
      });
    });

    it("should have dropdown positioned with absolute and correct classes", async () => {
      const user = userEvent.setup();
      const { container } = render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      // Find the wrapper div that contains the dropdown
      const dropdownWrapper = container.querySelector('.absolute.top-full.right-0');
      expect(dropdownWrapper).toBeInTheDocument();
      expect(dropdownWrapper).toHaveClass("absolute");
      expect(dropdownWrapper).toHaveClass("top-full");
      expect(dropdownWrapper).toHaveClass("right-0");
    });

    it("should hide dropdown on mobile (sm:block)", async () => {
      const user = userEvent.setup();
      const { container } = render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      // Find the wrapper div that should be hidden on mobile
      const dropdownWrapper = container.querySelector('.hidden.sm\\:block');
      expect(dropdownWrapper).toBeInTheDocument();
      expect(dropdownWrapper).toHaveClass("hidden");
      expect(dropdownWrapper).toHaveClass("sm:block");
    });
  });

  describe("Mobile cart modal behavior (width < 640px)", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it("should render CartModal component", () => {
      render(<Header />);

      expect(screen.getByTestId("cart-modal")).toBeInTheDocument();
    });

    it("should call showModal when CartIcon clicked on mobile", async () => {
      const user = userEvent.setup();
      const { container } = render(<Header />);

      const modal = container.querySelector('[data-testid="cart-modal"]') as HTMLDialogElement;
      const showModalSpy = vi.spyOn(modal, "showModal");

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      expect(showModalSpy).toHaveBeenCalled();
    });

    it("should not show dropdown on mobile", async () => {
      const user = userEvent.setup();
      render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      // Dropdown should not be visible
      expect(screen.queryByTestId("cart-dropdown")).not.toBeInTheDocument();
    });
  });

  describe("Responsive behavior", () => {
    it("should handle window resize from desktop to mobile", async () => {
      const user = userEvent.setup();

      // Start desktop
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(<Header />);
      const cartIcon = screen.getByTestId("cart-icon");

      // Click on desktop - should toggle dropdown
      await user.click(cartIcon);
      expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument();

      // Simulate resize to mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Click again - should call showModal
      const modal = container.querySelector('[data-testid="cart-modal"]') as HTMLDialogElement;
      const showModalSpy = vi.spyOn(modal, "showModal");

      await user.click(cartIcon);
      expect(showModalSpy).toHaveBeenCalled();
    });
  });

  describe("Event listeners cleanup", () => {
    it("should remove event listeners when dropdown closes", async () => {
      const user = userEvent.setup();
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");

      // Open dropdown
      await user.click(cartIcon);

      // Close dropdown
      await user.click(cartIcon);

      await waitFor(() => {
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          "mousedown",
          expect.any(Function),
        );
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          "keydown",
          expect.any(Function),
        );
      });
    });

    it("should not add event listeners when dropdown is closed", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");

      render(<Header />);

      // Initially closed, no listeners added
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );
    });

    it("should add event listeners when dropdown opens", async () => {
      const user = userEvent.setup();
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");

      render(<Header />);

      const cartIcon = screen.getByTestId("cart-icon");
      await user.click(cartIcon);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );
    });
  });

  describe("Accessibility", () => {
    it("should have semantic header element", () => {
      render(<Header />);

      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("should have navigation element", () => {
      render(<Header />);

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should have accessible cart button", () => {
      render(<Header />);

      const cartButton = screen.getByRole("button", {
        name: "Shopping cart",
      });
      expect(cartButton).toBeInTheDocument();
    });
  });
});
