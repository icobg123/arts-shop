import { getCategoryUrl } from "@/lib/api/products";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface ProductBreadcrumbProps {
  category: string;
  productTitle: string;
  className?: string;
}

/**
 * Helper function to format category slug to display name
 */
function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Product breadcrumb navigation component
 * Convenience wrapper around the unified Breadcrumb component for product pages
 */
export function ProductBreadcrumb({
  category,
  productTitle,
  className = "mb-6",
}: ProductBreadcrumbProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: formatCategoryName(category), href: getCategoryUrl(category) },
    { label: productTitle },
  ];

  return <Breadcrumb items={breadcrumbItems} className={className} />;
}
