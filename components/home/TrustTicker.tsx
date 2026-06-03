"use client";

const companyLogos: Record<string, string> = {
  "MAERSK":             "maersk.com",
  "HAPAG-LLOYD":        "hapag-lloyd.com",
  "CMA CGM":            "cma-cgm.com",
  "MSC":                "msc.com",
  "ADANI PORTS":        "adaniports.com",
  "JNPT":               "jnpt.gov.in",
  "ICEGATE":            "icegate.gov.in",
  "TALLY PRIME":        "tallysolutions.com",
  "RAZORPAY":           "razorpay.com",
  "DHL":                "dhl.com",
  "EVERGREEN":          "evergreen-marine.com",
  "COSCO":              "cosco.com",
};

const partners = [
  "MAERSK",
  "HAPAG-LLOYD",
  "CMA CGM",
  "MSC",
  "ADANI PORTS",
  "JNPT",
  "ICEGATE",
  "TALLY PRIME",
  "RAZORPAY",
  "DHL",
  "EVERGREEN",
  "COSCO",
];

// Doubled for seamless infinite scroll
const all = [...partners, ...partners];

function LogoItem({ name }: { name: string }) {
  const domain = companyLogos[name];
  const clearbitSrc = `https://logo.clearbit.com/${domain}`;
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1c1c&color=D4AF37&size=64&bold=true&font-size=0.35`;

  return (
    <span className="mx-8 flex items-center gap-3 whitespace-nowrap select-none">
      <span
        className="flex-shrink-0 rounded overflow-hidden bg-white flex items-center justify-center"
        style={{ width: "36px", height: "28px", border: "0.5px solid rgba(0,0,0,0.08)" }}
      >
        <img
          src={clearbitSrc}
          alt={name}
          width={64}
          height={64}
          loading="lazy"
          style={{ width: "32px", height: "24px", objectFit: "contain" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackSrc;
          }}
        />
      </span>
      <span
        className="font-black"
        style={{ fontSize: "13px", color: "rgba(26,28,29,0.32)", letterSpacing: "-0.01em" }}
      >
        {name}
      </span>
    </span>
  );
}

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
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg,#fff,transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(-90deg,#fff,transparent)" }} />
        <div className="ticker-track">
          {all.map((name, i) => (
            <LogoItem key={i} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
