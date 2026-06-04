"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "reconcile" | "import";

interface BankTxn {
  id: string;
  date: string;
  desc: string;
  debit: number;
  credit: number;
  balance: number;
  matched: boolean;
  suggestion?: string;
}

const bankTxns: BankTxn[] = [
  { id: "b1", date: "2026-06-02", desc: "NEFT/Ravi Exports Pvt Ltd/INV/25-26/064", debit: 0, credit: 49560, balance: 1230800, matched: false, suggestion: "INV/25-26/064 — Ravi Exports (₹49,560)" },
  { id: "b2", date: "2026-06-05", desc: "NEFT/Sakthi Transport/Transport Charges", debit: 59000, credit: 0, balance: 1171800, matched: true },
  { id: "b3", date: "2026-06-08", desc: "NACH/Office Rent/June", debit: 28000, credit: 0, balance: 1143800, matched: true },
  { id: "b4", date: "2026-06-10", desc: "NEFT/Global Impex Pvt Ltd/INV/25-26/071", debit: 0, credit: 59000, balance: 1202800, matched: false, suggestion: "INV/25-26/071 — Global Impex (₹59,000)" },
  { id: "b5", date: "2026-06-12", desc: "CASH WITHDRAWAL/HDFC PETTY CASH", debit: 5000, credit: 0, balance: 1197800, matched: false, suggestion: "Petty Cash withdrawal (Contra)" },
  { id: "b6", date: "2026-06-15", desc: "NEFT/Apollo World Shipping", debit: 74000, credit: 0, balance: 1123800, matched: false, suggestion: "PUR/25-26/031 — Apollo (₹74,000)" },
];

function fmt(n: number) { return n === 0 ? "—" : "₹" + n.toLocaleString("en-IN"); }

export default function BankPage() {
  const [tab, setTab] = useState<Tab>("reconcile");
  const [txns, setTxns] = useState(bankTxns);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const unmatched = txns.filter((t) => !t.matched);
  const unmatchedCount = unmatched.length;

  const toggleMatch = (id: string) => {
    setTxns((prev) => prev.map((t) => t.id === id ? { ...t, matched: !t.matched } : t));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Bank Reconciliation</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>HDFC Bank CC · Last import: 15 Jun 2026</p>
        </div>
        <div className="flex items-center gap-2">
          {unmatchedCount > 0 && (
            <span className="text-[12px] px-3 py-1.5 rounded-md font-medium" style={{ background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}>
              {unmatchedCount} unmatched entries
            </span>
          )}
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
          <div>
            {/* AI suggestion banner */}
            {unmatchedCount > 0 && (
              <div className="rounded-xl border p-4 mb-4 flex items-start gap-3" style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}>
                <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 18, color: "#3B82F6", fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: "#1D4ED8" }}>AI matched {txns.filter((t) => t.suggestion).length} entries</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#3B82F6" }}>Review suggestions below and accept to mark as matched.</div>
                </div>
              </div>
            )}

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
                    <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>AI Suggestion</th>
                    <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((txn) => (
                    <tr key={txn.id} className="border-b" style={{ borderColor: "#F3F4F6", background: txn.matched ? "#F0FDF4" : "transparent" }}>
                      <td className="px-4 py-2.5 text-center">
                        <input type="checkbox" checked={selected.has(txn.id)} onChange={() => toggleSelect(txn.id)} className="w-3.5 h-3.5 rounded" />
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: "#6B7280" }}>{txn.date}</td>
                      <td className="px-4 py-2.5 max-w-xs truncate" style={{ color: "#111827" }}>{txn.desc}</td>
                      <td className="px-4 py-2.5 text-right font-mono" style={{ color: txn.debit > 0 ? "#DC2626" : "#D1D5DB" }}>{fmt(txn.debit)}</td>
                      <td className="px-4 py-2.5 text-right font-mono" style={{ color: txn.credit > 0 ? "#059669" : "#D1D5DB" }}>{fmt(txn.credit)}</td>
                      <td className="px-4 py-2.5 text-right font-mono" style={{ color: "#374151" }}>₹{txn.balance.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2.5">
                        {txn.suggestion && !txn.matched && (
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "#3B82F6" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span>
                            {txn.suggestion}
                          </span>
                        )}
                        {txn.matched && <span className="text-[11px]" style={{ color: "#059669" }}>✓ Matched</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => toggleMatch(txn.id)}
                          className="text-[11px] px-2 py-1 rounded-md font-medium transition-colors"
                          style={txn.matched
                            ? { background: "#F3F4F6", color: "#6B7280" }
                            : txn.suggestion
                              ? { background: "#EFF6FF", color: "#3B82F6", border: "1px solid #BFDBFE" }
                              : { background: "#F9FAFB", color: "#9CA3AF" }
                          }
                        >
                          {txn.matched ? "Unmatch" : txn.suggestion ? "Accept" : "Manual"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
