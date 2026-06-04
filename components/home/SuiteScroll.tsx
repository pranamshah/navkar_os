"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const FEATURES: Record<string, string[]> = {
  nexlog: [
    "Full shipment lifecycle from booking to BL",
    "AI reads BLs, AWBs & container documents",
    "GST invoicing generated in 3 clicks",
    "White-label client tracking portal",
    "Real-time WhatsApp container updates",
    "DO / NOC generation built-in",
    "Vendor payment tracking per job",
    "Per-job profitability dashboard",
  ],
  entryx: [
    "BE preparation with AI document assist",
    "ICEGATE filing at all major Indian ports",
    "Live duty calculation with CBIC tariff",
    "DGFT integration & SION lookup",
    "OOC alerts via WhatsApp & email",
    "Complete HS code lookup & checker",
    "Secure document vault per shipment",
    "Multi-port, multi-user support",
  ],
  dockiq: [
    "Container gate-in & gate-out tracking",
    "Yard planning & slot allocation",
    "Automatic storage slab billing",
    "CFS invoice generation with GST",
    "Importer self-service portal",
    "Examination & stuffing tracking",
    "Revenue & yard utilization dashboard",
    "Custom MIS reports & exports",
  ],
  rundesk: [
    "LR generation in under 30 seconds",
    "Full trip management & milestones",
    "Live GPS tracking via driver app",
    "Vehicle compliance & RC/insurance alerts",
    "GST freight invoicing auto-generated",
    "Fuel expense & advance tracking",
    "Fleet utilization & earnings reports",
    "Multi-branch & multi-vehicle support",
  ],
  accura: [
    "Auto-posts income from every NavkarOS module",
    "GSTR-1 & GSTR-3B ready export",
    "P&L reports generated in 3 seconds",
    "Tally XML export — no manual entry",
    "Per-job & per-client profitability",
    "Bank reconciliation built-in",
    "Multi-company & multi-branch",
    "CA-ready clean data, not raw dumps",
  ],
  tradepilot: [
    "Landed cost calculator with all duties",
    "HSN Scout — HS code lookup & BCD/IGST",
    "FTA benefit eligibility checker",
    "RoDTEP & MEIS/SEIS tracker",
    "Document vault for all trade paperwork",
    "Multi-agent shipment register",
    "Custom duty optimizer",
    "Live forex rates integration",
  ],
};

export default function SuiteSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const expandedProduct = expandedId ? suite.find((p) => p.id === expandedId) : null;
  const expandedColor   = expandedId ? (COLORS[expandedId] ?? "#D4AF37") : "#D4AF37";
  const expandedIcon    = expandedId ? (ICONS[expandedId]  ?? "star")    : "star";
  const expandedFeats   = expandedId ? (FEATURES[expandedId] ?? [])      : [];

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
            const color     = COLORS[product.id] ?? "#D4AF37";
            const icon      = ICONS[product.id]  ?? "star";
            const stat      = STATS[product.id]  ?? "";
            const isExpanded = expandedId === product.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col p-8 transition-all duration-300"
                style={{
                  background: isExpanded ? "#fff" : "#f9f9f9",
                  border: isExpanded ? `1px solid ${color}35` : "0.5px solid rgba(0,0,0,0.08)",
                  boxShadow: isExpanded ? `0 20px 48px rgba(0,0,0,0.09)` : "none",
                  transform: isExpanded ? "translateY(-4px)" : "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.09)";
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.borderColor = `${color}30`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = "#f9f9f9";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
                  }
                }}
              >
                {/* Top color accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${color}, transparent)`,
                    opacity: isExpanded ? 1 : 0,
                  }}
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
                    href="/pricing"
                    className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                    style={{ color: "#D4AF37" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1c1c"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#D4AF37"; }}
                  >
                    Get Pricing →
                  </Link>
                  {/* Expand / Collapse arrow */}
                  <button
                    onClick={() => toggle(product.id)}
                    data-cursor
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isExpanded ? color : "rgba(0,0,0,0.04)",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    aria-label={isExpanded ? "Collapse" : "Expand features"}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px", color: isExpanded ? "#fff" : "#7e7576" }}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Expanded Feature Panel ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          {expandedProduct && (
            <motion.div
              key={expandedProduct.id}
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="mt-5 p-8 lg:p-12"
                style={{
                  background: "#f9f9f9",
                  border: `1px solid ${expandedColor}20`,
                  borderTop: `3px solid ${expandedColor}`,
                }}
              >
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                  {/* Left: Product intro */}
                  <div className="lg:w-80 flex-shrink-0">
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: `${expandedColor}15`, border: `1px solid ${expandedColor}25` }}
                      >
                        <span className="material-symbols-outlined" style={{ color: expandedColor, fontSize: "26px" }}>
                          {expandedIcon}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                          {expandedProduct.tagline}
                        </p>
                        <h3
                          style={{
                            fontFamily: "'EB Garamond', Georgia, serif",
                            fontSize: "28px",
                            fontWeight: 400,
                            color: "#1a1c1c",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {expandedProduct.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm mb-8" style={{ color: "#4c4546", lineHeight: 1.75 }}>
                      {expandedProduct.desc}
                    </p>

                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/demo/${expandedProduct.id}`}
                        className="flex items-center justify-center gap-2 py-3 px-6 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                        style={{ background: "#1a1c1c", color: "#D4AF37" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = expandedColor; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#D4AF37"; }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>play_circle</span>
                        View Demo
                      </Link>
                      <Link
                        href="/pricing"
                        className="flex items-center justify-center gap-2 py-3 px-6 border text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                        style={{ borderColor: `${expandedColor}40`, borderWidth: "0.5px", color: expandedColor }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${expandedColor}10`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>receipt_long</span>
                        See Pricing
                      </Link>
                    </div>
                  </div>

                  {/* Right: Feature list */}
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7e7576" }}>
                      What&apos;s included
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {expandedFeats.map((feat, i) => (
                        <motion.div
                          key={feat}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.06)" }}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: `${expandedColor}12` }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "12px", color: expandedColor }}>check</span>
                          </div>
                          <span className="text-sm" style={{ color: "#1a1c1c", lineHeight: 1.5 }}>{feat}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
