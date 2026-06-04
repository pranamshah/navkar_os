"use client";

import { useState } from "react";

const aging = [
  { client: "Ravi Exports", b0: 84000, b30: 0, b60: 0, b90: 0 },
  { client: "HDFC Traders", b0: 48000, b30: 142000, b60: 0, b90: 0 },
  { client: "Bharat Heavy", b0: 18500, b30: 0, b60: 64000, b90: 0 },
  { client: "Sunrise Logistics", b0: 0, b30: 28000, b60: 0, b90: 0 },
  { client: "Sakthi Cargo", b0: 0, b30: 0, b60: 0, b90: 24000 },
];

const register = [
  { no: "INV-2026-0142", client: "Ravi Exports", date: "05 Jun 2026", amount: 410640, status: "Sent" },
  { no: "INV-2026-0141", client: "HDFC Traders", date: "04 Jun 2026", amount: 412000, status: "Paid" },
  { no: "INV-2026-0140", client: "Global Impex", date: "03 Jun 2026", amount: 80240, status: "Paid" },
];

const collection = [
  { date: "04 Jun 2026", client: "HDFC Traders", invoice: "INV-2026-0141", amount: 412000, mode: "NEFT" },
  { date: "03 Jun 2026", client: "Global Impex", invoice: "INV-2026-0140", amount: 80240, mode: "RTGS" },
  { date: "02 Jun 2026", client: "Ravi Exports", invoice: "INV-2026-0138", amount: 286400, mode: "Cheque" },
];

export default function BillingPage() {
  const [tab, setTab] = useState<"register" | "collection" | "aging">("aging");

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Billing Reports</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Invoice register · Collections · Outstanding aging</p>
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {[["register", "Invoice Register"], ["collection", "Collection Report"], ["aging", "Outstanding Aging"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id as "register" | "collection" | "aging")} className="px-4 py-2 text-[13px] font-medium border-b-2" style={{ borderColor: tab === id ? "#1565C0" : "transparent", color: tab === id ? "#1565C0" : "#6B7280" }}>{lbl}</button>
        ))}
      </div>

      {tab === "aging" && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { l: "0–30 Days", v: aging.reduce((s, a) => s + a.b0, 0), c: "#059669" },
              { l: "31–60 Days", v: aging.reduce((s, a) => s + a.b30, 0), c: "#1565C0" },
              { l: "61–90 Days", v: aging.reduce((s, a) => s + a.b60, 0), c: "#D97706" },
              { l: "90+ Days", v: aging.reduce((s, a) => s + a.b90, 0), c: "#DC2626" },
            ].map((b) => (
              <div key={b.l} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>{b.l}</div>
                <div className="text-2xl font-bold mt-1" style={{ color: b.c }}>₹{b.v.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <table className="w-full text-[12px]">
              <thead style={{ background: "#F9FAFB" }}>
                <tr>{["Client", "0–30", "31–60", "61–90", "90+", "Total"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {aging.map((a) => (
                  <tr key={a.client} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td className="py-2.5 px-3 font-semibold" style={{ color: "#111827" }}>{a.client}</td>
                    <td className="py-2.5 px-3" style={{ color: "#059669" }}>{a.b0 ? `₹${a.b0.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="py-2.5 px-3" style={{ color: "#1565C0" }}>{a.b30 ? `₹${a.b30.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="py-2.5 px-3" style={{ color: "#D97706" }}>{a.b60 ? `₹${a.b60.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="py-2.5 px-3" style={{ color: "#DC2626" }}>{a.b90 ? `₹${a.b90.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{(a.b0 + a.b30 + a.b60 + a.b90).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "register" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}><tr>{["Invoice No", "Client", "Date", "Amount", "Status"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr></thead>
            <tbody>{register.map((r) => (
              <tr key={r.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{r.no}</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{r.client}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{r.date}</td>
                <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{r.amount.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: r.status === "Paid" ? "#ECFDF5" : "#E3F2FD", color: r.status === "Paid" ? "#059669" : "#1565C0" }}>{r.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {tab === "collection" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}><tr>{["Date", "Client", "Invoice", "Amount", "Mode"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr></thead>
            <tbody>{collection.map((c, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{c.date}</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{c.client}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{c.invoice}</td>
                <td className="py-2.5 px-3 font-bold" style={{ color: "#059669" }}>₹{c.amount.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3" style={{ color: "#374151" }}>{c.mode}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
