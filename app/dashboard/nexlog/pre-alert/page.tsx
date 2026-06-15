"use client";

import { useState } from "react";

const mergeFields = ["{{client_name}}", "{{job_no}}", "{{vessel}}", "{{eta}}", "{{bl_no}}", "{{containers}}"];

export default function PreAlertPage() {
  const [docs, setDocs] = useState<string[]>(["BL", "PL", "CI"]);
  const toggle = (d: string) => setDocs(docs.includes(d) ? docs.filter((x) => x !== d) : [...docs, d]);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Pre Alert Generator</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Auto-compose and send arrival notice to consignee</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Compose</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-medium" style={{ color: "#374151" }}>Select Job</label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }}>
                <option value="">Select job...</option>
                {/* jobs loaded from API */}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium" style={{ color: "#374151" }}>Attach Documents</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["BL", "PL", "CI", "IC", "COO", "BE"].map((d) => (
                  <button key={d} onClick={() => toggle(d)} className="px-2.5 py-1 rounded-md border text-[11px] font-semibold" style={{ background: docs.includes(d) ? "#1565C0" : "#fff", color: docs.includes(d) ? "#fff" : "#374151", borderColor: docs.includes(d) ? "#1565C0" : "#E5E7EB" }}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium" style={{ color: "#374151" }}>Subject</label>
              <input className="w-full mt-1 px-3 py-2 rounded-md border text-[13px] outline-none" style={{ borderColor: "#E5E7EB" }} />
            </div>
            <div>
              <label className="text-[11px] font-medium" style={{ color: "#374151" }}>Body</label>
              <div className="flex flex-wrap gap-1 mt-1 mb-2">
                {mergeFields.map((f) => <button key={f} className="px-2 py-0.5 rounded text-[10px] font-mono" style={{ background: "#E3F2FD", color: "#1565C0" }}>{f}</button>)}
              </div>
              <textarea rows={6} defaultValue={`Dear {{client_name}},\n\nPlease find attached the pre-alert documents for {{job_no}}.\n\nVessel: {{vessel}}\nETA at JNPT: {{eta}}\nBL No: {{bl_no}}\nContainers: {{containers}}\n\nKindly arrange clearance documentation.\n\nRegards,\nNavkar Freight Co.`} className="w-full px-3 py-2 rounded-md border text-[12px] outline-none font-mono" style={{ borderColor: "#E5E7EB" }} />
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 px-4 py-2 rounded-md text-[13px] font-semibold text-white" style={{ background: "#1565C0" }}>Send Pre Alert</button>
              <button className="px-4 py-2 rounded-md text-[13px] font-medium border" style={{ borderColor: "#E5E7EB", color: "#374151" }}>Save Template</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Email Preview</h3>
          <div className="rounded-lg border p-4" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
            <div className="border-b pb-3 mb-3 text-[11px] space-y-1" style={{ borderColor: "#E5E7EB" }}>
              <div><span style={{ color: "#9CA3AF" }}>From:</span> <span style={{ color: "#111827" }}>operations@navkarfreight.com</span></div>
              <div><span style={{ color: "#9CA3AF" }}>To:</span> <span style={{ color: "#111827" }}>consignee@raviexports.com</span></div>
              <div><span style={{ color: "#9CA3AF" }}>Subject:</span> <span style={{ color: "#111827", fontWeight: 600 }}>Cargo Arrival Notice — IMP/2526/089 — MV Pacific Ace</span></div>
            </div>
            <div className="text-[12px] whitespace-pre-line leading-relaxed" style={{ color: "#374151" }}>
{`Dear Ravi Exports,

Please find attached the pre-alert documents for IMP/2526/089.

Vessel: MV Pacific Ace V.2614E
ETA at JNPT: 30 May 2026 (Sat)
BL No: HLCUSHA2614832
Containers: TCNU8456731 / 40HC × 1

Cargo: Electronics, 120 cartons, 12,500 kg, 28.5 CBM
Shipping Line: Hapag-Lloyd
CHA: Apollo World Connect

Kindly arrange clearance documentation and confirm receipt.

Regards,
Priya M
Navkar Freight Co.`}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t" style={{ borderColor: "#E5E7EB" }}>
              {docs.map((d) => (
                <div key={d} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium" style={{ background: "#E3F2FD", color: "#1565C0" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>attach_file</span>{d}.pdf
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
