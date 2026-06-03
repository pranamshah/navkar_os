import crypto from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    product,
    plan,
    billingCycle,
    amount,
  } = await req.json();

  // Verify signature
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

  let periodEnd = new Date(now);
  if (billingCycle === "MONTHLY") periodEnd.setMonth(periodEnd.getMonth() + 1);
  if (billingCycle === "QUARTERLY") periodEnd.setMonth(periodEnd.getMonth() + 3);
  if (billingCycle === "YEARLY") periodEnd.setFullYear(periodEnd.getFullYear() + 1);

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

  // Confirmation email
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });
  if (user) {
    try {
      await resend.emails.send({
        from: "NavkarOS <noreply@navkaros.com>",
        to: user.email,
        subject: `Payment Confirmed — ${product} ${plan} Plan`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: #1a1c1c; padding: 24px 32px;">
              <span style="color: #D4AF37; font-weight: 900; font-size: 13px; letter-spacing: 0.1em;">NAVKAROS</span>
            </div>
            <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #4c4546;">Hi ${user.name},</p>
              <p style="font-size: 14px; color: #4c4546;">Payment confirmed for <strong>${product} ${plan} Plan</strong>.</p>
              <div style="background: #f9f9f9; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #7e7576;">Amount Paid</p>
                <p style="margin: 0; font-size: 24px; font-weight: 900; color: #1a1c1c;">₹${amount.toLocaleString("en-IN")}</p>
                <p style="margin: 8px 0 0; font-size: 12px; color: #10B981;">Free trial ends: ${trialEndsAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/client" style="display: inline-block; background: #1a1c1c; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                Go to Dashboard →
              </a>
            </div>
          </div>
        `,
      });
    } catch {}
  }

  return NextResponse.json({
    success: true,
    redirectUrl: `/dashboard/client`,
  });
}
