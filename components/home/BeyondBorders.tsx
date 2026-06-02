"use client";

import { motion } from "framer-motion";

export default function BeyondBorders() {
  return (
    <section className="py-20 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden"
          style={{ background: "#1a1c1c", height: "520px" }}
        >
          {/* Animated gold ribbons */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.4 }}
          >
            <motion.path
              d="M-100,260 Q360,180 720,260 Q1080,340 1540,260"
              stroke="#D4AF37"
              strokeWidth="0.8"
              fill="none"
              animate={{ d: [
                "M-100,260 Q360,180 720,260 Q1080,340 1540,260",
                "M-100,280 Q360,200 720,240 Q1080,300 1540,280",
                "M-100,260 Q360,180 720,260 Q1080,340 1540,260",
              ]}}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M-100,300 Q400,220 760,300 Q1100,380 1540,300"
              stroke="#D4AF37"
              strokeWidth="0.4"
              fill="none"
              animate={{ d: [
                "M-100,300 Q400,220 760,300 Q1100,380 1540,300",
                "M-100,320 Q400,250 760,280 Q1100,340 1540,320",
                "M-100,300 Q400,220 760,300 Q1100,380 1540,300",
              ]}}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </svg>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(48px, 7vw, 88px)",
                fontWeight: 400,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Beyond Borders.
            </motion.h2>
            <div className="w-12 mt-6" style={{ height: "0.5px", background: "#D4AF37" }} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 max-w-md"
              style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", fontWeight: 300, lineHeight: 1.7 }}
            >
              Indian logistics, built for the world. NavkarOS handles every
              trade lane, every document format, every GST scenario — so you
              can focus on growing your business.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-10 px-10 py-4 text-xs font-semibold uppercase tracking-widest cursor-none transition-all duration-200"
              style={{ background: "#D4AF37", color: "#1a1c1c" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#D4AF37";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Start Free — No Credit Card
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
