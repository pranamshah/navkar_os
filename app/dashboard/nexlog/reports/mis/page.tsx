"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const data = {
  daily: [{ d: "29", rev: 84, cost: 52, gp: 32 }, { d: "30", rev: 76, cost: 48, gp: 28 }, { d: "31", rev: 92, cost: 58, gp: 34 }, { d: "01", rev: 88, cost: 54, gp: 34 }, { d: "02", rev: 102, cost: 64, gp: 38 }, { d: "03", rev: 118, cost: 72, gp: 46 }, { d: "04", rev: 96, cost: 60, gp: 36 }],
  weekly: [{ d: "W1", rev: 412, cost: 268, gp: 144 }, { d: "W2", rev: 486, cost: 312, gp: 174 }, { d: "W3", rev: 524, cost: 338, gp: 186 }, { d: "W4", rev: 612, cost: 392, gp: 220 }],
  monthly: [{ d: "Jan", rev: 1842, cost: 1186, gp: 656 }, { d: "Feb", rev: 2104, cost: 1342, gp: 762 }, { d: "Mar", rev: 1948, cost: 1248, gp: 700 }, { d: "Apr", rev: 2218, cost: 1424, gp: 794 }, { d: "May", rev: 2384, cost: 1532, gp: 852 }, { d: "Jun", rev: 1284, cost: 824, gp: 460 }],
};

const topClients = [
  { name: "Ravi Exports Pvt Ltd", jobs: 8, revenue: 1842000 },
  { name: "HDFC Traders", jobs: 6, revenue: 1542000 },
  { name: "Bharat Heavy Engg", jobs: 4, revenue: 982000 },
  { name: "Apollo Pharma", jobs: 5, revenue: 824000 },
  { name: "Sunrise Logistics", jobs: 3, revenue: 612000 },
];

export default function MisPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const chartData = data[period];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>MIS Report</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Management Information System · {period} view</p>
        </div>
        <div className="flex rounded-md border" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className="px-4 py-1.5 text-[12px] font-medium capitalize" style={{ background: period === p ? "#1565C0" : "transparent", color: period === p ? "#fff" : "#374151" }}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { l: "Total Revenue", v: `₹${(chartData.reduce((s, d) => s + d.rev, 0) / 100).toFixed(1)} L`, c: "#1565C0" },
          { l: "Total Cost", v: `₹${(chartData.reduce((s, d) => s + d.cost, 0) / 100).toFixed(1)} L`, c: "#D97706" },
          { l: "Gross Profit", v: `₹${(chartData.reduce((s, d) => s + d.gp, 0) / 100).toFixed(1)} L`, c: "#059669" },
          { l: "Avg GP %", v: `${((chartData.reduce((s, d) => s + d.gp, 0) / chartData.reduce((s, d) => s + d.rev, 0)) * 100).toFixed(1)}%`, c: "#7C3AED" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>{k.l}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5 mb-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Revenue / Cost / GP · ₹ thousands</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#6B7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="rev" fill="#1565C0" name="Revenue" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cost" fill="#D97706" name="Cost" radius={[3, 3, 0, 0]} />
            <Bar dataKey="gp" fill="#059669" name="GP" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Top 5 Clients by Revenue</h3>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {["#", "Client", "Jobs", "Revenue", "Share"].map((h) => <th key={h} className="text-left py-2 px-2 font-semibold text-[10px] uppercase" style={{ color: "#6B7280" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {topClients.map((c, i) => {
              const total = topClients.reduce((s, x) => s + x.revenue, 0);
              const pct = (c.revenue / total) * 100;
              return (
                <tr key={c.name} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-2.5 px-2 font-bold" style={{ color: "#1565C0" }}>{i + 1}</td>
                  <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>{c.name}</td>
                  <td className="py-2.5 px-2" style={{ color: "#374151" }}>{c.jobs}</td>
                  <td className="py-2.5 px-2 font-bold" style={{ color: "#111827" }}>₹{c.revenue.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                        <div className="h-full" style={{ width: `${pct}%`, background: "#1565C0" }} />
                      </div>
                      <span className="text-[10px] font-semibold w-10 text-right" style={{ color: "#6B7280" }}>{pct.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
