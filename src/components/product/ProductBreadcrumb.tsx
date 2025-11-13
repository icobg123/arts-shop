import { getCategoryUrl } from "@/lib/api/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface ProductBreadcrumbProps {
  category: string;
  productTitle: string;
}

/**
 * Product breadcrumb navigation component
 * Uses the reusable Breadcrumb component
 */
export function ProductBreadcrumb({
  category,
  productTitle,
}: ProductBreadcrumbProps) {
  const categoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: categoryName, href: getCategoryUrl(category) },
    { label: productTitle },
  ];

  return <Breadcrumb items={breadcrumbItems} className="mb-6" />;
}
