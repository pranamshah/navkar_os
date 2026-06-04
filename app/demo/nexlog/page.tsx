"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";


/* ─────────────────────────────────────────────────────────── */
/* MODULE TABS                                                 */
/* ─────────────────────────────────────────────────────────── */
const MODULES = [
  { id: "dashboard",   label: "Dashboard",   icon: "dashboard" },
  { id: "jobdetail",   label: "Job Detail",  icon: "inventory_2" },
  { id: "jobs",        label: "Jobs List",   icon: "list_alt" },
  { id: "prealert",    label: "Pre Alert",   icon: "mark_email_read" },
  { id: "invoicing",   label: "Invoicing",   icon: "receipt_long" },
  { id: "tracking",    label: "Tracking",    icon: "directions_boat" },
  { id: "crm",         label: "CRM",         icon: "groups" },
  { id: "docai",       label: "DocAI",       icon: "auto_awesome" },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS                                                */
/* ─────────────────────────────────────────────────────────── */
function DashboardScreen() {
  const kpis = [
    { label: "Active Jobs",       value: "24",         change: "+3 today",   up: true  },
    { label: "Import Jobs",       value: "15",         change: "62% of mix", up: true  },
    { label: "Export Jobs",       value: "9",          change: "38% of mix", up: true  },
    { label: "Pending Customs",   value: "6",          change: "2 urgent",   up: false },
    { label: "Revenue MTD",       value: "₹12,84,500", change: "+18%",       up: true  },
    { label: "Outstanding",       value: "₹3,42,000",  change: "8 invoices", up: false },
  ];
  const bars = [38, 44, 52, 48, 61, 58, 72, 68, 80, 76, 88, 94];
  const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"];

  return (
    <div className="h-full overflow-y-auto p-3 space-y-3" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
            <p style={{ color: "#6B7280", fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</p>
            <p className="font-bold" style={{ fontSize: "13px", color: "#111827" }}>{k.value}</p>
            <p className="mt-0.5" style={{ color: k.up ? "#059669" : "#D97706", fontSize: "9px" }}>{k.change}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg p-3" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        <p className="font-semibold mb-2" style={{ color: "#111827", fontSize: "10px" }}>Jobs Closed — Last 12 Months</p>
        <div className="flex items-end gap-1 h-14">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-sm" style={{ height: `${h * 0.55}px`, background: "#1565C0", opacity: i === 11 ? 1 : 0.55 }} />
              <p style={{ fontSize: "6px", color: "#9CA3AF" }}>{months[i]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {[
          { text: "IMP/2526/086 stuck at customs > 5 days", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { text: "TCNU8456731 — 1 free day left, detention ₹4500/day", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
          { text: "Hapag-Lloyd Shanghai-JNPT rate expired 31 May", color: "#1565C0", bg: "#E3F2FD", border: "#BBDEFB" },
        ].map((a) => (
          <div key={a.text} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: a.bg, border: `1px solid ${a.border}` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: a.color }} />
            <p style={{ fontSize: "9.5px", color: "#374151" }}>{a.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobDetailScreen() {
  const fields = [
    ["Job No", "IMP/2526/089"],
    ["Client", "Ravi Exports"],
    ["Mode", "SEA IMPORT"],
    ["BL No", "HLCUSHA2614832"],
    ["Vessel", "MV Pacific Ace V.2614E"],
    ["POL", "CNSHA Shanghai"],
    ["POD", "INNSA Nhava Sheva"],
    ["Container", "TCNU8456731 (40HC)"],
    ["ETA", "30 May 2026"],
    ["Stage", "AT JNPT"],
  ];
  const timeline = [
    { stage: "Booking Confirmed", date: "12 May", done: true },
    { stage: "Gate-In Origin", date: "14 May", done: true },
    { stage: "Vessel Sailed", date: "16 May", done: true },
    { stage: "In Transit", date: "—", done: true },
    { stage: "Arrived JNPT", date: "30 May", done: true },
    { stage: "Customs Cleared", date: "—", done: false },
    { stage: "CFS Out", date: "—", done: false },
    { stage: "Delivered", date: "—", done: false },
  ];

  return (
    <div className="h-full overflow-y-auto p-3" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-mono font-bold" style={{ fontSize: "11px", color: "#1565C0" }}>IMP/2526/089</p>
          <p style={{ fontSize: "9px", color: "#6B7280" }}>Ravi Exports · Shanghai → JNPT</p>
        </div>
        <span className="px-2 py-0.5 rounded-full" style={{ background: "#E3F2FD", color: "#1565C0", fontSize: "8px", fontWeight: 700 }}>AT JNPT</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {fields.map(([k, v]) => (
          <div key={k} className="rounded-md p-2" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: "7.5px", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</p>
            <p style={{ fontSize: "10px", color: "#111827", fontWeight: 600 }}>{v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        <p style={{ fontSize: "9px", color: "#111827", fontWeight: 700, marginBottom: "6px" }}>Timeline</p>
        <div className="space-y-1.5">
          {timeline.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: t.done ? "#059669" : "#D1D5DB" }} />
              <p style={{ fontSize: "9px", color: t.done ? "#111827" : "#9CA3AF", fontWeight: t.done ? 600 : 400, flex: 1 }}>{t.stage}</p>
              <p style={{ fontSize: "8px", color: "#6B7280" }}>{t.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JobsListScreen() {
  const rows = [
    { no: "IMP/2526/089", client: "Ravi Exports",     mode: "SEA", stage: "AT JNPT",       eta: "30 May" },
    { no: "EXP/2526/044", client: "HDFC Traders",     mode: "SEA", stage: "VESSEL SAILED", eta: "12 Jun" },
    { no: "AIR/2526/032", client: "Global Impex",     mode: "AIR", stage: "IN TRANSIT",    eta: "08 Jun" },
    { no: "IMP/2526/088", client: "Sunrise Logistics", mode: "SEA", stage: "CUSTOMS",      eta: "29 May" },
    { no: "IMP/2526/087", client: "Bharat Heavy",     mode: "SEA", stage: "CFS OUT",      eta: "28 May" },
    { no: "EXP/2526/043", client: "Sakthi Cargo",     mode: "SEA", stage: "GATE-IN",       eta: "15 Jun" },
  ];
  const sc: Record<string, string> = {
    "AT JNPT": "#1565C0", "VESSEL SAILED": "#7C3AED", "IN TRANSIT": "#0891B2",
    "CUSTOMS": "#D97706", "CFS OUT": "#059669", "GATE-IN": "#475569",
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-2 px-3 py-2 sticky top-0" style={{ background: "#F8FAFC", borderBottom: "1px solid #E5E7EB" }}>
        <input placeholder="Search jobs…" className="text-[10px] px-2 py-1 rounded-md flex-1" style={{ background: "#fff", border: "1px solid #E5E7EB" }} readOnly />
        {["All", "Sea", "Air"].map((f, i) => (
          <button key={f} className="px-2 py-1 rounded-md" style={{ background: i === 0 ? "#1565C0" : "#fff", color: i === 0 ? "#fff" : "#374151", fontSize: "9px", fontWeight: 600, border: "1px solid #E5E7EB" }}>{f}</button>
        ))}
      </div>
      <table className="w-full" style={{ fontSize: "9px" }}>
        <thead>
          <tr style={{ background: "#F9FAFB" }}>
            {["Job No", "Client", "Mode", "Stage", "ETA"].map((h) => (
              <th key={h} className="text-left px-3 py-2 font-semibold" style={{ color: "#6B7280", fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.no} style={{ borderTop: "1px solid #F3F4F6", background: "#fff" }}>
              <td className="px-3 py-2 font-mono font-bold" style={{ color: "#1565C0" }}>{r.no}</td>
              <td className="px-3 py-2 font-semibold" style={{ color: "#111827" }}>{r.client}</td>
              <td className="px-3 py-2" style={{ color: "#6B7280" }}>{r.mode}</td>
              <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded-full" style={{ background: `${sc[r.stage]}18`, color: sc[r.stage], fontSize: "8px", fontWeight: 700 }}>{r.stage}</span></td>
              <td className="px-3 py-2" style={{ color: "#6B7280" }}>{r.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreAlertScreen() {
  return (
    <div className="h-full overflow-y-auto p-3 space-y-2" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="rounded-md p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        <p style={{ fontSize: "9px", color: "#111827", fontWeight: 700, marginBottom: "5px" }}>Select Job</p>
        <div className="rounded px-2 py-1.5 mb-2" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", fontSize: "9px", color: "#374151" }}>IMP/2526/089 — Ravi Exports — Shanghai → JNPT ▾</div>
        <button className="w-full py-1.5 rounded-md font-bold text-white flex items-center justify-center gap-1" style={{ background: "#7C3AED", fontSize: "9px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 11 }}>auto_awesome</span>
          AI: Auto-extract & Generate
        </button>
        <div className="mt-2 p-2 rounded" style={{ background: "#F5F3FF", color: "#5B21B6", fontSize: "8.5px" }}>AI extracted 12 fields from BL · Pre-alert composed · Ready to send</div>
      </div>
      <div className="rounded-md p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        <p style={{ fontSize: "9px", color: "#111827", fontWeight: 700, marginBottom: "5px" }}>Email Preview</p>
        <div className="rounded p-2" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", fontSize: "8.5px", color: "#374151", lineHeight: 1.6 }}>
          <p style={{ fontWeight: 700, color: "#111827", marginBottom: "4px" }}>Cargo Arrival Notice — IMP/2526/089</p>
          <p>Dear Ravi Exports,</p>
          <p className="mt-1">Vessel MV Pacific Ace V.2614E carrying your shipment will arrive JNPT on 30 May 2026.</p>
          <p className="mt-1">Container: TCNU8456731 (40HC)<br />BL: HLCUSHA2614832<br />Cargo: 120 CTNS / 12,500 kg / 28.5 CBM<br />Free Days: 10 from gate-in</p>
          <p className="mt-1">Kindly action clearance.</p>
        </div>
      </div>
    </div>
  );
}

function InvoicingScreen() {
  const charges = [
    { sac: "996521", desc: "Ocean Freight",        amt: "₹1,52,500", gst: "5%" },
    { sac: "996521", desc: "THC at JNPT",          amt: "₹18,200",   gst: "18%" },
    { sac: "998540", desc: "CHA Service Fee",      amt: "₹12,000",   gst: "18%" },
    { sac: "996713", desc: "CFS Handling",         amt: "₹8,400",    gst: "18%" },
    { sac: "996791", desc: "Transport JNPT→Bhiwandi", amt: "₹14,500", gst: "12%" },
  ];

  return (
    <div className="h-full overflow-y-auto p-3" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-mono font-bold" style={{ fontSize: "11px", color: "#1565C0" }}>INV-2026-0142</p>
          <p style={{ fontSize: "9px", color: "#6B7280" }}>Ravi Exports · IMP/2526/089</p>
        </div>
        <span className="px-2 py-0.5 rounded-full" style={{ background: "#E3F2FD", color: "#1565C0", fontSize: "8px", fontWeight: 700 }}>DRAFT</span>
      </div>
      <table className="w-full mb-2" style={{ fontSize: "8.5px", background: "#fff", border: "1px solid #E5E7EB" }}>
        <thead>
          <tr style={{ background: "#F9FAFB" }}>
            {["SAC", "Description", "Amount", "GST"].map((h) => (
              <th key={h} className="text-left px-2 py-1.5 font-semibold" style={{ color: "#6B7280", fontSize: "7.5px", textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {charges.map((c, i) => (
            <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
              <td className="px-2 py-1.5 font-mono" style={{ color: "#1565C0" }}>{c.sac}</td>
              <td className="px-2 py-1.5" style={{ color: "#111827" }}>{c.desc}</td>
              <td className="px-2 py-1.5 font-bold" style={{ color: "#111827" }}>{c.amt}</td>
              <td className="px-2 py-1.5" style={{ color: "#6B7280" }}>{c.gst}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="rounded-md p-2.5 space-y-1" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        {[["Taxable", "₹2,05,600"], ["IGST", "₹17,540"], ["Round Off", "—"]].map(([l, v]) => (
          <div key={l} className="flex justify-between" style={{ fontSize: "9px", color: "#6B7280" }}>
            <span>{l}</span><span style={{ color: "#111827", fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div className="flex justify-between pt-1 mt-1" style={{ borderTop: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#111827" }}>Grand Total</span>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#1565C0" }}>₹2,23,140</span>
        </div>
      </div>
    </div>
  );
}

function TrackingScreen() {
  const ships = [
    { vessel: "MV Pacific Ace V.2614E", imo: "9234567", pos: "Indian Ocean", eta: "30 May", delay: "+1d",  color: "#D97706" },
    { vessel: "MV MSC Gulsun",          imo: "9778123", pos: "Suez Canal",    eta: "22 Jun", delay: "+7d",  color: "#DC2626" },
    { vessel: "MV CMA CGM Marco Polo",  imo: "9454436", pos: "Singapore",     eta: "08 Jun", delay: "On-time", color: "#059669" },
    { vessel: "MV Maersk Honam",        imo: "9784271", pos: "Red Sea",       eta: "18 Jun", delay: "On-time", color: "#059669" },
  ];

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="flex gap-1 mb-1">
        {["Sea", "Air", "Surface"].map((m, i) => (
          <button key={m} className="px-2 py-1 rounded" style={{ background: i === 0 ? "#1565C0" : "#fff", color: i === 0 ? "#fff" : "#374151", fontSize: "9px", fontWeight: 600, border: "1px solid #E5E7EB" }}>{m}</button>
        ))}
      </div>
      {ships.map((s) => (
        <div key={s.imo} className="rounded-md p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
          <div className="flex items-center justify-between mb-1">
            <p style={{ fontSize: "10px", color: "#111827", fontWeight: 700 }}>{s.vessel}</p>
            <span className="px-1.5 py-0.5 rounded-full" style={{ background: `${s.color}18`, color: s.color, fontSize: "8px", fontWeight: 700 }}>{s.delay}</span>
          </div>
          <div className="flex items-center gap-3" style={{ fontSize: "8.5px", color: "#6B7280" }}>
            <span>IMO {s.imo}</span>
            <span>·</span>
            <span>{s.pos}</span>
            <span>·</span>
            <span>ETA {s.eta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CrmScreen() {
  const cols = [
    { name: "New",       count: 4, color: "#6B7280", items: ["Ace Plastics — air to Dubai", "BlueCom — sea LCL ex Hamburg"] },
    { name: "Qualified", count: 3, color: "#0891B2", items: ["GreenLeaf — 4×40HC monthly", "DesiCart — air ex Chennai"] },
    { name: "Quoted",    count: 5, color: "#7C3AED", items: ["MetalCo — FCL Hamburg", "TileMart — LCL Antwerp"] },
    { name: "Won",       count: 2, color: "#059669", items: ["Apex Pharma — ongoing", "Spice King — quarterly"] },
  ];

  return (
    <div className="h-full overflow-y-auto p-3" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="grid grid-cols-4 gap-2">
        {cols.map((c) => (
          <div key={c.name} className="rounded-md p-2" style={{ background: "#fff", border: "1px solid #E5E7EB", minHeight: "180px" }}>
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: "9px", color: c.color, fontWeight: 700, textTransform: "uppercase" }}>{c.name}</p>
              <span style={{ fontSize: "9px", color: c.color, fontWeight: 700 }}>{c.count}</span>
            </div>
            <div className="space-y-1.5">
              {c.items.map((it) => (
                <div key={it} className="rounded p-1.5" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", fontSize: "8.5px", color: "#374151" }}>{it}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocAiScreen() {
  const fields = [
    ["BL No", "HLCUSHA2614832"],
    ["Vessel", "MV Pacific Ace"],
    ["POL", "CNSHA"],
    ["POD", "INNSA"],
    ["Container", "TCNU8456731"],
    ["Seal", "SL789432"],
    ["Gross Wt", "12,500 kg"],
    ["CBM", "28.500"],
    ["Shipper", "Shanghai Electronics"],
    ["Consignee", "Ravi Exports"],
  ];

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <div className="rounded-md border-2 border-dashed p-4 flex flex-col items-center" style={{ borderColor: "#7C3AED", background: "#F5F3FF" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#7C3AED" }}>document_scanner</span>
        <p style={{ fontSize: "10px", color: "#111827", fontWeight: 700, marginTop: "4px" }}>Drop BL / Invoice / Packing List</p>
        <p style={{ fontSize: "8.5px", color: "#6B7280" }}>PDF, JPG, PNG · Up to 25 MB</p>
      </div>
      <div className="rounded-md p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p style={{ fontSize: "9px", color: "#111827", fontWeight: 700 }}>Extracted Fields</p>
            <p style={{ fontSize: "8px", color: "#059669" }}>BL_Shanghai.pdf · 98% confidence</p>
          </div>
          <span className="px-1.5 py-0.5 rounded-full" style={{ background: "#ECFDF5", color: "#059669", fontSize: "7.5px", fontWeight: 700 }}>READY</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {fields.map(([k, v]) => (
            <div key={k}>
              <p style={{ fontSize: "7.5px", color: "#9CA3AF", textTransform: "uppercase" }}>{k}</p>
              <p style={{ fontSize: "9px", color: "#111827", fontWeight: 600 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  dashboard: <DashboardScreen />,
  jobdetail: <JobDetailScreen />,
  jobs:      <JobsListScreen />,
  prealert:  <PreAlertScreen />,
  invoicing: <InvoicingScreen />,
  tracking:  <TrackingScreen />,
  crm:       <CrmScreen />,
  docai:     <DocAiScreen />,
};

/* ─────────────────────────────────────────────────────────── */
/* FEATURES                                                    */
/* ─────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "dashboard",          title: "Ops Dashboard",          desc: "6 live KPIs, recent jobs, alerts for stuck jobs, expiring free days, rate-card expiries." },
  { icon: "inventory_2",        title: "Job Management",         desc: "Import/Export/Air jobs with 13-stage timeline, container details, charges, comms — all in one place." },
  { icon: "groups",             title: "CRM Pipeline",           desc: "Kanban for leads, enquiry tracker, quotation builder with multi-carrier rate comparison." },
  { icon: "description",        title: "Document Hub",           desc: "BL, HBL, MAWB, Invoice, Packing List per job — shareable links for clients with expiry." },
  { icon: "mark_email_read",    title: "Smart Pre-Alert",        desc: "AI reads BL, auto-composes Cargo Arrival Notice with vessel, ETA, container, free days." },
  { icon: "auto_awesome",       title: "DocAI Scanner",          desc: "Drop a BL → extract 12+ fields with 98% confidence → pre-fill new job in one click." },
  { icon: "directions_boat",    title: "Vessel + Flight Tracking", desc: "IMO-based vessel position, AWB live tracking, surface tracker with delay alerts." },
  { icon: "receipt_long",       title: "GST Invoicing",          desc: "SAC-coded freight invoice with CGST/SGST/IGST auto-calc, amount-in-words, bank details." },
  { icon: "trending_up",        title: "Per-Job P&L",            desc: "Live margin per shipment — every charge captured, every cost reconciled. Best lane, worst job." },
  { icon: "price_change",       title: "Rate Cards",             desc: "Versioned partner rates with valid-from/valid-to, expiry alerts, multi-carrier comparison." },
  { icon: "warning",            title: "Anomaly Detection",      desc: "Duplicate BLs, invoices without charges, jobs stuck > 5 days, container free-day expiries." },
  { icon: "auto_graph",         title: "DSR + MIS Reports",      desc: "Auto-scheduled Daily Status Reports per client. MIS, GP report, billing aging — one click." },
];

/* ─────────────────────────────────────────────────────────── */
/* FAQ                                                         */
/* ─────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Does Nexlog cover everything a freight forwarder needs?", a: "Yes. Every feature an Indian C&F agent or freight forwarder needs — job management, CRM, documents, pre-alerts, tracking, invoicing, GP reporting — is in Nexlog. Plus AI features (DocAI, anomaly detection) that no legacy ERP has." },
  { q: "How does Nexlog connect to Accura accounting?", a: "When you raise a Nexlog invoice, Accura automatically records the income entry. When you log a vendor charge on a job, Accura creates the expense. Zero double-entry between operations and accounts." },
  { q: "Can clients track their shipments without logging in?", a: "Yes. Every job has a shareable tracking link — clients see stage updates, ETA, documents (if you've enabled sharing) without needing a Nexlog login." },
  { q: "What does the DocAI scanner actually do?", a: "Drop a BL PDF — it extracts BL no, vessel, ports, container, seal, weights, CBM, shipper, consignee, cargo description. 98% accurate on standard carrier BLs. One click pre-fills a new job." },
  { q: "Is Nexlog billed separately or with NavkarOS suite?", a: "Both options. Nexlog standalone is ₹2,499/mo. Full Suite (Nexlog + Accura + EntryX + DockIQ + RunDesk) is ₹4,999/mo and saves 60%." },
];

/* ─────────────────────────────────────────────────────────── */
/* PAGE                                                        */
/* ─────────────────────────────────────────────────────────── */
export default function NexlogDemoPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const hasNexlog = isAdmin || (session?.user as { subscriptions?: { product: string; status: string }[] } | undefined)?.subscriptions?.some(
    (s) => (s.product === "NEXLOG" || s.product === "FULL_SUITE") && (s.status === "ACTIVE" || s.status === "TRIAL")
  );
  const ctaHref = hasNexlog ? "/dashboard/nexlog" : session ? "/pricing" : "/signup";
  const ctaLabel = hasNexlog ? "Open Nexlog →" : "Start Free Trial";

  const [activeModule, setActiveModule] = useState("dashboard");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden" style={{ background: "#0A1628" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(21,101,192,1) 1px,transparent 1px),linear-gradient(90deg,rgba(21,101,192,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{ background: "rgba(21,101,192,0.15)", borderColor: "rgba(21,101,192,0.35)", color: "#60A5FA" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>navigation</span>
              Freight Forwarding · Built for Indian C&F
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Your ops team will thank you<br />
              <span style={{ color: "#60A5FA" }}>for switching to Nexlog.</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
              Freight-specific OS for import, export and air jobs. AI pre-alerts, real-time tracking, per-job P&L, auto-GST invoices — all wired to Accura for zero double-entry.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: "#1565C0", color: "#fff" }}>
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#demo" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider border transition-all duration-200 hover:border-[#60A5FA] hover:text-[#60A5FA]"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                See Live Demo ↓
              </a>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "45 min → 30s", sub: "Pre-alert with DocAI" },
              { val: "1 click",      sub: "GST invoice from job" },
              { val: "13 stages",    sub: "Tracked per shipment" },
              { val: "₹2,499/mo",    sub: "Pro — all 12 modules" },
            ].map((s) => (
              <div key={s.sub} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                <p className="text-3xl font-black" style={{ color: "#60A5FA" }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="demo" className="py-20 px-6" style={{ background: "#0A1628" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(96,165,250,0.7)" }}>Interactive demo</span>
            <h2 className="text-3xl font-black text-white mt-2">See every module live</h2>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click any tab to preview the real interface with sample data.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeModule === m.id ? "#1565C0" : "rgba(255,255,255,0.06)",
                  color: activeModule === m.id ? "#fff" : "rgba(255,255,255,0.5)",
                  border: activeModule === m.id ? "none" : "0.5px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#060d18", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-1.5">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.8 }} />)}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                  app.navkaros.in/nexlog/{activeModule === "dashboard" ? "" : activeModule}
                </div>
              </div>
            </div>
            <div className="flex" style={{ height: "480px" }}>
              <div className="flex flex-col gap-1 px-2 py-3" style={{ width: "48px", background: "#040810", borderRight: "0.5px solid rgba(255,255,255,0.06)" }}>
                {MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ background: activeModule === m.id ? "rgba(21,101,192,0.2)" : "transparent" }}
                    title={m.label}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: activeModule === m.id ? "#60A5FA" : "rgba(255,255,255,0.25)" }}>{m.icon}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModule}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {SCREENS[activeModule]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">What&apos;s included</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">12 modules. One freight OS.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAll ? FEATURES : FEATURES.slice(0, 9)).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.05 }}
                className="rounded-2xl p-5 border bg-white"
                style={{ borderColor: "#f0f0f0" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(21,101,192,0.08)", border: "1.5px solid rgba(21,101,192,0.15)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1565C0" }}>{f.icon}</span>
                </div>
                <p className="font-black text-gray-900 text-sm mb-1.5">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          {!showAll && (
            <div className="text-center mt-6">
              <button onClick={() => setShowAll(true)} className="text-sm font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 mx-auto">
                Show 3 more modules <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6" style={{ background: "#0A1628" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(96,165,250,0.7)" }}>Zero learning curve</span>
            <h2 className="text-3xl font-black text-white mt-2">How Nexlog works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "document_scanner", title: "DocAI reads your BL", desc: "Drop a Bill of Lading PDF. AI extracts 12+ fields with 98% accuracy and pre-fills a new job in one click." },
              { step: "02", icon: "track_changes",    title: "Live ops + auto-comms",  desc: "Stage updates fire WhatsApp + email to the client. Vessel ETA, free-day expiry, customs delays — all tracked automatically." },
              { step: "03", icon: "receipt_long",     title: "Invoice → Accura → GST", desc: "Generate GST invoice from job charges. Accura auto-records income. GSTR-1 in one click at month-end." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(21,101,192,0.15)", border: "1.5px solid rgba(21,101,192,0.3)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#60A5FA" }}>{s.icon}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(96,165,250,0.6)" }}>Step {s.step}</p>
                <p className="font-black text-white text-base mb-3">{s.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Pricing</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">Honest pricing for Indian freight</h2>
            <p className="text-sm text-gray-500 mt-2">Every module included. No hidden add-ons. Start free for 14 days.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Starter", price: "₹1,499", cycle: "/mo", highlight: false, badge: null,
                features: ["Up to 25 jobs/month","1 user","Dashboard + Jobs","CRM (Leads/Enquiries)","Documents","Basic Tracking","14-day free trial"] },
              { name: "Pro", price: "₹2,499", cycle: "/mo", highlight: true, badge: "Most Popular",
                features: ["Unlimited jobs","5 users","All 12 modules","DocAI + Anomaly detection","Auto Pre-Alert + DSR","Per-job P&L","GST Invoicing","Priority support","14-day free trial"] },
              { name: "Full Suite", price: "₹4,999", cycle: "/mo", highlight: false, badge: "Save 60%",
                features: ["Nexlog Pro","Accura accounting","EntryX customs","DockIQ CFS","RunDesk transport","Unified dashboard","Dedicated CSM"] },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl border p-6 flex flex-col relative ${p.highlight ? "border-[#1565C0] border-2 shadow-xl" : "border-gray-100 bg-white"}`}
                style={{ background: p.highlight ? "#0A1628" : "#fff" }}>
                {p.badge && (
                  <div className="absolute -top-px right-5 px-3 py-1 rounded-b-xl" style={{ background: p.highlight ? "#1565C0" : "#0A1628" }}>
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: p.highlight ? "#fff" : "#60A5FA" }}>{p.badge}</span>
                  </div>
                )}
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: p.highlight ? "rgba(96,165,250,0.7)" : "#9ca3af" }}>{p.name}</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className="text-4xl font-black" style={{ color: p.highlight ? "#60A5FA" : "#0A1628" }}>{p.price}</span>
                  <span className="text-sm mb-1.5" style={{ color: p.highlight ? "rgba(255,255,255,0.4)" : "#9ca3af" }}>{p.cycle}</span>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: p.highlight ? "#60A5FA" : "#1565C0" }} />
                      <span style={{ color: p.highlight ? "rgba(255,255,255,0.75)" : "#374151" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={p.name === "Full Suite" ? "/pricing" : "/pricing"}
                  className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 block"
                  style={{ background: p.highlight ? "#1565C0" : "#0A1628", color: "#fff" }}>
                  View Pricing →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions about Nexlog</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: openFaq === i ? "rgba(21,101,192,0.4)" : "#e5e7eb" }}>
                <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-[#1565C0] flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-4"><p className="text-sm text-gray-600 leading-relaxed">{f.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "#0A1628" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(96,165,250,0.6)" }}>Ready to switch?</p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Your freight ops, finally<br />
            <span style={{ color: "#60A5FA" }}>running on one platform.</span>
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            14-day free trial. No credit card. No setup fee. Migrate jobs in one CSV.
          </p>
          <Link href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: "#1565C0", color: "#fff" }}>
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Nexlog Pro · ₹2,499/mo · 12 modules · 14-day free trial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
