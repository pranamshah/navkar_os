"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const kpis = [
  { label: "Active Jobs", value: "24", icon: "work", color: "#1565C0", bg: "#E3F2FD" },
  { label: "Import Jobs", value: "15", icon: "download", color: "#0D47A1", bg: "#E3F2FD" },
  { label: "Export Jobs", value: "9", icon: "upload", color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Pending Customs", value: "6", icon: "gavel", color: "#DC2626", bg: "#FEF2F2" },
  { label: "Revenue This Month", value: "₹12,84,500", icon: "trending_up", color: "#059669", bg: "#ECFDF5" },
  { label: "Outstanding", value: "₹3,42,000", icon: "pending_actions", color: "#D97706", bg: "#FFFBEB" },
];

const recentJobs = [
  { no: "IMP/2526/089", client: "Ravi Exports", route: "Shanghai → JNPT", mode: "SEA", stage: "At Customs", eta: "08 Jun 2026", stageColor: "#D97706", stageBg: "#FFFBEB" },
  { no: "EXP/2526/044", client: "HDFC Traders", route: "Chennai → Hamburg", mode: "SEA", stage: "Vessel Sailed", eta: "22 Jun 2026", stageColor: "#1565C0", stageBg: "#E3F2FD" },
  { no: "AIR/2526/032", client: "Global Impex", route: "Mumbai → Dubai", mode: "AIR", stage: "Delivered", eta: "—", stageColor: "#059669", stageBg: "#ECFDF5" },
  { no: "IMP/2526/088", client: "Sunrise Logistics", route: "Singapore → Chennai", mode: "SEA", stage: "CFS Destuffed", eta: "06 Jun 2026", stageColor: "#7C3AED", stageBg: "#F5F3FF" },
  { no: "IMP/2526/087", client: "Sakthi Cargo", route: "Rotterdam → JNPT", mode: "SEA", stage: "In Transit", eta: "15 Jun 2026", stageColor: "#1565C0", stageBg: "#E3F2FD" },
];

const alerts = [
  { icon: "warning", title: "IMP/2526/089 stuck at customs", desc: "3 days at examination — escalate to CHA", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  { icon: "schedule", title: "Vessel ETA changed", desc: "MV Pacific Ace — ETA postponed by 2 days", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { icon: "schedule", title: "Free days expiring tomorrow", desc: "Container TCNU8456731 — detention risk", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
];

const followUps = [
  { name: "Bharat Heavy Engg", lane: "China → Mumbai", overdue: "Overdue 4 days" },
  { name: "Apollo Pharma", lane: "Hyderabad → US", overdue: "Overdue 2 days" },
  { name: "Marine Spares Co", lane: "Singapore → Chennai", overdue: "Today" },
];

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
              {recentJobs.map((j) => (
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
            {alerts.map((a, i) => (
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
        <div className="grid grid-cols-3 gap-3">
          {followUps.map((f) => (
            <div key={f.name} className="p-3 rounded-lg border" style={{ borderColor: "#FECACA", background: "#FEF2F2" }}>
              <div className="text-[13px] font-semibold" style={{ color: "#111827" }}>{f.name}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{f.lane}</div>
              <div className="text-[11px] mt-1 font-medium" style={{ color: "#DC2626" }}>{f.overdue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
