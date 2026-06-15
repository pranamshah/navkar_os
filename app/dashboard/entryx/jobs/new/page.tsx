"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ACCENT = "#1E40AF";

const sectionStyle = { background: "#fff", borderColor: "#E5E7EB" };
const labelCls = "block text-[11px] font-medium mb-1";
const inputCls = "w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#1E40AF]";

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
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: ACCENT }}>{icon}</span>
        <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function NewEntryXJobPage() {
  const router = useRouter();
  const [toast, setToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => {
      setToast(false);
      router.push("/dashboard/entryx/jobs");
    }, 2200);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-[13px] font-medium text-white flex items-center gap-2"
          style={{ background: "#1E40AF" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
          Coming soon — Job creation will be available shortly
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/entryx/jobs" className="p-1.5 rounded hover:bg-gray-100">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>arrow_back</span>
          </Link>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Create New Job</h1>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Fill in customs clearance job details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/entryx/jobs"
            className="px-4 py-2 rounded-md border text-[13px] font-medium"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="new-job-form"
            className="px-4 py-2 rounded-md text-[13px] font-medium text-white"
            style={{ background: ACCENT }}
          >
            Create Job
          </button>
        </div>
      </div>

      <form id="new-job-form" onSubmit={handleSubmit}>
        {/* Section 1 - Basic */}
        <Section title="Basic Details" icon="info">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Job Type *">
              <div className="flex gap-3 mt-1">
                {["Import", "Export"].map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: "#374151" }}>
                    <input type="radio" name="jobType" value={t} defaultChecked={t === "Import"} className="accent-[#1E40AF]" />
                    {t}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Mode *">
              <div className="flex gap-3 mt-1">
                {["Sea", "Air", "Land"].map((m) => (
                  <label key={m} className="flex items-center gap-1.5 text-[13px] cursor-pointer" style={{ color: "#374151" }}>
                    <input type="radio" name="mode" value={m} defaultChecked={m === "Sea"} className="accent-[#1E40AF]" />
                    {m}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Job No (auto)">
              <input
                className={inputCls}
                style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}
                value="CHA/2526/001"
                disabled
              />
            </Field>
            <Field label="Client *">
              <input
                className={inputCls}
                style={{ borderColor: "#E5E7EB" }}
                placeholder="Enter client name"
              />
            </Field>
            <Field label="Client IEC">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="IEC Code" />
            </Field>
            <Field label="Handler">
              <select className={inputCls} style={{ borderColor: "#E5E7EB" }}>
                <option>Priya M</option>
                <option>Rajesh K</option>
                <option>Anita S</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* Section 2 - Cargo */}
        <Section title="Cargo Details" icon="inventory_2">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Commodity *">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="Electronics" />
            </Field>
            <Field label="HS Code">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="85176290" />
            </Field>
            <Field label="Packages">
              <input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="120" />
            </Field>
            <Field label="Gross Weight (kg)">
              <input type="number" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="12500" />
            </Field>
            <Field label="Country of Origin">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="China" />
            </Field>
            <Field label="Port of Loading">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="CNSHA" />
            </Field>
            <Field label="Port of Discharge">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="INNSA" />
            </Field>
          </div>
        </Section>

        {/* Section 3 - Vessel/Flight */}
        <Section title="Vessel / Flight Details" icon="directions_boat">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Shipping Line / Airline">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="Hapag-Lloyd" />
            </Field>
            <Field label="Vessel / Flight No">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="MV Pacific Ace" />
            </Field>
            <Field label="Voyage / Flight">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="V.2614E" />
            </Field>
            <Field label="BL No / AWB No">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="HLCUSHA2614832" />
            </Field>
            <Field label="IGM No">
              <input className={inputCls} style={{ borderColor: "#E5E7EB" }} />
            </Field>
            <Field label="Arrival Date">
              <input type="date" className={inputCls} style={{ borderColor: "#E5E7EB" }} />
            </Field>
          </div>
        </Section>

        {/* Section 4 - Valuation */}
        <Section title="Valuation" icon="account_balance">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Invoice Value *">
              <input type="number" step="0.01" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="50000" />
            </Field>
            <Field label="Currency">
              <select className={inputCls} style={{ borderColor: "#E5E7EB" }}>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
                <option>CNY</option>
                <option>INR</option>
              </select>
            </Field>
            <Field label="Incoterms">
              <select className={inputCls} style={{ borderColor: "#E5E7EB" }}>
                <option>CIF</option>
                <option>FOB</option>
                <option>CFR</option>
                <option>EXW</option>
                <option>DDP</option>
                <option>DAP</option>
              </select>
            </Field>
            <Field label="Freight (USD)">
              <input type="number" step="0.01" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="1800" />
            </Field>
            <Field label="Insurance (USD)">
              <input type="number" step="0.01" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="55" />
            </Field>
            <Field label="Exchange Rate (₹)">
              <input type="number" step="0.01" className={inputCls} style={{ borderColor: "#E5E7EB" }} placeholder="83.25" />
            </Field>
          </div>
        </Section>

        <div className="flex justify-end gap-2 sticky bottom-0 pt-4 pb-2">
          <Link
            href="/dashboard/entryx/jobs"
            className="px-4 py-2 rounded-md border text-[13px] font-medium"
            style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-[13px] font-medium text-white"
            style={{ background: ACCENT }}
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}
