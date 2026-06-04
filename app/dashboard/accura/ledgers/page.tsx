"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type GroupType = "asset" | "liability" | "income" | "expense" | "equity";

interface Ledger {
  id: string;
  name: string;
  group: string;
  groupType: GroupType;
  openingBal: number;
  openingDir: "Dr" | "Cr";
  currentBal: number;
  currentDir: "Dr" | "Cr";
  gstin?: string;
  active: boolean;
}

const ledgers: Ledger[] = [
  { id: "1", name: "Cash", group: "Cash-in-Hand", groupType: "asset", openingBal: 125000, openingDir: "Dr", currentBal: 124800, currentDir: "Dr", active: true },
  { id: "2", name: "HDFC Bank CC", group: "Bank Accounts", groupType: "asset", openingBal: 1180000, openingDir: "Dr", currentBal: 1230800, currentDir: "Dr", active: true },
  { id: "3", name: "SBI Current Account", group: "Bank Accounts", groupType: "asset", openingBal: 340000, openingDir: "Dr", currentBal: 312400, currentDir: "Dr", active: true },
  { id: "4", name: "Ravi Exports Pvt Ltd", group: "Sundry Debtors", groupType: "asset", openingBal: 84000, openingDir: "Dr", currentBal: 96000, currentDir: "Dr", gstin: "27AABCR1234A1Z5", active: true },
  { id: "5", name: "HDFC Traders", group: "Sundry Debtors", groupType: "asset", openingBal: 48000, openingDir: "Dr", currentBal: 48000, currentDir: "Dr", gstin: "27AAACH1234D1Z2", active: true },
  { id: "6", name: "Global Impex Pvt Ltd", group: "Sundry Debtors", groupType: "asset", openingBal: 0, openingDir: "Dr", currentBal: 50000, currentDir: "Dr", gstin: "29AABCG4567B1Z1", active: true },
  { id: "7", name: "Apollo World Shipping", group: "Sundry Creditors", groupType: "liability", openingBal: 62000, openingDir: "Cr", currentBal: 74000, currentDir: "Cr", gstin: "27AABCA4321F1Z3", active: true },
  { id: "8", name: "Sakthi Transport", group: "Sundry Creditors", groupType: "liability", openingBal: 28000, openingDir: "Cr", currentBal: 50000, currentDir: "Cr", active: true },
  { id: "9", name: "Ocean Freight Income", group: "Sales Accounts", groupType: "income", openingBal: 0, openingDir: "Cr", currentBal: 418000, currentDir: "Cr", active: true },
  { id: "10", name: "Air Freight Income", group: "Sales Accounts", groupType: "income", openingBal: 0, openingDir: "Cr", currentBal: 88000, currentDir: "Cr", active: true },
  { id: "11", name: "Documentation Charges", group: "Direct Income", groupType: "income", openingBal: 0, openingDir: "Cr", currentBal: 12000, currentDir: "Cr", active: true },
  { id: "12", name: "Miscellaneous Income", group: "Indirect Income", groupType: "income", openingBal: 0, openingDir: "Cr", currentBal: 36000, currentDir: "Cr", active: true },
  { id: "13", name: "CFS Charges", group: "Direct Expenses", groupType: "expense", openingBal: 0, openingDir: "Dr", currentBal: 82000, currentDir: "Dr", active: true },
  { id: "14", name: "Transport Charges", group: "Direct Expenses", groupType: "expense", openingBal: 0, openingDir: "Dr", currentBal: 54000, currentDir: "Dr", active: true },
  { id: "15", name: "Steamer Freight", group: "Direct Expenses", groupType: "expense", openingBal: 0, openingDir: "Dr", currentBal: 38000, currentDir: "Dr", active: true },
  { id: "16", name: "CGST Payable", group: "Duties & Taxes", groupType: "liability", openingBal: 0, openingDir: "Cr", currentBal: 31070, currentDir: "Cr", active: true },
  { id: "17", name: "SGST Payable", group: "Duties & Taxes", groupType: "liability", openingBal: 0, openingDir: "Cr", currentBal: 31070, currentDir: "Cr", active: true },
  { id: "18", name: "IGST Payable", group: "Duties & Taxes", groupType: "liability", openingBal: 0, openingDir: "Cr", currentBal: 0, currentDir: "Cr", active: true },
  { id: "19", name: "TDS Payable (194C)", group: "Duties & Taxes", groupType: "liability", openingBal: 0, openingDir: "Cr", currentBal: 8200, currentDir: "Cr", active: true },
  { id: "20", name: "Capital Account", group: "Capital Account", groupType: "equity", openingBal: 800000, openingDir: "Cr", currentBal: 800000, currentDir: "Cr", active: true },
  { id: "21", name: "Retained Earnings", group: "Reserves & Surplus", groupType: "equity", openingBal: 177800, openingDir: "Cr", currentBal: 177800, currentDir: "Cr", active: true },
  { id: "22", name: "Office Rent", group: "Indirect Expenses", groupType: "expense", openingBal: 0, openingDir: "Dr", currentBal: 28000, currentDir: "Dr", active: true },
  { id: "23", name: "Staff Salary", group: "Indirect Expenses", groupType: "expense", openingBal: 0, openingDir: "Dr", currentBal: 144000, currentDir: "Dr", active: true },
  { id: "24", name: "Telephone & Internet", group: "Indirect Expenses", groupType: "expense", openingBal: 0, openingDir: "Dr", currentBal: 8400, currentDir: "Dr", active: true },
  { id: "25", name: "Software Subscription", group: "Indirect Expenses", groupType: "expense", openingBal: 0, openingDir: "Dr", currentBal: 18200, currentDir: "Dr", active: true },
];

