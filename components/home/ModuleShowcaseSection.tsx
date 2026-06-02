"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const modules = [
  {
    id: "freightops",
    label: "FreightOps",
    badge: "Live · 4 Active Jobs",
    badgeColor: "#16A34A",
    title: "Active Shipments",
    rows: [
      { a: "NOS/2026/0142", b: "INNSA → DEHAM", c: "Under Exam", color: "#D4AF37" },
      { a: "NOS/2026/0141", b: "INMAA → SGSIN", c: "OOC Cleared", color: "#16A34A" },
      { a: "NOS/2026/0139", b: "INCCU → USLAX", c: "On Vessel", color: "#3B82F6" },
      { a: "NOS/2026/0137", b: "INMUN → AEJEA", c: "At CFS", color: "#D4AF37" },
    ],
    colA: "Job No.", colB: "Route", colC: "Status",
    footer: "12 total jobs this month · 2 pending exam",
  },
  {
    id: "docai",
    label: "DocAI",
    badge: "AI · Reading",
    badgeColor: "#7C3AED",
    title: "Document Extraction",
    rows: [
      { a: "Bill of Lading", b: "Hapag-Lloyd", c: "✓ Extracted", color: "#16A34A" },
      { a: "Packing List", b: "Uploaded PDF", c: "✓ Extracted", color: "#16A34A" },
      { a: "Bill of Entry", b: "ICEGATE", c: "● Reading", color: "#D4AF37" },
      { a: "Commercial Inv.", b: "Exporter PDF", c: "Queued", color: "#7e7576" },
    ],
    colA: "Document", colB: "Source", colC: "Status",
    footer: "98.2% accuracy · 3.1s avg. extraction time",
  },
  {
    id: "billgen",
    label: "BillGen",
    badge: "GST · Invoice Ready",
    badgeColor: "#D4AF37",
    title: "Invoice INV-2026-0892",
    rows: [
      { a: "Ocean Freight", b: "FCL 20'", c: "₹78,500", color: "#1a1c1c" },
      { a: "THC Destination", b: "Hamburg Port", c: "₹12,200", color: "#1a1c1c" },
      { a: "Documentation", b: "BL Charges", c: "₹3,500", color: "#1a1c1c" },
      { a: "IGST @ 18%", b: "Auto-split", c: "₹17,136", color: "#D4AF37" },
    ],
    colA: "Item", colB: "Detail", colC: "Amount",
    footer: "Total ₹1,11,336 · Sent via WhatsApp",
  },
  {
    id: "clienthub",
    label: "ClientHub",
    badge: "Portal · 3 Online",
    badgeColor: "#0EA5E9",
    title: "Client Tracker",
    rows: [
      { a: "Mehta Exports", b: "NOS/2026/0142", c: "On Vessel", color: "#3B82F6" },
      { a: "Krishna Textiles", b: "NOS/2026/0141", c: "OOC Cleared", color: "#16A34A" },
      { a: "Patel Chemicals", b: "NOS/2026/0139", c: "At Port", color: "#D4AF37" },
      { a: "Rajvi Industries", b: "NOS/2026/0138", c: "Delivered", color: "#16A34A" },
    ],
    colA: "Client", colB: "Job", colC: "Status",
    footer: "4 clients tracking · 0 support calls today",
  },
  {
    id: "accountsos",
    label: "AccountsOS",
    badge: "Accounts · Balanced",
    badgeColor: "#059669",
    title: "P&L — June 2026",
    rows: [
      { a: "Revenue", b: "14 Invoices", c: "₹8,42,000", color: "#16A34A" },
      { a: "CFS Expenses", b: "Vendor Bills", c: "₹1,23,400", color: "#EF4444" },
      { a: "Staff Costs", b: "Salary + OT", c: "₹84,000", color: "#EF4444" },
      { a: "Net Profit", b: "After Tax", c: "₹6,34,600", color: "#D4AF37" },
    ],
    colA: "Head", colB: "Category", colC: "Amount",
    footer: "GSTR-1 export ready · Tally XML generated",
  },
  {
    id: "ratedesk",
    label: "RateDesk",
    badge: "Rates · 12 Active",
    badgeColor: "#F59E0B",
    title: "Rate Cards",
    rows: [
      { a: "INNSA→DEHAM", b: "Hapag-Lloyd", c: "$890/TEU", color: "#1a1c1c" },
      { a: "INMAA→SGSIN", b: "MSC", c: "$320/TEU", color: "#1a1c1c" },
      { a: "INCCU→USLAX", b: "Evergreen", c: "$1,240/TEU", color: "#D4AF37" },
      { a: "INMUN→AEJEA", b: "CMA CGM", c: "$460/TEU", color: "#1a1c1c" },
    ],
    colA: "Trade Lane", colB: "Carrier", colC: "Rate",
    footer: "Quote → Job in 1 click · Rates expire alert on",
  },
  {
    id: "connectlayer",
    label: "ConnectLayer",
    badge: "APIs · 5/6 Connected",
    badgeColor: "#6366F1",
    title: "Integration Status",
    rows: [
      { a: "ICEGATE", b: "Customs EDI", c: "● Live", color: "#16A34A" },
      { a: "GSTN", b: "Tax API", c: "● Live", color: "#16A34A" },
      { a: "WhatsApp API", b: "Notifications", c: "● Live", color: "#16A34A" },
      { a: "MarineTraffic", b: "Vessel Tracking", c: "● Live", color: "#16A34A" },
    ],
    colA: "Service", colB: "Type", colC: "Status",
    footer: "Razorpay payment link · Tally XML sync ready",
  },
];

