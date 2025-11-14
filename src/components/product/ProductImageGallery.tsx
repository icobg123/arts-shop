"use client";

import Image from "next/image";
import {
  unstable_ViewTransition as ViewTransition,
  useEffect,
  useState,
} from "react";

interface ProductImageGalleryProps {
  title: string;
  thumbnail: string;
  images?: string[];
  productId?: number;
}

/**
 * Accessible product image gallery component with carousel
 * Features keyboard navigation, screen reader support, and prev/next buttons
 */
export function ProductImageGallery({
  title,
  thumbnail,
  images,
  productId,
}: ProductImageGalleryProps) {
  const allImages = images && images.length > 0 ? images : [thumbnail];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Track hash changes to update current slide
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/slide(\d+)/);
      if (match) {
        const slideIndex = parseInt(match[1]) - 1;
        if (slideIndex >= 0 && slideIndex < allImages.length) {
          setCurrentSlide(slideIndex);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [allImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Use history.replaceState to avoid scrolling behavior
    const newHash = `#slide${index + 1}`;
    history.replaceState(null, "", newHash);

    // Manually scroll the carousel to the target slide
    const targetSlide = document.getElementById(`slide${index + 1}`);
    if (targetSlide) {
      targetSlide.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  const prevSlide = () => {
    const prevIndex =
      currentSlide === 0 ? allImages.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
  };

  const nextSlide = () => {
    const nextIndex =
      currentSlide === allImages.length - 1 ? 0 : currentSlide + 1;
    goToSlide(nextIndex);
  };

  return (
    <ViewTransition>
      <section aria-label="Product images" className="space-y-4">
        {/* Carousel */}
        <div className="carousel aspect-square w-full overflow-hidden rounded-lg bg-base-200">
          {allImages.map((image, index) => (
            <div
              key={index}
              id={`slide${index + 1}`}
              className="relative carousel-item w-full"
            >
              {productId ? (
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  priority
                  fetchPriority="high"
                  quality={90}
                  width={800}
                  height={800}
                  className="object-cover"
                  sizes="(max-width: 1023px) calc(100vw - 2rem), calc(50vw - 2rem)"
                />
              ) : (
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  priority
                  fetchPriority="high"
                  quality={90}
                  width={800}
                  height={800}
                  className="object-cover"
                  sizes="(max-width: 1023px) calc(100vw - 2rem), calc(50vw - 2rem)"
                />
              )}

              {/* Navigation Buttons - only show if multiple images */}
              {allImages.length > 1 && (
                <div className="absolute top-1/2 right-5 left-5 flex -translate-y-1/2 transform justify-between">
                  <button
                    onClick={prevSlide}
                    className="btn btn-circle"
                    aria-label="Previous image"
                  >
                    ❮
                  </button>
                  <button
                    onClick={nextSlide}
                    className="btn btn-circle"
                    aria-label="Next image"
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div
            role="group"
            aria-label="Product image thumbnails"
            className="grid grid-cols-4 gap-2"
          >
            {allImages.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToSlide(index);
                  }
                }}
                className={`relative aspect-square overflow-hidden rounded border-2 bg-base-200 transition-colors ${
                  currentSlide === index
                    ? "border-primary"
                    : "border-transparent hover:border-base-300"
                }`}
                aria-label={`View image ${index + 1} of ${allImages.length}`}
                aria-pressed={currentSlide === index}
              >
                <Image
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  fetchPriority="high"
                  width={175}
                  height={175}
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 12.5vw"
                />
              </button>
            ))}
          </div>
        )}
      </section>
    </ViewTransition>
  );
}
