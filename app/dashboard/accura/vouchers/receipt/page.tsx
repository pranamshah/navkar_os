"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TypeAheadInput } from "@/components/accura/TypeAheadInput";
import { motion } from "framer-motion";

interface LedgerOption {
  id: string;
  name: string;
  group: { name: string; nature: string };
}

interface VoucherLine {
  id: number;
  ledgerId: string;
  amount: string;
  narration: string;
}

function today() { return new Date().toISOString().split("T")[0]; }
function genVoucherNo() { return `RCT/25-26/${Math.floor(Math.random() * 900) + 100}`; }

export default function ReceiptVoucherPage() {
  const router = useRouter();
  const [voucherNo] = useState(genVoucherNo);
  const [date, setDate] = useState(today());
  const [bankLedgerId, setBankLedgerId] = useState("");
  const [narration, setNarration] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ledgerOptions, setLedgerOptions] = useState<LedgerOption[]>([]);
  const [lines, setLines] = useState<VoucherLine[]>([{ id: 1, ledgerId: "", amount: "", narration: "" }]);

  useEffect(() => {
    fetch("/api/accura/ledgers")
      .then((r) => r.json())
      .then(setLedgerOptions)
      .catch(() => {});
  }, []);

  const totalAmount = lines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);

  const addLine = () => setLines((p) => [...p, { id: Date.now(), ledgerId: "", amount: "", narration: "" }]);
  const removeLine = (id: number) => setLines((p) => p.filter((l) => l.id !== id));
  const updateLine = (id: number, field: keyof VoucherLine, val: string) =>
    setLines((p) => p.map((l) => (l.id === id ? { ...l, [field]: val } : l)));

  function resetForm() {
    setBankLedgerId("");
    setNarration("");
    setLines([{ id: 1, ledgerId: "", amount: "", narration: "" }]);
  }

  const handleSave = async () => {
    if (!bankLedgerId) { alert("Select a bank/cash ledger"); return; }
    const validLines = lines.filter((l) => l.ledgerId && parseFloat(l.amount) > 0);
    if (!validLines.length) { alert("Add at least one receipt line"); return; }

    setSaving(true);
    try {
      const total = validLines.reduce((s, l) => s + parseFloat(l.amount), 0);
      const res = await fetch("/api/accura/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType: "RECEIPT",
          voucherNo,
          date,
          narration,
          totalAmount: total,
          lines: [
            { ledgerId: bankLedgerId, type: "Dr", amount: total },
            ...validLines.map((l) => ({ ledgerId: l.ledgerId, type: "Cr", amount: parseFloat(l.amount), narration: l.narration })),
          ],
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
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") { e.preventDefault(); handleSave(); }
      if (e.ctrlKey && e.key === "q") { e.preventDefault(); router.back(); }
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankLedgerId, lines, narration, date]);

  const bankOptions = ledgerOptions
    .filter((l) => ["Bank Accounts", "Cash-in-Hand"].includes(l.group?.name ?? ""))
    .map((l) => ({ id: l.id, label: l.name, sub: l.group?.name ?? "" }));

  const bankOpts = bankOptions.length > 0 ? bankOptions : [
    { id: "__hdfc", label: "HDFC Bank CC", sub: "Bank Accounts" },
    { id: "__sbi", label: "SBI Current Account", sub: "Bank Accounts" },
    { id: "__cash", label: "Cash", sub: "Cash-in-Hand" },
  ];

  const partyOptions = ledgerOptions
    .filter((l) => !["Bank Accounts", "Cash-in-Hand"].includes(l.group?.name ?? ""))
    .map((l) => ({ id: l.id, label: l.name, sub: l.group?.name ?? "" }));

  const partyOpts = partyOptions.length > 0 ? partyOptions : [
    { id: "__ravi", label: "Ravi Exports Pvt Ltd", sub: "Sundry Debtors" },
    { id: "__ocean", label: "Ocean Freight Income", sub: "Sales Accounts" },
  ];

  return (
    <div className="p-6 max-w-4xl" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-md border hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "#ECFDF5", color: "#059669" }}>F6</span>
              Receipt Voucher
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
        <div className="grid grid-cols-3 gap-5 p-5 border-b" style={{ borderColor: "#F3F4F6" }}>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher No</label>
            <input readOnly value={voucherNo} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono" style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#059669]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
          <TypeAheadInput label="Receive into *" placeholder="Select bank / cash..." options={bankOpts} value={bankLedgerId} onChange={setBankLedgerId} required />
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Receipt From (Cr lines)</h3>
            <button onClick={addLine} className="flex items-center gap-1 text-[12px] px-2 py-1 rounded-md hover:bg-gray-50" style={{ color: "#059669", border: "1px dashed #059669" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Line
            </button>
          </div>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div key={line.id} className="grid gap-3 items-start" style={{ gridTemplateColumns: "1fr 140px 1fr auto" }}>
                <TypeAheadInput placeholder={`Party / income ledger ${i + 1}`} options={partyOpts} value={line.ledgerId} onChange={(val) => updateLine(line.id, "ledgerId", val)} />
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: "#9CA3AF" }}>₹</span>
                  <input type="number" placeholder="0.00" value={line.amount} onChange={(e) => updateLine(line.id, "amount", e.target.value)} className="w-full pl-6 pr-3 py-2 rounded-md border text-[13px] text-right outline-none focus:border-[#059669]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                </div>
                <input type="text" placeholder="Narration (optional)" value={line.narration} onChange={(e) => updateLine(line.id, "narration", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#059669]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                <button onClick={() => removeLine(line.id)} disabled={lines.length === 1} className="p-2 rounded-md hover:bg-red-50 disabled:opacity-30">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#DC2626" }}>remove_circle</span>
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "#6B7280" }}>Total Amount</div>
              <div className="text-2xl font-bold font-mono" style={{ color: "#111827" }}>₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher Narration</label>
            <textarea rows={2} placeholder="Being amount received from..." value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none focus:border-[#059669]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t rounded-b-xl" style={{ borderColor: "#F3F4F6", background: "#F9FAFB" }}>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-md border text-[13px] font-medium hover:bg-gray-100" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>Cancel (Ctrl+Q)</button>
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
              className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white disabled:opacity-70"
              style={{ background: saved ? "#0C6478" : "#059669" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                {saved ? "check_circle" : "save"}
              </span>
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Voucher (Ctrl+A)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
