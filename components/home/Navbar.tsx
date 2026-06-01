"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Ship } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Product", href: "#modules" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Integrations", href: "#integrations" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#D4A017" }}
              >
                <Ship className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  color: "#0A0A0A",
                }}
              >
                Navkar<span style={{ color: "#D4A017" }}>OS</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveLink(link.label)}
                  className="relative text-sm font-medium transition-colors duration-200"
                  style={{
                    color: activeLink === link.label ? "#D4A017" : "#1A1A2E",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {link.label}
                  {activeLink === link.label && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "#D4A017" }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                className="text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
                style={{ color: "#1A1A2E" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#D4A017")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#1A1A2E")
                }
              >
                Sign In
              </button>
              <button
                className="text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: "#0A0A0A",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(212,160,23,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Start Free Trial
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" style={{ color: "#0A0A0A" }} />
              ) : (
                <Menu className="w-6 h-6" style={{ color: "#0A0A0A" }} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "#0A1628" }}
          >
            <div className="flex items-center justify-between h-16 px-6">
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setMobileOpen(false)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#D4A017" }}
                >
                  <Ship className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className="text-xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  Navkar<span style={{ color: "#D4A017" }}>OS</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="text-2xl font-semibold text-white py-2 border-b"
                  style={{
                    fontFamily: "var(--font-sora), sans-serif",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <div className="px-8 pb-12 flex flex-col gap-3">
              <button
                className="w-full py-3.5 rounded-xl text-white font-semibold border transition-all"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </button>
              <button
                className="w-full py-3.5 rounded-xl font-semibold text-black"
                style={{ background: "#D4A017" }}
                onClick={() => setMobileOpen(false)}
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
