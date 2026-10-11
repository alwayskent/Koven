"use client";

import Link from "next/link";

import type { Product } from "@/data/products";
import { formatIDR } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.tag && (
          <span className="absolute left-3 top-3 z-10 bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {product.tag}
          </span>
        )}

        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${product.images[0]}')` }}
        />
      </div>

      {/* Info */}
      <div className="mt-4">
        <h3 className="text-[13px] font-semibold">{product.name}</h3>
        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-400">
          {product.category}
        </p>
        <p className="mt-1.5 text-[12px] font-medium">
          {formatIDR(product.price)}
        </p>

        {/* Colour swatches — max 4 */}
        <div className="mt-2 flex gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c}
              className="h-3 w-3 rounded-full border border-neutral-300"
              style={{ background: colorHex(c) }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

/** Map a colour name to a swatch hex. Falls back to neutral grey. */
function colorHex(name: string): string {
  const map: Record<string, string> = {
    Black: "#0a0a0a",
    "Off-White": "#f5f5f0",
    Grey: "#9ca3af",
    Navy: "#1e293b",
    Olive: "#4d5a3b",
    Natural: "#e8e3d8",
    Indigo: "#37477a",
    Khaki: "#c4b998",
    Red: "#b91c1c",
    White: "#ffffff",
    Multi: "#8b5cf6",
  };
  return map[name] || "#d4d4d4";
}
