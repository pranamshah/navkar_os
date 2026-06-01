"use client";

import { motion } from "framer-motion";
import { Receipt, Download, IndianRupee, ArrowRight, CheckCircle2 } from "lucide-react";

export default function BillGenSpotlight() {
  return (
    <section className="py-24 px-6" style={{ background: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit"
              style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #D4A017" }}
            >
              Bill Generation Module
            </span>

            <h2
              className="text-3xl lg:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
            >
              GST Invoices in{" "}
              <span style={{ color: "#D4A017" }}>Seconds,</span>
              <br />Not Hours
            </h2>

            <p className="text-lg leading-relaxed" style={{ color: "#6B7280" }}>
              Generate fully GST-compliant invoices, debit notes, credit notes,
              and proforma invoices. Multi-currency support for international
              shipments. One-click PDF export.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                "IGST / CGST / SGST auto-calc",
                "Multi-currency & INR",
                "IEC number pre-filled",
                "Bulk invoice generation",
                "Email directly to client",
                "Tally & Zoho sync",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#D4A017" }} />
                  <span className="text-sm" style={{ color: "#1A1A2E" }}>
                    {feature}
                  </span>
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
              See Billing in Action
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Right: Invoice Preview Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              {/* Invoice header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ background: "#0A1628" }}
              >
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" style={{ color: "#D4A017" }} />
                  <span
                    className="font-semibold text-white text-sm"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    Tax Invoice · INV-2024-0892
                  </span>
                </div>
                <button
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: "#D4A017", color: "#0A0A0A" }}
                >
                  <Download className="w-3 h-3" />
                  Export PDF
                </button>
              </div>

              {/* Invoice body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      From
                    </p>
                    <p className="font-semibold text-sm" style={{ color: "#0A0A0A" }}>
                      Navkar C&F Pvt. Ltd.
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      GSTIN: 27AABCN1234F1Z5
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      IEC: 0519054321
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7280" }}>
                      Bill To
                    </p>
                    <p className="font-semibold text-sm" style={{ color: "#0A0A0A" }}>
                      Tata International Ltd.
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      GSTIN: 27AAACT1234A1Z3
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      Mumbai, Maharashtra
                    </p>
                  </div>
                </div>

                {/* Line items */}
                <div
                  className="rounded-xl overflow-hidden mb-4"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  <div
                    className="grid grid-cols-3 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ background: "#F3F4F6", color: "#6B7280" }}
                  >
                    <span>Service</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {[
                    { service: "Ocean Freight (NHAVA → HAM)", qty: "1 BL", amount: "₹98,000" },
                    { service: "Documentation Charges", qty: "1", amount: "₹3,500" },
                    { service: "CFS Handling", qty: "2 Cont", amount: "₹8,200" },
                  ].map((item) => (
                    <div
                      key={item.service}
                      className="grid grid-cols-3 px-4 py-2.5 text-xs border-t"
                      style={{ borderColor: "#E5E7EB", color: "#0A0A0A" }}
                    >
                      <span>{item.service}</span>
                      <span className="text-center" style={{ color: "#6B7280" }}>
                        {item.qty}
                      </span>
                      <span className="text-right font-medium">{item.amount}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "Subtotal", value: "₹1,09,700" },
                    { label: "IGST @ 18%", value: "₹19,746" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span style={{ color: "#6B7280" }}>{row.label}</span>
                      <span style={{ color: "#0A0A0A" }}>{row.value}</span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between text-sm font-bold pt-2 mt-1 border-t"
                    style={{ borderColor: "#E5E7EB", color: "#0A0A0A" }}
                  >
                    <span>Total</span>
                    <span style={{ color: "#D4A017", fontSize: "16px" }}>₹1,29,446</span>
                  </div>
                </div>

                <div
                  className="mt-4 p-3 rounded-xl flex items-center gap-2"
                  style={{ background: "#F0FDF4" }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#16A34A" }} />
                  <span className="text-xs font-medium" style={{ color: "#166534" }}>
                    GST-compliant · Ready for filing · Generated in 4 seconds
                  </span>
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl shadow-xl"
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4" style={{ color: "#D4A017" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#0A0A0A" }}>
                    ₹2.4Cr+
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Invoiced this month
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
