import { unstable_ViewTransition as ViewTransition } from "react";
import { getCategories, getProductsByCategory } from "@/lib/api/products";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - Browse by Category",
  description:
    "Explore our wide range of product categories. Find exactly what you're looking for.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  // Fetch featured product for each category to get an image
  const categoryDataPromises = categories.map(async (category) => {
    const products = await getProductsByCategory(category, 1);
    return {
      slug: category,
      name: category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      featuredImage: products.products[0]?.thumbnail || "",
      productCount: products.total,
    };
  });

  const categoryData = await Promise.all(categoryDataPromises);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories" },
  ];

  return (
    <ViewTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <h1 className="text-4xl font-bold mb-2">Shop by Category</h1>
          <p className="text-base-content/70">
            Browse our curated collection of categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryData.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </div>
    </ViewTransition>
  );
}
