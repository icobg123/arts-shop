"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartButton } from "./AddToCartButton";
import { CartItem } from "@/types/cart";

interface AddToCartFormProps {
  product: Product;
}

/**
 * Form wrapper for adding products to cart
 * Uses React 19 form actions for clean state management
 */
export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addItem, items } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const existingItem = items.find((item) => item.id === product.id);
  const isInCart = !!existingItem;

  async function handleSubmit(formData: FormData) {
    const qty = parseInt(formData.get("quantity") as string) || quantity;

    try {
      addItem({...product,quantity:qty}, qty);

      if (isInCart) {
        toast("Quantity updated in cart", {
          icon: "📦",
          duration: 2000,
          position: "bottom-right",
        });
      } else {
        toast.success("Added to cart!", {
          icon: "🛒",
          duration: 2000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Failed to add to cart", {
        icon: "❌",
        duration: 3000,
        position: "bottom-right",
      });
    }
  }

  if (product.stock === 0) {
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>This product is out of stock</span>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <QuantitySelector
        productId={product.id}
        productTitle={product.title}
        max={product.stock}
        initialQuantity={quantity}
        onQuantityChange={setQuantity}
      />
      <AddToCartButton />
    </form>
  );
}
