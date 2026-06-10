"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckoutProps {
  product: string;
  plan: "starter" | "pro";
  billingCycle: "monthly" | "quarterly" | "yearly";
  productName: string;
  amount: number;       // monthly base price
  displayAmount: number; // actual charge amount (after billing cycle discount)
  children: (handleCheckout: () => void, loading: boolean) => React.ReactNode;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckout({
  product, plan, billingCycle, productName, displayAmount, children,
}: CheckoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Referral code state
  const [codeInput, setCodeInput]         = useState("");
  const [validating, setValidating]       = useState(false);
  const [appliedCode, setAppliedCode]     = useState<string | null>(null);
  const [discountPct, setDiscountPct]     = useState(0);
  const [codeMsg, setCodeMsg]             = useState<{ text: string; ok: boolean } | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const finalAmount = discountPct > 0
    ? Math.round(displayAmount * (1 - discountPct / 100))
    : displayAmount;

  const applyCode = async () => {
    if (!codeInput.trim()) return;
    setValidating(true);
    setCodeMsg(null);
    try {
      const res = await fetch("/api/referrals/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCode(codeInput.trim().toUpperCase());
        setDiscountPct(data.discountPercent);
        setCodeMsg({ text: `✓ ${data.discountPercent}% off applied!`, ok: true });
      } else {
        setAppliedCode(null);
        setDiscountPct(0);
        setCodeMsg({ text: data.message ?? "Invalid code", ok: false });
      }
    } catch {
      setCodeMsg({ text: "Couldn't validate code. Try again.", ok: false });
    } finally {
      setValidating(false);
    }
  };

  const removeCode = () => {
    setAppliedCode(null);
    setDiscountPct(0);
    setCodeInput("");
    setCodeMsg(null);
  };

  const handleCheckout = async () => {
    if (!session?.user) { router.push("/login"); return; }
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) { alert("Payment service unavailable. Please try again."); setLoading(false); return; }

    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, plan, billingCycle, referralCode: appliedCode }),
    });
    const { orderId, amount: orderedAmount, error } = await orderRes.json();
    if (error || !orderId) { alert(error ?? "Order creation failed"); setLoading(false); return; }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderedAmount * 100,
      currency: "INR",
      name: "NavkarOS",
      description: `${productName} Plan${appliedCode ? ` (${discountPct}% off)` : ""}`,
      order_id: orderId,
      prefill: { name: session.user.name ?? "", email: session.user.email ?? "" },
      theme: { color: "#D4AF37" },
      modal: { ondismiss: () => setLoading(false) },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            product, plan,
            billingCycle: billingCycle.toUpperCase(),
            amount: orderedAmount,
            referralCode: appliedCode,
          }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          router.push(result.redirectUrl ?? "/dashboard/client");
        } else {
          alert("Payment verification failed. Contact navkaros.co@gmail.com");
          setLoading(false);
        }
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Referral code section */}
      {!appliedCode ? (
        <div className="flex flex-col gap-1.5">
          {!showCodeInput ? (
            <button
              type="button"
              onClick={() => setShowCodeInput(true)}
              className="text-xs text-left transition-colors"
              style={{ color: "#b0a8a9" }}
            >
              Have a referral code?
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && applyCode()}
                placeholder="Enter code"
                maxLength={12}
                className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold outline-none uppercase"
                style={{ borderColor: "rgba(0,0,0,0.15)", color: "#1a1c1c", letterSpacing: "0.08em" }}
              />
              <button
                type="button"
                onClick={applyCode}
                disabled={validating || !codeInput.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-all"
                style={{ background: "#1a1c1c", color: "#D4AF37" }}
              >
                {validating ? "…" : "Apply"}
              </button>
            </div>
          )}
          {codeMsg && !codeMsg.ok && (
            <p className="text-xs font-semibold" style={{ color: "#dc2626" }}>{codeMsg.text}</p>
          )}
        </div>
      ) : (
        /* Applied code badge */
        <div
          className="flex items-center justify-between px-3 py-2 rounded-lg"
          style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-black" style={{ color: "#16a34a" }}>✓</span>
            <span className="text-xs font-bold font-mono" style={{ color: "#16a34a" }}>{appliedCode}</span>
            <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>— {discountPct}% off</span>
          </div>
          <button
            type="button"
            onClick={removeCode}
            className="text-xs"
            style={{ color: "#b0a8a9" }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Price summary if discount applied */}
      {discountPct > 0 && (
        <div className="flex items-center justify-between text-xs px-1">
          <span style={{ color: "#7e7576" }}>
            <span className="line-through">₹{displayAmount.toLocaleString("en-IN")}</span>
            <span className="ml-2 font-bold" style={{ color: "#1a1c1c" }}>₹{finalAmount.toLocaleString("en-IN")}</span>
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
            style={{ background: "rgba(212,175,55,0.15)", color: "#92660a" }}
          >
            Save ₹{(displayAmount - finalAmount).toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* Checkout button (rendered by parent) */}
      {children(handleCheckout, loading)}
    </div>
  );
}
