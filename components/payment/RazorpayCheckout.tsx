"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckoutProps {
  product: string;
  plan: "starter" | "pro";
  billingCycle: "monthly" | "quarterly" | "yearly";
  productName: string;
  amount: number; // monthly base price
  displayAmount: number; // actual charge amount
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

  const handleCheckout = async () => {
    if (!session?.user) { router.push("/login"); return; }
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) { alert("Payment service unavailable. Please try again."); setLoading(false); return; }

    // Create order
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, plan, billingCycle }),
    });
    const { orderId, amount, error } = await orderRes.json();
    if (error || !orderId) { alert(error ?? "Order creation failed"); setLoading(false); return; }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "NavkarOS",
      description: `${productName} ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
      order_id: orderId,
      prefill: {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      },
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
            product,
            plan,
            billingCycle: billingCycle.toUpperCase(),
            amount,
          }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          router.push(result.redirectUrl ?? "/dashboard/client");
        } else {
          alert("Payment verification failed. Contact support@navkaros.com");
          setLoading(false);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <>{children(handleCheckout, loading)}</>;
}
