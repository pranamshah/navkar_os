"use client";

const LOGOS: { name: string; src: string; bg: string }[] = [
  { name: "MAERSK",       src: "/logos/maersk.svg",    bg: "#42B0D5" },
  { name: "HAPAG-LLOYD",  src: "/logos/hapag.svg",     bg: "#003A70" },
  { name: "CMA CGM",      src: "/logos/cmacgm.svg",    bg: "#003087" },
  { name: "MSC",          src: "/logos/msc.svg",        bg: "#003087" },
  { name: "DHL",          src: "/logos/dhl.svg",        bg: "#FFCC00" },
  { name: "EVERGREEN",    src: "/logos/evergreen.svg",  bg: "#006400" },
  { name: "COSCO",        src: "/logos/cosco.svg",      bg: "#CC0000" },
  { name: "TALLY PRIME",  src: "/logos/tally.svg",      bg: "#0A4DA1" },
  { name: "RAZORPAY",     src: "/logos/razorpay.svg",   bg: "#072654" },
  { name: "WHATSAPP",     src: "/logos/whatsapp.svg",   bg: "#25D366" },
  { name: "GSTN",         src: "/logos/gstn.svg",       bg: "#FF6B00" },
  { name: "ICEGATE",      src: "/logos/icegate.svg",    bg: "#1A3C6E" },
];

const all = [...LOGOS, ...LOGOS];

function LogoItem({ item }: { item: typeof LOGOS[number] }) {
  return (
    <span className="mx-8 flex items-center gap-3 whitespace-nowrap select-none">
      <div
        style={{
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: item.bg,
          borderRadius: 8,
          padding: 6,
          flexShrink: 0,
        }}
      >
        <img
          src={item.src}
          alt={item.name}
          width={32}
          height={32}
          loading="lazy"
          style={{ objectFit: "contain", width: 32, height: 32 }}
        />
      </div>
      <span
        className="font-black"
        style={{ fontSize: "13px", color: "rgba(26,28,29,0.38)", letterSpacing: "-0.01em" }}
      >
        {item.name}
      </span>
    </span>
  );
}

export default function TrustTicker() {
  return (
    <section
      className="py-10 border-y overflow-hidden"
      style={{ borderColor: "rgba(196,199,200,0.35)" }}
    >
      <p
        className="text-center text-xs font-semibold uppercase tracking-widest mb-6"
        style={{ color: "#5d5f5f" }}
      >
        Integrated with India&apos;s logistics infrastructure
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg,#fff,transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg,#fff,transparent)" }} />
        <div className="ticker-track">
          {all.map((item, i) => (
            <LogoItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
