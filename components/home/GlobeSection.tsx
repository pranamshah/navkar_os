"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const RotatingEarth = dynamic(() => import("@/components/ui/wireframe-dotted-globe"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const tradeLanes = [
  { from: "India", to: "Europe", tag: "INMUN · DEHAM · NLRTM" },
  { from: "India", to: "Americas", tag: "INNSA · USLAX · USNYC" },
  { from: "India", to: "Middle East", tag: "INMAA · AEJEA · OMMCT" },
  { from: "India", to: "Southeast Asia", tag: "INCCU · SGSIN · MYPKG" },
];

export default function GlobeSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#f9f9f9", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* Left: copy */}
        <motion.div
          className="lg:col-span-5"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ background: "#e8e8e8", color: "#4c4546" }}
            >
              Global Trade Network
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-6 leading-tight"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(34px, 4vw, 56px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Logistics Without
            <br />
            <span style={{ color: "#D4AF37" }}>Borders.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mb-10 leading-relaxed"
            style={{ fontSize: "16px", fontWeight: 300, color: "#4c4546", lineHeight: 1.8, maxWidth: "420px" }}
          >
            NavkarOS connects your operations to every major trade corridor —
            from India&apos;s gateway ports to Hamburg, Los Angeles, Dubai, and
            Singapore. One platform, every lane.
          </motion.p>

          {/* Trade lanes */}
          <motion.div variants={fadeUp} className="space-y-2 mb-10">
            {tradeLanes.map((lane) => (
              <div
                key={lane.from + lane.to}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: "#fff",
                  border: "0.5px solid rgba(0,0,0,0.08)",
                  borderLeft: "2px solid #D4AF37",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1a1c1c" }}>
                    {lane.from}
                  </span>
                  <span style={{ color: "#D4AF37", fontSize: "12px" }}>→</span>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#1a1c1c" }}>
                    {lane.to}
                  </span>
                </div>
                <span className="text-xs font-mono" style={{ color: "#7e7576", fontSize: "10px" }}>
                  {lane.tag}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <a
              href="/signup"
              className="px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none inline-block"
              style={{ background: "#1a1c1c", color: "#fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#D4AF37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1a1c1c";
              }}
            >
              Start Shipping Smarter
            </a>
          </motion.div>
        </motion.div>

        {/* Right: globe */}
        <motion.div
          className="lg:col-span-7 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <RotatingEarth
            width={620}
            height={520}
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
