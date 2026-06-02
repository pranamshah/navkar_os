"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, MODULE_LIST } from "@/lib/modules";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;

    // Upsert subscription (remove old, add new)
    await supabase.from("subscriptions").delete().eq("user_id", user.id);
    await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan: plan.id,
      status: "active",
      modules: plan.modules,
    });

    setSubscribing(null);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Simple Pricing</p>
        <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }}>
          Choose your plan
        </h1>
        <p className="mt-3 text-sm" style={{ color: "#7e7576" }}>
          All plans include 14-day free trial. No credit card required to start.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="p-8 flex flex-col transition-all duration-300"
            style={{
              background: plan.id === "growth" ? "#1a1c1c" : "#fff",
              border: plan.id === "growth" ? "none" : "0.5px solid rgba(0,0,0,0.08)",
              boxShadow: plan.id === "growth" ? "0 24px 48px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.03)",
              transform: plan.id === "growth" ? "translateY(-8px)" : undefined,
            }}
          >
            {plan.id === "growth" && (
              <div className="inline-flex items-center gap-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D4AF37" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>Most Popular</span>
              </div>
            )}

            <h3
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "26px",
                fontWeight: 400,
                color: plan.id === "growth" ? "#fff" : "#1a1c1c",
              }}
              className="mb-2"
            >
              {plan.name}
            </h3>

            <div className="flex items-end gap-1 mb-6">
              <span className="font-semibold" style={{ fontSize: "36px", color: plan.id === "growth" ? "#D4AF37" : "#1a1c1c", letterSpacing: "-0.03em" }}>
                ₹{plan.price.toLocaleString()}
              </span>
              <span className="mb-1 text-sm" style={{ color: plan.id === "growth" ? "rgba(255,255,255,0.5)" : "#7e7576" }}>/mo</span>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: plan.id === "growth" ? "#D4AF37" : "#16A34A" }} />
                  <span className="text-xs" style={{ color: plan.id === "growth" ? "rgba(255,255,255,0.7)" : "#4c4546" }}>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={subscribing === plan.id}
              className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none"
              style={{
                background: plan.id === "growth" ? "#D4AF37" : "#1a1c1c",
                color: plan.id === "growth" ? "#1a1c1c" : "#fff",
                opacity: subscribing ? 0.7 : 1,
              }}
            >
              {subscribing === plan.id ? "Activating…" : `Start ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Module matrix */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7e7576" }}>
          Module Availability by Plan
        </p>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
                <th className="text-left py-3 font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Module</th>
                {PLANS.map((p) => (
                  <th key={p.id} className="py-3 font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULE_LIST.map((mod, i) => (
                <tr key={mod.id} style={{ borderBottom: "0.5px solid rgba(0,0,0,0.05)", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                  <td className="py-3 pl-2">
                    <p className="font-semibold" style={{ color: "#1a1c1c" }}>{mod.name}</p>
                    <p style={{ color: "#7e7576", fontSize: "10px" }}>{mod.tagline}</p>
                  </td>
                  {PLANS.map((p) => (
                    <td key={p.id} className="text-center py-3">
                      {(mod.plans as readonly string[]).includes(p.id) ? (
                        <Check size={14} className="inline" style={{ color: "#16A34A" }} />
                      ) : (
                        <span style={{ color: "#ddd" }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
