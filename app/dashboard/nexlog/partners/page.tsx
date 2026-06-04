"use client";

import { useState } from "react";

const partners: Record<string, { name: string; code: string; gstin?: string; contact: string; phone: string; email: string; country: string }[]> = {
  line: [
    { name: "Hapag-Lloyd", code: "HLCU", gstin: "27AAACH0123A1Z2", contact: "Mr. Sharma", phone: "+91 22 6622 5500", email: "ops.in@hapag-lloyd.com", country: "Germany" },
    { name: "CMA CGM", code: "CMDU", gstin: "27AAACC4567B1Z9", contact: "Ms. Rao", phone: "+91 22 6634 8800", email: "in.bom@cma-cgm.com", country: "France" },
    { name: "Maersk Line", code: "MAEU", gstin: "27AAACM7890C1Z4", contact: "Mr. Khan", phone: "+91 22 6612 2200", email: "in.maersk@maersk.com", country: "Denmark" },
    { name: "MSC", code: "MSCU", gstin: "27AAACM5432D1Z6", contact: "Mr. Joshi", phone: "+91 22 6700 4400", email: "in-info@msc.com", country: "Switzerland" },
  ],
  cfs: [
    { name: "APWC CFS Nhava", code: "APWC", gstin: "27AAACA1111E1Z8", contact: "Mr. Patil", phone: "+91 22 2745 5500", email: "ops@apwc.in", country: "India" },
    { name: "Sanco Trans Chennai", code: "SCTC", gstin: "33AAACS2222F1Z1", contact: "Ms. Kumar", phone: "+91 44 2536 8800", email: "info@sanco.in", country: "India" },
    { name: "Continental CFS JNPT", code: "CCFS", gstin: "27AAACC3333G1Z3", contact: "Mr. Mehra", phone: "+91 22 2723 1100", email: "ops@continentalcfs.in", country: "India" },
  ],
  cha: [
    { name: "Apollo World Connect", code: "AWC/11/2024", gstin: "27AAACA4444H1Z5", contact: "Mr. Verma", phone: "+91 22 2275 4400", email: "cha@apolloworld.in", country: "India" },
    { name: "Sanco Customs Brokers", code: "SCB/14/2023", gstin: "33AAACS5555I1Z7", contact: "Mr. Iyer", phone: "+91 44 2536 9900", email: "cha@sanco.in", country: "India" },
    { name: "Allcargo CHA Services", code: "ACS/09/2024", gstin: "27AAACA6666J1Z9", contact: "Ms. Patel", phone: "+91 22 6618 3300", email: "cha@allcargo.in", country: "India" },
  ],
  transporter: [
    { name: "Sakthi Transport", code: "STT", gstin: "33AAACS7777K1Z2", contact: "Mr. Murugan", phone: "+91 9876543210", email: "ops@sakthitransport.in", country: "India" },
    { name: "VRL Logistics", code: "VRL", gstin: "29AAACV8888L1Z4", contact: "Mr. Hegde", phone: "+91 9123456789", email: "ops@vrl.in", country: "India" },
  ],
  overseas: [
    { name: "Sino Logistics Shanghai", code: "SLSH", contact: "Mr. Zhang", phone: "+86 21 6234 5678", email: "ops@sinolog.cn", country: "China" },
    { name: "Speedmark Hamburg", code: "SPHH", contact: "Mr. Mueller", phone: "+49 40 22833 0", email: "ops@speedmark.de", country: "Germany" },
    { name: "Lotus Cargo Dubai", code: "LCDB", contact: "Mr. Al-Salem", phone: "+971 4 250 8900", email: "ops@lotuscargo.ae", country: "UAE" },
  ],
};

const tabs = [
  { id: "line", label: "Shipping Lines" },
  { id: "cfs", label: "CFS" },
  { id: "cha", label: "CHA" },
  { id: "transporter", label: "Transporters" },
  { id: "overseas", label: "Overseas Agents" },
];

export default function PartnersPage() {
  const [tab, setTab] = useState("line");
  const list = partners[tab];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Partners Master</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Shipping lines, CFS stations, CHAs, transporters & overseas agents</p>
        </div>
        <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ Add Partner</button>
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-4 py-2 text-[13px] font-medium border-b-2" style={{ borderColor: tab === t.id ? "#1565C0" : "transparent", color: tab === t.id ? "#1565C0" : "#6B7280" }}>
            {t.label} ({partners[t.id].length})
          </button>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Name", tab === "line" ? "SCAC" : "Code", "GSTIN", "Contact", "Phone", "Email", "Country"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.code} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-semibold" style={{ color: "#111827" }}>{p.name}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{p.code}</td>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>{p.gstin || "—"}</td>
                <td className="py-2.5 px-3" style={{ color: "#374151" }}>{p.contact}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{p.phone}</td>
                <td className="py-2.5 px-3" style={{ color: "#1565C0" }}>{p.email}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{p.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
