"use client";

import { Suspense, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Package,
  CreditCard,
  Box,
  Truck,
  Navigation,
  Home,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatIDR, formatDate, formatOrderStatus } from "@/lib/format";
import { useOrderStore, type OrderStatus } from "@/store/orderStore";

/**
 * `useParams()` reads URL data, which with Cache Components must sit inside a
 * <Suspense> boundary so the static shell can prerender. The default export
 * below provides that boundary (same pattern as /product/[id]).
 */
function TrackingContent() {
  const params = useParams();
  const id = params.id as string;

  // `useOrderStore` uses persist, so the store may be empty on the first
  // render until hydration finishes. Wait for mount before deciding.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const order = useOrderStore((s) => s.getOrder(id));
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

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

  if (!order) {
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

  const steps: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    { status: "created", label: "Pesanan Dibuat", icon: Package, desc: "Pesanan telah diterima sistem" },
    { status: "paid", label: "Pembayaran Berhasil", icon: CreditCard, desc: "Pembayaran telah dikonfirmasi" },
    { status: "processed", label: "Pesanan Diproses", icon: Box, desc: "Pesanan sedang dikemas" },
    { status: "handed_to_courier", label: "Diserahkan ke Kurir", icon: Truck, desc: `Diserahkan ke ${order.shipping.courier}` },
    { status: "in_transit", label: "Dalam Pengiriman", icon: Navigation, desc: "Pesanan sedang dalam perjalanan" },
    { status: "delivered", label: "Pesanan Sampai", icon: Home, desc: "Pesanan telah diterima" },
  ];

  const currentIndex = steps.findIndex((s) => s.status === order.status);

  // Declared as a const (not a hoisted function declaration) so TypeScript
  // applies the `!order` narrowing above to this closure.
  const handleAdvance = () => {
    if (currentIndex < steps.length - 1) {
      updateOrderStatus(order.id, steps[currentIndex + 1].status);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer so content clears the absolute navbar */}
      <div className="h-20" />

      {/* Header */}
      <div className="mx-auto max-w-3xl px-6 pb-6 pt-12 md:px-10">
        <Link
          href={`/confirmation?orderId=${order.id}`}
          className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={13} />
          Kembali ke Pesanan
        </Link>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          LACAK PESANAN
        </h1>

        {/* Order ID strip */}
        <div className="mt-4 flex flex-col gap-3 border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              Order ID
            </p>
            <p className="mt-1 font-mono text-[14px] font-bold">{order.id}</p>
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

      {/* Timeline */}
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
        <div className="relative">
          {steps.map((step, i) => {
            const isDone = i <= currentIndex;
            const isCurrent = i === currentIndex;
            const isLast = i === steps.length - 1;

            return (
              <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Connector line */}
                {!isLast && (
                  <span
                    className={`absolute left-[19px] top-10 bottom-0 w-[2px] ${
                      isDone && i < currentIndex ? "bg-black" : "bg-neutral-200"
                    }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    isDone ? "border-black bg-black" : "border-neutral-300 bg-white"
                  }`}
                >
                  {isDone ? (
                    <Check size={16} strokeWidth={3} className="text-white" />
                  ) : (
                    <step.icon size={16} strokeWidth={1.75} className="text-neutral-400" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 pt-1.5">
                  <p
                    className={`text-[13px] font-semibold ${
                      isDone ? "text-black" : "text-neutral-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`mt-0.5 text-[11px] ${
                      isDone ? "text-neutral-500" : "text-neutral-400"
                    }`}
                  >
                    {step.desc}
                  </p>
                  {isCurrent && (
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-green-600">
                      ● Status Saat Ini
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery info */}
      <div className="mx-auto max-w-3xl px-6 pb-10 md:px-10">
        <div className="border border-neutral-200 p-5">
          <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em]">
            Informasi Pengiriman
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Metode
              </p>
              <p className="mt-1 text-[13px] font-medium">
                {order.shipping.label} · {order.shipping.courier}
              </p>
              <p className="mt-1 text-[11px] text-neutral-500">
                ETA: {order.shipping.eta}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Alamat
              </p>
              <p className="mt-1 text-[12px]">{order.customer.name}</p>
              <p className="text-[12px] text-neutral-600">
                {order.customer.address}
              </p>
              <p className="text-[12px] text-neutral-600">
                {order.customer.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo control */}
      <div className="mx-auto max-w-3xl px-6 pb-16 md:px-10">
        <div className="border border-dashed border-amber-300 bg-amber-50 p-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">
            Demo Mode
          </p>
          <p className="mb-3 text-[11px] text-amber-800">
            Karena ini adalah simulasi, kamu bisa mempercepat status pesanan
            untuk melihat timeline selengkapnya.
          </p>
          <button
            type="button"
            onClick={handleAdvance}
            disabled={currentIndex >= steps.length - 1}
            className="inline-flex items-center gap-2 bg-black px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {currentIndex >= steps.length - 1
              ? "Pesanan Selesai"
              : "Lanjutkan Status →"}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function TrackingPage() {
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
      <TrackingContent />
    </Suspense>
  );
}
