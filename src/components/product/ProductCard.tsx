"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { ProductRating } from "./ProductRating";
import { getProductUrl } from "@/lib/api/products";
import Link from "next/link";

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

  return (
    <article className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
      <Link href={getProductUrl(product.category, product.id)}>
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
        <div className="card-body">
          {product.brand && (
            <ViewTransition name={`product-brand-${product.id}`}>
              <div className="badge badge-primary badge-sm">{product.brand}</div>
            </ViewTransition>
          )}
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
        </div>
      </Link>
    </article>
  );
}
