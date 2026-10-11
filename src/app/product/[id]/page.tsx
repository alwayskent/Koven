"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { formatIDR } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";

const RELATED_COUNT = 4;

/**
 * `useParams()` reads runtime URL data, which with Cache Components must
 * sit inside a <Suspense> boundary so the static shell can prerender. The
 * default export below provides that boundary.
 */
function ProductContent() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<number>(0);

  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="h-20" />
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
          <p className="font-display text-2xl tracking-tight">
            Product not found
          </p>
          <Link
            href="/catalog"
            className="mt-4 text-[12px] uppercase tracking-wider hover:underline"
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  function handleAddToCart() {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    addItem({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      image: product!.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    router.push("/cart");
  }

  const related = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );
  const fallback = products.filter((p) => p.id !== product.id);
  const relatedToShow = (related.length >= RELATED_COUNT ? related : fallback).slice(
    0,
    RELATED_COUNT,
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer so content clears the absolute navbar */}
      <div className="h-20" />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Shop
        </Link>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-10">
        {/* Left — images */}
        <div>
          <div className="relative aspect-square overflow-hidden bg-neutral-100">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${product.images[activeImage]}')` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={`aspect-square border-2 bg-cover bg-center transition ${
                  activeImage === i ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundImage: `url('${img}')` }}
              />
            ))}
          </div>
        </div>

        {/* Right — details */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
            {product.category}
          </p>
          <h1 className="font-display mt-2 text-3xl tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-[16px] font-medium">
            {formatIDR(product.price)}
          </p>

          <p className="mt-3 text-[11px]">
            {product.stock > 10 ? (
              <span className="text-green-600">In Stock</span>
            ) : product.stock >= 1 ? (
              <span className="text-amber-600">Only {product.stock} left</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          <p className="mt-6 text-[14px] leading-relaxed text-neutral-600">
            {product.description}
          </p>

          {/* Size */}
          {product.sizes.length > 0 && (
            <div>
              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.15em]">
                Size
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] border px-3 py-2.5 text-[12px] font-medium transition ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.15em]">
                Color
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`border px-3 py-2.5 text-[12px] font-medium transition ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 hover:border-black"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.15em]">
              Quantity
            </p>
            <div className="mt-3 inline-flex items-center border border-neutral-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-[48px] px-4 py-2.5 text-center text-[13px]">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2.5"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="inline-flex w-full items-center justify-center gap-3 bg-black px-8 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedToShow.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
          <h2 className="font-display mb-6 text-2xl tracking-tight">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {relatedToShow.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

export default function ProductPage() {
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
      <ProductContent />
    </Suspense>
  );
}
