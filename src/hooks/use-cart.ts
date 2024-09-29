import { Product } from "@/server/payload/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const itemIndex = state.items.findIndex(
            (item) => item.product.id === product.id,
          );

          if (itemIndex === -1) {
            return {
              items: [...state.items, { product, quantity }],
            };
          }

          const newItems = [...state.items];
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            quantity: newItems[itemIndex].quantity + quantity,
          };

          return { items: newItems };
        }),
      updateItem: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id ? { ...item, quantity } : item,
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
