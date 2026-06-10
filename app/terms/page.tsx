import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — NavkarOS",
  description: "Terms and conditions for using the NavkarOS logistics platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the NavkarOS platform (navkaros.in), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you may not use our services.

These Terms constitute a legally binding agreement between you (or the company you represent) and NavkarOS Logistics Pvt. Ltd., registered in Tamil Nadu, India.`,
  },
  {
    title: "2. Description of Services",
    content: `NavkarOS provides a cloud-based logistics management platform comprising modular software products for freight forwarding, customs clearance, CFS management, transport operations, freight accounting, and trade intelligence (collectively, the "Services").

Services are provided on a subscription basis. Specific features available depend on the plan(s) you subscribe to. We reserve the right to modify, suspend, or discontinue any feature or service with reasonable notice.`,
  },
  {
    title: "3. Account Registration",
    content: `To use NavkarOS, you must:

• Be at least 18 years of age
• Be duly authorised to enter into this agreement on behalf of your business
• Provide accurate, complete, and current registration information
• Maintain the security of your account credentials
• Promptly notify us of any unauthorised access

You are responsible for all activities that occur under your account. NavkarOS is not liable for losses arising from unauthorised use of your account.

Business accounts require verification. NavkarOS reserves the right to reject or terminate accounts that fail verification or violate these Terms.`,
  },
  {
    title: "4. Subscription and Billing",
    content: `**Free Trial:** All plans include a 14-day free trial. No credit card is required to start. At the end of the trial, continued access requires a paid subscription.

**Subscription Plans:** Subscriptions are available on monthly, quarterly, or annual billing cycles. Pricing is as published on navkaros.in and may change with 30 days' notice.

**Payment:** Payments are processed through Razorpay. By subscribing, you authorise us to charge the applicable fees to your chosen payment method.

**Auto-Renewal:** Subscriptions renew automatically at the end of each billing period unless cancelled before the renewal date.

**Taxes:** All prices are exclusive of GST. Applicable GST (18%) will be added at checkout. A GST-compliant invoice will be issued for every transaction.`,
  },
  {
    title: "5. Acceptable Use",
    content: `You agree not to:

• Use the Services for any unlawful purpose or in violation of Indian law
• Upload or transmit malicious code, viruses, or harmful content
• Attempt to gain unauthorised access to any part of the platform
• Reverse-engineer, decompile, or disassemble any part of the Services
• Resell, sublicense, or transfer your subscription to any third party
• Misrepresent your identity or business information
• Use the platform to facilitate customs fraud, GST evasion, or any illegal trade activity
• Scrape or harvest data from the platform without written permission

Violation of these restrictions may result in immediate account termination without refund.`,
  },
  {
    title: "6. Intellectual Property",
    content: `All content, software, design, trademarks, and trade dress on the NavkarOS platform are the exclusive property of NavkarOS Logistics Pvt. Ltd. or its licensors.

Your subscription grants you a limited, non-exclusive, non-transferable licence to access and use the Services for your internal business purposes only.

Your Data: You retain ownership of all data, documents, and content you upload to NavkarOS. You grant us a limited licence to store, process, and display your data solely to provide the Services.`,
  },
  {
    title: "7. Data and Confidentiality",
    content: `We treat your business data as confidential. We will not disclose your data to third parties except as described in our Privacy Policy or as required by law.

You are responsible for ensuring that data you upload to NavkarOS (including GST records, shipping documents, and financial information) complies with applicable Indian laws.`,
  },
  {
    title: "8. Service Availability",
    content: `We strive to maintain 99.5% uptime. However, we do not guarantee uninterrupted access to the Services. Scheduled maintenance will be notified in advance where possible.

NavkarOS is not liable for losses arising from platform downtime, including missed ICEGATE filings or customs deadlines. Users are advised to maintain backup processes for time-sensitive compliance activities.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by Indian law:

• NavkarOS's total liability to you for any claim arising from your use of the Services shall not exceed the total subscription fees paid by you in the 3 months preceding the claim.
• NavkarOS shall not be liable for any indirect, incidental, consequential, or special damages, including lost profits, loss of data, or business interruption.
• NavkarOS is not liable for errors in customs duty calculations — all figures are indicative and should be verified against official CBIC/ICEGATE data before filing.`,
  },
  {
    title: "10. Indemnification",
    content: `You agree to indemnify and hold harmless NavkarOS, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising from:

• Your use of the Services in violation of these Terms
• Your violation of any applicable law or regulation
• Any data or content you upload to the platform
• Any false or misleading information provided during registration`,
  },
  {
    title: "11. Termination",
    content: `**By You:** You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period.

**By Us:** NavkarOS may suspend or terminate your account immediately for breach of these Terms, non-payment, fraudulent activity, or as required by law.

Upon termination, your right to access the Services ceases. We will retain your data for 90 days post-termination to allow you to export it, after which it will be deleted in accordance with our Privacy Policy.`,
  },
  {
    title: "12. Governing Law and Disputes",
    content: `These Terms are governed by the laws of India. Any dispute arising from these Terms shall first be attempted to be resolved through good-faith negotiation.

If unresolved, disputes shall be submitted to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration at Chennai, Tamil Nadu. The arbitration shall be conducted in English.

For consumer disputes, users may also approach the appropriate consumer forum under the Consumer Protection Act, 2019.`,
  },
  {
    title: "13. Changes to Terms",
    content: `We may update these Terms from time to time. We will notify you of material changes by email or prominent notice on our platform at least 14 days before they take effect. Continued use of the Services after changes take effect constitutes acceptance of the revised Terms.`,
  },
  {
    title: "14. Contact",
    content: `For questions about these Terms:

**NavkarOS Logistics Pvt. Ltd.**
7, Mannady Street, George Town
Chennai — 600 001, Tamil Nadu, India
Email: navkaros.co@gmail.com
Phone: +91 90807 67398`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#f9f9f9" }}>
        {/* Header */}
        <section className="pt-40 pb-16 px-8 border-b" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-6" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
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
              Terms of Service
            </h1>
            <p className="text-sm" style={{ color: "#7e7576" }}>
              Last updated: 1 June 2025 · Effective: 1 June 2025
            </p>
            <p className="mt-4 text-sm" style={{ color: "#4c4546", lineHeight: 1.7 }}>
              Please read these Terms of Service carefully before using NavkarOS. These Terms govern your access to and use of our platform and services.
            </p>
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
              <Link href="/privacy" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>Privacy Policy →</Link>
              <Link href="/refund" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>Refund Policy →</Link>
              <Link href="/" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>← Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
