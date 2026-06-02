"use client";

import { useState } from "react";

const partners = [
  { name: "MAERSK", domain: "maersk.com", color: "#00243D" },
  { name: "HAPAG-LLOYD", domain: "hapag-lloyd.com", color: "#E2700A" },
  { name: "CMA CGM", domain: "cma-cgm.com", color: "#003B7A" },
  { name: "MSC", domain: "msc.com", color: "#0058A6" },
  { name: "ADANI PORTS", domain: "adaniports.com", color: "#1B4F9C" },
  { name: "TALLY PRIME", domain: "tallysolutions.com", color: "#0052CC" },
  { name: "RAZORPAY", domain: "razorpay.com", color: "#072654" },
  { name: "DHL", domain: "dhl.com", color: "#FFCC00" },
  { name: "MAERSK", domain: "maersk.com", color: "#00243D" },
  { name: "HAPAG-LLOYD", domain: "hapag-lloyd.com", color: "#E2700A" },
  { name: "CMA CGM", domain: "cma-cgm.com", color: "#003B7A" },
  { name: "MSC", domain: "msc.com", color: "#0058A6" },
  { name: "ADANI PORTS", domain: "adaniports.com", color: "#1B4F9C" },
  { name: "TALLY PRIME", domain: "tallysolutions.com", color: "#0052CC" },
  { name: "RAZORPAY", domain: "razorpay.com", color: "#072654" },
  { name: "DHL", domain: "dhl.com", color: "#FFCC00" },
];

function LogoItem({ partner }: { partner: typeof partners[0] }) {
  const [failed, setFailed] = useState(false);
  const initials = partner.name.slice(0, 3);

  return (
    <span className="mx-8 flex items-center gap-2.5 whitespace-nowrap select-none">
      <span
        className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{
          background: failed ? (partner.color === "#FFCC00" ? partner.color : partner.color + "22") : "#fff",
          border: `0.5px solid ${partner.color}44`,
        }}
      >
        {!failed ? (
          <img
            src={`https://logo.clearbit.com/${partner.domain}`}
            alt={partner.name}
            width={24}
            height={24}
            style={{ objectFit: "contain", width: "24px", height: "24px" }}
            onError={() => setFailed(true)}
          />
        ) : (
          <span
            style={{
              fontSize: "7px",
              fontWeight: 900,
              letterSpacing: 0,
              color: partner.color === "#FFCC00" ? "#1a1c1c" : partner.color,
            }}
          >
            {initials}
          </span>
        )}
      </span>
      <span
        className="font-black text-base"
        style={{ color: "rgba(26,28,29,0.35)", letterSpacing: "-0.02em" }}
      >
        {partner.name}
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
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #ffffff, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #ffffff, transparent)" }}
        />
        <div className="ticker-track">
          {partners.map((partner, i) => (
            <LogoItem key={i} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
