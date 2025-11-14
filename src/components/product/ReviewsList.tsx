"use client";

import { useMemo, useState } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Review } from "@/types/product";
import { ReviewCard } from "./ReviewCard";

interface ReviewsListProps {
  reviews: Review[];
}

type SortOption = "recent" | "highest" | "lowest";
type RatingFilterValue = "all" | "1" | "2" | "3" | "4" | "5";

/**
 * Reviews list component with filtering, sorting, and pagination
 * Shows 5 reviews at a time with "Show more" button
 */
export function ReviewsList({ reviews }: ReviewsListProps) {
  const [sortBy, setSortBy] = useQueryState(
    "sort",
    parseAsStringLiteral(["recent", "highest", "lowest"] as const).withDefault(
      "recent"
    )
  );

  const [filterRating, setFilterRating] = useQueryState(
    "rating",
    parseAsStringLiteral(["all", "1", "2", "3", "4", "5"] as const).withDefault(
      "all"
    )
  );

  const [visibleCount, setVisibleCount] = useState(5);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Apply rating filter
    if (filterRating !== "all") {
      const targetRating = parseInt(filterRating);
      filtered = filtered.filter(
        (review) => Math.floor(review.rating) === targetRating
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return sorted;
  }, [reviews, sortBy, filterRating]);

  const visibleReviews = filteredAndSortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedReviews.length;

  const handleShowMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 5, filteredAndSortedReviews.length)
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {/* Sort Dropdown */}

        <label htmlFor="sort-reviews" className="select">
          <span className="label">Sort by</span>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </label>

        {/* Rating Filter */}

        <label htmlFor="filter-reviews" className="select">
          <span className="label">Filter by rating</span>

          <select
            id="filter-reviews"
            value={filterRating}
            onChange={(e) => {
              setFilterRating(e.target.value as RatingFilterValue);
            }}
            className=""
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </label>
      </div>

      {/* Results count */}
      {/*<div className="text-sm text-base-content/60">
        Showing {visibleReviews.length} of {filteredAndSortedReviews.length} reviews
        {filterRating !== "all" && ` with ${filterRating} stars`}
      </div>*/}

      {/* Reviews List */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-info"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>No reviews match your filter criteria.</span>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {visibleReviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="pt-4 text-center">
              <button
                onClick={handleShowMore}
                className="btn btn-wide btn-outline"
              >
                Show More Reviews
                <span className="badge badge-sm">
                  +{Math.min(5, filteredAndSortedReviews.length - visibleCount)}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
