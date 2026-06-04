"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const stages = [
  { name: "Job Created", date: "01 May 2026", notes: "Job opened by Priya M", done: true },
  { name: "Cargo Ready", date: "05 May 2026", notes: "Confirmed ex-works ready", done: true },
  { name: "Booking Confirmed", date: "08 May 2026", notes: "Hapag-Lloyd Booking #HLBK7821", done: true },
  { name: "Container Stuffed", date: "12 May 2026", notes: "FCL stuffed at Shanghai depot", done: true },
  { name: "Vessel Sailed", date: "15 May 2026", notes: "MV Pacific Ace V.2614E sailed", done: true },
  { name: "In Transit", date: "18 May 2026", notes: "ETA on track", done: true },
  { name: "Arrived Port", date: "30 May 2026", notes: "Berthed at JNPT", done: true },
  { name: "At Customs", date: "02 Jun 2026", notes: "BE filed, awaiting examination", done: true },
  { name: "Customs Cleared", date: "", notes: "", done: false },
  { name: "CFS Destuffed", date: "", notes: "", done: false },
  { name: "Out for Delivery", date: "", notes: "", done: false },
  { name: "Delivered", date: "", notes: "", done: false },
  { name: "POD Received", date: "", notes: "", done: false },
];

const documents = [
  { type: "BL", label: "Original Bill of Lading", size: "2.4 MB", date: "15 May 2026" },
  { type: "PL", label: "Packing List", size: "180 KB", date: "12 May 2026" },
  { type: "CI", label: "Commercial Invoice", size: "210 KB", date: "12 May 2026" },
  { type: "IC", label: "Insurance Certificate", size: "95 KB", date: "10 May 2026" },
  { type: "BE", label: "Bill of Entry Copy", size: "340 KB", date: "02 Jun 2026" },
];

const charges = [
  { cat: "Ocean Freight", vendor: "Hapag-Lloyd", amount: 142000, gst: 25560, status: "PAID" },
  { cat: "THC", vendor: "JNPT", amount: 18500, gst: 3330, status: "PAID" },
  { cat: "CFS Charges", vendor: "APWC CFS", amount: 24000, gst: 4320, status: "PENDING" },
  { cat: "CHA Service", vendor: "Apollo World", amount: 12000, gst: 2160, status: "PAID" },
  { cat: "Customs Duty", vendor: "Customs", amount: 84000, gst: 0, status: "PAID" },
  { cat: "Transport", vendor: "Sakthi Transport", amount: 18000, gst: 3240, status: "PENDING" },
  { cat: "DO Charges", vendor: "Hapag-Lloyd", amount: 4500, gst: 810, status: "PAID" },
];

const invoices = [
  { no: "INV-2026-0142", date: "05 Jun 2026", amount: 348000, status: "Sent" },
  { no: "INV-2026-0148", date: "08 Jun 2026", amount: 24500, status: "Draft" },
];

