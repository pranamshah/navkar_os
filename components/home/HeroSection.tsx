"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.play().catch(() => {});
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "92svh" }}
    >
      <div
        className="grid lg:grid-cols-2"
        style={{ minHeight: "92svh" }}
      >
        {/* ── LEFT: copy ─────────────────────────────────────────────── */}
        <div
          className="relative flex flex-col justify-center px-8 md:px-12 lg:px-16 pt-8 pb-16 lg:pt-0 lg:pb-0"
          style={{ zIndex: 2 }}
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

        {/* ── RIGHT: globe-style video orb ──────────────────────────── */}
        <div className="relative hidden lg:flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Outer decorative rings */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 560, height: 560,
                border: "0.5px solid rgba(212,175,55,0.1)",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 520, height: 520,
                border: "0.5px solid rgba(212,175,55,0.18)",
              }}
            />

            {/* Circular video orb */}
            <div
              className="relative overflow-hidden rounded-full"
              style={{
                width: 480,
                height: 480,
                border: "1px solid rgba(212,175,55,0.28)",
                boxShadow: "0 0 80px rgba(212,175,55,0.1), 0 30px 80px rgba(0,0,0,0.1)",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{ willChange: "opacity" }}
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>

        {/* Mobile: circular orb above text */}
        <div className="lg:hidden flex items-center justify-center order-first pt-28 pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-full"
            style={{
              width: "68vw",
              maxWidth: 280,
              aspectRatio: "1 / 1",
              border: "1px solid rgba(212,175,55,0.3)",
              boxShadow: "0 0 40px rgba(212,175,55,0.1)",
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
