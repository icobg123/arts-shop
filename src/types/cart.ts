/**
 * Shopping cart TypeScript types
 */

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock: number;
  discountPercentage: number;
}

export interface CartStore {
  // State
  items: CartItem[];
  hydrated: boolean;

  // Actions
  addItem: (product: CartItem, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  // Computed values
  totalItems: number;
  totalPrice: number;
}
