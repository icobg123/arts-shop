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

  // Mock helpful count based on review rating (for demo purposes)
  const helpfulCount = Math.floor(review.rating * 3 + Math.random() * 10);

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
          <div className="badge badge-success badge-sm gap-1">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Verified Purchase</span>
          </div>
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

        <footer className="mt-4 pt-4 border-t border-base-300">
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span>{helpfulCount} people found this helpful</span>
          </div>
        </footer>
      </div>
    </article>
  );
}
