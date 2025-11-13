"use client";

import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isClearingCart, setIsClearingCart] = useState(false);

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      setIsClearingCart(true);
      clearCart();
      setTimeout(() => setIsClearingCart(false), 300);
    }
  };

  // Show loading skeleton while hydrating
  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="skeleton h-12 w-48 mb-8"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 w-full"></div>
            ))}
          </div>
          <div className="skeleton h-96 w-full"></div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-base-200 rounded-full">
              <ShoppingCart className="h-16 w-16 text-base-content/30" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-base-content/60 mb-8">
            Looks like you haven&apos;t added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <Link href="/products" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-base-content/60">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link href="/products" className="btn btn-ghost gap-2">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Cart Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Clear Cart Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearCart}
              disabled={isClearingCart}
              className="btn btn-ghost btn-sm text-error"
            >
              {isClearingCart ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Clear Cart"
              )}
            </button>
          </div>

          {/* Cart Items List */}
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <div className="text-success text-2xl mb-2">✓</div>
          <h3 className="font-semibold mb-1">Secure Checkout</h3>
          <p className="text-sm text-base-content/60">
            SSL encrypted transactions
          </p>
        </div>
        <div className="p-4">
          <div className="text-success text-2xl mb-2">✓</div>
          <h3 className="font-semibold mb-1">Free Shipping</h3>
          <p className="text-sm text-base-content/60">On orders over $50</p>
        </div>
        <div className="p-4">
          <div className="text-success text-2xl mb-2">✓</div>
          <h3 className="font-semibold mb-1">Easy Returns</h3>
          <p className="text-sm text-base-content/60">30-day return policy</p>
        </div>
      </div>
    </div>
  );
}
