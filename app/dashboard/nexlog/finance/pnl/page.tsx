"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const jobs: { no: string; client: string; mode: string; route: string; rev: number; cost: number; gp: number; gpPct: number }[] = [];

const monthly: { m: string; gp: number }[] = [];

export default function PnlPage() {
  const totals = jobs.reduce((acc, j) => ({ rev: acc.rev + j.rev, cost: acc.cost + j.cost, gp: acc.gp + j.gp }), { rev: 0, cost: 0, gp: 0 });
  const avgGp = totals.rev === 0 ? "0.0" : ((totals.gp / totals.rev) * 100).toFixed(1);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Job-wise P&L</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Per-shipment profitability · Last 30 days</p>
        </div>
        <div className="flex gap-2">
          <input type="date" defaultValue="2026-05-01" className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }} />
          <input type="date" defaultValue="2026-06-04" className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }} />
          <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white" style={{ background: "#1565C0" }}>Export</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { l: "Total Revenue", v: `₹${(totals.rev / 100000).toFixed(2)} L`, c: "#1565C0", bg: "#E3F2FD" },
          { l: "Total Cost", v: `₹${(totals.cost / 100000).toFixed(2)} L`, c: "#D97706", bg: "#FFFBEB" },
          { l: "Gross Profit", v: `₹${(totals.gp / 100000).toFixed(2)} L`, c: "#059669", bg: "#ECFDF5" },
          { l: "Avg GP %", v: `${avgGp}%`, c: "#7C3AED", bg: "#F5F3FF" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>{k.l}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5 mb-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Monthly Gross Profit · ₹ thousands</h3>
        {monthly.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>bar_chart</span>
            <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No chart data yet</p>
            <p className="text-xs mt-1" style={{ color: "#7e7576" }}>They will appear here once added.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Tooltip />
              <Bar dataKey="gp" fill="#1565C0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Job No", "Client", "Mode", "Route", "Revenue", "Cost", "GP", "GP %"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>inbox</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No P&L data yet</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>They will appear here once added.</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {jobs.map((j) => (
                  <tr key={j.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{j.no}</td>
                    <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{j.client}</td>
                    <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: j.mode === "SEA" ? "#DBEAFE" : "#FEF3C7", color: j.mode === "SEA" ? "#1E40AF" : "#92400E" }}>{j.mode}</span></td>
                    <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{j.route}</td>
                    <td className="py-2.5 px-3" style={{ color: "#111827" }}>₹{j.rev.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>₹{j.cost.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3 font-bold" style={{ color: "#059669" }}>₹{j.gp.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3 font-bold" style={{ color: "#059669" }}>{j.gpPct}%</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #E5E7EB", background: "#F9FAFB" }}>
                  <td className="py-2.5 px-3 font-bold" colSpan={4} style={{ color: "#111827" }}>Total</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{totals.rev.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{totals.cost.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#059669" }}>₹{totals.gp.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#059669" }}>{avgGp}%</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
