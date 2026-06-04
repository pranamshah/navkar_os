"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import LogoBrand from "@/components/ui/LogoBrand";

const links = [
  { label: "Services",    href: "/#suite" },
  { label: "Who It's For", href: "/#whoisfor" },
  { label: "Pricing",     href: "/pricing" },
  { label: "About",       href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
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
          className="max-w-5xl mx-auto rounded-full px-6 h-14 flex items-center justify-between transition-all duration-300"
          style={{
            background: scrolled ? "rgba(249,249,249,0.98)" : "rgba(249,249,249,0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "0.5px solid rgba(0,0,0,0.1)",
            boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.1)" : "0 2px 15px rgba(0,0,0,0.05)",
          }}
        >
          {/* Logo */}
          <LogoBrand height={26} />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleAnchorLink(e, l.href)}
                className="text-sm transition-colors duration-200"
                style={{ color: "#444748", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A017")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#444748")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTAs — session-aware */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Avatar + name */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
                  >
                    {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#444748" }}>
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                </div>
                <Link
                  href="/dashboard/client"
                  className="text-xs font-semibold px-5 py-2 rounded-full uppercase tracking-wider transition-all duration-200"
                  style={{ background: "#1a1c1d", color: "#D4AF37" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#D4A017"; e.currentTarget.style.color = "#1a1c1d"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1c1d"; e.currentTarget.style.color = "#D4AF37"; }}
                >
                  My Dashboard
                </Link>
              </>
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
                  style={{ background: "#1a1c1d", color: "#fff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#D4A017"; e.currentTarget.style.color = "#1a1c1d"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1c1d"; e.currentTarget.style.color = "#fff"; }}
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
            style={{ background: "#1a1c1d" }}
          >
            <div className="flex items-center justify-between px-6 h-20">
              <span className="font-black text-sm uppercase tracking-widest text-white">Navkar<span style={{ color: "#f6be39" }}>OS</span></span>
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
                    href="/dashboard/client"
                    className="w-full py-4 rounded-2xl font-semibold text-black text-center block"
                    style={{ background: "#f6be39" }}
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
                  <Link href="/signup" className="w-full py-4 rounded-2xl font-semibold text-black text-center block" style={{ background: "#f6be39" }} onClick={() => setMobileOpen(false)}>Start Free Trial</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
