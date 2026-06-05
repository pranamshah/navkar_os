"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "reconcile" | "import";

export default function BankPage() {
  const [tab, setTab] = useState<Tab>("reconcile");

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Bank Reconciliation</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>HDFC Bank CC · No statement imported yet</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTab("import")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] hover:bg-gray-50" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>upload_file</span>Import Statement
          </button>
        </div>
      </div>

      <div className="flex rounded-lg border overflow-hidden mb-5 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {[{ id: "reconcile" as Tab, label: "Reconcile" }, { id: "import" as Tab, label: "Import CSV/PDF" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-2 text-[13px] font-medium transition-colors"
            style={{ background: tab === t.id ? "#0E7490" : "#fff", color: tab === t.id ? "#fff" : "#6B7280" }}>
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {tab === "reconcile" && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <th className="w-10 px-4 py-2.5" />
                  <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Date</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Description</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Debit</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Credit</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Balance</th>
                  <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <span className="material-symbols-outlined block mb-3 mx-auto" style={{ fontSize: 36, color: "#D1D5DB" }}>account_balance</span>
                    <p className="text-[13px] font-medium" style={{ color: "#374151" }}>No bank transactions imported yet.</p>
                    <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>Import a bank statement to start reconciling.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === "import" && (
          <div className="rounded-xl border p-10 text-center" style={{ background: "#fff", borderColor: "#E5E7EB", borderStyle: "dashed" }}>
            <span className="material-symbols-outlined mb-4 block" style={{ fontSize: 48, color: "#9CA3AF" }}>upload_file</span>
            <h3 className="text-base font-semibold mb-2" style={{ color: "#111827" }}>Import Bank Statement</h3>
            <p className="text-[13px] mb-5" style={{ color: "#6B7280" }}>Supported: CSV from HDFC, SBI, ICICI, Axis · PDF (auto-parsed)</p>
            <button className="px-6 py-3 rounded-lg text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>
              Upload Statement File
            </button>
            <p className="text-[11px] mt-4" style={{ color: "#9CA3AF" }}>Or drag and drop your CSV / PDF here</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
