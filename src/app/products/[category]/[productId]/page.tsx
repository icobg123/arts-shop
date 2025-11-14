import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProduct, getProducts } from "@/lib/api/products";
import {
  AddToCartForm,
  ProductBreadcrumb,
  ProductDetails,
  ProductImageGallery,
  ProductInfo,
  ProductPrice,
  ProductRating,
  RelatedProducts,
  ReviewsList,
  ReviewSummary
} from "@/components/product";
import { Suspense, unstable_ViewTransition as ViewTransition } from "react";
import { ReviewsSkeleton } from "@/components/skeletons/ReviewsSkeleton";
import { RelatedProductsSkeleton } from "@/components/skeletons/RelatedProductsSkeleton";

interface ProductPageProps {
  params: Promise<{
    category: string;
    productId: string;
  }>;
}

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;

  try {
    const product = await getProduct(parseInt(productId));

    return {
      title: `${product.title} - Arts Consolidated`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [
          {
            url: product.thumbnail,
            width: 800,
            height: 800,
            alt: product.title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
        images: [product.thumbnail],
      },
    };
  } catch {
    return {
      title: "Product Not Found - Arts Consolidated",
      description: "The requested product could not be found.",
    };
  }
}

export async function generateStaticParams() {
  const response = await getProducts({ limit: 0 });

  return response.products.map((product) => ({
    category: product.category,
    productId: product.id.toString(),
  }));
}

/**
 * Product detail page component (Server Component)
 * Handles data fetching and passes to client component
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { category, productId } = await params;
  let product;

  try {
    product = await getProduct(parseInt(productId));

    // Verify the category matches
    if (product.category !== category) {
      notFound();
    }
  } catch {
    notFound();
  }

  return <ViewTransition>
    <main className="container mx-auto px-4 py-8">
      <ProductBreadcrumb
        category={product.category}
        productTitle={product.title}
      />

      <article className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <ProductImageGallery
          title={product.title}
          thumbnail={product.thumbnail}
          images={product.images}
          productId={product.id}
        />

        {/* Right Column - Product Info */}
        <div className="space-y-4">
          <ViewTransition name={`product-title-${product.id}`}>
            <h1 className="text-4xl font-bold">{product.title}</h1>
          </ViewTransition>

          Rating
          <ViewTransition name={`product-rating-${product.id}`}>
            <ProductRating
              rating={product.rating}
              reviewCount={product.reviews?.length || 0}
            />
          </ViewTransition>

          Price
          <ViewTransition name={`product-price-${product.id}`}>
            <ProductPrice
              price={product.price}
              discountPercentage={product.discountPercentage}
            />
          </ViewTransition>

          <div role="status" aria-live="polite">
            {product.stock > 0 ? (
              <div className="badge badge-success">
                {product.availabilityStatus || "In Stock"} ({product.stock}{" "}
                available)
              </div>
            ) : (
              <div className="badge badge-error">Out of Stock</div>
            )}
          </div>

          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="mb-2">
              Description
            </h2>
            <ViewTransition name={`product-description-${product.id}`}>
              <p className="text-base-content/80">{product.description}</p>
            </ViewTransition>
          </section>

          Product Details
          <div className="divider" role="separator"></div>

          <ProductDetails
            category={product.category}
            sku={product.sku}
            brand={product.brand}
            weight={product.weight}
            minimumOrderQuantity={product.minimumOrderQuantity}
          />

          Additional Info
          <div className="divider" role="separator"></div>

          <ProductInfo
            shippingInformation={product.shippingInformation}
            warrantyInformation={product.warrantyInformation}
            returnPolicy={product.returnPolicy}
          />


          <AddToCartForm product={product} />
        </div>
      </article>

      {product.reviews && product.reviews.length > 0 && (
        <Suspense fallback={<ReviewsSkeleton />}>
          <section aria-labelledby="reviews-heading" className="mt-12 space-y-6">
            <h2 id="reviews-heading" className="text-2xl font-bold">
              Customer Reviews
            </h2>
            <ReviewSummary
              reviews={product.reviews}
              averageRating={product.rating}
            />
            <ReviewsList reviews={product.reviews} />
          </section>
        </Suspense>
      )}
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts category={product.category} excludeId={product.id} />
      </Suspense>
    </main>
  </ViewTransition>;
  // return <PageClient product={product} />;
}
