"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

const VENDOR_OPTIONS = [
  { id: "apollo", label: "Apollo World Shipping", sub: "27AABCA4321F1Z3" },
  { id: "sakthi", label: "Sakthi Transport", sub: "Sundry Creditors" },
  { id: "cfs_ltd", label: "Chennai CFS Ltd", sub: "33AAACH5678A1Z9" },
  { id: "new_vendor", label: "New Vendor (Create)", sub: "+" },
];

const EXPENSE_LEDGERS = [
  { id: "cfs", label: "CFS Charges", sub: "Direct Expenses" },
  { id: "transport", label: "Transport Charges", sub: "Direct Expenses" },
  { id: "steamer", label: "Steamer Freight", sub: "Direct Expenses" },
  { id: "handling", label: "Port Handling Charges", sub: "Direct Expenses" },
  { id: "rent", label: "Office Rent", sub: "Indirect Expenses" },
  { id: "telephone", label: "Telephone & Internet", sub: "Indirect Expenses" },
  { id: "software", label: "Software Subscription", sub: "Indirect Expenses" },
];

interface PurchaseLine {
  id: number;
  ledger: string;
  hsn: string;
  amount: string;
  gstRate: string;
}

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `PUR/25-26/${Math.floor(Math.random() * 900) + 100}`; }

export default function PurchaseVoucherPage() {
  const router = useRouter();
  const [voucherNo] = useState(genVoucherNo);
  const [date, setDate] = useState(today());
  const [vendor, setVendor] = useState("");
  const [billRef, setBillRef] = useState("");
  const [billDate, setBillDate] = useState(today());
  const [supplyType, setSupplyType] = useState<"intra" | "inter">("intra");
  const [narration, setNarration] = useState("");
  const [saved, setSaved] = useState(false);
  const [lines, setLines] = useState<PurchaseLine[]>([{ id: 1, ledger: "", hsn: "", amount: "", gstRate: "18" }]);

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const gstTotal = lines.reduce((s, l) => s + (parseFloat(l.amount) || 0) * (parseFloat(l.gstRate) || 0) / 100, 0);
  const grandTotal = subtotal + gstTotal;

  const addLine = () => setLines((p) => [...p, { id: p.length + 1, ledger: "", hsn: "", amount: "", gstRate: "18" }]);
  const removeLine = (id: number) => setLines((p) => p.filter((l) => l.id !== id));
  const updateLine = (id: number, field: keyof PurchaseLine, val: string) =>
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

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <div className="p-6 max-w-5xl" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-md border hover:bg-gray-50" style={{ borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "#FFFBEB", color: "#D97706" }}>F9</span>
              Purchase Voucher
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo}</p>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="grid grid-cols-5 gap-4 p-5 border-b" style={{ borderColor: "#F3F4F6" }}>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher No</label>
            <input readOnly value={voucherNo} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono" style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <TypeAheadInput label="Vendor *" placeholder="Select vendor..." options={VENDOR_OPTIONS} value={vendor} onChange={setVendor} required />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Vendor Bill Ref</label>
            <input type="text" placeholder="Vendor invoice no." value={billRef} onChange={(e) => setBillRef(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Bill Date</label>
            <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="px-5 py-2 border-b flex items-center gap-4" style={{ borderColor: "#F3F4F6" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Supply Type:</span>
          <div className="flex rounded-md overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
            {(["intra", "inter"] as const).map((t) => (
              <button key={t} onClick={() => setSupplyType(t)} className="px-4 py-1.5 text-[12px] font-medium transition-colors"
                style={{ background: supplyType === t ? "#D97706" : "#fff", color: supplyType === t ? "#fff" : "#6B7280" }}>
                {t === "intra" ? "Intra-State" : "Inter-State"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ gridTemplateColumns: "2fr 1fr 120px 80px auto", color: "#6B7280" }}>
            <span>Expense Ledger</span><span>HSN/SAC</span><span className="text-right">Amount (₹)</span><span className="text-right">GST %</span><span />
          </div>
          <div className="space-y-2">
            {lines.map((line) => (
              <div key={line.id} className="grid gap-3 items-start" style={{ gridTemplateColumns: "2fr 1fr 120px 80px auto" }}>
                <TypeAheadInput placeholder="Expense ledger..." options={EXPENSE_LEDGERS} value={line.ledger} onChange={(val) => updateLine(line.id, "ledger", val)} />
                <input type="text" placeholder="996511" value={line.hsn} onChange={(e) => updateLine(line.id, "hsn", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                <input type="number" placeholder="0.00" value={line.amount} onChange={(e) => updateLine(line.id, "amount", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] text-right outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                <select value={line.gstRate} onChange={(e) => updateLine(line.id, "gstRate", e.target.value)} className="w-full px-2 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }}>
                  {["0", "5", "12", "18", "28"].map((r) => <option key={r} value={r}>{r}%</option>)}
                </select>
                <button onClick={() => removeLine(line.id)} disabled={lines.length === 1} className="p-2 rounded-md hover:bg-red-50 disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#DC2626" }}>remove_circle</span>
                </button>
              </div>
            ))}
          </div>
          <button onClick={addLine} className="mt-3 flex items-center gap-1 text-[12px] px-2 py-1 rounded-md hover:bg-gray-50" style={{ color: "#D97706", border: "1px dashed #D97706" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Line
          </button>

          <div className="mt-5 pt-4 border-t flex justify-end" style={{ borderColor: "#F3F4F6" }}>
            <div className="w-72 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span style={{ color: "#6B7280" }}>Subtotal</span><span className="font-mono font-medium">₹{fmt(subtotal)}</span></div>
              <div className="flex justify-between"><span style={{ color: "#6B7280" }}>{supplyType === "intra" ? "CGST + SGST" : "IGST"}</span><span className="font-mono">₹{fmt(gstTotal)}</span></div>
              <div className="flex justify-between pt-2 border-t font-bold text-base" style={{ borderColor: "#E5E7EB" }}>
                <span>Grand Total</span><span className="font-mono" style={{ color: "#D97706" }}>₹{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Narration</label>
            <textarea rows={2} placeholder="Being purchase of services from..." value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
          <div className="flex items-center gap-2">
            {saved && <span className="text-[12px] flex items-center gap-1" style={{ color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Saved!</span>}
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#D97706" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>save</span>Save Purchase (Ctrl+A)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
