"use client";

import { useState } from "react";

const allFields = ["Job No", "Client", "Mode", "Origin", "Destination", "Stage", "ETA", "Revenue", "Cost", "GP", "GP %", "Shipping Line", "Vessel", "CHA", "CFS"];

export default function CustomReportPage() {
  const [selected, setSelected] = useState<string[]>(["Job No", "Client", "Mode", "Revenue", "GP %"]);
  const [generated, setGenerated] = useState(false);

  const toggle = (f: string) => setSelected(selected.includes(f) ? selected.filter((x) => x !== f) : [...selected, f]);

  const sampleData = [
    { "Job No": "IMP/2526/089", "Client": "Ravi Exports", "Mode": "SEA", "Revenue": "₹3.48L", "GP %": "18.8%" },
    { "Job No": "EXP/2526/044", "Client": "HDFC Traders", "Mode": "SEA", "Revenue": "₹4.12L", "GP %": "22.8%" },
    { "Job No": "AIR/2526/032", "Client": "Global Impex", "Mode": "AIR", "Revenue": "₹68K", "GP %": "38.2%" },
  ];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Custom Report Builder</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Build a report with the fields you need</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Fields</h3>
          <div className="space-y-2">
            {allFields.map((f) => (
              <label key={f} className="flex items-center gap-2 text-[12px] cursor-pointer">
                <input type="checkbox" checked={selected.includes(f)} onChange={() => toggle(f)} />
                <span style={{ color: "#374151" }}>{f}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Filters</h3>
          <div className="space-y-3">
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>From Date</label><input type="date" className="w-full px-3 py-2 rounded-md border text-[12px] outline-none" style={{ borderColor: "#E5E7EB" }} /></div>
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>To Date</label><input type="date" className="w-full px-3 py-2 rounded-md border text-[12px] outline-none" style={{ borderColor: "#E5E7EB" }} /></div>
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Group By</label><select className="w-full px-3 py-2 rounded-md border text-[12px] outline-none" style={{ borderColor: "#E5E7EB" }}><option>None</option><option>Client</option><option>Mode</option><option>Month</option></select></div>
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Client</label><select className="w-full px-3 py-2 rounded-md border text-[12px] outline-none" style={{ borderColor: "#E5E7EB" }}><option>All Clients</option></select></div>
            <button onClick={() => setGenerated(true)} className="w-full mt-2 px-4 py-2 rounded-md text-[13px] font-semibold text-white" style={{ background: "#1565C0" }}>Run Report</button>
          </div>
        </div>

        <div className="col-span-3 rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Preview</h3>
            {generated && <div className="flex gap-2"><button className="px-3 py-1 rounded text-[11px] font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>Export Excel</button><button className="px-3 py-1 rounded text-[11px] font-semibold text-white" style={{ background: "#1565C0" }}>Export PDF</button></div>}
          </div>
          {generated ? (
            <table className="w-full text-[12px]">
              <thead><tr style={{ borderBottom: "1px solid #E5E7EB" }}>{selected.map((s) => <th key={s} className="text-left py-2 px-2 font-semibold text-[10px] uppercase" style={{ color: "#6B7280" }}>{s}</th>)}</tr></thead>
              <tbody>
                {sampleData.map((d, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                    {selected.map((s) => <td key={s} className="py-2 px-2" style={{ color: "#111827" }}>{(d as Record<string, string>)[s] || "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-[12px]" style={{ color: "#9CA3AF" }}>Select fields and click "Run Report" to preview</div>
          )}
        </div>
      </div>
    </div>
  );
}
