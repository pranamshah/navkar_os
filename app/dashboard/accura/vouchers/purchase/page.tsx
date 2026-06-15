"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

interface LedgerOption {
  id: string;
  name: string;
  group: { name: string; nature: string };
}

interface PurchaseLine {
  id: number;
  ledgerId: string;
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
  const [vendorLedgerId, setVendorLedgerId] = useState("");
  const [billRef, setBillRef] = useState("");
  const [billDate, setBillDate] = useState(today());
  const [supplyType, setSupplyType] = useState<"intra" | "inter">("intra");
  const [narration, setNarration] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ledgerOptions, setLedgerOptions] = useState<LedgerOption[]>([]);
  const [lines, setLines] = useState<PurchaseLine[]>([{ id: 1, ledgerId: "", hsn: "", amount: "", gstRate: "18" }]);

  useEffect(() => {
    fetch("/api/accura/ledgers")
      .then((r) => r.json())
      .then(setLedgerOptions)
      .catch(() => {});
  }, []);

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const gstTotal = lines.reduce((s, l) => s + (parseFloat(l.amount) || 0) * (parseFloat(l.gstRate) || 0) / 100, 0);
  const grandTotal = subtotal + gstTotal;

  const addLine = () =>
    setLines((p) => [...p, { id: Date.now(), ledgerId: "", hsn: "", amount: "", gstRate: "18" }]);
  const removeLine = (id: number) => setLines((p) => p.filter((l) => l.id !== id));
  const updateLine = (id: number, field: keyof PurchaseLine, val: string) =>
    setLines((p) => p.map((l) => (l.id === id ? { ...l, [field]: val } : l)));

  function resetForm() {
    setVendorLedgerId("");
    setBillRef("");
    setNarration("");
    setLines([{ id: 1, ledgerId: "", hsn: "", amount: "", gstRate: "18" }]);
  }

  const handleSave = useCallback(async () => {
    if (!vendorLedgerId) { alert("Select a vendor / supplier"); return; }
    const validLines = lines.filter((l) => l.ledgerId && parseFloat(l.amount) > 0);
    if (!validLines.length) { alert("Add at least one expense line"); return; }

    setSaving(true);
    try {
      // Purchase: expense/asset ledger lines as Dr, vendor (supplier) as Cr
      const apiLines: { ledgerId: string; type: string; amount: number; cgst?: number; sgst?: number; igst?: number; narration?: string; }[] = [];

      for (const l of validLines) {
        const rate = parseFloat(l.gstRate) || 0;
        const base = parseFloat(l.amount);
        const gst = base * rate / 100;
        const cgst = supplyType === "intra" ? gst / 2 : 0;
        const sgst = supplyType === "intra" ? gst / 2 : 0;
        const igst = supplyType === "inter" ? gst : 0;
        apiLines.push({ ledgerId: l.ledgerId, type: "Dr", amount: base, cgst, sgst, igst });
      }

      // GST input credit ledgers
      if (supplyType === "intra" && gstTotal > 0) {
        const cgstLedger = ledgerOptions.find((l) => l.name.toLowerCase().includes("cgst input") || l.name.toLowerCase().includes("cgst"));
        const sgstLedger = ledgerOptions.find((l) => l.name.toLowerCase().includes("sgst input") || l.name.toLowerCase().includes("sgst"));
        if (cgstLedger) apiLines.push({ ledgerId: cgstLedger.id, type: "Dr", amount: gstTotal / 2 });
        if (sgstLedger) apiLines.push({ ledgerId: sgstLedger.id, type: "Dr", amount: gstTotal / 2 });
      } else if (supplyType === "inter" && gstTotal > 0) {
        const igstLedger = ledgerOptions.find((l) => l.name.toLowerCase().includes("igst input") || l.name.toLowerCase().includes("igst"));
        if (igstLedger) apiLines.push({ ledgerId: igstLedger.id, type: "Dr", amount: gstTotal });
      }

      // Vendor / supplier as Cr for grand total
      apiLines.push({ ledgerId: vendorLedgerId, type: "Cr", amount: grandTotal, narration: billRef ? `Bill Ref: ${billRef}` : undefined });

      const res = await fetch("/api/accura/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType: "PURCHASE",
          voucherNo,
          date,
          narration,
          totalAmount: grandTotal,
          lines: apiLines,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => { setSaved(false); resetForm(); }, 1500);
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to save");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorLedgerId, lines, voucherNo, date, narration, supplyType, grandTotal, gstTotal, ledgerOptions, billRef]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") { e.preventDefault(); handleSave(); }
      if (e.ctrlKey && e.key === "q") { e.preventDefault(); router.back(); }
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleSave, router]);

  const vendorOpts = ledgerOptions.length > 0
    ? ledgerOptions
        .filter((l) => ["Sundry Creditors"].includes(l.group?.name ?? ""))
        .map((l) => ({ id: l.id, label: l.name, sub: l.group?.name ?? "" }))
    : [
        { id: "__apollo", label: "Apollo World Shipping", sub: "Sundry Creditors" },
        { id: "__sakthi", label: "Sakthi Transport", sub: "Sundry Creditors" },
      ];

  const expenseOpts = ledgerOptions.length > 0
    ? ledgerOptions
        .filter((l) => ["Direct Expenses", "Indirect Expenses", "Fixed Assets"].includes(l.group?.name ?? ""))
        .map((l) => ({ id: l.id, label: l.name, sub: l.group?.name ?? "" }))
    : [
        { id: "__cfs", label: "CFS Charges", sub: "Direct Expenses" },
        { id: "__transport", label: "Transport Charges", sub: "Direct Expenses" },
        { id: "__rent", label: "Office Rent", sub: "Indirect Expenses" },
      ];

  const fmt = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  return (
    <div className="p-6 max-w-5xl" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-md border hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "#FFFBEB", color: "#1E40AF" }}>F9</span>
              Purchase Voucher
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="text-[11px] px-2 py-1 rounded border font-mono" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Ctrl+A Save</kbd>
          <kbd className="text-[11px] px-2 py-1 rounded border font-mono" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Ctrl+Q Cancel</kbd>
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
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <TypeAheadInput label="Vendor *" placeholder="Select vendor..." options={vendorOpts} value={vendorLedgerId} onChange={setVendorLedgerId} required />
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Vendor Bill Ref</label>
            <input type="text" placeholder="Vendor invoice no." value={billRef} onChange={(e) => setBillRef(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Bill Date</label>
            <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="px-5 py-2 border-b flex items-center gap-4" style={{ borderColor: "#F3F4F6" }}>
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Supply Type:</span>
          <div className="flex rounded-md overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
            {(["intra", "inter"] as const).map((t) => (
              <button key={t} onClick={() => setSupplyType(t)} className="px-4 py-1.5 text-[12px] font-medium transition-colors"
                style={{ background: supplyType === t ? "#1E40AF" : "#fff", color: supplyType === t ? "#fff" : "#6B7280" }}>
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
                <TypeAheadInput placeholder="Expense ledger..." options={expenseOpts} value={line.ledgerId} onChange={(val) => updateLine(line.id, "ledgerId", val)} />
                <input type="text" placeholder="996511" value={line.hsn} onChange={(e) => updateLine(line.id, "hsn", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                <input type="number" placeholder="0.00" value={line.amount} onChange={(e) => updateLine(line.id, "amount", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] text-right outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                <select value={line.gstRate} onChange={(e) => updateLine(line.id, "gstRate", e.target.value)} className="w-full px-2 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }}>
                  {["0", "5", "12", "18", "28"].map((r) => <option key={r} value={r}>{r}%</option>)}
                </select>
                <button onClick={() => removeLine(line.id)} disabled={lines.length === 1} className="p-2 rounded-md hover:bg-red-50 disabled:opacity-30 transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#DC2626" }}>remove_circle</span>
                </button>
              </div>
            ))}
          </div>
          <button onClick={addLine} className="mt-3 flex items-center gap-1 text-[12px] px-2 py-1 rounded-md hover:bg-gray-50 transition-colors" style={{ color: "#1E40AF", border: "1px dashed #1E40AF" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Line
          </button>

          <div className="mt-5 pt-4 border-t flex justify-end" style={{ borderColor: "#F3F4F6" }}>
            <div className="w-72 space-y-1.5 text-[13px]">
              <div className="flex justify-between"><span style={{ color: "#6B7280" }}>Subtotal</span><span className="font-mono font-medium">₹{fmt(subtotal)}</span></div>
              <div className="flex justify-between"><span style={{ color: "#6B7280" }}>{supplyType === "intra" ? "CGST + SGST" : "IGST"}</span><span className="font-mono">₹{fmt(gstTotal)}</span></div>
              <div className="flex justify-between pt-2 border-t font-bold text-base" style={{ borderColor: "#E5E7EB" }}>
                <span>Grand Total</span><span className="font-mono" style={{ color: "#1E40AF" }}>₹{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Narration</label>
            <textarea rows={2} placeholder="Being purchase of services from..." value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100 transition-colors" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel (Ctrl+Q)</button>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-[12px] flex items-center gap-1" style={{ color: "#059669" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>
                Saved ✓
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white transition-colors disabled:opacity-70"
              style={{ background: saved ? "#059669" : "#1E40AF" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                {saved ? "check_circle" : "save"}
              </span>
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Purchase (Ctrl+A)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
