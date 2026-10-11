"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatIDR, formatDate, formatOrderStatus } from "@/lib/format";
import { useOrderStore } from "@/store/orderStore";

/**
 * `useSearchParams()` reads URL data, which with Cache Components must sit
 * inside a <Suspense> boundary so the static shell can prerender. The default
 * export below provides that boundary (same pattern as /product/[id]).
 */
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const order = useOrderStore((s) => (orderId ? s.getOrder(orderId) : undefined));

  // `useOrderStore` uses persist, so the store may be empty on the first
  // render until hydration finishes. Wait for mount before deciding.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // While unmounted we can't trust the store yet, so show a loading shell
  // rather than flashing "Order not found" at every valid order.
  if (!mounted) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-20" />
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-[12px] uppercase tracking-wider text-neutral-400">
            Loading…
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  // Only after mounting is the store trustworthy enough to call an order
  // genuinely missing.
  if (!orderId || !order) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-20" />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="font-display text-xl">Order not found</p>
          <Link
            href="/catalog"
            className="mt-6 inline-block bg-black px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer so content clears the absolute navbar */}
      <div className="h-20" />

      {/* Hero */}
      <div className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center md:px-10">
        <CheckCircle2 size={56} strokeWidth={1.5} className="mx-auto text-green-600" />
        <h1 className="mt-6 font-display text-3xl tracking-tight md:text-4xl">
          PESANAN BERHASIL
        </h1>
        <p className="mt-3 text-[13px] text-neutral-500">
          Terima kasih, {order.customer.name}. Pesanan kamu sedang kami proses.
        </p>
      </div>

      {/* Order ID banner */}
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <div className="flex flex-col gap-4 border border-neutral-200 bg-neutral-50 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Order ID
            </p>
            <p className="mt-1 font-mono text-[15px] font-bold">{order.id}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Status
            </p>
            <span className="mt-1 inline-block bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {formatOrderStatus(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1 — Items */}
          <div className="border border-neutral-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Package size={16} />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Produk
              </h2>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <div
                    className="h-14 w-14 shrink-0 bg-cover bg-center bg-neutral-100"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium">{item.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-400">
                      {item.size} · {item.color} · ×{item.quantity}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-[12px] font-medium">
                    {formatIDR(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — Shipping Address */}
          <div className="border border-neutral-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={16} />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Alamat Pengiriman
              </h2>
            </div>
            <div className="space-y-1 text-[12px] leading-relaxed">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-neutral-600">{order.customer.phone}</p>
              <p className="text-neutral-600">{order.customer.address}</p>
              <p className="text-neutral-600">{order.customer.city}</p>
              {order.customer.notes && (
                <p className="mt-2 text-[11px] italic text-neutral-500">
                  Catatan: {order.customer.notes}
                </p>
              )}
            </div>
          </div>

          {/* Card 3 — Payment Method */}
          <div className="border border-neutral-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard size={16} />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Metode Pembayaran
              </h2>
            </div>
            <p className="text-[13px] font-medium capitalize">
              {order.payment.method.replace(/_/g, " ")}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-green-600">
              ✓ Berhasil Dibayar
            </p>
          </div>

          {/* Card 4 — Shipping Method */}
          <div className="border border-neutral-200 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Truck size={16} />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Metode Pengiriman
              </h2>
            </div>
            <p className="text-[13px] font-medium">{order.shipping.label}</p>
            <p className="mt-1 text-[11px] text-neutral-500">
              {order.shipping.courier} · {order.shipping.eta}
            </p>
            <p className="mt-2 text-[12px]">{formatIDR(order.shipping.cost)}</p>
          </div>

          {/* Payment summary — full width */}
          <div className="mt-2 border border-neutral-200 p-5 md:col-span-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Ringkasan Pembayaran
            </h2>
            <div className="mt-4 flex justify-between text-[12px]">
              <span>Subtotal</span>
              <span>{formatIDR(order.subtotal)}</span>
            </div>
            <div className="mt-3 flex justify-between text-[12px]">
              <span>Shipping</span>
              <span>{formatIDR(order.shippingCost)}</span>
            </div>
            <div className="my-3 border-t border-neutral-200" />
            <div className="flex justify-between">
              <span className="text-[13px] font-bold uppercase tracking-wider">
                Total
              </span>
              <span className="text-[15px] font-bold">{formatIDR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Order date */}
        <p className="mt-4 text-center text-[11px] text-neutral-400">
          Dipesan pada {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Action buttons */}
      <div className="mx-auto flex max-w-3xl flex-col justify-center gap-3 px-6 pb-16 sm:flex-row md:px-10">
        <Link
          href={`/tracking/${order.id}`}
          className="inline-flex items-center justify-center gap-3 bg-black px-6 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800"
        >
          Lacak Pesanan
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center gap-3 border border-neutral-300 px-6 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-black transition hover:border-black"
        >
          Belanja Lagi
        </Link>
      </div>

      <Footer />
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white">
          <Navbar />
          <div className="h-20" />
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-[12px] uppercase tracking-wider text-neutral-400">
              Loading…
            </p>
          </div>
          <Footer />
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
