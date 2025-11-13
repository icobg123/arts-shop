import Link from "next/link";
import { Home, FolderOpen, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showIcons?: boolean;
}

/**
 * Accessible breadcrumb navigation component
 * Uses semantic nav element, DaisyUI breadcrumbs styling, and Lucide icons
 */
export function Breadcrumb({
  items,
  className = "",
  showIcons = true,
}: BreadcrumbProps) {
  const getDefaultIcon = (index: number) => {
    if (index === 0) {
      return <Home className="h-4 w-4" />;
    }
    return <FolderOpen className="h-4 w-4" />;
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <div className="breadcrumbs text-sm">
        <ul>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const icon = showIcons
              ? item.icon || getDefaultIcon(index)
              : null;

            return (
              <li key={index} aria-current={isLast ? "page" : undefined}>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 no-underline">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
