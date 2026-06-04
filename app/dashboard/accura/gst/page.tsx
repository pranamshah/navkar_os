"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "summary" | "gstr1" | "gstr3b";

const gstr1Invoices = [
  { inv: "INV/25-26/058", date: "2026-05-12", party: "Ravi Exports Pvt Ltd", gstin: "27AABCR1234A1Z5", taxable: 54000, cgst: 4860, sgst: 4860, igst: 0, total: 63720 },
  { inv: "INV/25-26/064", date: "2026-06-01", party: "HDFC Traders", gstin: "27AAACH1234D1Z2", taxable: 42000, cgst: 3780, sgst: 3780, igst: 0, total: 49560 },
  { inv: "INV/25-26/071", date: "2026-06-10", party: "Global Impex Pvt Ltd", gstin: "29AABCG4567B1Z1", taxable: 50000, cgst: 0, sgst: 0, igst: 9000, total: 59000 },
];

const gstr3bData = {
  outward: { taxable: 146000, cgst: 8640, sgst: 8640, igst: 9000 },
  inward: { taxable: 192000, cgst: 12600, sgst: 12600, igst: 0 },
  itcAvailable: { cgst: 12600, sgst: 12600, igst: 0 },
  netPayable: { cgst: 0, sgst: 0, igst: 9000 },
};

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function GSTPage() {
  const [tab, setTab] = useState<Tab>("summary");
  const [period, setPeriod] = useState("June 2026");

  const tabs = [
    { id: "summary" as Tab, label: "GST Summary" },
    { id: "gstr1" as Tab, label: "GSTR-1" },
    { id: "gstr3b" as Tab, label: "GSTR-3B" },
  ];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>GST Module</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>GSTIN: 33AAACN7890F1Z2 · {period}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-1.5 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            {["June 2026", "May 2026", "April 2026"].map((p) => <option key={p}>{p}</option>)}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white" style={{ background: "#0E7490" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>file_upload</span>File on GST Portal
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex rounded-lg border overflow-hidden mb-5 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-2 text-[13px] font-medium transition-colors"
            style={{ background: tab === t.id ? "#0E7490" : "#fff", color: tab === t.id ? "#fff" : "#6B7280" }}>
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        {tab === "summary" && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Outward Supplies", val: fmt(gstr3bData.outward.taxable), sub: `CGST ${fmt(gstr3bData.outward.cgst)} + SGST ${fmt(gstr3bData.outward.sgst)}`, color: "#0E7490", bg: "#ECFEFF" },
                { label: "ITC Available", val: fmt(gstr3bData.itcAvailable.cgst + gstr3bData.itcAvailable.sgst), sub: "Input Tax Credit", color: "#059669", bg: "#ECFDF5" },
                { label: "GST Payable", val: fmt(gstr3bData.netPayable.igst), sub: "IGST after setoff", color: "#DC2626", bg: "#FEF2F2" },
                { label: "Filing Due", val: "20 Jul 2026", sub: "GSTR-3B deadline", color: "#D97706", bg: "#FFFBEB" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                  <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>{kpi.label}</div>
                  <div className="text-xl font-bold font-mono" style={{ color: kpi.color }}>{kpi.val}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{kpi.sub}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>GST Liability Summary — {period}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                      {["", "Taxable Amount", "CGST", "SGST", "IGST", "Total GST"].map((h) => (
                        <th key={h} className="text-right px-3 py-2 first:text-left font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: "#F3F4F6" }}>
                      <td className="px-3 py-2.5 font-medium" style={{ color: "#111827" }}>Outward Supplies (Sales)</td>
                      <td className="px-3 py-2.5 text-right font-mono">{fmt(gstr3bData.outward.taxable)}</td>
                      <td className="px-3 py-2.5 text-right font-mono" style={{ color: "#0E7490" }}>{fmt(gstr3bData.outward.cgst)}</td>
                      <td className="px-3 py-2.5 text-right font-mono" style={{ color: "#0E7490" }}>{fmt(gstr3bData.outward.sgst)}</td>
                      <td className="px-3 py-2.5 text-right font-mono" style={{ color: "#7C3AED" }}>{fmt(gstr3bData.outward.igst)}</td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold">{fmt(gstr3bData.outward.cgst + gstr3bData.outward.sgst + gstr3bData.outward.igst)}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: "#F3F4F6" }}>
                      <td className="px-3 py-2.5 font-medium" style={{ color: "#111827" }}>ITC Available (Purchases)</td>
                      <td className="px-3 py-2.5 text-right font-mono">{fmt(gstr3bData.inward.taxable)}</td>
                      <td className="px-3 py-2.5 text-right font-mono" style={{ color: "#059669" }}>({fmt(gstr3bData.itcAvailable.cgst)})</td>
                      <td className="px-3 py-2.5 text-right font-mono" style={{ color: "#059669" }}>({fmt(gstr3bData.itcAvailable.sgst)})</td>
                      <td className="px-3 py-2.5 text-right font-mono" style={{ color: "#059669" }}>({fmt(gstr3bData.itcAvailable.igst)})</td>
                      <td className="px-3 py-2.5 text-right font-mono font-semibold" style={{ color: "#059669" }}>({fmt(gstr3bData.itcAvailable.cgst + gstr3bData.itcAvailable.sgst)})</td>
                    </tr>
                    <tr style={{ background: "#FFFBEB" }}>
                      <td className="px-3 py-3 font-bold" style={{ color: "#111827" }}>Net GST Payable</td>
                      <td />
                      <td className="px-3 py-3 text-right font-mono font-bold" style={{ color: "#D97706" }}>{fmt(0)}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold" style={{ color: "#D97706" }}>{fmt(0)}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold" style={{ color: "#DC2626" }}>{fmt(gstr3bData.netPayable.igst)}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-[14px]" style={{ color: "#DC2626" }}>{fmt(gstr3bData.netPayable.igst)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "gstr1" && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
              <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>GSTR-1 — Outward Supplies</h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>Download JSON
              </button>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {["Invoice No", "Date", "Customer", "GSTIN", "Taxable", "CGST", "SGST", "IGST", "Total"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-right first:text-left font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gstr1Invoices.map((inv) => (
                  <tr key={inv.inv} className="border-b" style={{ borderColor: "#F3F4F6" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: "#374151" }}>{inv.inv}</td>
                    <td className="px-4 py-2.5" style={{ color: "#6B7280" }}>{inv.date}</td>
                    <td className="px-4 py-2.5 font-medium" style={{ color: "#111827" }}>{inv.party}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px]" style={{ color: "#6B7280" }}>{inv.gstin}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(inv.taxable)}</td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: "#0E7490" }}>{fmt(inv.cgst)}</td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: "#0E7490" }}>{fmt(inv.sgst)}</td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: "#7C3AED" }}>{fmt(inv.igst)}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold" style={{ color: "#111827" }}>{fmt(inv.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "gstr3b" && (
          <div className="space-y-4">
            <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>GSTR-3B — Table 3.1 Outward Supplies</h2>
              <div className="space-y-3 text-[13px]">
                {[
                  { label: "3.1(a) Taxable outward supplies", taxable: gstr3bData.outward.taxable, cgst: gstr3bData.outward.cgst, sgst: gstr3bData.outward.sgst, igst: gstr3bData.outward.igst },
                  { label: "3.1(b) Zero-rated supplies (Exports)", taxable: 0, cgst: 0, sgst: 0, igst: 0 },
                  { label: "3.1(c) Nil rated / Exempt supplies", taxable: 0, cgst: 0, sgst: 0, igst: 0 },
                ].map((row) => (
                  <div key={row.label} className="grid gap-4 items-center py-2 border-b" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", borderColor: "#F3F4F6" }}>
                    <span style={{ color: "#374151" }}>{row.label}</span>
                    <span className="text-right font-mono">{fmt(row.taxable)}</span>
                    <span className="text-right font-mono" style={{ color: "#0E7490" }}>{fmt(row.cgst)}</span>
                    <span className="text-right font-mono" style={{ color: "#0E7490" }}>{fmt(row.sgst)}</span>
                    <span className="text-right font-mono" style={{ color: "#7C3AED" }}>{fmt(row.igst)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Table 4 — Eligible ITC</h2>
              <div className="flex justify-between items-center py-2 text-[13px]">
                <span style={{ color: "#374151" }}>4(a)(5) — All other ITC</span>
                <span className="font-mono font-semibold" style={{ color: "#059669" }}>{fmt(gstr3bData.itcAvailable.cgst + gstr3bData.itcAvailable.sgst)}</span>
              </div>
              <div className="mt-4 p-4 rounded-lg border" style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}>
                <div className="font-semibold text-[14px] flex justify-between" style={{ color: "#D97706" }}>
                  <span>Net Tax Payable after ITC</span>
                  <span className="font-mono">{fmt(gstr3bData.netPayable.igst)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
