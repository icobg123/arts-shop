import Link from "next/link";

interface ProductDetailsProps {
  category: string;
  sku: string;
  brand?: string;
  weight: number;
  minimumOrderQuantity: number;
}

/**
 * Product specifications component using semantic description list
 * Provides accessible key-value pairs for product metadata
 */
export function ProductDetails({
  category,
  sku,
  brand,
  weight,
  minimumOrderQuantity,
}: ProductDetailsProps) {
  const capitalizedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <section aria-labelledby="product-details-heading">
      <h2 id="product-details-heading" className="sr-only">
        Product Details
      </h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-base-content/60">Category</dt>
          <dd className="font-medium"><Link href={`/categories/${category}`}>{capitalizedCategory}</Link></dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-base-content/60">SKU</dt>
          <dd className="font-medium">{sku}</dd>
        </div>
        {brand && (
          <div className="flex justify-between">
            <dt className="text-base-content/60">Brand</dt>
            <dd className="font-medium">{brand}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-base-content/60">Weight</dt>
          <dd className="font-medium">{weight} kg</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-base-content/60">Min. Order</dt>
          <dd className="font-medium">{minimumOrderQuantity} units</dd>
        </div>
      </dl>
    </section>
  );
}
