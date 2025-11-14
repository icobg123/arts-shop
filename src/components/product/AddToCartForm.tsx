"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartButton } from "./AddToCartButton";
import { XCircle } from "lucide-react";

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
      // Add item to cart with the correct signature
      addItem(product, qty);

      if (isInCart) {
        toast.info(`Updated ${product.title} quantity in cart`);
      } else {
        toast.success(`Added ${product.title} to cart!`);
      }
    } catch (error) {
      toast.error(`Failed to add ${product.title} to cart`);
    }
  }

  if (product.stock === 0) {
    return (
      <div className="alert alert-error">
        <XCircle className="h-5 w-5" />
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
