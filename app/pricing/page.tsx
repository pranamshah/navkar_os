"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ─────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────── */
type BillingCycle = "monthly" | "quarterly" | "yearly";

/* ─────────────────────────────────────────────────────────────────────────
   Roles
───────────────────────────────────────────────────────────────────────── */
const ROLES = [
  { id: "forwarder",   label: "Freight Forwarder",   sublabel: "C&F Agent / NVOCC",            icon: "navigation",    color: "#1565C0" },
  { id: "cha",         label: "Custom House Agent",   sublabel: "Licensed CHA / IEC Holder",    icon: "gavel",         color: "#5B21B6" },
  { id: "cfs",         label: "CFS / Warehouse",      sublabel: "Container Freight Station",    icon: "warehouse",     color: "#0D7057" },
  { id: "transporter", label: "Transporter",          sublabel: "Fleet Operator / Road Hauler", icon: "local_shipping", color: "#92400E" },
  { id: "trader",      label: "Importer / Exporter",  sublabel: "Trader & Trade Compliance",   icon: "public",        color: "#004D40" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

/* ─────────────────────────────────────────────────────────────────────────
   Products per role (pro tier monthly price)
───────────────────────────────────────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  monthly: number;
  features: string[];
  isMain: boolean;
}

const PRODUCTS_BY_ROLE: Record<RoleId, Product[]> = {
  forwarder: [
    {
      id: "nexlog", name: "Nexlog", tagline: "Freight Forwarding",
      icon: "navigation", color: "#1565C0", monthly: 2999, isMain: true,
      features: [
        "Unlimited job management", "BL & MBL handling",
        "Live vessel tracking", "GST invoicing in 3 clicks",
        "Tally XML export", "AI doc extraction", "Multi-branch",
      ],
    },
    {
      id: "accura", name: "Accura", tagline: "Freight Accounting",
      icon: "account_balance", color: "#1A237E", monthly: 2299, isMain: false,
      features: [
        "Auto-posts from every module", "GSTR-1 & GSTR-3B ready",
        "P&L in 3 seconds", "Tally sync", "Outstanding tracker",
      ],
    },
  ],
  cha: [
    {
      id: "entryx", name: "EntryX", tagline: "Customs Clearance",
      icon: "gavel", color: "#5B21B6", monthly: 2999, isMain: true,
      features: [
        "Unlimited Bill of Entry", "AI BE preparation",
        "ICEGATE auto-sync", "Live CBIC tariff",
        "HS code detection", "Duty drawback tracking", "Custom workflows",
      ],
    },
    {
      id: "accura", name: "Accura", tagline: "Freight Accounting",
      icon: "account_balance", color: "#1A237E", monthly: 2299, isMain: false,
      features: [
        "Auto-posts from every module", "GSTR-1 & GSTR-3B ready",
        "P&L in 3 seconds", "Tally sync", "Outstanding tracker",
      ],
    },
  ],
  cfs: [
    {
      id: "dockiq", name: "DockIQ", tagline: "CFS & Warehouse",
      icon: "warehouse", color: "#0D7057", monthly: 3999, isMain: true,
      features: [
        "Unlimited container handling", "Auto storage slab billing",
        "Yard 3D view", "Mobile gate app",
        "WhatsApp notifications", "Auto invoice generation", "Custom reports",
      ],
    },
    {
      id: "accura", name: "Accura", tagline: "Freight Accounting",
      icon: "account_balance", color: "#1A237E", monthly: 2299, isMain: false,
      features: [
        "Auto-posts from every module", "GSTR-1 & GSTR-3B ready",
        "P&L in 3 seconds", "Tally sync", "Outstanding tracker",
      ],
    },
  ],
  transporter: [
    {
      id: "rundesk", name: "RunDesk", tagline: "Transport & Fleet",
      icon: "local_shipping", color: "#92400E", monthly: 2299, isMain: true,
      features: [
        "Unlimited LRs & builty", "Trip management",
        "GPS via driver app", "Auto e-way bill",
        "GST freight invoicing", "Fleet analytics", "Mobile driver app",
      ],
    },
    {
      id: "accura", name: "Accura", tagline: "Freight Accounting",
      icon: "account_balance", color: "#1A237E", monthly: 2299, isMain: false,
      features: [
        "Auto-posts from every module", "GSTR-1 & GSTR-3B ready",
        "P&L in 3 seconds", "Tally sync", "Outstanding tracker",
      ],
    },
  ],
  trader: [
    {
      id: "tradepilot", name: "TradePilot", tagline: "Trade Intelligence",
      icon: "public", color: "#004D40", monthly: 1499, isMain: true,
      features: [
        "AI landed cost calculator", "Auto FTA eligibility",
        "RoDTEP tracker", "CEPA compliance",
        "Unlimited HS codes", "Trade analytics", "Duty benefit alerts",
      ],
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
   Bundle per role
───────────────────────────────────────────────────────────────────────── */
interface Bundle {
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  monthly: number;
  products: string[];
  saving: string;
  isHighlight?: boolean;
}

const BUNDLE_BY_ROLE: Partial<Record<RoleId, Bundle>> = {
  forwarder:   { name: "Forwarder Bundle", subtitle: "Nexlog + Accura",      icon: "navigation",    color: "#1565C0", monthly: 4499, products: ["Nexlog", "Accura"],       saving: "Save ₹800/mo vs separate" },
  cha:         { name: "CHA Bundle",        subtitle: "EntryX + Accura",      icon: "gavel",         color: "#5B21B6", monthly: 4499, products: ["EntryX", "Accura"],       saving: "Save ₹800/mo vs separate" },
  cfs:         { name: "CFS Bundle",        subtitle: "DockIQ + Accura",      icon: "warehouse",     color: "#0D7057", monthly: 5499, products: ["DockIQ", "Accura"],       saving: "Save ₹799/mo vs separate" },
  transporter: { name: "Transporter Bundle",subtitle: "RunDesk + Accura",     icon: "local_shipping", color: "#92400E", monthly: 3799, products: ["RunDesk", "Accura"],     saving: "Save ₹799/mo vs separate" },
};

const ALL_BUNDLES: Bundle[] = [
  {
    name: "Full Suite",
    subtitle: "All 6 products — complete logistics OS",
    icon: "workspaces",
    color: "#D4AF37",
    monthly: 12999,
    products: ["Nexlog", "EntryX", "DockIQ", "RunDesk", "Accura", "TradePilot"],
    saving: "Save ₹2,096/mo vs individual",
    isHighlight: true,
  },
  { name: "Forwarder Bundle", subtitle: "Nexlog + Accura",  icon: "navigation",    color: "#1565C0", monthly: 4499,  products: ["Nexlog", "Accura"],       saving: "Save ₹800/mo" },
  { name: "CHA Bundle",       subtitle: "EntryX + Accura",  icon: "gavel",         color: "#5B21B6", monthly: 4499,  products: ["EntryX", "Accura"],       saving: "Save ₹800/mo" },
  { name: "CFS Bundle",       subtitle: "DockIQ + Accura",  icon: "warehouse",     color: "#0D7057", monthly: 5499,  products: ["DockIQ", "Accura"],       saving: "Save ₹799/mo" },
  { name: "Transporter Bundle",subtitle: "RunDesk + Accura",icon: "local_shipping", color: "#92400E", monthly: 3799, products: ["RunDesk", "Accura"],      saving: "Save ₹799/mo" },
];

const FAQS = [
  { q: "Is there a free trial?",              a: "Yes — every product comes with a 14-day free trial. No credit card required to start." },
  { q: "Can I switch plans later?",           a: "Absolutely. You can upgrade, downgrade, or switch billing cycles at any time from your dashboard." },
  { q: "What payment methods are accepted?",  a: "We accept all major cards, UPI, net banking and bank transfers via Razorpay." },
  { q: "Is my data secure?",                  a: "All data is encrypted at rest and in transit. We follow ISO 27001 practices and are GSTN-compliant." },
  { q: "Do I need to install anything?",      a: "NavkarOS is 100% cloud-based. You only need a browser and internet connection." },
  { q: "Can multiple users access the account?", a: "Yes. You can add staff with role-based permissions. Team size limits vary by plan." },
];

/* ─────────────────────────────────────────────────────────────────────────
   Pricing helpers
───────────────────────────────────────────────────────────────────────── */
function calcPrice(monthly: number, cycle: BillingCycle) {
  if (cycle === "quarterly") return Math.round(monthly * 0.9);  // 10% off per-month equiv
  if (cycle === "yearly")    return Math.round(monthly * 0.8);  // 20% off per-month equiv
  return monthly;
}

function cycleBadge(cycle: BillingCycle) {
  if (cycle === "quarterly") return { label: "10% off", color: "#16a34a" };
  if (cycle === "yearly")    return { label: "20% off", color: "#16a34a" };
  return null;
}

function cycleBilledNote(monthly: number, cycle: BillingCycle) {
  if (cycle === "quarterly") return `₹${(Math.round(monthly * 0.9) * 3).toLocaleString("en-IN")} billed quarterly`;
  if (cycle === "yearly")    return `₹${(Math.round(monthly * 0.8) * 12).toLocaleString("en-IN")} billed yearly`;
  return "billed monthly";
}

/* ─────────────────────────────────────────────────────────────────────────
   Product Card
───────────────────────────────────────────────────────────────────────── */
function ProductCard({ product, cycle, delay = 0 }: { product: Product; cycle: BillingCycle; delay?: number }) {
  const price = calcPrice(product.monthly, cycle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border p-6 flex flex-col bg-white relative",
        product.isMain
          ? "border-[#D4AF37] border-2 shadow-lg shadow-[#D4AF3712]"
          : "border-gray-100 shadow-sm"
      )}
    >
      {product.isMain && (
        <div className="absolute -top-px right-5 bg-[#D4AF37] px-3 py-1 rounded-b-xl flex items-center gap-1.5">
          <Star className="h-3 w-3 fill-white text-white" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">Recommended</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${product.color}12`, border: `1.5px solid ${product.color}25` }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: product.color }}>
            {product.icon}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{product.tagline}</p>
          <p className="font-black text-gray-900 text-base leading-tight">{product.name}</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 mb-0.5">
        <span className="text-4xl font-black text-gray-900">
          ₹<NumberFlow value={price} transformTiming={{ duration: 380, easing: "ease-out" }} willChange />
        </span>
        <span className="text-sm text-gray-400 mb-1.5">/mo</span>
      </div>
      <p className="text-xs text-gray-400 mb-5">{cycleBilledNote(product.monthly, cycle)}</p>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1 mb-6">
        {product.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: product.color }} />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={cn(
          "w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 block",
          product.isMain
            ? "bg-[#1a1c1c] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a1c1c]"
            : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]"
        )}
      >
        Start 14-Day Free Trial
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Bundle Card
───────────────────────────────────────────────────────────────────────── */
function BundleCard({ bundle, cycle, highlight = false }: { bundle: Bundle; cycle: BillingCycle; highlight?: boolean }) {
  const price = calcPrice(bundle.monthly, cycle);
  const isHL  = bundle.isHighlight || highlight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-2xl border p-6 flex flex-col relative",
        isHL ? "bg-[#1a1c1c] border-[#D4AF37] border-2" : "bg-white border-gray-100 shadow-sm"
      )}
    >
      {isHL && (
        <div className="absolute -top-px right-5 bg-[#D4AF37] px-3 py-1 rounded-b-xl">
          <span className="text-[#1a1c1c] text-xs font-black uppercase tracking-wider">Best Value</span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isHL ? "rgba(212,175,55,0.15)" : `${bundle.color}10`,
            border: isHL ? "1px solid rgba(212,175,55,0.3)" : `1px solid ${bundle.color}25`,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: isHL ? "#D4AF37" : bundle.color }}>
            {bundle.icon}
          </span>
        </div>
        <div>
          <p className="font-black text-base" style={{ color: isHL ? "#fff" : "#1a1c1c" }}>{bundle.name}</p>
          <p className="text-xs" style={{ color: isHL ? "rgba(255,255,255,0.45)" : "#7e7576" }}>{bundle.subtitle}</p>
        </div>
      </div>

      <div className="flex items-end gap-1 mb-0.5">
        <span className="text-3xl font-black" style={{ color: isHL ? "#D4AF37" : "#1a1c1c" }}>
          ₹<NumberFlow value={price} transformTiming={{ duration: 380, easing: "ease-out" }} willChange />
        </span>
        <span className="text-sm mb-1.5" style={{ color: isHL ? "rgba(255,255,255,0.4)" : "#7e7576" }}>/mo</span>
      </div>
      <p className="text-xs font-semibold mb-4" style={{ color: "#22c55e" }}>{bundle.saving}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {bundle.products.map((p) => (
          <span
            key={p}
            className="text-xs px-2 py-0.5 rounded-md font-semibold"
            style={{
              background: isHL ? "rgba(212,175,55,0.12)" : "#f3f4f6",
              color: isHL ? "#D4AF37" : "#4b5563",
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <Link
        href="/signup"
        className="mt-auto w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 block"
        style={{
          background: isHL ? "#D4AF37" : "#1a1c1c",
          color: isHL ? "#1a1c1c" : "#D4AF37",
        }}
      >
        Get Started
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────── */
export default function PricingPage() {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const role        = ROLES.find((r) => r.id === selectedRole);
  const products    = selectedRole ? PRODUCTS_BY_ROLE[selectedRole] : [];
  const roleBundle  = selectedRole ? BUNDLE_BY_ROLE[selectedRole] : undefined;

  const handleRoleSelect = (id: RoleId) => {
    setSelectedRole(id);
    // Smooth-scroll to products after a brief delay
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleCycleChange = (c: BillingCycle) => {
    setCycle(c);
    if (c === "yearly") {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { x: 0.5, y: 0.45 },
        colors: ["#D4AF37", "#f6be39", "#1a1c1c", "#ffffff"],
        ticks: 200, gravity: 1.2, decay: 0.93, startVelocity: 26, shapes: ["circle"],
      });
    }
  };

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="pt-32 pb-10 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border"
            style={{ background: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.25)", color: "#D4AF37" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>star</span>
            14-day free trial · no credit card
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight">
            Pricing built for logistics
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            Tell us who you are — we&apos;ll show exactly what you need and what it costs.
          </p>
        </motion.div>
      </div>

      {/* ── Step 1: Who are you? ─────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 text-center">
          Step 1 — Who are you?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ROLES.map((r) => {
            const active = selectedRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleSelect(r.id)}
                className={cn(
                  "rounded-2xl border-2 p-4 flex flex-col items-center gap-2 transition-all duration-200 text-center",
                  active
                    ? "border-[#D4AF37] bg-[#1a1c1c] shadow-lg shadow-[#D4AF3718]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                )}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: active ? `${r.color}22` : `${r.color}10`,
                    border: `1.5px solid ${active ? r.color : r.color + "30"}`,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: r.color }}>
                    {r.icon}
                  </span>
                </div>
                <p className={cn("text-xs font-black leading-tight", active ? "text-white" : "text-gray-800")}>
                  {r.label}
                </p>
                <p className={cn("text-[10px] leading-tight", active ? "text-gray-400" : "text-gray-400")}>
                  {r.sublabel}
                </p>
                {active && (
                  <span className="text-[#D4AF37] mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#D4AF37" />
                      <path d="M4.5 7l2 2 3-3" stroke="#1a1c1c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Steps 2–4: Products + Bundles (shown after role selected) ─── */}
      <AnimatePresence>
        {selectedRole && role && (
          <motion.div
            key="products-section"
            ref={productsRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto px-6"
          >
            {/* Role intro banner */}
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-8 border"
              style={{
                background: `${role.color}08`,
                borderColor: `${role.color}25`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${role.color}18`, border: `1.5px solid ${role.color}30` }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: role.color }}>
                  {role.icon}
                </span>
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">{role.label}</p>
                <p className="text-xs text-gray-500">{role.sublabel} — here&apos;s what NavkarOS has for you</p>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
              >
                Change
              </button>
            </div>

            {/* Step 2: Billing cycle toggle */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">
                Step 2 — Choose your billing cycle
              </p>
              <div className="flex justify-center">
                <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm gap-1">
                  {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((c) => {
                    const badge = c === "quarterly" ? "Save 10%" : c === "yearly" ? "Save 20%" : null;
                    return (
                      <button
                        key={c}
                        onClick={() => handleCycleChange(c)}
                        className={cn(
                          "relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2",
                          cycle === c
                            ? "bg-[#1a1c1c] text-[#D4AF37] shadow"
                            : "text-gray-500 hover:text-gray-800"
                        )}
                      >
                        <span className="capitalize">{c}</span>
                        {badge && (
                          <span
                            className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                            style={{
                              background: cycle === c ? "rgba(212,175,55,0.2)" : "#dcfce7",
                              color: cycle === c ? "#D4AF37" : "#16a34a",
                            }}
                          >
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Product cards */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">
                Step 3 — Pick your products
              </p>
              <div className={cn(
                "grid gap-5",
                products.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
              )}>
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} cycle={cycle} delay={i * 0.08} />
                ))}
              </div>
            </div>

            {/* Bundle hint for this role */}
            {roleBundle && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="max-w-2xl mx-auto mb-14"
              >
                <div
                  className="rounded-2xl border-2 border-[#D4AF37] p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  style={{ background: "rgba(212,175,55,0.04)" }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${role.color}12`, border: `1.5px solid ${role.color}25` }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: role.color }}>bolt</span>
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{roleBundle.name}</p>
                      <p className="text-xs text-gray-500">
                        {roleBundle.products.join(" + ")} ·{" "}
                        <span className="font-bold text-gray-700">
                          ₹{calcPrice(roleBundle.monthly, cycle).toLocaleString("en-IN")}/mo
                        </span>
                        {" "}· <span className="text-green-600 font-semibold">{roleBundle.saving}</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/signup"
                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200"
                    style={{ background: "#D4AF37", color: "#1a1c1c" }}
                  >
                    Get Bundle <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 4: Bundle Plans (always visible) ──────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-4">
        <section className="mb-20 pt-4">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Bundle Plans</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">Save more. Do more.</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              Pre-packaged combinations — at a better price than buying separately.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {ALL_BUNDLES.map((bundle) => (
              <BundleCard key={bundle.name} bundle={bundle} cycle={cycle} />
            ))}
          </div>
        </section>

        {/* ── Enterprise ──────────────────────────────────────── */}
        <section className="mb-20">
          <div
            className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border"
            style={{ background: "#1a1c1c", borderColor: "rgba(212,175,55,0.2)" }}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.7)" }}>
                Enterprise
              </span>
              <h3 className="text-2xl font-black text-white mt-1">Custom pricing for large operations</h3>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                Multiple branches, custom SLAs, dedicated success manager, on-premise and volume discounts.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {["Custom SLA", "Dedicated support", "On-premise option", "Volume discounts", "Multi-branch"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <Check className="h-3 w-3" style={{ color: "#D4AF37" }} /> {f}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 px-7 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 hover:opacity-90"
              style={{ background: "#D4AF37", color: "#1a1c1c" }}
            >
              Talk to Sales →
            </Link>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white overflow-hidden"
                style={{ borderColor: openFaq === i ? "rgba(212,175,55,0.4)" : "#e5e7eb" }}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm text-gray-800">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
