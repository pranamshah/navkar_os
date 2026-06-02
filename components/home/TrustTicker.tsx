"use client";

/* Real company logos via Clearbit Logo API — onError hides img and shows text fallback */

const partners = [
  { name: "MAERSK", domain: "maersk.com", abbr: "MSK", color: "#00243D" },
  { name: "HAPAG-LLOYD", domain: "hapag-lloyd.com", abbr: "HL", color: "#E2700A" },
  { name: "CMA CGM", domain: "cma-cgm.com", abbr: "CMA", color: "#003B7A" },
  { name: "MSC", domain: "msc.com", abbr: "MSC", color: "#0058A6" },
  { name: "ADANI PORTS", domain: "adaniports.com", abbr: "AP", color: "#1B4F9C" },
  { name: "TALLY PRIME", domain: "tallysolutions.com", abbr: "TP", color: "#0052CC" },
  { name: "RAZORPAY", domain: "razorpay.com", abbr: "RZ", color: "#2D4CE2" },
  { name: "DHL", domain: "dhl.com", abbr: "DHL", color: "#FFCC00" },
];

// Double for seamless loop
const all = [...partners, ...partners];

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
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, #fff, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(-90deg, #fff, transparent)" }} />
        <div className="ticker-track">
          {all.map((p, i) => (
            <PartnerLogo key={i} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerLogo({ partner }: { partner: typeof partners[0] }) {
  const isDark = partner.color !== "#FFCC00";
  return (
    <span className="mx-8 flex items-center gap-3 whitespace-nowrap select-none">
      {/* Logo container — shows real logo, falls back to text badge via CSS */}
      <span
        className="relative flex-shrink-0 rounded overflow-hidden"
        style={{ width: "36px", height: "30px" }}
      >
        {/* Fallback badge shown behind */}
        <span
          className="absolute inset-0 flex items-center justify-center text-center"
          style={{
            background: partner.color,
            color: isDark ? "#fff" : "#1a1c1c",
            fontSize: partner.abbr.length > 2 ? "6.5px" : "8px",
            fontWeight: 900,
            letterSpacing: "0.02em",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {partner.abbr}
        </span>
        {/* Real logo from Clearbit — overlays the fallback; if it fails, fallback shows */}
        <img
          src={`https://logo.clearbit.com/${partner.domain}`}
          alt={partner.name}
          width={36}
          height={30}
          className="absolute inset-0 w-full h-full object-contain bg-white p-0.5"
          style={{ zIndex: 1 }}
          onError={(e) => {
            // Hide img so fallback shows through
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
          loading="lazy"
        />
      </span>
      <span
        className="font-black"
        style={{ fontSize: "13px", color: "rgba(26,28,29,0.32)", letterSpacing: "-0.01em" }}
      >
        {partner.name}
      </span>
    </span>
  );
}
