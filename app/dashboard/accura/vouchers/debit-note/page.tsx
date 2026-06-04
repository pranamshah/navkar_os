"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

const VENDOR_OPTIONS = [
  { id: "apollo", label: "Apollo World Shipping", sub: "Sundry Creditors" },
  { id: "sakthi", label: "Sakthi Transport", sub: "Sundry Creditors" },
  { id: "cfs_ltd", label: "Chennai CFS Ltd", sub: "Sundry Creditors" },
];

const EXPENSE_LEDGERS = [
  { id: "cfs", label: "CFS Charges", sub: "Direct Expenses" },
  { id: "transport", label: "Transport Charges", sub: "Direct Expenses" },
  { id: "steamer", label: "Steamer Freight", sub: "Direct Expenses" },
];

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `DN/25-26/${Math.floor(Math.random() * 900) + 100}`; }

export default function DebitNotePage() {
  const router = useRouter();
  const [voucherNo] = useState(genVoucherNo);
  const [date, setDate] = useState(today());
  const [party, setParty] = useState("");
  const [originalInvoice, setOriginalInvoice] = useState("");
  const [ledger, setLedger] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") { e.preventDefault(); handleSave(); }
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const gstAmt = (parseFloat(amount) || 0) * 0.18;
  const total = (parseFloat(amount) || 0) + gstAmt;

  return (
    <div className="p-6 max-w-2xl" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="p-1.5 rounded-md border hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
        </button>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "#111827" }}>Debit Note</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo} · Purchase return / vendor deduction</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Note No</label>
              <input readOnly value={voucherNo} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono" style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Original Bill Ref</label>
              <input type="text" placeholder="PUR/25-26/..." value={originalInvoice} onChange={(e) => setOriginalInvoice(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            </div>
          </div>

          <TypeAheadInput label="Vendor *" placeholder="Select vendor..." options={VENDOR_OPTIONS} value={party} onChange={setParty} required />
          <TypeAheadInput label="Expense Ledger *" placeholder="Ledger to reduce..." options={EXPENSE_LEDGERS} value={ledger} onChange={setLedger} required />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Base Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }}>₹</span>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-7 pr-3 py-2 rounded-md border text-[13px] text-right outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
              </div>
            </div>
            <div className="rounded-md p-3 border" style={{ borderColor: "#FDE68A", background: "#FFFBEB" }}>
              <div className="text-[11px] mb-1" style={{ color: "#D97706" }}>GST @18%: ₹{gstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
              <div className="text-base font-bold" style={{ color: "#111827" }}>Total: ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Reason for Debit Note</label>
            <textarea rows={2} placeholder="Short deduction / return..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
          <div className="flex items-center gap-2">
            {saved && <span className="text-[12px] flex items-center gap-1" style={{ color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Saved!</span>}
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#D97706" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>save</span>Save Debit Note
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
