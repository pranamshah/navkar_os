"use client";

import { partners } from "@/data/homepage";

export default function TrustTicker() {
  const doubled = [...partners, ...partners];

  return (
    <section
      className="py-10 border-y overflow-hidden"
      style={{ borderColor: "rgba(196,199,200,0.35)", background: "#ffffff" }}
    >
      <p
        className="text-center text-xs font-semibold uppercase tracking-widest mb-6"
        style={{ color: "#5d5f5f" }}
      >
        Integrated with India's logistics infrastructure
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #ffffff, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #ffffff, transparent)" }}
        />
        <div className="ticker-track">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="mx-10 font-black text-lg whitespace-nowrap select-none"
              style={{ color: "rgba(26,28,29,0.35)", letterSpacing: "-0.02em" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
