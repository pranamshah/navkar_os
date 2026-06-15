"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

type BillingCycle = "monthly" | "quarterly" | "yearly";

/* ── Products ─────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: "nexlog", name: "Nexlog", tagline: "Freight Forwarding",
    icon: "navigation", color: "#1565C0", monthly: 1799,
    forWho: "C&F Agents & Freight Forwarders",
    features: ["Unlimited job management", "BL & MBL handling", "AI document extraction", "Live vessel tracking", "GST invoicing in 3 clicks", "Tally XML export", "Multi-branch support", "Client portal"],
  },
  {
    id: "entryx", name: "EntryX", tagline: "Customs Clearance",
    icon: "gavel", color: "#5B21B6", monthly: 1899,
    forWho: "Custom House Agents (CHA)",
    features: ["Unlimited Bills of Entry", "AI BE preparation", "ICEGATE auto-sync", "Live CBIC tariff", "Auto HS code detection", "Duty drawback tracking", "IGST split calc", "Custom workflows"],
  },
  {
    id: "dockiq", name: "DockIQ", tagline: "CFS & Warehouse",
    icon: "warehouse", color: "#0D7057", monthly: 1599,
    forWho: "CFS Stations & Warehouses",
    features: ["Unlimited container handling", "Gate-in/out log", "Auto storage slab billing", "Yard 3D view", "Mobile gate app", "Auto invoice generation", "WhatsApp alerts", "Importer portal"],
  },
  {
    id: "rundesk", name: "RunDesk", tagline: "Transport Management",
    icon: "local_shipping", color: "#92400E", monthly: 1399,
    forWho: "Transporters & Fleet Operators",
    features: ["Unlimited LRs & builty", "Trip management", "GPS via driver app", "Auto e-way bill", "GST freight invoicing", "Fleet analytics", "Mobile driver app", "Fuel log"],
  },
  {
    id: "accura", name: "Accura", tagline: "Freight Accounting",
    icon: "account_balance", color: "#1A237E", monthly: 1499,
    forWho: "All Freight Businesses",
    features: ["Unlimited invoices", "Auto GSTR-1 & GSTR-3B", "Multi-currency", "Tally XML sync", "P&L in 3 seconds", "Per-job profitability", "Outstanding tracker", "TDS/TCS support"],
  },
  {
    id: "tradepilot", name: "TradePilot", tagline: "Trade Intelligence",
    icon: "public", color: "#004D40", monthly: 1699,
    forWho: "Importers & Exporters",
    features: ["AI landed cost calculator", "Auto FTA eligibility", "RoDTEP tracker", "CEPA compliance", "Unlimited HS codes", "Trade analytics", "Duty benefit alerts", "Document vault"],
  },
];

const BUNDLES = [
  { name: "Forwarder Bundle", subtitle: "Nexlog + Accura", icon: "navigation", color: "#1565C0", monthly: 2699, products: ["Nexlog", "Accura"], separate: 3298 },
  { name: "CHA Bundle",       subtitle: "EntryX + Accura",  icon: "gavel",         color: "#5B21B6", monthly: 2799, products: ["EntryX", "Accura"], separate: 3398 },
  { name: "CFS Bundle",       subtitle: "DockIQ + Accura",  icon: "warehouse",     color: "#0D7057", monthly: 2499, products: ["DockIQ", "Accura"], separate: 3098 },
  { name: "Transporter Bundle", subtitle: "RunDesk + Accura", icon: "local_shipping", color: "#92400E", monthly: 2299, products: ["RunDesk", "Accura"], separate: 2898 },
  { name: "Full Suite", subtitle: "All 6 products", icon: "workspaces", color: "#1E40AF", monthly: 7499, products: ["Nexlog", "EntryX", "DockIQ", "RunDesk", "Accura", "TradePilot"], separate: 9894, highlight: true },
];

const FAQS = [
  { q: "Is there a free trial?",              a: "Yes — every product comes with a 14-day free trial. No credit card required to start." },
  { q: "Can I switch products later?",        a: "Absolutely. Add or remove products any time from your dashboard." },
  { q: "What payment methods are accepted?",  a: "All major cards, UPI, net banking and bank transfers via Razorpay." },
  { q: "Is my data secure?",                  a: "All data is encrypted at rest and in transit. We follow ISO 27001 practices and are GSTN-compliant." },
  { q: "Do I need to install anything?",      a: "NavkarOS is 100% cloud-based. You only need a browser and internet connection." },
  { q: "Can multiple users access the account?", a: "Yes. Add unlimited staff with role-based permissions — included in every plan." },
];

function calcPrice(monthly: number, cycle: BillingCycle) {
  if (cycle === "quarterly") return Math.round(monthly * 0.9);
  if (cycle === "yearly")    return Math.round(monthly * 0.8);
  return monthly;
}

function billedNote(monthly: number, cycle: BillingCycle) {
  if (cycle === "quarterly") return `₹${(Math.round(monthly * 0.9) * 3).toLocaleString("en-IN")} billed quarterly`;
  if (cycle === "yearly")    return `₹${(Math.round(monthly * 0.8) * 12).toLocaleString("en-IN")} billed yearly`;
  return "billed monthly";
}

export default function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCycleChange = (c: BillingCycle) => {
    setCycle(c);
    if (c === "yearly") {
      confetti({ particleCount: 55, spread: 65, origin: { x: 0.5, y: 0.45 }, colors: ["#1E40AF", "#60A5FA", "#1a1c1c", "#ffffff"], ticks: 200, gravity: 1.2, decay: 0.93, startVelocity: 26 });
    }
  };

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-12 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border"
            style={{ background: "rgba(30,64,175,0.08)", borderColor: "rgba(30,64,175,0.25)", color: "#1E40AF" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>star</span>
            14-day free trial · no credit card
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
            Pay only for what you use
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            6 products, each priced for the complexity it solves. Pick one or bundle for bigger savings.
          </p>
        </motion.div>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex justify-center mb-10 px-6">
        <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm gap-1">
          {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((c) => {
            const badge = c === "quarterly" ? "Save 10%" : c === "yearly" ? "Save 20%" : null;
            return (
              <button key={c} onClick={() => handleCycleChange(c)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${cycle === c ? "bg-[#1a1c1c] text-[#1E40AF] shadow" : "text-gray-500 hover:text-gray-800"}`}>
                <span className="capitalize">{c}</span>
                {badge && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: cycle === c ? "rgba(30,64,175,0.2)" : "#dcfce7", color: cycle === c ? "#1E40AF" : "#16a34a" }}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* All 6 products grid */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p, i) => {
            const price = calcPrice(p.monthly, cycle);
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border bg-white flex flex-col"
                style={{ borderColor: "#e5e7eb" }}>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "#f3f4f6" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${p.color}12`, border: `1.5px solid ${p.color}25` }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: p.color }}>{p.icon}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.tagline}</p>
                      <p className="font-black text-gray-900 text-base leading-tight">{p.name}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: p.color }}>
                    For {p.forWho}
                  </p>
                </div>

                {/* Price */}
                <div className="px-6 py-5">
                  <div className="flex items-end gap-1 mb-0.5">
                    <span className="text-4xl font-black text-gray-900">
                      ₹<NumberFlow value={price} transformTiming={{ duration: 380, easing: "ease-out" }} willChange />
                    </span>
                    <span className="text-sm text-gray-400 mb-1.5">/mo</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-5">{billedNote(p.monthly, cycle)}</p>

                  {/* Features */}
                  <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: p.color }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup"
                    className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 block"
                    style={{ background: "#1a1c1c", color: "#1E40AF" }}>
                    Start Free Trial
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bundle Plans */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bundle Plans</p>
          <h2 className="text-3xl font-black text-gray-900">Use multiple products? Save more.</h2>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">Pre-packaged combinations at a lower price than buying individually.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {BUNDLES.map((bundle) => {
            const price = calcPrice(bundle.monthly, cycle);
            const saving = bundle.separate - bundle.monthly;
            const isHL = bundle.highlight;
            return (
              <motion.div key={bundle.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border p-5 flex flex-col relative"
                style={{ background: isHL ? "#1a1c1c" : "#fff", borderColor: isHL ? "rgba(30,64,175,0.35)" : "#e5e7eb", borderWidth: isHL ? 2 : 1 }}>

                {isHL && (
                  <div className="absolute -top-px right-4 bg-[#1E40AF] px-3 py-1 rounded-b-xl">
                    <span className="text-[#1a1c1c] text-xs font-black uppercase tracking-wider">Best Value</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isHL ? "rgba(30,64,175,0.15)" : `${bundle.color}10`, border: isHL ? "1px solid rgba(30,64,175,0.3)" : `1px solid ${bundle.color}25` }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: isHL ? "#1E40AF" : bundle.color }}>{bundle.icon}</span>
                  </div>
                  <div>
                    <p className="font-black text-sm" style={{ color: isHL ? "#fff" : "#1a1c1c" }}>{bundle.name}</p>
                    <p className="text-[10px]" style={{ color: isHL ? "rgba(255,255,255,0.4)" : "#9ca3af" }}>{bundle.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-end gap-1 mb-0.5">
                  <span className="text-2xl font-black" style={{ color: isHL ? "#1E40AF" : "#1a1c1c" }}>
                    ₹<NumberFlow value={price} transformTiming={{ duration: 380, easing: "ease-out" }} willChange />
                  </span>
                  <span className="text-xs mb-1" style={{ color: isHL ? "rgba(255,255,255,0.4)" : "#9ca3af" }}>/mo</span>
                </div>
                <p className="text-xs font-semibold mb-4" style={{ color: "#22c55e" }}>Save ₹{saving.toLocaleString("en-IN")}/mo</p>

                <div className="flex flex-wrap gap-1 mb-5 flex-1">
                  {bundle.products.map((pr) => (
                    <span key={pr} className="text-[10px] px-2 py-0.5 rounded-md font-semibold"
                      style={{ background: isHL ? "rgba(30,64,175,0.12)" : "#f3f4f6", color: isHL ? "#1E40AF" : "#4b5563" }}>
                      {pr}
                    </span>
                  ))}
                </div>

                <Link href="/signup"
                  className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all duration-200 block"
                  style={{ background: isHL ? "#1E40AF" : "#1a1c1c", color: isHL ? "#1a1c1c" : "#1E40AF" }}>
                  Get Bundle
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enterprise */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border"
          style={{ background: "#1a1c1c", borderColor: "rgba(30,64,175,0.2)" }}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(30,64,175,0.7)" }}>Enterprise</span>
            <h3 className="text-2xl font-black text-white mt-1">Custom pricing for large operations</h3>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
              Multiple branches, custom SLAs, dedicated success manager, on-premise and volume discounts.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              {["Custom SLA", "Dedicated support", "On-premise option", "Volume discounts", "Multi-branch"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <Check className="h-3 w-3" style={{ color: "#1E40AF" }} /> {f}
                </span>
              ))}
            </div>
          </div>
          <Link href="/contact"
            className="flex-shrink-0 px-7 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider whitespace-nowrap hover:opacity-90 transition-opacity"
            style={{ background: "#1E40AF", color: "#1a1c1c" }}>
            Talk to Sales →
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border bg-white overflow-hidden"
              style={{ borderColor: openFaq === i ? "rgba(30,64,175,0.4)" : "#e5e7eb" }}>
              <button className="w-full px-5 py-4 flex items-center justify-between text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="font-semibold text-sm text-gray-800">{faq.q}</span>
                <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 18, color: openFaq === i ? "#1E40AF" : "#9ca3af" }}>
                  {openFaq === i ? "expand_less" : "expand_more"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
