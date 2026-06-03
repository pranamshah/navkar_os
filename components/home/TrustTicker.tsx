"use client";

const LOGOS: Record<string, string> = {
  "MAERSK":       "https://logo.clearbit.com/maersk.com",
  "HAPAG-LLOYD":  "https://logo.clearbit.com/hapag-lloyd.com",
  "CMA CGM":      "https://logo.clearbit.com/cma-cgm.com",
  "MSC":          "https://logo.clearbit.com/msc.com",
  "DHL":          "https://logo.clearbit.com/dhl.com",
  "EVERGREEN":    "https://logo.clearbit.com/evergreen-line.com",
  "COSCO":        "https://logo.clearbit.com/cosco.com",
  "TALLY PRIME":  "https://logo.clearbit.com/tallysolutions.com",
  "RAZORPAY":     "https://logo.clearbit.com/razorpay.com",
  "WHATSAPP":     "https://logo.clearbit.com/whatsapp.com",
  "GSTN":         "https://logo.clearbit.com/gst.gov.in",
  "ICEGATE":      "https://www.icegate.gov.in/favicon.ico",
};

const partners = [
  "MAERSK",
  "HAPAG-LLOYD",
  "CMA CGM",
  "MSC",
  "DHL",
  "EVERGREEN",
  "COSCO",
  "TALLY PRIME",
  "RAZORPAY",
  "WHATSAPP",
  "GSTN",
  "ICEGATE",
];

const all = [...partners, ...partners];

function LogoItem({ name }: { name: string }) {
  return (
    <span className="mx-8 flex items-center gap-3 whitespace-nowrap select-none">
      <div
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderRadius: 8,
          padding: 4,
          border: "1px solid #e5e7eb",
        }}
      >
        <img
          src={LOGOS[name]}
          alt={name}
          width={32}
          height={32}
          loading="lazy"
          style={{ objectFit: "contain" }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
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
