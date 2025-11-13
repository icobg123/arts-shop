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
    <div className="form-control">
      <label htmlFor={`qty-${productId}`} className="label">
        <span className="label-text font-medium">Quantity</span>
      </label>
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
          className="btn btn-outline join-item"
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
          aria-valuemin={1}
          aria-valuemax={max}
          aria-valuenow={quantity}
          className="input input-bordered join-item w-20 text-center"
          readOnly
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className="btn btn-outline join-item"
        >
          +
        </button>
      </div>
      {max <= 10 && (
        <label className="label">
          <span className="label-text-alt text-warning">
            Only {max} left in stock
          </span>
        </label>
      )}
    </div>
  );
}
