"use client";

import { motion } from "framer-motion";
import { problems } from "@/data/homepage";

export default function ProblemSection() {
  return (
    <section className="px-8 lg:px-16 py-32" style={{ background: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 reveal">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
            }}
          >
            Sound familiar?
          </h2>
          <p
            className="max-w-xl"
            style={{ fontSize: "18px", fontWeight: 300, color: "#4c4546", lineHeight: 1.7, letterSpacing: "0.01em" }}
          >
            Traditional Indian logistics is manual, chaotic, and slow. NavkarOS
            replaces the mess with precision — one platform for every workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-10 transition-all duration-500 cursor-none"
              style={{
                background: "#f9f9f9",
                boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
                transform: i % 3 === 1 ? "translateY(0)" : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.04)";
              }}
            >
              <span
                className="material-symbols-outlined mb-6 block"
                style={{ fontSize: "36px", color: "#D4AF37", fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
              >
                {p.icon}
              </span>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "22px",
                  fontWeight: 400,
                  color: "#1a1c1c",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
