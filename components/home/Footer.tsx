"use client";

import { Ship, ExternalLink, Share2, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Shipment Management", href: "#" },
    { label: "Doc AI", href: "#" },
    { label: "Bill Generation", href: "#" },
    { label: "Client Portal", href: "#" },
    { label: "Analytics", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#0A1628" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#D4A017" }}
              >
                <Ship className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Navkar<span style={{ color: "#D4A017" }}>OS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              India's complete freight forwarding operating system. Built for
              C&F agents, customs brokers, and logistics companies.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Mail, text: "hello@navkaros.in" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: MapPin, text: "Mumbai, Maharashtra, India" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <item.icon
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "#D4A017" }}
                  />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[ExternalLink, Share2].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(212,160,23,0.2)";
                    e.currentTarget.style.borderColor = "#D4A017";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.7)" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-sm font-semibold text-white mb-4"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#D4A017")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                      }
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter / CTA bar */}
        <div
          className="rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)" }}
        >
          <div>
            <p
              className="font-semibold text-white mb-0.5"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              Ready to modernise your freight operations?
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              Join 500+ forwarders already on Navkar OS.
            </p>
          </div>
          <button
            className="px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200"
            style={{ background: "#D4A017", color: "#0A0A0A" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F0C040";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(212,160,23,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#D4A017";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Start Free Trial →
          </button>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} Navkar OS Pvt. Ltd. All rights reserved.
            Made with ♥ in India.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #D4A017" }}
            >
              🇮🇳 Built for India
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
            >
              GST Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
