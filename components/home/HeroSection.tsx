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
