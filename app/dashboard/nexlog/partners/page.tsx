"use client";

import { useState } from "react";

const partners: Record<string, { name: string; code: string; gstin?: string; contact: string; phone: string; email: string; country: string }[]> = {
  line: [],
  cfs: [],
  cha: [],
  transporter: [],
  overseas: [],
};

const tabs = [
  { id: "line", label: "Shipping Lines" },
  { id: "cfs", label: "CFS" },
  { id: "cha", label: "CHA" },
  { id: "transporter", label: "Transporters" },
  { id: "overseas", label: "Overseas Agents" },
];

export default function PartnersPage() {
  const [tab, setTab] = useState("line");
  const list = partners[tab];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Partners Master</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Shipping lines, CFS stations, CHAs, transporters & overseas agents</p>
        </div>
        <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ Add Partner</button>
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-4 py-2 text-[13px] font-medium border-b-2" style={{ borderColor: tab === t.id ? "#1565C0" : "transparent", color: tab === t.id ? "#1565C0" : "#6B7280" }}>
            {t.label} ({partners[t.id].length})
          </button>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Name", tab === "line" ? "SCAC" : "Code", "GSTIN", "Contact", "Phone", "Email", "Country"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>inbox</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No partners added yet</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>Click + Add Partner to get started.</p>
                  </div>
                </td>
              </tr>
            ) : list.map((p) => (
              <tr key={p.code} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-semibold" style={{ color: "#111827" }}>{p.name}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{p.code}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>{p.gstin || "—"}</td>
                <td className="py-2.5 px-3" style={{ color: "#374151" }}>{p.contact}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{p.phone}</td>
                <td className="py-2.5 px-3" style={{ color: "#1565C0" }}>{p.email}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{p.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
