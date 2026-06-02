"use client";

import Link from "next/link";

const cols = [
  {
    heading: "Platform",
    links: [
      { label: "FreightOps", href: "/demo/freightops" },
      { label: "DocAI", href: "/demo/docai" },
      { label: "BillGen", href: "/demo/billgen" },
      { label: "ClientHub", href: "/demo/clienthub" },
      { label: "AccountsOS", href: "/demo/accountsos" },
      { label: "RateDesk", href: "/demo/ratedesk" },
      { label: "ConnectLayer", href: "/demo/connectlayer" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press Kit", href: "#" },
      { label: "Partner with Us", href: "#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Refund Policy", href: "#" },
      { label: "GSTN Compliance", href: "#" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Start Free Trial", href: "/signup" },
      { label: "Login", href: "/login" },
      { label: "Book a Demo", href: "#contact" },
      { label: "Enterprise Sales", href: "#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#1a1c1c", position: "relative", overflow: "hidden" }}>
      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-8 lg:px-16 pt-14 pb-8" style={{ zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10">

          {/* Left: brand */}
          <div className="flex-shrink-0" style={{ maxWidth: "220px" }}>
            <Link href="/" className="inline-block mb-4">
              <span
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "24px",
                  fontWeight: 400,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                Navkar<span style={{ color: "#D4AF37" }}>OS</span>
              </span>
            </Link>

            <p
              className="text-xs mb-5 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.38)", fontWeight: 300 }}
            >
              The OS for Indian Logistics. Built for freight forwarders, CHA, and C&F agents.
            </p>

            <div className="flex flex-col gap-1.5">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>hello@navkaros.in</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>BKC, Mumbai — 400051</p>
              <p className="text-xs italic mt-1" style={{ color: "#D4AF37", opacity: 0.7 }}>
                Built in Mumbai. Made for the world.
              </p>
            </div>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {cols.map((col) => (
              <div key={col.heading}>
                <h5
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {col.heading}
                </h5>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.38)", fontWeight: 300 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd. · GSTIN: 27AAACN1234J1Z5
          </p>
          <div className="flex items-center gap-5">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              GST · ICEGATE · GSTN Compliant
            </span>
            <span
              className="text-xs px-2.5 py-0.5"
              style={{ border: "0.5px solid rgba(212,175,55,0.25)", color: "#D4AF37", opacity: 0.65 }}
            >
              🇮🇳 Made in India
            </span>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        aria-hidden
        className="w-full flex justify-center select-none pointer-events-none overflow-hidden"
        style={{ zIndex: 0, marginTop: "-8px" }}
      >
        <span
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(60px, 13vw, 180px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.035)",
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            userSelect: "none",
            display: "block",
          }}
        >
          NavkarOS
        </span>
      </div>
    </footer>
  );
}
