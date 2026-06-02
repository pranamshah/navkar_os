"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const modules = [
  {
    id: "freightops",
    name: "FreightOps",
    tagline: "Job & shipment management",
    desc: "Create, track and manage FCL, LCL, air, and breakbulk jobs end-to-end. ICEGATE EDI ready.",
    price: 799,
    icon: "🚢",
    features: ["Unlimited job entries", "Multi-mode freight (FCL/LCL/Air)", "ICEGATE customs filing", "Vessel & flight tracking"],
  },
  {
    id: "docai",
    name: "DocAI",
    tagline: "AI document extraction",
    desc: "Extract data from BL, invoices, packing lists and customs documents automatically with 98%+ accuracy.",
    price: 599,
    icon: "🧠",
    features: ["PDF & scanned doc support", "BL, invoice, packing list", "Bill of Entry parsing", "Mobile photo capture"],
  },
  {
    id: "billgen",
    name: "BillGen",
    tagline: "GST invoicing",
    desc: "Generate GST-compliant invoices in seconds. Auto-split IGST/CGST/SGST, send via WhatsApp or email.",
    price: 399,
    icon: "🧾",
    features: ["GST invoice generation", "Auto IGST / CGST split", "WhatsApp delivery", "GSTR-1 data export"],
  },
  {
    id: "clienthub",
    name: "ClientHub",
    tagline: "Client tracking portal",
    desc: "Give clients a branded portal to track their shipments, download documents and view invoices.",
    price: 499,
    icon: "🤝",
    features: ["Branded client portal", "Real-time tracking", "Document downloads", "Invoice access"],
  },
  {
    id: "accountsos",
    name: "AccountsOS",
    tagline: "Accounts & P&L",
    desc: "Full accounts module with receivables, payables, vendor bills, P&L and Tally XML sync.",
    price: 699,
    icon: "📊",
    features: ["Receivables & payables", "Vendor bill management", "P&L reports", "Tally XML export"],
  },
  {
    id: "ratedesk",
    name: "RateDesk",
    tagline: "Rate management & quoting",
    desc: "Maintain carrier rate cards, compare rates, generate instant quotations and convert to jobs in one click.",
    price: 349,
    icon: "💹",
    features: ["Carrier rate cards", "Instant quotation", "Quote → Job conversion", "Rate expiry alerts"],
  },
  {
    id: "connectlayer",
    name: "ConnectLayer",
    tagline: "API integrations",
    desc: "Connect NavkarOS to ICEGATE, GSTN, WhatsApp Business, MarineTraffic, Razorpay and Tally.",
    price: 449,
    icon: "🔗",
    features: ["ICEGATE & GSTN APIs", "WhatsApp Business", "MarineTraffic AIS", "Razorpay payment links"],
  },
];

