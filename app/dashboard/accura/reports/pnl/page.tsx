"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const pnlData = {
  income: [
    { group: "Sales Accounts", items: [
      { name: "Ocean Freight Income", amount: 418000 },
      { name: "Air Freight Income", amount: 88000 },
    ]},
    { group: "Direct Income", items: [
      { name: "Documentation Charges", amount: 12000 },
      { name: "Agency Commission", amount: 24500 },
    ]},
    { group: "Indirect Income", items: [
      { name: "Miscellaneous Income", amount: 36000 },
    ]},
  ],
  directExpenses: [
    { group: "Direct Expenses", items: [
      { name: "CFS Charges", amount: 82000 },
      { name: "Transport Charges", amount: 54000 },
      { name: "Steamer Freight", amount: 38000 },
      { name: "Port Handling Charges", amount: 18000 },
    ]},
  ],
  indirectExpenses: [
    { group: "Indirect Expenses", items: [
      { name: "Staff Salary", amount: 144000 },
      { name: "Office Rent", amount: 28000 },
      { name: "Telephone & Internet", amount: 8400 },
      { name: "Software Subscription", amount: 18200 },
      { name: "Depreciation", amount: 12000 },
    ]},
  ],
};

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function PnLPage() {
  const [period, setPeriod] = useState("FY 2025–26");

  const totalIncome = pnlData.income.flatMap((g) => g.items).reduce((s, i) => s + i.amount, 0);
  const totalDirectExp = pnlData.directExpenses.flatMap((g) => g.items).reduce((s, i) => s + i.amount, 0);
  const grossProfit = totalIncome - totalDirectExp;
  const totalIndirectExp = pnlData.indirectExpenses.flatMap((g) => g.items).reduce((s, i) => s + i.amount, 0);
  const netProfit = grossProfit - totalIndirectExp;
  const grossMargin = totalIncome > 0 ? ((grossProfit / totalIncome) * 100).toFixed(1) : "0.0";
  const netMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Profit & Loss Statement</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · {period}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-1.5 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            <option>FY 2025–26</option>
            <option>FY 2024–25</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>Export PDF
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Gross Revenue", val: fmt(totalIncome), color: "#0E7490", bg: "#ECFEFF" },
          { label: "Gross Profit", val: fmt(grossProfit), sub: `${grossMargin}% margin`, color: "#059669", bg: "#ECFDF5" },
          { label: "Net Profit", val: fmt(netProfit), sub: `${netMargin}% margin`, color: netProfit >= 0 ? "#059669" : "#DC2626", bg: netProfit >= 0 ? "#ECFDF5" : "#FEF2F2" },
          { label: "Total Expenses", val: fmt(totalDirectExp + totalIndirectExp), color: "#DC2626", bg: "#FEF2F2" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="text-[11px] font-medium mb-1.5" style={{ color: "#6B7280" }}>{kpi.label}</div>
            <div className="text-xl font-bold font-mono" style={{ color: kpi.color }}>{kpi.val}</div>
            {kpi.sub && <div className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* P&L Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          {/* Left: Income */}
          <div>
            <div className="px-5 py-3 border-b font-semibold text-[12px] uppercase tracking-wide" style={{ background: "#F0FDF4", borderColor: "#E5E7EB", color: "#059669" }}>
              Income
            </div>
            {pnlData.income.map((group) => (
              <div key={group.group}>
                <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#F9FAFB", color: "#9CA3AF" }}>{group.group}</div>
                {group.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center px-5 py-2.5 border-b text-[13px]" style={{ borderColor: "#F3F4F6" }}>
                    <span style={{ color: "#374151" }}>{item.name}</span>
                    <span className="font-mono font-medium" style={{ color: "#111827" }}>{fmt(item.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between items-center px-5 py-3 font-bold text-[14px] border-t" style={{ borderColor: "#E5E7EB", background: "#F0FDF4" }}>
              <span style={{ color: "#059669" }}>Total Income</span>
              <span className="font-mono" style={{ color: "#059669" }}>{fmt(totalIncome)}</span>
            </div>
          </div>

          {/* Right: Expenses */}
          <div>
            <div className="px-5 py-3 border-b font-semibold text-[12px] uppercase tracking-wide" style={{ background: "#FEF2F2", borderColor: "#E5E7EB", color: "#DC2626" }}>
              Expenses
            </div>
            {[...pnlData.directExpenses, ...pnlData.indirectExpenses].map((group) => (
              <div key={group.group}>
                <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#F9FAFB", color: "#9CA3AF" }}>{group.group}</div>
                {group.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center px-5 py-2.5 border-b text-[13px]" style={{ borderColor: "#F3F4F6" }}>
                    <span style={{ color: "#374151" }}>{item.name}</span>
                    <span className="font-mono font-medium" style={{ color: "#111827" }}>{fmt(item.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
            {/* Gross profit line */}
            <div className="flex justify-between items-center px-5 py-2.5 border-b text-[13px]" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
              <span className="font-medium" style={{ color: "#059669" }}>Gross Profit c/d</span>
              <span className="font-mono font-medium" style={{ color: "#059669" }}>{fmt(grossProfit)}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3 font-bold text-[14px] border-t" style={{ borderColor: "#E5E7EB", background: "#FEF2F2" }}>
              <span style={{ color: "#DC2626" }}>Total Expenses + Gross Profit</span>
              <span className="font-mono" style={{ color: "#DC2626" }}>{fmt(totalIncome)}</span>
            </div>
          </div>
        </div>

        {/* Net Profit line */}
        <div className="flex justify-between items-center px-5 py-4 border-t" style={{ borderColor: "#E5E7EB", background: netProfit >= 0 ? "#ECFDF5" : "#FEF2F2" }}>
          <div className="text-base font-bold" style={{ color: netProfit >= 0 ? "#059669" : "#DC2626" }}>
            Net Profit for the Period
          </div>
          <div className="text-xl font-bold font-mono" style={{ color: netProfit >= 0 ? "#059669" : "#DC2626" }}>
            {fmt(netProfit)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
