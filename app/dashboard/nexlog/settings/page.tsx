"use client";

import { useState } from "react";

type SeriesEntry = { code: string; preview: string; desc: string; count: number };
type RateCard = { partner: string; lane: string; rate: string; from: string; to: string; status: string };
type UserEntry = { name: string; email: string; role: string; perms: string[] };

const series: SeriesEntry[] = [];
const rateCards: RateCard[] = [];
const users: UserEntry[] = [];

export default function SettingsPage() {
  const [tab, setTab] = useState<"company" | "series" | "rates" | "users">("company");

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Company profile, number series, rate cards, user permissions</p>
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {[["company", "Company Profile"], ["series", "Job Number Series"], ["rates", "Rate Cards"], ["users", "User Permissions"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id as "company" | "series" | "rates" | "users")} className="px-4 py-2 text-[13px] font-medium border-b-2" style={{ borderColor: tab === id ? "#1565C0" : "transparent", color: tab === id ? "#1565C0" : "#6B7280" }}>{lbl}</button>
        ))}
      </div>

      {tab === "company" && (
        <div className="rounded-xl border p-6 max-w-2xl" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b" style={{ borderColor: "#E5E7EB" }}>
            <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ background: "#E3F2FD" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#1565C0" }}>business</span>
            </div>
            <div>
              <button className="px-3 py-1.5 rounded-md border text-[12px] font-semibold" style={{ borderColor: "#1565C0", color: "#1565C0" }}>Upload Logo</button>
              <div className="text-[10px] mt-1" style={{ color: "#9CA3AF" }}>PNG, JPG up to 2 MB</div>
            </div>
          </div>
          <div className="space-y-4">
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Company Name</label><input defaultValue="Navkar Freight Co." className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>GSTIN</label><input defaultValue="27AAACN1234F1Z5" className="w-full px-3 py-2 rounded-md border text-[13px] outline-none font-mono" style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>PAN</label><input defaultValue="AAACN1234F" className="w-full px-3 py-2 rounded-md border text-[13px] outline-none font-mono" style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>IEC Code</label><input defaultValue="0312012345" className="w-full px-3 py-2 rounded-md border text-[13px] outline-none font-mono" style={{ borderColor: "#E5E7EB" }} /></div>
              <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>CIN</label><input defaultValue="U63090MH2018PTC312345" className="w-full px-3 py-2 rounded-md border text-[13px] outline-none font-mono" style={{ borderColor: "#E5E7EB" }} /></div>
            </div>
            <div><label className="text-[11px] font-medium block mb-1" style={{ color: "#374151" }}>Address</label><textarea rows={3} defaultValue="CFS Road, Sector 12, Nhava Sheva, Navi Mumbai 400707, Maharashtra" className="w-full px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }} /></div>
            <button className="px-4 py-2 rounded-md text-[13px] font-semibold text-white" style={{ background: "#1565C0" }}>Save Changes</button>
          </div>
        </div>
      )}

      {tab === "series" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}>
              <tr>{["Series Code", "Description", "Next No (Preview)", "Issued This FY", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {series.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-[12px]" style={{ color: "#9CA3AF" }}>No data</td></tr>
              ) : series.map((s) => (
                <tr key={s.code} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-3 px-3 font-mono font-bold" style={{ color: "#1565C0" }}>{s.code}</td>
                  <td className="py-3 px-3" style={{ color: "#374151" }}>{s.desc}</td>
                  <td className="py-3 px-3 font-mono" style={{ color: "#111827" }}>{s.preview}</td>
                  <td className="py-3 px-3 font-bold" style={{ color: "#111827" }}>{s.count}</td>
                  <td className="py-3 px-3"><button className="px-2 py-1 rounded text-[11px] font-semibold" style={{ background: "#E3F2FD", color: "#1565C0" }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "rates" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}>
              <tr>{["Partner", "Trade Lane", "Rate", "Valid From", "Valid To", "Status"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rateCards.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-[12px]" style={{ color: "#9CA3AF" }}>No data</td></tr>
              ) : rateCards.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-3 px-3 font-semibold" style={{ color: "#111827" }}>{r.partner}</td>
                  <td className="py-3 px-3" style={{ color: "#374151" }}>{r.lane}</td>
                  <td className="py-3 px-3 font-bold" style={{ color: "#111827" }}>{r.rate}</td>
                  <td className="py-3 px-3" style={{ color: "#6B7280" }}>{r.from}</td>
                  <td className="py-3 px-3" style={{ color: "#6B7280" }}>{r.to}</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: r.status === "ACTIVE" ? "#ECFDF5" : r.status === "EXPIRING" ? "#FFFBEB" : "#FEF2F2", color: r.status === "ACTIVE" ? "#059669" : r.status === "EXPIRING" ? "#1E40AF" : "#DC2626" }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <table className="w-full text-[12px]">
            <thead style={{ background: "#F9FAFB" }}>
              <tr>{["Name", "Email", "Role", "Jobs", "Documents", "Invoicing", "Settings"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-[12px]" style={{ color: "#9CA3AF" }}>No data</td></tr>
              ) : users.map((u) => (
                <tr key={u.email} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td className="py-3 px-3 font-semibold" style={{ color: "#111827" }}>{u.name}</td>
                  <td className="py-3 px-3" style={{ color: "#6B7280" }}>{u.email}</td>
                  <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#E3F2FD", color: "#1565C0" }}>{u.role}</span></td>
                  {["Jobs", "Documents", "Invoicing", "Settings"].map((p) => (
                    <td key={p} className="py-3 px-3"><input type="checkbox" defaultChecked={u.perms.includes("All") || u.perms.includes(p)} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
