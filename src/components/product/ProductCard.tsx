"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { ProductRating } from "./ProductRating";
import { getProductUrl } from "@/lib/api/products";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Product card component for grid and related products
 * Displays product thumbnail, title, rating, and price
 */
export function ProductCard({ product, index = 99 }: ProductCardProps) {
  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, 1);

    // Show toast notification
    toast.success(`Added ${product.title} to cart!`);

    // Trigger cart icon animation
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  return (
    <ViewTransition>
      <article className="card bg-base-100 shadow-md transition-shadow hover:shadow-xl">
        <Link
          href={getProductUrl(product.category, product.id)}
          className="flex h-full flex-1 flex-col"
        >
          <ViewTransition name={`product-image-${product.id}-0`}>
            <figure className="relative aspect-square bg-base-200">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fetchPriority={
                  index !== 99 ? (index <= 11 ? "high" : "auto") : undefined
                }
                priority={index !== 99 ? index <= 11 : false}
                width={265}
                height={265}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              {hasDiscount && (
                <div className="absolute top-2 right-2 badge badge-error">
                  {product.discountPercentage.toFixed(0)}% OFF
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 badge badge-neutral">
                  Out of Stock
                </div>
              )}
            </figure>
          </ViewTransition>
          <div className="card-body flex-1">
            <ViewTransition name={`product-title-${product.id}`}>
              <h3 className="card-title line-clamp-2 text-base">
                {product.title}
              </h3>
            </ViewTransition>
            <ViewTransition name={`product-rating-${product.id}`}>
              <ProductRating
                rating={product.rating}
                reviewCount={product.reviews?.length || 0}
                size="sm"
              />
            </ViewTransition>
            <ViewTransition name={`product-description-${product.id}`}>
              <p className="line-clamp-2 text-sm text-base-content/60">
                {product.description}
              </p>
            </ViewTransition>
            <ViewTransition name={`product-price-${product.id}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-base-content/60 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </ViewTransition>
            {product.brand && (
              <ViewTransition name={`product-brand-${product.id}`}>
                <div className="badge badge-sm badge-secondary">
                  {product.brand}
                </div>
              </ViewTransition>
            )}
            <div className="mt-auto card-actions justify-end">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn w-full gap-2 btn-sm btn-primary"
                aria-label={`Add ${product.title} to cart`}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </Link>
      </article>
    </ViewTransition>
  );
}
