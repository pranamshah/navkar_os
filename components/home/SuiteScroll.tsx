"use client";

import { useState, useEffect } from "react";
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

const STAT_CHIPS: Record<string, string> = {
  nexlog:     "Booking → Delivery",
  entryx:     "AI BE Preparation",
  dockiq:     "Gate-In to Delivery",
  rundesk:    "LR to GST Invoice",
  accura:     "Auto GSTR-1 Export",
  tradepilot: "Landed Cost + FTA",
};

interface Feature { label: string; icon: string; }

const FEATURES: Record<string, Feature[]> = {
  nexlog: [
    { label: "Full job lifecycle — booking to BL",          icon: "sync_alt" },
    { label: "AI reads BLs, AWBs & container docs",        icon: "psychology" },
    { label: "GST invoice generated in 3 clicks",           icon: "receipt_long" },
    { label: "White-label client tracking portal",          icon: "monitor" },
    { label: "Real-time WhatsApp container alerts",         icon: "whatsapp" },
    { label: "DO / NOC generation built-in",                icon: "description" },
    { label: "Vendor payment & cost sheet per job",         icon: "payments" },
    { label: "Per-job profitability dashboard",             icon: "trending_up" },
    { label: "Multi-port & multi-line support",             icon: "device_hub" },
    { label: "Container status auto-updated via EDI",       icon: "update" },
    { label: "Joint shipments & co-loader billing",         icon: "group_work" },
    { label: "Integrated with Accura for zero re-entry",    icon: "link" },
  ],
  entryx: [
    { label: "BE preparation with AI document assist",      icon: "psychology" },
    { label: "ICEGATE filing at all major Indian ports",    icon: "send" },
    { label: "Live duty calculation (CBIC tariff)",         icon: "calculate" },
    { label: "DGFT integration & SION lookup",              icon: "hub" },
    { label: "OOC & examination alerts via WhatsApp",       icon: "notifications_active" },
    { label: "Full HS code lookup & BCD / IGST checker",    icon: "search" },
    { label: "Secure document vault per shipment",          icon: "lock" },
    { label: "Multi-port, multi-user support",              icon: "groups" },
    { label: "Drawback & MEIS/SEIS benefit tracker",        icon: "savings" },
    { label: "Bond & MOOWR management",                     icon: "policy" },
    { label: "Duty credit scrip management",                icon: "credit_card" },
    { label: "Seamless data flow to Accura",                icon: "link" },
  ],
  dockiq: [
    { label: "Container gate-in & gate-out tracking",       icon: "swap_horiz" },
    { label: "Yard planning & slot allocation",             icon: "grid_view" },
    { label: "Automatic storage slab billing",              icon: "timer" },
    { label: "CFS invoice with GST in 1 click",             icon: "receipt_long" },
    { label: "Importer self-service tracking portal",       icon: "person_search" },
    { label: "Examination & stuffing tracking",             icon: "manage_search" },
    { label: "Revenue & yard utilization dashboard",        icon: "bar_chart" },
    { label: "Custom MIS & SOA reports",                    icon: "summarize" },
    { label: "Reefer & hazmat cargo handling",              icon: "thermostat" },
    { label: "Short-shipment & damage reports",             icon: "report_problem" },
    { label: "Multi-CFS & multi-location support",          icon: "location_on" },
    { label: "Connects to Nexlog for seamless flow",        icon: "link" },
  ],
  rundesk: [
    { label: "LR generation in under 30 seconds",           icon: "speed" },
    { label: "Full trip management & milestones",           icon: "route" },
    { label: "Live GPS tracking via driver app",            icon: "gps_fixed" },
    { label: "Vehicle compliance & RC/insurance alerts",    icon: "verified_user" },
    { label: "GST freight invoicing auto-generated",        icon: "receipt_long" },
    { label: "Fuel expense & advance tracking",             icon: "local_gas_station" },
    { label: "Fleet utilization & earnings reports",        icon: "bar_chart" },
    { label: "Driver app with e-POD capture",               icon: "smartphone" },
    { label: "Multi-branch & multi-vehicle",                icon: "account_tree" },
    { label: "Tyre & maintenance tracking",                 icon: "settings" },
    { label: "Detention & demurrage billing",               icon: "timer" },
    { label: "Auto-syncs income to Accura",                 icon: "link" },
  ],
  accura: [
    { label: "Auto-posts income from every NavkarOS module",icon: "sync" },
    { label: "GSTR-1 & GSTR-3B ready export",              icon: "receipt_long" },
    { label: "P&L statement generated in 3 seconds",        icon: "trending_up" },
    { label: "Tally XML export — zero manual entry",        icon: "upload" },
    { label: "Per-job & per-client profitability",          icon: "analytics" },
    { label: "Bank reconciliation built-in",                icon: "account_balance" },
    { label: "Multi-company & multi-branch",                icon: "corporate_fare" },
    { label: "CAs get clean GST data, not raw dumps",       icon: "fact_check" },
    { label: "Outstanding & aging reports",                 icon: "access_time" },
    { label: "TDS & TCS management",                        icon: "percent" },
    { label: "Vendor payment workflows",                    icon: "payments" },
    { label: "Freight-native chart of accounts",            icon: "list_alt" },
  ],
  tradepilot: [
    { label: "Landed cost calculator with all duties",      icon: "calculate" },
    { label: "HSN Scout — HS code lookup & BCD/IGST",       icon: "search" },
    { label: "FTA benefit eligibility checker",             icon: "check_circle" },
    { label: "RoDTEP & MEIS/SEIS tracker",                  icon: "savings" },
    { label: "Document vault for all trade paperwork",      icon: "folder_open" },
    { label: "Multi-agent shipment register",               icon: "groups" },
    { label: "Live forex rates integration",                icon: "currency_exchange" },
    { label: "Custom duty optimizer",                       icon: "tune" },
    { label: "Import-export analytics dashboard",           icon: "bar_chart" },
    { label: "Compliance calendar & alerts",                icon: "event" },
    { label: "DGFT scheme tracking",                        icon: "policy" },
    { label: "Integrates with EntryX for BE data",          icon: "link" },
  ],
};

