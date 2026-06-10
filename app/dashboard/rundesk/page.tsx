"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const kpis = [
  { label: "Active Trips", value: "0", icon: "my_location", color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Bookings Today", value: "0", icon: "today", color: "#1565C0", bg: "#E3F2FD" },
  { label: "LRs Pending Delivery", value: "0", icon: "pending_actions", color: "#D97706", bg: "#FFFBEB" },
  { label: "Fleet Utilisation %", value: "0%", icon: "directions_truck", color: "#059669", bg: "#ECFDF5" },
  { label: "Freight Revenue This Month", value: "₹0", icon: "payments", color: "#059669", bg: "#ECFDF5" },
  { label: "Trip Margin %", value: "0%", icon: "trending_up", color: "#0D9488", bg: "#F0FDFA" },
];

const recentTrips: {
  tripNo: string;
  vehicle: string;
  driver: string;
  from: string;
  to: string;
  status: string;
  statusColor: string;
  statusBg: string;
  freight: string;
  margin: string;
}[] = [];

const alerts: { icon: string; title: string; desc: string; color: string; bg: string; border: string }[] = [];

export default function RunDeskDashboard() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827" }}
          >
            RunDesk Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Navkar Freight Co. · Transport TMS · FY 2025–26
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/rundesk/bookings/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
            style={{ background: "#7C3AED" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Booking
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
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
                <div className="text-[11px] font-medium mb-1.5" style={{ color: "#6B7280" }}>{kpi.label}</div>
                <div className="text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>{kpi.value}</div>
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

      {/* Recent Trips + Alerts */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>Recent Trips</h2>
            <Link href="/dashboard/rundesk/trips" className="text-[11px] font-medium" style={{ color: "#7C3AED" }}>
              View all →
            </Link>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["Trip No", "Vehicle", "Driver", "From → To", "Status", "Freight (₹)", "Margin (₹)"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-2 font-semibold text-[10px] uppercase tracking-wider"
                    style={{ color: "#6B7280" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTrips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[12px]" style={{ color: "#6B7280" }}>
                    No trips yet.
                  </td>
                </tr>
              ) : (
                recentTrips.map((t) => (
                  <tr key={t.tripNo} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#7C3AED" }}>{t.tripNo}</td>
                    <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>{t.vehicle}</td>
                    <td className="py-2.5 px-2" style={{ color: "#6B7280" }}>{t.driver}</td>
                    <td className="py-2.5 px-2" style={{ color: "#6B7280" }}>{t.from} → {t.to}</td>
                    <td className="py-2.5 px-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: t.statusBg, color: t.statusColor }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#111827" }}>{t.freight}</td>
                    <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#059669" }}>{t.margin}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Alerts</h2>
          <div className="flex flex-col gap-2">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>
                  notifications_none
                </span>
                <p className="text-[12px]" style={{ color: "#7e7576" }}>No alerts right now.</p>
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
                    <div className="font-medium" style={{ color: "#111827" }}>{a.title}</div>
                    <div style={{ color: "#6B7280" }}>{a.desc}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Compliance Alerts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Vehicle Compliance Expiry</h2>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>verified</span>
            <p className="text-[12px]" style={{ color: "#7e7576" }}>No compliance issues found.</p>
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Driver Licence Expiry</h2>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>person_pin</span>
            <p className="text-[12px]" style={{ color: "#7e7576" }}>No licence expiry alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
