"use client";

import { Search, XIcon, Tag, ArrowUpDown } from "lucide-react";

interface ProductFiltersProps {
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

export function ProductFilters({
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
}: ProductFiltersProps) {
  return (
    <div className="sticky top-24">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-lg ">Filters</h2>

          {/* Search Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <Search className="h-4 w-4 opacity-70 min-w-5" />
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
                  className="btn btn-ghost btn-xs btn-circle"
                  aria-label="Clear search"
                >
                  <XIcon className="h-4 w-4" />
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
              className="select select-bordered w-full"
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
              className="select select-bordered w-full"
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
              className="select select-bordered w-full"
              value={order}
              onChange={(e) => onOrderChange(e.target.value)}
              disabled={!sortBy}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Active Filters */}
          {(search || category !== "all" || sortBy) && (
            <div className="mb-1 p-3 bg-base-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-70">Active:</span>
                <button
                  onClick={onClearAll}
                  className="btn btn-ghost btn-xs"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {search && (
                  <div className="badge badge-primary gap-2 w-full justify-between">
                    <span className="flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      <span className="truncate">{search}</span>
                    </span>
                    <button
                      onClick={() => onSearchChange("")}
                      className="btn btn-ghost btn-xs bg-transparent"
                      aria-label="Clear search filter"
                    >
                      <XIcon className="h-2 w-2" />
                    </button>
                  </div>
                )}
                {category !== "all" && (
                  <div className="badge badge-secondary gap-2 w-full justify-between">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span className="truncate">
                        {category
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                    </span>
                    <button
                      onClick={() => onCategoryChange("all")}
                      className="btn btn-ghost btn-xs bg-transparent"
                      aria-label="Clear category filter"
                    >
                      <XIcon className="h-2 w-2" />
                    </button>
                  </div>
                )}
                {sortBy && (
                  <div className="badge badge-accent gap-2 w-full justify-between">
                    <span className="flex items-center gap-1">
                      <ArrowUpDown className="h-3 w-3" />
                      <span className="truncate">
                        {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} ({order})
                      </span>
                    </span>
                    <button
                      onClick={() => {
                        onSortByChange("");
                        onOrderChange("asc");
                      }}
                      className="btn btn-ghost btn-xs bg-transparent"
                      aria-label="Clear sort filter"
                    >
                      <XIcon className="h-2 w-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-base-300">
            <div className="stat p-0">
              <div className="stat-title text-xs">Total Products</div>
              <div className="stat-value text-2xl">

                {loading ? (
                  <div className="skeleton h-8 w-20"></div>
                ) : (
                  totalProducts
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
