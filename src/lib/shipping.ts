/**
 * Shipping options offered at checkout, with flat rates in IDR.
 */

/** A selectable shipping method. */
export type ShippingMethod = {
  /** Stable identifier used in the checkout form and order records. */
  id: string;
  /** Human-readable name shown to the customer. */
  label: string;
  /** Courier or couriers that fulfil this method. */
  courier: string;
  /** Delivery estimate, e.g. "3–5 hari". */
  eta: string;
  /** Flat cost in IDR. Integer, no decimals. */
  cost: number;
};

export const shippingMethods: ShippingMethod[] = [
  {
    id: "regular",
    label: "Regular",
    courier: "JNE / J&T",
    eta: "3–5 hari",
    cost: 20000,
  },
  {
    id: "express",
    label: "Express",
    courier: "SiCepat",
    eta: "1–2 hari",
    cost: 35000,
  },
  {
    id: "sameday",
    label: "Same Day",
    courier: "Instant Courier",
    eta: "Hari ini",
    cost: 55000,
  },
];

/**
 * Look up a shipping method by id.
 *
 * @example getShippingById("express")?.cost // 35000
 * @example getShippingById("nope") // undefined
 */
export function getShippingById(id: string): ShippingMethod | undefined {
  return shippingMethods.find((method) => method.id === id);
}
