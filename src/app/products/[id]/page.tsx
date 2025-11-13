import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/api/products";
import {
  ProductBreadcrumb,
  ProductImageGallery,
  ProductRating,
  ProductPrice,
  ProductDetails,
  ProductInfo,
  AddToCartForm,
  ReviewSummary,
  ReviewsList,
  RelatedProducts,
} from "@/components/product";

interface ProductPageProps {
  params: {
    id: string;
  };
}

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const product = await getProduct(parseInt(resolvedParams.id));

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
  const response = await getProducts({limit:0});

  return response.products.map((product) => ({
    id: product.id.toString(),
  }));
}
/**
 * Product detail page component
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product;

  try {
    product = await getProduct(parseInt(resolvedParams.id));
  } catch {
    notFound();
  }

  return (
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
        />

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Brand Badge */}
          {product.brand && (
            <div className="badge badge-primary" aria-label={`Brand: ${product.brand}`}>
              {product.brand}
            </div>
          )}

          {/* Product Title */}
          <h1 className="text-4xl font-bold">{product.title}</h1>

          {/* Rating */}
          <ProductRating
            rating={product.rating}
            reviewCount={product.reviews?.length || 0}
          />

          {/* Price */}
          <ProductPrice
            price={product.price}
            discountPercentage={product.discountPercentage}
          />

          {/* Stock Status */}
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

          {/* Description */}
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="font-semibold mb-2">
              Description
            </h2>
            <p className="text-base-content/80">{product.description}</p>
          </section>

          {/* Product Details */}
          <div className="divider" role="separator"></div>

          <ProductDetails
            category={product.category}
            sku={product.sku}
            brand={product.brand}
            weight={product.weight}
            minimumOrderQuantity={product.minimumOrderQuantity}
          />

          {/* Additional Info */}
          <div className="divider" role="separator"></div>

          <ProductInfo
            shippingInformation={product.shippingInformation}
            warrantyInformation={product.warrantyInformation}
            returnPolicy={product.returnPolicy}
          />

          {/* Add to Cart Form with Quantity Selector */}
          <AddToCartForm product={product} />
        </div>
      </article>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section aria-labelledby="reviews-heading" className="mt-12 space-y-6">
          <h2 id="reviews-heading" className="text-2xl font-bold">
            Customer Reviews
          </h2>

          {/* Review Summary with Rating Breakdown */}
          <ReviewSummary reviews={product.reviews} averageRating={product.rating} />

          {/* Reviews List with Filters and Pagination */}
          <ReviewsList reviews={product.reviews} />
        </section>
      )}

      {/* Related Products Section using React 19 use() hook */}
      <RelatedProducts category={product.category} excludeId={product.id} />
    </main>
  );
}
