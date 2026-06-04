"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const jobs = [
  { no: "IMP/2526/089", client: "Ravi Exports", mode: "SEA", rev: 348000, cost: 282500, gp: 65500, gpPct: 18.8 },
  { no: "EXP/2526/044", client: "HDFC Traders", mode: "SEA", rev: 412000, cost: 318000, gp: 94000, gpPct: 22.8 },
  { no: "AIR/2526/032", client: "Global Impex", mode: "AIR", rev: 68000, cost: 42000, gp: 26000, gpPct: 38.2 },
  { no: "IMP/2526/088", client: "Sunrise Logistics", mode: "SEA", rev: 196000, cost: 142000, gp: 54000, gpPct: 27.6 },
  { no: "AIR/2526/031", client: "Apollo Pharma", mode: "AIR", rev: 92000, cost: 64000, gp: 28000, gpPct: 30.4 },
  { no: "RD/2526/044", client: "Marine Spares", mode: "SURFACE", rev: 28000, cost: 18000, gp: 10000, gpPct: 35.7 },
];

export default function GpReportPage() {
  const byMode = ["SEA", "AIR", "SURFACE"].map((m) => ({
    name: m,
    value: jobs.filter((j) => j.mode === m).reduce((s, j) => s + j.gp, 0),
  }));
  const colors = ["#1565C0", "#D97706", "#7C3AED"];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Gross Profit Report</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Per-job GP analysis with mode breakdown</p>
        </div>
        <div className="flex gap-2">
          <input type="date" defaultValue="2026-05-01" className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }} />
          <input type="date" defaultValue="2026-06-04" className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }} />
          <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>Export Excel</button>
          <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white" style={{ background: "#1565C0" }}>Export PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}>
              <tr>{["Job No", "Client", "Mode", "Revenue", "Cost", "GP", "GP %"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{j.no}</td>
                  <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{j.client}</td>
                  <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#E3F2FD", color: "#1565C0" }}>{j.mode}</span></td>
                  <td className="py-2.5 px-3" style={{ color: "#111827" }}>₹{j.rev.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>₹{j.cost.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#059669" }}>₹{j.gp.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#059669" }}>{j.gpPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>GP by Mode</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byMode} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                {byMode.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {byMode.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[i] }} /><span style={{ color: "#374151" }}>{m.name}</span></div>
                <span className="font-bold" style={{ color: "#111827" }}>₹{m.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
