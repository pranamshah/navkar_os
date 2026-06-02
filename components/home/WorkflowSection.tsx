"use client";

import { motion } from "framer-motion";
import { workflow } from "@/data/homepage";

const productBadges: Record<string, string> = {
  "01": "Nexlog",
  "02": "EntryX",
  "03": "DockIQ",
  "04": "Accura",
};

export default function WorkflowSection() {
  return (
    <section className="px-8 lg:px-16 py-32" style={{ background: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 reveal">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>
            Connected Workflow
          </p>
          <h2
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(36px, 4vw, 52px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
            }}
          >
            One shipment.
            <br />
            Every product in sync.
          </h2>
          <p className="mt-5 max-w-lg mx-auto" style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.7 }}>
            When your CHA, freight forwarder, CFS, and accounts team all use NavkarOS — data flows automatically. No calls, no re-entry, no gaps.
          </p>
          <div className="w-16 mx-auto mt-6" style={{ height: "0.5px", background: "#D4AF37" }} />
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
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300"
                style={{ border: "0.5px solid #1a1c1c", background: "#f9f9f9", color: "#1a1c1c" }}
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
              <span
                className="text-xs font-semibold uppercase tracking-widest mb-3 px-2.5 py-1 rounded-full"
                style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}
              >
                {productBadges[step.step]}
              </span>
              <h3
                className="mb-3"
                style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "20px", fontWeight: 400, color: "#1a1c1c" }}
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
