"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import LogoBrand from "@/components/ui/LogoBrand";

const navSections = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: "home", href: "/dashboard/accura" }],
  },
  {
    title: "MASTERS",
    items: [
      { label: "Ledgers", icon: "menu_book", href: "/dashboard/accura/ledgers" },
      { label: "Groups", icon: "account_tree", href: "/dashboard/accura/groups" },
      { label: "Cost Centres", icon: "workspaces", href: "/dashboard/accura/cost-centres" },
    ],
  },
  {
    title: "TRANSACTIONS",
    items: [
      { label: "Day Book", icon: "calendar_today", href: "/dashboard/accura/vouchers/daybook" },
      { label: "Contra", icon: "swap_horiz", href: "/dashboard/accura/vouchers/contra", shortcut: "F4" },
      { label: "Payment", icon: "payments", href: "/dashboard/accura/vouchers/payment", shortcut: "F5" },
      { label: "Receipt", icon: "receipt", href: "/dashboard/accura/vouchers/receipt", shortcut: "F6" },
      { label: "Journal", icon: "edit_note", href: "/dashboard/accura/vouchers/journal", shortcut: "F7" },
      { label: "Sales Invoice", icon: "description", href: "/dashboard/accura/vouchers/sales", shortcut: "F8" },
      { label: "Purchase", icon: "shopping_cart", href: "/dashboard/accura/vouchers/purchase", shortcut: "F9" },
      { label: "Debit Note", icon: "note_add", href: "/dashboard/accura/vouchers/debit-note" },
      { label: "Credit Note", icon: "note", href: "/dashboard/accura/vouchers/credit-note" },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Trial Balance", icon: "balance", href: "/dashboard/accura/reports/trial-balance" },
      { label: "P&L Statement", icon: "trending_up", href: "/dashboard/accura/reports/pnl" },
      { label: "Balance Sheet", icon: "account_balance", href: "/dashboard/accura/reports/balance-sheet" },
      { label: "Outstanding Receivables", icon: "arrow_outward", href: "/dashboard/accura/reports/outstanding" },
      { label: "Outstanding Payables", icon: "south_east", href: "/dashboard/accura/reports/outstanding?tab=payables" },
      { label: "Cash Book", icon: "payments", href: "/dashboard/accura/reports/cash-book" },
      { label: "Bank Book", icon: "account_balance_wallet", href: "/dashboard/accura/reports/bank-book" },
      { label: "Ledger Report", icon: "format_list_bulleted", href: "/dashboard/accura/reports/ledger" },
    ],
  },
  {
    title: "GST",
    items: [
      { label: "GST Summary", icon: "summarize", href: "/dashboard/accura/gst" },
      { label: "GSTR-1", icon: "receipt_long", href: "/dashboard/accura/gst?tab=gstr1" },
      { label: "GSTR-3B", icon: "assignment", href: "/dashboard/accura/gst?tab=gstr3b" },
    ],
  },
  {
    title: "TDS",
    items: [
      { label: "TDS Register", icon: "table_chart", href: "/dashboard/accura/tds" },
      { label: "TDS Payable", icon: "pending_actions", href: "/dashboard/accura/tds?tab=deposit" },
    ],
  },
  {
    title: "BANK",
    items: [
      { label: "Bank Reconciliation", icon: "sync", href: "/dashboard/accura/bank" },
      { label: "Import Statement", icon: "upload_file", href: "/dashboard/accura/bank?tab=import" },
    ],
  },
  {
    title: "PAYROLL",
    items: [
      { label: "Employees", icon: "group", href: "/dashboard/accura/payroll" },
      { label: "Run Payroll", icon: "paid", href: "/dashboard/accura/payroll?tab=run" },
    ],
  },
  {
    title: "AI TOOLS",
    items: [
      { label: "Smart Entry", icon: "auto_awesome", href: "/dashboard/accura/ai" },
      { label: "Document Scanner", icon: "document_scanner", href: "/dashboard/accura/ai?tab=scanner" },
      { label: "Anomaly Report", icon: "policy", href: "/dashboard/accura/ai?tab=anomaly" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Company Profile", icon: "business", href: "/dashboard/accura/settings" },
      { label: "GST Settings", icon: "tune", href: "/dashboard/accura/settings?tab=gst" },
      { label: "Opening Balances", icon: "start", href: "/dashboard/accura/settings?tab=opening" },
      { label: "CA Access", icon: "manage_accounts", href: "/dashboard/accura/settings?tab=ca" },
      { label: "Backup & Export", icon: "backup", href: "/dashboard/accura/settings?tab=backup" },
    ],
  },
];

function getCollapsedState(pathname: string) {
  const result: Record<string, boolean> = {};
  for (const section of navSections) {
    const hasActive = section.items.some(item =>
      item.href === "/dashboard/accura"
        ? pathname === "/dashboard/accura"
        : pathname.startsWith(item.href.split("?")[0])
    );
    result[section.title] = !hasActive; // collapse if no active item
  }
  return result;
}

