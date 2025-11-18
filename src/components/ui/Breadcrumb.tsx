import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <div className="breadcrumbs text-sm">
        <ul>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

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
