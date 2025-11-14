import { unstable_ViewTransition as ViewTransition } from "react";
import { ProductsContent } from "@/components/products/ProductsContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Metadata } from "next";
import { productsSearchParamsCache } from "@/lib/searchParams/products";
import type { SearchParams } from "nuqs/server";
import { getProducts, getCategories } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "All Products - Browse Our Complete Collection",
  description:
    "Explore our complete product catalog. Filter by category, search for specific items, and discover great deals.",
};

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
};

const PRODUCTS_PER_PAGE = 20;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse and cache search params on the server
  const params = await productsSearchParamsCache.parse(searchParams);

  // Fetch initial data on the server
  const skip = (params.page - 1) * PRODUCTS_PER_PAGE;
  const [productsResponse, categories] = await Promise.all([
    getProducts({
      limit: PRODUCTS_PER_PAGE,
      skip,
      search: params.search || undefined,
      category: params.category === "all" ? undefined : params.category,
      sortBy: params.sortBy || undefined,
      order: params.order as "asc" | "desc",
    }),
    getCategories(),
  ]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products" },
  ];

  return (
    <ViewTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-base-content/70">
            Browse our complete collection of products
          </p>
        </div>

        <ProductsContent
          initialProducts={productsResponse.products}
          initialTotal={productsResponse.total}
          initialCategories={categories}
        />
      </div>
    </ViewTransition>
  );
}
