"use client";

import Link from "next/link";

const cols = {
  "Solutions": ["FreightOps", "DocAI", "BillGen", "ClientHub", "AccountsOS", "RateDesk"],
  "Company": ["About Us", "Careers", "Blog", "Press Kit"],
  "Legal": ["Privacy Policy", "Terms of Service", "Refund Policy"],
};

export default function Footer() {
  return (
    <footer
      className="px-8 lg:px-16 py-14 border-t"
      style={{ background: "#f9f9f9", borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-14">
          {/* Brand */}
          <div className="md:max-w-xs">
            <Link href="/" className="block mb-5">
              <span
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#1a1c1c",
                  letterSpacing: "-0.02em",
                }}
              >
                NavkarOS
              </span>
            </Link>
            <p className="text-sm mb-6" style={{ color: "#4c4546", lineHeight: 1.7, fontWeight: 300 }}>
              The Operating System for Indian Logistics. Built for C&F agents,
              freight forwarders, CHA, transporters, and every player in the
              Indian logistics ecosystem.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-xs" style={{ color: "#7e7576" }}>hello@navkaros.in</p>
              <p className="text-xs" style={{ color: "#7e7576" }}>+91 98765 43210</p>
              <p className="text-xs" style={{ color: "#7e7576" }}>BKC, Mumbai — 400051</p>
              <p className="text-xs italic mt-1" style={{ color: "#D4AF37" }}>
                Built in Mumbai. Made for the world.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            {Object.entries(cols).map(([cat, items]) => (
              <div key={cat}>
                <h5 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#1a1c1c" }}>
                  {cat}
                </h5>
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-xs transition-colors duration-200"
                        style={{ color: "#7e7576" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#1a1c1c" }}>
                Contact
              </h5>
              <ul className="flex flex-col gap-3">
                {["Book a Demo", "Technical Support", "Partner with Us", "Enterprise Sales"].map((item) => (
                  <li key={item}>
                    <a
                      href="#contact"
                      className="text-xs transition-colors duration-200"
                      style={{ color: "#7e7576" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}
        >
          <p className="text-xs" style={{ color: "#7e7576" }}>
            © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd. · GSTIN: 27AAACN1234J1Z5
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1" style={{ background: "rgba(212,175,55,0.1)", color: "#B8860B", border: "0.5px solid rgba(212,175,55,0.3)" }}>
              🇮🇳 Made in India
            </span>
            <span className="text-xs" style={{ color: "#7e7576" }}>
              GST · ICEGATE · GSTN Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
