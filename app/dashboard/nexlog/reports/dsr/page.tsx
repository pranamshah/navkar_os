"use client";

const dsrs = [
  { client: "Ravi Exports", lastSent: "03 Jun 2026 10:00 AM", frequency: "Daily", auto: true, count: 142 },
  { client: "HDFC Traders", lastSent: "03 Jun 2026 10:00 AM", frequency: "Daily", auto: true, count: 89 },
  { client: "Global Impex", lastSent: "02 Jun 2026 10:00 AM", frequency: "Weekly", auto: true, count: 24 },
  { client: "Sunrise Logistics", lastSent: "01 Jun 2026 06:00 PM", frequency: "Daily", auto: false, count: 38 },
  { client: "Bharat Heavy", lastSent: "31 May 2026 10:00 AM", frequency: "Weekly", auto: true, count: 18 },
];

export default function DsrReportsPage() {
  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>DSR Reports</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>DSR send history per client</p>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Client", "Last DSR Sent", "Frequency", "Auto-Schedule", "Total Sent"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {dsrs.map((d) => (
              <tr key={d.client} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-3 px-3 font-medium" style={{ color: "#111827" }}>{d.client}</td>
                <td className="py-3 px-3" style={{ color: "#6B7280" }}>{d.lastSent}</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#E3F2FD", color: "#1565C0" }}>{d.frequency}</span></td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: d.auto ? "#ECFDF5" : "#F3F4F6", color: d.auto ? "#059669" : "#6B7280" }}>{d.auto ? "ON" : "OFF"}</span></td>
                <td className="py-3 px-3 font-bold" style={{ color: "#111827" }}>{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
