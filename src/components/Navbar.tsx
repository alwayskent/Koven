"use client";

import Link from "next/link";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";

import { useCartStore } from "@/store/cartStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-white md:text-[26px]"
        >
          KOVEN
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-wider text-white/90 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5 text-white">
          <button
            type="button"
            aria-label="Search"
            className="transition hover:opacity-70"
          >
            <Search size={19} strokeWidth={1.75} />
          </button>

          <button
            type="button"
            aria-label="Account"
            className="hidden transition hover:opacity-70 sm:block"
          >
            <User size={19} strokeWidth={1.75} />
          </button>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative transition hover:opacity-70"
          >
            <ShoppingBag size={19} strokeWidth={1.75} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="transition hover:opacity-70 md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase tracking-wider text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
