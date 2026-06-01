"use client";

import { motion } from "framer-motion";
import { integrations } from "@/data/homepage";
import { Plug } from "lucide-react";

const categoryColors: Record<string, { bg: string; color: string }> = {
  Customs: { bg: "#EFF6FF", color: "#1D4ED8" },
  Tax: { bg: "#F5F3FF", color: "#6D28D9" },
  Carrier: { bg: "#FEF3C7", color: "#92400E" },
  "Shipping Line": { bg: "#ECFDF5", color: "#065F46" },
  Accounting: { bg: "#FFF7ED", color: "#9A3412" },
  Comms: { bg: "#F0F9FF", color: "#0369A1" },
  Payments: { bg: "#FFF1F2", color: "#BE123C" },
  Compliance: { bg: "#F0FDF4", color: "#166534" },
};

export default function IntegrationsSection() {
  return (
    <section
      id="integrations"
      className="py-24 px-6"
      style={{ background: "#F8F9FA" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #D4A017" }}
          >
            Integrations
          </span>
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
          >
            Works With Your Existing Stack
          </h2>
          <p className="text-lg" style={{ color: "#6B7280" }}>
            Connect to ICEGATE, GST portal, carriers, and accounting tools you
            already use.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {integrations.map((integration, i) => {
            const colors = categoryColors[integration.category] ?? {
              bg: "#F3F4F6",
              color: "#6B7280",
            };
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4A017";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,160,23,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.bg }}
                >
                  <Plug className="w-4 h-4" style={{ color: colors.color }} />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "#0A0A0A", fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    {integration.name}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {integration.category}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Need a custom integration?{" "}
            <button
              className="font-semibold underline-offset-2 underline"
              style={{ color: "#D4A017" }}
            >
              Talk to our team →
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
