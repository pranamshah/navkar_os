"use client";

import { useState } from "react";

const fundRequests = {
  pending: [
    { job: "IMP/2526/089", vendor: "Customs", amount: 84000, purpose: "Customs Duty payment", urgency: "HIGH", by: "Priya M", date: "04 Jun 2026 10:30 AM" },
    { job: "IMP/2526/088", vendor: "APWC CFS", amount: 24000, purpose: "CFS storage clearance", urgency: "NORMAL", by: "Priya M", date: "04 Jun 2026 09:15 AM" },
    { job: "EXP/2526/044", vendor: "Hapag-Lloyd", amount: 145000, purpose: "Ocean freight prepaid", urgency: "HIGH", by: "Rajesh K", date: "03 Jun 2026 04:20 PM" },
  ],
  approved: [
    { job: "IMP/2526/087", vendor: "Sakthi Transport", amount: 18000, purpose: "Transport", urgency: "NORMAL", by: "Rajesh K", date: "02 Jun 2026" },
    { job: "AIR/2526/031", vendor: "Air India Cargo", amount: 62000, purpose: "Air freight", urgency: "HIGH", by: "Anita S", date: "01 Jun 2026" },
  ],
  rejected: [
    { job: "IMP/2526/082", vendor: "Misc Vendor", amount: 8000, purpose: "Expense reimb", urgency: "NORMAL", by: "Priya M", date: "30 May 2026" },
  ],
};

export default function FundRequestsPage() {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const list = fundRequests[tab];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Fund Requests</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Pay-out approvals · 3 pending</p>
        </div>
        <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ New Request</button>
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {(["pending", "approved", "rejected"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-[13px] font-medium border-b-2 capitalize" style={{ borderColor: tab === t ? "#1565C0" : "transparent", color: tab === t ? "#1565C0" : "#6B7280" }}>
            {t} ({fundRequests[t].length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {list.map((r, i) => (
          <div key={i} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px]" style={{ color: "#1565C0" }}>{r.job}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: r.urgency === "HIGH" ? "#FEF2F2" : "#F3F4F6", color: r.urgency === "HIGH" ? "#DC2626" : "#374151" }}>{r.urgency}</span>
                </div>
                <div className="text-[14px] font-bold mt-1" style={{ color: "#111827" }}>{r.vendor}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{r.purpose}</div>
              </div>
              <div className="text-right">
                <div className="text-[18px] font-bold" style={{ color: "#1565C0" }}>₹{r.amount.toLocaleString("en-IN")}</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
              <div className="text-[10px]" style={{ color: "#9CA3AF" }}>Raised by {r.by} · {r.date}</div>
              {tab === "pending" && (
                <div className="flex gap-1">
                  <button className="px-3 py-1 rounded text-[11px] font-bold text-white" style={{ background: "#059669" }}>Approve</button>
                  <button className="px-3 py-1 rounded text-[11px] font-bold text-white" style={{ background: "#DC2626" }}>Reject</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
