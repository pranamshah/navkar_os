import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy — NavkarOS",
  description: "NavkarOS subscription cancellation and refund policy.",
};

const sections = [
  {
    title: "1. Free Trial",
    content: `All NavkarOS plans include a 14-day free trial. No credit card is required to start your trial. You will not be charged during the trial period.

If you cancel during the free trial, you will not be charged. Your account will be deactivated at the end of the trial period.`,
  },
  {
    title: "2. Subscription Cancellations",
    content: `You may cancel your NavkarOS subscription at any time from your account settings or by contacting us at navkaros.co@gmail.com.

**Monthly Plans:** Cancellation takes effect at the end of the current billing month. You retain access until the end of the paid period.

**Quarterly Plans:** Cancellation takes effect at the end of the current quarterly cycle. You retain access until the end of the paid cycle.

**Annual Plans:** Cancellation takes effect at the end of the current annual cycle. You retain access until the end of the paid year.

We do not provide partial refunds for unused days within a billing period upon cancellation, except as specified in Section 3 below.`,
  },
  {
    title: "3. Refund Eligibility",
    content: `**30-Day Money-Back Guarantee (New Subscriptions Only):**
If you subscribe to NavkarOS for the first time and are not satisfied with the platform, you may request a full refund within 30 days of your first paid subscription charge, provided:

• This is your first paid subscription (not a renewal)
• You have not exceeded the fair usage limits for your plan
• Your request is submitted within 30 days of the first charge

To request a refund under this guarantee, email navkaros.co@gmail.com with your account email and reason for the request.

**Service Disruptions:**
If NavkarOS experiences unplanned downtime exceeding 4 continuous hours that materially impacts your operations, you may be eligible for a proportional credit applied to your next invoice. Credits are calculated based on the downtime duration relative to your monthly plan cost. Refunds are not issued for service disruptions; only credits.

**Billing Errors:**
If you were charged incorrectly (e.g., double-billed or charged after cancellation), please contact us immediately at navkaros.co@gmail.com. Verified billing errors will be refunded within 7 business days to the original payment method.`,
  },
  {
    title: "4. Non-Refundable Situations",
    content: `Refunds will not be issued in the following situations:

• After the 30-day money-back guarantee period has expired
• For subscription renewals (monthly, quarterly, or annual)
• For add-on features or one-time purchases (e.g., additional user seats purchased mid-cycle)
• If your account has been terminated for violation of our Terms of Service
• For data export fees (if applicable)
• For customisation or implementation services

If you forget to cancel before a renewal date, we may, at our sole discretion, offer a partial credit if contacted within 48 hours of the charge, but we are under no obligation to do so.`,
  },
  {
    title: "5. Downgrades",
    content: `If you downgrade from a higher-tier plan to a lower-tier plan mid-cycle, the downgrade takes effect at the start of your next billing cycle. No partial refund is issued for the price difference in the current cycle.

Prorated credits may be applied at our discretion for annual plan downgrades.`,
  },
  {
    title: "6. Refund Process",
    content: `Approved refunds are processed within 7–10 business days. Refunds are returned to the original payment method used for the purchase.

For UPI and net banking payments, refunds are credited to the source account. For credit/debit card payments, refund timelines depend on your card issuer and may take up to 10 business days to appear on your statement.

Razorpay, our payment processor, may have additional processing timelines that are outside of our control.`,
  },
  {
    title: "7. Chargebacks",
    content: `If you initiate a chargeback with your bank or card issuer without first contacting NavkarOS to resolve the issue, we reserve the right to:

• Suspend or terminate your account pending resolution
• Dispute the chargeback with evidence of service delivery
• Charge a dispute-processing fee if the chargeback is found to be unjustified

We strongly encourage you to contact us at navkaros.co@gmail.com before initiating any chargeback.`,
  },
  {
    title: "8. GST on Refunds",
    content: `NavkarOS charges 18% GST on all subscriptions. Refunds will include the GST component proportional to the amount refunded. A credit note will be issued against the original tax invoice for all refund transactions, as required under the CGST Act, 2017.`,
  },
  {
    title: "9. Contact for Billing Issues",
    content: `For any billing or refund queries:

**Email:** navkaros.co@gmail.com
**Phone:** +91 90807 67398 (Mon–Sat, 9am–7pm IST)
**Address:** NavkarOS Logistics Pvt. Ltd., 7, Mannady Street, George Town, Chennai — 600 001

We aim to respond to all billing queries within 1 business day.`,
  },
];

export default function RefundPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9" }}>
        {/* Header */}
        <section className="pt-40 pb-16 px-8 border-b" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-6" style={{ background: "rgba(30,64,175,0.1)", color: "#1E40AF" }}>
              Legal
            </span>
            <h1
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
              className="mb-6"
            >
              Refund Policy
            </h1>
            <p className="text-sm" style={{ color: "#7e7576" }}>
              Last updated: 1 June 2025 · Effective: 1 June 2025
            </p>

            {/* Highlight box */}
            <div className="mt-6 p-5" style={{ background: "rgba(30,64,175,0.07)", border: "0.5px solid rgba(30,64,175,0.3)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1a1c1c" }}>30-Day Money-Back Guarantee</p>
              <p className="text-sm" style={{ color: "#4c4546", lineHeight: 1.7 }}>
                Not happy in the first 30 days of your paid subscription? Get a full refund — no questions asked. Email us at <a href="mailto:navkaros.co@gmail.com" style={{ color: "#1E40AF" }}>navkaros.co@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-8 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-12">
              {sections.map((s) => (
                <div key={s.title}>
                  <h2 className="text-base font-semibold mb-4" style={{ color: "#1a1c1c" }}>{s.title}</h2>
                  <div className="text-sm" style={{ color: "#4c4546", lineHeight: 1.85, whiteSpace: "pre-line" }}>
                    {s.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                      i % 2 === 1 ? <strong key={i} style={{ color: "#1a1c1c" }}>{part}</strong> : part
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t flex flex-wrap gap-6" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <Link href="/privacy" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1E40AF" }}>Privacy Policy →</Link>
              <Link href="/terms" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1E40AF" }}>Terms of Service →</Link>
              <Link href="/" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>← Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
