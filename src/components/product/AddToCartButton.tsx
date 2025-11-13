"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

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
      className={`btn btn-primary btn-lg w-full ${pending ? "loading" : ""}`}
      aria-label="Add to cart"
    >
      {showSuccess ? (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Added!
        </>
      ) : pending ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Adding...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
