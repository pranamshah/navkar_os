"use client";

const partners = [
  { name: "MAERSK", abbr: "MSK", bg: "#00243D", fg: "#fff" },
  { name: "HAPAG-LLOYD", abbr: "HL", bg: "#E2700A", fg: "#fff" },
  { name: "CMA CGM", abbr: "CMA", bg: "#003B7A", fg: "#fff" },
  { name: "MSC", abbr: "MSC", bg: "#0058A6", fg: "#fff" },
  { name: "ADANI PORTS", abbr: "AP", bg: "#1B4F9C", fg: "#fff" },
  { name: "JNPT", abbr: "JN", bg: "#1A6B3C", fg: "#fff" },
  { name: "ICEGATE", abbr: "ICG", bg: "#8B0000", fg: "#fff" },
  { name: "TALLY PRIME", abbr: "TP", bg: "#0052CC", fg: "#fff" },
  { name: "RAZORPAY", abbr: "RZ", bg: "#2D4CE2", fg: "#fff" },
  { name: "DHL", abbr: "DHL", bg: "#FFCC00", fg: "#1a1c1c" },
  { name: "MAERSK", abbr: "MSK", bg: "#00243D", fg: "#fff" },
  { name: "HAPAG-LLOYD", abbr: "HL", bg: "#E2700A", fg: "#fff" },
  { name: "CMA CGM", abbr: "CMA", bg: "#003B7A", fg: "#fff" },
  { name: "MSC", abbr: "MSC", bg: "#0058A6", fg: "#fff" },
  { name: "ADANI PORTS", abbr: "AP", bg: "#1B4F9C", fg: "#fff" },
  { name: "JNPT", abbr: "JN", bg: "#1A6B3C", fg: "#fff" },
  { name: "ICEGATE", abbr: "ICG", bg: "#8B0000", fg: "#fff" },
  { name: "TALLY PRIME", abbr: "TP", bg: "#0052CC", fg: "#fff" },
  { name: "RAZORPAY", abbr: "RZ", bg: "#2D4CE2", fg: "#fff" },
  { name: "DHL", abbr: "DHL", bg: "#FFCC00", fg: "#1a1c1c" },
];

export default function TrustTicker() {
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
          {partners.map((p, i) => (
            <span
              key={i}
              className="mx-8 flex items-center gap-2.5 whitespace-nowrap select-none"
            >
              {/* Logo mark — colored badge with abbreviation */}
              <span
                className="flex items-center justify-center rounded flex-shrink-0"
                style={{
                  width: "32px",
                  height: "28px",
                  background: p.bg,
                  color: p.fg,
                  fontSize: p.abbr.length > 2 ? "7px" : "9px",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {p.abbr}
              </span>
              <span
                className="font-black"
                style={{ fontSize: "13px", color: "rgba(26,28,29,0.32)", letterSpacing: "-0.01em" }}
              >
                {p.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
