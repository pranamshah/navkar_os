"use client";

import { motion } from "framer-motion"; // still used for whileInView reveals
import Image from "next/image";

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
          style={{ height: "520px" }}
        >
          {/* Full background photo */}
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80"
            alt="Container port aerial view"
            fill
            className="object-cover"
            priority={false}
          />

          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(26,28,28,0.88) 0%, rgba(26,28,28,0.65) 50%, rgba(26,28,28,0.82) 100%)" }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Static gold ribbons — CSS animation, no JS frame cost */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.2 }}>
            <path
              d="M-100,260 Q360,200 720,260 Q1080,320 1540,260"
              stroke="#D4AF37" strokeWidth="0.8" fill="none"
              style={{ animation: "ribbonA 7s ease-in-out infinite" }}
            />
            <path
              d="M-100,290 Q400,235 760,290 Q1100,345 1540,290"
              stroke="#D4AF37" strokeWidth="0.4" fill="none"
              style={{ animation: "ribbonB 9s ease-in-out 1.5s infinite" }}
            />
          </svg>
          <style>{`
            @keyframes ribbonA {
              0%,100% { d: path("M-100,260 Q360,200 720,260 Q1080,320 1540,260"); }
              50%      { d: path("M-100,280 Q360,220 720,245 Q1080,290 1540,280"); }
            }
            @keyframes ribbonB {
              0%,100% { d: path("M-100,290 Q400,235 760,290 Q1100,345 1540,290"); }
              50%      { d: path("M-100,305 Q400,255 760,275 Q1100,310 1540,305"); }
            }
          `}</style>

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
            <motion.a
              href="/signup"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-10 px-10 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 inline-block"
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
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
