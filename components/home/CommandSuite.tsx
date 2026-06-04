"use client";

import { motion } from "framer-motion";
import { suite } from "@/data/homepage";

const illustrations: Record<string, React.ReactNode> = {
  nexlog: (
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
  entryx: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="8" y="2" width="28" height="36" rx="3" fill="currentColor" opacity="0.1" />
      <rect x="12" y="8" width="20" height="2.5" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="12" y="13" width="16" height="2.5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="12" y="18" width="18" height="2.5" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="12" y="23" width="14" height="2.5" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="38" y="10" width="14" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
      <text x="40" y="16" fontSize="5.5" fill="currentColor" opacity="0.8" fontWeight="bold">CBIC</text>
      <line x1="36" y1="14" x2="39" y2="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" opacity="0.4" />
    </svg>
  ),
  dockiq: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="4" y="18" width="48" height="18" rx="2" fill="currentColor" opacity="0.1" />
      {[0,1,2,3].map(i => (
        <rect key={i} x={6 + i*12} y={20} width="10" height="14" rx="1" fill="currentColor" opacity={0.15 + i*0.05} stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
      ))}
      <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="12" y1="4" x2="44" y2="4" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <line x1="44" y1="4" x2="44" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="28" y1="4" x2="28" y2="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.3" />
    </svg>
  ),
  rundesk: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="2" y="18" width="38" height="14" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="38" y="22" width="16" height="10" rx="1" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="34" r="5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="34" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="40" cy="34" r="5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy="34" r="2.5" fill="currentColor" opacity="0.4" />
      <polyline points="6,28 18,16 42,16" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="38" cy="10" r="4" fill="currentColor" opacity="0.3" />
      <line x1="38" y1="6" x2="38" y2="3" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </svg>
  ),
  accura: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <rect x="4" y="4" width="48" height="32" rx="3" fill="currentColor" opacity="0.08" />
      <rect x="4" y="4" width="48" height="8" rx="3" fill="currentColor" opacity="0.15" />
      {[0,1,2].map(r => [0,1,2,3].map(c => (
        <rect key={`${r}-${c}`} x={8 + c*12} y={16 + r*7} width="10" height="5" rx="1" fill="currentColor" opacity={0.1 + r*0.05} />
      )))}
      <text x="32" y="13" fontSize="6" fill="currentColor" opacity="0.6" fontWeight="bold">₹</text>
    </svg>
  ),
  tradepilot: (
    <svg viewBox="0 0 56 40" fill="none" className="w-full h-full">
      <circle cx="28" cy="20" r="16" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" />
      <ellipse cx="28" cy="20" rx="7" ry="16" stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="none" />
      <line x1="12" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <line x1="14" y1="13" x2="42" y2="13" stroke="currentColor" strokeWidth="0.6" opacity="0.15" />
      <line x1="14" y1="27" x2="42" y2="27" stroke="currentColor" strokeWidth="0.6" opacity="0.15" />
      <circle cx="28" cy="20" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="18" cy="14" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="38" cy="26" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
};

export default function CommandSuite() {
  return (
    <section id="suite" className="px-8 lg:px-16 py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>
            The NavkarOS Suite
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
              Six Products.
              <br />
              Every Role Covered.
            </h2>
            <div className="md:max-w-md">
              <p className="mb-6" style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.7 }}>
                Each product is purpose-built for a specific stakeholder in India's logistics chain. Use one standalone or connect them all — every product shares one job number, one data layer, zero re-entry.
              </p>
              <a
                href="#whoisfor"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border-b transition-colors duration-200"
                style={{ borderColor: "#1a1c1c", color: "#1a1c1c", paddingBottom: "2px" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#D4AF37"; e.currentTarget.style.borderColor = "#D4AF37"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#1a1c1c"; e.currentTarget.style.borderColor = "#1a1c1c"; }}
              >
                Who uses each product →
              </a>
            </div>
          </div>
        </div>

        {/* 3+3 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suite.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 flex flex-col gap-5 transition-all duration-300 group"
              style={{ background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.04)";
              }}
            >
              <div className="w-full h-20 flex items-center justify-center" style={{ color: mod.color }}>
                {illustrations[mod.id]}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
                  {mod.tagline}
                </p>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 400,
                    color: "#1a1c1c",
                  }}
                >
                  {mod.name}
                </h3>
                <p style={{ fontSize: "13px", color: "#4c4546", lineHeight: 1.65 }}>{mod.desc}</p>
              </div>
              <div className="mt-auto pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <a
                  href={`/demo/${mod.id}`}
                  className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                  style={{ color: "#D4AF37" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1c1c"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#D4AF37"; }}
                >
                  View Demo →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
