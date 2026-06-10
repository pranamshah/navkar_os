import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { PRICING, BUNDLES, getPrice } from "@/lib/pricing";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product, plan, billingCycle, referralCode } = await req.json();

  let baseMonthly = 0;

  // Check individual product
  const productData = PRICING[product as keyof typeof PRICING];
  if (productData) {
    baseMonthly = productData.price;
  } else {
    // Check bundle
    const bundleData = BUNDLES[product as keyof typeof BUNDLES];
    if (bundleData) {
      baseMonthly = bundleData.monthly;
    } else {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }
  }

  let amount = getPrice(baseMonthly, billingCycle);

  // Apply referral code discount (server-side validation)
  if (referralCode) {
    const referral = await prisma.referralCode.findUnique({
      where: { code: referralCode.trim().toUpperCase() },
    });
    if (referral && !referral.usedBy && new Date(referral.expiresAt) >= new Date()) {
      amount = Math.round(amount * (1 - referral.discountPercent / 100));
    }
  }

  const order = await getRazorpay().orders.create({
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      userId: session.user.id,
      product,
      plan,
      billingCycle,
      referralCode: referralCode ?? "",
    },
  });

  return NextResponse.json({ orderId: order.id, amount, currency: "INR" });
}
