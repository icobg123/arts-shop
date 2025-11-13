"use client";

import { useState, useMemo } from "react";
import { Review } from "@/types/product";
import { ReviewCard } from "./ReviewCard";

interface ReviewsListProps {
  reviews: Review[];
}

type SortOption = "recent" | "highest" | "lowest";
type RatingFilter = "all" | 1 | 2 | 3 | 4 | 5;

/**
 * Reviews list component with filtering, sorting, and pagination
 * Shows 5 reviews at a time with "Show more" button
 */
export function ReviewsList({ reviews }: ReviewsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterRating, setFilterRating] = useState<RatingFilter>("all");
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Apply rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter((review) =>
        Math.floor(review.rating) === filterRating
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
    setVisibleCount((prev) => Math.min(prev + 5, filteredAndSortedReviews.length));
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Sort Dropdown */}
        <div className="form-control w-full sm:w-auto">
          <label htmlFor="sort-reviews" className="label">
            <span className="label-text">Sort by</span>
          </label>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="select select-bordered w-full sm:w-auto"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="form-control w-full sm:w-auto">
          <label htmlFor="filter-reviews" className="label">
            <span className="label-text">Filter by rating</span>
          </label>
          <select
            id="filter-reviews"
            value={filterRating}
            onChange={(e) => {
              const value = e.target.value;
              setFilterRating(value === "all" ? "all" : parseInt(value) as RatingFilter);
              setVisibleCount(5); // Reset pagination on filter change
            }}
            className="select select-bordered w-full sm:w-auto"
          >
            <option value="all">All Stars</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-base-content/60">
        Showing {visibleReviews.length} of {filteredAndSortedReviews.length} reviews
        {filterRating !== "all" && ` with ${filterRating} stars`}
      </div>

      {/* Reviews List */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
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
            <div className="text-center pt-4">
              <button
                onClick={handleShowMore}
                className="btn btn-outline btn-wide"
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