function computeFY(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed, so March = 2, April = 3
  const year = now.getFullYear();
  if (month >= 3) {
    // April or later: FY is currentYear-(currentYear+1)
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    // Jan-March: FY is (currentYear-1)-currentYear
    return `${year - 1}-${String(year).slice(-2)}`;
  }
}

function getFYOptions(): string[] {
  const current = computeFY();
  const startYear = parseInt(current.split("-")[0]);
  return [
    `${startYear - 2}-${String(startYear - 1).slice(-2)}`,
    `${startYear - 1}-${String(startYear).slice(-2)}`,
    `${startYear}-${String(startYear + 1).slice(-2)}`,
    `${startYear + 1}-${String(startYear + 2).slice(-2)}`,
  ];
}

export default function AccuraLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [shortcutDismissed, setShortcutDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => getCollapsedState(pathname));
  const [selectedFY, setSelectedFY] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("accura_fy");
      if (saved) return saved;
    }
    return computeFY();
  });

  useEffect(() => {
    setCollapsed(getCollapsedState(pathname));
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("accura_fy", selectedFY);
  }, [selectedFY]);

  useEffect(() => {
    const shortcuts: Record<string, string> = {
      F4: "/dashboard/accura/vouchers/contra",
      F5: "/dashboard/accura/vouchers/payment",
      F6: "/dashboard/accura/vouchers/receipt",
      F7: "/dashboard/accura/vouchers/journal",
      F8: "/dashboard/accura/vouchers/sales",
      F9: "/dashboard/accura/vouchers/purchase",
    };
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const path = shortcuts[e.key];
      if (path) { e.preventDefault(); router.push(path); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { router.replace("/login"); return; }
    const role = (session?.user as { role?: string })?.role;
    if (role === "ADMIN" || role === "SUPERADMIN") return;
    const subs: { product?: string; status?: string }[] = (session?.user as { subscriptions?: { product: string; status: string }[] })?.subscriptions ?? [];
    const hasAccess = subs.some(
      (s) => (s.product === "ACCURA" || s.product === "FULL_SUITE") && s.status === "ACTIVE"
    );
    if (!hasAccess) router.replace("/demo/accura");
  }, [status, session, router]);

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const role = (session?.user as { role?: string })?.role;
  const subs: { product?: string; status?: string }[] = (session?.user as { subscriptions?: { product: string; status: string }[] })?.subscriptions ?? [];
  const hasAccess = role === "ADMIN" || role === "SUPERADMIN" || subs.some((s) => (s.product === "ACCURA" || s.product === "FULL_SUITE") && s.status === "ACTIVE");

  if (status === "loading" || !hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#0E7490", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/accura") return pathname === "/dashboard/accura";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col h-full overflow-y-auto flex-shrink-0 w-56"
        style={{ background: "#0A1628", minWidth: 224 }}
      >
        {/* Logo */}
        <div className="px-4 py-3 border-b border-white/10">
          <LogoBrand height={24} onDark href="/dashboard/client" />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="material-symbols-outlined text-[#0E7490]" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
            <span className="text-white/60 text-xs font-semibold tracking-wide">Accura</span>
          </div>
        </div>

        {/* Nav sections */}
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
                          background: isActive(item.href) ? "#0E7490" : "transparent",
                          color: isActive(item.href) ? "#fff" : "rgba(255,255,255,0.6)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(item.href)) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(14,116,144,0.15)";
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
                        {item.shortcut && (
                          <span
                            className="text-[9px] font-mono px-1 py-0.5 rounded"
                            style={{
                              background: isActive(item.href) ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                              color: isActive(item.href) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                            }}
                          >
                            {item.shortcut}
                          </span>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Bottom company info */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="text-[10px] text-white/30 leading-relaxed">
            <div className="font-medium text-white/50">Navkar Freight Co.</div>
          </div>
        </div>

        {/* Financial Year selector */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="text-[10px] text-white/30 mb-1">Financial Year</div>
          <select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            className="w-full rounded text-[11px] px-2 py-1 outline-none"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {getFYOptions().map(fy => (
              <option key={fy} value={fy} style={{ background: "#0A1628" }}>FY {fy}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F8FAFC" }}>
        {/* Shortcut hint bar */}
        <AnimatePresence>
          {!shortcutDismissed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-between px-4 py-1.5 border-b flex-shrink-0"
              style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}
            >
              <div className="flex items-center gap-4 text-[11px]" style={{ color: "#3B82F6" }}>
                {[
                  { key: "Ctrl+A", label: "Save" },
                  { key: "Ctrl+Q", label: "Cancel" },
                  { key: "F4–F9", label: "Vouchers" },
                  { key: "Alt+D", label: "Delete" },
                  { key: "Esc", label: "Back" },
                ].map((s) => (
                  <span key={s.key} className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-700 border border-blue-200">
                      {s.key}
                    </kbd>
                    <span style={{ color: "#6B7280" }}>{s.label}</span>
                  </span>
                ))}
              </div>
              <button
                onClick={() => setShortcutDismissed(true)}
                className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page content */}
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
