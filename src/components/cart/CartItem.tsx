"use client";

import { useCartStore } from "@/store/cartStore";
import { getProductUrl } from "@/lib/api/products";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useOptimistic, useTransition } from "react";

interface CartItemProps {
  item: {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
    stock: number;
    discountPercentage: number;
    category: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isPending, startTransition] = useTransition();

  // Optimistic quantity update
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(
    item.quantity,
    (current, newQuantity: number) => newQuantity
  );

  const discountedPrice = item.price * (1 - item.discountPercentage / 100);
  const itemTotal = discountedPrice * optimisticQuantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.stock) {
      toast.error(
        newQuantity < 1
          ? "Quantity must be at least 1"
          : `Only ${item.stock} items in stock`
      );
      return;
    }

    startTransition(async () => {
      setOptimisticQuantity(newQuantity);
      try {
        updateQuantity(item.id, newQuantity);
        toast.success(`Updated ${item.title} quantity`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error(`Failed to update ${item.title} quantity`);
      }
    });
  };

  const handleRemove = () => {
    removeItem(item.id);
    toast.success(`Removed ${item.title} from cart`);
  };

  return (
    <div className="flex gap-4 rounded-lg border border-base-300 bg-base-100 p-4">
      {/* Product Image */}
      <Link
        href={getProductUrl(item.category, item.id)}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-base-200"
      >
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="96px"
        />
      </Link>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={getProductUrl(item.category, item.id)}
              className="line-clamp-2 font-semibold transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
            <div className="mt-1 flex items-center gap-2 text-sm">
              {item.discountPercentage > 0 ? (
                <>
                  <span className="font-bold text-primary">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-base-content/50 line-through">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="badge badge-sm badge-success">
                    -{item.discountPercentage}%
                  </span>
                </>
              ) : (
                <span className="font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label={`Remove ${item.title}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between">
          <div className="join">
            <button
              onClick={() => handleQuantityChange(optimisticQuantity - 1)}
              disabled={isPending || optimisticQuantity <= 1}
              className="btn join-item btn-sm"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={optimisticQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                handleQuantityChange(val);
              }}
              className="input input-sm join-item w-16 text-center"
              min={1}
              max={item.stock}
              disabled={isPending}
            />
            <button
              onClick={() => handleQuantityChange(optimisticQuantity + 1)}
              disabled={isPending || optimisticQuantity >= item.stock}
              className="btn join-item btn-sm"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="text-sm text-base-content/60">Total</p>
            <p className="text-lg font-bold text-primary">
              ${itemTotal.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Stock Warning */}
        {optimisticQuantity >= item.stock * 0.8 && (
          <p className="mt-2 text-xs text-warning">
            Only {item.stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
}
