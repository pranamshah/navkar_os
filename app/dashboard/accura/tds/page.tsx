"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const tdsEntries: never[] = [];

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function TDSPage() {
  const [tab, setTab] = useState<"register" | "deposit">("register");
  const pendingDeposit: never[] = [];
  const totalPending = 0;

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
                {tdsEntries.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <span className="material-symbols-outlined block mb-3 mx-auto" style={{ fontSize: 36, color: "#D1D5DB" }}>receipt</span>
                      <p className="text-[13px] font-medium" style={{ color: "#374151" }}>No TDS entries yet</p>
                      <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>Add a TDS entry to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "deposit" && (
          <div className="space-y-4">
            <div className="rounded-xl border p-12 text-center" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <span className="material-symbols-outlined block mb-3" style={{ fontSize: 36, color: "#D1D5DB" }}>pending_actions</span>
              <p className="text-[13px] font-medium" style={{ color: "#374151" }}>No pending deposits</p>
              <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>All TDS deposits are up to date.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
