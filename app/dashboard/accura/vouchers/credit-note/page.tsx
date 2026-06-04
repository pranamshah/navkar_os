"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

const CUSTOMER_OPTIONS = [
  { id: "ravi", label: "Ravi Exports Pvt Ltd", sub: "Sundry Debtors" },
  { id: "hdfc_t", label: "HDFC Traders", sub: "Sundry Debtors" },
  { id: "global", label: "Global Impex Pvt Ltd", sub: "Sundry Debtors" },
];

const INCOME_LEDGERS = [
  { id: "ocean", label: "Ocean Freight Income", sub: "Sales Accounts" },
  { id: "air", label: "Air Freight Income", sub: "Sales Accounts" },
  { id: "doc", label: "Documentation Charges", sub: "Direct Income" },
];

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `CN/25-26/${Math.floor(Math.random() * 900) + 100}`; }

export default function CreditNotePage() {
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
          <h1 className="text-lg font-semibold" style={{ color: "#111827" }}>Credit Note</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo} · Sales return / customer credit</p>
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
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Original Invoice Ref</label>
              <input type="text" placeholder="INV/25-26/..." value={originalInvoice} onChange={(e) => setOriginalInvoice(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            </div>
          </div>

          <TypeAheadInput label="Customer *" placeholder="Select customer..." options={CUSTOMER_OPTIONS} value={party} onChange={setParty} required />
          <TypeAheadInput label="Income Ledger *" placeholder="Ledger to reduce..." options={INCOME_LEDGERS} value={ledger} onChange={setLedger} required />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Base Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }}>₹</span>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-7 pr-3 py-2 rounded-md border text-[13px] text-right outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
              </div>
            </div>
            <div className="rounded-md p-3 border" style={{ borderColor: "#A5F3FC", background: "#ECFEFF" }}>
              <div className="text-[11px] mb-1" style={{ color: "#0E7490" }}>GST @18%: ₹{gstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
              <div className="text-base font-bold" style={{ color: "#111827" }}>Total Credit: ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Reason for Credit Note</label>
            <textarea rows={2} placeholder="Sales return / discount given..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
          <div className="flex items-center gap-2">
            {saved && <span className="text-[12px] flex items-center gap-1" style={{ color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Saved!</span>}
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>save</span>Save Credit Note
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
