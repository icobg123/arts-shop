import { cn } from "@/lib/utils/cn";

interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showReviewCount?: boolean;
}

/**
 * Accessible product rating display component
 * Uses ARIA labels for screen reader support
 */
export function ProductRating({
  rating,
  reviewCount = 0,
  size = "sm",
  showReviewCount = true,
}: ProductRatingProps) {
  const roundedRating = Math.round(rating);
  const ratingText = `${rating.toFixed(1)} out of 5 stars`;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rating",
          size === "sm" && "rating-sm",
          size === "md" && "rating-md",
          size === "lg" && "rating-lg"
        )}
        role="img"
        aria-label={ratingText}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={cn(
              "mask mask-star-2",
              star <= roundedRating ? "bg-orange-400" : "bg-base-300"
            )}
            aria-label={`${star} star`}
            aria-current={star === roundedRating ? "true" : undefined}
          />
        ))}
      </div>
      {showReviewCount && (
        <span className="text-sm" aria-label={`${reviewCount} reviews`}>
          {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
