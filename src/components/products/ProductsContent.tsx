"use client";

import { useQueryStates } from "nuqs";
import { useEffect, useState, useDeferredValue, useMemo, startTransition, useRef } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import { getProducts, getCategories } from "@/lib/api/products";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import { ProductCard } from "@/components/product/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { ProductFilters } from "@/components/products/ProductFilters";
import type { Product } from "@/lib/schemas/product.schema";
import { productsSearchParams } from "@/lib/searchParams/products";

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1">
        <ProductFilters
          search={search}
          category={category}
          sortBy={sortBy}
          order={order}
          categories={categories}
          totalProducts={totalProducts}
          loading={loading}
          onSearchChange={(value) => setQuery({ search: value, page: 1 })}
          onCategoryChange={(value) => setQuery({ category: value, page: 1 })}
          onSortByChange={(value) => setQuery({ sortBy: value, page: 1 })}
          onOrderChange={(value) => setQuery({ order: value, page: 1 })}
          onClearAll={() => setQuery({ search: "", category: "all", sortBy: "", order: "asc", page: 1 })}
        />
      </aside>

      {/* Main Content */}
      <main className="lg:col-span-3">
        <div className="space-y-6">
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
          {!loading && totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setQuery({ page: newPage })}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