const comms = [
  { type: "email", who: "Pre-alert sent to client", time: "30 May 2026 10:14 AM", content: "All cargo arrival documents shared with consignee@raviexports.com" },
  { type: "whatsapp", who: "WhatsApp update to handler", time: "02 Jun 2026 03:22 PM", content: "BE filed, awaiting examination — expected clearance EOD tomorrow" },
  { type: "note", who: "Internal — Priya M", time: "03 Jun 2026 11:00 AM", content: "Customs has asked for additional BIS certificate. Asked client to share." },
];

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [tab, setTab] = useState<"overview" | "timeline" | "documents" | "charges" | "comms">("overview");

  const tabs: { id: typeof tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "info" },
    { id: "timeline", label: "Timeline", icon: "timeline" },
    { id: "documents", label: "Documents", icon: "folder" },
    { id: "charges", label: "Charges & Invoices", icon: "receipt_long" },
    { id: "comms", label: "Communications", icon: "chat" },
  ];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/nexlog/jobs" className="p-1.5 rounded hover:bg-gray-100">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>{id}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#FFFBEB", color: "#D97706" }}>At Customs</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#ECFDF5", color: "#059669" }}>FTA: ASEAN Eligible</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Ravi Exports · Shanghai → JNPT · Sea FCL</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-md border text-[12px] font-medium" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            <span className="material-symbols-outlined inline-block align-middle mr-1" style={{ fontSize: 14 }}>edit</span>Edit
          </button>
          <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>Update Stage</button>
        </div>
      </div>

      <div className="border-b mb-4" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition" style={{ borderColor: tab === t.id ? "#1565C0" : "transparent", color: tab === t.id ? "#1565C0" : "#6B7280" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Basic Details", icon: "info", fields: [["Job Type", "Import"], ["Mode", "Sea FCL"], ["Client", "Ravi Exports Pvt Ltd"], ["Client Ref", "PO/2026/4421"], ["Handler", "Priya M"], ["Status", "Active"]] },
            { title: "Routing", icon: "route", fields: [["Country Origin", "China"], ["POL", "CNSHA Shanghai"], ["POD", "INNSA JNPT"], ["Final Dest", "Pune"]] },
            { title: "Cargo", icon: "inventory_2", fields: [["Commodity", "Electronics — Mobile Accessories"], ["HS Code", "85176290"], ["Packages", "120 Cartons"], ["Gross Wt", "12,500 kg"], ["Net Wt", "11,800 kg"], ["CBM", "28.5"]] },
            { title: "Shipping", icon: "directions_boat", fields: [["Line", "Hapag-Lloyd"], ["Vessel", "MV Pacific Ace"], ["Voyage", "V.2614E"], ["MBL", "HLCUSHA2614832"], ["HBL", "NXL/HBL/2026/089"], ["Sailing Date", "15 May 2026"], ["ETA", "30 May 2026"]] },
            { title: "Customs", icon: "gavel", fields: [["CHA", "Apollo World Connect"], ["BE No", "5821432"], ["BE Date", "02 Jun 2026"], ["Assess Value", "₹8,42,000"], ["Duty Amt", "₹84,000"], ["Exam Type", "Yellow"]] },
            { title: "CFS & Delivery", icon: "warehouse", fields: [["CFS", "APWC CFS Nhava"], ["Gate In", "31 May 2026"], ["Free Days", "10"], ["Transporter", "Sakthi Transport"], ["LR No", "—"], ["Delivery", "Pending"]] },
          ].map((sec) => (
            <div key={sec.title} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#1565C0" }}>{sec.icon}</span>
                <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>{sec.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {sec.fields.map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "#9CA3AF" }}>{k}</div>
                    <div className="text-[12px] font-medium mt-0.5" style={{ color: "#111827" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "timeline" && (
        <div className="rounded-xl border p-6" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="space-y-0">
            {stages.map((s, i) => (
              <div key={s.name} className="flex gap-4 pb-5 relative">
                {i < stages.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-px" style={{ background: s.done ? "#1565C0" : "#E5E7EB" }} />}
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: s.done ? "#1565C0" : "#F3F4F6", color: "#fff" }}>
                  {s.done ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span> : <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-semibold" style={{ color: s.done ? "#111827" : "#9CA3AF" }}>{s.name}</div>
                    {s.done && (
                      <div className="flex items-center gap-3 text-[11px]">
                        <span style={{ color: "#6B7280" }}>{s.date}</span>
                        <label className="flex items-center gap-1" style={{ color: "#6B7280" }}>
                          <input type="checkbox" defaultChecked={i < 6} className="w-3 h-3" /> Notify Client
                        </label>
                        <button className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "#E3F2FD", color: "#1565C0" }}>Attach Doc</button>
                      </div>
                    )}
                  </div>
                  {s.notes && <div className="text-[12px] mt-1" style={{ color: "#6B7280" }}>{s.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div>
          <div className="rounded-xl border-2 border-dashed p-8 text-center mb-4" style={{ borderColor: "#1565C0", background: "#F0F9FF" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#1565C0" }}>cloud_upload</span>
            <div className="text-[14px] font-semibold mt-2" style={{ color: "#111827" }}>Drop files to upload</div>
            <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>PDF, JPG, PNG up to 25 MB · BL, Invoice, Packing List, BE, etc.</div>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <table className="w-full text-[12px]">
              <thead style={{ background: "#F9FAFB" }}>
                <tr>{["Type", "Document", "Size", "Uploaded", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.label} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#E3F2FD", color: "#1565C0" }}>{d.type}</span></td>
                    <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{d.label}</td>
                    <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{d.size}</td>
                    <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{d.date}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex justify-end gap-1">
                        {["visibility", "download", "share", "delete"].map((ic) => (
                          <button key={ic} className="p-1.5 rounded hover:bg-gray-100"><span className="material-symbols-outlined" style={{ fontSize: 15, color: ic === "delete" ? "#DC2626" : "#6B7280" }}>{ic}</span></button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "charges" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
              <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Job Charges</h3>
              <button className="px-2 py-1 rounded text-[11px] font-semibold text-white" style={{ background: "#1565C0" }}>+ Add Charge</button>
            </div>
            <table className="w-full text-[12px]">
              <thead style={{ background: "#F9FAFB" }}>
                <tr>{["Category", "Vendor", "Amount", "GST", "Total", "Status"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {charges.map((c, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{c.cat}</td>
                    <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{c.vendor}</td>
                    <td className="py-2.5 px-3" style={{ color: "#111827" }}>₹{c.amount.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>₹{c.gst.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3 font-semibold" style={{ color: "#111827" }}>₹{(c.amount + c.gst).toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: c.status === "PAID" ? "#ECFDF5" : "#FEF2F2", color: c.status === "PAID" ? "#059669" : "#DC2626" }}>{c.status}</span></td>
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #E5E7EB", background: "#F9FAFB" }}>
                  <td className="py-2.5 px-3 font-bold" colSpan={2} style={{ color: "#111827" }}>Total Cost</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{charges.reduce((s, c) => s + c.amount, 0).toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{charges.reduce((s, c) => s + c.gst, 0).toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-3 font-bold" style={{ color: "#111827" }}>₹{charges.reduce((s, c) => s + c.amount + c.gst, 0).toLocaleString("en-IN")}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Invoices</h3>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div key={inv.no} className="p-3 rounded-lg border" style={{ borderColor: "#E5E7EB" }}>
                  <div className="font-mono text-[11px]" style={{ color: "#1565C0" }}>{inv.no}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>{inv.date}</div>
                  <div className="text-[15px] font-bold mt-1" style={{ color: "#111827" }}>₹{inv.amount.toLocaleString("en-IN")}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: inv.status === "Sent" ? "#E3F2FD" : "#F3F4F6", color: inv.status === "Sent" ? "#1565C0" : "#6B7280" }}>{inv.status}</span>
                  <div className="flex gap-1 mt-2">
                    <button className="flex-1 px-2 py-1 rounded text-[11px] font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>Download</button>
                    <button className="flex-1 px-2 py-1 rounded text-[11px] font-semibold text-white" style={{ background: "#1565C0" }}>Send</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "comms" && (
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="space-y-4 mb-5">
            {comms.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: c.type === "email" ? "#E3F2FD" : c.type === "whatsapp" ? "#ECFDF5" : "#FEF3C7" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: c.type === "email" ? "#1565C0" : c.type === "whatsapp" ? "#059669" : "#92400E" }}>
                    {c.type === "email" ? "mail" : c.type === "whatsapp" ? "chat" : "edit_note"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-semibold" style={{ color: "#111827" }}>{c.who}</div>
                    <div className="text-[11px]" style={{ color: "#9CA3AF" }}>{c.time}</div>
                  </div>
                  <div className="text-[12px] mt-1 p-3 rounded-lg" style={{ color: "#374151", background: "#F9FAFB" }}>{c.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4" style={{ borderColor: "#E5E7EB" }}>
            <textarea rows={3} placeholder="Reply or add a note..." className="w-full p-3 rounded-md border text-[13px] outline-none focus:border-[#1565C0]" style={{ borderColor: "#E5E7EB" }} />
            <div className="flex justify-between mt-2">
              <div className="flex gap-1">
                {[["Email", "mail"], ["WhatsApp", "chat"], ["Internal Note", "edit_note"]].map(([l, ic]) => (
                  <button key={l} className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium" style={{ background: "#F3F4F6", color: "#374151" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{ic}</span>{l}
                  </button>
                ))}
              </div>
              <button className="px-4 py-1.5 rounded text-[12px] font-semibold text-white" style={{ background: "#1565C0" }}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
