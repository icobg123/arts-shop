import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../Pagination";

describe("Pagination Component", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should not render when totalPages is 1", () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should not render when totalPages is less than 1", () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={mockOnPageChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render page buttons for multiple pages", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should render Previous and Next buttons", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    });

    it("should highlight current page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageBtn = screen.getByText("3");
      expect(currentPageBtn).toHaveClass("btn-active");
      expect(currentPageBtn).toHaveClass("btn-primary");
      expect(currentPageBtn).toHaveAttribute("aria-current", "page");
    });
  });

  describe("Previous button", () => {
    it("should be disabled on first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevBtn = screen.getByLabelText("Previous page");
      expect(prevBtn).toBeDisabled();
    });

    it("should be enabled when not on first page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevBtn = screen.getByLabelText("Previous page");
      expect(prevBtn).not.toBeDisabled();
    });

    it("should call onPageChange with previous page number", async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevBtn = screen.getByLabelText("Previous page");
      await user.click(prevBtn);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe("Next button", () => {
    it("should be disabled on last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextBtn = screen.getByLabelText("Next page");
      expect(nextBtn).toBeDisabled();
    });

    it("should be enabled when not on last page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextBtn = screen.getByLabelText("Next page");
      expect(nextBtn).not.toBeDisabled();
    });

    it("should call onPageChange with next page number", async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextBtn = screen.getByLabelText("Next page");
      await user.click(nextBtn);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe("Page number buttons", () => {
    it("should call onPageChange with clicked page number", async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const page4Btn = screen.getByText("4");
      await user.click(page4Btn);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("should call onPageChange even when clicking current page", async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const page3Btn = screen.getByText("3");
      await user.click(page3Btn);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe("Sliding window logic (maxButtons)", () => {
    it("should show 5 buttons by default when total pages > 5", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.queryByText("6")).not.toBeInTheDocument();
    });

    it("should show custom maxButtons when specified", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
          maxButtons={3}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.queryByText("4")).not.toBeInTheDocument();
    });

    it("should center current page when in middle", () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={10}
          onPageChange={mockOnPageChange}
          maxButtons={5}
        />
      );

      // Should show pages 3, 4, 5, 6, 7 (centered on 5)
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
      expect(screen.queryByText("8")).not.toBeInTheDocument();
    });

    it("should adjust window when near the start", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={10}
          onPageChange={mockOnPageChange}
          maxButtons={5}
        />
      );

      // Should show pages 1, 2, 3, 4, 5
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.queryByText("6")).not.toBeInTheDocument();
    });

    it("should adjust window when near the end", () => {
      render(
        <Pagination
          currentPage={9}
          totalPages={10}
          onPageChange={mockOnPageChange}
          maxButtons={5}
        />
      );

      // Should show pages 6, 7, 8, 9, 10
      expect(screen.getByText("6")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    it("should show all pages when totalPages <= maxButtons", () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
          maxButtons={5}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle 2 total pages", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should handle very large page numbers", () => {
      render(
        <Pagination
          currentPage={100}
          totalPages={200}
          onPageChange={mockOnPageChange}
          maxButtons={5}
        />
      );

      // Should show pages 98, 99, 100, 101, 102
      expect(screen.getByText("98")).toBeInTheDocument();
      expect(screen.getByText("102")).toBeInTheDocument();
    });

    it("should handle maxButtons of 1", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
          maxButtons={1}
        />
      );

      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.queryByText("2")).not.toBeInTheDocument();
      expect(screen.queryByText("4")).not.toBeInTheDocument();
    });

    it("should handle last page correctly", () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextBtn = screen.getByLabelText("Next page");
      const prevBtn = screen.getByLabelText("Previous page");

      expect(nextBtn).toBeDisabled();
      expect(prevBtn).not.toBeDisabled();
    });

    it("should handle first page correctly", () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextBtn = screen.getByLabelText("Next page");
      const prevBtn = screen.getByLabelText("Previous page");

      expect(prevBtn).toBeDisabled();
      expect(nextBtn).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-current on current page", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageBtn = screen.getByText("3");
      expect(currentPageBtn).toHaveAttribute("aria-current", "page");
    });

    it("should not have aria-current on non-current pages", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const page2Btn = screen.getByText("2");
      expect(page2Btn).not.toHaveAttribute("aria-current");
    });

    it("should have proper aria-labels on navigation buttons", () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    });
  });
});
