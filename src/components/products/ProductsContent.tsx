"use client";

import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { useEffect, useState, useDeferredValue, useMemo } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import { getProducts, getCategories } from "@/lib/api/products";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/schemas/product.schema";

const PRODUCTS_PER_PAGE = 20;

// ProductsList component with deferred filtering (matches the example pattern)
function ProductsList({
  searchText,
  category,
  products
}: {
  searchText: string;
  category: string;
  products: Product[];
}) {
  // Activate with useDeferredValue ("when")
  const deferredSearchText = useDeferredValue(searchText);
  const deferredCategory = useDeferredValue(category);

  // Memoize the filtering to avoid re-calculating on every render
  const filteredProducts = useMemo(
    () => filterProducts(products, deferredSearchText, deferredCategory),
    [products, deferredSearchText, deferredCategory]
  );

  return (
    <>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            // Animate each item in list ("what")
            <ViewTransition key={product.id}>
              <ProductCard product={product} />
            </ViewTransition>
          ))}
        </div>
      ) : (
        <ViewTransition>
          <div className="text-center py-12">
            <p className="text-lg text-base-content/70">No products found</p>
          </div>
        </ViewTransition>
      )}
    </>
  );
}

// Filter function (similar to filterVideos in the example)
function filterProducts(products: Product[], searchQuery: string, categoryFilter: string) {
  // Early return if no filters
  if (!searchQuery && categoryFilter === "all") {
    return products;
  }

  const keywords = searchQuery
    ? searchQuery.toLowerCase().split(" ").filter((s) => s !== "")
    : [];

  return products.filter((product) => {
    // Category filter
    if (categoryFilter !== "all" && product.category !== categoryFilter) {
      return false;
    }

    // Search filter
    if (keywords.length > 0) {
      const searchText = `${product.title} ${product.description}`.toLowerCase();
      return keywords.every((kw) => searchText.includes(kw));
    }

    return true;
  });
}

export function ProductsContent() {
  const [{ search, category, page }, setQuery] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      category: parseAsString.withDefault("all"),
      page: parseAsInteger.withDefault(1),
    },
    {
      history: "push",
    }
  );

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products on mount (we'll filter client-side)
  useEffect(() => {
    Promise.all([
      getProducts({ limit: 100 }), // Fetch more products for client-side filtering
      getCategories()
    ]).then(([productsResponse, categoriesData]) => {
      setAllProducts(productsResponse.products);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Search Products</span>
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                className="input input-bordered w-full"
                value={search}
                onChange={(e) => {
                  setQuery({ search: e.target.value, page: 1 });
                }}
              />
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                className="select select-bordered w-full"
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
            </div>
          </div>

          {/* Active Filters */}
          {(search || category !== "all") && (
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
              <button
                onClick={() => setQuery({ search: "", category: "all", page: 1 })}
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
          {allProducts.length} products available
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <ProductsList
          searchText={search}
          category={category}
          products={allProducts}
        />
      )}
    </div>
  );
}
