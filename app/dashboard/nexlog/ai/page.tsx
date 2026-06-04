"use client";

import { useState } from "react";

const extractedFields = [
  ["BL No", "HLCUSHA2614832"],
  ["Vessel", "MV Pacific Ace V.2614E"],
  ["POL", "CNSHA Shanghai"],
  ["POD", "INNSA Nhava Sheva"],
  ["Container Nos", "TCNU8456731 (40HC)"],
  ["Seal No", "SL789432"],
  ["Gross Weight", "12,500 kg"],
  ["Net Weight", "11,800 kg"],
  ["CBM", "28.500"],
  ["Shipper", "Shanghai Electronics Ltd"],
  ["Consignee", "Ravi Exports Pvt Ltd"],
  ["Cargo", "120 CTNS Electronic Mobile Accessories"],
];

const anomalies = [
  { severity: "Critical", title: "Duplicate BL number detected", desc: "BL HLCUSHA2614832 found on 2 jobs (IMP/2526/089 + IMP/2526/091)", icon: "warning" },
  { severity: "Critical", title: "Invoice without cost entries", desc: "INV-2026-0139 finalized but no charges captured", icon: "receipt_long" },
  { severity: "Warning", title: "Job stuck at customs > 5 days", desc: "IMP/2526/086 at examination since 30 May", icon: "schedule" },
  { severity: "Warning", title: "Container free days expiring", desc: "TCNU8456731 — 1 day left, detention risk ₹4500/day", icon: "timer" },
  { severity: "Warning", title: "Vessel ETA delayed beyond 7 days", desc: "MV MSC Gulsun delayed from 15→22 Jun", icon: "directions_boat" },
  { severity: "Info", title: "Rate card expired", desc: "Hapag-Lloyd Shanghai-JNPT rate expired 31 May 2026", icon: "price_change" },
];

const rates = [
  { line: "Hapag-Lloyd", ofr: "$1,850", thc: "$220", do_: "$45", total: "$2,115", transit: "22 days" },
  { line: "CMA CGM", ofr: "$1,795", thc: "$235", do_: "$52", total: "$2,082", transit: "24 days", best: true },
  { line: "Maersk", ofr: "$1,920", thc: "$215", do_: "$60", total: "$2,195", transit: "20 days" },
];

