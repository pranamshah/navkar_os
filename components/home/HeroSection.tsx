"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
        { color: "rgba(212,175,55,0.55)", lw: 1 },
        { color: "rgba(212,175,55,0.18)", lw: 0.6 },
        { color: "rgba(212,175,55,0.08)", lw: 0.4 },
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
  return (
    <section
      className="relative min-h-screen w-full flex items-center overflow-hidden"
      style={{ background: "#f9f9f9" }}
    >
      <RibbonCanvas />

      {/* Ambient blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "18%",
          left: "8%",
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(212,175,55,0.12)",
          filter: "blur(24px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "62%",
          right: "4%",
          width: 128,
          height: 128,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.04)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="relative w-full max-w-7xl mx-auto px-8 lg:px-16 grid lg:grid-cols-12 gap-8 items-center"
        style={{ zIndex: 2 }}
      >
        <motion.div
          className="lg:col-span-7"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-7">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                background: "#e8e8e8",
                color: "#4c4546",
              }}
            >
              Now for CHAs & Forwarders · Free Beta
            </span>
          </motion.div>

          {/* Headline */}
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
            The Precision of
            <br />
            <span style={{ color: "#D4AF37" }}>Modern Logistics.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="max-w-lg mb-12 leading-relaxed"
            style={{
              fontSize: "18px",
              fontWeight: 300,
              color: "#4c4546",
              lineHeight: 1.75,
              letterSpacing: "0.01em",
            }}
          >
            Consolidate shipments, automate documentation, and clear customs
            with 10x the speed. An operating system designed for the
            uncompromising standards of Indian freight management.
          </motion.p>

          {/* CTAs */}
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

          {/* Quick stats strip */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex items-center gap-10"
          >
            {[
              { val: "500+", label: "Businesses Live" },
              { val: "98%", label: "DocAI Accuracy" },
              { val: "14hrs", label: "Saved Weekly" },
            ].map((s, i) => (
              <div key={s.label}>
                <p
                  className="font-semibold text-2xl"
                  style={{ color: "#1a1c1c", fontFamily: "Geist, sans-serif", letterSpacing: "-0.02em" }}
                >
                  {s.val}
                </p>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#7e7576" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: floating status cards */}
        <motion.div
          className="lg:col-span-5 hidden lg:block relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-[480px]">
            {/* Main card */}
            <div
              className="absolute top-8 right-0 w-72 p-5 rounded-none shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
              style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)" }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#D4AF37" }}>
                Live Jobs
              </p>
              {[
                { job: "NOS/2026/0142", route: "INNSA → DEHAM", status: "Under Exam" },
                { job: "NOS/2026/0141", route: "INMAA → SGSIN", status: "OOC Cleared" },
                { job: "NOS/2026/0139", route: "INCCU → USLAX", status: "On Vessel" },
              ].map((r) => (
                <div
                  key={r.job}
                  className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#1a1c1c" }}>{r.job}</p>
                    <p className="text-xs" style={{ color: "#7e7576" }}>{r.route}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#D4AF37" }}>{r.status}</span>
                </div>
              ))}
            </div>

            {/* DocAI card */}
            <motion.div
              animate={{ y: [-7, 7, -7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
              className="absolute top-0 -left-4 w-52 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
              style={{ background: "#fff", border: "0.5px solid rgba(212,175,55,0.4)" }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#D4AF37" }}>
                DocAI · Live
              </p>
              {[
                { label: "Bill of Lading", ok: true },
                { label: "Packing List", ok: true },
                { label: "Bill of Entry", ok: false },
              ].map((d) => (
                <div key={d.label} className="flex justify-between py-1 text-xs border-b" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                  <span style={{ color: "#4c4546" }}>{d.label}</span>
                  <span style={{ color: d.ok ? "#16A34A" : "#D4AF37" }}>{d.ok ? "✓ Done" : "● Reading"}</span>
                </div>
              ))}
            </motion.div>

            {/* Invoice card */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
              className="absolute bottom-8 right-4 w-56 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
              style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>BillGen</p>
              <p className="text-2xl font-semibold" style={{ color: "#1a1c1c", fontFamily: "Geist, sans-serif", letterSpacing: "-0.02em" }}>
                ₹1,24,800
              </p>
              <p className="text-xs mt-0.5 mb-2" style={{ color: "#7e7576" }}>INV-2026-0892 · IGST</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D4AF37" }} />
                <span className="text-xs" style={{ color: "#D4AF37" }}>Sent via WhatsApp</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
