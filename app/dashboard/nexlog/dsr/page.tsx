"use client";

const activeJobs: { no: string; route: string; stage: string; eta: string }[] = [];

const history: { client: string; date: string; jobs: number; status: string }[] = [];

export default function DsrPage() {
  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Daily Status Report (DSR)</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Auto-generate and schedule shipment status emails to your clients</p>
      </div>

      <div className="rounded-xl border p-5 mb-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex items-end gap-3 mb-4">
          <div className="flex-1">
            <label className="text-[11px] font-medium" style={{ color: "#374151" }}>Select Client</label>
            <select className="w-full mt-1 px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }}>
              <option>Ravi Exports Pvt Ltd</option>
              <option>HDFC Traders</option>
              <option>Global Impex Solutions</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border" style={{ borderColor: "#E5E7EB" }}>
            <span className="text-[12px] font-medium" style={{ color: "#374151" }}>Auto-Schedule</span>
            <div className="w-8 h-4 rounded-full flex items-center px-0.5" style={{ background: "#1565C0" }}>
              <div className="w-3 h-3 rounded-full bg-white ml-auto" />
            </div>
            <input type="time" defaultValue="10:00" className="px-2 py-0.5 rounded text-[11px] border" style={{ borderColor: "#E5E7EB" }} />
          </div>
          <button className="px-4 py-2 rounded-md text-[13px] font-semibold text-white" style={{ background: "#1565C0" }}>Generate & Send DSR</button>
        </div>

        <h4 className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>Active Jobs in DSR</h4>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}>
              <tr>{["", "Job No", "Route", "Stage", "ETA"].map((h) => <th key={h} className="text-left py-2 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {activeJobs.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-[12px]" style={{ color: "#6B7280" }}>No active jobs to include in DSR.</td></tr>
              ) : activeJobs.map((j) => (
                <tr key={j.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-2 px-3"><input type="checkbox" defaultChecked /></td>
                  <td className="py-2 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{j.no}</td>
                  <td className="py-2 px-3" style={{ color: "#6B7280" }}>{j.route}</td>
                  <td className="py-2 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#E3F2FD", color: "#1565C0" }}>{j.stage}</span></td>
                  <td className="py-2 px-3" style={{ color: "#6B7280" }}>{j.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Recent DSR History</h3>
        </div>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Client", "Sent At", "Jobs", "Status"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-[12px]" style={{ color: "#6B7280" }}>No DSR history yet.</td></tr>
            ) : history.map((h, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{h.client}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{h.date}</td>
                <td className="py-2.5 px-3" style={{ color: "#374151" }}>{h.jobs}</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#ECFDF5", color: "#059669" }}>{h.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
