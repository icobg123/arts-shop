import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductPrice } from "../ProductPrice";

describe("ProductPrice Component", () => {
  describe("Display without discount", () => {
    it("should display price without discount badge", () => {
      render(<ProductPrice price={99.99} />);

      expect(screen.getByText("$99.99")).toBeInTheDocument();
      expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Original price/)).not.toBeInTheDocument();
    });

    it("should display price with 0% discount (same as no discount)", () => {
      render(<ProductPrice price={50.0} discountPercentage={0} />);

      expect(screen.getByText("$50.00")).toBeInTheDocument();
      expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
    });
  });

  describe("Display with discount", () => {
    it("should display current price and discount badge", () => {
      render(<ProductPrice price={85.0} discountPercentage={15} />);

      expect(screen.getByText("$85.00")).toBeInTheDocument();
      expect(screen.getByText("15% OFF")).toBeInTheDocument();
    });

    it("should calculate and display original price correctly", () => {
      // Current price $85 with 15% discount
      // Original price = $85 / (1 - 0.15) = $85 / 0.85 = $100
      render(<ProductPrice price={85.0} discountPercentage={15} />);

      expect(screen.getByText("$100.00")).toBeInTheDocument();
    });

    it("should handle 50% discount correctly", () => {
      // Current price $50 with 50% discount
      // Original price = $50 / 0.5 = $100
      render(<ProductPrice price={50.0} discountPercentage={50} />);

      expect(screen.getByText("$50.00")).toBeInTheDocument();
      expect(screen.getByText("50% OFF")).toBeInTheDocument();
      expect(screen.getByText("$100.00")).toBeInTheDocument();
    });

    it("should round discount percentage to nearest integer", () => {
      render(<ProductPrice price={84.5} discountPercentage={15.7} />);

      expect(screen.getByText("16% OFF")).toBeInTheDocument();
    });
  });

  describe("Price calculation accuracy", () => {
    it("should calculate original price for 25% discount", () => {
      // $75 with 25% off = $75 / 0.75 = $100
      render(<ProductPrice price={75.0} discountPercentage={25} />);

      expect(screen.getByText("$100.00")).toBeInTheDocument();
    });

    it("should calculate original price for 10% discount", () => {
      // $90 with 10% off = $90 / 0.9 = $100
      render(<ProductPrice price={90.0} discountPercentage={10} />);

      expect(screen.getByText("$100.00")).toBeInTheDocument();
    });

    it("should handle small prices with discount", () => {
      // $8.50 with 15% discount
      // Original = $8.50 / 0.85 = $10
      render(<ProductPrice price={8.5} discountPercentage={15} />);

      expect(screen.getByText("$8.50")).toBeInTheDocument();
      expect(screen.getByText("$10.00")).toBeInTheDocument();
    });

    it("should handle decimal discount percentages", () => {
      // $99.50 with 0.5% discount
      // Original = $99.50 / 0.995 = $100
      render(<ProductPrice price={99.5} discountPercentage={0.5} />);

      expect(screen.getByText("1% OFF")).toBeInTheDocument(); // Rounded
      expect(screen.getByText("$100.00")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for current price", () => {
      render(<ProductPrice price={99.99} />);

      const priceElement = screen.getByLabelText("Current price: $99.99");
      expect(priceElement).toBeInTheDocument();
    });

    it("should have proper ARIA label for discount badge", () => {
      render(<ProductPrice price={85.0} discountPercentage={15} />);

      const discountBadge = screen.getByLabelText("15% discount");
      expect(discountBadge).toBeInTheDocument();
    });

    it("should have region role for pricing information", () => {
      const { container } = render(<ProductPrice price={99.99} />);

      const region = container.querySelector('[role="region"]');
      expect(region).toHaveAttribute("aria-label", "Pricing information");
    });

    it("should have screen reader text for original price", () => {
      render(<ProductPrice price={85.0} discountPercentage={15} />);

      const srText = screen.getByText("Original price:", { exact: false });
      expect(srText).toHaveClass("sr-only");
    });
  });

  describe("Edge cases", () => {
    it("should handle very small discount (0.1%)", () => {
      render(<ProductPrice price={99.9} discountPercentage={0.1} />);

      expect(screen.getByText("0% OFF")).toBeInTheDocument(); // Rounds to 0
    });

    it("should handle large prices", () => {
      render(<ProductPrice price={9999.99} discountPercentage={20} />);

      expect(screen.getByText("$9999.99")).toBeInTheDocument();
      expect(screen.getByText("$12499.99")).toBeInTheDocument();
    });

    it("should format prices to 2 decimal places", () => {
      render(<ProductPrice price={10} discountPercentage={0} />);

      expect(screen.getByText("$10.00")).toBeInTheDocument();
    });
  });
});
