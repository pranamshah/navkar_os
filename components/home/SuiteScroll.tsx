"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { suite } from "@/data/homepage";
import {
  Navigation, Gavel, Warehouse, Truck, Landmark, Globe,
  X, Maximize2, Play, Receipt, Zap,
  ArrowLeftRight, Lightbulb, FileText, Monitor, MessageCircle,
  CreditCard, TrendingUp, Network, RefreshCw, Users, Link2,
  Send, Calculator, Bell, Search, Lock, PiggyBank, Shield,
  LayoutGrid, Clock, MapPin, BarChart2, AlertTriangle,
  Gauge, Route, ShieldCheck, Fuel, Smartphone, GitBranch,
  Settings, Upload, ClipboardCheck, Percent, List,
  CheckCircle, SlidersHorizontal, Calendar, FolderOpen, Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const COLORS: Record<string, string> = {
  nexlog:     "#1565C0",
  entryx:     "#5B21B6",
  dockiq:     "#0D7057",
  rundesk:    "#92400E",
  accura:     "#1A237E",
  tradepilot: "#004D40",
};

const ICONS: Record<string, LucideIcon> = {
  nexlog:     Navigation,
  entryx:     Gavel,
  dockiq:     Warehouse,
  rundesk:    Truck,
  accura:     Landmark,
  tradepilot: Globe,
};

const STAT_CHIPS: Record<string, string> = {
  nexlog:     "Booking → Delivery",
  entryx:     "AI BE Preparation",
  dockiq:     "Gate-In to Delivery",
  rundesk:    "LR to GST Invoice",
  accura:     "Auto GSTR-1 Export",
  tradepilot: "Landed Cost + FTA",
};

interface Feature { label: string; Icon: LucideIcon; }

const FEATURES: Record<string, Feature[]> = {
  nexlog: [
    { label: "Full job lifecycle — booking to BL",          Icon: ArrowLeftRight },
    { label: "AI reads BLs, AWBs & container docs",        Icon: Lightbulb },
    { label: "GST invoice generated in 3 clicks",           Icon: Receipt },
    { label: "White-label client tracking portal",          Icon: Monitor },
    { label: "Real-time WhatsApp container alerts",         Icon: MessageCircle },
    { label: "DO / NOC generation built-in",                Icon: FileText },
    { label: "Vendor payment & cost sheet per job",         Icon: CreditCard },
    { label: "Per-job profitability dashboard",             Icon: TrendingUp },
    { label: "Multi-port & multi-line support",             Icon: Network },
    { label: "Container status auto-updated via EDI",       Icon: RefreshCw },
    { label: "Joint shipments & co-loader billing",         Icon: Users },
    { label: "Integrated with Accura for zero re-entry",    Icon: Link2 },
  ],
  entryx: [
    { label: "BE preparation with AI document assist",      Icon: Lightbulb },
    { label: "ICEGATE filing at all major Indian ports",    Icon: Send },
    { label: "Live duty calculation (CBIC tariff)",         Icon: Calculator },
    { label: "DGFT integration & SION lookup",              Icon: Network },
    { label: "OOC & examination alerts via WhatsApp",       Icon: Bell },
    { label: "Full HS code lookup & BCD / IGST checker",    Icon: Search },
    { label: "Secure document vault per shipment",          Icon: Lock },
    { label: "Multi-port, multi-user support",              Icon: Users },
    { label: "Drawback & MEIS/SEIS benefit tracker",        Icon: PiggyBank },
    { label: "Bond & MOOWR management",                     Icon: Shield },
    { label: "Duty credit scrip management",                Icon: CreditCard },
    { label: "Seamless data flow to Accura",                Icon: Link2 },
  ],
  dockiq: [
    { label: "Container gate-in & gate-out tracking",       Icon: ArrowLeftRight },
    { label: "Yard planning & slot allocation",             Icon: LayoutGrid },
    { label: "Automatic storage slab billing",              Icon: Clock },
    { label: "CFS invoice with GST in 1 click",             Icon: Receipt },
    { label: "Importer self-service tracking portal",       Icon: Search },
    { label: "Examination & stuffing tracking",             Icon: Search },
    { label: "Revenue & yard utilization dashboard",        Icon: BarChart2 },
    { label: "Custom MIS & SOA reports",                    Icon: FileText },
    { label: "Reefer & hazmat cargo handling",              Icon: AlertTriangle },
    { label: "Short-shipment & damage reports",             Icon: AlertTriangle },
    { label: "Multi-CFS & multi-location support",          Icon: MapPin },
    { label: "Connects to Nexlog for seamless flow",        Icon: Link2 },
  ],
  rundesk: [
    { label: "LR generation in under 30 seconds",           Icon: Gauge },
    { label: "Full trip management & milestones",           Icon: Route },
    { label: "Live GPS tracking via driver app",            Icon: MapPin },
    { label: "Vehicle compliance & RC/insurance alerts",    Icon: ShieldCheck },
    { label: "GST freight invoicing auto-generated",        Icon: Receipt },
    { label: "Fuel expense & advance tracking",             Icon: Fuel },
    { label: "Fleet utilization & earnings reports",        Icon: BarChart2 },
    { label: "Driver app with e-POD capture",               Icon: Smartphone },
    { label: "Multi-branch & multi-vehicle",                Icon: GitBranch },
    { label: "Tyre & maintenance tracking",                 Icon: Settings },
    { label: "Detention & demurrage billing",               Icon: Clock },
    { label: "Auto-syncs income to Accura",                 Icon: Link2 },
  ],
  accura: [
    { label: "Auto-posts income from every NavkarOS module",Icon: RefreshCw },
    { label: "GSTR-1 & GSTR-3B ready export",              Icon: Receipt },
    { label: "P&L statement generated in 3 seconds",        Icon: TrendingUp },
    { label: "Tally XML export — zero manual entry",        Icon: Upload },
    { label: "Per-job & per-client profitability",          Icon: BarChart2 },
    { label: "Bank reconciliation built-in",                Icon: Landmark },
    { label: "Multi-company & multi-branch",                Icon: Building2 },
    { label: "CAs get clean GST data, not raw dumps",       Icon: ClipboardCheck },
    { label: "Outstanding & aging reports",                 Icon: Clock },
    { label: "TDS & TCS management",                        Icon: Percent },
    { label: "Vendor payment workflows",                    Icon: CreditCard },
    { label: "Freight-native chart of accounts",            Icon: List },
  ],
  tradepilot: [
    { label: "Landed cost calculator with all duties",      Icon: Calculator },
    { label: "HSN Scout — HS code lookup & BCD/IGST",       Icon: Search },
    { label: "FTA benefit eligibility checker",             Icon: CheckCircle },
    { label: "RoDTEP & MEIS/SEIS tracker",                  Icon: PiggyBank },
    { label: "Document vault for all trade paperwork",      Icon: FolderOpen },
    { label: "Multi-agent shipment register",               Icon: Users },
    { label: "Live forex rates integration",                Icon: ArrowLeftRight },
    { label: "Custom duty optimizer",                       Icon: SlidersHorizontal },
    { label: "Import-export analytics dashboard",           Icon: BarChart2 },
    { label: "Compliance calendar & alerts",                Icon: Calendar },
    { label: "DGFT scheme tracking",                        Icon: Shield },
    { label: "Integrates with EntryX for BE data",          Icon: Link2 },
  ],
};

export default function SuiteSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = openId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openId]);

  const openProduct = suite.find((p) => p.id === openId);
  const openColor   = openId ? (COLORS[openId] ?? "#1E40AF") : "#1E40AF";
  const OpenIconComp = openId ? (ICONS[openId] ?? Globe) : Globe;
  const openFeats   = openId ? (FEATURES[openId] ?? []) : [];

  return (
    <section id="suite" className="px-8 lg:px-16 py-28">
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
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#1E40AF" }}>
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
              <span style={{ color: "#1E40AF" }}>Every Role Covered.</span>
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
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1E40AF"; e.currentTarget.style.borderColor = "#1E40AF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#1a1c1c"; e.currentTarget.style.borderColor = "#1a1c1c"; }}
            >
              Who uses each product →
            </a>
          </div>
        </motion.div>

        {/* 3×2 card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {suite.map((product, i) => {
            const color = COLORS[product.id] ?? "#1E40AF";
            const IconComp = ICONS[product.id] ?? Globe;
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
                  <IconComp size={20} style={{ color }} />
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
                    style={{ color: "#1E40AF" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1c1c"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#1E40AF"; }}
                  >
                    Get Pricing →
                  </Link>

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
                    <Maximize2 size={12} />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              style={{ background: "rgba(10,10,12,0.75)", backdropFilter: "blur(8px)" }}
              onClick={() => setOpenId(null)}
            >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
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
                style={{ background: "#1E40AF", borderBottom: `3px solid ${openColor}` }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${openColor}20`, border: `1px solid ${openColor}40` }}
                  >
                    <OpenIconComp size={26} style={{ color: openColor }} />
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
                  <X size={18} />
                </button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto flex-1">
                <div className="p-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

                  {/* Left: description + CTAs */}
                  <div>
                    <p className="text-sm mb-8" style={{ color: "#4c4546", lineHeight: 1.8 }}>
                      {openProduct.desc}
                    </p>

                    <div
                      className="flex items-center gap-3 p-4 mb-8 rounded-xl"
                      style={{ background: `${openColor}08`, border: `1px solid ${openColor}20` }}
                    >
                      <Zap size={20} style={{ color: openColor, flexShrink: 0 }} />
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
                        style={{ background: "#fff", color: "#1E40AF" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = openColor; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1E40AF"; }}
                        onClick={() => setOpenId(null)}
                      >
                        <Play size={14} />
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
                        <Receipt size={14} />
                        See Pricing Plans
                      </Link>
                    </div>

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
                            <feat.Icon size={13} style={{ color: openColor }} />
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
