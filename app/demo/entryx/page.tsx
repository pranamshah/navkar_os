"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ─────────────────────────────────────────────────────────── */
/* CONSTANTS                                                   */
/* ─────────────────────────────────────────────────────────── */
const P = "#5B21B6";   // primary purple
const PL = "#1E40AF";  // light purple
const PA = "#A78BFA";  // accent purple

/* ─────────────────────────────────────────────────────────── */
/* MODULE TABS                                                 */
/* ─────────────────────────────────────────────────────────── */
const MODULES = [
  { id: "dashboard",     label: "Dashboard",     icon: "dashboard" },
  { id: "newbe",         label: "New BE",        icon: "post_add" },
  { id: "icegate",       label: "ICEGATE",       icon: "cloud_sync" },
  { id: "tariff",        label: "Tariff",        icon: "search" },
  { id: "drawback",      label: "Drawback",      icon: "account_balance" },
  { id: "profitability", label: "Profitability", icon: "trending_up" },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS                                                */
/* ─────────────────────────────────────────────────────────── */

function DashboardScreen() {
  const kpis = [
    { label: "BEs This Month",        value: "84",          change: "+6 today",    up: true  },
    { label: "Pending Examination",   value: "7",           change: "2 urgent",    up: false },
    { label: "Out of Charge Today",   value: "12",          change: "+4 vs ytd",   up: true  },
    { label: "Duty Collected",        value: "₹24,18,500",  change: "+11% MoM",    up: true  },
  ];

  const recentBEs = [
    { no: "BE/2026/0398", importer: "Sunrise Industries",    port: "JNPT",   status: "Under Assessment", duty: "₹4,69,200" },
    { no: "BE/2026/0397", importer: "Ravi Exports Pvt Ltd",  port: "JNPT",   status: "Out of Charge",    duty: "₹2,14,800" },
    { no: "BE/2026/0396", importer: "Global Impex Solutions",port: "INMAA",  status: "Duty Paid",        duty: "₹88,400"   },
    { no: "BE/2026/0395", importer: "Bharat Heavy Elect.",   port: "INBLR",  status: "Examination Ordered", duty: "₹6,22,100" },
    { no: "BE/2026/0394", importer: "HDFC Traders Ltd",      port: "JNPT",   status: "Filed",            duty: "₹1,54,600" },
  ];

  const statusColor: Record<string, string> = {
    "Filed": "#6B7280",
    "Under Assessment": "#1E40AF",
    "Examination Ordered": "#DC2626",
    "Out of Charge": "#059669",
    "Duty Paid": "#5B21B6",
  };

  return (
    <div className="h-full overflow-y-auto p-3 space-y-3" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
            <p style={{ color: "#6B7280", fontSize: "7.5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</p>
            <p className="font-bold mt-0.5" style={{ fontSize: "13px", color: "#111827" }}>{k.value}</p>
            <p className="mt-0.5" style={{ color: k.up ? "#059669" : "#1E40AF", fontSize: "9px" }}>{k.change}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-1.5">
        {[
          { text: "TCNU8456731 — Examination order received. Action required within 24 hrs.", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { text: "BE/2026/0341 — Duty payment pending ₹1,82,400. Due by today 17:00 IST.", color: "#1E40AF", bg: "#FFFBEB", border: "#FDE68A" },
        ].map((a) => (
          <div key={a.text} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: a.bg, border: `1px solid ${a.border}` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: a.color }} />
            <p style={{ fontSize: "9.5px", color: "#374151" }}>{a.text}</p>
          </div>
        ))}
      </div>

      {/* Recent BEs */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E5E7EB", background: "#fff" }}>
        <div className="px-3 py-2 border-b" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
          <p className="font-semibold" style={{ fontSize: "9.5px", color: "#111827" }}>Recent Bills of Entry</p>
        </div>
        <table className="w-full" style={{ fontSize: "8.5px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
              {["BE No", "Importer", "Port", "Status", "Duty"].map((h) => (
                <th key={h} className="px-3 py-1.5 text-left font-semibold" style={{ color: "#6B7280", textTransform: "uppercase", fontSize: "7.5px", letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentBEs.map((r) => (
              <tr key={r.no} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="px-3 py-2 font-mono font-bold" style={{ color: P }}>{r.no}</td>
                <td className="px-3 py-2 font-semibold" style={{ color: "#111827" }}>{r.importer}</td>
                <td className="px-3 py-2" style={{ color: "#6B7280" }}>{r.port}</td>
                <td className="px-3 py-2">
                  <span className="px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${statusColor[r.status]}18`, color: statusColor[r.status], fontSize: "7.5px" }}>{r.status}</span>
                </td>
                <td className="px-3 py-2 font-bold" style={{ color: "#111827" }}>{r.duty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewBEScreen() {
  const fields = [
    { label: "Bill of Entry No",  value: "BE/2026/0398",         badge: null },
    { label: "Importer Name",     value: "Sunrise Industries Pvt Ltd", badge: null },
    { label: "IEC Code",          value: "1307012345",            badge: null },
    { label: "Port of Entry",     value: "JNPT — Nhava Sheva",   badge: null },
    { label: "HS Code",           value: "8471.30.00",            badge: "AI Detected" },
    { label: "Goods Description", value: "Laptop Computers (ADP Machines, Portable)", badge: "AI Filled" },
    { label: "Assessable Value",  value: "₹12,40,000",           badge: null },
    { label: "Exchange Rate",     value: "₹83.42 / USD",         badge: null },
  ];

  const duties = [
    { label: "Basic Customs Duty (BCD)", rate: "20%",  amt: "₹2,48,000" },
    { label: "Social Welfare Surcharge", rate: "10%",  amt: "₹24,800"   },
    { label: "IGST",                     rate: "18%",  amt: "₹1,96,400" },
  ];

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2.5" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* AI banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${P}0f`, border: `1px solid ${P}30` }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: PL }}>auto_awesome</span>
        <p style={{ fontSize: "9.5px", color: P, fontWeight: 700 }}>AI Pre-filled from Commercial Invoice · CI_Sunrise_May26.pdf</p>
        <span className="ml-auto px-2 py-0.5 rounded-full font-bold" style={{ background: `${P}20`, color: P, fontSize: "8px" }}>98% confidence</span>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-2 gap-2">
        {fields.map((f) => (
          <div key={f.label}>
            <p style={{ fontSize: "7.5px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>{f.label}</p>
            <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5" style={{ background: "#fff", border: `1px solid ${f.badge ? P + "40" : "#E5E7EB"}`, fontSize: "9.5px", color: "#111827" }}>
              <span style={{ flex: 1 }}>{f.value}</span>
              {f.badge && (
                <span className="px-1.5 py-0.5 rounded-full font-bold flex-shrink-0" style={{ background: `${P}18`, color: P, fontSize: "7px" }}>{f.badge}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Duty breakdown */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #E5E7EB", background: "#fff" }}>
        <div className="px-3 py-1.5" style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
          <p className="font-semibold" style={{ fontSize: "9px", color: "#111827" }}>Duty Calculation</p>
        </div>
        {duties.map((d) => (
          <div key={d.label} className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "#F3F4F6" }}>
            <p style={{ fontSize: "9px", color: "#374151" }}>{d.label}</p>
            <div className="flex gap-3">
              <span style={{ fontSize: "9px", color: "#6B7280" }}>{d.rate}</span>
              <span style={{ fontSize: "9px", color: "#111827", fontWeight: 600, minWidth: "64px", textAlign: "right" }}>{d.amt}</span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-3 py-2">
          <p style={{ fontSize: "10px", color: "#111827", fontWeight: 700 }}>Total Duty Payable</p>
          <p style={{ fontSize: "12px", fontWeight: 800, color: P }}>₹4,69,200</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-lg font-bold text-white text-xs" style={{ background: P, fontSize: "9.5px" }}>Submit to ICEGATE →</button>
        <button className="px-4 py-2 rounded-lg text-xs" style={{ background: "#F3F4F6", color: "#6B7280", fontSize: "9.5px" }}>Save Draft</button>
      </div>
    </div>
  );
}

function ICEGATEScreen() {
  const entries = [
    { no: "BE/2026/0398", importer: "Sunrise Industries",    port: "JNPT",  filed: "06 Jun 2026", status: "Under Assessment",    duty: "₹4,69,200" },
    { no: "BE/2026/0397", importer: "Ravi Exports Pvt Ltd",  port: "JNPT",  filed: "05 Jun 2026", status: "Out of Charge",        duty: "₹2,14,800" },
    { no: "BE/2026/0396", importer: "Global Impex Solutions",port: "INMAA", filed: "05 Jun 2026", status: "Duty Paid",            duty: "₹88,400"   },
    { no: "BE/2026/0395", importer: "Bharat Heavy Elect.",   port: "INBLR", filed: "04 Jun 2026", status: "Examination Ordered",  duty: "₹6,22,100" },
    { no: "BE/2026/0394", importer: "HDFC Traders Ltd",      port: "JNPT",  filed: "04 Jun 2026", status: "Filed",               duty: "₹1,54,600" },
    { no: "BE/2026/0393", importer: "Apex Pharma Ltd",       port: "INDEL", filed: "03 Jun 2026", status: "Duty Paid",            duty: "₹3,10,800" },
  ];

  const statusColor: Record<string, string> = {
    "Filed": "#6B7280",
    "Under Assessment": "#1E40AF",
    "Examination Ordered": "#DC2626",
    "Out of Charge": "#059669",
    "Duty Paid": P,
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0D0A1A", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b sticky top-0" style={{ borderColor: "rgba(167,139,250,0.15)", background: "#0D0A1A" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: PA }}>cloud_sync</span>
        <p className="font-bold" style={{ fontSize: "10px", color: "#fff" }}>ICEGATE Live Status</p>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
          <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)" }}>Last synced: 2 min ago</p>
          <button className="ml-2 px-2 py-0.5 rounded font-bold" style={{ background: `${P}30`, color: PA, fontSize: "8px" }}>Sync Now</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(167,139,250,0.12)" }}>
              {["BE No", "Importer", "Port", "Date Filed", "ICEGATE Status", "Duty"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.no} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2.5 font-mono font-bold" style={{ color: PA }}>{e.no}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{e.importer}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{e.port}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>{e.filed}</td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColor[e.status]}20`, color: statusColor[e.status], fontSize: "8px" }}>{e.status}</span>
                </td>
                <td className="px-3 py-2.5 font-bold" style={{ color: "#fff" }}>{e.duty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 flex items-center gap-6 border-t" style={{ borderColor: "rgba(167,139,250,0.12)" }}>
        {[["Total BEs","6"],["Out of Charge","2"],["Pending Duty","₹8,27,400"]].map(([l, v]) => (
          <div key={l}>
            <p style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{l}</p>
            <p className="font-bold mt-0.5" style={{ fontSize: "11px", color: "#fff" }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TariffScreen() {
  const results = [
    { label: "HS Code",                 value: "8471.30.00" },
    { label: "Description",             value: "Laptops — portable automatic data processing machines" },
    { label: "Chapter",                 value: "84 — Nuclear Reactors, Boilers, Machinery" },
    { label: "Basic Customs Duty",      value: "20%" },
    { label: "IGST",                    value: "18%" },
    { label: "Social Welfare Surcharge",value: "10% of BCD (= 2% effective)" },
    { label: "Total Indicative Duty",   value: "~47% on CIF value" },
    { label: "Exemption Notification",  value: "Nil (No current exemption for general imports)" },
  ];

  return (
    <div className="h-full overflow-y-auto p-3 space-y-2.5" style={{ background: "#0D0A1A", fontFamily: "Inter, sans-serif" }}>
      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${PA}40` }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: PA }}>search</span>
        <p style={{ fontSize: "10px", color: "#fff", fontFamily: "monospace", flex: 1 }}>8471.30.00</p>
        <span className="px-2 py-0.5 rounded font-bold" style={{ background: `${P}40`, color: PA, fontSize: "8px" }}>Live CBIC</span>
      </div>

      {/* Result card */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${PA}25`, background: "rgba(255,255,255,0.03)" }}>
        <div className="px-3 py-2 flex items-center justify-between" style={{ background: `${P}20`, borderBottom: `0.5px solid ${PA}20` }}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 12, color: PA }}>check_circle</span>
            <p style={{ fontSize: "9.5px", color: PA, fontWeight: 700 }}>HS Code Found</p>
          </div>
          <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>CBIC Notification: Updated 15 Jun 2026</p>
        </div>
        {results.map((r, i) => (
          <div key={r.label} className="flex items-start justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", minWidth: "160px", flexShrink: 0 }}>{r.label}</p>
            <p style={{ fontSize: "9px", color: r.label.includes("Duty") || r.label.includes("IGST") || r.label.includes("Surcharge") || r.label.includes("Total") ? PA : "rgba(255,255,255,0.8)", fontWeight: r.label.includes("Total") ? 700 : 500, textAlign: "right" }}>{r.value}</p>
          </div>
        ))}
      </div>

      {/* Duty calculator mini */}
      <div className="rounded-lg p-3" style={{ background: `${P}15`, border: `1px solid ${PA}25` }}>
        <p style={{ fontSize: "9px", color: PA, fontWeight: 700, marginBottom: "8px" }}>Quick Duty Calculator</p>
        <div className="grid grid-cols-3 gap-2">
          {[["CIF Value", "₹12,40,000"], ["Total Duty", "₹4,69,200"], ["Effective %", "37.8%"]].map(([l, v]) => (
            <div key={l} className="rounded p-2 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{l}</p>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrawbackScreen() {
  const claims = [
    { sb: "SB/2026/0124", date: "28 May 2026", fob: "₹18,42,000", rate: "1.5%", amount: "₹27,630",  status: "Received"  },
    { sb: "SB/2026/0118", date: "20 May 2026", fob: "₹24,10,000", rate: "2.0%", amount: "₹48,200",  status: "Filed"     },
    { sb: "SB/2026/0112", date: "14 May 2026", fob: "₹9,88,000",  rate: "1.8%", amount: "₹17,784",  status: "Filed"     },
    { sb: "SB/2026/0104", date: "05 May 2026", fob: "₹31,60,000", rate: "2.2%", amount: "₹69,520",  status: "Pending"   },
    { sb: "SB/2026/0098", date: "28 Apr 2026", fob: "₹14,22,000", rate: "1.5%", amount: "₹21,330",  status: "Pending"   },
  ];

  const statusColor: Record<string, string> = { Received: "#059669", Filed: "#1E40AF", Pending: "#6B7280" };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0D0A1A", fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b sticky top-0" style={{ borderColor: "rgba(167,139,250,0.15)", background: "#0D0A1A" }}>
        <p className="font-bold" style={{ fontSize: "10px", color: "#fff" }}>Duty Drawback Tracker</p>
        <button className="ml-auto px-2 py-0.5 rounded font-bold" style={{ background: `${P}30`, color: PA, fontSize: "8px" }}>+ Add Claim</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          { label: "Total Outstanding", value: "₹1,08,634", color: "#ef4444" },
          { label: "Filed (Processing)", value: "₹65,984",  color: "#1E40AF" },
          { label: "Received This Month", value: "₹27,630", color: "#22c55e" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-2.5 text-center" style={{ background: `${s.color}10`, border: `0.5px solid ${s.color}30` }}>
            <p style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{s.label}</p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: s.color, marginTop: "3px" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(167,139,250,0.12)" }}>
              {["Shipping Bill No", "Date", "FOB Value", "DBK Rate", "Claim Amount", "Status"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.sb} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2.5 font-mono font-bold" style={{ color: PA }}>{c.sb}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{c.date}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.7)" }}>{c.fob}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: PA }}>{c.rate}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: "#fff" }}>{c.amount}</td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColor[c.status]}20`, color: statusColor[c.status], fontSize: "7.5px" }}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfitabilityScreen() {
  const jobs = [
    { no: "BE/2026/0398", importer: "Sunrise Industries",    port: "JNPT",   revenue: "₹28,000",  disbursements: "₹18,400", margin: "₹9,600",  pct: "34.3%", pos: true  },
    { no: "BE/2026/0397", importer: "Ravi Exports Pvt Ltd",  port: "JNPT",   revenue: "₹22,500",  disbursements: "₹12,100", margin: "₹10,400", pct: "46.2%", pos: true  },
    { no: "BE/2026/0396", importer: "Global Impex Solutions",port: "INMAA",  revenue: "₹12,000",  disbursements: "₹5,400",  margin: "₹6,600",  pct: "55.0%", pos: true  },
    { no: "BE/2026/0395", importer: "Bharat Heavy Elect.",   port: "INBLR",  revenue: "₹18,000",  disbursements: "₹21,400", margin: "-₹3,400", pct: "-18.9%",pos: false },
    { no: "BE/2026/0394", importer: "HDFC Traders Ltd",      port: "JNPT",   revenue: "₹15,000",  disbursements: "₹7,200",  margin: "₹7,800",  pct: "52.0%", pos: true  },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0D0A1A", fontFamily: "Inter, sans-serif" }}>
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-2 p-3">
        {[
          { label: "Avg Margin",   value: "37.4%",    color: "#22c55e" },
          { label: "Best Client",  value: "Global Impex", color: PA },
          { label: "Total Revenue","value": "₹95,500", color: "#fff"   },
          { label: "Loss BEs",     value: "1",         color: "#ef4444"},
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{s.label}</p>
            <p style={{ fontSize: "11px", fontWeight: 700, color: s.color, marginTop: "2px" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(167,139,250,0.12)" }}>
              {["BE No", "Importer", "Port", "Revenue (Fee)", "Disbursements", "Gross Margin", "Margin %"].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.no} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)", background: !j.pos ? "rgba(239,68,68,0.04)" : "transparent" }}>
                <td className="px-3 py-2.5 font-mono font-bold" style={{ color: PA }}>{j.no}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{j.importer}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>{j.port}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "#fff" }}>{j.revenue}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.55)" }}>{j.disbursements}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: j.pos ? "#22c55e" : "#ef4444" }}>{j.margin}</td>
                <td className="px-3 py-2.5 font-black" style={{ color: j.pos ? "#22c55e" : "#ef4444" }}>{j.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex items-center gap-6 px-4 py-2.5 border-t" style={{ borderColor: "rgba(167,139,250,0.12)" }}>
        {[["Total Revenue", "₹95,500", "#fff"], ["Total Disbursements", "₹64,500", "rgba(255,255,255,0.55)"], ["Net Margin", "₹31,000", "#22c55e"], ["Avg %", "32.5%", "#22c55e"]].map(([l, v, c]) => (
          <div key={l as string}>
            <p style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{l}</p>
            <p style={{ fontSize: "11px", fontWeight: 700, color: c as string, marginTop: "2px" }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  dashboard:     <DashboardScreen />,
  newbe:         <NewBEScreen />,
  icegate:       <ICEGATEScreen />,
  tariff:        <TariffScreen />,
  drawback:      <DrawbackScreen />,
  profitability: <ProfitabilityScreen />,
};

/* ─────────────────────────────────────────────────────────── */
/* FEATURES                                                    */
/* ─────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "gavel",           title: "AI Bill of Entry Preparation",  desc: "AI reads commercial invoice and packing list, pre-fills the entire BE — importer details, HS codes, assessable values. Errors drop to near-zero." },
  { icon: "sync",            title: "ICEGATE Auto-Sync",             desc: "Job status, out-of-charge orders, examination orders — pulled live from ICEGATE every 5 minutes. No manual checking ever." },
  { icon: "search",          title: "Live CBIC Tariff",              desc: "Always-current duty rates. No more cross-checking PDF notifications. Tariff updates apply automatically the moment CBIC publishes them." },
  { icon: "qr_code_scanner", title: "Auto HS Code Detection",        desc: "Upload commercial invoice — AI suggests the correct HS code with a confidence score. Avoids mis-declaration penalties at examination." },
  { icon: "account_balance", title: "Duty Drawback Tracking",        desc: "Track drawback claims job-by-job from filing to receipt. Automatic reminders for pending claims. Dashboard shows total outstanding amounts." },
  { icon: "route",           title: "Per-BE Profitability",          desc: "Know your margin on every Bill of Entry. Revenue vs. disbursements vs. overheads — full job P&L in one view. Spot loss-making clients instantly." },
];

/* ─────────────────────────────────────────────────────────── */
/* FAQ                                                         */
/* ─────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How does AI BE preparation work?",
    a: "AI reads your uploaded commercial invoice and packing list, then auto-fills importer details, goods description, HS codes, and assessable values into the Bill of Entry form. You review and submit. Filing errors drop by approximately 90%.",
  },
  {
    q: "Does EntryX connect to ICEGATE?",
    a: "Yes. EntryX auto-syncs BE status, out-of-charge orders, and examination orders from ICEGATE every 5 minutes. Your team is alerted instantly via in-app notifications — no manual portal checking required.",
  },
  {
    q: "Can I track duty drawback claims?",
    a: "Yes. Every shipping bill's drawback claim is tracked from filing through to receipt. The dashboard shows total pending claims with aging, so you always know what's outstanding and what to follow up on.",
  },
  {
    q: "What does ₹1,899/mo include?",
    a: "Everything — unlimited Bills of Entry, AI BE preparation, ICEGATE auto-sync, live CBIC tariff lookup, automatic HS code detection, duty drawback tracking, custom workflows, per-BE profitability, multi-port support, GST invoicing, document vault, and examination alert notifications. No add-ons, no per-user fees.",
  },
  {
    q: "Does EntryX work for air freight customs too?",
    a: "Yes. EntryX handles sea, air, and land port clearances seamlessly. Switch between JNPT, INMAA, INBLR, INDEL, and all other Indian customs ports from a single dashboard.",
  },
];

/* ─────────────────────────────────────────────────────────── */
/* PAGE                                                        */
/* ─────────────────────────────────────────────────────────── */
export default function EntryXDemoPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const hasEntryX = isAdmin || (session?.user as { subscriptions?: { product: string; status: string }[] } | undefined)?.subscriptions?.some(
    (s) => (s.product === "ENTRYX" || s.product === "FULL_SUITE") && (s.status === "ACTIVE" || s.status === "TRIAL")
  );
  const ctaHref = hasEntryX ? "/dashboard/entryx" : "/pricing";
  const ctaLabel = hasEntryX ? "Open EntryX →" : "View Pricing & Start Free Trial";

  const [activeModule, setActiveModule] = useState("dashboard");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden" style={{ background: "#0D0A1A" }}>
        {/* Purple grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(91,33,182,1) 1px,transparent 1px),linear-gradient(90deg,rgba(91,33,182,1) 1px,transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{ background: `${P}18`, borderColor: `${P}40`, color: PA }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>gavel</span>
              Customs Clearance · Built for Indian CHAs
            </span>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              File Bills of Entry<br />
              <span style={{ color: PA }}>faster. Smarter. Error-free.</span>
            </h1>

            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              AI BE preparation that reads your commercial invoice and pre-fills the entire form. Live CBIC tariff lookup. ICEGATE auto-sync. Built exclusively for licensed Custom House Agents.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: PL, color: "#fff" }}
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
              >
                See Live Demo ↓
              </a>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "AI-assisted", sub: "BE preparation"         },
              { val: "Live",        sub: "CBIC tariff lookup"      },
              { val: "Auto",        sub: "HS code detection"       },
              { val: "₹1,899/mo",   sub: "All features included"   },
            ].map((s) => (
              <div key={s.sub} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                <p className="text-3xl font-black" style={{ color: PA }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES ENTRYX DIFFERENT ──────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Built different</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">What makes EntryX different</h2>
            <p className="text-gray-500 mt-2 text-sm">No generic customs software comes close. EntryX is built for the Indian ICEGATE ecosystem, from the ground up.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-2xl bg-white border" style={{ borderColor: "#f0f0f0" }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${P}10`, border: `1.5px solid ${P}20` }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: P }}>{f.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{f.title}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ─────────────────────────────────────── */}
      <section id="demo" className="py-20 px-6" style={{ background: "#0D0A1A" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `${PA}AA` }}>Interactive demo</span>
            <h2 className="text-3xl font-black text-white mt-2">See every module live</h2>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click any tab to preview the real interface with sample Indian customs data.</p>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeModule === m.id ? PL : "rgba(255,255,255,0.06)",
                  color: activeModule === m.id ? "#fff" : "rgba(255,255,255,0.5)",
                  border: activeModule === m.id ? "none" : "0.5px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* Browser shell */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#080612", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-1.5">
                {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.8 }} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                  app.navkaros.in/entryx/{activeModule === "dashboard" ? "" : activeModule}
                </div>
              </div>
            </div>

            {/* Sidebar + content */}
            <div className="flex" style={{ height: "480px" }}>
              {/* Mini sidebar */}
              <div className="flex flex-col gap-1 px-2 py-3" style={{ width: "48px", background: "#06040f", borderRight: "0.5px solid rgba(255,255,255,0.06)" }}>
                {MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ background: activeModule === m.id ? `${P}25` : "transparent" }}
                    title={m.label}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, color: activeModule === m.id ? PA : "rgba(255,255,255,0.25)" }}
                    >
                      {m.icon}
                    </span>
                  </button>
                ))}
              </div>

              {/* Screen content */}
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

      {/* ── PRICING ──────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Pricing</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">One plan. Everything included.</h2>
            <p className="text-sm text-gray-500 mt-2">No tiers, no hidden add-ons. Every feature from day one.</p>
          </div>
          <div
            className="rounded-2xl border-2 p-8 flex flex-col md:flex-row gap-8 items-center"
            style={{ background: "#0D0A1A", borderColor: PL }}
          >
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${PA}AA` }}>EntryX</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black" style={{ color: PA }}>₹1,899</span>
                <span className="text-base mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>14-day free trial · No credit card required</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: PL, color: "#fff" }}
              >
                Start Free Trial →
              </Link>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {[
                "Unlimited Bills of Entry",
                "AI BE preparation",
                "ICEGATE auto-sync",
                "Live CBIC tariff lookup",
                "Auto HS code detection",
                "Duty drawback tracking",
                "Custom workflows",
                "Per-BE profitability",
                "Multi-port support",
                "GST invoicing",
                "Document vault",
                "Examination alert notifications",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: PA }} />
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions about EntryX</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white overflow-hidden"
                style={{ borderColor: openFaq === i ? `${PL}60` : "#e5e7eb" }}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: PL }} />
                    : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#0D0A1A" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: `${PA}99` }}>Ready to get started?</p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            File faster.<br />
            <span style={{ color: PA }}>Clear smarter.</span>
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            14-day free trial. No credit card. No setup fee.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: PL, color: "#fff" }}
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            EntryX · ₹1,899/mo · All features included · 14-day free trial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
