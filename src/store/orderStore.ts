"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingMethod } from "@/lib/shipping";

/** Lifecycle states an order moves through, oldest to newest. */
export type OrderStatus =
  | "created"
  | "paid"
  | "processed"
  | "handed_to_courier"
  | "in_transit"
  | "delivered";

/** A purchased line, as snapshotted onto the order at checkout. */
export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

/** Delivery details supplied by the customer. */
export type OrderCustomer = {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
};

/** A placed order. Prices are snapshotted so later catalog changes don't rewrite history. */
export type Order = {
  id: string;
  items: OrderItem[];
  customer: OrderCustomer;
  shipping: ShippingMethod;
  payment: {
    method: string;
    status: "pending" | "paid";
  };
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  /** ISO 8601 timestamp. */
  createdAt: string;
};

type OrderActions = {
  /** Prepend an order to the list (newest first). */
  addOrder: (order: Order) => void;
  /** Update an order's lifecycle status. No-op if the id is unknown. */
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  /**
   * Update an order's payment status. Paying also advances the order
   * status to "paid", since payment is what moves it out of "created".
   */
  updatePaymentStatus: (id: string, status: "pending" | "paid") => void;
  /** Look up an order by id. */
  getOrder: (id: string) => Order | undefined;
};

export type OrderStore = {
  orders: Order[];
} & OrderActions;

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order,
          ),
        })),

      updatePaymentStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  payment: { ...order.payment, status },
                  // Paying advances the order; un-paying leaves the
                  // lifecycle status untouched (no path back to "created").
                  ...(status === "paid" ? { status: "paid" as const } : {}),
                }
              : order,
          ),
        })),

      getOrder: (id) => get().orders.find((order) => order.id === id),
    }),
    {
      name: "koven-orders",
      // Persist only the orders themselves. Actions are functions and
      // JSON.stringify would drop them; declaring it keeps the stored
      // shape explicit and the rehydrated type correct.
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
);

/**
 * Generate a unique order id in the form "NYF-YYYYMMDD-XXXX".
 *
 * XXXX is a random 4-digit zero-padded number, so collisions are possible
 * but unlikely within a single day.
 *
 * @example generateOrderId() // "NYF-20261011-0042"
 */
export function generateOrderId(): string {
  const now = new Date();

  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const suffix = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

  return `NYF-${year}${month}${day}-${suffix}`;
}
