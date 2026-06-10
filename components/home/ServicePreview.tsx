"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const services = [
  {
    id: "nexlog",
    name: "Nexlog",
    tagline: "Freight Forwarding",
    color: "#1565C0",
    badge: "● Live",
    badgeColor: "#16A34A",
    rows: [
      { a: "NXL/2026/0142", b: "INNSA → DEHAM", c: "Under Exam", cv: "#D4AF37" },
      { a: "NXL/2026/0141", b: "INMAA → SGSIN", c: "OOC Cleared", cv: "#16A34A" },
      { a: "NXL/2026/0139", b: "INCCU → USLAX", c: "On Vessel",   cv: "#3B82F6" },
    ],
    footer: "4 active jobs · 2 pending customs",
  },
  {
    id: "entryx",
    name: "EntryX",
    tagline: "Customs Clearance",
    color: "#5B21B6",
    badge: "ICEGATE",
    badgeColor: "#8B0000",
    rows: [
      { a: "BE/2026/0341",    b: "JNPT · FCL 20'", c: "Filed",    cv: "#16A34A" },
      { a: "Duty Calculated", b: "BCD + IGST",      c: "₹2,14,880", cv: "#1a1c1c" },
      { a: "HS 8471.30",      b: "AI Verified",     c: "Ready",   cv: "#16A34A" },
    ],
    footer: "3 BEs filed today · 1 in queue",
  },
  {
    id: "dockiq",
    name: "DockIQ",
    tagline: "CFS & Warehouse",
    color: "#0D7057",
    badge: "Gate-In",
    badgeColor: "#0D7057",
    rows: [
      { a: "MSCU341829",    b: "Bay 04 · Slot 12", c: "Day 3",    cv: "#D4AF37" },
      { a: "Storage Slab",  b: "₹450/day",         c: "₹1,350",  cv: "#1a1c1c" },
      { a: "Importer Notif",b: "Auto-sent",         c: "Viewed",  cv: "#16A34A" },
    ],
    footer: "12 containers · ₹48,200 due",
  },
  {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transport & Fleet",
    color: "#92400E",
    badge: "GPS Live",
    badgeColor: "#92400E",
    rows: [
      { a: "LR/26/00891",  b: "JNPT → Bhiwandi", c: "In Transit", cv: "#D4AF37" },
      { a: "MH04 BX 7792", b: "45 km left",       c: "On Track",  cv: "#16A34A" },
      { a: "E-Way Bill",   b: "Auto-generated",   c: "Valid 2d",  cv: "#3B82F6" },
    ],
    footer: "6 trips active · 2 delivered today",
  },
  {
    id: "accura",
    name: "Accura",
    tagline: "Freight Accounting",
    color: "#1A237E",
    badge: "GST Ready",
    badgeColor: "#D4AF37",
    rows: [
      { a: "Ocean Freight",  b: "FCL 20'",     c: "₹78,500",     cv: "#1a1c1c" },
      { a: "IGST @ 18%",     b: "Auto-split",  c: "₹17,136",     cv: "#D4AF37" },
      { a: "GSTR-1 June",    b: "14 invoices", c: "Export Ready", cv: "#16A34A" },
    ],
    footer: "₹8.4L billed · ₹6.3L collected",
  },
  {
    id: "tradepilot",
    name: "TradePilot",
    tagline: "Importers & Exporters",
    color: "#004D40",
    badge: "Import",
    badgeColor: "#004D40",
    rows: [
      { a: "Landed Cost",   b: "CIF+Duty+CFS",  c: "₹5,42,000", cv: "#1a1c1c" },
      { a: "FTA India–UAE", b: "CEPA Check",    c: "Eligible",  cv: "#16A34A" },
      { a: "RoDTEP Credit", b: "Export benefit",c: "₹4,200",    cv: "#D4AF37" },
    ],
    footer: "2 active shipments · 1 FTA applied",
  },
];

function ServiceDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    const start = () => { t = setInterval(() => setActive((s) => (s + 1) % services.length), 3800); };
    const stop  = () => clearInterval(t);
    const onVisibility = () => document.hidden ? stop() : start();
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { stop(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const svc = services[active];

  return (
    <div className="h-full w-full flex" style={{ background: "#0f1010" }}>
      {/* LEFT: product list */}
      <div
        className="flex flex-col justify-center gap-1 px-4 py-4 overflow-y-auto"
        style={{ width: "220px", flexShrink: 0, borderRight: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          Products
        </p>
        {services.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
            style={{
              background: i === active ? "rgba(255,255,255,0.07)" : "transparent",
              border: i === active ? `0.5px solid ${s.color}40` : "0.5px solid transparent",
            }}
          >
            <div
              className="w-1.5 rounded-full flex-shrink-0"
              style={{ height: i === active ? "28px" : "12px", background: i === active ? s.color : "rgba(255,255,255,0.18)", transition: "all 0.3s" }}
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: i === active ? "#fff" : "rgba(255,255,255,0.45)" }}>
                {s.name}
              </p>
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>
                {s.tagline}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT: preview */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center gap-2 px-5 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#16A34A" }} />
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
            navkaros.in · {svc.name}
          </span>
          <span
            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: `${svc.badgeColor}18`, color: svc.badgeColor }}
          >
            {svc.badge}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={svc.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="flex-1 flex flex-col p-5"
          >
            {/* Header */}
            <div className="mb-5">
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {svc.tagline}
              </p>
              <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "22px", fontWeight: 400, color: "#fff" }}>
                {svc.name}
              </h3>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-3 pb-2 border-b mb-0.5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              {["Item", "Detail", "Status"].map((h, i) => (
                <span key={h} className={`text-xs font-semibold uppercase tracking-wider ${i === 2 ? "text-right" : ""}`} style={{ color: "rgba(255,255,255,0.3)" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Data rows */}
            {svc.rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="grid grid-cols-3 py-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <span className="text-xs font-semibold truncate pr-2" style={{ color: "rgba(255,255,255,0.85)" }}>{row.a}</span>
                <span className="text-xs truncate pr-2" style={{ color: "rgba(255,255,255,0.45)" }}>{row.b}</span>
                <span className="text-xs font-semibold text-right" style={{ color: row.cv }}>{row.c}</span>
              </motion.div>
            ))}

            {/* Footer */}
            <div className="mt-auto pt-4 flex items-center justify-between">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{svc.footer}</span>
              <Link
                href={`/demo/${svc.id}`}
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#D4AF37" }}
              >
                Full Demo →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{ height: "2px", background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            key={active}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.8, ease: "linear" }}
            style={{ height: "100%", background: svc.color }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ServicePreview() {
  return (
    <section id="product-preview">
      <ContainerScroll
        titleComponent={
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>
              See it in action
            </p>
            <h2
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(30px, 3.8vw, 50px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Live Previews.
              <br />
              <span style={{ color: "#D4AF37" }}>Every Product.</span>
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-sm" style={{ color: "#4c4546", lineHeight: 1.7 }}>
              Click any product to see real workflows — freight jobs, customs filing, CFS tracking, and more.
            </p>
          </div>
        }
      >
        <ServiceDemo />
      </ContainerScroll>
    </section>
  );
}
