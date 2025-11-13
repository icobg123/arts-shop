"use client";

import { unstable_ViewTransition as ViewTransition } from "react";

/**
 * Skeleton loading state for related products section
 * Wrapped with ViewTransition for smooth fade in/out
 */
export function RelatedProductsSkeleton() {
  return (
    <ViewTransition>
      <section aria-label="Related products loading" className="mt-12">
        {/* Section heading */}
        <div className="skeleton h-8 w-64 bg-base-300 mb-6"></div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card bg-base-100 shadow-md">
              {/* Image skeleton */}
              <div className="aspect-square skeleton bg-base-300"></div>

              {/* Card body skeleton */}
              <div className="card-body gap-3">
                {/* Brand badge */}
                <div className="skeleton h-5 w-20 bg-base-300"></div>

                {/* Title */}
                <div className="skeleton h-5 w-full bg-base-300"></div>
                <div className="skeleton h-5 w-3/4 bg-base-300"></div>

                {/* Rating */}
                <div className="skeleton h-4 w-28 bg-base-300"></div>

                {/* Price */}
                <div className="skeleton h-6 w-24 bg-base-300"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ViewTransition>
  );
}
