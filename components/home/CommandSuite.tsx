"use client";

import { motion } from "framer-motion";
import { suite } from "@/data/homepage";

const moduleColors: Record<string, string> = {
  freightops: "#1565C0",
  docai: "#6A1B9A",
  billgen: "#1B5E20",
  clienthub: "#E65100",
  accountsos: "#1A237E",
  ratedesk: "#004D40",
  connectlayer: "#37474F",
};

const moduleIllustrations: Record<string, React.ReactNode> = {
  freightops: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="2" y="4" width="52" height="32" rx="3" fill="currentColor" opacity="0.1" />
      <rect x="6" y="8" width="44" height="5" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="6" y="16" width="30" height="3" rx="1.5" fill="currentColor" opacity="0.25" />
      <rect x="6" y="22" width="36" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
      <rect x="6" y="28" width="26" height="3" rx="1.5" fill="currentColor" opacity="0.15" />
      <circle cx="46" cy="27" r="7" fill="currentColor" opacity="0.15" />
      <polyline points="42,27 45,30 50,24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  docai: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="8" y="2" width="28" height="36" rx="3" fill="currentColor" opacity="0.1" />
      <rect x="12" y="8" width="20" height="2.5" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="12" y="13" width="16" height="2.5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="12" y="18" width="18" height="2.5" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="12" y="23" width="14" height="2.5" rx="1" fill="currentColor" opacity="0.15" />
      <path d="M38 20 Q46 12 52 20 Q46 28 38 20Z" fill="currentColor" opacity="0.2" />
      <circle cx="45" cy="20" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="45" cy="20" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  ),
  billgen: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="6" y="2" width="44" height="36" rx="3" fill="currentColor" opacity="0.1" />
      <rect x="10" y="8" width="20" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <text x="10" y="20" fontSize="10" fill="currentColor" opacity="0.5" fontWeight="bold">₹</text>
      <rect x="20" y="17" width="26" height="4" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="10" y="24" width="36" height="2.5" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="10" y="29" width="28" height="2.5" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="34" y="6" width="12" height="6" rx="1" fill="currentColor" opacity="0.25" />
      <text x="36" y="12" fontSize="7" fill="currentColor" opacity="0.7">GST</text>
    </svg>
  ),
  clienthub: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <circle cx="20" cy="16" r="7" fill="currentColor" opacity="0.15" />
      <circle cx="20" cy="16" r="4" fill="currentColor" opacity="0.25" />
      <path d="M8 36 Q8 26 20 26 Q32 26 32 36" fill="currentColor" opacity="0.1" />
      <rect x="34" y="8" width="18" height="6" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="34" y="17" width="18" height="6" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="34" y="26" width="18" height="6" rx="2" fill="currentColor" opacity="0.25" />
      <circle cx="44" cy="11" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="44" cy="20" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="44" cy="29" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  accountsos: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="4" y="4" width="48" height="32" rx="3" fill="currentColor" opacity="0.08" />
      <rect x="4" y="4" width="48" height="8" rx="3" fill="currentColor" opacity="0.15" />
      {[0,1,2].map(r => [0,1,2,3].map(c => (
        <rect key={`${r}-${c}`} x={8 + c*12} y={16 + r*8} width="10" height="5" rx="1" fill="currentColor" opacity={0.1 + r*0.05} />
      )))}
      <rect x="4" y="28" width="48" height="8" rx="0" fill="currentColor" opacity="0.12" />
    </svg>
  ),
  ratedesk: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <polyline points="6,34 16,24 24,28 36,14 50,18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="6" cy="34" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="16" cy="24" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="24" cy="28" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="36" cy="14" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="50" cy="18" r="3.5" fill="currentColor" opacity="0.5" />
      <line x1="6" y1="6" x2="6" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="4" y1="36" x2="52" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </svg>
  ),
  connectlayer: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <circle cx="12" cy="20" r="6" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
      <circle cx="44" cy="10" r="5" fill="currentColor" opacity="0.15" />
      <circle cx="44" cy="30" r="5" fill="currentColor" opacity="0.15" />
      <circle cx="28" cy="20" r="4" fill="currentColor" opacity="0.2" />
      <line x1="18" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.5" opacity="0.4" />
      <line x1="32" y1="20" x2="39" y2="13" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.5" opacity="0.4" />
      <line x1="32" y1="20" x2="39" y2="27" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1.5" opacity="0.4" />
    </svg>
  ),
};

export default function CommandSuite() {
  return (
    <section id="suite" className="px-8 lg:px-16 py-32" style={{ background: "#f3f3f3" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>
            Complete Logistics Command
          </p>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <h2
              className="md:max-w-sm"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(32px, 3.5vw, 44px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              One Platform.
              <br />
              Total Control.
            </h2>
            <div className="md:max-w-md">
              <p className="mb-6" style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.7 }}>
                Seven specialized modules designed to run every department of your
                logistics business from a single window — no switching products,
                no data silos, no double entry.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border-b cursor-none transition-colors duration-200"
                style={{ borderColor: "#1a1c1c", color: "#1a1c1c", paddingBottom: "2px" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#D4AF37";
                  e.currentTarget.style.borderColor = "#D4AF37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#1a1c1c";
                  e.currentTarget.style.borderColor = "#1a1c1c";
                }}
              >
                Explore Documentation
                <span style={{ fontSize: "14px" }}>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* All 7 modules — uniform 3-col grid (4 + 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {suite.slice(0, 4).map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 flex flex-col gap-5 cursor-none transition-all duration-400 group"
              style={{
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.04)";
              }}
            >
              {/* Illustration */}
              <div
                className="w-full h-20 flex items-center justify-center"
                style={{ color: moduleColors[mod.id] }}
              >
                {moduleIllustrations[mod.id]}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#D4AF37" }}>
                  {mod.tagline}
                </p>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "21px",
                    fontWeight: 400,
                    color: "#1a1c1c",
                  }}
                >
                  {mod.name}
                </h3>
                <p style={{ fontSize: "13px", color: "#4c4546", lineHeight: 1.65 }}>{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {suite.slice(4).map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 flex flex-col gap-4 cursor-none transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                borderLeft: "2px solid rgba(0,0,0,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderLeftColor = "#D4AF37";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                e.currentTarget.style.borderLeftColor = "rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Mini illustration */}
              <div className="w-full h-14 flex items-center" style={{ color: moduleColors[mod.id] }}>
                {moduleIllustrations[mod.id]}
              </div>

              <div>
                <h4
                  className="mb-1"
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "19px",
                    fontWeight: 400,
                    color: "#1a1c1c",
                  }}
                >
                  {mod.name}
                </h4>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>
                  {mod.tagline}
                </p>
                <p style={{ fontSize: "13px", color: "#4c4546", lineHeight: 1.65 }}>{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
