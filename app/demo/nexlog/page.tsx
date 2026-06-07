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
  { id: "dashboard",  label: "Dashboard",  icon: "dashboard" },
  { id: "jobs",       label: "Jobs",       icon: "work" },
  { id: "invoices",   label: "Invoices",   icon: "receipt_long" },
  { id: "tracking",   label: "Tracking",   icon: "gps_fixed" },
  { id: "pre-alert",  label: "Pre-Alert",  icon: "notifications" },
  { id: "pnl",        label: "Job P&L",    icon: "trending_up" },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS                                                */
/* ─────────────────────────────────────────────────────────── */

const SAMPLE_JOBS = [
  { no: "NXL/26/0142", client: "Ravi Exports Pvt Ltd",  route: "JNPT→DEHAM",  mode: "SEA", type: "EXPORT", stage: "Vessel Sailed",      eta: "15 Jul 2026", stageColor: "#1565C0", stageBg: "#E3F2FD" },
  { no: "NXL/26/0141", client: "HDFC Traders",          route: "INMAA→SGSIN", mode: "SEA", type: "EXPORT", stage: "At Customs",          eta: "12 Jul 2026", stageColor: "#D97706", stageBg: "#FFFBEB" },
  { no: "NXL/26/0140", client: "Global Impex",          route: "INBLR→OMKWI", mode: "AIR", type: "EXPORT", stage: "In Transit",          eta: "10 Jul 2026", stageColor: "#1565C0", stageBg: "#E3F2FD" },
  { no: "NXL/26/0139", client: "Sunrise Logistics",     route: "JNPT→DXBPO",  mode: "SEA", type: "EXPORT", stage: "CFS Destuffed",       eta: "8 Jul 2026",  stageColor: "#7C3AED", stageBg: "#F5F3FF" },
  { no: "NXL/26/0138", client: "Sakthi Cargo",          route: "INMAA→CNSHA", mode: "SEA", type: "EXPORT", stage: "Booking Confirmed",   eta: "20 Jul 2026", stageColor: "#374151", stageBg: "#F3F4F6" },
];

