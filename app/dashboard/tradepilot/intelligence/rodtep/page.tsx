"use client";

import { motion } from "framer-motion";

const monthlyData = [
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
  { month: "Aug", value: 0 },
  { month: "Sep", value: 0 },
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 0 },
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
];

const credits: {
  hsCode: string;
  fobValue: string;
  rate: string;
  creditAmount: string;
  scripStatus: string;
  statusColor: string;
  statusBg: string;
}[] = [];

const maxVal = Math.max(...monthlyData.map((d) => d.value), 1);

export default function RoDTEPTrackerPage() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 26 }}>
          RoDTEP Tracker
        </h1>
        <p className="text-xs" style={{ color: "#6B7280" }}>
          Remission of Duties and Taxes on Exported Products — FY 2025–26
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total RoDTEP Credits This FY", value: "₹0", icon: "savings", color: "#1E40AF", bg: "#CCFBF1" },
          { label: "Scrips Issued", value: "0", icon: "confirmation_number", color: "#1E40AF", bg: "#F5F3FF" },
          { label: "Pending Claims", value: "0", icon: "pending_actions", color: "#1E40AF", bg: "#FEF3C7" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border p-5"
            style={{ background: "#fff", borderColor: "#E5E7EB" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: "#6B7280" }}>{kpi.label}</div>
                <div className="text-3xl font-bold tracking-tight" style={{ color: "#111827" }}>{kpi.value}</div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: kpi.color, fontVariationSettings: "'FILL' 1" }}>{kpi.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border p-5 mb-6" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Monthly RoDTEP Credits</h2>
        <div className="flex items-end gap-2" style={{ height: 120 }}>
          {monthlyData.map((d) => {
            const heightPct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm transition-all" style={{
                  height: heightPct > 0 ? `${heightPct}%` : 4,
                  background: heightPct > 0 ? "#1E40AF" : "#E5E7EB",
                  minHeight: 4,
                }} />
                <span className="text-[9px] font-medium" style={{ color: "#9CA3AF" }}>{d.month}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-center">
          <span className="text-[11px]" style={{ color: "#6B7280" }}>No data yet — export shipments will appear here once added</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>RoDTEP Credits Log</h2>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium text-white"
            style={{ background: "#1E40AF" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
            Add Entry
          </button>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {["HS Code", "FOB Value", "RoDTEP Rate", "Credit Amount", "Scrip Status"].map((h) => (
                <th key={h} className="text-left py-3 px-5 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {credits.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#e5e7eb" }}>savings</span>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: "#1a1c1c" }}>No RoDTEP entries yet</p>
                      <p className="text-[11px] mt-1 max-w-sm mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
                        RoDTEP (Remission of Duties and Taxes on Exported Products) helps you recover embedded taxes in your export supply chain. Add export shipments to start tracking credits.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : credits.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-5 font-mono text-[11px]" style={{ color: "#1E40AF" }}>{c.hsCode}</td>
                <td className="py-2.5 px-5" style={{ color: "#111827" }}>{c.fobValue}</td>
                <td className="py-2.5 px-5" style={{ color: "#111827" }}>{c.rate}</td>
                <td className="py-2.5 px-5 font-semibold" style={{ color: "#1E40AF" }}>{c.creditAmount}</td>
                <td className="py-2.5 px-5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: c.statusBg, color: c.statusColor }}>{c.scripStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
