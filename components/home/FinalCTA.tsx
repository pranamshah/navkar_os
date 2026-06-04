"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-28 px-6" style={{ background: "#f9f9fa" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-[40px] p-14 md:p-20 text-center relative overflow-hidden"
        >
          {/* Gold glow bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 120%, rgba(212,160,23,0.1) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(246,190,57,0.12)",
                color: "#B8860B",
                border: "1px solid rgba(212,160,23,0.25)",
              }}
            >
              Get Started Today
            </span>

            <h2
              className="font-black mb-5"
              style={{ fontSize: "clamp(32px, 4.5vw, 56px)", color: "#1a1c1d", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Ready to Run Your Logistics
              <br />
              <span style={{ color: "#D4A017" }}>Business Like an OS?</span>
            </h2>

            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#5d5f5f", lineHeight: 1.7 }}>
              Join 500+ Indian logistics businesses who replaced their scattered tools
              with NavkarOS. Free for 14 days — no credit card, no commitment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="flex items-center justify-center gap-2 px-9 py-4 rounded-full font-semibold group transition-all duration-200"
                style={{ background: "#1a1c1d", color: "#fff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#D4A017";
                  e.currentTarget.style.color = "#1a1c1d";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(212,160,23,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1a1c1d";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Start Free — 14 Days
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                className="px-9 py-4 rounded-full font-semibold border transition-all duration-200"
                style={{ border: "1px solid #c4c7c8", color: "#1a1c1d" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4A017";
                  e.currentTarget.style.color = "#D4A017";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#c4c7c8";
                  e.currentTarget.style.color = "#1a1c1d";
                }}
              >
                Schedule a Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
              {[
                "No credit card required",
                "Setup in under 10 minutes",
                "Built for Indian GST",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D4A017" }} />
                  <span className="text-sm" style={{ color: "#5d5f5f" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
