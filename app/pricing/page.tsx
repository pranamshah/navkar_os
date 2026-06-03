"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { PRICING, BUNDLES, getPrice, getMonthlyEquiv, getSavings, type ProductId } from "@/lib/pricing";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

type BillingCycle = "monthly" | "quarterly" | "yearly";

const BUSINESS_TYPE_DEFAULTS: Record<string, ProductId[]> = {
  CF_AGENT:           ["nexlog", "accura"],
  FREIGHT_FORWARDER:  ["nexlog", "accura"],
  CHA:                ["entryx", "accura"],
  IMPORTER_EXPORTER:  ["tradepilot"],
  CFS_WAREHOUSE:      ["dockiq", "accura"],
  TRANSPORTER:        ["rundesk", "accura"],
};

const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly:   "Monthly",
  quarterly: "Quarterly — Save 10%",
  yearly:    "Yearly — 2 Months Free",
};

const FAQS = [
  { q: "Is there a free trial?", a: "Yes. Every plan includes a 14-day free trial. No credit card required to start." },
  { q: "Can I change plans later?", a: "Yes. Upgrade, downgrade, or cancel anytime from your dashboard." },
  { q: "What happens after the trial ends?", a: "We will send a reminder 3 days before. Your account continues only if you add a payment method." },
  { q: "Do you offer refunds?", a: "Yes. 7-day refund policy on all annual plans if you are not satisfied." },
  { q: "Is GST invoice provided?", a: "Yes. GST invoice is issued for every payment to your registered GSTIN." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold pr-8" style={{ color: "#1a1c1c" }}>{q}</span>
        {open ? <ChevronUp size={16} style={{ color: "#7e7576", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "#7e7576", flexShrink: 0 }} />}
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ color: "#4c4546" }}>{a}</p>
      )}
    </div>
  );
}

function PriceDisplay({ monthly, cycle, plan }: { monthly: number; cycle: BillingCycle; plan: "starter" | "pro" }) {
  const monthlyEquiv = getMonthlyEquiv(monthly, cycle);
  const total = getPrice(monthly, cycle);
  const savings = getSavings(monthly, cycle);

  return (
    <div className="mb-6">
      <div className="flex items-end gap-1 mb-1">
        <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "42px", fontWeight: 400, color: "#1a1c1c", lineHeight: 1 }}>
          ₹{monthlyEquiv.toLocaleString("en-IN")}
        </span>
        <span className="text-sm pb-1" style={{ color: "#7e7576" }}>/mo</span>
      </div>
      {cycle !== "monthly" && (
        <p className="text-xs" style={{ color: "#7e7576" }}>
          Billed ₹{total.toLocaleString("en-IN")} {cycle === "quarterly" ? "quarterly" : "yearly"}
        </p>
      )}
      {savings > 0 && (
        <p className="text-xs font-semibold mt-1" style={{ color: "#10B981" }}>
          Save ₹{savings.toLocaleString("en-IN")} vs monthly
        </p>
      )}
    </div>
  );
}

