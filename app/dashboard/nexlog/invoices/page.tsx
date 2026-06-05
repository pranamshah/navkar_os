"use client";

import { useState } from "react";
import Link from "next/link";

const invoices: { no: string; job: string; client: string; date: string; amount: number; gst: number; type: string; status: string }[] = [];

const tabs = ["All", "Tax Invoice", "Reimbursement", "Debit Note", "Credit Note"];
const statusColors: Record<string, { bg: string; fg: string }> = {
  Draft: { bg: "#F3F4F6", fg: "#374151" },
  Sent: { bg: "#E3F2FD", fg: "#1565C0" },
  Paid: { bg: "#ECFDF5", fg: "#059669" },
};

export default function InvoicesPage() {
  const [tab, setTab] = useState("All");
  const list = tab === "All" ? invoices : invoices.filter((i) => i.type === tab);

  const totalInvoiced = invoices.reduce((s, i) => s + i.amount + i.gst, 0);
  const totalCollected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount + i.gst, 0);
  const outstanding = totalInvoiced - totalCollected;

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Invoices</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{invoices.length} invoices · FY 2025–26</p>
        </div>
        <Link href="/dashboard/nexlog/invoices/new" className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ Create Invoice</Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { l: "Total Invoiced", v: `₹${(totalInvoiced / 100000).toFixed(2)} L`, c: "#1565C0", bg: "#E3F2FD" },
          { l: "Total Collected", v: `₹${(totalCollected / 100000).toFixed(2)} L`, c: "#059669", bg: "#ECFDF5" },
          { l: "Outstanding", v: `₹${(outstanding / 100000).toFixed(2)} L`, c: "#D97706", bg: "#FFFBEB" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>{k.l}</div>
                <div className="text-2xl font-bold" style={{ color: k.c }}>{k.v}</div>
              </div>
              <div className="w-10 h-10 rounded-lg" style={{ background: k.bg }} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-[13px] font-medium border-b-2" style={{ borderColor: tab === t ? "#1565C0" : "transparent", color: tab === t ? "#1565C0" : "#6B7280" }}>{t}</button>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Invoice No", "Job No", "Client", "Date", "Amount", "GST", "Total", "Status", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>inbox</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No invoices yet</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>They will appear here once added.</p>
                  </div>
                </td>
              </tr>
            ) : list.map((inv) => (
              <tr key={inv.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{inv.no}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>{inv.job}</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{inv.client}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{inv.date}</td>
                <td className="py-2.5 px-3" style={{ color: "#111827" }}>₹{inv.amount.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>₹{inv.gst.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{(inv.amount + inv.gst).toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: statusColors[inv.status].bg, color: statusColors[inv.status].fg }}>{inv.status}</span></td>
                <td className="py-2.5 px-3">
                  <div className="flex gap-1">
                    <button className="px-2 py-1 rounded text-[10px] font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>Download</button>
                    <button className="px-2 py-1 rounded text-[10px] font-semibold text-white" style={{ background: "#1565C0" }}>Send</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
