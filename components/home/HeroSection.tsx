"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { AuroraBackground } from "@/components/ui/aurora-background";

const RotatingEarth = dynamic(() => import("@/components/ui/wireframe-dotted-globe"), { ssr: false });

function RibbonCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const ribbons = [
        { color: "rgba(212,175,55,0.45)", lw: 1 },
        { color: "rgba(212,175,55,0.15)", lw: 0.6 },
        { color: "rgba(212,175,55,0.07)", lw: 0.4 },
      ];

      ribbons.forEach((r, j) => {
        ctx.beginPath();
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.lw;
        const yBase = height * 0.52 + j * 35;
        ctx.moveTo(-60, yBase);
        for (let x = -60; x <= width + 60; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.0018 + time * 0.45 + j * 0.9) * 55 +
            Math.sin(x * 0.0009 - time * 0.28 + j * 1.4) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      time += 0.012;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

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

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

export default function HeroSection() {
  return (
    <AuroraBackground className="items-center">
      <RibbonCanvas />

      <div
        className="relative w-full max-w-7xl mx-auto px-8 lg:px-16 grid lg:grid-cols-12 gap-8 items-center"
        style={{ zIndex: 2 }}
      >
        {/* Left */}
        <motion.div
          className="lg:col-span-6 pt-28 pb-12 lg:pt-0 lg:pb-0"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="mb-7">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ background: "#e8e8e8", color: "#4c4546" }}
            >
              Built for Every Logistics Business · Free Beta
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mb-8 leading-tight"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(44px, 5.5vw, 72px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
            }}
          >
            One Platform for
            <br />
            <span style={{ color: "#D4AF37" }}>Modern Logistics.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg mb-12 leading-relaxed"
            style={{ fontSize: "17px", fontWeight: 300, color: "#4c4546", lineHeight: 1.75 }}
          >
            From shipment creation to customs clearance, GST invoicing to
            client communication — NavkarOS unifies every workflow across your
            entire logistics operation.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
            <a
              href="/signup"
              className="px-10 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none inline-block"
              style={{ background: "#1a1c1c", color: "#fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#D4AF37";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1a1c1c";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Start Free Trial
            </a>
            <a
              href="/demo/freightops"
              className="px-10 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none inline-block"
              style={{ borderColor: "#1a1c1c", borderWidth: "0.5px", color: "#1a1c1c" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a1c1c";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#1a1c1c";
              }}
            >
              Watch Demo
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 flex items-center gap-10">
            {[
              { val: "500+", label: "Businesses Live" },
              { val: "12k+", label: "Shipments Tracked" },
              { val: "14hrs", label: "Saved Weekly" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-semibold text-2xl" style={{ color: "#1a1c1c", letterSpacing: "-0.02em" }}>
                  {s.val}
                </p>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#7e7576" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Globe */}
        <motion.div
          className="lg:col-span-6 hidden lg:flex items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <RotatingEarth width={520} height={520} />
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
