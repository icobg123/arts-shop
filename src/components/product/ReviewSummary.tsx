import { Review } from "@/types/product";
import { ProductRating } from "./ProductRating";
import { ListStartIcon, Star } from "lucide-react";

interface ReviewSummaryProps {
  reviews: Review[];
  averageRating: number;
}

/**
 * Review summary card with rating breakdown bars
 * Shows distribution of ratings across 1-5 stars
 */
export function ReviewSummary({ reviews, averageRating }: ReviewSummaryProps) {
  const totalReviews = reviews.length;

  // Calculate rating distribution
  const ratingCounts = reviews.reduce(
    (acc, review) => {
      const rating = Math.floor(review.rating);
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: ratingCounts[rating] || 0,
    percentage:
      totalReviews > 0 ? ((ratingCounts[rating] || 0) / totalReviews) * 100 : 0,
  }));

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold">
              {averageRating.toFixed(1)}
            </div>
            <ProductRating rating={averageRating} showReviewCount={false} />
            <div className="mt-2 text-sm text-base-content/60">
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="w-full flex-1 space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div
                key={rating}
                className="flex items-center gap-2"
                role="group"
                aria-label={`${rating} stars: ${count} reviews, ${percentage.toFixed(0)}%`}
              >
                <div className="flex w-12 items-center gap-1">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 fill-current text-orange-400" />{" "}
                </div>
                <div className="flex-1">
                  <progress
                    className="progress h-3 progress-primary"
                    value={percentage}
                    max="100"
                    aria-label={`${percentage.toFixed(0)}% of reviews`}
                  ></progress>
                </div>
                <div className="w-16 text-right text-sm text-base-content/60">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
