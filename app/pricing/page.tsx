"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Star, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ── Types ─────────────────────────────────────────── */
type BillingCycle = "monthly" | "yearly";

/* ── Who-uses-what data ─────────────────────────────── */
const SEGMENTS = [
  {
    id: "forwarder",
    icon: "navigation",
    color: "#1565C0",
    title: "Freight Forwarders & C&F Agents",
    subtitle: "Manage shipments, BLs, tracking and GST invoicing end-to-end.",
    products: [
      {
        id: "nexlog", name: "Nexlog", tagline: "Freight Forwarding",
        icon: "navigation", color: "#1565C0",
        monthlyPrice: 1999, yearlyPrice: 1666,
        features: ["Unlimited job management", "BL & MBL handling", "Live vessel tracking", "GST invoicing in 3 clicks", "Tally XML export", "AI doc extraction"],
        description: "Freight Forwarding", isPopular: true,
      },
      {
        id: "accura", name: "Accura", tagline: "Freight Accounting",
        icon: "account_balance_wallet", color: "#1A237E",
        monthlyPrice: 1499, yearlyPrice: 1249,
        features: ["Auto-posts from every module", "GSTR-1 & GSTR-3B ready", "P&L in 3 seconds", "Tally XML export", "Bank reconciliation", "Multi-branch"],
        description: "Accounting", isPopular: false,
      },
    ],
    bundle: { name: "Forwarder Bundle", monthlyPrice: 2999, yearlyPrice: 2499, saving: "Save ₹999/mo" },
  },
  {
    id: "cha",
    icon: "gavel",
    color: "#5B21B6",
    title: "Custom House Agents (CHA)",
    subtitle: "AI-assisted Bill of Entry, ICEGATE filing, duty calc and compliance.",
    products: [
      {
        id: "entryx", name: "EntryX", tagline: "Customs Clearance",
        icon: "gavel", color: "#5B21B6",
        monthlyPrice: 1999, yearlyPrice: 1666,
        features: ["Unlimited Bill of Entry", "AI BE preparation", "ICEGATE auto-sync", "Live CBIC tariff", "HS code detection", "Duty drawback tracking"],
        description: "Customs", isPopular: true,
      },
      {
        id: "accura", name: "Accura", tagline: "Freight Accounting",
        icon: "account_balance_wallet", color: "#1A237E",
        monthlyPrice: 1499, yearlyPrice: 1249,
        features: ["Auto-posts from every module", "GSTR-1 & GSTR-3B ready", "P&L in 3 seconds", "Tally XML export", "Bank reconciliation", "Multi-branch"],
        description: "Accounting", isPopular: false,
      },
    ],
    bundle: { name: "CHA Bundle", monthlyPrice: 2999, yearlyPrice: 2499, saving: "Save ₹999/mo" },
  },
  {
    id: "cfs",
    icon: "warehouse",
    color: "#0D7057",
    title: "CFS & Warehouse Operators",
    subtitle: "Gate-in/out, yard management, slab billing and importer alerts.",
    products: [
      {
        id: "dockiq", name: "DockIQ", tagline: "CFS & Warehouse",
        icon: "warehouse", color: "#0D7057",
        monthlyPrice: 2499, yearlyPrice: 2082,
        features: ["Unlimited container handling", "Gate-in/out log", "Auto storage slab billing", "Yard 3D view", "Mobile gate app", "WhatsApp notifications"],
        description: "CFS Operations", isPopular: true,
      },
      {
        id: "accura", name: "Accura", tagline: "Freight Accounting",
        icon: "account_balance_wallet", color: "#1A237E",
        monthlyPrice: 1499, yearlyPrice: 1249,
        features: ["Auto-posts from every module", "GSTR-1 & GSTR-3B ready", "P&L in 3 seconds", "Tally XML export", "Bank reconciliation", "Multi-branch"],
        description: "Accounting", isPopular: false,
      },
    ],
    bundle: { name: "CFS Bundle", monthlyPrice: 3499, yearlyPrice: 2916, saving: "Save ₹1,499/mo" },
  },
  {
    id: "transporter",
    icon: "local_shipping",
    color: "#92400E",
    title: "Transporters & Fleet Operators",
    subtitle: "LR generation, trip management, GPS and GST freight invoicing.",
    products: [
      {
        id: "rundesk", name: "RunDesk", tagline: "Transport & Fleet",
        icon: "local_shipping", color: "#92400E",
        monthlyPrice: 1499, yearlyPrice: 1249,
        features: ["LR & builty generation", "Trip management", "GPS via driver app", "Vehicle compliance alerts", "GST freight invoicing", "Route optimization"],
        description: "Transport", isPopular: true,
      },
      {
        id: "accura", name: "Accura", tagline: "Freight Accounting",
        icon: "account_balance_wallet", color: "#1A237E",
        monthlyPrice: 1499, yearlyPrice: 1249,
        features: ["Auto-posts from every module", "GSTR-1 & GSTR-3B ready", "P&L in 3 seconds", "Tally XML export", "Bank reconciliation", "Multi-branch"],
        description: "Accounting", isPopular: false,
      },
    ],
    bundle: { name: "Transporter Bundle", monthlyPrice: 2499, yearlyPrice: 2082, saving: "Save ₹999/mo" },
  },
  {
    id: "trader",
    icon: "public",
    color: "#004D40",
    title: "Importers & Exporters",
    subtitle: "Landed cost, HSN Scout, FTA checker and shipment register.",
    products: [
      {
        id: "tradepilot", name: "TradePilot", tagline: "Trade Intelligence",
        icon: "public", color: "#004D40",
        monthlyPrice: 999, yearlyPrice: 832,
        features: ["Landed cost calculator", "HSN Scout AI", "FTA benefit checker", "RoDTEP tracker", "Document vault", "Shipment register"],
        description: "Importers & Exporters", isPopular: true,
      },
    ],
    bundle: null,
  },
];

