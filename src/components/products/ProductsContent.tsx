"use client";

import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { useEffect, useState } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories, getProductUrl } from "@/lib/api/products";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import type { ProductListResponse } from "@/lib/schemas/product.schema";

const PRODUCTS_PER_PAGE = 20;

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

  const [products, setProducts] = useState<ProductListResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * PRODUCTS_PER_PAGE;

    getProducts({
      limit: PRODUCTS_PER_PAGE,
      skip,
      search: search || undefined,
      category: category === "all" ? undefined : category,
    })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const totalPages = products
    ? Math.ceil(products.total / PRODUCTS_PER_PAGE)
    : 1;

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
      {products && (
        <div className="text-sm text-base-content/70">
          Showing {products.products.length} of {products.total} products
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products && products.products.length > 0 ? (
        <ViewTransition>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.products.map((product) => (
            <Link
              key={product.id}
              href={getProductUrl(product.category, product.id)}
              className="group"
            >
              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <figure className="relative h-64 bg-base-200">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-base group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.discountPercentage > 0 && (
                        <p className="text-xs text-error">
                          {product.discountPercentage}% off
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-warning"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </ViewTransition>
      ) : (
        <ViewTransition>
          <div className="text-center py-12">
            <p className="text-lg text-base-content/70">No products found</p>
            <button
              onClick={() => setQuery({ search: "", category: "all", page: 1 })}
              className="btn btn-primary mt-4"
            >
              Clear Filters
            </button>
          </div>
        </ViewTransition>
      )}

      {/* Pagination */}
      {products && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn"
              disabled={page === 1}
              onClick={() => setQuery({ page: page - 1 })}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show first page, last page, current page, and 2 pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 2 && pageNum <= page + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`join-item btn ${page === pageNum ? "btn-active" : ""}`}
                    onClick={() => setQuery({ page: pageNum })}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === page - 3 || pageNum === page + 3) {
                return (
                  <button key={pageNum} className="join-item btn btn-disabled">
                    ...
                  </button>
                );
              }
              return null;
            })}
            <button
              className="join-item btn"
              disabled={page === totalPages}
              onClick={() => setQuery({ page: page + 1 })}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
