import { Suspense, unstable_ViewTransition as ViewTransition } from "react";
import { ProductsContent } from "@/components/products/ProductsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products - Browse Our Complete Collection",
  description:
    "Explore our complete product catalog. Filter by category, search for specific items, and discover great deals.",
};

export default function ProductsPage() {
  return (
    <ViewTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-base-content/70">
            Browse our complete collection of products
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-8">
              <div className="skeleton h-12 w-full"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton h-96 w-full"></div>
                ))}
              </div>
            </div>
          }
        >
          <ProductsContent />
        </Suspense>
      </div>
    </ViewTransition>
  );
}
