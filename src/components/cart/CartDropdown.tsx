"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { toast } from "sonner";

interface CartDropdownProps {
  onClose?: () => void;
}

export default function CartDropdown({ onClose }: CartDropdownProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const hydrated = useCartStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <div className="card-compact card hidden w-80 rounded-box border border-base-300 bg-base-100 p-4 shadow-xl sm:block">
        <div className="h-32 w-full skeleton"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card-compact card hidden w-80 rounded-box border border-base-300 bg-base-100 p-6 shadow-xl sm:block">
        <div className="text-center">
          <p className="text-sm text-base-content/60">Your cart is empty</p>
          <Link
            href="/"
            className="btn mt-4 btn-sm btn-primary"
            onClick={onClose}
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveItem = (id: number, title: string) => {
    removeItem(id);
    toast.success(`Removed ${title} from cart`);
  };

  // Show only first 3 items in dropdown
  const displayItems = items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <div className="card-compact card z-50 hidden w-96 rounded-box border border-base-300 bg-base-100 shadow-xl sm:block">
      <div className="card-body">
        <h3 className="card-title text-base">Shopping Cart</h3>

        {/* Cart Items */}
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-base-300 pb-3 last:border-0"
            >
              {/* Thumbnail */}
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-base-200">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Item Details */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <span>Qty: {item.quantity}</span>
                  <span>•</span>
                  <span className="font-semibold text-primary">
                    $
                    {(
                      item.price *
                      (1 - item.discountPercentage / 100) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item.id, item.title)}
                className="btn btn-circle flex-shrink-0 btn-ghost btn-xs"
                aria-label={`Remove ${item.title} from cart`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Show "X more items" if there are more */}
        {hasMore && (
          <p className="text-center text-xs text-base-content/60">
            + {items.length - 3} more item{items.length - 3 > 1 ? "s" : ""}
          </p>
        )}

        {/* Subtotal */}
        <div className="border-t border-base-300 pt-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Subtotal:</span>
            <span className="text-lg font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              href="/cart"
              className="btn flex-1 btn-outline btn-sm"
              onClick={onClose}
            >
              View Cart
            </Link>
            <button className="btn flex-1 btn-sm btn-primary">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
