"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const kpis = [
  { label: "Active Shipments", value: "0", icon: "local_shipping", color: "#0D9488", bg: "#CCFBF1" },
  { label: "Imports This Month", value: "0", icon: "download", color: "#1D4ED8", bg: "#DBEAFE" },
  { label: "Exports This Month", value: "0", icon: "upload", color: "#059669", bg: "#DCFCE7" },
  { label: "Total Duty Paid", value: "₹0", icon: "account_balance", color: "#D97706", bg: "#FEF3C7" },
  { label: "RoDTEP Credits Earned", value: "₹0", icon: "savings", color: "#0D9488", bg: "#CCFBF1" },
  { label: "FTA Savings This Year", value: "₹0", icon: "percent", color: "#059669", bg: "#DCFCE7" },
];

const recentShipments: {
  id: string;
  type: string;
  party: string;
  commodity: string;
  hsCode: string;
  status: string;
  landedCost: string;
  statusColor: string;
  statusBg: string;
}[] = [];

const intelligenceCards = [
  {
    title: "HSN Scout",
    description: "Find the correct 8-digit ITC-HS code for any product using plain English.",
    icon: "search",
    href: "/dashboard/tradepilot/intelligence/hsn",
  },
  {
    title: "Duty Calculator",
    description: "Calculate exact landed cost including BCD, IGST, SWS and port charges.",
    icon: "calculate",
    href: "/dashboard/tradepilot/intelligence/duty",
  },
  {
    title: "FTA Checker",
    description: "Check if your shipment qualifies for preferential duty under India's FTAs.",
    icon: "public",
    href: "/dashboard/tradepilot/intelligence/fta",
  },
];

export default function TradePilotDashboard() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 26 }}
          >
            TradePilot
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Import/Export Intelligence · Navkar Freight Co. · FY 2025–26
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/tradepilot/shipments"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
            style={{ background: "#0D9488" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Shipment
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

      {/* Recent Shipments */}
      <div className="rounded-xl border p-5 mb-6" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>Recent Shipments</h2>
          <Link href="/dashboard/tradepilot/shipments" className="text-[11px] font-medium" style={{ color: "#0D9488" }}>
            View all →
          </Link>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {["Shipment", "Type", "Supplier/Buyer", "Commodity", "HS Code", "Status", "Landed Cost"].map((h) => (
                <th key={h} className="text-left py-2 px-2 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentShipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center" style={{ color: "#6B7280" }}>
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#e5e7eb" }}>local_shipping</span>
                    <span className="text-[12px]">No shipments yet. Add your first shipment to get started.</span>
                  </div>
                </td>
              </tr>
            ) : recentShipments.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#0D9488" }}>{s.id}</td>
                <td className="py-2.5 px-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{
                    background: s.type === "Import" ? "#DBEAFE" : "#DCFCE7",
                    color: s.type === "Import" ? "#1E40AF" : "#166534",
                  }}>{s.type}</span>
                </td>
                <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>{s.party}</td>
                <td className="py-2.5 px-2" style={{ color: "#6B7280" }}>{s.commodity}</td>
                <td className="py-2.5 px-2 font-mono text-[11px]" style={{ color: "#6B7280" }}>{s.hsCode}</td>
                <td className="py-2.5 px-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: s.statusBg, color: s.statusColor }}>{s.status}</span>
                </td>
                <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>{s.landedCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trade Intelligence Quick Access */}
      <div className="mb-2">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Trade Intelligence</h2>
        <div className="grid grid-cols-3 gap-4">
          {intelligenceCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                href={card.href}
                className="flex flex-col p-5 rounded-xl border transition-all group"
                style={{ background: "#fff", borderColor: "#E5E7EB" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#0D9488";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(13,148,136,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "#CCFBF1" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0D9488", fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                </div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>{card.title}</div>
                <div className="text-[11px] leading-relaxed" style={{ color: "#6B7280" }}>{card.description}</div>
                <div className="mt-3 text-[11px] font-semibold flex items-center gap-1" style={{ color: "#0D9488" }}>
                  Open tool
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
