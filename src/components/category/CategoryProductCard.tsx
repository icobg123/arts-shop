"use client";

import Link from "next/link";
import Image from "next/image";
import { getProductUrl } from "@/lib/api/products";

interface CategoryProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    thumbnail: string;
  };
  category: string;
}

export function CategoryProductCard({ product, category }: CategoryProductCardProps) {
  return (
    <Link
      href={getProductUrl(category, product.id)}
      className="group"
    >
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <figure className="relative h-64 bg-base-200">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ viewTransitionName: `product-image-${product.id}` }}
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
  );
}