export default function AiToolsPage() {
  const [tab, setTab] = useState<"scanner" | "prealert" | "rates" | "anomaly">("scanner");

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#7C3AED" }}>auto_awesome</span>
          AI Tools
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>DocAI scanner · Smart pre-alert · Rate comparison · Anomaly detection</p>
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {[["scanner", "DocAI Scanner"], ["prealert", "Smart Pre Alert"], ["rates", "Rate Comparison"], ["anomaly", "Anomaly Report"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id as "scanner" | "prealert" | "rates" | "anomaly")} className="px-4 py-2 text-[13px] font-medium border-b-2" style={{ borderColor: tab === id ? "#1565C0" : "transparent", color: tab === id ? "#1565C0" : "#6B7280" }}>{lbl}</button>
        ))}
      </div>

      {tab === "scanner" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center" style={{ borderColor: "#7C3AED", background: "#F5F3FF", minHeight: 320 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#7C3AED" }}>document_scanner</span>
            <div className="text-[16px] font-bold mt-3" style={{ color: "#111827" }}>Drop BL / Invoice / Packing List</div>
            <div className="text-[12px] mt-1" style={{ color: "#6B7280" }}>PDF, JPG, PNG · Up to 25 MB</div>
            <div className="flex gap-1 mt-4">
              {["BL", "MAWB", "CI", "PL", "BE"].map((t) => <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#fff", color: "#7C3AED", border: "1px solid #DDD6FE" }}>{t}</span>)}
            </div>
            <button className="mt-5 px-5 py-2 rounded-md text-[13px] font-bold text-white" style={{ background: "#7C3AED" }}>Choose File</button>
          </div>
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Extracted Fields</h3>
                <p className="text-[11px]" style={{ color: "#059669" }}>BL_Shanghai_HLCUSHA2614832.pdf · 98% confidence</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#ECFDF5", color: "#059669" }}>READY</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 max-h-72 overflow-y-auto">
              {extractedFields.map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: "#9CA3AF" }}>{k}</div>
                  <div className="text-[12px] font-medium" style={{ color: "#111827" }}>{v}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 rounded-md text-[13px] font-bold text-white" style={{ background: "#1565C0" }}>Accept & Pre-fill Job</button>
          </div>
        </div>
      )}

      {tab === "prealert" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Select Job</h3>
            <select className="w-full px-3 py-2 rounded-md border text-[13px] outline-none mb-4" style={{ borderColor: "#E5E7EB" }}>
              <option>IMP/2526/089 — Ravi Exports — Shanghai → JNPT</option>
            </select>
            <button className="w-full px-4 py-2 rounded-md text-[13px] font-bold text-white" style={{ background: "#7C3AED" }}>
              <span className="material-symbols-outlined inline-block align-middle mr-1" style={{ fontSize: 14 }}>auto_awesome</span>
              AI: Auto-extract & Generate
            </button>
            <div className="mt-4 p-3 rounded-lg text-[11px]" style={{ background: "#F5F3FF", color: "#5B21B6" }}>AI extracted 12 fields from BL · Pre-alert body composed with correct vessel/ETA/cargo · Ready to send</div>
          </div>
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Pre-Alert Preview</h3>
            <div className="rounded-lg border p-4 text-[11px]" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
              <div className="font-bold mb-2" style={{ color: "#111827" }}>Cargo Arrival Notice — IMP/2526/089</div>
              <div className="text-[11px] whitespace-pre-line" style={{ color: "#374151" }}>{`Dear Ravi Exports,\n\nVessel MV Pacific Ace V.2614E carrying your shipment will arrive JNPT on 30 May 2026.\n\nContainer: TCNU8456731 (40HC)\nBL: HLCUSHA2614832\nCargo: 120 CTNS / 12,500 kg / 28.5 CBM\nFree Days: 10 from gate-in\n\nKindly action clearance.`}</div>
            </div>
          </div>
        </div>
      )}

      {tab === "rates" && (
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-end gap-3 mb-5">
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Origin Port</label><input defaultValue="CNSHA Shanghai" className="px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }} /></div>
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Destination Port</label><input defaultValue="INNSA JNPT" className="px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }} /></div>
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Container</label><select className="px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }}><option>1×40HC</option><option>1×20DC</option></select></div>
            <button className="px-4 py-2 rounded-md text-[13px] font-bold text-white" style={{ background: "#7C3AED" }}>Compare Rates</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {rates.map((r) => (
              <div key={r.line} className="rounded-lg p-4 border-2" style={{ borderColor: r.best ? "#059669" : "#E5E7EB", background: r.best ? "#F0FDF4" : "#fff", position: "relative" }}>
                {r.best && <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: "#059669" }}>BEST</div>}
                <div className="text-[14px] font-bold mb-3" style={{ color: "#1565C0" }}>{r.line}</div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span style={{ color: "#6B7280" }}>Ocean Freight</span><span style={{ color: "#111827" }}>{r.ofr}</span></div>
                  <div className="flex justify-between"><span style={{ color: "#6B7280" }}>THC</span><span style={{ color: "#111827" }}>{r.thc}</span></div>
                  <div className="flex justify-between"><span style={{ color: "#6B7280" }}>DO</span><span style={{ color: "#111827" }}>{r.do_}</span></div>
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#E5E7EB" }}><span className="font-bold" style={{ color: "#111827" }}>Total</span><span className="font-bold" style={{ color: r.best ? "#059669" : "#1565C0" }}>{r.total}</span></div>
                  <div className="text-[10px] text-center mt-2 pt-2 border-t" style={{ color: "#6B7280", borderColor: "#E5E7EB" }}>Transit: {r.transit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "anomaly" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}>
              <tr>{["Severity", "Issue", "Details", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {anomalies.map((a, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: a.severity === "Critical" ? "#FEF2F2" : a.severity === "Warning" ? "#FFFBEB" : "#E3F2FD", color: a.severity === "Critical" ? "#DC2626" : a.severity === "Warning" ? "#D97706" : "#1565C0" }}>{a.severity}</span></td>
                  <td className="py-3 px-3 font-semibold" style={{ color: "#111827" }}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: a.severity === "Critical" ? "#DC2626" : "#D97706" }}>{a.icon}</span>
                      {a.title}
                    </div>
                  </td>
                  <td className="py-3 px-3" style={{ color: "#6B7280" }}>{a.desc}</td>
                  <td className="py-3 px-3"><button className="px-2 py-1 rounded text-[11px] font-semibold" style={{ background: "#E3F2FD", color: "#1565C0" }}>Investigate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
