"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);

  // Calculate original price (before discounts)
  const originalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalSavings = originalPrice - totalPrice;
  const estimatedTax = totalPrice * 0.1; // 10% tax estimate
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + estimatedTax + shipping;

  return (
    <div className="card bg-base-100 shadow-lg sticky top-24">
      <div className="card-body">
        <h2 className="card-title text-lg">Order Summary</h2>

        {/* Items Count */}
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <ShoppingBag className="h-4 w-4" />
          <span>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="divider my-2"></div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-base-content/60">Subtotal</span>
            <span>${originalPrice.toFixed(2)}</span>
          </div>

          {totalSavings > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount Savings</span>
              <span>-${totalSavings.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-base-content/60">Estimated Tax</span>
            <span>${estimatedTax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-base-content/60">Shipping</span>
            {shipping === 0 ? (
              <span className="text-success font-semibold">FREE</span>
            ) : (
              <span>${shipping.toFixed(2)}</span>
            )}
          </div>

          {shipping > 0 && totalPrice < 50 && (
            <div className="text-xs text-info">
              Add ${(50 - totalPrice).toFixed(2)} more for free shipping
            </div>
          )}
        </div>

        <div className="divider my-2"></div>

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${finalTotal.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <button className="btn btn-primary btn-block mt-4">
          Proceed to Checkout
        </button>

        {/* Additional Info */}
        <div className="text-xs text-center text-base-content/60 mt-2">
          Secure checkout powered by Stripe
        </div>
      </div>
    </div>
  );
}
