"use client";

import { unstable_ViewTransition as ViewTransition } from "react";

interface ProductGridSkeletonProps {
  count?: number;
}

/**
 * Skeleton loading state for product grids
 * Wrapped with ViewTransition for smooth fade in/out
 */
export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <ViewTransition>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-md">
            {/* Image skeleton */}
            <div className="aspect-square skeleton bg-base-300"></div>

            {/* Card body skeleton */}
            <div className="card-body gap-3">
              {/* Brand badge */}
              <div className="h-5 w-20 skeleton bg-base-300"></div>

              {/* Title */}
              <div className="h-6 w-full skeleton bg-base-300"></div>
              <div className="h-6 w-3/4 skeleton bg-base-300"></div>

              {/* Rating */}
              <div className="h-4 w-32 skeleton bg-base-300"></div>

              {/* Price */}
              <div className="h-7 w-24 skeleton bg-base-300"></div>
            </div>
          </div>
        ))}
      </div>
    </ViewTransition>
  );
}
