/**
 * Shopping cart TypeScript types
 */

import { Product } from "@/types/product";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock: number;
  discountPercentage: number;
  category: string;
}

export interface CartStore {
  // State
  items: CartItem[];
  hydrated: boolean;

  // Actions
  addItem: (product: Product | CartItem, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  // Computed values
  totalItems: number;
  totalPrice: number;
}
