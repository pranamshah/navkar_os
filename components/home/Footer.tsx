"use client";

import Link from "next/link";
import LogoBrand from "@/components/ui/LogoBrand";

const SOLUTIONS: { label: string; href: string }[] = [
  { label: "Nexlog — Freight Ops",   href: "/demo/nexlog" },
  { label: "EntryX — Customs",       href: "/demo/entryx" },
  { label: "DockIQ — CFS & Warehouse", href: "/demo/dockiq" },
  { label: "RunDesk — Transport",    href: "/demo/rundesk" },
  { label: "Accura — Accounting",    href: "/demo/accura" },
  { label: "TradePilot — Trade Intel", href: "/demo/tradepilot" },
];

const COMPANY: { label: string; href: string }[] = [
  { label: "About Us",   href: "/about" },
  { label: "Careers",    href: "/careers" },
  { label: "Blog",       href: "/blog" },
  { label: "Press Kit",  href: "/press" },
];

const LEGAL: { label: string; href: string }[] = [
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy",    href: "/refund" },
];

const CONTACT: { label: string; href: string }[] = [
  { label: "Book a Demo",      href: "/#contact" },
  { label: "Technical Support", href: "mailto:navkaros.co@gmail.com" },
  { label: "Enterprise Sales", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer
      className="px-8 lg:px-16 py-14 border-t"
      style={{ background: "rgba(249,249,249,0.6)", borderColor: "rgba(0,0,0,0.08)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-14">
          {/* Brand */}
          <div className="md:max-w-xs">
            <div className="mb-5">
              <LogoBrand height={120} />
            </div>
            <p className="text-sm mb-6" style={{ color: "#4c4546", lineHeight: 1.7, fontWeight: 300 }}>
              The Operating System for Indian Logistics. Built for C&F agents,
              freight forwarders, CHA, transporters, and every player in the
              Indian logistics ecosystem.
            </p>
            <div className="flex flex-col gap-2">
              <a href="mailto:navkaros.co@gmail.com" className="text-xs hover:text-[#1E40AF] transition-colors" style={{ color: "#7e7576" }}>navkaros.co@gmail.com</a>
              <a href="tel:+919080767398" className="text-xs hover:text-[#1E40AF] transition-colors" style={{ color: "#7e7576" }}>+91 90807 67398</a>
              <p className="text-xs" style={{ color: "#7e7576" }}>7, Mannady Street, George Town</p>
              <p className="text-xs" style={{ color: "#7e7576" }}>Chennai — 600 001, Tamil Nadu</p>
              <p className="text-xs italic mt-1" style={{ color: "#1E40AF" }}>
                Built in Chennai. Made for the world.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            {/* Solutions */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#1a1c1c" }}>
                Solutions
              </h5>
              <ul className="flex flex-col gap-3">
                {SOLUTIONS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs transition-colors duration-200"
                      style={{ color: "#7e7576" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#1a1c1c" }}>
                Company
              </h5>
              <ul className="flex flex-col gap-3">
                {COMPANY.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs transition-colors duration-200"
                      style={{ color: "#7e7576" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#1a1c1c" }}>
                Legal
              </h5>
              <ul className="flex flex-col gap-3">
                {LEGAL.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs transition-colors duration-200"
                      style={{ color: "#7e7576" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#1a1c1c" }}>
                Contact
              </h5>
              <ul className="flex flex-col gap-3">
                {CONTACT.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-xs transition-colors duration-200"
                      style={{ color: "#7e7576" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                    >
                      {item.label}
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
            © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd. · GSTIN: 33AAACN1234J1Z5
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1" style={{ background: "rgba(30,64,175,0.1)", color: "#1565C0", border: "0.5px solid rgba(30,64,175,0.3)" }}>
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
