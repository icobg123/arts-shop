interface ProductInfoProps {
  shippingInformation: string;
  warrantyInformation: string;
  returnPolicy: string;
}

/**
 * Collapsible product information sections
 * Uses native details/summary elements for accessibility
 */
export function ProductInfo({
  shippingInformation,
  warrantyInformation,
  returnPolicy,
}: ProductInfoProps) {
  return (
    <section
      aria-labelledby="additional-info-heading"
      className="space-y-3"
    >
      <h2 id="additional-info-heading" className="sr-only">
        Additional Information
      </h2>

      <details className="collapse collapse-arrow bg-base-200">
        <summary className="collapse-title font-medium">
          Shipping Information
        </summary>
        <div className="collapse-content">
          <p>{shippingInformation}</p>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-200">
        <summary className="collapse-title font-medium">
          Warranty Information
        </summary>
        <div className="collapse-content">
          <p>{warrantyInformation}</p>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-200">
        <summary className="collapse-title font-medium">
          Return Policy
        </summary>
        <div className="collapse-content">
          <p>{returnPolicy}</p>
        </div>
      </details>
    </section>
  );
}
