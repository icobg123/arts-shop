import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantitySelector } from "../QuantitySelector";

describe("QuantitySelector Component", () => {
  const defaultProps = {
    productId: 1,
    productTitle: "Test Product",
    max: 10,
  };

  describe("Rendering", () => {
    it("should render with default quantity of 1", () => {
      render(<QuantitySelector {...defaultProps} />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(1);
    });

    it("should render with custom initial quantity", () => {
      render(<QuantitySelector {...defaultProps} initialQuantity={5} />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(5);
    });

    it("should display decrease and increase buttons", () => {
      render(<QuantitySelector {...defaultProps} />);

      expect(screen.getByLabelText("Decrease quantity")).toBeInTheDocument();
      expect(screen.getByLabelText("Increase quantity")).toBeInTheDocument();
    });

    it("should show stock warning when max is 10 or less", () => {
      render(<QuantitySelector {...defaultProps} max={10} />);

      expect(screen.getByText("Only 10 left in stock")).toBeInTheDocument();
    });

    it("should not show stock warning when max is greater than 10", () => {
      render(<QuantitySelector {...defaultProps} max={11} />);

      expect(
        screen.queryByText(/Only .* left in stock/),
      ).not.toBeInTheDocument();
    });
  });

  describe("Increase button", () => {
    it("should increase quantity when clicked", async () => {
      const user = userEvent.setup();
      render(<QuantitySelector {...defaultProps} />);

      const increaseBtn = screen.getByLabelText("Increase quantity");
      await user.click(increaseBtn);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(2);
    });

    it("should call onQuantityChange when increased", async () => {
      const user = userEvent.setup();
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          onQuantityChange={onQuantityChange}
        />,
      );

      const increaseBtn = screen.getByLabelText("Increase quantity");
      await user.click(increaseBtn);

      expect(onQuantityChange).toHaveBeenCalledWith(2);
    });

    it("should be disabled when quantity equals max", () => {
      render(<QuantitySelector {...defaultProps} initialQuantity={10} />);

      const increaseBtn = screen.getByLabelText("Increase quantity");
      expect(increaseBtn).toBeDisabled();
    });

    it("should not increase beyond max", async () => {
      const user = userEvent.setup();
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          initialQuantity={10}
          onQuantityChange={onQuantityChange}
        />,
      );

      const increaseBtn = screen.getByLabelText("Increase quantity");
      await user.click(increaseBtn);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(10);
      expect(onQuantityChange).not.toHaveBeenCalled();
    });
  });

  describe("Decrease button", () => {
    it("should decrease quantity when clicked", async () => {
      const user = userEvent.setup();
      render(<QuantitySelector {...defaultProps} initialQuantity={5} />);

      const decreaseBtn = screen.getByLabelText("Decrease quantity");
      await user.click(decreaseBtn);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(4);
    });

    it("should call onQuantityChange when decreased", async () => {
      const user = userEvent.setup();
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          initialQuantity={5}
          onQuantityChange={onQuantityChange}
        />,
      );

      const decreaseBtn = screen.getByLabelText("Decrease quantity");
      await user.click(decreaseBtn);

      expect(onQuantityChange).toHaveBeenCalledWith(4);
    });

    it("should be disabled when quantity is 1", () => {
      render(<QuantitySelector {...defaultProps} initialQuantity={1} />);

      const decreaseBtn = screen.getByLabelText("Decrease quantity");
      expect(decreaseBtn).toBeDisabled();
    });

    it("should not decrease below 1", async () => {
      const user = userEvent.setup();
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          initialQuantity={1}
          onQuantityChange={onQuantityChange}
        />,
      );

      const decreaseBtn = screen.getByLabelText("Decrease quantity");
      await user.click(decreaseBtn);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(1);
      expect(onQuantityChange).not.toHaveBeenCalled();
    });
  });

  describe("Input field", () => {
    it("should handle valid input and update quantity", () => {
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          onQuantityChange={onQuantityChange}
        />,
      );

      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      // Simulate typing a valid number
      fireEvent.change(input, { target: { value: "5" } });

      expect(onQuantityChange).toHaveBeenCalledWith(5);
    });

    it("should reject input below minimum (1)", () => {
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          initialQuantity={3}
          onQuantityChange={onQuantityChange}
        />,
      );

      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      // Try to set value below min
      fireEvent.change(input, { target: { value: "0" } });

      // Should not update for value below min
      expect(onQuantityChange).not.toHaveBeenCalled();
    });

    it("should reject input above maximum", () => {
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          max={5}
          initialQuantity={3}
          onQuantityChange={onQuantityChange}
        />,
      );

      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      // Try to set value above max
      fireEvent.change(input, { target: { value: "10" } });

      // Should not update for value above max
      expect(onQuantityChange).not.toHaveBeenCalled();
    });

    it("should reject non-numeric input", () => {
      const onQuantityChange = vi.fn();
      render(
        <QuantitySelector
          {...defaultProps}
          initialQuantity={3}
          onQuantityChange={onQuantityChange}
        />,
      );

      const input = screen.getByRole("spinbutton") as HTMLInputElement;

      // Try to set non-numeric value
      fireEvent.change(input, { target: { value: "abc" } });

      // Should not update for invalid input
      expect(onQuantityChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<QuantitySelector {...defaultProps} />);

      const group = screen.getByRole("group", {
        name: "Quantity selector for Test Product",
      });
      expect(group).toHaveAttribute(
        "aria-label",
        "Quantity selector for Test Product",
      );
    });

    it("should have min and max attributes on input", () => {
      render(<QuantitySelector {...defaultProps} max={10} />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("min", "1");
      expect(input).toHaveAttribute("max", "10");
    });

    it("should display current quantity value", () => {
      render(<QuantitySelector {...defaultProps} initialQuantity={5} />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(5);
    });

    it("should have fieldset with legend", () => {
      render(<QuantitySelector {...defaultProps} />);

      expect(screen.getByText("Quantity")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle max of 1", () => {
      render(<QuantitySelector {...defaultProps} max={1} />);

      const increaseBtn = screen.getByLabelText("Increase quantity");
      const decreaseBtn = screen.getByLabelText("Decrease quantity");

      expect(increaseBtn).toBeDisabled();
      expect(decreaseBtn).toBeDisabled();
    });

    it("should show stock warning for max of 1", () => {
      render(<QuantitySelector {...defaultProps} max={1} />);

      expect(screen.getByText("Only 1 left in stock")).toBeInTheDocument();
    });

    it("should handle large max values", () => {
      render(<QuantitySelector {...defaultProps} max={1000} />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("max", "1000");
    });

    it("should not call onQuantityChange if not provided", async () => {
      const user = userEvent.setup();
      // Should not throw error
      render(<QuantitySelector {...defaultProps} />);

      const increaseBtn = screen.getByLabelText("Increase quantity");
      await user.click(increaseBtn);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveValue(2);
    });
  });
});
