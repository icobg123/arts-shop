"use client";

import { useQueryStates } from "nuqs";
import { useEffect, useState, useDeferredValue, useMemo, startTransition, useRef } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import { getProducts, getCategories } from "@/lib/api/products";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import { ProductCard } from "@/components/product/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import type { Product } from "@/lib/schemas/product.schema";
import { productsSearchParams } from "@/lib/searchParams/products";
import { Search, XIcon } from "lucide-react";

const PRODUCTS_PER_PAGE = 20;

// ProductsList component with deferred filtering (matches the example pattern)
function ProductsList({
  searchText,
  products
}: {
  searchText: string;
  products: Product[];
}) {
  // Activate with useDeferredValue ("when")
  const deferredSearchText = useDeferredValue(searchText);

  // Memoize the filtering to avoid re-calculating on every render
  const filteredProducts = useMemo(
    () => filterProducts(products, deferredSearchText),
    [products, deferredSearchText]
  );

  return (
    <>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            // Animate each item in list ("what")
            <ViewTransition
              key={product.id}
              enter="slide-up"
              exit="slide-down"
            >
              <ProductCard product={product} />
            </ViewTransition>
          ))}
        </div>
      ) : (
        <ViewTransition
          enter="slide-up"
          exit="slide-down"
        >
          <div className="text-center py-12">
            <p className="text-lg text-base-content/70">No products found</p>
          </div>
        </ViewTransition>
      )}
    </>
  );
}

// Filter function - only handles search now (category is server-side)
function filterProducts(products: Product[], searchQuery: string) {
  // Early return if no search query
  if (!searchQuery) {
    return products;
  }

  const keywords = searchQuery.toLowerCase().split(" ").filter((s) => s !== "");

  if (keywords.length === 0) {
    return products;
  }

  return products.filter((product) => {
    const searchText = `${product.title} ${product.description}`.toLowerCase();
    return keywords.every((kw) => searchText.includes(kw));
  });
}

interface ProductsContentProps {
  initialProducts: Product[];
  initialTotal: number;
  initialCategories: string[];
}

export function ProductsContent({
  initialProducts,
  initialTotal,
  initialCategories,
}: ProductsContentProps) {
  const [{ search, category, page, sortBy, order }, setQuery] = useQueryStates(
    productsSearchParams
  );

  const [categoryProducts, setCategoryProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<string[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(initialTotal);

  // Track if this is the initial mount to avoid unnecessary fetch
  const isInitialMount = useRef(true);

  // Fetch products from server when category, page, or sorting changes (client-side navigation)
  useEffect(() => {
    // Skip fetch on initial mount since we have server data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setLoading(true);
    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    getProducts({
      limit: PRODUCTS_PER_PAGE,
      skip,
      category: category === "all" ? undefined : category,
      sortBy: sortBy || undefined,
      order: order as "asc" | "desc",
    })
      .then((response) => {
        startTransition(() => {
          setCategoryProducts(response.products);
          setTotalProducts(response.total);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        startTransition(() => {
          setCategoryProducts([]);
          setTotalProducts(0);
          setLoading(false);
        });
      });
  }, [category, page, sortBy, order]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="card-body p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <Search className="h-4 w-4 opacity-70 min-w-5"/>
                <input
                  type="text"
                  className="grow"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setQuery({ search: e.target.value, page: 1 });
                  }}
                />
                {search && (
                  <button
                    onClick={() => setQuery({ search: "", page: 1 })}
                    className="btn btn-ghost btn-xs btn-circle"
                    aria-label="Clear search"
                  >
                    <XIcon className="h-4 w-4"/>
                  </button>
                )}
                <span className="label">{loading?<span className="h-4 w-6 skeleton"></span>:totalProducts} {totalProducts === 1 ? "product" : "products"} available</span>
              </label>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="select select-bordered flex items-center gap-2 w-full">
                <span className="label opacity-70">Category</span>
                <select
                  className="grow"
                  value={category}
                  onChange={(e) => {
                    setQuery({ category: e.target.value, page: 1 });
                  }}
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
              </label>
            </div>

            {/* Sort By Filter */}
            <div className="flex flex-col gap-2">
              <label className="select select-bordered flex items-center gap-2 w-full">
                <span className="label opacity-70">Sort By</span>
                <select
                  className="grow"
                  value={sortBy}
                  onChange={(e) => {
                    setQuery({ sortBy: e.target.value, page: 1 });
                  }}
                >
                  <option value="">Default</option>
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="brand">Brand</option>
                </select>
              </label>
            </div>

            {/* Sort Order Filter */}
            <div className="flex flex-col gap-2">
              <label className="select select-bordered flex items-center gap-2 w-full">
                <span className="label opacity-70">Order</span>
                <select
                  className="grow"
                  value={order}
                  onChange={(e) => {
                    setQuery({ order: e.target.value, page: 1 });
                  }}
                  disabled={!sortBy}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </label>
            </div>
          </div>

          {/* Pagination Row */}
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setQuery({ page: newPage })}
            />
          </div>

          {/* Active Filters */}
          {(search || category !== "all" || sortBy) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {search && (
                <div className="badge badge-primary gap-2">
                  Search: {search}
                  <button
                    onClick={() => setQuery({ search: "" })}
                    className="btn btn-ghost btn-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
              {category !== "all" && (
                <div className="badge badge-secondary gap-2">
                  Category:{" "}
                  {category
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  <button
                    onClick={() => setQuery({ category: "all" })}
                    className="btn btn-ghost btn-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
              {sortBy && (
                <div className="badge badge-accent gap-2">
                  Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} ({order})
                  <button
                    onClick={() => setQuery({ sortBy: "", order: "asc" })}
                    className="btn btn-ghost btn-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
              <button
                onClick={() => setQuery({ search: "", category: "all", sortBy: "", order: "asc", page: 1 })}
                className="btn btn-ghost btn-xs"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="text-sm text-base-content/70">
          Showing {categoryProducts.length} of {totalProducts} products
          {search && " (filtered by search)"}
        </div>
      )}

      {/* Products Grid */}
      <ViewTransition
        enter="slide-up"
        exit="slide-down"
      >
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <ProductsList
            searchText={search}
            products={categoryProducts}
          />
        )}
      </ViewTransition>

      {/* Pagination */}
      {!loading && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setQuery({ page: newPage })}
          />
        </div>
      )}
    </div>
  );
}
