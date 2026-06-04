"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

const ALL_LEDGERS = [
  { id: "cash", label: "Cash", sub: "Cash-in-Hand" },
  { id: "hdfc", label: "HDFC Bank CC", sub: "Bank Accounts" },
  { id: "sbi", label: "SBI Current Account", sub: "Bank Accounts" },
  { id: "ravi", label: "Ravi Exports Pvt Ltd", sub: "Sundry Debtors" },
  { id: "hdfc_t", label: "HDFC Traders", sub: "Sundry Debtors" },
  { id: "apollo", label: "Apollo World Shipping", sub: "Sundry Creditors" },
  { id: "ocean", label: "Ocean Freight Income", sub: "Sales Accounts" },
  { id: "cfs", label: "CFS Charges", sub: "Direct Expenses" },
  { id: "transport", label: "Transport Charges", sub: "Direct Expenses" },
  { id: "rent", label: "Office Rent", sub: "Indirect Expenses" },
  { id: "cgst", label: "CGST Payable", sub: "Duties & Taxes" },
  { id: "sgst", label: "SGST Payable", sub: "Duties & Taxes" },
  { id: "igst", label: "IGST Payable", sub: "Duties & Taxes" },
  { id: "tds", label: "TDS Payable (194C)", sub: "Duties & Taxes" },
  { id: "capital", label: "Capital Account", sub: "Capital Account" },
  { id: "depreciation", label: "Depreciation", sub: "Indirect Expenses" },
];

interface JournalLine {
  id: number;
  ledger: string;
  drAmount: string;
  crAmount: string;
  narration: string;
}

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `JNL/25-26/${Math.floor(Math.random() * 900) + 100}`; }

export default function JournalVoucherPage() {
  const router = useRouter();
  const [voucherNo] = useState(genVoucherNo);
  const [date, setDate] = useState(today());
  const [narration, setNarration] = useState("");
  const [saved, setSaved] = useState(false);
  const [lines, setLines] = useState<JournalLine[]>([
    { id: 1, ledger: "", drAmount: "", crAmount: "", narration: "" },
    { id: 2, ledger: "", drAmount: "", crAmount: "", narration: "" },
  ]);

  const totalDr = lines.reduce((s, l) => s + (parseFloat(l.drAmount) || 0), 0);
  const totalCr = lines.reduce((s, l) => s + (parseFloat(l.crAmount) || 0), 0);
  const balanced = Math.abs(totalDr - totalCr) < 0.01;

  const addLine = () => setLines((p) => [...p, { id: p.length + 1, ledger: "", drAmount: "", crAmount: "", narration: "" }]);
  const removeLine = (id: number) => setLines((p) => p.filter((l) => l.id !== id));
  const updateLine = (id: number, field: keyof JournalLine, val: string) =>
    setLines((p) => p.map((l) => (l.id === id ? { ...l, [field]: val } : l)));

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") { e.preventDefault(); handleSave(); }
      if (e.ctrlKey && e.key === "q") { e.preventDefault(); router.back(); }
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!balanced || lines.some((l) => !l.ledger)) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-md border hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "#F5F3FF", color: "#7C3AED" }}>F7</span>
              Journal Voucher
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo}</p>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="grid grid-cols-2 gap-5 p-5 border-b" style={{ borderColor: "#F3F4F6" }}>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher No</label>
            <input readOnly value={voucherNo} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono" style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="p-5">
          {/* Column headers */}
          <div className="grid gap-3 mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ gridTemplateColumns: "1fr 140px 140px 1fr auto", color: "#6B7280" }}>
            <span>Ledger</span>
            <span className="text-right">Debit (Dr)</span>
            <span className="text-right">Credit (Cr)</span>
            <span>Narration</span>
            <span />
          </div>

          <div className="space-y-2">
            {lines.map((line) => (
              <div key={line.id} className="grid gap-3 items-start" style={{ gridTemplateColumns: "1fr 140px 140px 1fr auto" }}>
                <TypeAheadInput placeholder="Select ledger..." options={ALL_LEDGERS} value={line.ledger} onChange={(val) => updateLine(line.id, "ledger", val)} />
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: "#059669" }}>₹</span>
                  <input type="number" placeholder="0.00" value={line.drAmount} onChange={(e) => updateLine(line.id, "drAmount", e.target.value)} className="w-full pl-6 pr-2 py-2 rounded-md border text-[13px] text-right outline-none" style={{ borderColor: "#E5E7EB", color: "#059669" }} />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: "#DC2626" }}>₹</span>
                  <input type="number" placeholder="0.00" value={line.crAmount} onChange={(e) => updateLine(line.id, "crAmount", e.target.value)} className="w-full pl-6 pr-2 py-2 rounded-md border text-[13px] text-right outline-none" style={{ borderColor: "#E5E7EB", color: "#DC2626" }} />
                </div>
                <input type="text" placeholder="Narration" value={line.narration} onChange={(e) => updateLine(line.id, "narration", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                <button onClick={() => removeLine(line.id)} disabled={lines.length <= 2} className="p-2 rounded-md hover:bg-red-50 disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#DC2626" }}>remove_circle</span>
                </button>
              </div>
            ))}
          </div>

          <button onClick={addLine} className="mt-3 flex items-center gap-1 text-[12px] px-2 py-1 rounded-md hover:bg-gray-50" style={{ color: "#7C3AED", border: "1px dashed #7C3AED" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Line
          </button>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t grid gap-3" style={{ borderColor: "#F3F4F6", gridTemplateColumns: "1fr 140px 140px 1fr auto" }}>
            <div className="text-[12px] font-semibold text-right col-start-1" style={{ color: "#6B7280" }}>Totals</div>
            <div className="text-right font-bold font-mono text-[15px]" style={{ color: "#059669" }}>
              ₹{totalDr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-right font-bold font-mono text-[15px]" style={{ color: "#DC2626" }}>
              ₹{totalCr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="col-start-4">
              {!balanced && totalDr > 0 && (
                <span className="text-[11px] flex items-center gap-1" style={{ color: "#D97706" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                  Difference: ₹{Math.abs(totalDr - totalCr).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              )}
              {balanced && totalDr > 0 && (
                <span className="text-[11px] flex items-center gap-1" style={{ color: "#059669" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                  Balanced
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher Narration</label>
            <textarea rows={2} placeholder="Being journal entry for..." value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
          <div className="flex items-center gap-2">
            {saved && <span className="text-[12px] flex items-center gap-1" style={{ color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Saved!</span>}
            <button onClick={handleSave} disabled={!balanced && totalDr > 0} className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white disabled:opacity-50" style={{ background: "#7C3AED" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>save</span>Save Journal (Ctrl+A)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
