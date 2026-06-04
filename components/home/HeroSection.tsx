"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } };

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ minHeight: "100svh", background: "#f9f9f9" }}
    >
      {/* ── Background video ───────────────────────────────────────────── */}
      {/*
        CSS mask-image fades the video to transparent outside the globe,
        so the #f9f9f9 page background shows there — no blend-mode needed.
        sepia(0.55) + brightness(0.82) → warm gold tone on the globe lines.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0, animation: "heroFadeIn 1.4s ease-out forwards", opacity: 0 }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{
            filter: "sepia(0.55) brightness(0.82)",
            WebkitMaskImage:
              "radial-gradient(ellipse 44% 50% at 50% 50%, black 30%, rgba(0,0,0,0.55) 52%, transparent 70%)",
            maskImage:
              "radial-gradient(ellipse 44% 50% at 50% 50%, black 30%, rgba(0,0,0,0.55) 52%, transparent 70%)",
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Centre fog so the copy sits on a clean white base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 48% 52% at 50% 50%, rgba(249,249,249,0.72) 0%, rgba(249,249,249,0.35) 40%, transparent 65%)",
          zIndex: 1,
        }}
      />

      {/* ── Hero copy ─────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-5xl mx-auto px-8 flex flex-col items-center text-center"
        style={{ zIndex: 2, paddingTop: "80px" }}
      >
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.div variants={fadeUp} className="mb-7">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ background: "rgba(236,236,236,0.85)", color: "#4c4546", backdropFilter: "blur(4px)" }}
            >
              NavkarOS · Free Beta — 6 Products, One Login
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mb-6 leading-tight"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(44px, 6.5vw, 80px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            One Platform for
            <br />
            <span style={{ color: "#D4AF37" }}>Modern Logistics.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg mb-10"
            style={{ fontSize: "17px", fontWeight: 300, color: "#4c4546", lineHeight: 1.75 }}
          >
            Six products for freight forwarders, CHAs, CFS stations, transporters,
            accountants, and importers — each standalone, all connected.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-9 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
              style={{ background: "#1a1c1c", color: "#fff" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#D4AF37"; e.currentTarget.style.color = "#1a1c1c"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#fff"; }}
            >
              Start Free Trial →
            </Link>
            <a
              href="#suite"
              className="inline-flex items-center gap-2 px-9 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200"
              style={{ borderColor: "rgba(26,28,28,0.25)", borderWidth: "0.5px", color: "#1a1c1c" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1c1c"; }}
            >
              See 6 Products ↓
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-14 flex items-center gap-12 justify-center">
            {[
              { val: "6",     label: "Products in Suite" },
              { val: "14hrs", label: "Saved Weekly" },
              { val: "Free",  label: "Beta Access" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="font-semibold text-2xl"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#1a1c1c", letterSpacing: "-0.02em" }}
                >
                  {s.val}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#7e7576" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #f9f9f9)",
          zIndex: 3,
        }}
      />
    </section>
  );
}