const bundles = [
  {
    id: "starter",
    name: "Starter",
    badge: null,
    monthly: 999,
    annual: 9990,
    desc: "For solo C&F agents getting started.",
    highlight: false,
    features: [
      "1 user seat",
      "Up to 15 jobs/month",
      "FreightOps core module",
      "BillGen — GST invoices",
      "ClientHub (5 clients)",
      "Basic GST accounting",
      "Email support",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "growth",
    name: "Growth",
    badge: "Most Popular",
    monthly: 2499,
    annual: 24990,
    desc: "For growing freight teams.",
    highlight: true,
    features: [
      "3 user seats",
      "Unlimited jobs",
      "Everything in Starter",
      "DocAI — AI doc extraction",
      "RateDesk — instant quoting",
      "WhatsApp auto-notifications",
      "Tally XML export",
      "Receivables & payables",
    ],
    cta: "Select Growth",
  },
  {
    id: "pro",
    name: "Pro",
    badge: null,
    monthly: 4999,
    annual: 49990,
    desc: "For large freight forwarding companies.",
    highlight: false,
    features: [
      "10 user seats",
      "Unlimited everything",
      "Everything in Growth",
      "White-label ClientHub",
      "GSTR-1 & GSTR-3B export",
      "API access & webhooks",
      "Dedicated account manager",
      "Priority phone support",
    ],
    cta: "Contact Sales",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9", minHeight: "100vh" }}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="pt-40 pb-20 px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={stagger} initial="hidden" animate="show"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
                style={{ background: "#e8e8e8", color: "#4c4546" }}
              >
                Simple, Transparent Pricing
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(38px, 5vw, 62px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Pay for what you need.<br />
              <span style={{ color: "#D4AF37" }}>Nothing more.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-base"
              style={{ color: "#7e7576", fontWeight: 300, lineHeight: 1.75 }}
            >
              Start with a bundle or pick individual modules. Every plan includes a 14-day free trial — no credit card required.
            </motion.p>
          </motion.div>
        </section>

        {/* ── Bundle Plans ─────────────────────────────────── */}
        <section className="pb-24 px-6">
          <div className="max-w-5xl mx-auto">

            {/* Toggle */}
            <div className="flex justify-center mb-12">
              <div
                className="inline-flex rounded-full p-1"
                style={{ background: "rgba(0,0,0,0.05)", border: "0.5px solid rgba(0,0,0,0.1)" }}
              >
                {[
                  { label: "Monthly", val: false },
                  { label: "Annual — Save 17%", val: true },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setAnnual(opt.val)}
                    className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-none"
                    style={{
                      background: annual === opt.val ? "#1a1c1c" : "transparent",
                      color: annual === opt.val ? "#fff" : "#7e7576",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {bundles.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: plan.highlight ? "#1a1c1c" : "#fff",
                    border: plan.highlight ? "1px solid #D4AF37" : "0.5px solid rgba(0,0,0,0.1)",
                    boxShadow: plan.highlight ? "0 24px 60px rgba(212,175,55,0.14)" : "0 4px 24px rgba(0,0,0,0.04)",
                    transform: plan.highlight ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  {plan.badge && (
                    <div
                      className="text-center py-2 text-xs font-black uppercase tracking-widest"
                      style={{ background: "#D4AF37", color: "#1a1c1c" }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-8 flex flex-col gap-5">
                    <div>
                      <h3
                        className="font-black text-xl mb-1"
                        style={{
                          fontFamily: "'EB Garamond', Georgia, serif",
                          fontWeight: 400,
                          fontSize: "24px",
                          color: plan.highlight ? "#fff" : "#1a1c1c",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {plan.name}
                      </h3>
                      <p className="text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : "#7e7576" }}>
                        {plan.desc}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span
                          style={{
                            fontSize: "40px",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            color: plan.highlight ? "#D4AF37" : "#1a1c1c",
                          }}
                        >
                          ₹{(annual ? plan.annual / 12 : plan.monthly).toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.4)" : "#7e7576" }}>
                          /mo
                        </span>
                      </div>
                      {annual && (
                        <p className="text-xs mt-0.5" style={{ color: plan.highlight ? "#D4AF37" : "#D4AF37" }}>
                          ₹{plan.annual.toLocaleString("en-IN")} billed annually
                        </p>
                      )}
                    </div>

                    <ul className="flex flex-col gap-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 flex-shrink-0 mt-0.5"
                            style={{ color: plan.highlight ? "#D4AF37" : "#16A34A" }}
                          />
                          <span className="text-sm" style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : "#1a1c1c" }}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.id === "pro" ? "#contact" : "/signup"}
                      className="block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none mt-2"
                      style={{
                        background: plan.highlight ? "#D4AF37" : "#1a1c1c",
                        color: plan.highlight ? "#1a1c1c" : "#fff",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.02)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm mt-8" style={{ color: "#7e7576" }}>
              Need unlimited users and custom integrations?{" "}
              <a href="/#contact" className="font-semibold underline cursor-none" style={{ color: "#D4AF37" }}>
                Talk to our Enterprise team →
              </a>
            </p>
          </div>
        </section>

        {/* ── Divider ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6">
          <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }} />
        </div>

        {/* ── Individual Modules ───────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-14"
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>
                À la carte
              </p>
              <h2
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 400,
                  color: "#1a1c1c",
                  letterSpacing: "-0.02em",
                }}
              >
                Add individual modules to any plan.
              </h2>
              <p className="mt-3 text-sm max-w-lg" style={{ color: "#7e7576", lineHeight: 1.75 }}>
                Already on a bundle? Extend it. Starting fresh? Build your own stack from these modules.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((mod, i) => (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 flex flex-col gap-4"
                  style={{
                    background: "#fff",
                    border: "0.5px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: "22px", lineHeight: 1 }}>{mod.icon}</span>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "#1a1c1c" }}>{mod.name}</p>
                        <p className="text-xs" style={{ color: "#7e7576" }}>{mod.tagline}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p
                        className="font-bold"
                        style={{ fontSize: "20px", color: "#1a1c1c", letterSpacing: "-0.02em" }}
                      >
                        ₹{mod.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs" style={{ color: "#7e7576" }}>/mo</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed" style={{ color: "#7e7576" }}>{mod.desc}</p>

                  {/* Features */}
                  <ul className="flex flex-col gap-1.5 mt-auto">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span style={{ color: "#D4AF37", fontSize: "10px" }}>✦</span>
                        <span className="text-xs" style={{ color: "#4c4546" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={`/demo/${mod.id}`}
                    className="block text-center text-xs font-semibold uppercase tracking-widest py-2.5 mt-2 transition-all duration-200 cursor-none"
                    style={{ border: "0.5px solid #1a1c1c", color: "#1a1c1c" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1c1c"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1c1c"; }}
                  >
                    See Demo →
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section className="py-20 px-6" style={{ background: "#1a1c1c" }}>
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Start free. No credit card.<br />
              <span style={{ color: "#D4AF37" }}>Cancel any time.</span>
            </h2>
            <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>
              14-day full-feature trial on every plan. Our onboarding team will migrate your existing data for free.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/signup"
                className="px-10 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none"
                style={{ background: "#D4AF37", color: "#1a1c1c" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/#contact"
                className="px-10 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.color = "#D4AF37"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
              >
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </>
  );
}
