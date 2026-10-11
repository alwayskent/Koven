"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatIDR } from "@/lib/format";
import type { ShippingMethod } from "@/lib/shipping";
import { useCartStore } from "@/store/cartStore";
import {
  useOrderStore,
  generateOrderId,
  type OrderItem,
} from "@/store/orderStore";

type Customer = {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
};

type CheckoutData = {
  customer: Customer;
  shipping: ShippingMethod;
};

const methods = [
  { id: "bank_transfer", label: "Bank Transfer", desc: "BCA · Mandiri · BNI · BRI" },
  { id: "virtual_account", label: "Virtual Account", desc: "Auto-verified, instant" },
  { id: "ewallet", label: "E-Wallet", desc: "GoPay · OVO · DANA · ShopeePay" },
  { id: "qris", label: "QRIS", desc: "Scan with any Indonesian bank app" },
  { id: "cod", label: "COD (Cash on Delivery)", desc: "Pay when the courier arrives" },
];

export default function PaymentPage() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrderStore((s) => s.addOrder);

  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("koven-checkout");
    if (!raw) {
      router.push("/checkout");
      return;
    }
    setCheckoutData(JSON.parse(raw) as CheckoutData);

    if (items.length === 0) {
      router.push("/cart");
    }
    // Redirects run once on mount; `items` is only read for that initial check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkoutData === null) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-20" />
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 size={24} className="animate-spin text-neutral-300" />
        </div>
        <Footer />
      </main>
    );
  }

  const shippingCost = checkoutData.shipping.cost;
  const total = subtotal + shippingCost;

  // Declared as a const (not a hoisted function declaration) so TypeScript
  // applies the `checkoutData === null` narrowing above to this closure.
  const handlePay = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    setProcessing(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1800));

    const orderItems: OrderItem[] = items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      image: i.image,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
    }));

    const orderId = generateOrderId();
    const now = new Date().toISOString();

    addOrder({
      id: orderId,
      items: orderItems,
      customer: checkoutData.customer,
      shipping: checkoutData.shipping,
      payment: { method: paymentMethod, status: "paid" },
      subtotal,
      shippingCost,
      total,
      status: "paid",
      createdAt: now,
    });

    clearCart();
    sessionStorage.removeItem("koven-checkout");

    router.push(`/confirmation?orderId=${orderId}`);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer so content clears the absolute navbar */}
      <div className="h-20" />

      {/* Header */}
      <div className="mx-auto max-w-[1400px] px-6 pb-6 pt-12 md:px-10">
        <Link
          href="/checkout"
          className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={13} />
          Back to Checkout
        </Link>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          PAYMENT
        </h1>
        <p className="mt-2 text-[12px] text-neutral-500">
          Select your payment method. This is a simulation — no real payment
          will be processed.
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_400px]">
          {/* Left — payment methods */}
          <div>
            <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.15em]">
              Payment Method
            </h2>
            <div className="space-y-3">
              {methods.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center gap-4 border p-4 transition ${
                    paymentMethod === method.id
                      ? "border-black bg-neutral-50"
                      : "border-neutral-300 hover:border-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-black"
                  />
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold">{method.label}</p>
                    <p className="mt-0.5 text-[11px] text-neutral-500">
                      {method.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Warning note */}
            <div className="mt-6 border border-amber-200 bg-amber-50 p-4">
              <p className="text-[11px] text-amber-800">
                This is a simulation. Do not enter real card numbers or banking
                credentials. Clicking &apos;Simulasikan Pembayaran&apos; will
                mark your order as paid.
              </p>
            </div>
          </div>

          {/* Right — summary + pay button */}
          <div className="self-start border border-neutral-200 p-6 md:sticky md:top-24">
            <h2 className="mb-5 text-[12px] font-bold uppercase tracking-[0.2em]">
              Order Summary
            </h2>

            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="mb-3 flex justify-between gap-3 text-[12px]"
              >
                <div className="min-w-0">
                  <p className="truncate">{item.name}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-400">
                    {item.size} · {item.color} · ×{item.quantity}
                  </p>
                </div>
                <p className="whitespace-nowrap font-medium">
                  {formatIDR(item.price * item.quantity)}
                </p>
              </div>
            ))}

            <div className="my-4 border-t border-neutral-200" />

            <div className="flex justify-between text-[12px]">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>

            <div className="mt-3 flex justify-between text-[12px]">
              <span>Shipping ({checkoutData.shipping.label})</span>
              <span>{formatIDR(shippingCost)}</span>
            </div>

            <div className="my-4 border-t border-neutral-200" />

            <div className="flex justify-between">
              <span className="text-[13px] font-bold uppercase tracking-wider">
                Total
              </span>
              <span className="text-[15px] font-bold">{formatIDR(total)}</span>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={processing || !paymentMethod}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {processing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Simulasikan Pembayaran"
              )}
            </button>

            <p className="mt-3 text-center text-[10px] text-neutral-400">
              Clicking this button will simulate a successful payment.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
