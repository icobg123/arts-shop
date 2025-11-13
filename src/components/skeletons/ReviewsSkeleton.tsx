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
        <div className="skeleton h-8 w-64 bg-base-300"></div>

        {/* Review Summary skeleton */}
        <div className="card bg-base-100 shadow-md p-6">
          <div className="flex items-start gap-8">
            {/* Average rating */}
            <div className="text-center">
              <div className="skeleton h-16 w-16 bg-base-300 mb-2"></div>
              <div className="skeleton h-6 w-24 bg-base-300 mb-1"></div>
              <div className="skeleton h-4 w-20 bg-base-300"></div>
            </div>

            {/* Rating breakdown */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="skeleton h-4 w-12 bg-base-300"></div>
                  <div className="skeleton h-2 flex-1 bg-base-300"></div>
                  <div className="skeleton h-4 w-8 bg-base-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual reviews skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-100 shadow-sm p-4 space-y-3">
              {/* Reviewer info */}
              <div className="flex items-center gap-3">
                <div className="skeleton h-10 w-10 rounded-full bg-base-300"></div>
                <div className="flex-1">
                  <div className="skeleton h-4 w-32 bg-base-300 mb-2"></div>
                  <div className="skeleton h-3 w-24 bg-base-300"></div>
                </div>
              </div>

              {/* Rating */}
              <div className="skeleton h-4 w-28 bg-base-300"></div>

              {/* Comment */}
              <div className="space-y-2">
                <div className="skeleton h-4 w-full bg-base-300"></div>
                <div className="skeleton h-4 w-5/6 bg-base-300"></div>
                <div className="skeleton h-4 w-4/6 bg-base-300"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ViewTransition>
  );
}
