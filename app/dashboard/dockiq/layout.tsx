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
    items: [{ label: "Dashboard", icon: "home", href: "/dashboard/dockiq" }],
  },
  {
    title: "GATE MANAGEMENT",
    items: [
      { label: "Gate In", icon: "login", href: "/dashboard/dockiq/gate/in" },
      { label: "Gate Out", icon: "logout", href: "/dashboard/dockiq/gate/out" },
      { label: "Yard View", icon: "grid_view", href: "/dashboard/dockiq/yard" },
    ],
  },
  {
    title: "CUSTOMS",
    items: [
      { label: "Examination Queue", icon: "gavel", href: "/dashboard/dockiq/customs/exam" },
      { label: "OOC Tracker", icon: "check_circle", href: "/dashboard/dockiq/customs/ooc" },
      { label: "Red Channel", icon: "warning", href: "/dashboard/dockiq/customs/exam?channel=red" },
      { label: "Yellow Channel", icon: "info", href: "/dashboard/dockiq/customs/exam?channel=yellow" },
    ],
  },
  {
    title: "DESTUFFING",
    items: [
      { label: "Schedule", icon: "calendar_month", href: "/dashboard/dockiq/destuff" },
      { label: "In Progress", icon: "hourglass_top", href: "/dashboard/dockiq/destuff?status=active" },
      { label: "Completed", icon: "task_alt", href: "/dashboard/dockiq/destuff?status=done" },
    ],
  },
  {
    title: "STORAGE",
    items: [
      { label: "Container Storage", icon: "view_list", href: "/dashboard/dockiq/storage" },
      { label: "Free Days Tracker", icon: "timer", href: "/dashboard/dockiq/storage?tab=freedays" },
      { label: "Storage Charges", icon: "payments", href: "/dashboard/dockiq/storage?tab=charges" },
    ],
  },
  {
    title: "INVOICING",
    items: [
      { label: "CFS Invoices", icon: "receipt_long", href: "/dashboard/dockiq/invoices" },
      { label: "Create Invoice", icon: "post_add", href: "/dashboard/dockiq/invoices/new" },
      { label: "DO Invoices", icon: "description", href: "/dashboard/dockiq/invoices?type=do" },
    ],
  },
  {
    title: "CLIENTS",
    items: [
      { label: "All Clients", icon: "groups", href: "/dashboard/dockiq/clients" },
      { label: "Importers", icon: "person", href: "/dashboard/dockiq/clients?type=importer" },
      { label: "CHAs", icon: "badge", href: "/dashboard/dockiq/clients?type=cha" },
      { label: "Shipping Lines", icon: "directions_boat", href: "/dashboard/dockiq/clients?type=line" },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Daily Activity", icon: "today", href: "/dashboard/dockiq/reports" },
      { label: "Storage Report", icon: "analytics", href: "/dashboard/dockiq/reports?tab=storage" },
      { label: "Invoice Register", icon: "assessment", href: "/dashboard/dockiq/reports?tab=invoices" },
      { label: "MIS", icon: "monitoring", href: "/dashboard/dockiq/reports?tab=mis" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Storage Slabs", icon: "layers", href: "/dashboard/dockiq/settings" },
      { label: "Free Days Config", icon: "tune", href: "/dashboard/dockiq/settings?tab=freedays" },
      { label: "Charge Rates", icon: "price_change", href: "/dashboard/dockiq/settings?tab=rates" },
      { label: "User Roles", icon: "manage_accounts", href: "/dashboard/dockiq/settings?tab=users" },
    ],
  },
];

export default function DockIQLayout({ children }: { children: React.ReactNode }) {
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
        (s.product === "DOCKIQ" || s.product === "CFS_BUNDLE" || s.product === "FULL_SUITE") &&
        s.status === "ACTIVE"
    );
    if (!hasAccess) router.replace("/demo/dockiq");
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
        (s.product === "DOCKIQ" || s.product === "CFS_BUNDLE" || s.product === "FULL_SUITE") &&
        s.status === "ACTIVE"
    );

  if (status === "loading" || !hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#D97706", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/dockiq") return pathname === "/dashboard/dockiq";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside
        className="flex flex-col h-full overflow-y-auto flex-shrink-0 w-56"
        style={{ background: "#0A1628", minWidth: 224 }}
      >
        <div className="px-4 py-3 border-b border-white/10">
          <LogoBrand height={120} onDark href="/dashboard/client" />
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="material-symbols-outlined text-[#D97706]"
              style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
            >
              warehouse
            </span>
            <span className="text-white/60 text-xs font-semibold tracking-wide">DockIQ</span>
          </div>
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
                          background: isActive(item.href) ? "#D97706" : "transparent",
                          color: isActive(item.href) ? "#fff" : "rgba(255,255,255,0.6)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(item.href)) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(217,119,6,0.15)";
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
          <div className="text-[10px] text-white/30 leading-relaxed mb-3">
            <div className="font-medium text-white/50">Navkar Freight Co.</div>
            <div>FY 2025–26</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
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
