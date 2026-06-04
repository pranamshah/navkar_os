"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { pricingPlans } from "@/data/homepage";

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-28 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 reveal">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(246,190,57,0.12)",
              color: "#B8860B",
              border: "1px solid rgba(212,160,23,0.25)",
            }}
          >
            Transparent Pricing
          </span>
          <h2
            className="font-black mb-4"
            style={{ fontSize: "clamp(28px, 3.5vw, 44px)", color: "#1a1c1d", letterSpacing: "-0.03em" }}
          >
            No Hidden Fees.{" "}
            <span style={{ color: "#D4A017" }}>Scale with Volume.</span>
          </h2>
          <p className="text-lg mb-8" style={{ color: "#5d5f5f" }}>
            14-day free trial. No credit card required.
          </p>

          {/* Toggle */}
          <div
            className="inline-flex rounded-full p-1"
            style={{ background: "#eeeeef", border: "1px solid rgba(196,199,200,0.4)" }}
          >
            {[{ label: "Monthly", val: false }, { label: "Annual  (Save 17%)", val: true }].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAnnual(opt.val)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background: annual === opt.val ? "#1a1c1d" : "transparent",
                  color: annual === opt.val ? "#fff" : "#5d5f5f",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: plan.highlight ? "#1a1c1d" : "rgba(255,255,255,0.8)",
                border: plan.highlight ? "2px solid #f6be39" : "1px solid rgba(196,199,200,0.4)",
                backdropFilter: "blur(20px)",
                transform: plan.highlight ? "scale(1.04)" : "scale(1)",
                boxShadow: plan.highlight ? "0 20px 60px rgba(212,160,23,0.18)" : "none",
              }}
            >
              {plan.badge && (
                <div
                  className="text-center py-2 text-xs font-black uppercase tracking-widest"
                  style={{ background: "#f6be39", color: "#1a1c1d" }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="p-8 flex flex-col gap-5">
                <div>
                  <h3
                    className="font-black text-xl mb-1"
                    style={{ color: plan.highlight ? "#fff" : "#1a1c1d", letterSpacing: "-0.02em" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.55)" : "#5d5f5f" }}>
                    {plan.desc}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-black"
                      style={{
                        fontSize: "38px",
                        color: plan.highlight ? "#f6be39" : "#1a1c1d",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      ₹{(annual ? plan.annual / 12 : plan.monthly).toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : "#5d5f5f" }}>
                      /mo
                    </span>
                  </div>
                  {annual && (
                    <p className="text-xs mt-0.5" style={{ color: plan.highlight ? "#f6be39" : "#D4A017" }}>
                      ₹{plan.annual.toLocaleString("en-IN")} billed annually
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: plan.highlight ? "#f6be39" : "#16A34A" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : "#1a1c1d" }}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full py-3.5 rounded-full font-semibold text-sm mt-2 transition-all duration-200"
                  style={{
                    background: plan.highlight ? "#f6be39" : "#1a1c1d",
                    color: plan.highlight ? "#1a1c1d" : "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(212,160,23,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "#5d5f5f" }}>
          Need unlimited users and custom integrations?{" "}
          <button className="font-semibold underline" style={{ color: "#D4A017" }}>
            Talk to our Enterprise team →
          </button>
        </p>
      </div>
    </section>
  );
}
