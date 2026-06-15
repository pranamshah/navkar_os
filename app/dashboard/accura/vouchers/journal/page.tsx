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

interface JournalLine {
  id: number;
  ledgerId: string;
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
  const [saving, setSaving] = useState(false);
  const [ledgerOptions, setLedgerOptions] = useState<LedgerOption[]>([]);
  const [lines, setLines] = useState<JournalLine[]>([
    { id: 1, ledgerId: "", drAmount: "", crAmount: "", narration: "" },
    { id: 2, ledgerId: "", drAmount: "", crAmount: "", narration: "" },
  ]);

  useEffect(() => {
    fetch("/api/accura/ledgers")
      .then((r) => r.json())
      .then(setLedgerOptions)
      .catch(() => {});
  }, []);

  const totalDr = lines.reduce((s, l) => s + (parseFloat(l.drAmount) || 0), 0);
  const totalCr = lines.reduce((s, l) => s + (parseFloat(l.crAmount) || 0), 0);
  const balanced = Math.abs(totalDr - totalCr) < 0.01 && totalDr > 0;

  const addLine = () =>
    setLines((p) => [...p, { id: Date.now(), ledgerId: "", drAmount: "", crAmount: "", narration: "" }]);
  const removeLine = (id: number) =>
    setLines((p) => p.filter((l) => l.id !== id));
  const updateLine = (id: number, field: keyof JournalLine, val: string) =>
    setLines((p) => p.map((l) => (l.id === id ? { ...l, [field]: val } : l)));

  function resetForm() {
    setNarration("");
    setLines([
      { id: 1, ledgerId: "", drAmount: "", crAmount: "", narration: "" },
      { id: 2, ledgerId: "", drAmount: "", crAmount: "", narration: "" },
    ]);
  }

  const handleSave = useCallback(async () => {
    if (!balanced) { alert("Dr total must equal Cr total"); return; }
    const validLines = lines.filter((l) => l.ledgerId);
    if (validLines.length < 2) { alert("Add at least two ledger lines"); return; }

    setSaving(true);
    try {
      const apiLines = validLines.flatMap((l) => {
        const results = [];
        const dr = parseFloat(l.drAmount) || 0;
        const cr = parseFloat(l.crAmount) || 0;
        if (dr > 0) results.push({ ledgerId: l.ledgerId, type: "Dr", amount: dr, narration: l.narration });
        if (cr > 0) results.push({ ledgerId: l.ledgerId, type: "Cr", amount: cr, narration: l.narration });
        return results;
      });

      const res = await fetch("/api/accura/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType: "JOURNAL",
          voucherNo,
          date,
          narration,
          totalAmount: totalDr,
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
  }, [balanced, lines, voucherNo, date, narration, totalDr]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") { e.preventDefault(); handleSave(); }
      if (e.ctrlKey && e.key === "q") { e.preventDefault(); router.back(); }
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleSave, router]);

  const allLedgerOpts = ledgerOptions.length > 0
    ? ledgerOptions.map((l) => ({ id: l.id, label: l.name, sub: l.group?.name ?? "" }))
    : [
        { id: "__cash", label: "Cash", sub: "Cash-in-Hand" },
        { id: "__hdfc", label: "HDFC Bank CC", sub: "Bank Accounts" },
        { id: "__rent", label: "Office Rent", sub: "Indirect Expenses" },
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
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "#F5F3FF", color: "#1E40AF" }}>F7</span>
              Journal Voucher
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
        <div className="grid grid-cols-2 gap-5 p-5 border-b" style={{ borderColor: "#F3F4F6" }}>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher No</label>
            <input readOnly value={voucherNo} className="w-full px-3 py-2 rounded-md border text-[13px] font-mono" style={{ borderColor: "#E5E7EB", background: "#F9FAFB", color: "#111827" }} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
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
                <TypeAheadInput
                  placeholder="Select ledger..."
                  options={allLedgerOpts}
                  value={line.ledgerId}
                  onChange={(val) => updateLine(line.id, "ledgerId", val)}
                />
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: "#059669" }}>₹</span>
                  <input type="number" placeholder="0.00" value={line.drAmount} onChange={(e) => updateLine(line.id, "drAmount", e.target.value)} className="w-full pl-6 pr-2 py-2 rounded-md border text-[13px] text-right outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#059669" }} />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: "#DC2626" }}>₹</span>
                  <input type="number" placeholder="0.00" value={line.crAmount} onChange={(e) => updateLine(line.id, "crAmount", e.target.value)} className="w-full pl-6 pr-2 py-2 rounded-md border text-[13px] text-right outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#DC2626" }} />
                </div>
                <input type="text" placeholder="Narration" value={line.narration} onChange={(e) => updateLine(line.id, "narration", e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                <button onClick={() => removeLine(line.id)} disabled={lines.length <= 2} className="p-2 rounded-md hover:bg-red-50 disabled:opacity-30 transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#DC2626" }}>remove_circle</span>
                </button>
              </div>
            ))}
          </div>

          <button onClick={addLine} className="mt-3 flex items-center gap-1 text-[12px] px-2 py-1 rounded-md hover:bg-gray-50 transition-colors" style={{ color: "#1E40AF", border: "1px dashed #1E40AF" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Add Line
          </button>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t grid gap-3" style={{ borderColor: "#F3F4F6", gridTemplateColumns: "1fr 140px 140px 1fr auto" }}>
            <div className="text-[12px] font-semibold text-right" style={{ color: "#6B7280" }}>Totals</div>
            <div className="text-right font-bold font-mono text-[15px]" style={{ color: "#059669" }}>
              ₹{totalDr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-right font-bold font-mono text-[15px]" style={{ color: "#DC2626" }}>
              ₹{totalCr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div>
              {!balanced && totalDr > 0 && (
                <span className="text-[11px] flex items-center gap-1" style={{ color: "#1E40AF" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                  Difference: ₹{Math.abs(totalDr - totalCr).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              )}
              {balanced && (
                <span className="text-[11px] flex items-center gap-1" style={{ color: "#059669" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                  Balanced
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Voucher Narration</label>
            <textarea rows={2} placeholder="Being journal entry for..." value={narration} onChange={(e) => setNarration(e.target.value)} className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none focus:border-[#1E40AF]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
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
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Journal (Ctrl+A)"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
