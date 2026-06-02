"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function RibbonCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let time = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      [{ color: "rgba(212,175,55,0.45)", lw: 1 }, { color: "rgba(212,175,55,0.15)", lw: 0.6 }, { color: "rgba(212,175,55,0.07)", lw: 0.4 }].forEach((r, j) => {
        ctx.beginPath(); ctx.strokeStyle = r.color; ctx.lineWidth = r.lw;
        const yBase = canvas.height * 0.52 + j * 35;
        ctx.moveTo(-60, yBase);
        for (let x = -60; x <= canvas.width + 60; x += 8) {
          ctx.lineTo(x, yBase + Math.sin(x * 0.0018 + time * 0.45 + j * 0.9) * 55 + Math.sin(x * 0.0009 - time * 0.28 + j * 1.4) * 30);
        }
        ctx.stroke();
      });
      time += 0.012;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}

const slides = [
  {
    id: "freightops",
    label: "FreightOps · Active Jobs",
    badge: "● Live",
    badgeColor: "#16A34A",
    rows: [
      { a: "NOS/2026/0142", b: "INNSA → DEHAM", c: "Under Exam", color: "#D4AF37" },
      { a: "NOS/2026/0141", b: "INMAA → SGSIN", c: "OOC Cleared", color: "#16A34A" },
      { a: "NOS/2026/0139", b: "INCCU → USLAX", c: "On Vessel", color: "#3B82F6" },
      { a: "NOS/2026/0137", b: "INMUN → AEJEA", c: "At CFS", color: "#D4AF37" },
    ],
    footer: "4 jobs active · 2 pending customs",
  },
  {
    id: "billgen",
    label: "BillGen · Invoice Ready",
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
    <section className="relative min-h-screen w-full flex items-center overflow-hidden" style={{ background: "#f9f9f9" }}>
      <RibbonCanvas />

      <div className="relative w-full max-w-7xl mx-auto px-8 lg:px-16 grid lg:grid-cols-12 gap-8 items-center" style={{ zIndex: 2 }}>
        {/* Left */}
        <motion.div className="lg:col-span-6 pt-28 pb-12 lg:pt-0 lg:pb-0" variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="mb-7">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{ background: "#e8e8e8", color: "#4c4546" }}>
              Built for Every Logistics Business · Free Beta
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mb-8 leading-tight"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em", lineHeight: 1.08 }}
          >
            One Platform for
            <br />
            <span style={{ color: "#D4AF37" }}>Modern Logistics.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-lg mb-12" style={{ fontSize: "17px", fontWeight: 300, color: "#4c4546", lineHeight: 1.75 }}>
            From shipment creation to customs clearance, GST invoicing to client communication — NavkarOS unifies every workflow across your entire logistics operation.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
            <a href="/signup" className="px-10 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none inline-block"
              style={{ background: "#1a1c1c", color: "#fff" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#D4AF37"; e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Start Free Trial
            </a>
            <a href="/demo/freightops" className="px-10 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none inline-block"
              style={{ borderColor: "#1a1c1c", borderWidth: "0.5px", color: "#1a1c1c" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1c1c"; }}
            >
              Watch Demo
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 flex items-center gap-10">
            {[{ val: "500+", label: "Businesses Live" }, { val: "12k+", label: "Shipments Tracked" }, { val: "14hrs", label: "Saved Weekly" }].map((s) => (
              <div key={s.label}>
                <p className="font-semibold text-2xl" style={{ color: "#1a1c1c", letterSpacing: "-0.02em" }}>{s.val}</p>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#7e7576" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: 2-slide dashboard */}
        <motion.div
          className="lg:col-span-6 hidden lg:flex flex-col gap-3"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", boxShadow: "0 24px 48px rgba(0,0,0,0.07)" }}>
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#fafafa" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
              <span className="ml-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>navkaros.in/app</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={slide.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "17px", color: "#1a1c1c" }}>{slide.label}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5" style={{ background: `${slide.badgeColor}18`, color: slide.badgeColor }}>{slide.badge}</span>
                </div>

                <div className="grid grid-cols-3 pb-1.5 mb-1 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  {["Item", "Detail", "Value"].map((h, i) => (
                    <span key={h} className={`text-xs font-semibold uppercase tracking-wider ${i === 2 ? "text-right" : ""}`} style={{ color: "#7e7576" }}>{h}</span>
                  ))}
                </div>

                {slide.rows.map((row, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="grid grid-cols-3 py-2.5 border-b" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                    <span className="text-xs font-semibold truncate pr-2" style={{ color: "#1a1c1c" }}>{row.a}</span>
                    <span className="text-xs truncate pr-2" style={{ color: "#7e7576" }}>{row.b}</span>
                    <span className="text-xs font-semibold text-right" style={{ color: row.color }}>{row.c}</span>
                  </motion.div>
                ))}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#7e7576" }}>{slide.footer}</span>
                  <a href={`/demo/${slide.id}`} className="text-xs font-semibold uppercase tracking-widest cursor-none" style={{ color: "#D4AF37" }}>Demo →</a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex gap-1.5 justify-center">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all duration-300 cursor-none"
                style={{ width: i === active ? "24px" : "6px", height: "6px", background: i === active ? "#D4AF37" : "rgba(0,0,0,0.15)" }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
