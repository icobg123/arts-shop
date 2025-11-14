"use client";

import { unstable_ViewTransition as ViewTransition, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";

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
      <ViewTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 h-12 w-48 skeleton"></div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full skeleton"></div>
              ))}
            </div>
            <div className="h-96 w-full skeleton"></div>
          </div>
        </div>
      </ViewTransition>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <ViewTransition>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-base-200 p-6">
                <ShoppingCart className="h-16 w-16 text-base-content/30" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold">Your cart is empty</h1>
            <p className="mb-8 text-base-content/60">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping to fill it up!
            </p>
            <Link href="/" className="btn btn-lg btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </ViewTransition>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shopping Cart" },
  ];

  return (
    <ViewTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="mb-2 text-3xl font-bold"
              style={{ viewTransitionName: "cart-title" }}
            >
              Shopping Cart
            </h1>
            <p className="text-base-content/60">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>
          <Link href="/" className="btn gap-2 btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Cart Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {/* Clear Cart Button */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleClearCart}
                disabled={isClearingCart}
                className="btn text-error btn-ghost btn-sm"
              >
                {isClearingCart ? (
                  <span className="loading loading-xs loading-spinner"></span>
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
        <div className="mt-12 grid grid-cols-1 gap-4 text-center md:grid-cols-3">
          <div className="p-4">
            <div className="mb-2 text-2xl text-success">✓</div>
            <h3 className="mb-1 font-semibold">Secure Checkout</h3>
            <p className="text-sm text-base-content/60">
              SSL encrypted transactions
            </p>
          </div>
          <div className="p-4">
            <div className="mb-2 text-2xl text-success">✓</div>
            <h3 className="mb-1 font-semibold">Free Shipping</h3>
            <p className="text-sm text-base-content/60">On orders over $50</p>
          </div>
          <div className="p-4">
            <div className="mb-2 text-2xl text-success">✓</div>
            <h3 className="mb-1 font-semibold">Easy Returns</h3>
            <p className="text-sm text-base-content/60">30-day return policy</p>
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
