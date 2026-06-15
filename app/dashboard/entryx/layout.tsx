"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import LogoBrand from "@/components/ui/LogoBrand";

const ACCENT = "#1E40AF";
const ACCENT_HOVER = "rgba(30,64,175,0.08)";

const navSections = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: "home", href: "/dashboard/entryx" }],
  },
  {
    title: "JOBS",
    items: [
      { label: "All Jobs", icon: "list_alt", href: "/dashboard/entryx/jobs" },
      { label: "Import Jobs", icon: "download", href: "/dashboard/entryx/jobs?type=import" },
      { label: "Export Jobs", icon: "upload", href: "/dashboard/entryx/jobs?type=export" },
    ],
  },
  {
    title: "FILING",
    items: [
      { label: "BE Preparation", icon: "edit_document", href: "/dashboard/entryx/filing/be" },
      { label: "SB Preparation", icon: "edit_note", href: "/dashboard/entryx/filing/sb" },
      { label: "ICEGATE Status", icon: "sync", href: "/dashboard/entryx/filing/icegate" },
    ],
  },
  {
    title: "DOCUMENTS",
    items: [
      { label: "Document Vault", icon: "folder", href: "/dashboard/entryx/documents" },
      { label: "e-Sanchit", icon: "cloud_upload", href: "/dashboard/entryx/documents?tab=esanchit" },
      { label: "KYC Records", icon: "verified_user", href: "/dashboard/entryx/documents?tab=kyc" },
    ],
  },
  {
    title: "PARTNERS",
    items: [
      { label: "Importers", icon: "business", href: "/dashboard/entryx/partners?type=importer" },
      { label: "Exporters", icon: "storefront", href: "/dashboard/entryx/partners?type=exporter" },
      { label: "Freight Forwarders", icon: "anchor", href: "/dashboard/entryx/partners?type=ff" },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      { label: "Tariff Master", icon: "gavel", href: "/dashboard/entryx/compliance/tariff" },
      { label: "CBIC Notifications", icon: "notifications", href: "/dashboard/entryx/compliance/notifications" },
      { label: "Drawback Tracker", icon: "savings", href: "/dashboard/entryx/compliance/drawback" },
      { label: "FTA Checker", icon: "public", href: "/dashboard/entryx/compliance/fta" },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Job P&L", icon: "trending_up", href: "/dashboard/entryx/finance/pnl" },
      { label: "Invoices", icon: "receipt_long", href: "/dashboard/entryx/finance/invoices" },
      { label: "Disbursements", icon: "payments", href: "/dashboard/entryx/finance/disbursements" },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "MIS Reports", icon: "analytics", href: "/dashboard/entryx/reports" },
      { label: "DSR", icon: "summarize", href: "/dashboard/entryx/reports?tab=dsr" },
      { label: "Statutory", icon: "balance", href: "/dashboard/entryx/reports?tab=statutory" },
    ],
  },
  {
    title: "AI TOOLS",
    items: [
      { label: "DocAI", icon: "document_scanner", href: "/dashboard/entryx/ai" },
      { label: "Duty Estimator", icon: "calculate", href: "/dashboard/entryx/ai?tab=duty" },
      { label: "FTA Checker", icon: "public", href: "/dashboard/entryx/ai?tab=fta" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Company Profile", icon: "business", href: "/dashboard/entryx/settings" },
      { label: "Job Number Series", icon: "tag", href: "/dashboard/entryx/settings?tab=series" },
    ],
  },
];

export default function EntryXLayout({ children }: { children: React.ReactNode }) {
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
      (s) =>
        (s.product === "ENTRYX" || s.product === "CHA_BUNDLE" || s.product === "FULL_SUITE") &&
        s.status === "ACTIVE"
    );
    if (!hasAccess) router.replace("/demo/entryx");
  }, [status, session, router]);

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const role = (session?.user as { role?: string })?.role;
  const subs: { product?: string; status?: string }[] = (session?.user as { subscriptions?: { product: string; status: string }[] })?.subscriptions ?? [];
  const hasAccess =
    role === "ADMIN" ||
    role === "SUPERADMIN" ||
    subs.some(
      (s) =>
        (s.product === "ENTRYX" || s.product === "CHA_BUNDLE" || s.product === "FULL_SUITE") &&
        s.status === "ACTIVE"
    );

  if (status === "loading" || !hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/entryx") return pathname === "/dashboard/entryx";
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
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, color: ACCENT, fontVariationSettings: "'FILL' 1" }}
            >
              gavel
            </span>
            <span className="text-xs font-semibold tracking-wide" style={{ color: "#64748B" }}>EntryX</span>
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
                <span className="material-symbols-outlined text-slate-300" style={{ fontSize: 14 }}>
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
                          background: isActive(item.href) ? ACCENT : "transparent",
                          color: isActive(item.href) ? "#fff" : "#64748B",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(item.href)) {
                            (e.currentTarget as HTMLElement).style.background = ACCENT_HOVER;
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
