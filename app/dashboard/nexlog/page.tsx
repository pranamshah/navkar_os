"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const kpis = [
  { label: "Active Jobs", value: "0", icon: "work", color: "#1565C0", bg: "#E3F2FD" },
  { label: "Import Jobs", value: "0", icon: "download", color: "#0D47A1", bg: "#E3F2FD" },
  { label: "Export Jobs", value: "0", icon: "upload", color: "#1E40AF", bg: "#F5F3FF" },
  { label: "Pending Customs", value: "0", icon: "gavel", color: "#DC2626", bg: "#FEF2F2" },
  { label: "Revenue This Month", value: "₹0", icon: "trending_up", color: "#059669", bg: "#ECFDF5" },
  { label: "Outstanding", value: "₹0", icon: "pending_actions", color: "#1E40AF", bg: "#FFFBEB" },
];

const recentJobs: { no: string; client: string; route: string; mode: string; stage: string; eta: string; stageColor: string; stageBg: string }[] = [];

const alerts: { icon: string; title: string; desc: string; color: string; bg: string; border: string }[] = [];

const followUps: { name: string; lane: string; overdue: string }[] = [];

export default function NexlogDashboard() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · Freight Forwarding · FY 2025–26</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/nexlog/jobs/new" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors" style={{ background: "#1565C0" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Job
          </Link>
        </div>
      </div>

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
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: kpi.color, fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>Recent Jobs</h2>
            <Link href="/dashboard/nexlog/jobs" className="text-[11px] font-medium" style={{ color: "#1565C0" }}>View all →</Link>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["Job No", "Client", "Route", "Mode", "Stage", "ETA", ""].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[12px]" style={{ color: "#6B7280" }}>No jobs yet.</td>
                </tr>
              ) : recentJobs.map((j) => (
                <tr key={j.no} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#1565C0" }}>{j.no}</td>
                  <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>{j.client}</td>
                  <td className="py-2.5 px-2" style={{ color: "#6B7280" }}>{j.route}</td>
                  <td className="py-2.5 px-2"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: j.mode === "SEA" ? "#DBEAFE" : "#FEF3C7", color: j.mode === "SEA" ? "#1E40AF" : "#92400E" }}>{j.mode}</span></td>
                  <td className="py-2.5 px-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: j.stageBg, color: j.stageColor }}>{j.stage}</span></td>
                  <td className="py-2.5 px-2 text-[11px]" style={{ color: "#6B7280" }}>{j.eta}</td>
                  <td className="py-2.5 px-2 text-right">
                    <Link href={`/dashboard/nexlog/jobs/${j.no}`} className="text-[11px] font-semibold px-2 py-1 rounded" style={{ color: "#1565C0", background: "#E3F2FD" }}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Alerts</h2>
          <div className="flex flex-col gap-2">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>notifications_none</span>
                <p className="text-[12px]" style={{ color: "#7e7576" }}>No alerts right now.</p>
              </div>
            ) : alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg border text-[12px]" style={{ background: a.bg, borderColor: a.border }}>
                <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ fontSize: 15, color: a.color, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                <div>
                  <div className="font-medium" style={{ color: "#111827" }}>{a.title}</div>
                  <div style={{ color: "#6B7280" }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Follow-up Reminders</h2>
        {followUps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>inbox</span>
            <p className="text-[12px]" style={{ color: "#7e7576" }}>No follow-up reminders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {followUps.map((f) => (
              <div key={f.name} className="p-3 rounded-lg border" style={{ borderColor: "#FECACA", background: "#FEF2F2" }}>
                <div className="text-[13px] font-semibold" style={{ color: "#111827" }}>{f.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{f.lane}</div>
                <div className="text-[11px] mt-1 font-medium" style={{ color: "#DC2626" }}>{f.overdue}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
