import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { razorpay } from "@/lib/razorpay";
import { PRICING, BUNDLES, getPrice } from "@/lib/pricing";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product, plan, billingCycle } = await req.json();

  let baseMonthly = 0;

  // Check individual product
  const productData = PRICING[product as keyof typeof PRICING];
  if (productData) {
    baseMonthly = plan === "pro" ? productData.pro : productData.starter;
  } else {
    // Check bundle
    const bundleData = BUNDLES[product as keyof typeof BUNDLES];
    if (bundleData) {
      baseMonthly = bundleData.monthly;
    } else {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }
  }

  const amount = getPrice(baseMonthly, billingCycle);

  const order = await razorpay.orders.create({
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      userId: session.user.id,
      product,
      plan,
      billingCycle,
    },
  });

  return NextResponse.json({ orderId: order.id, amount, currency: "INR" });
}
