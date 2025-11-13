"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  title: string;
  thumbnail: string;
  images?: string[];
}

/**
 * Accessible product image gallery component
 * Features keyboard navigation and screen reader support
 */
export function ProductImageGallery({
  title,
  thumbnail,
  images,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(thumbnail);
  const allImages = images && images.length > 0 ? images : [thumbnail];

  return (
    <section aria-label="Product images" className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative bg-base-200 rounded-lg overflow-hidden">
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
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
              onClick={() => setSelectedImage(image)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedImage(image);
                }
              }}
              className={`aspect-square relative bg-base-200 rounded overflow-hidden border-2 transition-colors ${
                selectedImage === image
                  ? "border-primary"
                  : "border-transparent hover:border-base-300"
              }`}
              aria-label={`View image ${index + 1} of ${allImages.length}`}
              aria-pressed={selectedImage === image}
            >
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
