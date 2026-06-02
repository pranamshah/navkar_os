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
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #ffffff, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #ffffff, transparent)" }}
        />
        <div className="ticker-track">
          {doubled.map((partner, i) => (
            <span
              key={i}
              className="mx-8 flex items-center gap-2.5 whitespace-nowrap select-none"
            >
              {/* Logo mark */}
              <span
                className="w-7 h-7 rounded flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{
                  background: partner.color === "#FFCC00" ? partner.color : partner.color + "22",
                  color: partner.color === "#FFCC00" ? "#1a1c1c" : partner.color,
                  border: `0.5px solid ${partner.color}44`,
                  fontSize: "8px",
                  letterSpacing: "0",
                }}
              >
                {partner.initials}
              </span>
              <span
                className="font-black text-base"
                style={{ color: "rgba(26,28,29,0.35)", letterSpacing: "-0.02em" }}
              >
                {partner.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
