import { Review } from "@/types/product";
import { ProductRating } from "./ProductRating";

interface ReviewCardProps {
  review: Review;
  index: number;
}

/**
 * Individual review card component using semantic article element
 * Includes accessible rating display, relative dates, verified badge, and helpful counter
 */
export function ReviewCard({ review, index }: ReviewCardProps) {
  // Format as relative date (e.g., "2 months ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  const relativeDate = getRelativeTime(review.date);

  return (
    <article className="card bg-base-200" aria-labelledby={`review-${index}-heading`}>
      <div className="card-body">
        <header className="flex items-center gap-3 flex-wrap">
          <ProductRating
            rating={review.rating}
            showReviewCount={false}
          />
          <h3 id={`review-${index}-heading`} className="font-medium">
            {review.reviewerName}
          </h3>
        </header>

        <time
          dateTime={review.date}
          className="text-sm text-base-content/60"
          title={new Date(review.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        >
          {relativeDate}
        </time>

        <p className="text-base-content/80 mt-2">{review.comment}</p>
      </div>
    </article>
  );
}
