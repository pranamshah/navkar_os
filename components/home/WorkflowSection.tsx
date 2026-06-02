"use client";

import { motion } from "framer-motion";
import { workflow } from "@/data/homepage";

export default function WorkflowSection() {
  return (
    <section className="px-8 lg:px-16 py-32" style={{ background: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 reveal">
          <h2
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(36px, 4vw, 52px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
            }}
          >
            Seamless Workflow
          </h2>
          <div className="w-16 mx-auto mt-5" style={{ height: "0.5px", background: "#D4AF37" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connecting line */}
          <div
            className="hidden md:block absolute top-6 left-0 right-0"
            style={{ height: "0.5px", background: "rgba(0,0,0,0.08)", top: "24px", zIndex: 0 }}
          />

          {workflow.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
                style={{
                  border: "0.5px solid #1a1c1c",
                  background: "#f9f9f9",
                  color: "#1a1c1c",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D4AF37";
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9f9f9";
                  e.currentTarget.style.borderColor = "#1a1c1c";
                  e.currentTarget.style.color = "#1a1c1c";
                }}
              >
                {step.step}
              </div>
              <h3
                className="mb-3"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "#1a1c1c",
                }}
              >
                {step.title}
              </h3>
              <p className="px-2" style={{ fontSize: "14px", color: "#4c4546", lineHeight: 1.65 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
