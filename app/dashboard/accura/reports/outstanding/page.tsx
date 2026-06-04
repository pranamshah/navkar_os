"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "receivables" | "payables";

const receivables = [
  { party: "HDFC Traders", invoices: [
    { ref: "INV/25-26/042", date: "2026-04-14", due: "2026-05-14", amount: 48000, age: 51, status: "overdue" as const },
  ]},
  { party: "Ravi Exports Pvt Ltd", invoices: [
    { ref: "INV/25-26/058", date: "2026-05-12", due: "2026-06-12", amount: 54000, age: 22, status: "overdue" as const },
    { ref: "INV/25-26/064", date: "2026-06-01", due: "2026-07-01", amount: 42000, age: -27, status: "current" as const },
  ]},
  { party: "Global Impex Pvt Ltd", invoices: [
    { ref: "INV/25-26/071", date: "2026-06-10", due: "2026-07-10", amount: 50000, age: -36, status: "current" as const },
  ]},
];

const payables = [
  { party: "Apollo World Shipping", invoices: [
    { ref: "PUR/25-26/031", date: "2026-05-05", due: "2026-06-05", amount: 74000, age: 29, status: "overdue" as const },
  ]},
  { party: "Sakthi Transport", invoices: [
    { ref: "PUR/25-26/048", date: "2026-06-01", due: "2026-07-01", amount: 50000, age: -27, status: "current" as const },
  ]},
];

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

const ageBuckets = (age: number) => {
  if (age <= 0) return { label: "Not due", color: "#059669", bg: "#ECFDF5" };
  if (age <= 30) return { label: "1–30 days", color: "#D97706", bg: "#FFFBEB" };
  if (age <= 60) return { label: "31–60 days", color: "#DC2626", bg: "#FEF2F2" };
  return { label: "60+ days", color: "#7F1D1D", bg: "#FEE2E2" };
};

export default function OutstandingPage() {
  const [tab, setTab] = useState<Tab>("receivables");
  const data = tab === "receivables" ? receivables : payables;
  const totalOutstanding = data.flatMap((p) => p.invoices).reduce((s, i) => s + i.amount, 0);
  const overdueTotal = data.flatMap((p) => p.invoices).filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Outstanding</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · As on today</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>Export
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border overflow-hidden mb-5 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {(["receivables", "payables"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 text-[13px] font-medium transition-colors"
            style={{ background: tab === t ? "#0E7490" : "#fff", color: tab === t ? "#fff" : "#6B7280" }}>
            {t === "receivables" ? "Receivables (Debtors)" : "Payables (Creditors)"}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>Total Outstanding</div>
          <div className="text-xl font-bold font-mono" style={{ color: "#0E7490" }}>{fmt(totalOutstanding)}</div>
        </div>
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#FECACA" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>Overdue Amount</div>
          <div className="text-xl font-bold font-mono" style={{ color: "#DC2626" }}>{fmt(overdueTotal)}</div>
        </div>
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>No. of Parties</div>
          <div className="text-xl font-bold" style={{ color: "#111827" }}>{data.length}</div>
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={tab} className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Party</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Invoice Ref</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Date</th>
              <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Due Date</th>
              <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Amount</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Age (Days)</th>
              <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((party) =>
              party.invoices.map((inv, j) => {
                const bucket = ageBuckets(inv.age);
                return (
                  <tr key={inv.ref} className="border-b" style={{ borderColor: "#F3F4F6" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    <td className="px-4 py-3">
                      {j === 0 ? <span className="font-medium" style={{ color: "#111827" }}>{party.party}</span> : <span style={{ color: "#9CA3AF" }}>↳</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px]" style={{ color: "#374151" }}>{inv.ref}</td>
                    <td className="px-4 py-3" style={{ color: "#6B7280" }}>{inv.date}</td>
                    <td className="px-4 py-3" style={{ color: inv.status === "overdue" ? "#DC2626" : "#6B7280" }}>{inv.due}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium" style={{ color: "#111827" }}>{fmt(inv.amount)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono font-medium text-[12px]" style={{ color: bucket.color }}>
                        {inv.age > 0 ? `+${inv.age}` : inv.age}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: bucket.bg, color: bucket.color }}>
                        {bucket.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
              <td colSpan={4} className="px-4 py-3 font-semibold text-[13px]" style={{ color: "#111827" }}>Total</td>
              <td className="px-4 py-3 text-right font-bold font-mono text-[14px]" style={{ color: "#0E7490" }}>{fmt(totalOutstanding)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </motion.div>
    </div>
  );
}
