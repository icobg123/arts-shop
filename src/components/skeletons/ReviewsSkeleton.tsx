"use client";

import { unstable_ViewTransition as ViewTransition } from "react";

/**
 * Skeleton loading state for reviews section
 * Wrapped with ViewTransition for smooth fade in/out
 */
export function ReviewsSkeleton() {
  return (
    <ViewTransition>
      <section aria-label="Reviews loading" className="mt-12 space-y-6">
        {/* Section heading */}
        <div className="h-8 w-64 skeleton bg-base-300"></div>

        {/* Review Summary skeleton */}
        <div className="card bg-base-100 p-6 shadow-md">
          <div className="flex items-start gap-8">
            {/* Average rating */}
            <div className="text-center">
              <div className="mb-2 h-16 w-16 skeleton bg-base-300"></div>
              <div className="mb-1 h-6 w-24 skeleton bg-base-300"></div>
              <div className="h-4 w-20 skeleton bg-base-300"></div>
            </div>

            {/* Rating breakdown */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="h-4 w-12 skeleton bg-base-300"></div>
                  <div className="h-2 flex-1 skeleton bg-base-300"></div>
                  <div className="h-4 w-8 skeleton bg-base-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual reviews skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card space-y-3 bg-base-100 p-4 shadow-sm">
              {/* Reviewer info */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 skeleton rounded-full bg-base-300"></div>
                <div className="flex-1">
                  <div className="mb-2 h-4 w-32 skeleton bg-base-300"></div>
                  <div className="h-3 w-24 skeleton bg-base-300"></div>
                </div>
              </div>

              {/* Rating */}
              <div className="h-4 w-28 skeleton bg-base-300"></div>

              {/* Comment */}
              <div className="space-y-2">
                <div className="h-4 w-full skeleton bg-base-300"></div>
                <div className="h-4 w-5/6 skeleton bg-base-300"></div>
                <div className="h-4 w-4/6 skeleton bg-base-300"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ViewTransition>
  );
}
