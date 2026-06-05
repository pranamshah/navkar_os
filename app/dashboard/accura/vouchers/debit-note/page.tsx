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

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `DN/25-26/${Math.floor(Math.random() * 900) + 100}`; }

export default function DebitNotePage() {
  const router = useRouter();
  const [voucherNo] = useState(genVoucherNo);
  const [date, setDate] = useState(today());
  const [partyLedgerId, setPartyLedgerId] = useState("");
  const [returnLedgerId, setReturnLedgerId] = useState("");
  const [originalInvoice, setOriginalInvoice] = useState("");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [supplyType, setSupplyType] = useState<"intra" | "inter">("intra");
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ledgerOptions, setLedgerOptions] = useState<LedgerOption[]>([]);

  useEffect(() => {
    fetch("/api/accura/ledgers")
      .then((r) => r.json())
      .then(setLedgerOptions)
      .catch(() => {});
  }, []);

  const baseAmt = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;
  const gstAmt = baseAmt * rate / 100;
  const cgst = supplyType === "intra" ? gstAmt / 2 : 0;
  const sgst = supplyType === "intra" ? gstAmt / 2 : 0;
  const igst = supplyType === "inter" ? gstAmt : 0;
  const total = baseAmt + gstAmt;

  function resetForm() {
    setPartyLedgerId("");
    setReturnLedgerId("");
    setOriginalInvoice("");
    setAmount("");
    setReason("");
  }

  const handleSave = useCallback(async () => {
    if (!partyLedgerId) { alert("Select a vendor / party"); return; }
    if (!returnLedgerId) { alert("Select the expense/return ledger"); return; }
    if (!baseAmt || baseAmt <= 0) { alert("Enter a valid amount"); return; }

    setSaving(true);
    try {
      // Debit Note: Party (vendor) Dr, expense/return ledger Cr, GST ledgers Cr
      const apiLines: { ledgerId: string; type: string; amount: number; cgst?: number; sgst?: number; igst?: number; narration?: string; }[] = [];

      // Party as Dr (total incl. GST)
      apiLines.push({ ledgerId: partyLedgerId, type: "Dr", amount: total, narration: originalInvoice ? `Ref: ${originalInvoice}` : undefined });

      // Return/expense ledger as Cr (base amount)
      apiLines.push({ ledgerId: returnLedgerId, type: "Cr", amount: baseAmt, cgst, sgst, igst });

      // GST ledgers as Cr
      if (supplyType === "intra" && cgst > 0) {
        const cgstLedger = ledgerOptions.find((l) => l.name.toLowerCase().includes("cgst"));
        const sgstLedger = ledgerOptions.find((l) => l.name.toLowerCase().includes("sgst"));
        if (cgstLedger) apiLines.push({ ledgerId: cgstLedger.id, type: "Cr", amount: cgst });
        if (sgstLedger) apiLines.push({ ledgerId: sgstLedger.id, type: "Cr", amount: sgst });
      } else if (supplyType === "inter" && igst > 0) {
        const igstLedger = ledgerOptions.find((l) => l.name.toLowerCase().includes("igst"));
        if (igstLedger) apiLines.push({ ledgerId: igstLedger.id, type: "Cr", amount: igst });
      }

      const res = await fetch("/api/accura/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType: "DEBIT_NOTE",
          voucherNo,
          date,
          narration: reason,
          totalAmount: total,
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
  }, [partyLedgerId, returnLedgerId, baseAmt, total, cgst, sgst, igst, supplyType, voucherNo, date, reason, originalInvoice, ledgerOptions]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") { e.preventDefault(); handleSave(); }
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
        .filter((l) => ["Direct Expenses", "Indirect Expenses", "Purchase Accounts"].includes(l.group?.name ?? ""))
        .map((l) => ({ id: l.id, label: l.name, sub: l.group?.name ?? "" }))
    : [
        { id: "__cfs", label: "CFS Charges", sub: "Direct Expenses" },
        { id: "__transport", label: "Transport Charges", sub: "Direct Expenses" },
      ];

  return (
    <div className="p-6 max-w-2xl" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-md border hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#111827" }}>Debit Note</h1>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{voucherNo} · Purchase return / vendor deduction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="text-[11px] px-2 py-1 rounded border font-mono" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Ctrl+A Save</kbd>
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
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#D97706]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Original Bill Ref</label>
              <input type="text" placeholder="PUR/25-26/..." value={originalInvoice} onChange={(e) => setOriginalInvoice(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#D97706]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
            </div>
          </div>

          <TypeAheadInput label="Vendor / Party (Dr) *" placeholder="Select vendor..." options={vendorOpts} value={partyLedgerId} onChange={setPartyLedgerId} required />
          <TypeAheadInput label="Expense / Return Ledger (Cr) *" placeholder="Ledger to reduce..." options={expenseOpts} value={returnLedgerId} onChange={setReturnLedgerId} required />

          {/* Supply Type */}
          <div className="flex items-center gap-4">
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Base Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }}>₹</span>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-7 pr-3 py-2 rounded-md border text-[13px] text-right outline-none focus:border-[#D97706]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>GST Rate</label>
              <select value={gstRate} onChange={(e) => setGstRate(e.target.value)} className="w-full px-2 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#111827" }}>
                {["0", "5", "12", "18", "28"].map((r) => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>
            <div className="rounded-md p-3 border" style={{ borderColor: "#FDE68A", background: "#FFFBEB" }}>
              <div className="text-[11px] mb-1" style={{ color: "#D97706" }}>
                GST: ₹{gstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-base font-bold" style={{ color: "#111827" }}>
                Total: ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Reason for Debit Note</label>
            <textarea rows={2} placeholder="Short deduction / return reason..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none focus:border-[#D97706]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100 transition-colors" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel</button>
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
              style={{ background: saved ? "#059669" : "#0E7490" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                {saved ? "check_circle" : "save"}
              </span>
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Debit Note (Ctrl+A)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
