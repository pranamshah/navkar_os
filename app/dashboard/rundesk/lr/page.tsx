"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const TABS = ["All", "Pending", "In Transit", "Delivered", "Billed"] as const;
type Tab = typeof TABS[number];

const lrRecords: {
  lrNo: string;
  date: string;
  consignor: string;
  consignee: string;
  from: string;
  to: string;
  vehicle: string;
  status: Tab;
  statusColor: string;
  statusBg: string;
}[] = [];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Pending: { color: "#1E40AF", bg: "#FFFBEB" },
  "In Transit": { color: "#1E40AF", bg: "#F5F3FF" },
  Delivered: { color: "#059669", bg: "#ECFDF5" },
  Billed: { color: "#1565C0", bg: "#E3F2FD" },
};

export default function LRRegisterPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");

  const filtered = lrRecords.filter((r) => {
    const matchTab = activeTab === "All" || r.status === activeTab;
    const matchSearch =
      search === "" ||
      r.lrNo.toLowerCase().includes(search.toLowerCase()) ||
      r.consignor.toLowerCase().includes(search.toLowerCase()) ||
      r.consignee.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827" }}
          >
            LR Register
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Lorry Receipts — all consignments</p>
        </div>
        <Link
          href="/dashboard/rundesk/lr/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
          style={{ background: "#1E40AF" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>post_add</span>
          Generate LR
        </Link>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-0.5 border-b" style={{ borderColor: "#E5E7EB" }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-2 text-[12px] font-medium transition-colors relative"
              style={{ color: activeTab === tab ? "#1E40AF" : "#6B7280" }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="lr-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "#1E40AF" }}
                />
              )}
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
            placeholder="Search LR..."
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
              {["LR No", "Date", "Consignor", "Consignee", "From", "To", "Vehicle", "Status"].map((h) => (
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#E5E7EB" }}>receipt_long</span>
                    <p className="text-[13px] font-medium" style={{ color: "#6B7280" }}>No LR records found</p>
                    <p className="text-[12px]" style={{ color: "#9CA3AF" }}>Generate your first LR to get started.</p>
                    <Link
                      href="/dashboard/rundesk/lr/new"
                      className="mt-2 px-4 py-1.5 rounded-md text-[13px] text-white"
                      style={{ background: "#1E40AF" }}
                    >
                      Generate LR
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const style = STATUS_STYLES[r.status] ?? { color: "#6B7280", bg: "#F3F4F6" };
                return (
                  <tr key={r.lrNo} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td className="py-3 px-4 font-mono text-[11px]" style={{ color: "#1E40AF" }}>{r.lrNo}</td>
                    <td className="py-3 px-4" style={{ color: "#6B7280" }}>{r.date}</td>
                    <td className="py-3 px-4 font-medium" style={{ color: "#111827" }}>{r.consignor}</td>
                    <td className="py-3 px-4" style={{ color: "#6B7280" }}>{r.consignee}</td>
                    <td className="py-3 px-4" style={{ color: "#6B7280" }}>{r.from}</td>
                    <td className="py-3 px-4" style={{ color: "#6B7280" }}>{r.to}</td>
                    <td className="py-3 px-4 font-mono text-[11px]" style={{ color: "#374151" }}>{r.vehicle}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
