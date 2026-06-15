import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — NavkarOS",
  description: "How NavkarOS collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly when you create an account, submit a contact form, or use our services. This includes:

• **Account Data:** Name, email address, phone number, business name, business type, GST number, PAN number, and other registration details.
• **Document Data:** Documents you upload during onboarding, such as GST certificates, PAN copies, and trade licences. These are stored securely and used solely for verification purposes.
• **Usage Data:** Information about how you interact with our platform, including log files, IP addresses, browser type, pages visited, and time spent.
• **Payment Data:** Billing information processed through Razorpay. We do not store full card numbers — payment processing is handled by Razorpay in accordance with PCI-DSS standards.
• **Communications:** Messages you send us via email, the contact form, or support channels.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information collected to:

• Provide, operate, and maintain the NavkarOS platform
• Verify your business identity and approve account registrations
• Process payments and manage subscriptions
• Send transactional emails (account updates, invoices, alerts)
• Respond to enquiries and provide customer support
• Improve our products and develop new features
• Comply with legal obligations under Indian law (IT Act 2000, GST laws, etc.)
• Prevent fraud and ensure platform security

We do not sell your personal data to third parties.`,
  },
  {
    title: "3. Legal Basis for Processing",
    content: `NavkarOS processes your data under the following legal grounds:

• **Contract Performance:** To provide the services you have subscribed to.
• **Legitimate Interests:** To improve our platform, prevent fraud, and ensure security.
• **Legal Obligation:** To comply with applicable Indian laws including the Information Technology Act, 2000 and the IT (Reasonable Security Practices) Rules, 2011.
• **Consent:** Where you have explicitly consented (e.g., marketing emails).`,
  },
  {
    title: "4. Data Sharing and Disclosure",
    content: `We may share your information with:

• **Service Providers:** Trusted third-party vendors who help us operate our platform — including Neon (database hosting), Cloudinary (file storage), Razorpay (payments), Resend (transactional email), and Vercel (hosting). All service providers are contractually bound to protect your data.
• **Legal Requirements:** When required by law, court order, or governmental authority.
• **Business Transfers:** In the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you before your data is transferred and becomes subject to a different privacy policy.

We do not share your data with advertising networks or data brokers.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal data for as long as necessary to:

• Provide you with our services
• Comply with legal obligations (e.g., GST records must be maintained for 6 years under Indian law)
• Resolve disputes and enforce our agreements

After account deletion, we will delete or anonymise your data within 90 days, except where retention is required by law.`,
  },
  {
    title: "6. Data Security",
    content: `We implement industry-standard security measures including:

• TLS/SSL encryption for all data in transit
• AES-256 encryption for data at rest
• Role-based access controls
• Regular security audits
• Secure, ISO 27001-compliant data centres

While we take every reasonable precaution, no method of internet transmission is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    title: "7. Your Rights",
    content: `Under applicable Indian privacy laws and our own commitment to transparency, you have the right to:

• **Access:** Request a copy of the personal data we hold about you.
• **Correction:** Request correction of inaccurate or incomplete data.
• **Deletion:** Request deletion of your personal data (subject to legal retention requirements).
• **Portability:** Receive your data in a machine-readable format.
• **Withdrawal of Consent:** Withdraw consent for marketing communications at any time.

To exercise these rights, email us at navkaros.co@gmail.com. We will respond within 30 days.`,
  },
  {
    title: "8. Cookies",
    content: `NavkarOS uses cookies and similar tracking technologies for:

• **Essential Cookies:** Required for the platform to function (authentication sessions, security).
• **Analytics Cookies:** To understand how users interact with our platform (using privacy-respecting tools).

You can control cookies through your browser settings. Disabling essential cookies may affect platform functionality.`,
  },
  {
    title: "9. Children's Privacy",
    content: `NavkarOS is a B2B platform intended for use by business professionals. We do not knowingly collect personal data from individuals under the age of 18. If we become aware that we have collected data from a minor, we will promptly delete it.`,
  },
  {
    title: "10. Third-Party Links",
    content: `Our platform may contain links to third-party websites (e.g., ICEGATE, GSTN, port authority portals). We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of material changes via email or a prominent notice on our platform at least 14 days before the changes take effect.`,
  },
  {
    title: "12. Contact Us",
    content: `For any privacy-related queries, please contact:

**NavkarOS Logistics Pvt. Ltd.**
Attn: Privacy Officer
7, Mannady Street, George Town
Chennai — 600 001, Tamil Nadu, India
Email: navkaros.co@gmail.com
Phone: +91 90807 67398`,
  },
];

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: "#7e7576" }}>
              Last updated: 1 June 2025 · Effective: 1 June 2025
            </p>
            <p className="mt-4 text-sm" style={{ color: "#4c4546", lineHeight: 1.7 }}>
              NavkarOS Logistics Pvt. Ltd. (&ldquo;NavkarOS,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
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
              <Link href="/terms" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1E40AF" }}>Terms of Service →</Link>
              <Link href="/refund" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1E40AF" }}>Refund Policy →</Link>
              <Link href="/" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>← Back to Home</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
