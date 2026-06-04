"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type VoucherType = "PAYMENT" | "RECEIPT" | "JOURNAL" | "SALES" | "PURCHASE" | "CONTRA";

interface Voucher {
  id: string;
  date: string;
  type: VoucherType;
  number: string;
  party: string;
  drAmount: number;
  crAmount: number;
  narration: string;
}

const voucherTypeColors: Record<VoucherType, { text: string; bg: string; border: string }> = {
  PAYMENT:  { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  RECEIPT:  { text: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  JOURNAL:  { text: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  SALES:    { text: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC" },
  PURCHASE: { text: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  CONTRA:   { text: "#374151", bg: "#F3F4F6", border: "#E5E7EB" },
};

const vouchers: Voucher[] = [
  { id: "1",  date: "01 Jun 2026", type: "RECEIPT",  number: "RCP-001", party: "Ravi Exports Pvt Ltd",  drAmount: 48000,  crAmount: 0,      narration: "Receipt against invoice INV-042" },
  { id: "2",  date: "01 Jun 2026", type: "PAYMENT",  number: "PMT-001", party: "Sakthi Transport",      drAmount: 0,      crAmount: 28000,  narration: "Transport charges May 2026" },
  { id: "3",  date: "02 Jun 2026", type: "SALES",    number: "INV-043", party: "Global Impex Pvt Ltd",  drAmount: 50000,  crAmount: 0,      narration: "Ocean freight Singapore - Jun" },
  { id: "4",  date: "03 Jun 2026", type: "PURCHASE", number: "PUR-012", party: "Apollo World Shipping", drAmount: 0,      crAmount: 36000,  narration: "CFS charges INV/APL/2026/312" },
  { id: "5",  date: "04 Jun 2026", type: "JOURNAL",  number: "JNL-008", party: "CGST Payable",          drAmount: 15000,  crAmount: 15000,  narration: "GST payable adjustment - May output" },
  { id: "6",  date: "05 Jun 2026", type: "PAYMENT",  number: "PMT-002", party: "Office Rent",           drAmount: 0,      crAmount: 28000,  narration: "June 2026 rent — Andheri East" },
  { id: "7",  date: "05 Jun 2026", type: "RECEIPT",  number: "RCP-002", party: "HDFC Traders",          drAmount: 0,      crAmount: 0,      narration: "Part payment — pending" },
  { id: "8",  date: "07 Jun 2026", type: "SALES",    number: "INV-044", party: "Ravi Exports Pvt Ltd",  drAmount: 72000,  crAmount: 0,      narration: "Air freight Dubai - Jun" },
  { id: "9",  date: "08 Jun 2026", type: "CONTRA",   number: "CTR-003", party: "HDFC Bank CC",          drAmount: 100000, crAmount: 100000, narration: "Cash deposited to HDFC bank" },
  { id: "10", date: "10 Jun 2026", type: "PAYMENT",  number: "PMT-003", party: "Staff Salary",          drAmount: 0,      crAmount: 144000, narration: "Salary June 2026 — 6 employees" },
  { id: "11", date: "11 Jun 2026", type: "PURCHASE", number: "PUR-013", party: "Apollo World Shipping", drAmount: 0,      crAmount: 38000,  narration: "Steamer freight charges — Jun" },
  { id: "12", date: "13 Jun 2026", type: "JOURNAL",  number: "JNL-009", party: "Depreciation",          drAmount: 12000,  crAmount: 12000,  narration: "Monthly depreciation on fixed assets" },
  { id: "13", date: "15 Jun 2026", type: "RECEIPT",  number: "RCP-003", party: "Global Impex Pvt Ltd",  drAmount: 50000,  crAmount: 0,      narration: "Full payment against INV-043" },
  { id: "14", date: "18 Jun 2026", type: "SALES",    number: "INV-045", party: "Ocean Freight Co.",     drAmount: 88000,  crAmount: 0,      narration: "Monthly consolidated freight invoice" },
  { id: "15", date: "20 Jun 2026", type: "PAYMENT",  number: "PMT-004", party: "Software Subscription", drAmount: 0,      crAmount: 18200,  narration: "Annual Tally + NavkarOS subscription" },
  { id: "16", date: "22 Jun 2026", type: "PAYMENT",  number: "PMT-005", party: "TDS Payable (194C)",    drAmount: 0,      crAmount: 8200,   narration: "TDS deposit HDFC challan 192845" },
  { id: "17", date: "28 Jun 2026", type: "RECEIPT",  number: "RCP-004", party: "Documentation Charges", drAmount: 12000,  crAmount: 0,      narration: "Doc charges collected from various parties" },
];

const allTypes: (VoucherType | "ALL")[] = ["ALL", "PAYMENT", "RECEIPT", "SALES", "PURCHASE", "JOURNAL", "CONTRA"];

function fmt(n: number) {
  if (!n) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

export default function DayBookPage() {
  const [typeFilter, setTypeFilter] = useState<VoucherType | "ALL">("ALL");

  const filtered = typeFilter === "ALL" ? vouchers : vouchers.filter((v) => v.type === typeFilter);
  const totalDr = filtered.reduce((s, v) => s + v.drAmount, 0);
  const totalCr = filtered.reduce((s, v) => s + v.crAmount, 0);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Day Book</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>All vouchers · June 2026</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] cursor-pointer" style={{ borderColor: "#E5E7EB", background: "#fff", color: "#374151" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#6B7280" }}>calendar_month</span>
            <span>01 Jun 2026</span>
            <span style={{ color: "#9CA3AF" }}>→</span>
            <span>30 Jun 2026</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white" style={{ background: "#0E7490" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Voucher
          </button>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 mb-4">
        {allTypes.map((t) => {
          const isActive = typeFilter === t;
          const c = t === "ALL" ? null : voucherTypeColors[t];
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t as VoucherType | "ALL")}
              className="px-3 py-1 rounded-full text-[12px] font-medium border transition-all"
              style={{
                background: isActive ? (c?.bg || "#111827") : "#fff",
                color: isActive ? (c?.text || "#fff") : "#6B7280",
                borderColor: isActive ? (c?.border || "#111827") : "#E5E7EB",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Date", "Type", "Number", "Party / Account", "Dr Amount", "Cr Amount", "Narration", "Actions"].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide ${i >= 4 && i <= 5 ? "text-right" : i === 6 ? "text-left" : "text-left"}`}
                  style={{ color: "#6B7280" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => {
              const tc = voucherTypeColors[v.type];
              return (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b group cursor-pointer"
                  style={{ borderColor: "#F3F4F6" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td className="px-4 py-2.5 text-[12px]" style={{ color: "#6B7280" }}>{v.date}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                    >
                      {v.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: "#374151" }}>{v.number}</td>
                  <td className="px-4 py-2.5 font-medium" style={{ color: "#111827" }}>{v.party}</td>
                  <td className="px-4 py-2.5 text-right font-mono" style={{ color: v.drAmount ? "#059669" : "#D1D5DB" }}>
                    {fmt(v.drAmount)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono" style={{ color: v.crAmount ? "#DC2626" : "#D1D5DB" }}>
                    {fmt(v.crAmount)}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] max-w-xs truncate" style={{ color: "#6B7280" }}>{v.narration}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#6B7280" }}>edit</span>
                      </button>
                      <button className="p-1 rounded hover:bg-red-50" title="Alt+D to delete">
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#DC2626" }}>delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
          {/* Totals row */}
          <tfoot>
            <tr style={{ background: "#F9FAFB", borderTop: "2px solid #E5E7EB" }}>
              <td colSpan={4} className="px-4 py-2.5 text-[12px] font-semibold" style={{ color: "#374151" }}>
                Total ({filtered.length} vouchers)
              </td>
              <td className="px-4 py-2.5 text-right font-mono font-bold" style={{ color: "#059669" }}>
                {"₹" + totalDr.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-2.5 text-right font-mono font-bold" style={{ color: "#DC2626" }}>
                {"₹" + totalCr.toLocaleString("en-IN")}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Shortcut hint */}
      <div className="mt-3 text-[11px]" style={{ color: "#9CA3AF" }}>
        <kbd className="px-1.5 py-0.5 rounded border font-mono" style={{ borderColor: "#E5E7EB" }}>Alt+D</kbd> Delete selected voucher
      </div>
    </div>
  );
}