const BUNDLES = [
  {
    name: "Full Suite",
    subtitle: "All 6 products — best for large logistics companies",
    icon: "workspaces",
    monthlyPrice: 7999,
    yearlyPrice: 6666,
    products: ["Nexlog", "EntryX", "DockIQ", "RunDesk", "Accura", "TradePilot"],
    saving: "Save ₹4,999/mo vs individual",
    isHighlight: true,
  },
  {
    name: "Forwarder Bundle",
    subtitle: "Nexlog + Accura — perfect for C&F agents",
    icon: "navigation",
    monthlyPrice: 2999,
    yearlyPrice: 2499,
    products: ["Nexlog", "Accura"],
    saving: "Save ₹999/mo",
    isHighlight: false,
  },
  {
    name: "CHA Bundle",
    subtitle: "EntryX + Accura — for customs house agents",
    icon: "gavel",
    monthlyPrice: 2999,
    yearlyPrice: 2499,
    products: ["EntryX", "Accura"],
    saving: "Save ₹999/mo",
    isHighlight: false,
  },
  {
    name: "CFS Bundle",
    subtitle: "DockIQ + Accura — for CFS operators",
    icon: "warehouse",
    monthlyPrice: 3499,
    yearlyPrice: 2916,
    products: ["DockIQ", "Accura"],
    saving: "Save ₹1,499/mo",
    isHighlight: false,
  },
];

const FAQS = [
  { q: "Is there a free trial?", a: "Yes — every product comes with a 14-day free trial. No credit card required to start." },
  { q: "Can I switch plans later?", a: "Absolutely. You can upgrade, downgrade, or switch billing cycles at any time." },
  { q: "What payment methods are accepted?", a: "We accept all major cards, UPI, net banking and bank transfers via Razorpay." },
  { q: "Is my data secure?", a: "All data is encrypted at rest and in transit. We follow ISO 27001 practices and are GSTN-compliant." },
  { q: "Do I need to install anything?", a: "NavkarOS is 100% cloud-based. You just need a browser and internet connection." },
  { q: "Can multiple users access the same account?", a: "Yes. You can add staff with role-based access. Team size limits vary by plan." },
];

