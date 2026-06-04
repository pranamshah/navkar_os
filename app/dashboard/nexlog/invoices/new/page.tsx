"use client";

import { useState } from "react";

type Row = { sac: string; desc: string; units: number; rate: number; taxType: "IGST" | "CGST+SGST"; taxPct: number };

const initial: Row[] = [
  { sac: "996712", desc: "Ocean Freight - Shanghai to JNPT 1x40HC", units: 1, rate: 142000, taxType: "IGST", taxPct: 5 },
  { sac: "996791", desc: "Terminal Handling Charges JNPT", units: 1, rate: 18500, taxType: "CGST+SGST", taxPct: 18 },
  { sac: "996713", desc: "CHA Service Fee", units: 1, rate: 12000, taxType: "CGST+SGST", taxPct: 18 },
];

function inWords(n: number): string {
  if (n === 0) return "Zero";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const num = (n: number): string => n < 20 ? a[n] : n < 100 ? b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "") : a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + num(n % 100) : "");
  const cr = Math.floor(n / 10000000); n %= 10000000;
  const lk = Math.floor(n / 100000); n %= 100000;
  const th = Math.floor(n / 1000); n %= 1000;
  return [cr && num(cr) + " Crore", lk && num(lk) + " Lakh", th && num(th) + " Thousand", n && num(n)].filter(Boolean).join(" ") + " Rupees Only";
}