function ProductCard({
  productId, plan, cycle, highlight,
}: {
  productId: ProductId;
  plan: "starter" | "pro";
  cycle: BillingCycle;
  highlight?: boolean;
}) {
  const p = PRICING[productId];
  const monthly = plan === "pro" ? p.pro : p.starter;
  const features = plan === "pro" ? p.proFeatures : p.starterFeatures;
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col p-8"
      style={{
        background: "#fff",
        border: `0.5px solid ${highlight ? p.color + "40" : "rgba(0,0,0,0.08)"}`,
        boxShadow: highlight ? `0 8px 32px ${p.color}15` : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top color accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />

      {/* Product header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: p.color }}>
            {p.tagline}
          </p>
          <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "26px", fontWeight: 400, color: "#1a1c1c" }}>
            {p.name}
          </h3>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${p.color}12`, border: `0.5px solid ${p.color}25` }}
        >
          <span className="material-symbols-outlined" style={{ color: p.color, fontSize: "20px" }}>{p.icon}</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-6" style={{ color: "#4c4546" }}>{p.desc}</p>

      <PriceDisplay monthly={monthly} cycle={cycle} plan={plan} />

      {/* Accura comparison */}
      {"comparison" in p && p.comparison && (
        <div className="px-3 py-2.5 mb-5 text-xs leading-relaxed" style={{ background: "rgba(26,35,126,0.04)", border: "0.5px solid rgba(26,35,126,0.15)", color: "#4c4546" }}>
          {p.comparison}
        </div>
      )}

      {/* CTA */}
      <RazorpayCheckout
        product={productId}
        plan={plan}
        billingCycle={cycle}
        productName={p.name}
        amount={monthly}
        displayAmount={getPrice(monthly, cycle)}
      >
        {(handleCheckout, loading) => (
          <button
            onClick={() => session?.user ? handleCheckout() : router.push("/login")}
            disabled={loading}
            className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 mb-6"
            style={{
              background: loading ? "#ccc" : p.color,
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Processing…" : "🚀 Start 14-Day Free Trial"}
          </button>
        )}
      </RazorpayCheckout>
      <p className="text-xs text-center -mt-3 mb-6" style={{ color: "#7e7576" }}>No credit card required</p>

      {/* Feature list */}
      <div className="pt-5 border-t flex-1" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>
          {plan === "pro" ? "Pro features" : "Starter features"}
        </p>
        <ul className="flex flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${p.color}15` }}>
                <Check size={9} style={{ color: p.color }} />
              </div>
              <span className="text-sm" style={{ color: "#4c4546" }}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function BundleCard({ bundleId, cycle }: { bundleId: keyof typeof BUNDLES; cycle: BillingCycle }) {
  const b = BUNDLES[bundleId];
  const total = getPrice(b.monthly, cycle);
  const monthlyEquiv = getMonthlyEquiv(b.monthly, cycle);
  const savings = getSavings(b.monthly, cycle);
  const separateTotal = b.includes.reduce((sum, pid) => sum + PRICING[pid as ProductId].pro, 0);
  const bundleSavings = separateTotal - b.monthly;
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-8"
      style={{
        background: "#fff",
        border: "0.5px solid rgba(212,175,55,0.25)",
        boxShadow: "0 4px 20px rgba(212,175,55,0.08)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "22px", fontWeight: 400, color: "#1a1c1c" }}>
            {b.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "#7e7576" }}>{b.desc}</p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 flex-shrink-0"
          style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}
        >
          Bundle
        </span>
      </div>

      <p className="text-xs mb-4" style={{ color: "#4c4546" }}>
        Includes: {b.includes.map((pid) => PRICING[pid as ProductId].name).join(" + ")}
      </p>

      <div className="flex items-end gap-2 mb-2">
        <span style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "36px", fontWeight: 400, color: "#1a1c1c", lineHeight: 1 }}>
          ₹{monthlyEquiv.toLocaleString("en-IN")}
        </span>
        <span className="text-sm pb-1" style={{ color: "#7e7576" }}>/mo</span>
      </div>

      {cycle !== "monthly" && (
        <p className="text-xs mb-1" style={{ color: "#7e7576" }}>Billed ₹{total.toLocaleString("en-IN")} {cycle}</p>
      )}
      <p className="text-xs font-semibold mb-1" style={{ color: "#10B981" }}>
        Save ₹{bundleSavings.toLocaleString("en-IN")}/mo vs buying separately
      </p>
      {savings > 0 && (
        <p className="text-xs font-semibold mb-4" style={{ color: "#10B981" }}>
          + Save ₹{savings.toLocaleString("en-IN")} with {cycle} billing
        </p>
      )}

      <RazorpayCheckout
        product={bundleId}
        plan="pro"
        billingCycle={cycle}
        productName={b.name}
        amount={b.monthly}
        displayAmount={total}
      >
        {(handleCheckout, loading) => (
          <button
            onClick={() => session?.user ? handleCheckout() : router.push("/login")}
            disabled={loading}
            className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
            style={{ background: loading ? "#ccc" : "#D4AF37", color: "#1a1c1c" }}
          >
            {loading ? "Processing…" : "Get Bundle →"}
          </button>
        )}
      </RazorpayCheckout>
    </motion.div>
  );
}

export default function PricingPage() {
  const { data: session } = useSession();
  const businessType = session?.user?.businessType ?? "";
  const defaultProducts = BUSINESS_TYPE_DEFAULTS[businessType] ?? (Object.keys(PRICING) as ProductId[]);

  const [selectedProducts, setSelectedProducts] = useState<ProductId[]>(defaultProducts);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [plan, setPlan] = useState<"starter" | "pro">("pro");
  const [showAll, setShowAll] = useState(false);

  const toggleProduct = (id: ProductId) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const relevantBundles = Object.keys(BUNDLES).filter((bId) => {
    const b = BUNDLES[bId as keyof typeof BUNDLES];
    if (bId === "full_suite") return selectedProducts.length >= 4;
    return b.includes.every((pid) => selectedProducts.includes(pid as ProductId));
  }) as (keyof typeof BUNDLES)[];

  const displayProducts = showAll ? (Object.keys(PRICING) as ProductId[]) : selectedProducts;

  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9" }}>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="px-6 lg:px-16 pt-28 pb-16" style={{ background: "#fff" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>
                Simple Pricing
              </p>
              <h1
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 400,
                  color: "#1a1c1c",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                Pay only for what
                <br />
                <span style={{ color: "#D4AF37" }}>your business needs.</span>
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-base" style={{ color: "#4c4546", lineHeight: 1.7 }}>
                Six purpose-built products. Use one standalone or combine them. Start with a 14-day free trial — no credit card required.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Product selector (logged-in users) ───────────────── */}
        <section className="px-6 lg:px-16 py-12" style={{ background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-6 text-center" style={{ color: "#7e7576" }}>
              {session?.user ? "Your recommended products — select to see pricing" : "Choose what applies to your business"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(Object.keys(PRICING) as ProductId[]).map((pid) => {
                const p = PRICING[pid];
                const selected = selectedProducts.includes(pid);
                return (
                  <button
                    key={pid}
                    onClick={() => toggleProduct(pid)}
                    className="flex flex-col items-center gap-2 p-4 border transition-all duration-200"
                    style={{
                      borderColor: selected ? p.color : "rgba(0,0,0,0.1)",
                      borderWidth: "0.5px",
                      background: selected ? `${p.color}08` : "#fff",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: selected ? p.color : "#7e7576", fontSize: "22px" }}>{p.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: selected ? "#1a1c1c" : "#7e7576" }}>{p.name}</span>
                    {selected && (
                      <span className="text-xs font-semibold" style={{ color: p.color }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Billing toggle (sticky) ──────────────────────────── */}
        <div
          className="sticky top-0 z-30 px-6 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "rgba(249,249,249,0.97)", backdropFilter: "blur(10px)", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}
        >
          <div className="flex gap-1 p-1" style={{ background: "rgba(0,0,0,0.05)", borderRadius: "6px" }}>
            {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className="px-4 py-2 text-xs font-semibold transition-all duration-200"
                style={{
                  background: cycle === c ? "#1a1c1c" : "transparent",
                  color: cycle === c ? "#fff" : "#7e7576",
                  borderRadius: "4px",
                }}
              >
                {CYCLE_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="flex gap-1 p-1" style={{ background: "rgba(0,0,0,0.05)", borderRadius: "6px" }}>
            {(["starter", "pro"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-200"
                style={{
                  background: plan === p ? "#1a1c1c" : "transparent",
                  color: plan === p ? "#fff" : "#7e7576",
                  borderRadius: "4px",
                }}
              >
                {p === "pro" && <span className="text-xs" style={{ color: plan === "pro" ? "#D4AF37" : "#7e7576" }}>★</span>}
                {p.charAt(0).toUpperCase() + p.slice(1)}
                {p === "pro" && <span className="text-xs px-1.5 py-0.5 font-bold" style={{ background: "rgba(212,175,55,0.2)", color: "#D4AF37", borderRadius: "3px" }}>Popular</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product cards ────────────────────────────────────── */}
        <section className="px-6 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto">
            {selectedProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm" style={{ color: "#7e7576" }}>Select products above to see pricing</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {displayProducts.map((pid) => (
                    <ProductCard key={pid} productId={pid} plan={plan} cycle={cycle} highlight={plan === "pro"} />
                  ))}
                </div>

                {/* Show all / less toggle */}
                {selectedProducts.length < Object.keys(PRICING).length && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#7e7576" }}
                    >
                      {showAll ? "Show only selected products" : `+ View all ${Object.keys(PRICING).length} products`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── Bundles ──────────────────────────────────────────── */}
        {relevantBundles.length > 0 && (
          <section className="px-6 lg:px-16 py-16" style={{ background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div className="max-w-5xl mx-auto">
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Bundle Deals</p>
                <h2
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    fontWeight: 400,
                    color: "#1a1c1c",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Save more with bundles.
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relevantBundles.map((bId) => (
                  <BundleCard key={bId} bundleId={bId} cycle={cycle} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Enterprise ───────────────────────────────────────── */}
        <section
          className="px-6 lg:px-20 py-20"
          style={{ background: "#1a1c1c" }}
        >
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>Enterprise</p>
              <h2
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 400,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Need more than Pro?
              </h2>
              <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                Enterprise plans for large operations, multi-branch firms, and custom integrations. Starting from ₹25,000/month.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {["Unlimited users & branches", "API access & webhooks", "Dedicated account manager", "4-hour SLA support", "Custom integrations", "Onboarding & training"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.2)" }}>
                      <Check size={9} style={{ color: "#D4AF37" }} />
                    </div>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/91XXXXXXXXXX?text=Hi,%20I%20am%20interested%20in%20NavkarOS%20Enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                style={{ background: "#D4AF37", color: "#1a1c1c" }}
              >
                <ExternalLink size={14} />
                Talk to Our Team — WhatsApp
              </a>
              <a
                href="https://calendly.com/navkaros"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              >
                <ExternalLink size={14} />
                Book a Demo — Calendly
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section className="px-6 lg:px-16 py-20" style={{ background: "#fff" }}>
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: "#D4AF37" }}>FAQ</p>
            <h2
              className="text-center mb-10"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(26px, 3vw, 40px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
              }}
            >
              Common questions
            </h2>
            {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <section className="px-6 lg:px-16 py-16 text-center" style={{ background: "#f9f9f9" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#D4AF37" }}>Start today</p>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }}>
            14-day free trial. No card required.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
              style={{ background: "#1a1c1c", color: "#fff" }}
            >
              Create Free Account →
            </Link>
            <Link
              href="/#suite"
              className="inline-flex items-center justify-center px-10 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200"
              style={{ borderColor: "rgba(0,0,0,0.2)", color: "#1a1c1c" }}
            >
              Explore Products
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
