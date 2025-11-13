/**
 * Loading skeleton for product detail page
 */
export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="skeleton h-4 w-64 mb-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Skeletons */}
        <div className="space-y-4">
          {/* Main Image Skeleton */}
          <div className="skeleton aspect-square w-full rounded-lg"></div>

          {/* Thumbnail Gallery Skeleton */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton aspect-square w-full rounded"></div>
            ))}
          </div>
        </div>

        {/* Right Column - Info Skeletons */}
        <div className="space-y-6">
          {/* Brand skeleton */}
          <div className="skeleton h-6 w-20"></div>

          {/* Title skeleton */}
          <div className="skeleton h-10 w-3/4"></div>

          {/* Rating skeleton */}
          <div className="skeleton h-6 w-40"></div>

          {/* Price skeleton */}
          <div className="space-y-2">
            <div className="skeleton h-8 w-32"></div>
            <div className="skeleton h-4 w-24"></div>
          </div>

          {/* Stock skeleton */}
          <div className="skeleton h-6 w-40"></div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="skeleton h-6 w-32"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-2/3"></div>
          </div>

          <div className="divider"></div>

          {/* Details skeleton */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-4 w-32"></div>
              </div>
            ))}
          </div>

          <div className="divider"></div>

          {/* Accordion skeletons */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-lg"></div>
            ))}
          </div>

          {/* Button skeleton */}
          <div className="skeleton h-14 w-full rounded-lg"></div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="mt-12">
        <div className="skeleton h-8 w-48 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32 w-full rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
