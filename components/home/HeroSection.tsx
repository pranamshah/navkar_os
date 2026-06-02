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

const slides = [
  {
    id: "freightops",
    badge: "FreightOps · Live",
    badgeColor: "#16A34A",
    title: "Active Shipments",
    rows: [
      { id: "NOS/2026/0142", route: "INNSA → DEHAM", status: "Under Exam", color: "#D4AF37" },
      { id: "NOS/2026/0141", route: "INMAA → SGSIN", status: "OOC Cleared", color: "#16A34A" },
      { id: "NOS/2026/0139", route: "INCCU → USLAX", status: "On Vessel", color: "#3B82F6" },
      { id: "NOS/2026/0137", route: "INMUN → AEJEA", status: "At CFS", color: "#D4AF37" },
    ],
    footer: "4 jobs active · 2 pending customs",
  },
  {
    id: "billgen",
    badge: "BillGen · Generated",
    badgeColor: "#D4AF37",
    title: "Invoice INV-2026-0892",
    rows: [
      { id: "Ocean Freight", route: "FCL 20'", status: "₹78,500", color: "#1a1c1c" },
      { id: "THC Destination", route: "Hamburg Port", status: "₹12,200", color: "#1a1c1c" },
      { id: "Documentation Fee", route: "BL Charges", status: "₹3,500", color: "#1a1c1c" },
      { id: "IGST @ 18%", route: "Tax", status: "₹17,136", color: "#D4AF37" },
    ],
    footer: "Total ₹1,11,336 · Sent via WhatsApp",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveSlide((s) => (s + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section
      className="relative min-h-screen w-full flex items-center overflow-hidden"
      style={{ background: "#f9f9f9" }}
    >
      <RibbonCanvas />

      <div
        className="relative w-full max-w-7xl mx-auto px-8 lg:px-16 grid lg:grid-cols-12 gap-8 items-center"
        style={{ zIndex: 2 }}
      >
        {/* Left: Copy */}
        <motion.div
          className="lg:col-span-7 pt-24 pb-12 lg:pt-0 lg:pb-0"
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
              fontSize: "clamp(44px, 6vw, 76px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
            }}
          >
            One Platform for
            <br />
            <span style={{ color: "#D4AF37" }}>Indian Logistics.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg mb-12 leading-relaxed"
            style={{ fontSize: "18px", fontWeight: 300, color: "#4c4546", lineHeight: 1.75 }}
          >
            From shipment creation to customs clearance, GST invoicing to
            client communication — NavkarOS unifies every workflow across your
            entire logistics operation.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
            <button
              className="px-10 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none"
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
            </button>
            <button
              className="px-10 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none"
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
            </button>
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

        {/* Right: animated dashboard slides */}
        <motion.div
          className="lg:col-span-5 hidden lg:flex flex-col gap-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Slide tabs */}
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(i)}
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none"
                style={{
                  background: i === activeSlide ? "#1a1c1c" : "rgba(0,0,0,0.07)",
                  color: i === activeSlide ? "#fff" : "#7e7576",
                }}
              >
                {s.id === "freightops" ? "FreightOps" : "BillGen"}
              </button>
            ))}
          </div>

          {/* Slide panel */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "#fff",
              border: "0.5px solid rgba(0,0,0,0.1)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.07)",
              minHeight: "360px",
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
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="p-6"
              >
                {/* Slide header */}
                <div className="flex items-center justify-between mb-5">
                  <h3
                    style={{
                      fontFamily: "'EB Garamond', Georgia, serif",
                      fontSize: "18px",
                      color: "#1a1c1c",
                    }}
                  >
                    {slide.title}
                  </h3>
                  <span
                    className="text-xs font-semibold px-2 py-0.5"
                    style={{ background: `${slide.badgeColor}18`, color: slide.badgeColor }}
                  >
                    ● {slide.badge}
                  </span>
                </div>

                {/* Column headers */}
                <div
                  className="grid grid-cols-3 pb-2 mb-1 border-b"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>
                    {slide.id === "freightops" ? "Job No." : "Item"}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#7e7576" }}>
                    {slide.id === "freightops" ? "Route" : "Detail"}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-right" style={{ color: "#7e7576" }}>
                    {slide.id === "freightops" ? "Status" : "Amount"}
                  </span>
                </div>

                {/* Rows */}
                {slide.rows.map((row, i) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="grid grid-cols-3 py-2.5 border-b"
                    style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  >
                    <span className="text-xs font-semibold" style={{ color: "#1a1c1c" }}>{row.id}</span>
                    <span className="text-xs" style={{ color: "#7e7576" }}>{row.route}</span>
                    <span className="text-xs font-semibold text-right" style={{ color: row.color }}>{row.status}</span>
                  </motion.div>
                ))}

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#7e7576" }}>{slide.footer}</span>
                  <span
                    className="text-xs px-3 py-1 font-semibold"
                    style={{ background: "#1a1c1c", color: "#fff" }}
                  >
                    {slide.id === "freightops" ? "New Job" : "Send"}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide dots */}
          <div className="flex gap-1.5 justify-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className="rounded-full transition-all duration-300 cursor-none"
                style={{
                  width: i === activeSlide ? "24px" : "6px",
                  height: "6px",
                  background: i === activeSlide ? "#D4AF37" : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