export default function NewInvoicePage() {
  const [rows, setRows] = useState<Row[]>(initial);

  const updateRow = (i: number, k: keyof Row, v: string | number) => {
    const copy = [...rows];
    (copy[i] as Record<string, string | number>)[k as string] = v;
    setRows(copy);
  };

  const subtotal = rows.reduce((s, r) => s + r.units * r.rate, 0);
  const igstTotal = rows.filter((r) => r.taxType === "IGST").reduce((s, r) => s + (r.units * r.rate * r.taxPct) / 100, 0);
  const cgstTotal = rows.filter((r) => r.taxType === "CGST+SGST").reduce((s, r) => s + (r.units * r.rate * r.taxPct) / 200, 0);
  const sgstTotal = cgstTotal;
  const grandTotal = Math.round(subtotal + igstTotal + cgstTotal + sgstTotal);

  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Create Tax Invoice</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Indian freight invoice · GST-compliant · SAC code based</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md border text-[13px] font-medium" style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}>Preview</button>
          <button className="px-4 py-2 rounded-md border text-[13px] font-medium" style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}>Save Draft</button>
          <button className="px-4 py-2 rounded-md text-[13px] font-semibold text-white" style={{ background: "#1565C0" }}>Finalize</button>
        </div>
      </div>

      <div className="rounded-xl border p-6" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        {/* Invoice Header */}
        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: "#6B7280" }}>From</div>
            <div className="text-[15px] font-bold" style={{ color: "#111827" }}>Navkar Freight Co.</div>
            <div className="text-[12px] mt-1 leading-relaxed" style={{ color: "#6B7280" }}>
              CFS Road, Sector 12, Nhava Sheva<br />
              Navi Mumbai, MH 400707<br />
              GSTIN: 27AAACN1234F1Z5 · PAN: AAACN1234F<br />
              IEC: 0312012345 · CIN: U63090MH2018PTC312345
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: "#6B7280" }}>Bill To</div>
            <select className="text-[15px] font-bold w-full bg-transparent outline-none" style={{ color: "#111827" }}>
              <option>Ravi Exports Pvt Ltd</option>
            </select>
            <div className="text-[12px] mt-1 leading-relaxed" style={{ color: "#6B7280" }}>
              Plot 42, MIDC, Bhosari<br />
              Pune, MH 411019<br />
              GSTIN: 27AAACR5678G1Z8 · State: 27-Maharashtra
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div><label className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "#6B7280" }}>Invoice No</label><div className="text-[13px] font-mono font-semibold mt-1" style={{ color: "#1565C0" }}>INV-2026-0143</div></div>
          <div><label className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "#6B7280" }}>Date</label><input type="date" defaultValue="2026-06-04" className="text-[13px] mt-1 outline-none bg-transparent" style={{ color: "#111827" }} /></div>
          <div><label className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "#6B7280" }}>Job No</label><div className="text-[13px] font-mono font-semibold mt-1" style={{ color: "#1565C0" }}>IMP/2526/089</div></div>
          <div><label className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "#6B7280" }}>Due Date</label><input type="date" defaultValue="2026-07-04" className="text-[13px] mt-1 outline-none bg-transparent" style={{ color: "#111827" }} /></div>
        </div>

        {/* Charges Table */}
        <table className="w-full text-[12px] mb-4">
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
              {["SAC", "Description", "Units", "Rate", "Taxable", "Tax Type", "Tax %", "Tax Amt", "Total", ""].map((h) => (
                <th key={h} className="text-left py-2 px-2 font-semibold text-[10px] uppercase" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const taxable = r.units * r.rate;
              const taxAmt = (taxable * r.taxPct) / 100;
              return (
                <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td className="py-2 px-2"><input value={r.sac} onChange={(e) => updateRow(i, "sac", e.target.value)} className="w-20 text-[12px] outline-none font-mono" /></td>
                  <td className="py-2 px-2"><input value={r.desc} onChange={(e) => updateRow(i, "desc", e.target.value)} className="w-full text-[12px] outline-none" /></td>
                  <td className="py-2 px-2"><input type="number" value={r.units} onChange={(e) => updateRow(i, "units", +e.target.value)} className="w-12 text-[12px] outline-none" /></td>
                  <td className="py-2 px-2"><input type="number" value={r.rate} onChange={(e) => updateRow(i, "rate", +e.target.value)} className="w-20 text-[12px] outline-none" /></td>
                  <td className="py-2 px-2 font-semibold" style={{ color: "#111827" }}>₹{taxable.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-2">
                    <select value={r.taxType} onChange={(e) => updateRow(i, "taxType", e.target.value)} className="text-[11px] outline-none"><option>IGST</option><option>CGST+SGST</option></select>
                  </td>
                  <td className="py-2 px-2"><input type="number" value={r.taxPct} onChange={(e) => updateRow(i, "taxPct", +e.target.value)} className="w-10 text-[12px] outline-none" />%</td>
                  <td className="py-2 px-2" style={{ color: "#6B7280" }}>₹{taxAmt.toLocaleString("en-IN")}</td>
                  <td className="py-2 px-2 font-bold" style={{ color: "#111827" }}>₹{(taxable + taxAmt).toLocaleString("en-IN")}</td>
                  <td className="py-2 px-2"><button onClick={() => setRows(rows.filter((_, k) => k !== i))} className="text-[#DC2626] text-[14px]">×</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={() => setRows([...rows, { sac: "", desc: "", units: 1, rate: 0, taxType: "IGST", taxPct: 18 }])} className="text-[12px] font-semibold px-3 py-1 rounded mb-5" style={{ background: "#E3F2FD", color: "#1565C0" }}>+ Add Row</button>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="rounded-lg border p-4" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
              <div className="text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: "#6B7280" }}>Bank Details</div>
              <div className="text-[11px] space-y-0.5" style={{ color: "#374151" }}>
                <div><span style={{ color: "#9CA3AF" }}>Account Name:</span> Navkar Freight Co.</div>
                <div><span style={{ color: "#9CA3AF" }}>Bank:</span> HDFC Bank · Andheri (E)</div>
                <div><span style={{ color: "#9CA3AF" }}>A/C No:</span> 50100234567890</div>
                <div><span style={{ color: "#9CA3AF" }}>IFSC:</span> HDFC0001234</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] italic" style={{ color: "#6B7280" }}>
              <span style={{ color: "#9CA3AF" }}>Amount in Words:</span><br />
              <span className="font-medium" style={{ color: "#111827" }}>{inWords(grandTotal)}</span>
            </div>
          </div>
          <div>
            <table className="w-full text-[13px]">
              <tbody>
                <tr><td className="py-1.5" style={{ color: "#6B7280" }}>Subtotal</td><td className="py-1.5 text-right" style={{ color: "#111827" }}>₹{subtotal.toLocaleString("en-IN")}</td></tr>
                {cgstTotal > 0 && <><tr><td className="py-1.5" style={{ color: "#6B7280" }}>CGST</td><td className="py-1.5 text-right" style={{ color: "#111827" }}>₹{cgstTotal.toLocaleString("en-IN")}</td></tr><tr><td className="py-1.5" style={{ color: "#6B7280" }}>SGST</td><td className="py-1.5 text-right" style={{ color: "#111827" }}>₹{sgstTotal.toLocaleString("en-IN")}</td></tr></>}
                {igstTotal > 0 && <tr><td className="py-1.5" style={{ color: "#6B7280" }}>IGST</td><td className="py-1.5 text-right" style={{ color: "#111827" }}>₹{igstTotal.toLocaleString("en-IN")}</td></tr>}
                <tr style={{ borderTop: "2px solid #1565C0" }}><td className="py-2 font-bold text-[15px]" style={{ color: "#111827" }}>Grand Total</td><td className="py-2 text-right font-bold text-[18px]" style={{ color: "#1565C0" }}>₹{grandTotal.toLocaleString("en-IN")}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
