"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories, Product } from "@/data/products";

type Sort = "newest" | "price-asc" | "price-desc";

const DEFAULT_MAX_PRICE = 2000000;

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("newest");
  const [maxPrice, setMaxPrice] = useState<number>(DEFAULT_MAX_PRICE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = products.filter((product: Product) => {
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "newest":
      default:
        return list;
    }
  }, [search, category, sort, maxPrice]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Spacer so content clears the absolute navbar */}
      <div className="h-20" />

      {/* Header */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pt-12 pb-8">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">
          SHOP ALL
        </h1>
        <p className="mt-2 text-[13px] text-neutral-500">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      </section>

      {/* Filter bar — sticky under navbar */}
      <section className="sticky top-0 z-40 border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-4 flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-neutral-300 bg-white pl-9 pr-3 py-2.5 text-[13px] outline-none focus:border-black"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 text-[11px] font-medium uppercase tracking-wider border transition ${
                  category === c
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-600 border-neutral-300 hover:border-black"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-neutral-300 bg-white px-3 py-2.5 text-[12px] uppercase tracking-wider outline-none focus:border-black"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-12">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[14px] text-neutral-500">
              No products match your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaxPrice(DEFAULT_MAX_PRICE);
              }}
              className="mt-4 text-[12px] font-medium underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
