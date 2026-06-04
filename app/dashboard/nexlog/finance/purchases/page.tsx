"use client";

const purchases = [
  { date: "03 Jun 2026", vendor: "Hapag-Lloyd", job: "IMP/2526/089", cat: "Ocean Freight", amt: 142000, gst: 25560, approval: "Approved", payment: "Paid" },
  { date: "03 Jun 2026", vendor: "APWC CFS", job: "IMP/2526/089", cat: "CFS Charges", amt: 24000, gst: 4320, approval: "Approved", payment: "Pending" },
  { date: "02 Jun 2026", vendor: "Apollo World Connect", job: "IMP/2526/089", cat: "CHA Service", amt: 12000, gst: 2160, approval: "Approved", payment: "Paid" },
  { date: "02 Jun 2026", vendor: "Sakthi Transport", job: "IMP/2526/088", cat: "Transport", amt: 18000, gst: 3240, approval: "Pending", payment: "Pending" },
  { date: "01 Jun 2026", vendor: "JNPT", job: "IMP/2526/089", cat: "THC", amt: 18500, gst: 3330, approval: "Approved", payment: "Paid" },
  { date: "31 May 2026", vendor: "Customs", job: "IMP/2526/089", cat: "Duty", amt: 84000, gst: 0, approval: "Approved", payment: "Paid" },
];

const statusColor = (s: string) => s === "Approved" || s === "Paid" ? { bg: "#ECFDF5", fg: "#059669" } : { bg: "#FEF2F2", fg: "#DC2626" };

export default function PurchasesPage() {
  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Purchase Register</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>All vendor bills · {purchases.length} entries</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }}><option>All Jobs</option></select>
          <select className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }}><option>All Vendors</option></select>
          <select className="px-3 py-1.5 rounded-md border text-[12px]" style={{ borderColor: "#E5E7EB", background: "#fff" }}><option>All Status</option><option>Pending</option><option>Approved</option></select>
          <button className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white" style={{ background: "#1565C0" }}>Export</button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Date", "Vendor", "Job No", "Category", "Amount", "GST", "Approval", "Payment"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {purchases.map((p, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{p.date}</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{p.vendor}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{p.job}</td>
                <td className="py-2.5 px-3" style={{ color: "#374151" }}>{p.cat}</td>
                <td className="py-2.5 px-3 font-semibold" style={{ color: "#111827" }}>₹{p.amt.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>₹{p.gst.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: statusColor(p.approval).bg, color: statusColor(p.approval).fg }}>{p.approval}</span></td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: statusColor(p.payment).bg, color: statusColor(p.payment).fg }}>{p.payment}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
