import Link from "next/link";
import { getCategoryUrl } from "@/lib/api/products";

interface ProductBreadcrumbProps {
  category: string;
  productTitle: string;
}

/**
 * Accessible breadcrumb navigation component
 * Uses semantic nav element and proper ARIA labels
 */
export function ProductBreadcrumb({
  category,
  productTitle,
}: ProductBreadcrumbProps) {
  const categoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-6">
      <ol className="breadcrumbs">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/categories">Categories</Link>
        </li>
        <li>
          <Link href={getCategoryUrl(category)}>{categoryName}</Link>
        </li>
        <li aria-current="page">{productTitle}</li>
      </ol>
    </nav>
  );
}
