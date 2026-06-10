"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FilterTab = "All" | "Free Period" | "Slab 1" | "Slab 2" | "Slab 3+";

type ContainerRow = {
  containerNo: string;
  blNo: string;
  gateInDate: string;
  freeDays: number;
  daysSinceGateIn: number;
  chargeableDays: number;
  storageRate: number;
  storageDue: number;
  status: "Free Period" | "Slab 1" | "Slab 2" | "Slab 3+";
};

const containers: ContainerRow[] = [];

const expiringCount = containers.filter(
  (c) => c.freeDays - c.daysSinceGateIn <= 3 && c.freeDays - c.daysSinceGateIn >= 0
).length;

const statusColors: Record<ContainerRow["status"], { color: string; bg: string }> = {
  "Free Period": { color: "#059669", bg: "#ECFDF5" },
  "Slab 1": { color: "#D97706", bg: "#FFFBEB" },
  "Slab 2": { color: "#EA580C", bg: "#FFF7ED" },
  "Slab 3+": { color: "#DC2626", bg: "#FEF2F2" },
};

const tabs: FilterTab[] = ["All", "Free Period", "Slab 1", "Slab 2", "Slab 3+"];

export default function StoragePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const filtered = activeTab === "All" ? containers : containers.filter((c) => c.status === activeTab);
  const sorted = [...filtered].sort((a, b) => b.daysSinceGateIn - a.daysSinceGateIn);

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ color: "#111827", fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            Container Storage
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Track storage days, free periods, and charges for all containers in yard
          </p>
        </div>
      </div>

      {/* Expiry Banner */}
      {expiringCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
          style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18, color: "#D97706", fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <p className="text-sm font-medium" style={{ color: "#92400E" }}>
            {expiringCount} container{expiringCount !== 1 ? "s" : ""} have free days expiring within 3 days
          </p>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1.5 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{
              background: activeTab === tab ? "#D97706" : "#fff",
              color: activeTab === tab ? "#fff" : "#6B7280",
              borderColor: activeTab === tab ? "#D97706" : "#E5E7EB",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {[
                "Container No",
                "BL No",
                "Gate-In Date",
                "Free Days",
                "Days Since Gate-In",
                "Chargeable Days",
                "Storage Rate/Day",
                "Storage Due (₹)",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-3 font-semibold text-[10px] uppercase tracking-wider"
                  style={{ color: "#6B7280" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center" style={{ color: "#6B7280" }}>
                  <div className="flex flex-col items-center gap-3">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 48, color: "#E5E7EB" }}
                    >
                      view_list
                    </span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#374151" }}>
                        No containers in storage
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                        Gate-in a container to start tracking storage days and charges.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((c) => {
                const statusStyle = statusColors[c.status];
                return (
                  <tr
                    key={c.containerNo}
                    style={{ borderBottom: "1px solid #F3F4F6" }}
                  >
                    <td className="py-3 px-3 font-mono font-semibold" style={{ color: "#D97706" }}>
                      {c.containerNo}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>
                      {c.blNo}
                    </td>
                    <td className="py-3 px-3" style={{ color: "#374151" }}>
                      {c.gateInDate}
                    </td>
                    <td className="py-3 px-3 font-medium" style={{ color: "#111827" }}>
                      {c.freeDays}d
                    </td>
                    <td
                      className="py-3 px-3 font-bold"
                      style={{
                        color:
                          c.daysSinceGateIn > c.freeDays
                            ? "#DC2626"
                            : c.freeDays - c.daysSinceGateIn <= 3
                            ? "#D97706"
                            : "#059669",
                      }}
                    >
                      {c.daysSinceGateIn}d
                    </td>
                    <td className="py-3 px-3 font-medium" style={{ color: "#111827" }}>
                      {c.chargeableDays}d
                    </td>
                    <td className="py-3 px-3" style={{ color: "#374151" }}>
                      ₹{c.storageRate.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 font-semibold" style={{ color: "#111827" }}>
                      ₹{c.storageDue.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
