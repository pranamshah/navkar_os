"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Shipment = {
  id: string;
  type: "Import" | "Export";
  party: string;
  country: string;
  commodity: string;
  blSb: string;
  status: string;
  landedCost: string;
  statusColor: string;
  statusBg: string;
};

const shipments: Shipment[] = [];

const tabs = ["All", "Import", "Export"] as const;
type Tab = (typeof tabs)[number];

export default function ShipmentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered = shipments.filter((s) => {
    if (activeTab === "All") return true;
    return s.type === activeTab;
  });

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 24 }}>
            Shipment Register
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Track all import and export shipments</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
          style={{ background: "#1E40AF" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
          New Shipment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: "#F3F4F6" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-md text-[13px] font-medium transition-all"
            style={{
              background: activeTab === tab ? "#fff" : "transparent",
              color: activeTab === tab ? "#1E40AF" : "#6B7280",
              boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="rounded-xl border"
        style={{ background: "#fff", borderColor: "#E5E7EB" }}
      >
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {["Shipment ID", "Type", "Supplier / Buyer", "Country", "Commodity", "BL / SB No", "Status", "Landed Cost"].map((h) => (
                <th key={h} className="text-left py-3 px-4 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#e5e7eb" }}>local_shipping</span>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: "#1a1c1c" }}>No shipments found</p>
                      <p className="text-[11px] mt-1" style={{ color: "#6B7280" }}>
                        {activeTab === "All"
                          ? "Add your first shipment to start tracking."
                          : `No ${activeTab.toLowerCase()} shipments yet.`}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filtered.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-4 font-mono text-[11px]" style={{ color: "#1E40AF" }}>{s.id}</td>
                <td className="py-2.5 px-4">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{
                    background: s.type === "Import" ? "#DBEAFE" : "#DCFCE7",
                    color: s.type === "Import" ? "#1E40AF" : "#166534",
                  }}>{s.type}</span>
                </td>
                <td className="py-2.5 px-4 font-medium" style={{ color: "#111827" }}>{s.party}</td>
                <td className="py-2.5 px-4" style={{ color: "#6B7280" }}>{s.country}</td>
                <td className="py-2.5 px-4" style={{ color: "#6B7280" }}>{s.commodity}</td>
                <td className="py-2.5 px-4 font-mono text-[11px]" style={{ color: "#6B7280" }}>{s.blSb}</td>
                <td className="py-2.5 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: s.statusBg, color: s.statusColor }}>{s.status}</span>
                </td>
                <td className="py-2.5 px-4 font-medium" style={{ color: "#111827" }}>{s.landedCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
