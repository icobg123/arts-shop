import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartStore, CartItem } from "@/types/cart";
import { Product } from "@/types/product";

/**
 * Zustand cart store with localStorage persistence
 * Manages shopping cart state across the application
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      hydrated: false,

      // Actions
      addItem: (product: Product | CartItem, quantity: number) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // Update quantity if item already in cart
          set({
            items: items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + quantity,
                      item.stock
                    ),
                  }
                : item
            ),
          });
        } else {
          // Add new item to cart
          const cartItem: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: Math.min(quantity, product.stock),
            stock: product.stock,
            discountPercentage: product.discountPercentage || 0,
          };
          set({ items: [...items, cartItem] });
        }
      },

      removeItem: (productId: number) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);

        if (!item) return;

        // Remove if quantity is 0 or less
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        // Update quantity (max is stock)
        set({
          items: items.map((i) =>
            i.id === productId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Computed values
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      get totalPrice() {
        return get().items.reduce((total, item) => {
          const discountedPrice =
            item.price * (1 - item.discountPercentage / 100);
          return total + discountedPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: "arts-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);
