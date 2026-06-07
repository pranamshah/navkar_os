"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PRICING, BUNDLES, getMonthlyEquiv } from "@/lib/pricing";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";

type Cycle = "monthly" | "quarterly" | "yearly";

const PRODUCTS = Object.values(PRICING);

export default function PricingPage() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [tab, setTab] = useState<"products" | "bundles">("products");

  const cycleLabel = { monthly: "/mo", quarterly: "/mo equiv", yearly: "/mo equiv" };
  const cycleSave  = { monthly: "", quarterly: "Save 10%", yearly: "Save 20%" };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>
          Plans & Billing
        </p>
        <h1
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(26px, 3vw, 38px)",
            fontWeight: 400,
            color: "#1a1c1c",
            letterSpacing: "-0.02em",
          }}
        >
          Simple, transparent pricing
        </h1>
        <p className="mt-2 text-sm" style={{ color: "#7e7576" }}>
          One plan, all features. ₹1,799/month per product — no tiers, no limits.
          14-day free trial, no credit card required.
        </p>
      </div>

      {/* Tab + Cycle toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Products / Bundles tab */}
        <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
          {(["products", "bundles"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all"
              style={{
                background: tab === t ? "#1a1c1c" : "#fff",
                color: tab === t ? "#D4AF37" : "#7e7576",
              }}
            >
              {t === "products" ? "Individual Products" : "Bundle Plans"}
            </button>
          ))}
        </div>

        {/* Billing cycle toggle */}
        <div className="flex items-center gap-2">
          {(["monthly", "quarterly", "yearly"] as Cycle[]).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
              style={{
                background: cycle === c ? "#1a1c1c" : "rgba(0,0,0,0.04)",
                color: cycle === c ? "#fff" : "#7e7576",
              }}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
              {cycleSave[c] && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px] font-black"
                  style={{ background: "#D4AF37", color: "#1a1c1c" }}
                >
                  {cycleSave[c]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {tab === "products" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-14">
          {PRODUCTS.map((product) => {
            const monthly = getMonthlyEquiv(product.price, cycle);
            return (
              <div
                key={product.id}
                className="rounded-xl border flex flex-col overflow-hidden"
                style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
              >
                {/* Card header */}
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{ background: `${product.color}08`, borderBottom: `1px solid ${product.color}15` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${product.color}15`, border: `1px solid ${product.color}25` }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: product.color }}>
                      {product.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                      {product.tagline}
                    </p>
                    <p className="font-black text-sm" style={{ color: "#1a1c1c" }}>{product.name}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {/* Price */}
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-black text-3xl" style={{ color: "#1a1c1c" }}>
                      ₹{monthly.toLocaleString()}
                    </span>
                    <span className="text-xs mb-1" style={{ color: "#7e7576" }}>{cycleLabel[cycle]}</span>
                  </div>
                  <p className="text-xs mb-5" style={{ color: "#9e9596" }}>
                    {cycle === "monthly" && "billed monthly"}
                    {cycle === "quarterly" && `₹${(Math.round(product.price * 0.9) * 3).toLocaleString("en-IN")} billed quarterly`}
                    {cycle === "yearly" && `₹${(Math.round(product.price * 0.8) * 12).toLocaleString("en-IN")} billed yearly`}
                  </p>

                  {/* Features */}
                  <ul className="flex flex-col gap-2 flex-1 mb-6">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <Check size={11} className="mt-0.5 flex-shrink-0" style={{ color: product.color }} />
                        <span className="text-xs" style={{ color: "#4c4546" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <RazorpayCheckout
                    product={product.id}
                    plan="pro"
                    billingCycle={cycle}
                    productName={product.name}
                    amount={product.price}
                    displayAmount={monthly}
                  >
                    {(handleCheckout, loading) => (
                      <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full py-3 text-xs font-semibold uppercase tracking-widest transition-all rounded-lg"
                        style={{
                          background: loading ? "#ccc" : "#1a1c1c",
                          color: "#D4AF37",
                        }}
                      >
                        {loading ? "Processing…" : `Get ${product.name}`}
                      </button>
                    )}
                  </RazorpayCheckout>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bundles grid */}
      {tab === "bundles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-14">
          {Object.values(BUNDLES).map((bundle) => {
            const monthly = getMonthlyEquiv(bundle.monthly, cycle);
            const isFullSuite = bundle.id === "full_suite";
            // savings vs buying separately at 1799 each
            const separateTotal = bundle.includes.length * 1799;
            const savingsAmt = separateTotal - bundle.monthly;

            return (
              <div
                key={bundle.id}
                className="rounded-xl border flex flex-col overflow-hidden"
                style={{
                  background: isFullSuite ? "#1a1c1c" : "#fff",
                  borderColor: isFullSuite ? "rgba(212,175,55,0.25)" : "rgba(0,0,0,0.08)",
                  boxShadow: isFullSuite ? "0 20px 60px rgba(0,0,0,0.12)" : undefined,
                }}
              >
                <div
                  className="px-5 py-4"
                  style={{ borderBottom: isFullSuite ? "1px solid rgba(212,175,55,0.12)" : "1px solid rgba(0,0,0,0.06)" }}
                >
                  {isFullSuite && (
                    <span
                      className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
                      style={{ background: "#D4AF37", color: "#1a1c1c" }}
                    >
                      Best Value
                    </span>
                  )}
                  <p className="font-black text-base" style={{ color: isFullSuite ? "#fff" : "#1a1c1c" }}>
                    {bundle.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: isFullSuite ? "rgba(255,255,255,0.45)" : "#7e7576" }}>
                    {bundle.desc}
                  </p>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-black text-3xl" style={{ color: isFullSuite ? "#D4AF37" : "#1a1c1c" }}>
                      ₹{monthly.toLocaleString()}
                    </span>
                    <span className="text-xs mb-1" style={{ color: isFullSuite ? "rgba(255,255,255,0.4)" : "#7e7576" }}>
                      {cycleLabel[cycle]}
                    </span>
                  </div>
                  <p className="text-xs font-semibold mb-5" style={{ color: "#22c55e" }}>
                    Save ₹{savingsAmt.toLocaleString("en-IN")}/mo vs buying separately
                  </p>

                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {bundle.includes.map((productId) => {
                      const p = PRICING[productId as keyof typeof PRICING];
                      return p ? (
                        <li key={productId} className="flex items-center gap-2">
                          <Check size={12} className="flex-shrink-0" style={{ color: isFullSuite ? "#D4AF37" : "#16A34A" }} />
                          <span className="text-xs font-semibold" style={{ color: isFullSuite ? "rgba(255,255,255,0.75)" : "#1a1c1c" }}>
                            {p.name}
                          </span>
                          <span className="text-xs" style={{ color: isFullSuite ? "rgba(255,255,255,0.35)" : "#7e7576" }}>
                            — {p.tagline}
                          </span>
                        </li>
                      ) : null;
                    })}
                  </ul>

                  <RazorpayCheckout
                    product={bundle.id}
                    plan="pro"
                    billingCycle={cycle}
                    productName={bundle.name}
                    amount={bundle.monthly}
                    displayAmount={monthly}
                  >
                    {(handleCheckout, loading) => (
                      <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full py-3 text-xs font-semibold uppercase tracking-widest transition-all rounded-lg"
                        style={{
                          background: loading ? "#ccc" : isFullSuite ? "#D4AF37" : "#1a1c1c",
                          color: isFullSuite ? "#1a1c1c" : "#D4AF37",
                        }}
                      >
                        {loading ? "Processing…" : `Get ${bundle.name}`}
                      </button>
                    )}
                  </RazorpayCheckout>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feature list — all included */}
      <div className="rounded-xl border p-6" style={{ borderColor: "rgba(0,0,0,0.07)", background: "#fafafa" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>
          Everything included in every plan
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "14-day free trial",
            "No credit card to start",
            "Unlimited users",
            "GST-compliant invoicing",
            "ICEGATE integration",
            "Tally XML export",
            "WhatsApp notifications",
            "Role-based permissions",
            "Data encrypted at rest",
            "Priority email support",
            "Mobile apps included",
            "Regular updates, free",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Check size={12} style={{ color: "#16A34A", flexShrink: 0 }} />
              <span className="text-xs" style={{ color: "#4c4546" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
