"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  productId: number;
  productTitle: string;
  max: number;
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

/**
 * Accessible quantity selector component
 * Features keyboard support and validation
 */
export function QuantitySelector({
  productId,
  productTitle,
  max,
  initialQuantity = 1,
  onQuantityChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= max) {
      setQuantity(value);
      onQuantityChange?.(value);
    }
  };

  return (
    <fieldset className="fieldset w-fit rounded-box border border-base-300 bg-base-200 p-4">
      <legend className="fieldset-legend">Quantity</legend>
      <div
        role="group"
        aria-label={`Quantity selector for ${productTitle}`}
        className="join"
      >
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          className="btn join-item btn-outline"
        >
          −
        </button>
        <input
          type="number"
          id={`qty-${productId}`}
          name="quantity"
          value={quantity}
          onChange={handleInputChange}
          min={1}
          max={max}
          className="input-bordered input join-item w-20 text-center"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className="btn join-item btn-outline"
        >
          +
        </button>
      </div>
      {max <= 10 && (
        <div className="label pt-2">
          <span className="label-text-alt text-warning">
            Only {max} left in stock
          </span>
        </div>
      )}
    </fieldset>
  );
}
