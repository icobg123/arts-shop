import { use, Suspense } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  category: string;
  excludeId: number;
}

/**
 * Fetch related products from the same category
 */
async function fetchRelatedProducts(
  category: string,
  excludeId: number
): Promise<Product[]> {
  const response = await fetch(
    `https://dummyjson.com/products/category/${category}?limit=6`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch related products");
  }

  const data = await response.json();
  return data.products.filter((p: Product) => p.id !== excludeId);
}

/**
 * Related products content using React 19 use() hook
 * This component unwraps the Promise automatically
 */
function RelatedProductsContent({
  category,
  excludeId,
}: RelatedProductsProps) {
  // React 19 feature: use() unwraps the Promise!
  const products = use(fetchRelatedProducts(category, excludeId));

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/60">
        No related products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * Related products skeleton loader
 */
function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-md">
          <div className="skeleton aspect-square w-full"></div>
          <div className="card-body gap-2">
            <div className="skeleton h-3 w-16"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-3 w-20"></div>
            <div className="skeleton h-6 w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Related Products section component
 * Uses React 19 Suspense with use() hook for clean async data handling
 */
export function RelatedProducts({ category, excludeId }: RelatedProductsProps) {
  return (
    <section
      aria-labelledby="related-products-heading"
      className="mt-16"
    >
      <h2 id="related-products-heading" className="text-2xl font-bold mb-6">
        You May Also Like
      </h2>
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProductsContent category={category} excludeId={excludeId} />
      </Suspense>
    </section>
  );
}
