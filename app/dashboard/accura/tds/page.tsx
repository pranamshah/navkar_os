"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tdsEntries = [
  { party: "Sakthi Transport", section: "194C", nature: "Contractor payment", amount: 54000, rate: 2, tdsAmt: 1080, month: "April 2026", deposited: true, challanNo: "BSR/041026/00234" },
  { party: "Sakthi Transport", section: "194C", nature: "Contractor payment", amount: 50000, rate: 2, tdsAmt: 1000, month: "May 2026", deposited: true, challanNo: "BSR/051026/00318" },
  { party: "Office Rent (Landlord)", section: "194I", nature: "Rent", amount: 28000, rate: 10, tdsAmt: 2800, month: "April 2026", deposited: true, challanNo: "BSR/041026/00235" },
  { party: "Office Rent (Landlord)", section: "194I", nature: "Rent", amount: 28000, rate: 10, tdsAmt: 2800, month: "May 2026", deposited: false, challanNo: "" },
  { party: "Apollo World Shipping", section: "194C", nature: "Contractor payment", amount: 74000, rate: 2, tdsAmt: 1480, month: "June 2026", deposited: false, challanNo: "" },
];

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function TDSPage() {
  const [tab, setTab] = useState<"register" | "deposit">("register");
  const pendingDeposit = tdsEntries.filter((e) => !e.deposited);
  const totalPending = pendingDeposit.reduce((s, e) => s + e.tdsAmt, 0);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>TDS Management</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>TAN: CHEN12345A</p>
        </div>
        <div className="flex items-center gap-2">
          {totalPending > 0 && (
            <span className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md font-medium" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
              {fmt(totalPending)} pending deposit
            </span>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white" style={{ background: "#0E7490" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>New TDS Entry
          </button>
        </div>
      </div>

      <div className="flex rounded-lg border overflow-hidden mb-5 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {[{ id: "register" as const, label: "TDS Register" }, { id: "deposit" as const, label: `Pending Deposit (${pendingDeposit.length})` }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-2 text-[13px] font-medium transition-colors"
            style={{ background: tab === t.id ? "#0E7490" : "#fff", color: tab === t.id ? "#fff" : "#6B7280" }}>
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {tab === "register" && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {["Party", "Section", "Nature", "Month", "Payment Amt", "Rate", "TDS Deducted", "Deposited", "Challan No"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tdsEntries.map((e, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: "#F3F4F6" }}
                    onMouseEnter={(ev) => ((ev.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(ev) => ((ev.currentTarget as HTMLElement).style.background = "transparent")}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: "#111827" }}>{e.party}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium" style={{ background: "#ECFEFF", color: "#0E7490" }}>{e.section}</span>
                    </td>
                    <td className="px-4 py-2.5" style={{ color: "#6B7280" }}>{e.nature}</td>
                    <td className="px-4 py-2.5" style={{ color: "#374151" }}>{e.month}</td>
                    <td className="px-4 py-2.5 font-mono">{fmt(e.amount)}</td>
                    <td className="px-4 py-2.5 font-mono">{e.rate}%</td>
                    <td className="px-4 py-2.5 font-mono font-semibold" style={{ color: "#DC2626" }}>{fmt(e.tdsAmt)}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: e.deposited ? "#059669" : "#D97706" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{e.deposited ? "check_circle" : "pending"}</span>
                        {e.deposited ? "Deposited" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px]" style={{ color: "#374151" }}>{e.challanNo || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "deposit" && (
          <div className="space-y-4">
            <div className="rounded-xl border p-4" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 20, color: "#DC2626", fontVariationSettings: "'FILL' 1" }}>warning</span>
                <div>
                  <div className="font-semibold text-[13px]" style={{ color: "#DC2626" }}>TDS deposit required by 7th of next month</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>Total pending: {fmt(totalPending)} across {pendingDeposit.length} entries</div>
                </div>
              </div>
            </div>
            {pendingDeposit.map((e, i) => (
              <div key={i} className="rounded-xl border p-4 flex items-center justify-between" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <div>
                  <div className="font-medium text-[13px]" style={{ color: "#111827" }}>{e.party}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>{e.section} · {e.nature} · {e.month}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px]" style={{ color: "#6B7280" }}>TDS Amount</div>
                    <div className="font-bold font-mono text-[15px]" style={{ color: "#DC2626" }}>{fmt(e.tdsAmt)}</div>
                  </div>
                  <button className="px-4 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>Mark Deposited</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
