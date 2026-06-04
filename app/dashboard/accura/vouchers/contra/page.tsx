"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

const CASH_BANK = [
  { id: "hdfc", label: "HDFC Bank CC", sub: "Bank Accounts" },
  { id: "sbi", label: "SBI Current Account", sub: "Bank Accounts" },
  { id: "cash", label: "Cash", sub: "Cash-in-Hand" },
  { id: "petty", label: "Petty Cash", sub: "Cash-in-Hand" },
];

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `CTR/25-26/${Math.floor(Math.random() * 900) + 100}`; }

export default function ContraVoucherPage() {
  const router = useRouter();
  const [voucherNo] = useState(genVoucherNo);
  const [date, setDate] = useState(today());
  const [fromLedger, setFromLedger] = useState("");
  const [toLedger, setToLedger] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [saved, setSaved] = useState(false);

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
    if (!fromLedger || !toLedger || !amount) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="p-1.5 rounded-md border hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
        </button>
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "#EFF6FF", color: "#3B82F6" }}>F4</span>
            Contra Voucher
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo} · Cash/Bank transfers only</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher No</label>
              <input readOnly value={voucherNo} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono" style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            </div>
          </div>

          {/* Transfer flow visualization */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <TypeAheadInput label="Transfer From *" placeholder="Cash / Bank to debit..." options={CASH_BANK} value={fromLedger} onChange={setFromLedger} required />
            </div>
            <div className="flex flex-col items-center mt-5">
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#3B82F6" }}>arrow_forward</span>
              <span className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>TRANSFER</span>
            </div>
            <div className="flex-1">
              <TypeAheadInput label="Transfer To *" placeholder="Cash / Bank to credit..." options={CASH_BANK.filter((l) => l.label !== fromLedger)} value={toLedger} onChange={setToLedger} required />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium" style={{ color: "#9CA3AF" }}>₹</span>
              <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-md border text-xl font-mono text-right outline-none focus:border-[#3B82F6]"
                style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Narration</label>
            <textarea rows={2} placeholder="Being cash/bank transfer..." value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
          <div className="flex items-center gap-2">
            {saved && <span className="text-[12px] flex items-center gap-1" style={{ color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Saved!</span>}
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#3B82F6" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>save</span>Save Transfer (Ctrl+A)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
