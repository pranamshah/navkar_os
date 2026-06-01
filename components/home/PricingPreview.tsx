"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { pricingPlans } from "@/data/homepage";

type BillingPeriod = "monthly" | "annual" | "lifetime";

export default function PricingPreview() {
  const [billing, setBilling] = useState<BillingPeriod>("annual");

  const getPrice = (plan: (typeof pricingPlans)[0]) => {
    if (plan.monthlyPrice === 0) return null;
    if (billing === "monthly") return plan.monthlyPrice;
    if (billing === "annual") return plan.annualPrice;
    return plan.lifetimePrice;
  };

  const getSuffix = () => {
    if (billing === "monthly") return "/mo";
    if (billing === "annual") return "/mo";
    return " one-time";
  };

  return (
    <section id="pricing" className="py-24 px-6" style={{ background: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #D4A017" }}
          >
            Simple Pricing
          </span>
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
          >
            Start Free. Scale When Ready.
          </h2>
          <p className="text-lg mb-8" style={{ color: "#6B7280" }}>
            14-day free trial, no credit card required.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex rounded-xl p-1 gap-1"
            style={{ background: "#F3F4F6", border: "1px solid #E5E7EB" }}
          >
            {(["monthly", "annual", "lifetime"] as BillingPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setBilling(period)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize relative"
                style={{
                  background: billing === period ? "#0A0A0A" : "transparent",
                  color: billing === period ? "#FFFFFF" : "#6B7280",
                }}
              >
                {period}
                {period === "annual" && (
                  <span
                    className="absolute -top-2.5 -right-1 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: "#D4A017", color: "#0A0A0A", fontSize: "10px" }}
                  >
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan, i) => {
            const price = getPrice(plan);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: plan.highlighted ? "#0A1628" : "#FFFFFF",
                  border: plan.highlighted
                    ? "2px solid #D4A017"
                    : "1px solid #E5E7EB",
                  boxShadow: plan.highlighted
                    ? "0 20px 60px rgba(212,160,23,0.2)"
                    : "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {plan.badge && (
                  <div
                    className="text-center py-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ background: "#D4A017", color: "#0A0A0A" }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-6 flex flex-col gap-5 flex-1">
                  <div>
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{
                        fontFamily: "var(--font-sora), sans-serif",
                        color: plan.highlighted ? "#FFFFFF" : "#0A0A0A",
                      }}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: plan.highlighted
                          ? "rgba(255,255,255,0.6)"
                          : "#6B7280",
                      }}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    {price !== null ? (
                      <div className="flex items-end gap-1">
                        <span
                          className="text-4xl font-bold"
                          style={{
                            fontFamily: "var(--font-sora), sans-serif",
                            color: plan.highlighted ? "#D4A017" : "#0A0A0A",
                          }}
                        >
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span
                          className="text-sm mb-1"
                          style={{
                            color: plan.highlighted
                              ? "rgba(255,255,255,0.5)"
                              : "#6B7280",
                          }}
                        >
                          {getSuffix()}
                        </span>
                      </div>
                    ) : (
                      <p
                        className="text-3xl font-bold"
                        style={{
                          fontFamily: "var(--font-sora), sans-serif",
                          color: plan.highlighted ? "#D4A017" : "#0A0A0A",
                        }}
                      >
                        Custom
                      </p>
                    )}
                    {billing === "annual" && price !== null && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: plan.highlighted ? "#D4A017" : "#6B7280" }}
                      >
                        Billed ₹{(price * 12).toLocaleString("en-IN")}/year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: "#D4A017" }}
                        />
                        <span
                          className="text-sm"
                          style={{
                            color: plan.highlighted
                              ? "rgba(255,255,255,0.8)"
                              : "#1A1A2E",
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className="w-full py-3.5 rounded-xl font-semibold text-sm mt-4 flex items-center justify-center gap-2 transition-all duration-200 group"
                    style={{
                      background: plan.highlighted ? "#D4A017" : "#0A0A0A",
                      color: plan.highlighted ? "#0A0A0A" : "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = plan.highlighted
                        ? "0 0 24px rgba(212,160,23,0.5)"
                        : "0 0 20px rgba(212,160,23,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm mt-8"
          style={{ color: "#6B7280" }}
        >
          All plans include 14-day free trial · No credit card required ·
          Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
