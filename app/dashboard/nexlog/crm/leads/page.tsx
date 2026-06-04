"use client";

import { useState } from "react";

type Lead = { name: string; lane: string; followUp: string; value: string; overdue?: boolean };

const cols: { id: string; label: string; color: string; bg: string; leads: Lead[] }[] = [
  { id: "new", label: "New", color: "#6B7280", bg: "#F3F4F6", leads: [
    { name: "Bharat Heavy Engg", lane: "Tianjin → Mumbai", followUp: "06 Jun", value: "₹2.4L", overdue: true },
    { name: "Apollo Pharma", lane: "Hyderabad → Frankfurt", followUp: "08 Jun", value: "₹1.8L" },
  ]},
  { id: "contacted", label: "Contacted", color: "#1565C0", bg: "#E3F2FD", leads: [
    { name: "Marine Spares Co", lane: "Singapore → Chennai", followUp: "07 Jun", value: "₹95K" },
    { name: "Sunrise Logistics", lane: "Dubai → JNPT", followUp: "10 Jun", value: "₹1.4L" },
  ]},
  { id: "qualified", label: "Qualified", color: "#7C3AED", bg: "#F5F3FF", leads: [
    { name: "TechVision Imports", lane: "Shenzhen → Bangalore", followUp: "09 Jun", value: "₹3.2L" },
  ]},
  { id: "quoted", label: "Quoted", color: "#D97706", bg: "#FFFBEB", leads: [
    { name: "Olive Garments", lane: "Tirupur → Hamburg", followUp: "11 Jun", value: "₹2.1L" },
    { name: "Kraft Polymers", lane: "Rotterdam → Mumbai", followUp: "12 Jun", value: "₹1.6L" },
  ]},
  { id: "won", label: "Won", color: "#059669", bg: "#ECFDF5", leads: [
    { name: "Ravi Exports", lane: "Shanghai → JNPT", followUp: "—", value: "₹3.5L" },
  ]},
  { id: "lost", label: "Lost", color: "#DC2626", bg: "#FEF2F2", leads: [
    { name: "Quick Auto Parts", lane: "China → Mumbai", followUp: "—", value: "—" },
  ]},
];

export default function LeadsPage() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Leads Pipeline</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{cols.reduce((s, c) => s + c.leads.length, 0)} total leads · 1 overdue follow-up</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <button onClick={() => setView("kanban")} className="px-3 py-1.5 text-[12px] font-medium" style={{ background: view === "kanban" ? "#1565C0" : "transparent", color: view === "kanban" ? "#fff" : "#374151", borderRadius: "5px 0 0 5px" }}>Kanban</button>
            <button onClick={() => setView("table")} className="px-3 py-1.5 text-[12px] font-medium" style={{ background: view === "table" ? "#1565C0" : "transparent", color: view === "table" ? "#fff" : "#374151", borderRadius: "0 5px 5px 0" }}>Table</button>
          </div>
          <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ New Lead</button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-6 gap-3">
          {cols.map((col) => (
            <div key={col.id} className="rounded-xl p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB", minHeight: 400 }}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: col.color }}>{col.label}</div>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: col.bg, color: col.color }}>{col.leads.length}</span>
              </div>
              <div className="space-y-2">
                {col.leads.map((l, i) => (
                  <div key={i} className="p-2.5 rounded-lg cursor-pointer hover:shadow-sm transition" style={{ background: "#F9FAFB", border: l.overdue ? "1px solid #FECACA" : "1px solid #E5E7EB" }}>
                    <div className="text-[12px] font-semibold" style={{ color: "#111827" }}>{l.name}</div>
                    <div className="text-[10px] mt-1" style={{ color: "#6B7280" }}>{l.lane}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-[10px]" style={{ color: l.overdue ? "#DC2626" : "#9CA3AF" }}>{l.followUp}</div>
                      <div className="text-[10px] font-bold" style={{ color: col.color }}>{l.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}>
              <tr>{["Company", "Trade Lane", "Stage", "Follow-up", "Est. Value", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {cols.flatMap((c) => c.leads.map((l) => ({ ...l, col: c }))).map((l, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6", background: l.overdue ? "#FEF2F2" : "transparent" }}>
                  <td className="py-2.5 px-3 font-semibold" style={{ color: "#111827" }}>{l.name}</td>
                  <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{l.lane}</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: l.col.bg, color: l.col.color }}>{l.col.label}</span></td>
                  <td className="py-2.5 px-3" style={{ color: l.overdue ? "#DC2626" : "#6B7280", fontWeight: l.overdue ? 600 : 400 }}>{l.followUp}{l.overdue ? " (Overdue)" : ""}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>{l.value}</td>
                  <td className="py-2.5 px-3"><button className="text-[11px] font-semibold px-2 py-1 rounded" style={{ color: "#1565C0", background: "#E3F2FD" }}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
