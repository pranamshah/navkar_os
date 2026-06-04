"use client";

import { useState } from "react";
import Link from "next/link";

type Container = { no: string; seal: string; size: string; type: string };

const sectionStyle = { background: "#fff", borderColor: "#E5E7EB" };
const labelCls = "block text-[11px] font-medium mb-1";
const inputCls = "w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#1565C0]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls} style={{ color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5 mb-4" style={sectionStyle}>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#1565C0" }}>{icon}</span>
        <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function NewJobPage() {
  const [containers, setContainers] = useState<Container[]>([
    { no: "", seal: "", size: "20DC", type: "DC" },
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/nexlog/jobs" className="p-1.5 rounded hover:bg-gray-100">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Create New Job</h1>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Fill in cargo and routing details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md border text-[13px] font-medium" style={{ borderColor: "#E5E7EB", color: "#374151" }}>Save as Draft</button>
          <button className="px-4 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#1565C0" }}>Create Job</button>
        </div>
      </div>

      <Section title="Basic Details" icon="info">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Job Type *"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Import</option><option>Export</option><option>Cross Trade</option></select></Field>
          <Field label="Mode *"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Sea FCL</option><option>Sea LCL</option><option>Air</option><option>Surface</option></select></Field>
          <Field label="Job No (auto)"><input className={inputCls} style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }} value="IMP/2526/090" disabled /></Field>
          <Field label="Client *"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Ravi Exports Pvt Ltd</option><option>HDFC Traders</option><option>Global Impex</option></select></Field>
          <Field label="Client Reference"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="PO / Order No" /></Field>
          <Field label="Handler"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Priya M</option><option>Rajesh K</option><option>Anita S</option></select></Field>
        </div>
      </Section>

      <Section title="Routing" icon="route">
        <div className="grid grid-cols-4 gap-4">
          <Field label="Country of Origin"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="China" /></Field>
          <Field label="Port of Loading"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="CNSHA" /></Field>
          <Field label="Port of Discharge"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="INNSA" /></Field>
          <Field label="Final Destination"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="Pune" /></Field>
        </div>
      </Section>

      <Section title="Cargo Details" icon="inventory_2">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Commodity *"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="Electronics" /></Field>
          <Field label="HS Code"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="85176290" /></Field>
          <Field label="Cargo Nature"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>General</option><option>Hazardous</option><option>Reefer</option><option>OOG</option></select></Field>
          <Field label="Packages"><input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="120" /></Field>
          <Field label="Package Type"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Cartons</option><option>Pallets</option><option>Bags</option><option>Drums</option></select></Field>
          <Field label="CBM"><input type="number" step="0.01" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="28.5" /></Field>
          <Field label="Gross Weight (kg)"><input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="12500" /></Field>
          <Field label="Net Weight (kg)"><input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="11800" /></Field>
        </div>
      </Section>

      <Section title="Container Details" icon="inventory">
        <div className="space-y-2">
          {containers.map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-3"><label className={labelCls} style={{ color: "#374151" }}>Container No</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="TCNU8456731" /></div>
              <div className="col-span-3"><label className={labelCls} style={{ color: "#374151" }}>Seal No</label><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="SL789432" /></div>
              <div className="col-span-2"><label className={labelCls} style={{ color: "#374151" }}>Size</label><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>20DC</option><option>40DC</option><option>40HC</option><option>20RF</option><option>40RF</option></select></div>
              <div className="col-span-2"><label className={labelCls} style={{ color: "#374151" }}>Type</label><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>DC</option><option>HC</option><option>RF</option><option>OT</option><option>FR</option></select></div>
              <div className="col-span-2 flex gap-1">
                <button onClick={() => setContainers([...containers, { no: "", seal: "", size: "20DC", type: "DC" }])} className="px-3 py-2 rounded-md text-[12px] font-semibold" style={{ background: "#E3F2FD", color: "#1565C0" }}>+ Add</button>
                {containers.length > 1 && <button onClick={() => setContainers(containers.filter((_, k) => k !== i))} className="px-3 py-2 rounded-md text-[12px]" style={{ background: "#FEF2F2", color: "#DC2626" }}>×</button>}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shipping Details" icon="directions_boat">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Shipping Line"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Hapag-Lloyd</option><option>CMA CGM</option><option>Maersk</option><option>MSC</option><option>Evergreen</option></select></Field>
          <Field label="Liner Booking Ref"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Vessel"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="MV Pacific Ace" /></Field>
          <Field label="Voyage No"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="V.2614E" /></Field>
          <Field label="MBL No"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="HBL No"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Sailing Date"><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="ETA"><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Free Days"><input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} defaultValue="10" /></Field>
        </div>
      </Section>

      <Section title="Customs Details" icon="gavel">
        <div className="grid grid-cols-3 gap-4">
          <Field label="CHA Name"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Apollo World Connect</option><option>Sanco Trans</option><option>Allcargo</option></select></Field>
          <Field label="BE/SB No"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="BE/SB Date"><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Assess Value (₹)"><input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Duty Amount (₹)"><input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Exam Type"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Green</option><option>Yellow</option><option>Red</option></select></Field>
        </div>
      </Section>

      <Section title="CFS Details" icon="warehouse">
        <div className="grid grid-cols-3 gap-4">
          <Field label="CFS Name"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>APWC CFS Nhava</option><option>Sanco Trans Chennai</option><option>Continental CFS</option></select></Field>
          <Field label="Gate In Date"><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="IGM No"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Destuff Date"><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
        </div>
      </Section>

      <Section title="Delivery Details" icon="local_shipping">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Transporter"><select className={inputCls} style={{ borderColor: "#E5E7EB" }}><option>Sakthi Transport</option><option>VRL Logistics</option><option>TCI Freight</option></select></Field>
          <Field label="Vehicle Nos"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="MH04AB1234" /></Field>
          <Field label="LR No"><input className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Gate Out Date"><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
          <Field label="Delivery Date"><input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} /></Field>
        </div>
        <div className="mt-4">
          <label className={labelCls} style={{ color: "#374151" }}>Internal Notes</label>
          <textarea rows={3} className={inputCls} style={{ borderColor: "#E5E7EB", resize: "vertical" }} placeholder="Notes for internal team only..." />
        </div>
      </Section>

      <div className="flex justify-end gap-2 sticky bottom-0 pt-4">
        <button className="px-4 py-2 rounded-md border text-[13px] font-medium" style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}>Cancel</button>
        <button className="px-4 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#1565C0" }}>Create Job</button>
      </div>
    </div>
  );
}
