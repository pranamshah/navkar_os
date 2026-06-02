"use client";

import { motion } from "framer-motion";
import { suite } from "@/data/homepage";

export default function CommandSuite() {
  const primary = suite.slice(0, 4);
  const secondary = suite.slice(4);

  return (
    <section id="suite" className="px-8 lg:px-16 py-32" style={{ background: "#f3f3f3" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row gap-16 items-start mb-28 reveal">
          <div className="md:w-1/3">
            <h2
              className="mb-4"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(32px, 3.5vw, 44px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
              }}
            >
              The OS Stack.
            </h2>
            <p className="mb-8" style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.7 }}>
              Seven specialized modules designed to run every department of your
              Indian logistics firm from a single window — no switching products,
              no data silos.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest border-b cursor-none transition-colors duration-200"
              style={{ borderColor: "#1a1c1c", color: "#1a1c1c", paddingBottom: "2px" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#D4AF37";
                e.currentTarget.style.borderColor = "#D4AF37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#1a1c1c";
                e.currentTarget.style.borderColor = "#1a1c1c";
              }}
            >
              View Documentation
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                arrow_forward
              </span>
            </a>
          </div>

          {/* Primary 4 modules */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {primary.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="p-10 flex flex-col gap-5 cursor-none transition-all duration-500"
                style={{
                  background: "#fff",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
                  transform: i % 2 === 1 ? "translateY(48px)" : undefined,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(${i % 2 === 1 ? 40 : -8}px)`;
                  e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translateY(${i % 2 === 1 ? 48 : 0}px)`;
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.04)";
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "32px", color: "#D4AF37", fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
                >
                  {mod.icon}
                </span>
                <div>
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: "'EB Garamond', Georgia, serif",
                      fontSize: "22px",
                      fontWeight: 400,
                      color: "#1a1c1c",
                    }}
                  >
                    {mod.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>
                    {mod.tagline}
                  </p>
                  <p style={{ fontSize: "14px", color: "#4c4546", lineHeight: 1.65 }}>{mod.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Secondary 3 modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {secondary.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 cursor-none transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(8px)",
                borderLeft: "0.5px solid rgba(0,0,0,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderLeftColor = "#D4AF37";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                e.currentTarget.style.borderLeftColor = "rgba(0,0,0,0.12)";
              }}
            >
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#1a1c1c" }}>
                {mod.name}
              </h4>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>
                {mod.tagline}
              </p>
              <p style={{ fontSize: "14px", color: "#4c4546", lineHeight: 1.65 }}>{mod.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
