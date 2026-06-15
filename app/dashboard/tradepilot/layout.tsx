"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import LogoBrand from "@/components/ui/LogoBrand";

const navSections = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: "home", href: "/dashboard/tradepilot" }],
  },
  {
    title: "SHIPMENTS",
    items: [
      { label: "Active Shipments", icon: "local_shipping", href: "/dashboard/tradepilot/shipments" },
      { label: "Import Register", icon: "download", href: "/dashboard/tradepilot/shipments?type=import" },
      { label: "Export Register", icon: "upload", href: "/dashboard/tradepilot/shipments?type=export" },
    ],
  },
  {
    title: "TRADE INTELLIGENCE",
    items: [
      { label: "HSN Scout", icon: "search", href: "/dashboard/tradepilot/intelligence/hsn" },
      { label: "Duty Calculator", icon: "calculate", href: "/dashboard/tradepilot/intelligence/duty" },
      { label: "FTA Checker", icon: "public", href: "/dashboard/tradepilot/intelligence/fta" },
      { label: "RoDTEP Tracker", icon: "savings", href: "/dashboard/tradepilot/intelligence/rodtep" },
    ],
  },
  {
    title: "BUYERS & SUPPLIERS",
    items: [
      { label: "Find Buyers", icon: "person_search", href: "/dashboard/tradepilot/buyers" },
      { label: "My Suppliers", icon: "storefront", href: "/dashboard/tradepilot/suppliers" },
      { label: "Supplier Scorecards", icon: "star", href: "/dashboard/tradepilot/suppliers?tab=scorecards" },
    ],
  },
  {
    title: "DOCUMENTS",
    items: [
      { label: "Document Vault", icon: "folder", href: "/dashboard/tradepilot/documents" },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      { label: "Licence Tracker", icon: "verified", href: "/dashboard/tradepilot/compliance/licences" },
      { label: "FEMA Tracker", icon: "account_balance", href: "/dashboard/tradepilot/compliance/fema" },
      { label: "Advance Licence", icon: "confirmation_number", href: "/dashboard/tradepilot/compliance/advance" },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Landed Cost Analysis", icon: "analytics", href: "/dashboard/tradepilot/analytics/landed-cost" },
      { label: "Competitor Analysis", icon: "compare_arrows", href: "/dashboard/tradepilot/analytics/competitors" },
      { label: "Market Reports", icon: "bar_chart", href: "/dashboard/tradepilot/analytics/market" },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Cost Benchmarking", icon: "price_check", href: "/dashboard/tradepilot/finance" },
      { label: "Agent Invoices", icon: "receipt_long", href: "/dashboard/tradepilot/finance?tab=invoices" },
      { label: "Duty Payments", icon: "payments", href: "/dashboard/tradepilot/finance?tab=duty" },
    ],
  },
  {
    title: "AGENTS",
    items: [
      { label: "My Agents", icon: "groups", href: "/dashboard/tradepilot/agents" },
      { label: "Agent Performance", icon: "trending_up", href: "/dashboard/tradepilot/agents?tab=performance" },
      { label: "Rate Comparison", icon: "compare_arrows", href: "/dashboard/tradepilot/agents?tab=rates" },
    ],
  },
];

export default function TradePilotLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.replace("/login"); return; }
    const role = (session?.user as { role?: string })?.role;
    if (role === "ADMIN" || role === "SUPERADMIN") return;
    const subs: { product?: string; status?: string }[] = (session?.user as { subscriptions?: { product: string; status: string }[] })?.subscriptions ?? [];
    const hasAccess = subs.some(
      (s) => (s.product === "TRADEPILOT" || s.product === "FULL_SUITE") && s.status === "ACTIVE"
    );
    if (!hasAccess) router.replace("/demo/tradepilot");
  }, [status, session, router]);

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const role = (session?.user as { role?: string })?.role;
  const subs: { product?: string; status?: string }[] = (session?.user as { subscriptions?: { product: string; status: string }[] })?.subscriptions ?? [];
  const hasAccess = role === "ADMIN" || role === "SUPERADMIN" || subs.some((s) => (s.product === "TRADEPILOT" || s.product === "FULL_SUITE") && s.status === "ACTIVE");

  if (status === "loading" || !hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#1E40AF", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/tradepilot") return pathname === "/dashboard/tradepilot";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside
        className="flex flex-col h-full overflow-y-auto flex-shrink-0 w-56"
        style={{ background: "#FFFFFF", borderRight: "1px solid #E2E8F0", minWidth: 224 }}
      >
        <div className="px-4 py-3 border-b border-slate-100">
          <LogoBrand height={120} href="/dashboard/client" />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="material-symbols-outlined text-[#1E40AF]" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
              navigation
            </span>
            <span className="text-xs font-semibold tracking-wide" style={{ color: "#64748B" }}>TradePilot</span>
          </div>
        </div>

        <nav className="flex-1 px-2 pb-4 mt-1">
          {navSections.map((section) => (
            <div key={section.title} className="mb-1">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2 py-1 mb-0.5"
              >
                <span className="text-[10px] font-semibold tracking-widest" style={{ color: "#94A3B8" }}>
                  {section.title}
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#CBD5E1" }}>
                  {collapsed[section.title] ? "expand_more" : "expand_less"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {!collapsed[section.title] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md mb-0.5 group transition-all"
                        style={{
                          background: isActive(item.href) ? "#1E40AF" : "transparent",
                          color: isActive(item.href) ? "#fff" : "#64748B",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(item.href)) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(30,64,175,0.08)";
                            (e.currentTarget as HTMLElement).style.color = "#1E40AF";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive(item.href)) {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "#64748B";
                          }
                        }}
                      >
                        <span
                          className="material-symbols-outlined flex-shrink-0"
                          style={{ fontSize: 15, fontVariationSettings: "'wght' 300" }}
                        >
                          {item.icon}
                        </span>
                        <span className="text-xs flex-1 truncate">{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-slate-100">
          <div className="text-[10px] leading-relaxed mb-3" style={{ color: "#94A3B8" }}>
            <div className="font-medium" style={{ color: "#64748B" }}>Navkar Freight Co.</div>
            <div>FY 2025–26</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-all duration-200"
            style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
          >
            <LogOut size={13} strokeWidth={1.8} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F8FAFC" }}>
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