function DashboardScreen() {
  const kpis = [
    { label: "Active Jobs",        value: "28",         icon: "work",            color: "#1565C0", bg: "#E3F2FD" },
    { label: "Import Jobs",        value: "16",         icon: "download",        color: "#0D47A1", bg: "#E3F2FD" },
    { label: "Export Jobs",        value: "12",         icon: "upload",          color: "#7C3AED", bg: "#F5F3FF" },
    { label: "Pending Customs",    value: "5",          icon: "gavel",           color: "#DC2626", bg: "#FEF2F2" },
    { label: "Revenue This Month", value: "₹8,42,500",  icon: "trending_up",     color: "#059669", bg: "#ECFDF5" },
    { label: "Outstanding",        value: "₹1,94,000",  icon: "pending_actions", color: "#D97706", bg: "#FFFBEB" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>Dashboard</h1>
          <p style={{ color: "#6B7280", fontSize: "10px", marginTop: "1px" }}>Navkar Freight Co. · FY 2025–26</p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white" style={{ background: "#1565C0", fontSize: "11px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>
          New Job
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border p-3" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="flex items-start justify-between">
              <div>
                <div style={{ color: "#6B7280", fontSize: "9px", fontWeight: 500, marginBottom: "4px" }}>{k.label}</div>
                <div className="font-bold" style={{ fontSize: "16px", color: "#111827", letterSpacing: "-0.02em" }}>{k.value}</div>
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: k.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: k.color, fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs + Alerts */}
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "1fr 180px" }}>
        <div className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "#E5E7EB" }}>
            <span className="font-semibold" style={{ color: "#111827", fontSize: "11px" }}>Recent Jobs</span>
            <span style={{ color: "#1565C0", fontSize: "10px", fontWeight: 500 }}>View all →</span>
          </div>
          <table className="w-full" style={{ fontSize: "10px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["Job No", "Client", "Route", "Mode", "Stage", "ETA"].map((h) => (
                  <th key={h} className="text-left py-1.5 px-2.5 font-semibold uppercase tracking-wider" style={{ color: "#6B7280", fontSize: "8px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_JOBS.map((j) => (
                <tr key={j.no} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td className="py-2 px-2.5 font-mono" style={{ color: "#1565C0", fontSize: "9px", fontWeight: 700 }}>{j.no}</td>
                  <td className="py-2 px-2.5 font-medium" style={{ color: "#111827", fontSize: "9px" }}>{j.client}</td>
                  <td className="py-2 px-2.5" style={{ color: "#6B7280", fontSize: "9px" }}>{j.route}</td>
                  <td className="py-2 px-2.5">
                    <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: j.mode === "SEA" ? "#DBEAFE" : "#FEF3C7", color: j.mode === "SEA" ? "#1E40AF" : "#92400E", fontSize: "8px" }}>{j.mode}</span>
                  </td>
                  <td className="py-2 px-2.5">
                    <span className="px-1.5 py-0.5 rounded-full font-bold" style={{ background: j.stageBg, color: j.stageColor, fontSize: "8px" }}>{j.stage}</span>
                  </td>
                  <td className="py-2 px-2.5" style={{ color: "#6B7280", fontSize: "9px" }}>{j.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border p-3" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="font-semibold mb-2.5" style={{ color: "#111827", fontSize: "11px" }}>Alerts</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 p-2 rounded-lg border" style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}>
              <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ fontSize: 12, color: "#D97706", fontVariationSettings: "'FILL' 1" }}>warning</span>
              <p style={{ fontSize: "9px", color: "#374151", lineHeight: 1.5 }}>TCNU8456731 — 1 free day remaining</p>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg border" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
              <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ fontSize: 12, color: "#DC2626", fontVariationSettings: "'FILL' 1" }}>error</span>
              <p style={{ fontSize: "9px", color: "#374151", lineHeight: 1.5 }}>NXL/26/0141 — Customs query raised</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsScreen() {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h1 className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>All Jobs</h1>
          <p style={{ color: "#6B7280", fontSize: "10px", marginTop: "1px" }}>5 jobs · 5 active</p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white" style={{ background: "#1565C0", fontSize: "11px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>
          New Job
        </button>
      </div>

      {/* Filters */}
      <div className="mx-4 mb-3 rounded-xl border p-2.5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{ borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#9CA3AF" }}>search</span>
            <span style={{ fontSize: "10px", color: "#9CA3AF" }}>Search by job no, client…</span>
          </div>
          {["All Modes", "All Types", "All Stages"].map((f) => (
            <div key={f} className="px-2 py-1.5 rounded-md border flex items-center gap-1" style={{ borderColor: "#E5E7EB", background: "#fff", fontSize: "10px", color: "#374151" }}>
              {f} <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#9CA3AF" }}>expand_more</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mx-4 rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Job No", "Client", "Route", "Type", "Mode", "Stage", "ETA", ""].map((h) => (
                <th key={h} className="text-left py-2.5 px-2.5 font-semibold uppercase tracking-wider" style={{ color: "#6B7280", fontSize: "8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAMPLE_JOBS.map((j) => (
              <tr key={j.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-2.5 font-mono font-bold" style={{ color: "#1565C0", fontSize: "9px" }}>{j.no}</td>
                <td className="py-2.5 px-2.5 font-medium" style={{ color: "#111827", fontSize: "10px" }}>{j.client}</td>
                <td className="py-2.5 px-2.5" style={{ color: "#6B7280", fontSize: "10px" }}>{j.route}</td>
                <td className="py-2.5 px-2.5">
                  <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: j.type === "IMPORT" ? "#E3F2FD" : "#F5F3FF", color: j.type === "IMPORT" ? "#1565C0" : "#7C3AED", fontSize: "8px" }}>{j.type}</span>
                </td>
                <td className="py-2.5 px-2.5">
                  <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: j.mode === "SEA" ? "#DBEAFE" : "#FEF3C7", color: j.mode === "SEA" ? "#1E40AF" : "#92400E", fontSize: "8px" }}>{j.mode}</span>
                </td>
                <td className="py-2.5 px-2.5">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: j.stageBg, color: j.stageColor, fontSize: "8px" }}>{j.stage}</span>
                </td>
                <td className="py-2.5 px-2.5" style={{ color: "#6B7280", fontSize: "10px" }}>{j.eta}</td>
                <td className="py-2.5 px-2.5">
                  <span className="px-2 py-1 rounded font-semibold" style={{ color: "#1565C0", background: "#E3F2FD", fontSize: "9px" }}>Open</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvoicesScreen() {
  const invoices = [
    { no: "INV-2026-0142", job: "NXL/26/0142", client: "Ravi Exports Pvt Ltd", date: "2 Jul 2026",  amount: 78500,  gst: 7065,  status: "Paid",    statusColor: "#059669", statusBg: "#ECFDF5" },
    { no: "INV-2026-0141", job: "NXL/26/0141", client: "HDFC Traders",         date: "30 Jun 2026", amount: 48000,  gst: 4320,  status: "Overdue",  statusColor: "#DC2626", statusBg: "#FEF2F2" },
    { no: "INV-2026-0140", job: "NXL/26/0140", client: "Global Impex",         date: "28 Jun 2026", amount: 15000,  gst: 1350,  status: "Partial",  statusColor: "#D97706", statusBg: "#FFFBEB" },
    { no: "INV-2026-0139", job: "NXL/26/0139", client: "Sakthi Cargo",         date: "25 Jun 2026", amount: 10000,  gst: 900,   status: "Paid",    statusColor: "#059669", statusBg: "#ECFDF5" },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h1 className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>Invoices</h1>
          <p style={{ color: "#6B7280", fontSize: "10px", marginTop: "1px" }}>4 invoices · FY 2025–26</p>
        </div>
        <button className="px-2.5 py-1.5 rounded-md text-white" style={{ background: "#1565C0", fontSize: "11px" }}>+ Create Invoice</button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-2.5 mx-4 mb-3">
        {[
          { l: "Total Invoiced", v: "₹18.5 L", c: "#1565C0", bg: "#E3F2FD" },
          { l: "Total Collected", v: "₹13.2 L", c: "#059669", bg: "#ECFDF5" },
          { l: "Outstanding",    v: "₹5.3 L",  c: "#D97706", bg: "#FFFBEB" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border p-3" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div style={{ color: "#6B7280", fontSize: "9px", fontWeight: 500, marginBottom: "3px" }}>{k.l}</div>
            <div className="font-bold" style={{ fontSize: "16px", color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 mx-4 mb-3 border-b" style={{ borderColor: "#E5E7EB" }}>
        {["All", "Tax Invoice", "Reimbursement", "Debit Note"].map((t, i) => (
          <div key={t} className="px-3 py-1.5 border-b-2" style={{ borderColor: i === 0 ? "#1565C0" : "transparent", color: i === 0 ? "#1565C0" : "#6B7280", fontSize: "11px", fontWeight: 500 }}>{t}</div>
        ))}
      </div>

      {/* Table */}
      <div className="mx-4 rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Invoice No", "Job No", "Client", "Date", "Amount", "GST", "Total", "Status", ""].map((h) => (
                <th key={h} className="text-left py-2.5 px-2.5 font-semibold uppercase tracking-wider" style={{ color: "#6B7280", fontSize: "8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-2.5 font-mono font-bold" style={{ color: "#1565C0", fontSize: "9px" }}>{inv.no}</td>
                <td className="py-2.5 px-2.5 font-mono" style={{ color: "#6B7280", fontSize: "9px" }}>{inv.job}</td>
                <td className="py-2.5 px-2.5 font-medium" style={{ color: "#111827", fontSize: "10px" }}>{inv.client}</td>
                <td className="py-2.5 px-2.5" style={{ color: "#6B7280", fontSize: "10px" }}>{inv.date}</td>
                <td className="py-2.5 px-2.5" style={{ color: "#111827", fontSize: "10px" }}>₹{inv.amount.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-2.5" style={{ color: "#6B7280", fontSize: "10px" }}>₹{inv.gst.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-2.5 font-bold" style={{ color: "#111827", fontSize: "10px" }}>₹{(inv.amount + inv.gst).toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-2.5">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: inv.statusBg, color: inv.statusColor, fontSize: "8px" }}>{inv.status}</span>
                </td>
                <td className="py-2.5 px-2.5">
                  <div className="flex gap-1">
                    <span className="px-1.5 py-1 rounded font-semibold" style={{ background: "#F3F4F6", color: "#374151", fontSize: "8px" }}>Download</span>
                    <span className="px-1.5 py-1 rounded font-semibold text-white" style={{ background: "#1565C0", fontSize: "8px" }}>Send</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrackingScreen() {
  const shipments = [
    { job: "NXL/26/0142", vessel: "CMA CGM TAGE",       location: "Suez Canal",   stage: "Vessel Sailed",  eta: "15 Jul", status: "On Time", statusColor: "#059669", statusBg: "#ECFDF5" },
    { job: "NXL/26/0141", vessel: "MSC MAYA",            location: "JNPT Customs", stage: "At Customs",     eta: "12 Jul", status: "Delayed", statusColor: "#D97706", statusBg: "#FFFBEB" },
    { job: "NXL/26/0139", vessel: "COSCO STAR",          location: "Dubai Port",   stage: "Transshipment",  eta: "8 Jul",  status: "On Time", statusColor: "#059669", statusBg: "#ECFDF5" },
    { job: "NXL/26/0138", vessel: "Hapag Lloyd GLOBE",   location: "Chennai Port", stage: "Vessel Sailed",  eta: "20 Jul", status: "On Time", statusColor: "#059669", statusBg: "#ECFDF5" },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>Live Tracking</h1>
        <p style={{ color: "#6B7280", fontSize: "10px", marginTop: "1px" }}>Real-time shipment status across all modes</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-0 mx-4 mb-3 border-b" style={{ borderColor: "#E5E7EB" }}>
        {[["Sea", 4], ["Air", 1], ["Surface", 0]].map(([label, count], i) => (
          <div key={label as string} className="px-4 py-1.5 border-b-2" style={{ borderColor: i === 0 ? "#1565C0" : "transparent", color: i === 0 ? "#1565C0" : "#6B7280", fontSize: "11px", fontWeight: 500 }}>
            {label as string} ({count as number})
          </div>
        ))}
      </div>

      <div className="mx-4 rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Job No", "Mode", "Vessel", "Current Location", "Stage", "ETA", "Status"].map((h) => (
                <th key={h} className="text-left py-2.5 px-3 font-semibold uppercase tracking-wider" style={{ color: "#6B7280", fontSize: "8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s.job} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-mono font-bold" style={{ color: "#1565C0", fontSize: "9px" }}>{s.job}</td>
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: "#E3F2FD", color: "#1565C0", fontSize: "8px" }}>SEA</span>
                </td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827", fontSize: "10px" }}>{s.vessel}</td>
                <td className="py-2.5 px-3" style={{ color: "#374151", fontSize: "10px" }}>{s.location}</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: "#F3F4F6", color: "#374151", fontSize: "8px" }}>{s.stage}</span>
                </td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280", fontSize: "10px" }}>{s.eta}</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: s.statusBg, color: s.statusColor, fontSize: "8px" }}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreAlertScreen() {
  const rows = [
    { job: "NXL/26/0142", bl: "CMDU8723419",   vessel: "CMA CGM TAGE",     pol: "JNPT", pod: "DEHAM", eta: "15 Jul", paStatus: "Sent",    paColor: "#059669", paBg: "#ECFDF5" },
    { job: "NXL/26/0141", bl: "MSCU5634871",   vessel: "MSC MAYA",          pol: "INMAA", pod: "SGSIN", eta: "12 Jul", paStatus: "Sent",    paColor: "#059669", paBg: "#ECFDF5" },
    { job: "NXL/26/0140", bl: "IATSA7812340",  vessel: "IndiGo 6E-2214",    pol: "INBLR", pod: "OMKWI", eta: "10 Jul", paStatus: "Pending", paColor: "#D97706", paBg: "#FFFBEB" },
    { job: "NXL/26/0139", bl: "COSU9284612",   vessel: "COSCO STAR",        pol: "JNPT", pod: "DXBPO", eta: "8 Jul",  paStatus: "Sent",    paColor: "#059669", paBg: "#ECFDF5" },
    { job: "NXL/26/0138", bl: "HLCUSHA984521", vessel: "Hapag Lloyd GLOBE", pol: "INMAA", pod: "CNSHA", eta: "20 Jul", paStatus: "Pending", paColor: "#D97706", paBg: "#FFFBEB" },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h1 className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>Pre Alert Generator</h1>
          <p style={{ color: "#6B7280", fontSize: "10px", marginTop: "1px" }}>Auto-compose and send arrival notice to consignee</p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white" style={{ background: "#1565C0", fontSize: "11px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>
          New Pre-Alert
        </button>
      </div>

      <div className="mx-4 rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Job No", "BL No", "Vessel / Flight", "POL", "POD", "ETA", "Pre-Alert Status", ""].map((h) => (
                <th key={h} className="text-left py-2.5 px-3 font-semibold uppercase tracking-wider" style={{ color: "#6B7280", fontSize: "8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.job} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-mono font-bold" style={{ color: "#1565C0", fontSize: "9px" }}>{r.job}</td>
                <td className="py-2.5 px-3 font-mono" style={{ color: "#374151", fontSize: "9px" }}>{r.bl}</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827", fontSize: "10px" }}>{r.vessel}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280", fontSize: "10px" }}>{r.pol}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280", fontSize: "10px" }}>{r.pod}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280", fontSize: "10px" }}>{r.eta}</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: r.paBg, color: r.paColor, fontSize: "8px" }}>{r.paStatus}</span>
                </td>
                <td className="py-2.5 px-3">
                  {r.paStatus === "Pending"
                    ? <span className="px-2 py-1 rounded font-semibold text-white" style={{ background: "#1565C0", fontSize: "8px" }}>Send</span>
                    : <span className="px-2 py-1 rounded font-semibold" style={{ background: "#F3F4F6", color: "#374151", fontSize: "8px" }}>Resend</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PnlScreen() {
  const jobs = [
    { no: "NXL/26/0142", client: "Ravi Exports Pvt Ltd", mode: "SEA", route: "JNPT→DEHAM",  rev: 125000, cost: 88000,  gp: 37000,  gpPct: 29.6 },
    { no: "NXL/26/0141", client: "HDFC Traders",         mode: "SEA", route: "INMAA→SGSIN", rev: 82000,  cost: 54000,  gp: 28000,  gpPct: 34.1 },
    { no: "NXL/26/0140", client: "Global Impex",         mode: "AIR", route: "INBLR→OMKWI", rev: 48000,  cost: 52000,  gp: -4000,  gpPct: -8.3 },
    { no: "NXL/26/0139", client: "Sunrise Logistics",    mode: "SEA", route: "JNPT→DXBPO",  rev: 67000,  cost: 41000,  gp: 26000,  gpPct: 38.8 },
    { no: "NXL/26/0138", client: "Sakthi Cargo",         mode: "SEA", route: "INMAA→CNSHA", rev: 95000,  cost: 62000,  gp: 33000,  gpPct: 34.7 },
  ];
  const totals = jobs.reduce((acc, j) => ({ rev: acc.rev + j.rev, cost: acc.cost + j.cost, gp: acc.gp + j.gp }), { rev: 0, cost: 0, gp: 0 });
  const avgGp = ((totals.gp / totals.rev) * 100).toFixed(1);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F9FAFB", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h1 className="font-semibold" style={{ color: "#111827", fontSize: "14px" }}>Job-wise P&amp;L</h1>
          <p style={{ color: "#6B7280", fontSize: "10px", marginTop: "1px" }}>Per-shipment profitability · Last 30 days</p>
        </div>
        <button className="px-2.5 py-1.5 rounded-md text-white font-semibold" style={{ background: "#1565C0", fontSize: "11px" }}>Export</button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-2.5 mx-4 mb-3">
        {[
          { l: "Total Revenue", v: `₹${(totals.rev / 100000).toFixed(2)} L`, c: "#1565C0", bg: "#E3F2FD" },
          { l: "Total Cost",    v: `₹${(totals.cost / 100000).toFixed(2)} L`, c: "#D97706", bg: "#FFFBEB" },
          { l: "Gross Profit",  v: `₹${(totals.gp / 100000).toFixed(2)} L`,  c: "#059669", bg: "#ECFDF5" },
          { l: "Avg GP %",      v: `${avgGp}%`,                              c: "#7C3AED", bg: "#F5F3FF" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border p-3" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div style={{ color: "#6B7280", fontSize: "9px", fontWeight: 500, marginBottom: "3px" }}>{k.l}</div>
            <div className="font-bold" style={{ fontSize: "15px", color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mx-4 rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Job No", "Client", "Mode", "Route", "Revenue", "Cost", "GP", "GP %"].map((h) => (
                <th key={h} className="text-left py-2.5 px-3 font-semibold uppercase tracking-wider" style={{ color: "#6B7280", fontSize: "8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-mono font-bold" style={{ color: "#1565C0", fontSize: "9px" }}>{j.no}</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827", fontSize: "10px" }}>{j.client}</td>
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: j.mode === "SEA" ? "#DBEAFE" : "#FEF3C7", color: j.mode === "SEA" ? "#1E40AF" : "#92400E", fontSize: "8px" }}>{j.mode}</span>
                </td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280", fontSize: "10px" }}>{j.route}</td>
                <td className="py-2.5 px-3" style={{ color: "#111827", fontSize: "10px" }}>₹{j.rev.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280", fontSize: "10px" }}>₹{j.cost.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3 font-bold" style={{ color: j.gp >= 0 ? "#059669" : "#DC2626", fontSize: "10px" }}>₹{Math.abs(j.gp).toLocaleString("en-IN")}{j.gp < 0 ? " (loss)" : ""}</td>
                <td className="py-2.5 px-3 font-bold" style={{ color: j.gpPct >= 0 ? "#059669" : "#DC2626", fontSize: "10px" }}>{j.gpPct}%</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr style={{ borderTop: "2px solid #E5E7EB", background: "#F9FAFB" }}>
              <td className="py-2.5 px-3 font-bold" colSpan={4} style={{ color: "#111827", fontSize: "10px" }}>Total</td>
              <td className="py-2.5 px-3 font-bold" style={{ color: "#111827", fontSize: "10px" }}>₹{totals.rev.toLocaleString("en-IN")}</td>
              <td className="py-2.5 px-3 font-bold" style={{ color: "#111827", fontSize: "10px" }}>₹{totals.cost.toLocaleString("en-IN")}</td>
              <td className="py-2.5 px-3 font-bold" style={{ color: "#059669", fontSize: "10px" }}>₹{totals.gp.toLocaleString("en-IN")}</td>
              <td className="py-2.5 px-3 font-bold" style={{ color: "#059669", fontSize: "10px" }}>{avgGp}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  dashboard:  <DashboardScreen />,
  jobs:       <JobsScreen />,
  invoices:   <InvoicesScreen />,
  tracking:   <TrackingScreen />,
  "pre-alert": <PreAlertScreen />,
  pnl:        <PnlScreen />,
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
  { q: "What does the ₹1,799/mo plan include?", a: "Everything — unlimited jobs, all 12 modules, DocAI, vessel tracking, GST invoicing, pre-alerts, client portal, WhatsApp notifications, multi-branch support. No add-ons, no per-user fees. You can also bundle Nexlog + Accura together at ₹2,699/mo and save ₹599/mo." },
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
              { val: "₹1,799/mo",    sub: "All 12 modules included" },
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
          {/* Module tab buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeModule === m.id ? "#1565C0" : "rgba(255,255,255,0.06)",
                  color: activeModule === m.id ? "#fff" : "rgba(255,255,255,0.5)",
                  border: activeModule === m.id ? "1px solid #1565C0" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* Browser shell — light themed */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid #E5E7EB" }}>
            {/* Browser chrome bar */}
            <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
              <div className="flex gap-1.5">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.85 }} />)}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#6B7280", minWidth: "260px" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#22c55e" }} />
                  app.navkaros.in/nexlog/{activeModule === "dashboard" ? "dashboard" : activeModule}
                </div>
              </div>
            </div>

            {/* App area: sidebar + content */}
            <div className="flex" style={{ height: "520px", background: "#F9FAFB" }}>
              {/* Mini sidebar */}
              <div className="flex flex-col py-3 px-2 gap-0.5" style={{ width: "160px", background: "#F9FAFB", borderRight: "1px solid #E5E7EB", flexShrink: 0 }}>
                {/* Brand */}
                <div className="flex items-center gap-2 px-2 pb-3 mb-1" style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#1565C0" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#fff", fontVariationSettings: "'FILL' 1" }}>navigation</span>
                  </div>
                  <span className="font-bold" style={{ fontSize: "12px", color: "#111827" }}>Nexlog</span>
                </div>
                {MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-lg w-full text-left transition-all duration-150"
                    style={{
                      background: activeModule === m.id ? "#E3F2FD" : "transparent",
                      color: activeModule === m.id ? "#1565C0" : "#374151",
                    }}
                  >
                    <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 15, color: activeModule === m.id ? "#1565C0" : "#9CA3AF", fontVariationSettings: activeModule === m.id ? "'FILL' 1" : "'FILL' 0" }}>{m.icon}</span>
                    <span className="font-medium" style={{ fontSize: "11px" }}>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-hidden" style={{ background: "#F9FAFB" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModule}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="h-full overflow-y-auto"
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Pricing</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">One plan. Everything included.</h2>
            <p className="text-sm text-gray-500 mt-2">No tiers, no hidden add-ons. Every module from day one.</p>
          </div>
          <div className="rounded-2xl border-2 p-8 flex flex-col md:flex-row gap-8 items-center" style={{ background: "#0A1628", borderColor: "#1565C0" }}>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(96,165,250,0.7)" }}>Nexlog</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black" style={{ color: "#60A5FA" }}>₹1,799</span>
                <span className="text-base mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>14-day free trial · No credit card required</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200"
                style={{ background: "#1565C0", color: "#fff" }}>
                Start Free Trial →
              </Link>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {["Unlimited jobs & shipments","All 12 modules included","AI document extraction (DocAI)","Live vessel & flight tracking","GST invoicing in 3 clicks","Pre-alert & DSR automation","Multi-branch support","Client portal with shipment visibility","WhatsApp notifications","Tally XML export"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#60A5FA" }} />
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                </li>
              ))}
            </ul>
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
            Nexlog · ₹1,799/mo · All 12 modules included · 14-day free trial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
