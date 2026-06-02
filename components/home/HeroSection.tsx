"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

const slides = [
  {
    id: "nexlog",
    label: "Nexlog · Active Jobs",
    badge: "● Live",
    badgeColor: "#16A34A",
    rows: [
      { a: "NXL/2026/0142", b: "INNSA → DEHAM", c: "Under Exam", color: "#D4AF37" },
      { a: "NXL/2026/0141", b: "INMAA → SGSIN", c: "OOC Cleared", color: "#16A34A" },
      { a: "NXL/2026/0139", b: "INCCU → USLAX", c: "On Vessel", color: "#3B82F6" },
      { a: "NXL/2026/0137", b: "INMUN → AEJEA", c: "At CFS", color: "#D4AF37" },
    ],
    footer: "4 jobs active · 2 pending customs",
  },
  {
    id: "accura",
    label: "Accura · Invoice Ready",
    badge: "GST",
    badgeColor: "#D4AF37",
    rows: [
      { a: "Ocean Freight", b: "FCL 20'", c: "₹78,500", color: "#1a1c1c" },
      { a: "THC Destination", b: "Hamburg Port", c: "₹12,200", color: "#1a1c1c" },
      { a: "Documentation", b: "BL Charges", c: "₹3,500", color: "#1a1c1c" },
      { a: "IGST @ 18%", b: "Auto-split", c: "₹17,136", color: "#D4AF37" },
    ],
    footer: "Total ₹1,11,336 · Sent via WhatsApp",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } } };

export default function HeroSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((s) => (s + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const slide = slides[active];

  return (
    <AuroraBackground
      className="min-h-screen w-full pt-24"
      showRadialGradient
      style={{ background: "#f9f9f9", alignItems: "flex-start" }}
    >
      <div className="relative w-full max-w-7xl mx-auto px-8 lg:px-16" style={{ zIndex: 2 }}>
        {/* Top grid: text left + globe right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-16 pb-10">
          {/* LEFT: text content */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="mb-7">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
                style={{ background: "#e8e8e8", color: "#4c4546" }}
              >
                NavkarOS · Free Beta — 6 Products, One Login
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6 leading-tight"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(40px, 5vw, 68px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              One OS.
              <br />
              Every Role.
              <br />
              <span style={{ color: "#D4AF37" }}>Indian Logistics,</span>
              <br />
              <span style={{ color: "#D4AF37" }}>Reimagined.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-lg mb-10"
              style={{ fontSize: "17px", fontWeight: 300, color: "#4c4546", lineHeight: 1.75 }}
            >
              Six specialized products — for freight forwarders, CHAs, CFS stations, transporters, accountants, and importers. Each works standalone. Each connects to every other.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="relative group overflow-hidden inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest cursor-none transition-all duration-200"
                style={{ background: "#1a1c1c", color: "#fff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D4AF37";
                  e.currentTarget.style.color = "#1a1c1c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1a1c1c";
                  e.currentTarget.style.color = "#fff";
                }}
              >
                Start Free Trial →
              </Link>
              <Link
                href="/demo/freightops"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest border cursor-none transition-all duration-200"
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
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex items-center gap-10">
              {[
                { val: "6", label: "Products in Suite" },
                { val: "14hrs", label: "Saved Weekly" },
                { val: "Free", label: "Beta Access" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-semibold text-2xl" style={{ color: "#1a1c1c", letterSpacing: "-0.02em" }}>{s.val}</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: "#7e7576" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Glow ring behind globe */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle at center, rgba(212,175,55,0.15) 0%, transparent 70%)",
                  transform: "scale(1.1)",
                }}
              />
              <RotatingEarth width={520} height={520} className="w-[520px] h-[520px]" />
              {/* Port label overlays */}
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(10,11,12,0.85)", color: "#D4AF37", backdropFilter: "blur(8px)", border: "0.5px solid rgba(212,175,55,0.3)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                16 major ports connected
              </div>
            </div>
          </motion.div>
        </div>

        {/* BELOW: 2-slide demo panel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pb-16"
        >
          <div
            className="relative overflow-hidden mx-auto"
            style={{
              background: "#fff",
              border: "0.5px solid rgba(0,0,0,0.1)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
              maxWidth: "860px",
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
              <span className="ml-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                navkaros.in/app
              </span>
              {/* Tabs */}
              <div className="ml-auto flex gap-0">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(i)}
                    className="px-4 py-1 text-xs font-semibold uppercase tracking-widest cursor-none transition-all duration-200"
                    style={{
                      background: i === active ? "#1a1c1c" : "transparent",
                      color: i === active ? "#fff" : "#7e7576",
                    }}
                  >
                    {s.label.split(" · ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "17px", color: "#1a1c1c" }}>
                    {slide.label}
                  </h3>
                  <span
                    className="text-xs font-semibold px-2 py-0.5"
                    style={{ background: `${slide.badgeColor}18`, color: slide.badgeColor }}
                  >
                    {slide.badge}
                  </span>
                </div>

                <div className="grid grid-cols-3 pb-1.5 mb-1 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  {["Item", "Detail", "Value"].map((h, i) => (
                    <span
                      key={h}
                      className={`text-xs font-semibold uppercase tracking-wider ${i === 2 ? "text-right" : ""}`}
                      style={{ color: "#7e7576" }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {slide.rows.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="grid grid-cols-3 py-2.5 border-b"
                    style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  >
                    <span className="text-xs font-semibold truncate pr-2" style={{ color: "#1a1c1c" }}>{row.a}</span>
                    <span className="text-xs truncate pr-2" style={{ color: "#7e7576" }}>{row.b}</span>
                    <span className="text-xs font-semibold text-right" style={{ color: row.color }}>{row.c}</span>
                  </motion.div>
                ))}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#7e7576" }}>{slide.footer}</span>
                  <Link
                    href={`/demo/${slide.id}`}
                    className="text-xs font-semibold uppercase tracking-widest cursor-none"
                    style={{ color: "#D4AF37" }}
                  >
                    Demo →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex gap-1.5 justify-center mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300 cursor-none"
                style={{
                  width: i === active ? "24px" : "6px",
                  height: "6px",
                  background: i === active ? "#D4AF37" : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
