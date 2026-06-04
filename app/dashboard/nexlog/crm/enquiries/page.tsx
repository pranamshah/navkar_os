"use client";

import { useState } from "react";

const enquiries = [
  { no: "ENQ/2526/142", client: "Ravi Exports", type: "Sea FCL", route: "Shanghai → JNPT", cbm: "28.5", wt: "12,500 kg", date: "01 Jun 2026", status: "Quoted" },
  { no: "ENQ/2526/141", client: "HDFC Traders", type: "Air", route: "Mumbai → London", cbm: "—", wt: "450 kg", date: "31 May 2026", status: "Open" },
  { no: "ENQ/2526/140", client: "Bharat Heavy", type: "Sea LCL", route: "Tianjin → Mumbai", cbm: "12.4", wt: "8,200 kg", date: "30 May 2026", status: "Quoted" },
  { no: "ENQ/2526/139", client: "Apollo Pharma", type: "Air", route: "Hyderabad → Frankfurt", cbm: "—", wt: "280 kg", date: "29 May 2026", status: "Won" },
  { no: "ENQ/2526/138", client: "Sunrise Logistics", type: "Sea FCL", route: "Dubai → JNPT", cbm: "60", wt: "22,000 kg", date: "28 May 2026", status: "Open" },
  { no: "ENQ/2526/137", client: "Marine Spares", type: "Surface", route: "Mumbai → Chennai", cbm: "8", wt: "3,200 kg", date: "27 May 2026", status: "Lost" },
];

const statusColors: Record<string, { bg: string; fg: string }> = {
  Open: { bg: "#F3F4F6", fg: "#374151" },
  Quoted: { bg: "#FFFBEB", fg: "#D97706" },
  Won: { bg: "#ECFDF5", fg: "#059669" },
  Lost: { bg: "#FEF2F2", fg: "#DC2626" },
};

export default function EnquiriesPage() {
  const [filter, setFilter] = useState("");
  const list = filter ? enquiries.filter((e) => e.type === filter) : enquiries;

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Enquiries</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{list.length} enquiries</p>
        </div>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <option value="">All Types</option><option>Sea FCL</option><option>Sea LCL</option><option>Air</option><option>Surface</option>
          </select>
          <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ New Enquiry</button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Enquiry No", "Client", "Type", "Route", "CBM", "Weight", "Date", "Status", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{e.no}</td>
                <td className="py-3 px-3 font-medium" style={{ color: "#111827" }}>{e.client}</td>
                <td className="py-3 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#E3F2FD", color: "#1565C0" }}>{e.type}</span></td>
                <td className="py-3 px-3" style={{ color: "#6B7280" }}>{e.route}</td>
                <td className="py-3 px-3" style={{ color: "#6B7280" }}>{e.cbm}</td>
                <td className="py-3 px-3" style={{ color: "#6B7280" }}>{e.wt}</td>
                <td className="py-3 px-3" style={{ color: "#6B7280" }}>{e.date}</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: statusColors[e.status].bg, color: statusColors[e.status].fg }}>{e.status}</span></td>
                <td className="py-3 px-3"><button className="text-[11px] font-semibold px-2 py-1 rounded" style={{ color: "#1565C0", background: "#E3F2FD" }}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
