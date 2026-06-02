"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
      { a: "NXL/2026/0139", b: "INCCU → USLAX", c: "On Vessel", cv: "#3B82F6" },
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
      { a: "BE/2026/0341", b: "JNPT · FCL 20'", c: "Filed", cv: "#16A34A" },
      { a: "Duty Calculated", b: "BCD + IGST", c: "₹2,14,880", cv: "#1a1c1c" },
      { a: "HS Code 8471.30", b: "AI Verified", c: "Ready", cv: "#16A34A" },
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
      { a: "MSCU341829", b: "Bay 04 · Slot 12", c: "Day 3", cv: "#D4AF37" },
      { a: "Storage Slab", b: "₹450/day", c: "₹1,350", cv: "#1a1c1c" },
      { a: "Importer Portal", b: "Auto-notified", c: "Viewed", cv: "#16A34A" },
    ],
    footer: "12 containers · ₹48,200 storage due",
  },
  {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transport & Fleet",
    color: "#92400E",
    badge: "GPS Live",
    badgeColor: "#92400E",
    rows: [
      { a: "LR/26/00891", b: "JNPT → Bhiwandi", c: "In Transit", cv: "#D4AF37" },
      { a: "MH04 BX 7792", b: "45 km left", c: "On Track", cv: "#16A34A" },
      { a: "E-Way Bill", b: "Auto-generated", c: "Valid 2 days", cv: "#3B82F6" },
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
      { a: "Ocean Freight", b: "FCL 20'", c: "₹78,500", cv: "#1a1c1c" },
      { a: "IGST @ 18%", b: "Auto-split", c: "₹17,136", cv: "#D4AF37" },
      { a: "GSTR-1 June", b: "14 invoices", c: "Export Ready", cv: "#16A34A" },
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
      { a: "Landed Cost", b: "CIF + Duty + CFS", c: "₹5,42,000", cv: "#1a1c1c" },
      { a: "FTA India–UAE", b: "CEPA Check", c: "Eligible", cv: "#16A34A" },
      { a: "RoDTEP Credit", b: "Export benefit", c: "₹4,200", cv: "#D4AF37" },
    ],
    footer: "2 active shipments · 1 FTA applied",
  },
];

export default function ServicePreview() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((s) => (s + 1) % services.length), 3800);
    return () => clearInterval(t);
  }, []);

  const svc = services[active];

  return (
    <section
      className="py-16 px-8 lg:px-16"
      style={{ background: "#f9f9f9" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p
          className="text-center text-xs font-semibold uppercase tracking-widest mb-10"
          style={{ color: "#7e7576" }}
        >
          See it in action
        </p>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* LEFT: product tabs */}
          <div className="flex flex-col gap-2">
            {services.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className="flex items-center gap-4 px-5 py-3.5 text-left transition-all duration-200 rounded-lg group"
                style={{
                  background: i === active ? "#fff" : "transparent",
                  boxShadow: i === active ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
                  border: i === active ? `0.5px solid rgba(0,0,0,0.08)` : "0.5px solid transparent",
                }}
              >
                {/* Color accent */}
                <div
                  className="w-1 rounded-full flex-shrink-0 transition-all duration-300"
                  style={{ height: i === active ? "36px" : "16px", background: i === active ? s.color : "rgba(0,0,0,0.12)" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: i === active ? "#1a1c1c" : "#7e7576" }}
                  >
                    {s.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: i === active ? "#4c4546" : "rgba(0,0,0,0.3)" }}
                  >
                    {s.tagline}
                  </p>
                </div>
                {i === active && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-auto text-xs font-semibold uppercase tracking-widest"
                    style={{ color: s.color }}
                  >
                    Live →
                  </motion.span>
                )}
              </button>
            ))}
          </div>

          {/* RIGHT: live preview card */}
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              background: "#fff",
              border: "0.5px solid rgba(0,0,0,0.1)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center gap-1.5 px-4 py-3 border-b"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "#fafafa" }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
              <span className="ml-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                navkaros.in · {svc.name}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="p-5"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
                      {svc.tagline}
                    </p>
                    <h3
                      style={{
                        fontFamily: "'EB Garamond', Georgia, serif",
                        fontSize: "20px",
                        fontWeight: 400,
                        color: "#1a1c1c",
                      }}
                    >
                      {svc.name}
                    </h3>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded"
                    style={{ background: `${svc.badgeColor}14`, color: svc.badgeColor }}
                  >
                    {svc.badge}
                  </span>
                </div>

                {/* Data rows */}
                <div
                  className="grid grid-cols-3 pb-2 mb-1 border-b"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  {["Item", "Detail", "Status"].map((h, i) => (
                    <span
                      key={h}
                      className={`text-xs font-semibold uppercase tracking-wider ${i === 2 ? "text-right" : ""}`}
                      style={{ color: "#7e7576" }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {svc.rows.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="grid grid-cols-3 py-2.5 border-b"
                    style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  >
                    <span className="text-xs font-semibold truncate pr-2" style={{ color: "#1a1c1c" }}>{row.a}</span>
                    <span className="text-xs truncate pr-2" style={{ color: "#7e7576" }}>{row.b}</span>
                    <span className="text-xs font-semibold text-right" style={{ color: row.cv }}>{row.c}</span>
                  </motion.div>
                ))}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#7e7576" }}>{svc.footer}</span>
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

            {/* Bottom: auto-progress bar */}
            <div style={{ height: "2px", background: "rgba(0,0,0,0.04)" }}>
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

        {/* Dot nav */}
        <div className="flex gap-2 justify-center mt-8">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "6px",
                height: "6px",
                background: i === active ? "#D4AF37" : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
