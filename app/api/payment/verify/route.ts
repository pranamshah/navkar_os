import crypto from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
    product, plan, billingCycle, amount,
  } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const periodEnd = new Date(now);
  if (billingCycle === "MONTHLY")   periodEnd.setMonth(periodEnd.getMonth() + 1);
  if (billingCycle === "QUARTERLY") periodEnd.setMonth(periodEnd.getMonth() + 3);
  if (billingCycle === "YEARLY")    periodEnd.setFullYear(periodEnd.getFullYear() + 1);

  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      product: product.toUpperCase(),
      plan: plan.toUpperCase(),
      billingCycle: billingCycle.toUpperCase(),
      status: "TRIAL",
      amount,
      trialEndsAt,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      razorpaySubId: razorpay_payment_id,
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNo: `INV-${Date.now()}`,
      userId: session.user.id,
      product: product.toUpperCase(),
      amount,
      status: "PAID",
      razorpayId: razorpay_payment_id,
      paidAt: now,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });
  if (user) {
    await sendPaymentConfirmEmail(user.email, user.name, product, plan, amount, trialEndsAt);
  }

  return NextResponse.json({ success: true, redirectUrl: "/dashboard/client" });
}
