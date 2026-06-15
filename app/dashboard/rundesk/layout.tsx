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
    items: [{ label: "Dashboard", icon: "home", href: "/dashboard/rundesk" }],
  },
  {
    title: "BOOKINGS",
    items: [
      { label: "All Bookings", icon: "list_alt", href: "/dashboard/rundesk/bookings" },
      { label: "New Booking", icon: "add_circle", href: "/dashboard/rundesk/bookings/new" },
      { label: "Pending Assignment", icon: "pending_actions", href: "/dashboard/rundesk/bookings?status=pending" },
    ],
  },
  {
    title: "LR MANAGEMENT",
    items: [
      { label: "Generate LR", icon: "post_add", href: "/dashboard/rundesk/lr/new" },
      { label: "LR Register", icon: "receipt_long", href: "/dashboard/rundesk/lr" },
      { label: "Lorry Hire Challan", icon: "article", href: "/dashboard/rundesk/lr?tab=challan" },
    ],
  },
  {
    title: "TRIPS",
    items: [
      { label: "Active Trips", icon: "my_location", href: "/dashboard/rundesk/trips?status=active" },
      { label: "All Trips", icon: "route", href: "/dashboard/rundesk/trips" },
      { label: "Trip Tracking", icon: "gps_fixed", href: "/dashboard/rundesk/trips/tracking" },
      { label: "Trip P&L", icon: "trending_up", href: "/dashboard/rundesk/trips/pnl" },
      { label: "Completed Trips", icon: "task_alt", href: "/dashboard/rundesk/trips?status=done" },
    ],
  },
  {
    title: "VEHICLES",
    items: [
      { label: "Fleet", icon: "directions_truck", href: "/dashboard/rundesk/vehicles" },
      { label: "Maintenance", icon: "build", href: "/dashboard/rundesk/vehicles?tab=maintenance" },
      { label: "Compliance", icon: "verified", href: "/dashboard/rundesk/vehicles?tab=compliance" },
    ],
  },
  {
    title: "DRIVERS",
    items: [
      { label: "Driver List", icon: "person_pin", href: "/dashboard/rundesk/drivers" },
      { label: "Driver Performance", icon: "emoji_events", href: "/dashboard/rundesk/drivers?tab=performance" },
      { label: "Advances", icon: "payments", href: "/dashboard/rundesk/drivers?tab=advances" },
    ],
  },
  {
    title: "BILLING",
    items: [
      { label: "Freight Invoices", icon: "receipt", href: "/dashboard/rundesk/billing" },
      { label: "E-Way Bills", icon: "qr_code", href: "/dashboard/rundesk/billing?tab=eway" },
      { label: "Delivery Challans", icon: "local_shipping", href: "/dashboard/rundesk/billing?tab=challans" },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Trip Expenses", icon: "account_balance_wallet", href: "/dashboard/rundesk/finance" },
      { label: "Trip Profitability", icon: "monitoring", href: "/dashboard/rundesk/finance?tab=profitability" },
      { label: "Fuel Log", icon: "local_gas_station", href: "/dashboard/rundesk/finance?tab=fuel" },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { label: "Trip Reports", icon: "analytics", href: "/dashboard/rundesk/reports" },
      { label: "Fleet Utilisation", icon: "bar_chart", href: "/dashboard/rundesk/reports?tab=fleet" },
      { label: "Driver Report", icon: "person_search", href: "/dashboard/rundesk/reports?tab=driver" },
      { label: "MIS", icon: "summarize", href: "/dashboard/rundesk/reports?tab=mis" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Rate Contracts", icon: "price_change", href: "/dashboard/rundesk/settings" },
      { label: "Branch Setup", icon: "corporate_fare", href: "/dashboard/rundesk/settings?tab=branch" },
    ],
  },
];

export default function RunDeskLayout({ children }: { children: React.ReactNode }) {
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
        (s.product === "RUNDESK" || s.product === "TRANSPORTER_BUNDLE" || s.product === "FULL_SUITE") &&
        s.status === "ACTIVE"
    );
    if (!hasAccess) router.replace("/demo/rundesk");
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
        (s.product === "RUNDESK" || s.product === "TRANSPORTER_BUNDLE" || s.product === "FULL_SUITE") &&
        s.status === "ACTIVE"
    );

  if (status === "loading" || !hasAccess) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#F8FAFC" }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#1E40AF", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/dashboard/rundesk") return pathname === "/dashboard/rundesk";
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
              directions_truck
            </span>
            <span className="text-xs font-semibold tracking-wide" style={{ color: "#64748B" }}>RunDesk</span>
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
                <span className="material-symbols-outlined text-slate-300" style={{ fontSize: 14, color: "#CBD5E1" }}>
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
            style={{ color: "#64748B" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
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
