interface ProductPriceProps {
  price: number;
  discountPercentage?: number;
}

/**
 * Accessible product price component with discount display
 * Uses semantic HTML and proper ARIA labels
 */
export function ProductPrice({ price, discountPercentage = 0 }: ProductPriceProps) {
  const hasDiscount = discountPercentage > 0;
  const originalPrice = hasDiscount
    ? price / (1 - discountPercentage / 100)
    : price;

  return (
    <div className="space-y-0.5" role="region" aria-label="Pricing information">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold" aria-label={`Current price: $${price.toFixed(2)}`}>
          ${price.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="badge badge-error" aria-label={`${discountPercentage.toFixed(0)}% discount`}>
            {discountPercentage.toFixed(0)}% OFF
          </span>
        )}
      </div>
      {hasDiscount && (
        <p className="text-sm text-base-content/60 line-through">
          <span className="sr-only">Original price: </span>
          ${originalPrice.toFixed(2)}
        </p>
      )}
    </div>
  );
}
