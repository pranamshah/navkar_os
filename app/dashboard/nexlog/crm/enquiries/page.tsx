"use client";

import { useState } from "react";

const enquiries: { no: string; client: string; type: string; route: string; cbm: string; wt: string; date: string; status: string }[] = [];

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
            {list.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>inbox</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No enquiries yet</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>They will appear here once added.</p>
                  </div>
                </td>
              </tr>
            ) : list.map((e) => (
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
