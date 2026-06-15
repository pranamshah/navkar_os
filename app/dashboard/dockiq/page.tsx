"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const kpis = [
  { label: "Containers in Yard", value: "0", icon: "warehouse", color: "#1E40AF", bg: "#FFFBEB" },
  { label: "Gate-In Today", value: "0", icon: "login", color: "#1D4ED8", bg: "#DBEAFE" },
  { label: "Pending OOC", value: "0", icon: "pending_actions", color: "#EA580C", bg: "#FFF7ED" },
  { label: "Free Days Expiring Soon", value: "0", icon: "timer", color: "#DC2626", bg: "#FEF2F2" },
  { label: "Storage Revenue This Month", value: "₹0", icon: "payments", color: "#059669", bg: "#ECFDF5" },
  { label: "Pending Invoices", value: "0", icon: "receipt", color: "#1E40AF", bg: "#FFFBEB" },
];

const recentContainers: {
  containerNo: string;
  blNo: string;
  shippingLine: string;
  size: string;
  daysInYard: number;
  storageDue: string;
  status: string;
  statusColor: string;
  statusBg: string;
}[] = [];

const alerts: { icon: string; title: string; desc: string; color: string; bg: string; border: string }[] = [];

export default function DockIQDashboard() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ color: "#111827", fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            DockIQ Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Navkar Freight Co. · CFS &amp; Warehouse Management · FY 2025–26
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/dockiq/gate/in"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
            style={{ background: "#1E40AF" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>login</span>
            Gate In
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl p-4 border"
            style={{ background: "#fff", borderColor: "#E5E7EB" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-[11px] font-medium mb-1.5" style={{ color: "#6B7280" }}>
                  {kpi.label}
                </div>
                <div className="text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>
                  {kpi.value}
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: kpi.bg }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20, color: kpi.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {kpi.icon}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Containers + Alerts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>Recent Containers</h2>
            <Link
              href="/dashboard/dockiq/storage"
              className="text-[11px] font-medium"
              style={{ color: "#1E40AF" }}
            >
              View all →
            </Link>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["Container No", "BL No", "Shipping Line", "Size", "Days in Yard", "Storage Due (₹)", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-2 font-semibold text-[10px] uppercase tracking-wider"
                      style={{ color: "#6B7280" }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentContainers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[12px]" style={{ color: "#6B7280" }}>
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 36, color: "#e5e7eb" }}
                      >
                        inbox
                      </span>
                      No containers in yard.
                    </div>
                  </td>
                </tr>
              ) : (
                recentContainers.map((c) => (
                  <tr key={c.containerNo} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#1E40AF" }}>
                      {c.containerNo}
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#6B7280" }}>
                      {c.blNo}
                    </td>
                    <td className="py-2.5 px-2" style={{ color: "#111827" }}>
                      {c.shippingLine}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: "#F3F4F6", color: "#374151" }}
                      >
                        {c.size}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-medium" style={{ color: c.daysInYard > 7 ? "#DC2626" : "#111827" }}>
                      {c.daysInYard}d
                    </td>
                    <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>
                      {c.storageDue}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: c.statusBg, color: c.statusColor }}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Alerts Panel */}
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Alerts</h2>
          <div className="flex flex-col gap-2">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span
                  className="material-symbols-outlined mb-2"
                  style={{ fontSize: 32, color: "#e5e7eb" }}
                >
                  notifications_none
                </span>
                <p className="text-[12px]" style={{ color: "#7e7576" }}>
                  No alerts right now.
                </p>
              </div>
            ) : (
              alerts.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border text-[12px]"
                  style={{ background: a.bg, borderColor: a.border }}
                >
                  <span
                    className="material-symbols-outlined flex-shrink-0 mt-0.5"
                    style={{ fontSize: 15, color: a.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {a.icon}
                  </span>
                  <div>
                    <div className="font-medium" style={{ color: "#111827" }}>
                      {a.title}
                    </div>
                    <div style={{ color: "#6B7280" }}>{a.desc}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Links */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>
              Quick Actions
            </div>
            <div className="flex flex-col gap-1">
              {[
                { label: "View Exam Queue", href: "/dashboard/dockiq/customs/exam", icon: "gavel" },
                { label: "Storage Charges", href: "/dashboard/dockiq/storage?tab=charges", icon: "payments" },
                { label: "Create Invoice", href: "/dashboard/dockiq/invoices/new", icon: "post_add" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-[12px] transition-colors"
                  style={{ color: "#1E40AF" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#FFFBEB")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