export default function ModuleShowcaseSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((s) => (s + 1) % modules.length), 4000);
    return () => clearInterval(t);
  }, []);

  const mod = modules[active];

  return (
    <section
      className="w-full"
      style={{ background: "#f9f9f9", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}
    >
      <motion.div
        className="max-w-5xl mx-auto px-8 lg:px-16 py-24 flex flex-col gap-5"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Module tabs */}
        <div className="flex flex-wrap gap-2">
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-none"
              style={{
                background: i === active ? "#1a1c1c" : "rgba(0,0,0,0.05)",
                color: i === active ? "#fff" : "#7e7576",
                borderBottom: i === active ? "2px solid #D4AF37" : "2px solid transparent",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Browser window card */}
        <div
          style={{
            background: "#fff",
            border: "0.5px solid rgba(0,0,0,0.09)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.04)",
          }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-2 px-6 py-4 border-b"
            style={{ borderColor: "rgba(0,0,0,0.06)", background: "#fafafa" }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
            <span
              className="ml-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#7e7576" }}
            >
              navkaros.in/app/{mod.id}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="p-8"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "22px",
                    color: "#1a1c1c",
                    fontWeight: 400,
                  }}
                >
                  {mod.title}
                </h3>
                <span
                  className="font-semibold px-3 py-1"
                  style={{
                    background: `${mod.badgeColor}15`,
                    color: mod.badgeColor,
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {mod.badge}
                </span>
              </div>

              {/* Column headers */}
              <div
                className="grid grid-cols-3 pb-3 mb-1 border-b"
                style={{ borderColor: "rgba(0,0,0,0.07)" }}
              >
                {[mod.colA, mod.colB, mod.colC].map((c, i) => (
                  <span
                    key={i}
                    className={`text-xs font-semibold uppercase tracking-widest ${i === 2 ? "text-right" : ""}`}
                    style={{ color: "#7e7576" }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {mod.rows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="grid grid-cols-3 border-b"
                  style={{ borderColor: "rgba(0,0,0,0.04)", padding: "14px 0" }}
                >
                  <span className="text-sm font-semibold truncate pr-4" style={{ color: "#1a1c1c" }}>
                    {row.a}
                  </span>
                  <span className="text-sm truncate pr-4" style={{ color: "#7e7576" }}>
                    {row.b}
                  </span>
                  <span className="text-sm font-semibold text-right" style={{ color: row.color }}>
                    {row.c}
                  </span>
                </motion.div>
              ))}

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs" style={{ color: "#7e7576", letterSpacing: "0.02em" }}>
                  {mod.footer}
                </span>
                <a
                  href={`/demo/${mod.id}`}
                  className="text-xs font-semibold uppercase tracking-widest cursor-none transition-colors duration-200"
                  style={{ color: "#D4AF37" }}
                >
                  Demo →
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {modules.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-1 h-px rounded-full transition-all duration-300 cursor-none"
              style={{ background: i === active ? "#D4AF37" : "rgba(0,0,0,0.1)", height: "2px" }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
