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
      <div className="relative max-w-7xl mx-auto px-8 lg:px-16 pt-20 pb-10" style={{ zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-16">

          {/* Left: brand */}
          <div className="lg:max-w-xs flex-shrink-0">
            <Link href="/" className="inline-block mb-5">
              <span
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "30px",
                  fontWeight: 400,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                Navkar<span style={{ color: "#D4AF37" }}>OS</span>
              </span>
            </Link>

            <p
              className="text-sm mb-8 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)", fontWeight: 300, maxWidth: "260px" }}
            >
              The Operating System for Indian Logistics. Built for freight forwarders,
              CHA, C&F agents, and every player in the ecosystem.
            </p>

            <div className="flex flex-col gap-2 mb-8">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>hello@navkaros.in</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>+91 90807 67398</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>BKC, Mumbai — 400051</p>
            </div>

            <p
              className="text-xs italic"
              style={{ color: "#D4AF37", opacity: 0.8 }}
            >
              Built in Mumbai. Made for the world.
            </p>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14">
            {cols.map((col) => (
              <div key={col.heading}>
                <h5
                  className="text-xs font-semibold uppercase tracking-widest mb-6"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  {col.heading}
                </h5>
                <ul className="flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
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
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd. · GSTIN: 27AAACN1234J1Z5
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              GST · ICEGATE · GSTN Compliant
            </span>
            <span
              className="text-xs px-3 py-1"
              style={{
                border: "0.5px solid rgba(212,175,55,0.3)",
                color: "#D4AF37",
                opacity: 0.7,
              }}
            >
              🇮🇳 Made in India
            </span>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        aria-hidden
        className="w-full flex items-end justify-center select-none pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <span
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(72px, 16vw, 220px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.04)",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            userSelect: "none",
            display: "block",
            paddingBottom: "0px",
          }}
        >
          NavkarOS
        </span>
      </div>
    </footer>
  );
}
