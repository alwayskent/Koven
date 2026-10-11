"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatIDR } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer so content clears the absolute navbar */}
      <div className="h-20" />

      {/* Header */}
      <div className="mx-auto max-w-[1400px] px-6 pb-8 pt-12 md:px-10">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          SHOPPING CART
        </h1>
        <p className="mt-2 text-[13px] text-neutral-500">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <ShoppingBag size={48} strokeWidth={1.5} className="mx-auto text-neutral-300" />
          <h2 className="mt-6 font-display text-xl">Your cart is empty</h2>
          <p className="mt-2 text-[13px] text-neutral-500">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            href="/catalog"
            className="mt-6 inline-block bg-black px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Cart content */
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1fr_380px]">
            {/* Left — line items */}
            <div className="divide-y divide-neutral-200 border-t border-neutral-200">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-6 md:gap-6">
                  {/* Image */}
                  <Link href={`/product/${item.productId}`} className="shrink-0">
                    <div
                      className="h-24 w-24 bg-cover bg-center bg-neutral-100 md:h-28 md:w-28"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-[14px] font-semibold hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-[11px] uppercase tracking-wider text-neutral-400">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-[13px] font-medium">
                        {formatIDR(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Qty + remove row */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center border border-neutral-300">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                          className="px-2.5 py-1.5 hover:bg-neutral-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="min-w-[40px] px-4 py-1.5 text-center text-[12px]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity + 1,
                            )
                          }
                          className="px-2.5 py-1.5 hover:bg-neutral-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-neutral-400 transition hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — order summary */}
            <div className="self-start border border-neutral-200 p-6 md:sticky md:top-24">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.2em]">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between text-[13px]">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>

              <p className="mt-3 text-[11px] text-neutral-500">
                Shipping calculated at checkout.
              </p>

              <div className="my-5 border-t border-neutral-200" />

              <div className="flex justify-between">
                <span className="text-[13px] font-bold uppercase tracking-wider">
                  Total
                </span>
                <span className="text-[15px] font-bold">{formatIDR(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800"
              >
                Proceed to Checkout
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/catalog"
                className="mt-4 block text-center text-[11px] uppercase tracking-wider text-neutral-500 transition hover:text-black"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
