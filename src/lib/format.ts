/**
 * Formatting helpers shared across the KOVEN storefront.
 *
 * All three are locale-aware via `Intl` and assume the Indonesian
 * ("id-ID") locale used throughout the site.
 */

const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  // "code" renders the ISO currency code ("IDR") rather than the
  // locale's default symbol ("Rp"), matching the brand's copy.
  currencyDisplay: "code",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a raw amount as an Indonesian Rupiah price string.
 *
 * Rupiah has no meaningful sub-unit, so fraction digits are suppressed.
 *
 * @example formatIDR(249000) // "IDR 249.000"
 */
export function formatIDR(amount: number): string {
  return IDR_FORMATTER.format(amount);
}

// id-ID renders the clock separator as a dot ("21.30"); the brand
// style guide calls for a colon, so it is normalized after formatting.
const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * Format a date (or ISO string) as an order timestamp.
 *
 * Accepts a `Date` or anything `Date` can parse. Invalid input returns
 * "—" rather than throwing, so a bad timestamp never breaks a page.
 *
 * @example formatDate("2026-10-12T21:30:00") // "12 Okt 2026, 21:30"
 */
export function formatDate(date: Date | string): string {
  const parsed = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  const formattedDate = DATE_FORMATTER.format(parsed);
  const formattedTime = TIME_FORMATTER.format(parsed).replace(".", ":");

  return `${formattedDate}, ${formattedTime}`;
}

/** Maps order status codes to human-readable Indonesian labels. */
const ORDER_STATUS_LABELS: Record<string, string> = {
  created: "Pesanan Dibuat",
  paid: "Pembayaran Berhasil",
  processed: "Pesanan Diproses",
  handed_to_courier: "Diserahkan ke Kurir",
  in_transit: "Dalam Pengiriman",
  delivered: "Pesanan Sampai",
};

/**
 * Map an order status code to its human-readable Indonesian label.
 *
 * Unknown codes are returned unchanged so new statuses degrade gracefully
 * instead of rendering blank.
 *
 * @example formatOrderStatus("in_transit") // "Dalam Pengiriman"
 * @example formatOrderStatus("lost") // "lost"
 */
export function formatOrderStatus(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}
