import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-neutral-900">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1600')",
        }}
      />

      {/* Gradient overlay — darkens the left so the text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 md:px-10">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
          Streetwear / Sporty / Casual
        </p>

        <h1 className="font-display max-w-3xl text-[52px] leading-[0.95] text-white sm:text-[72px] md:text-[88px]">
          BUILT FOR
          <br />
          EVERY MOVE.
        </h1>

        <p className="mt-7 max-w-md text-[15px] leading-relaxed text-white/75">
          KOVEN is more than just clothing.
          <br />
          It&apos;s for every step, every city, every version of you.
        </p>

        <Link
          href="/catalog"
          className="mt-10 inline-flex w-fit items-center gap-3 bg-white px-7 py-4 text-[12px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-neutral-200"
        >
          Shop Now
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>

      {/* Slide indicator */}
      <div className="absolute bottom-10 right-6 z-10 hidden items-center gap-3 text-white md:right-10 md:flex">
        <span className="text-[12px] font-bold tracking-wider">01</span>
        <span className="h-[1px] w-10 bg-white/40" />
        <span className="text-[12px] tracking-wider text-white/40">02</span>
        <span className="text-[12px] tracking-wider text-white/40">03</span>
      </div>
    </section>
  );
}
