"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export default function CartIcon({ onClick, className = "" }: CartIconProps) {
  const totalItems = useCartStore((state) => state.totalItems);
  const hydrated = useCartStore((state) => state.hydrated);
  const [pulse, setPulse] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Trigger pulse animation when items are added
  useEffect(() => {
    if (hydrated && totalItems > prevCount) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCount(totalItems);
  }, [totalItems, hydrated, prevCount]);

  // Listen for cart-updated event from ProductCard
  useEffect(() => {
    const handleCartUpdate = () => {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`btn btn-ghost btn-circle relative ${className}`}
      aria-label={`Shopping cart with ${totalItems} items`}
      style={{ viewTransitionName: "cart-icon" }}
    >
      <ShoppingCart
        className={`h-6 w-6 ${pulse ? "animate-pulse" : ""}`}
        strokeWidth={2}
      />
      {hydrated && totalItems > 0 && (
        <span
          className={`
            badge badge-sm badge-primary absolute -right-1 -top-1
            font-bold
            ${pulse ? "animate-bounce" : ""}
          `}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
