import Link from "next/link";

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
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-6">
      <ol className="breadcrumbs">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href={`/?category=${category}`}>{category}</Link>
        </li>
        <li aria-current="page">{productTitle}</li>
      </ol>
    </nav>
  );
}
