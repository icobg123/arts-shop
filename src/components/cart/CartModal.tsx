"use client";

import { useCartStore } from "@/store/cartStore";
import { forwardRef } from "react";
import CartItem from "./CartItem";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const CartModal = forwardRef<HTMLDialogElement>((props, ref) => {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const hydrated = useCartStore((state) => state.hydrated);

  // Calculate totals
  const originalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = originalPrice - totalPrice;
  const estimatedTax = totalPrice * 0.1;
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + estimatedTax + shipping;

  return (
    <dialog ref={ref} id="cart_modal" className="modal modal-bottom">
      <div className="modal-box max-h-[85vh] flex flex-col p-0 w-full max-w-full rounded-t-2xl rounded-b-none">
        {/* Header */}
        <div className="sticky top-0 bg-base-100 z-10 border-b border-base-300 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Shopping Cart</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>
          {hydrated && totalItems > 0 && (
            <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
              <ShoppingBag className="h-4 w-4" />
              <span>
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {!hydrated && (
          <div className="flex-1 p-4 space-y-4">
            <div className="skeleton h-24 w-full"></div>
            <div className="skeleton h-24 w-full"></div>
            <div className="skeleton h-24 w-full"></div>
          </div>
        )}

        {/* Empty Cart */}
        {hydrated && items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <ShoppingBag className="h-16 w-16 text-base-content/30 mb-4" />
            <p className="text-base-content/60 mb-4">Your cart is empty</p>
            <form method="dialog">
              <Link href="/" className="btn btn-primary">
                Shop Now
              </Link>
            </form>
          </div>
        )}

        {/* Cart Items */}
        {hydrated && items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Order Summary - Sticky Footer */}
            <div className="sticky bottom-0 bg-base-100 border-t border-base-300 px-4 py-4">
              {/* Price Breakdown */}
              <div className="space-y-2 text-sm mb-4">
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
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total</span>
                <span className="text-primary">${finalTotal.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="btn btn-primary btn-block">
                  Proceed to Checkout
                </button>
                <form method="dialog">
                  <Link href="/cart" className="btn btn-outline btn-block">
                    View Full Cart
                  </Link>
                </form>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-center text-base-content/60 mt-3">
                Secure checkout powered by Stripe
              </div>
            </div>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

CartModal.displayName = "CartModal";

export default CartModal;