const groupColors: Record<GroupType, { text: string; bg: string; border: string }> = {
  asset: { text: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  liability: { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  income: { text: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC" },
  expense: { text: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  equity: { text: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
};

const allGroups = ["All Groups", ...Array.from(new Set(ledgers.map((l) => l.group)))];

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function LedgersPage() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("All Groups");

  const filtered = ledgers.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.group.toLowerCase().includes(search.toLowerCase());
    const matchGroup = groupFilter === "All Groups" || l.group === groupFilter;
    return matchSearch && matchGroup;
  });

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Ledgers</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{filtered.length} ledgers</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2" style={{ fontSize: 15, color: "#9CA3AF" }}>search</span>
            <input
              type="text"
              placeholder="Search ledgers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md border text-[13px] outline-none focus:ring-1"
              style={{ borderColor: "#E5E7EB", background: "#fff", color: "#111827", width: 220 }}
            />
          </div>
          {/* Group filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md border text-[13px] outline-none cursor-pointer"
            style={{ borderColor: "#E5E7EB", background: "#fff", color: "#374151" }}
          >
            {allGroups.map((g) => <option key={g}>{g}</option>)}
          </select>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white"
            style={{ background: "#0E7490" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Ledger
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Name</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Group</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Opening Bal</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Current Bal</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>GSTIN</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Active</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ledger, i) => {
              const gc = groupColors[ledger.groupType];
              return (
                <motion.tr
                  key={ledger.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.015 }}
                  className="border-b cursor-pointer group"
                  style={{ borderColor: "#F3F4F6" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: gc.bg }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: gc.text }}>
                          {ledger.groupType === "asset" ? "account_balance_wallet" :
                           ledger.groupType === "liability" ? "credit_card" :
                           ledger.groupType === "income" ? "trending_up" :
                           ledger.groupType === "expense" ? "receipt" : "savings"}
                        </span>
                      </div>
                      <span className="font-medium" style={{ color: "#111827" }}>{ledger.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: gc.bg, color: gc.text, border: `1px solid ${gc.border}` }}
                    >
                      {ledger.group}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <span style={{ color: ledger.openingDir === "Dr" ? "#059669" : "#DC2626" }}>
                      {fmt(ledger.openingBal)}
                    </span>
                    <span className="ml-1 text-[10px]" style={{ color: "#9CA3AF" }}>{ledger.openingDir}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <span style={{ color: ledger.currentDir === "Dr" ? "#059669" : "#DC2626" }}>
                      {fmt(ledger.currentBal)}
                    </span>
                    <span className="ml-1 text-[10px]" style={{ color: "#9CA3AF" }}>{ledger.currentDir}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {ledger.gstin ? (
                      <span className="font-mono text-[11px]" style={{ color: "#374151" }}>{ledger.gstin}</span>
                    ) : (
                      <span style={{ color: "#D1D5DB" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: ledger.active ? "#059669" : "#D1D5DB" }}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#6B7280" }}>edit</span>
                      </button>
                      <button className="p-1 rounded hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#DC2626" }}>delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        {(Object.entries(groupColors) as [GroupType, typeof groupColors.asset][]).map(([type, c]) => (
          <div key={type} className="flex items-center gap-1.5 text-[11px]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text }} />
            <span style={{ color: "#6B7280" }}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
