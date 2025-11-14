"use client";

import { useQueryStates } from "nuqs";
import {
  startTransition,
  unstable_ViewTransition as ViewTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import { SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { ProductFilters } from "@/components/products/ProductFilters";
import { FilterModal } from "@/components/products/FilterModal";
import type { Product } from "@/lib/schemas/product.schema";
import { productsSearchParams } from "@/lib/searchParams/products";

const PRODUCTS_PER_PAGE = 20;

// ProductsList component - now displays server-filtered products
function ProductsList({ products }: { products: Product[] }) {
  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            // Animate each item in list ("what")
            <ViewTransition key={product.id} enter="slide-up" exit="slide-down">
              <ProductCard product={product} index={index} />
            </ViewTransition>
          ))}
        </div>
      ) : (
        <ViewTransition enter="slide-up" exit="slide-down">
          <div className="py-12 text-center">
            <p className="text-lg text-base-content/70">No products found</p>
          </div>
        </ViewTransition>
      )}
    </>
  );
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
  const [{ search, category, page, sortBy, order }, setQuery] =
    useQueryStates(productsSearchParams);

  const [categoryProducts, setCategoryProducts] =
    useState<Product[]>(initialProducts);
  const [categories] = useState<string[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(initialTotal);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Local search state for immediate UI updates (debounced before updating URL)
  const [searchInput, setSearchInput] = useState(search);

  // Track if this is the initial mount to avoid unnecessary fetch
  const isInitialMount = useRef(true);

  // Debounce search input - only update URL param after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setQuery({ search: searchInput, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, search, setQuery]);

  // Sync URL search param changes back to local state (for browser back/forward)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

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
      search: search || undefined,
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
  }, [category, page, sortBy, order, search]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Calculate active filter count for the badge
  const activeFilterCount =
    (searchInput ? 1 : 0) + (category !== "all" ? 1 : 0) + (sortBy ? 1 : 0);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar Filters - Hidden on mobile */}
        <aside className="hidden lg:col-span-1 lg:block">
          <ProductFilters
            search={searchInput}
            category={category}
            sortBy={sortBy}
            order={order}
            categories={categories}
            totalProducts={totalProducts}
            loading={loading}
            onSearchChange={(value) => setSearchInput(value)}
            onCategoryChange={(value) => setQuery({ category: value, page: 1 })}
            onSortByChange={(value) => setQuery({ sortBy: value, page: 1 })}
            onOrderChange={(value) => setQuery({ order: value, page: 1 })}
            onClearAll={() => {
              setSearchInput("");
              setQuery({
                search: "",
                category: "all",
                sortBy: "",
                order: "asc",
                page: 1,
              });
            }}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="space-y-6">
            {/* Results Count */}
            {/*{!loading && (*/}
            {/*  <div className="text-sm text-base-content/70">*/}
            {/*    Showing {categoryProducts.length} of {totalProducts} products*/}
            {/*    {search && " (filtered by search)"}*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* Products Grid */}
            <ViewTransition enter="slide-up" exit="slide-down">
              <ProductsList products={categoryProducts} />
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

      {/* Mobile Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        search={searchInput}
        category={category}
        sortBy={sortBy}
        order={order}
        categories={categories}
        totalProducts={totalProducts}
        loading={loading}
        onSearchChange={(value) => setSearchInput(value)}
        onCategoryChange={(value) => setQuery({ category: value, page: 1 })}
        onSortByChange={(value) => setQuery({ sortBy: value, page: 1 })}
        onOrderChange={(value) => setQuery({ order: value, page: 1 })}
        onClearAll={() => {
          setSearchInput("");
          setQuery({
            search: "",
            category: "all",
            sortBy: "",
            order: "asc",
            page: 1,
          });
        }}
      />

      {/* Floating Action Button (FAB) for Mobile */}
      <button
        onClick={() => setIsFilterModalOpen(true)}
        className={`btn fixed right-6 bottom-6 btn-circle shadow-xl transition-all btn-lg btn-primary lg:hidden ${
          isFilterModalOpen ? "z-30" : "z-50"
        }`}
        aria-label="Open filters"
      >
        <div className="indicator">
          {activeFilterCount > 0 && (
            <span className="indicator-item badge badge-sm badge-secondary">
              {activeFilterCount}
            </span>
          )}
          <SlidersHorizontal className="h-6 w-6" />
        </div>
      </button>
    </>
  );
}
