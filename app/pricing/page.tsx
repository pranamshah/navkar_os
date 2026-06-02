"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Anchor,
  FileText,
  Receipt,
  Users,
  BarChart2,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import CustomCursor from "@/components/home/CustomCursor";

// ── Icon map ───────────────────────────────────────────────────────────────
const MODULE_ICONS: Record<string, LucideIcon> = {
  freightops: Anchor,
  docai: FileText,
  billgen: Receipt,
  clienthub: Users,
  accountsos: BarChart2,
  ratedesk: TrendingUp,
  connectlayer: Zap,
};

// ── Data ───────────────────────────────────────────────────────────────────
const modules = [
  {
    id: "freightops",
    name: "FreightOps",
    tagline: "Job & shipment management",
    price: 799,
    features: ["Unlimited job entries", "FCL / LCL / Air / Breakbulk", "ICEGATE customs filing", "Vessel & flight tracking"],
  },
  {
    id: "docai",
    name: "DocAI",
    tagline: "AI document extraction",
    price: 599,
    features: ["PDF & scanned doc support", "BL, invoice, packing list", "Bill of Entry parsing", "Mobile photo capture"],
  },
  {
    id: "billgen",
    name: "BillGen",
    tagline: "GST invoicing",
    price: 399,
    features: ["GST invoice generation", "Auto IGST / CGST split", "WhatsApp delivery", "GSTR-1 data export"],
  },
  {
    id: "clienthub",
    name: "ClientHub",
    tagline: "Client tracking portal",
    price: 499,
    features: ["Branded client portal", "Real-time tracking", "Document downloads", "Invoice access"],
  },
  {
    id: "accountsos",
    name: "AccountsOS",
    tagline: "Accounts & P&L",
    price: 699,
    features: ["Receivables & payables", "Vendor bill management", "P&L reports", "Tally XML export"],
  },
  {
    id: "ratedesk",
    name: "RateDesk",
    tagline: "Rate management & quoting",
    price: 349,
    features: ["Carrier rate cards", "Instant quotation", "Quote to Job in one click", "Rate expiry alerts"],
  },
  {
    id: "connectlayer",
    name: "ConnectLayer",
    tagline: "API integrations",
    price: 449,
    features: ["ICEGATE & GSTN APIs", "WhatsApp Business", "MarineTraffic AIS", "Razorpay payment links"],
  },
];

