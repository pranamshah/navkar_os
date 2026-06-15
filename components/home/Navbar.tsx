"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import LogoBrand from "@/components/ui/LogoBrand";

const links = [
  { label: "Services",    href: "/#suite" },
  { label: "Who It's For", href: "/#whoisfor" },
  { label: "Pricing",     href: "/pricing" },
  { label: "Track",       href: "/track" },
  { label: "About",       href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router   = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAnchorLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("/#")) return;
    e.preventDefault();
    const anchor = href.slice(1);
    setMobileOpen(false);
    if (pathname === "/") {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${anchor}`);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-5 left-0 right-0 z-50 px-5"
      >
        <div
          className="max-w-5xl mx-auto rounded-full px-6 h-18 flex items-center justify-between transition-all duration-300"
          style={{
            background: scrolled ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "0.5px solid rgba(0,0,0,0.08)",
            boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.1)" : "0 2px 15px rgba(0,0,0,0.05)",
          }}
        >
          {/* Logo */}
          <LogoBrand height={120} />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleAnchorLink(e, l.href)}
                className="text-sm transition-colors duration-200"
                style={{ color: "#444748", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#444748")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              /* ── Logged-in: avatar dropdown ── */
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
                  style={{ background: "rgba(30,64,175,0.08)", border: "0.5px solid rgba(30,64,175,0.25)" }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: "rgba(30,64,175,0.2)", color: "#1E40AF" }}
                  >
                    {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#444748" }}>
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown
                    size={12}
                    style={{
                      color: "#888",
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden"
                      style={{
                        background: "#fff",
                        border: "0.5px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        zIndex: 100,
                      }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors duration-150"
                        style={{ color: "#1a1c1c" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(30,64,175,0.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <LayoutDashboard size={13} />
                        Dashboard
                      </Link>
                      <div style={{ height: "0.5px", background: "rgba(0,0,0,0.07)" }} />
                      <button
                        onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="flex items-center gap-2.5 w-full px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors duration-150"
                        style={{ color: "#EF4444" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm px-4 py-1.5 transition-colors duration-200"
                  style={{ color: "#444748" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1c1d")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#444748")}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-xs font-semibold px-5 py-2 rounded-full uppercase tracking-wider transition-all duration-200"
                  style={{ background: "#1E40AF", color: "#fff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1565C0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#1E40AF"; e.currentTarget.style.color = "#fff"; }}
                >
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" style={{ color: "#1a1c1d" }} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "#1E40AF" }}
          >
            <div className="flex items-center justify-between px-6 h-20">
              <LogoBrand height={120} onDark />
              <button onClick={() => setMobileOpen(false)}><X className="w-6 h-6 text-white" /></button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-5">
              {links.map((l, i) => (
                <motion.div key={l.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <a
                    href={l.href}
                    onClick={(e) => handleAnchorLink(e, l.href)}
                    className="text-3xl font-semibold text-white py-2 border-b border-white/10 block"
                    style={{ textDecoration: "none" }}
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </div>
            <div className="px-8 pb-14 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full py-4 rounded-2xl font-semibold text-black text-center block"
                    style={{ background: "#60A5FA" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="w-full py-4 rounded-2xl font-semibold border border-white/20 text-white text-center block"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full py-4 rounded-2xl font-semibold border border-white/20 text-white text-center block" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link href="/signup" className="w-full py-4 rounded-2xl font-semibold text-black text-center block" style={{ background: "#60A5FA" }} onClick={() => setMobileOpen(false)}>Start Free Trial</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
