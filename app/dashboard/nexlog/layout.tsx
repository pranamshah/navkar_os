"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const navSections = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: "home", href: "/dashboard/nexlog" }],
  },
  {
    title: "CRM",
    items: [
      { label: "Leads", icon: "group_add", href: "/dashboard/nexlog/crm/leads" },
      { label: "Enquiries", icon: "contact_mail", href: "/dashboard/nexlog/crm/enquiries" },
      { label: "Quotations", icon: "request_quote", href: "/dashboard/nexlog/crm/quotations" },
    ],
  },
  {
    title: "JOBS",
    items: [
      { label: "All Jobs", icon: "list_alt", href: "/dashboard/nexlog/jobs" },
      { label: "Import Jobs", icon: "download", href: "/dashboard/nexlog/jobs?type=import" },
      { label: "Export Jobs", icon: "upload", href: "/dashboard/nexlog/jobs?type=export" },
      { label: "Air Freight", icon: "flight", href: "/dashboard/nexlog/jobs?mode=air" },
      { label: "Sea Freight", icon: "directions_boat", href: "/dashboard/nexlog/jobs?mode=sea" },
    ],
  },
  {
    title: "DOCUMENTS",
    items: [
      { label: "Document Vault", icon: "folder", href: "/dashboard/nexlog/documents" },
      { label: "Pre Alert", icon: "campaign", href: "/dashboard/nexlog/pre-alert" },
      { label: "DSR", icon: "summarize", href: "/dashboard/nexlog/dsr" },
      { label: "House BL/HAWB", icon: "article", href: "/dashboard/nexlog/house-bl" },
    ],
  },
  {
    title: "TRACKING",
    items: [
      { label: "Live Tracking", icon: "my_location", href: "/dashboard/nexlog/tracking" },
      { label: "Vessel Tracker", icon: "anchor", href: "/dashboard/nexlog/tracking/vessel" },
      { label: "Stage Updates", icon: "update", href: "/dashboard/nexlog/tracking/stages" },
    ],
  },
  {
    title: "PARTNERS",
    items: [
      { label: "Shipping Lines", icon: "directions_boat", href: "/dashboard/nexlog/partners?type=line" },
      { label: "CFS Stations", icon: "warehouse", href: "/dashboard/nexlog/partners?type=cfs" },
      { label: "CHAs", icon: "badge", href: "/dashboard/nexlog/partners?type=cha" },
      { label: "Transporters", icon: "local_shipping", href: "/dashboard/nexlog/partners?type=transporter" },
      { label: "Overseas Agents", icon: "public", href: "/dashboard/nexlog/partners?type=overseas" },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Job-wise P&L", icon: "trending_up", href: "/dashboard/nexlog/finance/pnl" },
      { label: "Purchase Register", icon: "shopping_cart", href: "/dashboard/nexlog/finance/purchases" },
      { label: "Fund Requests", icon: "approval", href: "/dashboard/nexlog/finance/fund-requests" },
    ],
  },
  {
    title: "INVOICING",
    items: [
      { label: "All Invoices", icon: "receipt_long", href: "/dashboard/nexlog/invoices" },
      { label: "Create Invoice", icon: "post_add", href: "/dashboard/nexlog/invoices/new" },
      { label: "Debit Notes", icon: "note_add", href: "/dashboard/nexlog/invoices?tab=debit" },
      { label: "Credit Notes", icon: "note", href: "/dashboard/nexlog/invoices?tab=credit" },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "MIS Reports", icon: "analytics", href: "/dashboard/nexlog/reports/mis" },
      { label: "GP Report", icon: "monitoring", href: "/dashboard/nexlog/reports/gp" },
      { label: "Billing Reports", icon: "assessment", href: "/dashboard/nexlog/reports/billing" },
      { label: "DSR Reports", icon: "assignment", href: "/dashboard/nexlog/reports/dsr" },
      { label: "Custom Reports", icon: "tune", href: "/dashboard/nexlog/reports/custom" },
    ],
  },
  {
    title: "AI TOOLS",
    items: [
      { label: "DocAI Scanner", icon: "document_scanner", href: "/dashboard/nexlog/ai" },
      { label: "Smart Pre Alert", icon: "auto_awesome", href: "/dashboard/nexlog/ai?tab=prealert" },
      { label: "Rate Comparison", icon: "compare_arrows", href: "/dashboard/nexlog/ai?tab=rates" },
      { label: "Anomaly Report", icon: "policy", href: "/dashboard/nexlog/ai?tab=anomaly" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Company Profile", icon: "business", href: "/dashboard/nexlog/settings" },
      { label: "Job Number Series", icon: "tag", href: "/dashboard/nexlog/settings?tab=series" },
      { label: "Rate Cards", icon: "price_change", href: "/dashboard/nexlog/settings?tab=rates" },
      { label: "User Permissions", icon: "manage_accounts", href: "/dashboard/nexlog/settings?tab=users" },
    ],
  },
];

export default function NexlogLayout({ children }: { children: React.ReactNode }) {
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
      (s) => (s.product === "NEXLOG" || s.product === "FULL_SUITE") && s.status === "ACTIVE"
    );
    if (!hasAccess) router.replace("/demo/nexlog");
  }, [status, session, router]);

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const role = (session?.user as { role?: string })?.role;
  const subs: { product?: string; status?: string }[] = (session?.user as { subscriptions?: { product: string; status: string }[] })?.subscriptions ?? [];
  const hasAccess = role === "ADMIN" || role === "SUPERADMIN" || subs.some((s) => (s.product === "NEXLOG" || s.product === "FULL_SUITE") && s.status === "ACTIVE");

  if (status === "loading" || !hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#1565C0", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/nexlog") return pathname === "/dashboard/nexlog";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside
        className="flex flex-col h-full overflow-y-auto flex-shrink-0 w-56"
        style={{ background: "#0A1628", minWidth: 224 }}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
          <span className="material-symbols-outlined text-[#1565C0]" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>
            navigation
          </span>
          <span className="text-white font-bold text-lg tracking-tight">Nexlog</span>
        </div>

        <div className="px-3 pt-3 pb-1">
          <Link
            href="/dashboard/client"
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
            NavkarOS
          </Link>
        </div>

        <nav className="flex-1 px-2 pb-4 mt-1">
          {navSections.map((section) => (
            <div key={section.title} className="mb-1">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-2 py-1 mb-0.5"
              >
                <span className="text-[10px] font-semibold tracking-widest text-white/30">
                  {section.title}
                </span>
                <span className="material-symbols-outlined text-white/20" style={{ fontSize: 14 }}>
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
                          background: isActive(item.href) ? "#1565C0" : "transparent",
                          color: isActive(item.href) ? "#fff" : "rgba(255,255,255,0.6)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(item.href)) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(21,101,192,0.15)";
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive(item.href)) {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
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

        <div className="px-4 py-3 border-t border-white/10">
          <div className="text-[10px] text-white/30 leading-relaxed">
            <div className="font-medium text-white/50">Navkar Freight Co.</div>
            <div>FY 2025–26</div>
          </div>
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
