"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", background: "#f9f9f9" }}
    >
      <div
        className="grid lg:grid-cols-2"
        style={{ minHeight: "100svh" }}
      >

        {/* ── LEFT: copy on clean white ─────────────────────────────── */}
        <div
          className="relative flex flex-col justify-center px-8 md:px-12 lg:px-16 pt-28 pb-16 lg:pt-0 lg:pb-0"
          style={{ background: "#f9f9f9", zIndex: 2 }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col max-w-xl lg:ml-auto lg:mr-8 xl:mr-16"
          >
            <motion.div variants={fadeUp} className="mb-7">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
                style={{
                  background: "rgba(212,175,55,0.1)",
                  color: "#B8860B",
                  border: "0.5px solid rgba(212,175,55,0.3)",
                }}
              >
                Free Beta — 6 Products, One Login
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-6"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.025em",
                lineHeight: 1.06,
              }}
            >
              One Platform
              <br />
              for Modern
              <br />
              <span style={{ color: "#D4AF37" }}>Logistics.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mb-10"
              style={{
                fontSize: "16px",
                fontWeight: 300,
                color: "#4c4546",
                lineHeight: 1.8,
                maxWidth: "440px",
              }}
            >
              Six products for freight forwarders, CHAs, CFS stations,
              transporters, accountants, and importers — each standalone,
              all connected.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-14">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                style={{ background: "#1a1c1c", color: "#fff" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#D4AF37"; e.currentTarget.style.color = "#1a1c1c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#fff"; }}
              >
                Start Free Trial →
              </Link>
              <a
                href="#suite"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200"
                style={{
                  borderColor: "rgba(26,28,28,0.22)",
                  borderWidth: "0.5px",
                  color: "#1a1c1c",
                  background: "transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1c1c"; }}
              >
                See 6 Products ↓
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-10 pt-8"
              style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}
            >
              {[
                { val: "6",     label: "Products" },
                { val: "14hrs", label: "Saved / week" },
                { val: "Free",  label: "Beta Access" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="font-semibold"
                    style={{
                      fontFamily: "'EB Garamond', Georgia, serif",
                      fontSize: "28px",
                      color: "#1a1c1c",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.val}
                  </p>
                  <p className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "#7e7576" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT: globe video ────────────────────────────────────── */}
        <div
          className="relative overflow-hidden hidden lg:block"
          style={{ background: "#f9f9f9" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.3 }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{
                opacity: 0.92,
                filter: "sepia(0.25) brightness(0.95) contrast(0.95)",
                /* Left edge blends into left panel; right/top/bottom fade to page white */
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 7%, black 16%, black 84%, rgba(0,0,0,0.4) 94%, transparent 100%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 7%, black 16%, black 84%, rgba(0,0,0,0.4) 94%, transparent 100%)",
              }}
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Top/bottom edge fades to match page white */}
          <div
            className="absolute inset-x-0 top-0 h-28 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, #f9f9f9, transparent)", zIndex: 1 }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
            style={{ background: "linear-gradient(to top, #f9f9f9, transparent)", zIndex: 1 }}
          />
        </div>

        {/* Mobile: video as thin banner above the fold (shown on small screens only) */}
        <div
          className="lg:hidden relative overflow-hidden order-first"
          style={{ height: "40vw", maxHeight: "280px", background: "#1a1c1c" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: 0.8, filter: "sepia(0.3) brightness(0.9)" }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 50%, #f9f9f9 100%)" }}
          />
        </div>

      </div>
    </section>
  );
}
