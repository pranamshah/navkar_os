"use client";

const quotations = [
  { no: "QTN/2526/089", client: "Ravi Exports", enquiry: "ENQ/2526/142", amount: "₹3,48,000", validTill: "15 Jun 2026", status: "Sent" },
  { no: "QTN/2526/088", client: "Bharat Heavy", enquiry: "ENQ/2526/140", amount: "₹1,82,000", validTill: "12 Jun 2026", status: "Accepted" },
  { no: "QTN/2526/087", client: "HDFC Traders", enquiry: "ENQ/2526/141", amount: "₹62,000", validTill: "10 Jun 2026", status: "Draft" },
  { no: "QTN/2526/086", client: "Apollo Pharma", enquiry: "ENQ/2526/139", amount: "₹44,500", validTill: "08 Jun 2026", status: "Accepted" },
  { no: "QTN/2526/085", client: "Marine Spares", enquiry: "ENQ/2526/137", amount: "₹14,800", validTill: "05 Jun 2026", status: "Rejected" },
];

const statusColors: Record<string, { bg: string; fg: string }> = {
  Draft: { bg: "#F3F4F6", fg: "#374151" },
  Sent: { bg: "#E3F2FD", fg: "#1565C0" },
  Accepted: { bg: "#ECFDF5", fg: "#059669" },
  Rejected: { bg: "#FEF2F2", fg: "#DC2626" },
};

const comparison = [
  { line: "Hapag-Lloyd", ofr: 142000, thc: 18500, doc: 4500, total: 165000, transit: "22 days", color: "#1565C0" },
  { line: "CMA CGM", ofr: 138500, thc: 19000, doc: 4200, total: 161700, transit: "24 days", color: "#DC2626", best: true },
  { line: "Maersk", ofr: 148000, thc: 18000, doc: 5000, total: 171000, transit: "20 days", color: "#0D47A1" },
];

export default function QuotationsPage() {
  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Quotations</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{quotations.length} quotations</p>
        </div>
        <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ New Quotation</button>
      </div>

      <div className="rounded-xl border overflow-hidden mb-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Quote No", "Client", "Enquiry", "Amount", "Valid Till", "Status", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {quotations.map((q) => (
              <tr key={q.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{q.no}</td>
                <td className="py-3 px-3 font-medium" style={{ color: "#111827" }}>{q.client}</td>
                <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>{q.enquiry}</td>
                <td className="py-3 px-3 font-bold" style={{ color: "#111827" }}>{q.amount}</td>
                <td className="py-3 px-3" style={{ color: "#6B7280" }}>{q.validTill}</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: statusColors[q.status].bg, color: statusColors[q.status].fg }}>{q.status}</span></td>
                <td className="py-3 px-3"><button className="text-[11px] font-semibold px-2 py-1 rounded" style={{ color: "#1565C0", background: "#E3F2FD" }}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Rate Comparison · ENQ/2526/142</h3>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Shanghai → JNPT · 1×40HC · CMA CGM offers best rate</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {comparison.map((c) => (
            <div key={c.line} className="rounded-lg p-4 border-2" style={{ borderColor: c.best ? "#059669" : "#E5E7EB", background: c.best ? "#F0FDF4" : "#fff", position: "relative" }}>
              {c.best && <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: "#059669" }}>BEST RATE</div>}
              <div className="text-[14px] font-bold mb-3" style={{ color: c.color }}>{c.line}</div>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between"><span style={{ color: "#6B7280" }}>Ocean Freight</span><span style={{ color: "#111827" }}>₹{c.ofr.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span style={{ color: "#6B7280" }}>THC</span><span style={{ color: "#111827" }}>₹{c.thc.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span style={{ color: "#6B7280" }}>DO Charges</span><span style={{ color: "#111827" }}>₹{c.doc.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#E5E7EB" }}>
                  <span className="font-bold" style={{ color: "#111827" }}>Total</span>
                  <span className="font-bold" style={{ color: c.color }}>₹{c.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-[10px] text-center mt-2 pt-2 border-t" style={{ color: "#6B7280", borderColor: "#E5E7EB" }}>Transit: {c.transit}</div>
              </div>
              <button className="w-full mt-3 py-1.5 rounded text-[11px] font-bold" style={{ background: c.best ? "#059669" : "#F3F4F6", color: c.best ? "#fff" : "#374151" }}>Select Carrier</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