export default function SuiteSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (openId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [openId]);

  const openProduct = suite.find((p) => p.id === openId);
  const openColor   = openId ? (COLORS[openId] ?? "#D4AF37") : "#D4AF37";
  const openIcon    = openId ? (ICONS[openId]  ?? "star")    : "star";
  const openFeats   = openId ? (FEATURES[openId] ?? [])      : [];

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
            const chip  = STAT_CHIPS[product.id] ?? "";

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

                <p className="flex-1 text-sm leading-relaxed" style={{ color: "#4c4546" }}>
                  {product.desc}
                </p>

                <div className="mt-5 mb-5">
                  <span
                    className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${color}10`, color }}
                  >
                    {chip}
                  </span>
                </div>

                {/* Footer row */}
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

                  {/* Expand button */}
                  <button
                    onClick={() => setOpenId(product.id)}
                    data-cursor
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{ background: `${color}10`, color }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = color;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${color}10`;
                      e.currentTarget.style.color = color;
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>expand_content</span>
                    Features
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Full-Screen Feature Modal ──────────────────────────────── */}
      <AnimatePresence>
        {openProduct && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(10,10,12,0.75)", backdropFilter: "blur(8px)" }}
              onClick={() => setOpenId(null)}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-50 overflow-hidden"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(1000px, 95vw)",
                maxHeight: "90vh",
                background: "#ffffff",
                boxShadow: "0 40px 120px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-8 py-6 flex-shrink-0"
                style={{ background: "#1a1c1c", borderBottom: `3px solid ${openColor}` }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${openColor}20`, border: `1px solid ${openColor}40` }}
                  >
                    <span className="material-symbols-outlined" style={{ color: openColor, fontSize: "26px" }}>
                      {openIcon}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {openProduct.tagline}
                    </p>
                    <h2
                      style={{
                        fontFamily: "'EB Garamond', Georgia, serif",
                        fontSize: "28px",
                        fontWeight: 400,
                        color: "#ffffff",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {openProduct.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setOpenId(null)}
                  data-cursor
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                </button>
              </div>

              {/* Modal body — scrollable */}
              <div className="overflow-y-auto flex-1">
                <div className="p-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

                  {/* Left: description + CTAs */}
                  <div>
                    <p className="text-sm mb-8" style={{ color: "#4c4546", lineHeight: 1.8 }}>
                      {openProduct.desc}
                    </p>

                    {/* Key stat */}
                    <div
                      className="flex items-center gap-3 p-4 mb-8 rounded-xl"
                      style={{ background: `${openColor}08`, border: `1px solid ${openColor}20` }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: openColor }}>bolt</span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: openColor }}>
                          Key Capability
                        </p>
                        <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>
                          {STAT_CHIPS[openProduct.id]}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/demo/${openProduct.id}`}
                        className="flex items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                        style={{ background: "#1a1c1c", color: "#D4AF37" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = openColor; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#D4AF37"; }}
                        onClick={() => setOpenId(null)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>play_circle</span>
                        View Interactive Demo
                      </Link>
                      <Link
                        href="/pricing"
                        className="flex items-center justify-center gap-2 py-3.5 border text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                        style={{ borderColor: `${openColor}40`, borderWidth: "1px", color: openColor, background: "transparent" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${openColor}08`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        onClick={() => setOpenId(null)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>receipt_long</span>
                        See Pricing Plans
                      </Link>
                    </div>

                    {/* Feature count badge */}
                    <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                        {openFeats.length} features included
                      </p>
                    </div>
                  </div>

                  {/* Right: Feature grid */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>
                      Everything included in {openProduct.name}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {openFeats.map((feat, i) => (
                        <motion.div
                          key={feat.label}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.25 }}
                          className="flex items-start gap-3 p-3 rounded-lg"
                          style={{ background: "#f9f9f9", border: "0.5px solid rgba(0,0,0,0.06)" }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: `${openColor}10` }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "14px", color: openColor }}
                            >
                              {feat.icon}
                            </span>
                          </div>
                          <span className="text-sm" style={{ color: "#1a1c1c", lineHeight: 1.5 }}>
                            {feat.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div
                className="px-8 py-4 flex items-center justify-between flex-shrink-0"
                style={{ background: "#f9f9f9", borderTop: "1px solid rgba(0,0,0,0.07)" }}
              >
                <p className="text-xs" style={{ color: "#7e7576" }}>
                  Part of the NavkarOS Suite · Free beta access
                </p>
                <button
                  onClick={() => setOpenId(null)}
                  className="text-xs font-semibold uppercase tracking-widest px-4 py-2 transition-all"
                  style={{ color: "#7e7576" }}
                  data-cursor
                >
                  Close ×
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