const TOTAL_MODULE_PRICE = modules.reduce((s, m) => s + m.price, 0); // 3793

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
      <CustomCursor />
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
              Start with a bundle or pick individual modules. Every plan includes a 14-day free trial with no credit card required.
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
                    boxShadow: plan.highlight
                      ? "0 24px 60px rgba(212,175,55,0.14)"
                      : "0 4px 24px rgba(0,0,0,0.04)",
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
                      <p className="text-sm mt-1" style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : "#7e7576" }}>
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
                        <p className="text-xs mt-0.5" style={{ color: "#D4AF37" }}>
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
                      href={plan.id === "pro" ? "/#contact" : "/signup"}
                      className="block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none mt-2"
                      style={{
                        background: plan.highlight ? "#D4AF37" : "#1a1c1c",
                        color: plan.highlight ? "#1a1c1c" : "#fff",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.88";
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
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
                Talk to our Enterprise team
              </a>
            </p>
          </div>
        </section>

        {/* ── Divider ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6">
          <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }} />
        </div>

        {/* ── À la carte — redesigned manifest rows ─────────── */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">

            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8"
              style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}
            >
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#D4AF37" }}
                >
                  À la carte
                </p>
                <h2
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "clamp(28px, 3.5vw, 42px)",
                    fontWeight: 400,
                    color: "#1a1c1c",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  Build your own stack.
                </h2>
                <p
                  className="mt-2 text-sm"
                  style={{ color: "#7e7576", lineHeight: 1.75, maxWidth: "380px" }}
                >
                  Add to any bundle, or start from scratch with only the modules you need.
                </p>
              </div>

              {/* All-in summary chip */}
              <div
                className="flex-shrink-0 p-5"
                style={{
                  background: "rgba(26,28,28,0.03)",
                  border: "0.5px solid rgba(0,0,0,0.08)",
                  minWidth: "200px",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "#7e7576" }}
                >
                  All 7 modules
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1a1c1c",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    ₹{TOTAL_MODULE_PRICE.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm ml-0.5" style={{ color: "#7e7576" }}>
                    /mo
                  </span>
                </div>
                <p className="text-xs mt-1.5" style={{ color: "#7e7576" }}>
                  Modules only — seats billed on plan
                </p>
              </div>
            </motion.div>

            {/* Module manifest rows */}
            <div>
              {modules.map((mod, i) => {
                const Icon = MODULE_ICONS[mod.id];
                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-8px" }}
                    transition={{ duration: 0.45, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative"
                    style={{ borderBottom: "0.5px solid rgba(0,0,0,0.07)" }}
                  >
                    {/* Gold left border — scaleY from top on hover */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[2px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"
                      style={{ background: "#D4AF37" }}
                    />

                    {/* Hover background tint */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: "rgba(212,175,55,0.022)" }}
                    />

                    {/* Row — 2 cols on mobile, 4 cols on desktop */}
                    <div
                      className="relative grid items-center gap-4 lg:gap-6 px-4 lg:px-6 py-5 lg:py-6"
                      style={{
                        gridTemplateColumns: "1fr 7rem",
                      }}
                    >
                      {/* ── LEFT BLOCK (spans full width on mobile) ── */}
                      <div className="flex items-center gap-3 lg:contents">

                        {/* Decorative sequence number — desktop only */}
                        <span
                          className="hidden lg:block flex-shrink-0 w-12 text-right select-none"
                          style={{
                            fontFamily: "'EB Garamond', Georgia, serif",
                            fontSize: "32px",
                            fontWeight: 400,
                            color: "rgba(26,28,28,0.1)",
                            lineHeight: 1,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Icon + name + tagline */}
                        <div className="min-w-0 flex-1 lg:flex-none">
                          <div className="flex items-center gap-2.5 mb-1">
                            {/* Icon container */}
                            <div
                              className="flex-shrink-0 flex items-center justify-center"
                              style={{
                                width: 26,
                                height: 26,
                                background: "rgba(212,175,55,0.1)",
                                borderRadius: "4px",
                              }}
                            >
                              <Icon size={13} strokeWidth={1.5} color="#D4AF37" />
                            </div>

                            {/* Module name — slides right on row hover */}
                            <span
                              className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-[4px]"
                              style={{
                                fontFamily: "'EB Garamond', Georgia, serif",
                                fontSize: "20px",
                                fontWeight: 400,
                                color: "#1a1c1c",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {mod.name}
                            </span>
                          </div>

                          {/* Tagline */}
                          <p
                            className="text-xs"
                            style={{ color: "#7e7576", paddingLeft: "38px" }}
                          >
                            {mod.tagline}
                          </p>
                        </div>

                        {/* Feature list — desktop only, 2×2 grid */}
                        <div
                          className="hidden lg:grid flex-shrink-0"
                          style={{
                            gridTemplateColumns: "1fr 1fr",
                            gap: "6px 24px",
                            width: "320px",
                          }}
                        >
                          {mod.features.map((f) => (
                            <div key={f} className="flex items-center gap-2 min-w-0">
                              <span
                                className="flex-shrink-0 rounded-full"
                                style={{
                                  width: 4,
                                  height: 4,
                                  background: "#D4AF37",
                                  opacity: 0.55,
                                }}
                              />
                              <span
                                className="text-xs truncate"
                                style={{ color: "#7e7576" }}
                              >
                                {f}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── RIGHT BLOCK: price + demo ── */}
                      <div className="text-right flex-shrink-0">
                        <span
                          className="font-bold transition-colors duration-200 group-hover:text-[#D4AF37] text-[#1a1c1c]"
                          style={{
                            fontSize: "19px",
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                          }}
                        >
                          ₹{mod.price.toLocaleString("en-IN")}
                        </span>
                        <p className="text-xs mt-0.5 mb-3" style={{ color: "#7e7576" }}>
                          /mo
                        </p>
                        <Link
                          href={`/demo/${mod.id}`}
                          className="text-xs font-semibold uppercase tracking-widest cursor-none transition-colors duration-200 group-hover:text-[#D4AF37] text-[#7e7576]"
                        >
                          Demo
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-xs mt-7"
              style={{ color: "rgba(0,0,0,0.3)" }}
            >
              All prices exclusive of GST. Modules can be added or removed at any time.
            </motion.p>
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Start Free Trial
              </Link>
              <Link
                href="/#contact"
                className="px-10 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.color = "#D4AF37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.color = "#fff";
                }}
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
