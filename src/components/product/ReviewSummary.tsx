import { Review } from "@/types/product";
import { ProductRating } from "./ProductRating";

interface ReviewSummaryProps {
  reviews: Review[];
  averageRating: number;
}

/**
 * Review summary card with rating breakdown bars
 * Shows distribution of ratings across 1-5 stars
 */
export function ReviewSummary({
  reviews,
  averageRating,
}: ReviewSummaryProps) {
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
    percentage: totalReviews > 0 ? ((ratingCounts[rating] || 0) / totalReviews) * 100 : 0,
  }));

  return (
    <div className="card bg-base-200">
      <div className="card-body">

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <ProductRating rating={averageRating} showReviewCount={false} />
            <div className="text-sm text-base-content/60 mt-2">
              Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 w-full space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div
                key={rating}
                className="flex items-center gap-2"
                role="group"
                aria-label={`${rating} stars: ${count} reviews, ${percentage.toFixed(0)}%`}
              >
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <svg
                    className="w-4 h-4 fill-current text-orange-400"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <progress
                    className="progress progress-primary h-3"
                    value={percentage}
                    max="100"
                    aria-label={`${percentage.toFixed(0)}% of reviews`}
                  ></progress>
                </div>
                <div className="text-sm text-base-content/60 w-16 text-right">
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
