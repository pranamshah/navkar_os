"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CobeGlobe } from "@/components/ui/cobe-globe";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

// Indian port cities + major global trade hubs
const MARKERS = [
  // India
  { id: "mumbai",    location: [19.0760,  72.8777] as [number, number], size: 0.055 }, // JNPT — largest
  { id: "chennai",   location: [13.0827,  80.2707] as [number, number], size: 0.05  },
  { id: "delhi",     location: [28.6139,  77.2090] as [number, number], size: 0.045 },
  { id: "kolkata",   location: [22.5726,  88.3639] as [number, number], size: 0.04  },
  { id: "cochin",    location: [ 9.9312,  76.2673] as [number, number], size: 0.04  },
  // Global
  { id: "dubai",     location: [25.2048,  55.2708] as [number, number], size: 0.045 },
  { id: "singapore", location: [ 1.3521, 103.8198] as [number, number], size: 0.045 },
  { id: "shanghai",  location: [31.2304, 121.4737] as [number, number], size: 0.04  },
  { id: "rotterdam", location: [51.9225,   4.4792] as [number, number], size: 0.04  },
  { id: "losangeles",location: [34.0522,-118.2437] as [number, number], size: 0.035 },
];

// Trade lane arcs
const ARCS = [
  { id: "mumbai-dubai",     from: [19.0760, 72.8777] as [number, number], to: [25.2048, 55.2708] as [number, number] },
  { id: "mumbai-singapore", from: [19.0760, 72.8777] as [number, number], to: [ 1.3521,103.8198] as [number, number] },
  { id: "chennai-singapore",from: [13.0827, 80.2707] as [number, number], to: [ 1.3521,103.8198] as [number, number] },
  { id: "mumbai-rotterdam", from: [19.0760, 72.8777] as [number, number], to: [51.9225,  4.4792] as [number, number] },
  { id: "singapore-shanghai",from:[1.3521, 103.8198] as [number, number], to: [31.2304,121.4737] as [number, number] },
];

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "92svh", background: "#f9f9f9" }}
    >
      <div
        className="grid lg:grid-cols-2"
        style={{ minHeight: "92svh" }}
      >

        {/* ── LEFT: copy ─────────────────────────────────────────────── */}
        <div
          className="relative flex flex-col justify-center px-8 md:px-12 lg:px-16 pt-28 pb-16 lg:pt-0 lg:pb-0"
          style={{ background: "#f9f9f9", zIndex: 2 }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col max-w-xl lg:ml-auto lg:mr-6 xl:mr-14"
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

        {/* ── RIGHT: interactive COBE globe ──────────────────────────── */}
        <div
          className="relative hidden lg:block overflow-hidden"
          style={{ background: "#f9f9f9" }}
        >
          {/* Left-edge fade blends into left panel */}
          <div
            className="absolute inset-y-0 left-0 w-28 pointer-events-none"
            style={{ background: "linear-gradient(to right, #f9f9f9, transparent)", zIndex: 10 }}
          />

          {/* Globe — sized larger than the column and shifted right so it
              overflows the right edge. overflow-hidden on parent clips it. */}
          <motion.div
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.35, ease: "easeOut" }}
            style={{
              /* centre-right: top-50% + negative margin push up */
              top: "50%",
              left: "-8%",
              width: "118%",
              transform: "translateY(-50%)",
            }}
          >
            <CobeGlobe markers={MARKERS} arcs={ARCS} className="w-full" />
          </motion.div>
        </div>

        {/* Mobile: globe banner above text */}
        <div
          className="lg:hidden relative overflow-hidden order-first flex items-center justify-center"
          style={{ height: "56vw", maxHeight: "340px", background: "#f9f9f9" }}
        >
          <CobeGlobe
            markers={MARKERS}
            arcs={ARCS}
            className="w-[58vw] max-w-[320px]"
          />
        </div>

      </div>
    </section>
  );
}
