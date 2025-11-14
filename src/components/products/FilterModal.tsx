"use client";

import { X } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  search: string;
  category: string;
  sortBy: string;
  order: string;
  categories: string[];
  totalProducts: number;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onOrderChange: (value: string) => void;
  onClearAll: () => void;
}

export function FilterModal({
  isOpen,
  onClose,
  search,
  category,
  sortBy,
  order,
  categories,
  totalProducts,
  loading,
  onSearchChange,
  onCategoryChange,
  onSortByChange,
  onOrderChange,
  onClearAll,
}: FilterModalProps) {
  return (
    <dialog
      id="filter_modal"
      className="modal z-[60] modal-bottom sm:modal-middle"
      open={isOpen}
    >
      <div className="z-[60] modal-box max-w-lg">
        {/* Modal Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Filters</h3>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Content - Remove sticky positioning and card wrapper */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search</span>
            </label>
            <label className="input-bordered input flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 min-w-5 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Search products..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => onSearchChange("")}
                  className="btn btn-circle btn-ghost btn-xs"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>

          {/* Category Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select-bordered select w-full"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Sort By</span>
            </label>
            <select
              className="select-bordered select w-full"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <option value="">Default</option>
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="brand">Brand</option>
            </select>
          </div>

          {/* Sort Order Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Order</span>
            </label>
            <select
              className="select-bordered select w-full"
              value={order}
              onChange={(e) => onOrderChange(e.target.value)}
              disabled={!sortBy}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Active Filters Section */}
          {(search || category !== "all" || sortBy) && (
            <div className="rounded-lg bg-base-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold opacity-70">
                  Active:
                </span>
                <button onClick={onClearAll} className="btn btn-ghost btn-xs">
                  Clear All
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {search && (
                  <div className="badge w-full justify-between gap-2 badge-primary">
                    <span className="truncate">{search}</span>
                    <button
                      onClick={() => onSearchChange("")}
                      className="btn bg-transparent btn-ghost btn-xs"
                      aria-label="Clear search filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {category !== "all" && (
                  <div className="badge w-full justify-between gap-2 badge-secondary">
                    <span className="truncate">
                      {category
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                    <button
                      onClick={() => onCategoryChange("all")}
                      className="btn bg-transparent btn-ghost btn-xs"
                      aria-label="Clear category filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {sortBy && (
                  <div className="badge w-full justify-between gap-2 badge-accent">
                    <span className="truncate">
                      {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} (
                      {order})
                    </span>
                    <button
                      onClick={() => {
                        onSortByChange("");
                        onOrderChange("asc");
                      }}
                      className="btn bg-transparent btn-ghost btn-xs"
                      aria-label="Clear sort filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="border-t border-base-300 pt-4">
            <div className="stat p-0">
              <div className="stat-title text-xs">Total Products</div>
              <div className="stat-value text-2xl">
                {loading ? (
                  <div className="h-8 w-20 skeleton"></div>
                ) : (
                  totalProducts
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <form method="dialog" className="modal-backdrop z-[55]">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