/* ── Product Card ──────────────────────────────────── */
function ProductCard({
  plan, isYearly, index,
}: {
  plan: (typeof SEGMENTS)[number]["products"][number];
  isYearly: boolean;
  index: number;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={
        isDesktop
          ? {
              y: plan.isPopular ? -14 : 0,
              opacity: 1,
              scale: plan.isPopular ? 1.0 : 0.96,
            }
          : { y: 0, opacity: 1 }
      }
      viewport={{ once: true }}
      transition={{ duration: 1.2, type: "spring", stiffness: 100, damping: 26, delay: index * 0.1 }}
      className={cn(
        "rounded-2xl border p-6 flex flex-col relative bg-white",
        plan.isPopular
          ? "border-[#D4AF37] border-2 shadow-xl shadow-[#D4AF3718]"
          : "border-gray-100",
        !plan.isPopular && "mt-5"
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-px right-5 bg-[#D4AF37] px-3 py-1 rounded-b-xl flex items-center gap-1.5">
          <Star className="h-3 w-3 fill-white text-white" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">Recommended</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${plan.color}12`, border: `1.5px solid ${plan.color}25` }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: plan.color }}>
            {plan.icon}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{plan.tagline}</p>
          <p className="font-black text-gray-900 text-base leading-tight">{plan.name}</p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 mb-1">
        <span className="text-4xl font-black text-gray-900">
          ₹<NumberFlow
            value={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
            transformTiming={{ duration: 400, easing: "ease-out" }}
            willChange
          />
        </span>
        <span className="text-sm text-gray-400 mb-1.5">/mo</span>
      </div>
      {isYearly ? (
        <p className="text-xs font-semibold text-green-600 mb-4">
          ₹{(plan.yearlyPrice * 12).toLocaleString("en-IN")}/yr · Save ₹{((plan.monthlyPrice - plan.yearlyPrice) * 12).toLocaleString("en-IN")}
        </p>
      ) : (
        <p className="text-xs text-gray-400 mb-4">billed monthly</p>
      )}

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1 mb-6">
        {plan.features.map((feat, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={cn(
          "w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 block",
          plan.isPopular
            ? "bg-[#1a1c1c] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a1c1c]"
            : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]"
        )}
      >
        Start 14-Day Free Trial
      </Link>
    </motion.div>
  );
}

/* ── Bundle Card ───────────────────────────────────── */
function BundleCard({ bundle, isYearly }: { bundle: typeof BUNDLES[number]; isYearly: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "rounded-2xl border p-6 flex flex-col relative",
        bundle.isHighlight
          ? "bg-[#1a1c1c] border-[#D4AF37] border-2"
          : "bg-white border-gray-100"
      )}
    >
      {bundle.isHighlight && (
        <div className="absolute -top-px right-5 bg-[#D4AF37] px-3 py-1 rounded-b-xl">
          <span className="text-[#1a1c1c] text-xs font-black uppercase tracking-wider">Best Value</span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: bundle.isHighlight ? "rgba(212,175,55,0.15)" : "#f9f9f9",
            border: bundle.isHighlight ? "1px solid rgba(212,175,55,0.3)" : "1px solid #e5e5e5",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: bundle.isHighlight ? "#D4AF37" : "#7e7576" }}>
            {bundle.icon}
          </span>
        </div>
        <div>
          <p className="font-black text-base" style={{ color: bundle.isHighlight ? "#ffffff" : "#1a1c1c" }}>{bundle.name}</p>
          <p className="text-xs" style={{ color: bundle.isHighlight ? "rgba(255,255,255,0.45)" : "#7e7576" }}>{bundle.subtitle}</p>
        </div>
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className="text-3xl font-black" style={{ color: bundle.isHighlight ? "#D4AF37" : "#1a1c1c" }}>
          ₹<NumberFlow
            value={isYearly ? bundle.yearlyPrice : bundle.monthlyPrice}
            transformTiming={{ duration: 400, easing: "ease-out" }}
            willChange
          />
        </span>
        <span className="text-sm mb-1.5" style={{ color: bundle.isHighlight ? "rgba(255,255,255,0.4)" : "#7e7576" }}>/mo</span>
      </div>

      <p className="text-xs font-semibold mb-4" style={{ color: "#22c55e" }}>{bundle.saving}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {bundle.products.map((p) => (
          <span
            key={p}
            className="text-xs px-2 py-0.5 rounded-md font-semibold"
            style={{
              background: bundle.isHighlight ? "rgba(212,175,55,0.12)" : "#f3f4f6",
              color: bundle.isHighlight ? "#D4AF37" : "#4b5563",
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
          background: bundle.isHighlight ? "#D4AF37" : "#1a1c1c",
          color: bundle.isHighlight ? "#1a1c1c" : "#D4AF37",
        }}
      >
        Get Started
      </Link>
    </motion.div>
  );
}

/* ── Segment Section ───────────────────────────────── */
function SegmentSection({ segment, isYearly }: { segment: typeof SEGMENTS[number]; isYearly: boolean }) {
  return (
    <section className="mb-20">
      {/* Segment header */}
      <div className="flex items-start gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${segment.color}12`, border: `1.5px solid ${segment.color}25` }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: segment.color }}>{segment.icon}</span>
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">{segment.title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{segment.subtitle}</p>
        </div>
      </div>

      {/* Product cards */}
      <div className={cn(
        "grid gap-5",
        segment.products.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-2xl"
      )}>
        {segment.products.map((product, i) => (
          <ProductCard key={product.id} plan={product} isYearly={isYearly} index={i} />
        ))}
      </div>

      {/* Per-segment bundle hint */}
      {segment.bundle && (
        <div
          className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-xl border"
          style={{ background: "#fefce8", borderColor: "#fde68a" }}
        >
          <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 16 }}>bolt</span>
          <p className="text-sm text-amber-800">
            <strong>{segment.bundle.name}</strong> bundles both for{" "}
            <strong>₹{(isYearly ? segment.bundle.yearlyPrice : segment.bundle.monthlyPrice).toLocaleString("en-IN")}/mo</strong>
            {" "}— {segment.bundle.saving}
          </p>
        </div>
      )}
    </section>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsYearly(checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: rect.left / window.innerWidth + 0.02, y: rect.top / window.innerHeight },
        colors: ["#D4AF37", "#f6be39", "#1a1c1c", "#ffffff"],
        ticks: 200, gravity: 1.2, decay: 0.94, startVelocity: 28, shapes: ["circle"],
      });
    }
  };

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-12 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border"
            style={{ background: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.25)", color: "#D4AF37" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>star</span>
            14-day free trial on all products
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Pick what your business needs
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Every plan is modular. Pay only for the products your team actually uses.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm"
        >
          <span className={cn("text-sm font-semibold transition-colors", !isYearly ? "text-gray-900" : "text-gray-400")}>
            Monthly
          </span>
          <Switch
            ref={switchRef as React.RefObject<HTMLButtonElement>}
            checked={isYearly}
            onCheckedChange={handleToggle}
          />
          <span className={cn("text-sm font-semibold transition-colors", isYearly ? "text-gray-900" : "text-gray-400")}>
            Yearly
            <span className="ml-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
              2 months free
            </span>
          </span>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 pb-20">

        {/* Products by segment */}
        {SEGMENTS.map((segment) => (
          <SegmentSection key={segment.id} segment={segment} isYearly={isYearly} />
        ))}

        {/* Bundle Plans */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Bundle Plans</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">Save more with a bundle</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              Pre-packaged combinations for your business type — at a lower price than buying individually.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BUNDLES.map((bundle) => (
              <BundleCard key={bundle.name} bundle={bundle} isYearly={isYearly} />
            ))}
          </div>
        </section>

        {/* Enterprise */}
        <section className="mb-20">
          <div
            className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border"
            style={{ background: "#1a1c1c", borderColor: "rgba(212,175,55,0.2)" }}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.7)" }}>Enterprise</span>
              <h3 className="text-2xl font-black text-white mt-1">Custom pricing for large teams</h3>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                Multiple branches, custom SLAs, dedicated support, on-premise options and volume discounts.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {["Custom SLA", "Dedicated support", "On-premise option", "Volume discounts", "Multi-branch"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: "rgba(255,255,255,0.55)" }}>
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

        {/* FAQ */}
        <section>
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
