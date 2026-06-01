"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle2, FileText, ArrowRight } from "lucide-react";

const extractedFields = [
  { label: "Bill of Lading No.", value: "MSCU1234567" },
  { label: "Shipper", value: "Tata Exports Ltd." },
  { label: "Consignee", value: "Müller GmbH, Hamburg" },
  { label: "Port of Loading", value: "Nhava Sheva (INNSA)" },
  { label: "Port of Discharge", value: "Hamburg (DEHAM)" },
  { label: "Gross Weight", value: "14,200 KGS" },
  { label: "No. of Containers", value: "2 × 20' GP" },
];

export default function DocAISpotlight() {
  return (
    <section
      id="features"
      className="py-24 px-6"
      style={{ background: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main card */}
            <div
              className="rounded-2xl p-6 shadow-xl"
              style={{ background: "#0A1628", border: "1px solid rgba(212,160,23,0.3)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#D4A017" }}
                >
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p
                    className="font-semibold text-white text-sm"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    Doc AI Engine
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Processing: bill_of_lading_mscu.pdf
                  </p>
                </div>
                <span
                  className="ml-auto text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "#DCFCE7", color: "#166534" }}
                >
                  ● Live
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="h-1.5 rounded-full mb-6 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ background: "#D4A017" }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>

              {/* Extracted fields */}
              <div className="space-y-2.5">
                {extractedFields.map((field, i) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center justify-between py-2 border-b"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {field.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">
                        {field.value}
                      </span>
                      <CheckCircle2
                        className="w-3.5 h-3.5"
                        style={{ color: "#D4A017" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
                className="mt-5 text-center py-2.5 rounded-xl"
                style={{ background: "rgba(212,160,23,0.15)", border: "1px solid rgba(212,160,23,0.3)" }}
              >
                <span className="text-sm font-semibold" style={{ color: "#D4A017" }}>
                  ✓ Extraction complete in 2.8 seconds · 98% accuracy
                </span>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 px-4 py-2 rounded-xl shadow-lg text-sm font-semibold"
              style={{ background: "#D4A017", color: "#0A0A0A" }}
            >
              🤖 AI-Powered
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit"
              style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #D4A017" }}
            >
              Doc AI Module
            </span>

            <h2
              className="text-3xl lg:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
            >
              Stop Typing.{" "}
              <span style={{ color: "#D4A017" }}>Start Thinking.</span>
            </h2>

            <p className="text-lg leading-relaxed" style={{ color: "#6B7280" }}>
              Upload any shipping document — Bill of Lading, Airway Bill, commercial
              invoice, packing list — and our AI extracts every field instantly.
              No templates, no configuration.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: FileText,
                  title: "Any Document Format",
                  desc: "PDFs, scanned images, and even photos taken on mobile.",
                },
                {
                  icon: Zap,
                  title: "3-Second Processing",
                  desc: "Faster than any human typist — and 98% more accurate.",
                },
                {
                  icon: CheckCircle2,
                  title: "Validation Built-In",
                  desc: "Cross-checks port codes, HSN codes, and GST numbers automatically.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#FEF3C7" }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: "#D4A017" }} />
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-0.5"
                      style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm w-fit transition-all duration-200 group"
              style={{ background: "#0A0A0A", color: "#FFFFFF" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(212,160,23,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Try Doc AI Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
