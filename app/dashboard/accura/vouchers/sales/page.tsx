"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

const PARTY_OPTIONS = [
  { id: "ravi", label: "Ravi Exports Pvt Ltd", sub: "27AABCR1234A1Z5" },
  { id: "hdfc_t", label: "HDFC Traders", sub: "27AAACH1234D1Z2" },
  { id: "global", label: "Global Impex Pvt Ltd", sub: "29AABCG4567B1Z1" },
  { id: "new_party", label: "New Party (Create)", sub: "+" },
];

const INCOME_LEDGERS = [
  { id: "ocean", label: "Ocean Freight Income", sub: "Sales Accounts" },
  { id: "air", label: "Air Freight Income", sub: "Sales Accounts" },
  { id: "doc", label: "Documentation Charges", sub: "Direct Income" },
  { id: "handling", label: "Handling Charges", sub: "Direct Income" },
  { id: "thc", label: "THC Charges", sub: "Direct Income" },
  { id: "agency", label: "Agency Commission", sub: "Direct Income" },
];

interface SalesLine {
  id: number;
  description: string;
  sacCode: string;
  amount: string;
  gstRate: string;
}

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `INV/25-26/${Math.floor(Math.random() * 900) + 100}`; }

function calcGst(amount: number, rate: number) {
  const base = amount;
  const total = base * rate / 100;
  return { cgst: total / 2, sgst: total / 2, igst: 0, total };
}

export default function SalesVoucherPage() {
  const router = useRouter();
  const [voucherNo] = useState(genVoucherNo);
  const [date, setDate] = useState(today());
  const [party, setParty] = useState("");
  const [supplyType, setSupplyType] = useState<"intra" | "inter">("intra");
  const [narration, setNarration] = useState("");
  const [saved, setSaved] = useState(false);
  const [lines, setLines] = useState<SalesLine[]>([
    { id: 1, description: "", sacCode: "996511", amount: "", gstRate: "18" },
  ]);

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const gstSummary = lines.reduce((acc, l) => {
    const { cgst, sgst, igst } = calcGst(parseFloat(l.amount) || 0, parseFloat(l.gstRate) || 0);
    return { cgst: acc.cgst + (supplyType === "intra" ? cgst : 0), sgst: acc.sgst + (supplyType === "intra" ? sgst : 0), igst: acc.igst + (supplyType === "inter" ? igst + cgst + sgst : 0) };
  }, { cgst: 0, sgst: 0, igst: 0 });
  const grandTotal = subtotal + gstSummary.cgst + gstSummary.sgst + gstSummary.igst;

  const addLine = () => setLines((p) => [...p, { id: p.length + 1, description: "", sacCode: "996511", amount: "", gstRate: "18" }]);
  const removeLine = (id: number) => setLines((p) => p.filter((l) => l.id !== id));
  const updateLine = (id: number, field: keyof SalesLine, val: string) =>
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
    if (!party) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "#F5F3FF", color: "#7C3AED" }}>F8</span>
              Sales / Tax Invoice
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo}</p>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        {/* Header fields */}
        <div className="grid grid-cols-4 gap-4 p-5 border-b" style={{ borderColor: "#F3F4F6" }}>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Invoice No</label>
            <input readOnly value={voucherNo} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono" style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <TypeAheadInput label="Party / Customer *" placeholder="Select customer..." options={PARTY_OPTIONS} value={party} onChange={setParty} required />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Supply Type</label>
            <div className="flex rounded-md overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
              {(["intra", "inter"] as const).map((t) => (
                <button key={t} onClick={() => setSupplyType(t)} className="flex-1 py-2 text-[12px] font-medium transition-colors"
                  style={{ background: supplyType === t ? "#0E7490" : "#fff", color: supplyType === t ? "#fff" : "#6B7280" }}>
                  {t === "intra" ? "Intra (CGST+SGST)" : "Inter (IGST)"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="p-5">
          <div className="grid gap-3 mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ gridTemplateColumns: "2fr 1fr 100px 80px auto", color: "#6B7280" }}>
            <span>Description / Service</span><span>SAC Code</span><span className="text-right">Amount (₹)</span><span className="text-right">GST %</span><span />
          </div>
          <div className="space-y-2">
            {lines.map((line) => (
              <div key={line.id} className="grid gap-3 items-start" style={{ gridTemplateColumns: "2fr 1fr 100px 80px auto" }}>
                <TypeAheadInput placeholder="Service / income ledger" options={INCOME_LEDGERS} value={line.description} onChange={(val) => updateLine(line.id, "description", val)} />
                <input type="text" value={line.sacCode} onChange={(e) => updateLine(line.id, "sacCode", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
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
          <button onClick={addLine} className="mt-3 flex items-center gap-1 text-[12px] px-2 py-1 rounded-md hover:bg-gray-50" style={{ color: "#7C3AED", border: "1px dashed #7C3AED" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Service Line
          </button>

          {/* GST Breakdown + Grand Total */}
          <div className="mt-5 pt-4 border-t flex justify-end" style={{ borderColor: "#F3F4F6" }}>
            <div className="w-72 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span style={{ color: "#6B7280" }}>Subtotal</span><span className="font-mono font-medium" style={{ color: "#111827" }}>₹{fmt(subtotal)}</span></div>
              {supplyType === "intra" && gstSummary.cgst > 0 && <>
                <div className="flex justify-between"><span style={{ color: "#6B7280" }}>CGST</span><span className="font-mono" style={{ color: "#111827" }}>₹{fmt(gstSummary.cgst)}</span></div>
                <div className="flex justify-between"><span style={{ color: "#6B7280" }}>SGST</span><span className="font-mono" style={{ color: "#111827" }}>₹{fmt(gstSummary.sgst)}</span></div>
              </>}
              {supplyType === "inter" && gstSummary.igst > 0 && (
                <div className="flex justify-between"><span style={{ color: "#6B7280" }}>IGST</span><span className="font-mono" style={{ color: "#111827" }}>₹{fmt(gstSummary.igst)}</span></div>
              )}
              <div className="flex justify-between pt-2 border-t font-bold text-base" style={{ borderColor: "#E5E7EB", color: "#111827" }}>
                <span>Grand Total</span><span className="font-mono" style={{ color: "#0E7490" }}>₹{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Narration</label>
            <textarea rows={2} placeholder="Being invoice for freight services..." value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
          <div className="flex items-center gap-2">
            {saved && <span className="text-[12px] flex items-center gap-1" style={{ color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Saved!</span>}
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#7C3AED" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>save</span>Save Invoice (Ctrl+A)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
