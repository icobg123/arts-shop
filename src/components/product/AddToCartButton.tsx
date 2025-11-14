"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { Check, ShoppingCartIcon } from "lucide-react";

/**
 * Add to Cart button with React 19 useFormStatus
 * Automatically tracks form submission state without prop drilling
 */
export function AddToCartButton() {
  const { pending } = useFormStatus(); // React 19 feature!
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!pending && showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 1000);
      return () => clearTimeout(timer);
    }
    if (pending) {
      setShowSuccess(false);
    }
  }, [pending, showSuccess]);

  return (
    <button
      type="submit"
      disabled={pending || showSuccess}
      className="btn w-full btn-lg btn-primary"
      aria-label="Add to cart"
    >
      {showSuccess ? (
        <>
          <Check className="h-5 w-5" />
          Added!
        </>
      ) : pending ? (
        <>
          <span className="loading loading-sm loading-spinner"></span>
          Adding...
        </>
      ) : (
        <>
          <ShoppingCartIcon className="h-5 w-5" /> Add to Cart
        </>
      )}
    </button>
  );
}
