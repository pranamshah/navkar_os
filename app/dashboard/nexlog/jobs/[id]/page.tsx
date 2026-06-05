"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const stages = [
  { name: "Job Created", date: "", notes: "", done: false },
  { name: "Cargo Ready", date: "", notes: "", done: false },
  { name: "Booking Confirmed", date: "", notes: "", done: false },
  { name: "Container Stuffed", date: "", notes: "", done: false },
  { name: "Vessel Sailed", date: "", notes: "", done: false },
  { name: "In Transit", date: "", notes: "", done: false },
  { name: "Arrived Port", date: "", notes: "", done: false },
  { name: "At Customs", date: "", notes: "", done: false },
  { name: "Customs Cleared", date: "", notes: "", done: false },
  { name: "CFS Destuffed", date: "", notes: "", done: false },
  { name: "Out for Delivery", date: "", notes: "", done: false },
  { name: "Delivered", date: "", notes: "", done: false },
  { name: "POD Received", date: "", notes: "", done: false },
];

const documents: { type: string; label: string; size: string; date: string }[] = [];

const charges: { cat: string; vendor: string; amount: number; gst: number; status: string }[] = [];

const invoices: { no: string; date: string; amount: number; status: string }[] = [];

const comms: { type: string; who: string; time: string; content: string }[] = [];

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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#F3F4F6", color: "#6B7280" }}>Pending</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>— · — · —</p>
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
            { title: "Basic Details", icon: "info", fields: [["Job Type", "—"], ["Mode", "—"], ["Client", "—"], ["Client Ref", "—"], ["Handler", "—"], ["Status", "—"]] },
            { title: "Routing", icon: "route", fields: [["Country Origin", "—"], ["POL", "—"], ["POD", "—"], ["Final Dest", "—"]] },
            { title: "Cargo", icon: "inventory_2", fields: [["Commodity", "—"], ["HS Code", "—"], ["Packages", "—"], ["Gross Wt", "—"], ["Net Wt", "—"], ["CBM", "—"]] },
            { title: "Shipping", icon: "directions_boat", fields: [["Line", "—"], ["Vessel", "—"], ["Voyage", "—"], ["MBL", "—"], ["HBL", "—"], ["Sailing Date", "—"], ["ETA", "—"]] },
            { title: "Customs", icon: "gavel", fields: [["CHA", "—"], ["BE No", "—"], ["BE Date", "—"], ["Assess Value", "—"], ["Duty Amt", "—"], ["Exam Type", "—"]] },
            { title: "CFS & Delivery", icon: "warehouse", fields: [["CFS", "—"], ["Gate In", "—"], ["Free Days", "—"], ["Transporter", "—"], ["LR No", "—"], ["Delivery", "—"]] },
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
                {documents.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-[12px]" style={{ color: "#6B7280" }}>No documents uploaded yet.</td></tr>
                ) : documents.map((d) => (
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
                {charges.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-[12px]" style={{ color: "#6B7280" }}>No charges added yet.</td></tr>
                ) : (
                  <>
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
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Invoices</h3>
            <div className="space-y-2">
              {invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>receipt_long</span>
                  <p className="text-[12px]" style={{ color: "#7e7576" }}>No invoices yet.</p>
                </div>
              ) : invoices.map((inv) => (
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
            {comms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>chat</span>
                <p className="text-[12px]" style={{ color: "#7e7576" }}>No communications yet.</p>
              </div>
            ) : comms.map((c, i) => (
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
