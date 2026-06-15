"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const FILTERS = ["All", "Active", "Completed", "Planned"] as const;
type Filter = typeof FILTERS[number];

const trips: {
  tripNo: string;
  vehicleNo: string;
  driver: string;
  route: string;
  status: string;
  statusColor: string;
  statusBg: string;
  startTime: string;
  freightEarned: string;
  netMargin: string;
}[] = [];

export default function TripsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827" }}
          >
            Trips
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Track and manage all transport trips</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
          style={{ background: "#1E40AF" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
          New Trip
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F3F4F6" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
              style={{
                background: activeFilter === f ? "#fff" : "transparent",
                color: activeFilter === f ? "#1E40AF" : "#6B7280",
                boxShadow: activeFilter === f ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ fontSize: 16, color: "#9CA3AF" }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search trips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border text-[13px] outline-none w-56"
            style={{ borderColor: "#E5E7EB", background: "#fff", color: "#111827" }}
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="rounded-xl border overflow-hidden"
        style={{ background: "#fff", borderColor: "#E5E7EB" }}
      >
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Trip No", "Vehicle No", "Driver", "Route", "Status", "Start Time", "Freight Earned", "Net Margin"].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 font-semibold text-[10px] uppercase tracking-wider"
                  style={{ color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#E5E7EB" }}>route</span>
                    <p className="text-[13px] font-medium" style={{ color: "#6B7280" }}>No trips found</p>
                    <p className="text-[12px]" style={{ color: "#9CA3AF" }}>Create your first trip to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              trips.map((t) => (
                <tr key={t.tripNo} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td className="py-3 px-4 font-mono text-[11px]" style={{ color: "#1E40AF" }}>{t.tripNo}</td>
                  <td className="py-3 px-4 font-mono text-[11px]" style={{ color: "#374151" }}>{t.vehicleNo}</td>
                  <td className="py-3 px-4 font-medium" style={{ color: "#111827" }}>{t.driver}</td>
                  <td className="py-3 px-4" style={{ color: "#6B7280" }}>{t.route}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: t.statusBg, color: t.statusColor }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4" style={{ color: "#6B7280" }}>{t.startTime}</td>
                  <td className="py-3 px-4 font-mono" style={{ color: "#111827" }}>{t.freightEarned}</td>
                  <td className="py-3 px-4 font-mono" style={{ color: "#059669" }}>{t.netMargin}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
