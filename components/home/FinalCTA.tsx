"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, HeadphonesIcon } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      className="py-24 px-6"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #1A1A2E 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(212,160,23,0.15)",
              color: "#D4A017",
              border: "1px solid rgba(212,160,23,0.3)",
            }}
          >
            Get Started Today
          </span>

          <h2
            className="text-3xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            Ready to Run Your Freight
            <br />
            Business{" "}
            <span style={{ color: "#D4A017" }}>the Smart Way?</span>
          </h2>

          <p
            className="text-lg max-w-2xl"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Join 500+ Indian freight forwarders who have already modernised
            their operations with Navkar OS. Start your free 14-day trial —
            no credit card, no commitment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 group"
              style={{ background: "#D4A017", color: "#0A0A0A" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F0C040";
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(212,160,23,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#D4A017";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Start Free Trial — 14 Days
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
            >
              Schedule a Demo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            {[
              { icon: Shield, text: "No credit card required" },
              { icon: Clock, text: "Setup in under 10 minutes" },
              { icon: HeadphonesIcon, text: "Dedicated onboarding support" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2">
                <badge.icon
                  className="w-4 h-4"
                  style={{ color: "#D4A017" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
