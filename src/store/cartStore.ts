"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * A single line in the cart.
 *
 * A distinct entry is identified by the combination of `productId`,
 * `size`, and `color` — adding the same product in a different size or
 * color creates a second entry rather than bumping the first.
 */
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartActions = {
  /** Add an item, or increment the quantity if that variant is already present. */
  addItem: (item: CartItem) => void;
  /** Remove a specific product/size/color variant. */
  removeItem: (productId: string, size: string, color: string) => void;
  /** Set the quantity for a specific variant, clamped to a minimum of 1. */
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  /** Empty the cart. */
  clearCart: () => void;
  /** Sum of price * quantity across all items. */
  subtotal: () => number;
  /** Sum of quantity across all items. */
  totalItems: () => number;
};

export type CartStore = CartState & CartActions;

/** Two entries match only if every identifying field matches. */
const isSameVariant = (
  item: CartItem,
  productId: string,
  size: string,
  color: string,
): boolean =>
  item.productId === productId && item.size === size && item.color === color;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) =>
            isSameVariant(i, item.productId, item.size, item.color),
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                isSameVariant(i, item.productId, item.size, item.color)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !isSameVariant(i, productId, size, color),
          ),
        })),

      updateQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            isSameVariant(i, productId, size, color)
              ? { ...i, quantity: Math.max(1, Math.floor(quantity)) }
              : i,
          ),
        })),

      clearCart: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "koven-cart",
      // Persist only the cart contents. Actions are functions, which
      // JSON.stringify would drop anyway — declaring it keeps the
      // persisted shape explicit and the type-safe.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
