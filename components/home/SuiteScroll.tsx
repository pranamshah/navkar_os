"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { suite } from "@/data/homepage";

const COLORS: Record<string, string> = {
  nexlog:     "#1565C0",
  entryx:     "#5B21B6",
  dockiq:     "#0D7057",
  rundesk:    "#92400E",
  accura:     "#1A237E",
  tradepilot: "#004D40",
};

const ICONS: Record<string, string> = {
  nexlog:     "navigation",
  entryx:     "gavel",
  dockiq:     "warehouse",
  rundesk:    "local_shipping",
  accura:     "account_balance",
  tradepilot: "public",
};

const STATS: Record<string, string> = {
  nexlog:     "Booking → Delivery",
  entryx:     "AI BE Preparation",
  dockiq:     "Gate-In to Delivery",
  rundesk:    "LR to GST Invoice",
  accura:     "Auto GSTR-1 Export",
  tradepilot: "Landed Cost + FTA",
};

export default function SuiteSection() {
  return (
    <section id="suite" className="px-8 lg:px-16 py-28" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col md:flex-row gap-10 items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>
              The NavkarOS Suite
            </p>
            <h2
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Six Products.
              <br />
              <span style={{ color: "#D4AF37" }}>Every Role Covered.</span>
            </h2>
          </div>
          <div className="md:max-w-sm">
            <p style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.75 }}>
              Purpose-built for each stakeholder in India's freight ecosystem. Use one standalone or connect them all — one job number, one data layer, zero re-entry.
            </p>
            <a
              href="#whoisfor"
              className="inline-flex items-center gap-2 mt-6 text-xs font-semibold uppercase tracking-widest border-b pb-0.5 transition-colors duration-200"
              style={{ borderColor: "#1a1c1c", color: "#1a1c1c" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#D4AF37"; e.currentTarget.style.borderColor = "#D4AF37"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#1a1c1c"; e.currentTarget.style.borderColor = "#1a1c1c"; }}
            >
              Who uses each product →
            </a>
          </div>
        </motion.div>

        {/* 3×2 card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {suite.map((product, i) => {
            const color = COLORS[product.id] ?? "#D4AF37";
            const icon  = ICONS[product.id]  ?? "star";
            const stat  = STATS[product.id]  ?? "";
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col p-8 transition-all duration-300"
                style={{
                  background: "#f9f9f9",
                  border: "0.5px solid rgba(0,0,0,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.09)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = `${color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9f9f9";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
                }}
              >
                {/* Top color accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                />

                {/* Icon badge */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ background: `${color}12`, border: `0.5px solid ${color}25` }}
                >
                  <span className="material-symbols-outlined" style={{ color, fontSize: "20px" }}>
                    {icon}
                  </span>
                </div>

                {/* Tagline + name */}
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#7e7576" }}>
                  {product.tagline}
                </p>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "24px",
                    fontWeight: 400,
                    color: "#1a1c1c",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {product.name}
                </h3>

                {/* Description */}
                <p className="flex-1 text-sm leading-relaxed" style={{ color: "#4c4546" }}>
                  {product.desc}
                </p>

                {/* Key capability chip */}
                <div className="mt-5 mb-5">
                  <span
                    className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${color}10`, color }}
                  >
                    {stat}
                  </span>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <Link
                    href={`/demo/${product.id}`}
                    className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                    style={{ color: "#D4AF37" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1c1c"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#D4AF37"; }}
                  >
                    View Demo →
                  </Link>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300" style={{ background: "rgba(0,0,0,0.04)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "12px", color: "#7e7576" }}>arrow_forward</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
