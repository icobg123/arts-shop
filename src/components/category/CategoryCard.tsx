"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategoryUrl } from "@/lib/api/products";

interface CategoryCardProps {
  slug: string;
  name: string;
  featuredImage: string;
  productCount: number;
}

export function CategoryCard({
  slug,
  name,
  featuredImage,
  productCount,
}: CategoryCardProps) {
  return (
    <article className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
      <Link href={getCategoryUrl(slug)}>
        <ViewTransition name={`category-image-${slug}`}>
          <figure className="relative h-48 bg-base-200">
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-base-content/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>
            )}
          </figure>
        </ViewTransition>
        <div className="card-body">
          <ViewTransition name={`category-name-${slug}`}>
            <h2 className="card-title text-base">{name}</h2>
          </ViewTransition>
          <ViewTransition name={`category-count-${slug}`}>
            <p className="text-sm text-base-content/70">
              {productCount} {productCount === 1 ? "product" : "products"}
            </p>
          </ViewTransition>
        </div>
      </Link>
    </article>
  );
}
