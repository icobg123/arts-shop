import { unstable_ViewTransition as ViewTransition } from "react";
import { notFound } from "next/navigation";
import {
  getCategories,
  getProductsByCategory,
} from "@/lib/api/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Reserved routes that should not be treated as categories
const RESERVED_ROUTES = ["cart", "categories", "products"];

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    category: category,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${categoryName} - Shop by Category`,
    description: `Browse our collection of ${categoryName.toLowerCase()} products`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Prevent reserved routes from being treated as categories
  if (RESERVED_ROUTES.includes(category)) {
    notFound();
  }

  try {
    const { products, total } = await getProductsByCategory(category, 0);

    if (!products || products.length === 0) {
      notFound();
    }

    const categoryName = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "Categories", href: "/categories" },
      { label: categoryName },
    ];

    return (
      <ViewTransition>
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} className="mb-4" />
            <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
            <p className="text-base-content/70">
              {total} {total === 1 ? "product" : "products"} available
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </ViewTransition>
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    notFound();
  }
}
