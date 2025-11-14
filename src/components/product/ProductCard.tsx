"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { ProductRating } from "./ProductRating";
import { getProductUrl } from "@/lib/api/products";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

/**
 * Product card component for grid and related products
 * Displays product thumbnail, title, rating, and price
 */
export function ProductCard({ product }: ProductCardProps) {
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
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        <span>Added to cart!</span>
      </div>,
      {
        duration: 2000,
        position: "top-right",
      }
    );

    // Trigger cart icon animation
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  return (
    <ViewTransition>
    <article className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow ">
      <Link href={getProductUrl(product.category, product.id)} className="flex-1 h-full flex flex-col">
          <ViewTransition name={`product-image-${product.id}`}>
            <figure className="relative aspect-square bg-base-200">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {hasDiscount && (
              <div className="badge badge-error absolute top-2 right-2">
                {product.discountPercentage.toFixed(0)}% OFF
              </div>
            )}
            {product.stock === 0 && (
              <div className="badge badge-neutral absolute top-2 left-2">
                Out of Stock
              </div>
            )}
          </figure>
        </ViewTransition>
        <div className="card-body flex-1">
          <ViewTransition name={`product-title-${product.id}`}>
            <h3 className="card-title text-base line-clamp-2">{product.title}</h3>
          </ViewTransition>
          <ViewTransition name={`product-rating-${product.id}`}>
            <ProductRating
              rating={product.rating}
              reviewCount={product.reviews?.length || 0}
              size="sm"
            />
          </ViewTransition>
          <ViewTransition name={`product-description-${product.id}`}>
            <p className="text-sm text-base-content/60 line-clamp-2">
              {product.description}
            </p>
          </ViewTransition>
          <ViewTransition name={`product-price-${product.id}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-sm text-base-content/60 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </ViewTransition>
          {product.brand && (
            <ViewTransition name={`product-brand-${product.id}`}>
              <div className="badge badge-secondary badge-sm">{product.brand}</div>
            </ViewTransition>
          )}
          <div className="card-actions justify-end mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary btn-sm w-full gap-2"
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
