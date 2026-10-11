"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Truck, Zap, Clock } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatIDR } from "@/lib/format";
import { shippingMethods, ShippingMethod } from "@/lib/shipping";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [shipping, setShipping] = useState<ShippingMethod>(shippingMethods[0]);

  const shippingCost = shipping.cost;
  const total = subtotal + shippingCost;

  const router = useRouter();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-20" />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h2 className="font-display text-xl">Your cart is empty</h2>
          <p className="mt-2 text-[13px] text-neutral-500">
            Add something to your cart before checking out.
          </p>
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

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city
    ) {
      alert("Please fill in all required fields");
      return;
    }
    // Store checkout data in sessionStorage so /payment can read it
    sessionStorage.setItem(
      "koven-checkout",
      JSON.stringify({ customer, shipping }),
    );
    router.push("/payment");
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer so content clears the absolute navbar */}
      <div className="h-20" />

      {/* Header */}
      <div className="mx-auto max-w-[1400px] px-6 pb-6 pt-12 md:px-10">
        <Link
          href="/cart"
          className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-neutral-500 transition hover:text-black"
        >
          <ArrowLeft size={13} />
          Back to Cart
        </Link>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          CHECKOUT
        </h1>
      </div>

      {/* Form + summary. The summary (and its submit button) lives INSIDE
          the <form> so the button submits it. */}
      <form onSubmit={handleContinue}>
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1fr_400px]">
            {/* Left — form fields */}
            <div>
              {/* Contact information */}
              <h2 className="mb-4 text-[12px] font-bold uppercase tracking-[0.15em]">
                Contact Information
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-[11px] uppercase tracking-wider text-neutral-500"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="w-full border border-neutral-300 px-3 py-3 text-[13px] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-[11px] uppercase tracking-wider text-neutral-500"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="w-full border border-neutral-300 px-3 py-3 text-[13px] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-[11px] uppercase tracking-wider text-neutral-500"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    required
                    rows={3}
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    className="w-full border border-neutral-300 px-3 py-3 text-[13px] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-[11px] uppercase tracking-wider text-neutral-500"
                  >
                    City / Region
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) =>
                      setCustomer({ ...customer, city: e.target.value })
                    }
                    className="w-full border border-neutral-300 px-3 py-3 text-[13px] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-1.5 block text-[11px] uppercase tracking-wider text-neutral-500"
                  >
                    Order Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={customer.notes}
                    onChange={(e) =>
                      setCustomer({ ...customer, notes: e.target.value })
                    }
                    className="w-full border border-neutral-300 px-3 py-3 text-[13px] outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Shipping method */}
              <h2 className="mb-4 mt-10 text-[12px] font-bold uppercase tracking-[0.15em]">
                Shipping Method
              </h2>
              <div className="flex flex-col gap-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between border p-4 transition ${
                      shipping.id === method.id
                        ? "border-black bg-neutral-50"
                        : "border-neutral-300 hover:border-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shipping.id === method.id}
                        onChange={() => setShipping(method)}
                        className="accent-black"
                      />
                      <div>
                        <p className="text-[13px] font-semibold">
                          {method.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          {method.courier} · {method.eta}
                        </p>
                      </div>
                    </div>
                    <p className="text-[13px] font-medium">
                      {formatIDR(method.cost)}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Right — order summary + submit */}
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
                <span>Shipping ({shipping.label})</span>
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
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800"
              >
                Continue to Payment
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </form>

      <Footer />
    </main>
  );
}
