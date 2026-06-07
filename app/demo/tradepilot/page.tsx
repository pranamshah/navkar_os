"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ─────────────────────────────────────────────────────────── */
/* DEMO TABS                                                    */
/* ─────────────────────────────────────────────────────────── */
const TABS = [
  { id: "landed",    label: "Landed Cost", icon: "calculate"  },
  { id: "fta",       label: "FTA Check",   icon: "handshake"  },
  { id: "hs",        label: "HS Lookup",   icon: "search"     },
  { id: "rodtep",    label: "RoDTEP",      icon: "payments"   },
  { id: "analytics", label: "Analytics",   icon: "analytics"  },
  { id: "vault",     label: "Doc Vault",   icon: "folder"     },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS                                                 */
/* ─────────────────────────────────────────────────────────── */

function LandedCostScreen() {
  const inputs = [
    { label: "HS Code",        val: "8471.30.00" },
    { label: "Origin Country", val: "China" },
    { label: "FOB Value",      val: "USD 18,500" },
    { label: "Exchange Rate",  val: "₹83.42 / USD" },
    { label: "Incoterm",       val: "FOB" },
    { label: "Freight (USD)",  val: "USD 1,200" },
    { label: "Insurance",      val: "USD 185" },
  ];

  const rows = [
    { label: "FOB Value",                    val: "₹15,43,270", highlight: false, indent: false },
    { label: "+ Freight",                    val: "₹1,00,104",  highlight: false, indent: true  },
    { label: "+ Insurance",                  val: "₹15,432",    highlight: false, indent: true  },
    { label: "= CIF (Assessable Value)",     val: "₹16,58,806", highlight: "sub",  indent: false },
    { label: "BCD @ 20%",                    val: "₹3,31,761",  highlight: false, indent: true  },
    { label: "SWS @ 10% on BCD",             val: "₹33,176",    highlight: false, indent: true  },
    { label: "IGST @ 18% (AV+BCD+SWS)",     val: "₹3,64,966",  highlight: false, indent: true  },
    { label: "CFS + Port Charges",           val: "₹45,000",    highlight: false, indent: true  },
    { label: "Transport (ICD to warehouse)", val: "₹18,000",    highlight: false, indent: true  },
    { label: "TOTAL LANDED COST",            val: "₹24,51,709", highlight: "total", indent: false },
    { label: "Per Unit (50 pcs)",            val: "₹49,034",    highlight: "unit", indent: false },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#060D1A" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b sticky top-0" style={{ borderColor: "rgba(96,165,250,0.12)", background: "#060D1A" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#60A5FA" }}>calculate</span>
        <p className="text-xs font-bold text-white">AI Landed Cost Calculator</p>
        <div className="ml-auto flex gap-2">
          {["Clear","Recalculate","Export PDF"].map((b, i) => (
            <button key={b} className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{ background: i === 1 ? "#1E3A5F" : "rgba(255,255,255,0.06)", color: i === 1 ? "#60A5FA" : "rgba(255,255,255,0.5)", fontSize: "9px", border: i === 1 ? "0.5px solid rgba(96,165,250,0.3)" : "none" }}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Inputs */}
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "9px" }}>Shipment Inputs</p>
          <div className="space-y-2">
            {inputs.map((f) => (
              <div key={f.label} className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>{f.label}</p>
                <p style={{ fontSize: "10px", color: "#E2E8F0", fontWeight: 600 }}>{f.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "9px" }}>Cost Breakdown</p>
          <div className="rounded-xl overflow-hidden" style={{ border: "0.5px solid rgba(96,165,250,0.15)" }}>
            {rows.map((r, i) => (
              <div key={i}
                className="flex justify-between px-3 py-2"
                style={{
                  background: r.highlight === "total" ? "rgba(30,58,95,0.8)" : r.highlight === "sub" ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.02)",
                  borderBottom: i < rows.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                }}>
                <p style={{ fontSize: "9px", color: r.highlight === "total" ? "#93C5FD" : r.indent ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.7)", paddingLeft: r.indent ? "8px" : "0" }}>
                  {r.label}
                </p>
                <p style={{ fontSize: "10px", fontWeight: r.highlight ? 700 : 500, color: r.highlight === "total" ? "#60A5FA" : r.highlight === "unit" ? "#34D399" : r.highlight === "sub" ? "#93C5FD" : "#E2E8F0" }}>
                  {r.val}
                </p>
              </div>
            ))}
          </div>
          {/* FTA Alert */}
          <div className="mt-2 px-3 py-2 rounded-lg flex items-start gap-2"
            style={{ background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.2)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#FCA5A5", marginTop: "1px" }}>info</span>
            <p style={{ fontSize: "9px", color: "#FCA5A5" }}>CEPA India-UAE: Not eligible (Origin: China). Switch to UAE origin to save ₹3,31,761 BCD.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FTACheckScreen() {
  const results = [
    { label: "SAFTA (SAARC)",        eligible: true,  duty: "0%",     std: "20%", note: "Bangladesh is SAARC member"         },
    { label: "DFIA (Duty-Free Import)", eligible: true, duty: "Check", std: "—",  note: "Apply via DGFT for advance auth"     },
    { label: "ASEAN FTA",            eligible: false, duty: "N/A",    std: "20%", note: "Bangladesh not in ASEAN"             },
    { label: "CEPA India-UAE",       eligible: false, duty: "N/A",    std: "20%", note: "Origin must be UAE"                  },
  ];

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#060D1A" }}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[{ label: "HS Code", val: "6204.62.00" }, { label: "Product", val: "Women's trousers, cotton" }, { label: "Origin Country", val: "Bangladesh" }, { label: "Shipment Value", val: "₹14,20,000" }].map((f) => (
          <div key={f.label} className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</p>
            <p style={{ fontSize: "10px", color: "#E2E8F0", fontWeight: 600, marginTop: "2px" }}>{f.val}</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold mb-3" style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "9px" }}>FTA Eligibility Results</p>
      <div className="space-y-2 mb-4">
        {results.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ background: r.eligible ? "rgba(52,211,153,0.06)" : "rgba(239,68,68,0.05)", border: `0.5px solid ${r.eligible ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.15)"}` }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: r.eligible ? "#34D399" : "#F87171" }}>
                {r.eligible ? "check_circle" : "cancel"}
              </span>
              <div>
                <p style={{ fontSize: "10px", color: r.eligible ? "#6EE7B7" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>{r.label}</p>
                <p style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>{r.note}</p>
              </div>
            </div>
            {r.eligible && r.duty !== "Check" && (
              <div className="text-right">
                <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>Duty</p>
                <p style={{ fontSize: "13px", fontWeight: 800, color: "#34D399" }}>{r.duty}</p>
                <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>std {r.std}</p>
              </div>
            )}
            {r.eligible && r.duty === "Check" && (
              <button className="px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA", fontSize: "9px" }}>Check DGFT</button>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(30,58,95,0.6)", border: "1px solid rgba(59,130,246,0.3)" }}>
        <div>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Potential Duty Saving via SAFTA</p>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>vs standard BCD 20% on ₹14,20,000</p>
        </div>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "#34D399" }}>₹2,84,000</p>
      </div>
    </div>
  );
}

function HSLookupScreen() {
  const related = [
    { code: "8471.41.00", desc: "Workstations", bcd: "20%", igst: "18%" },
    { code: "8471.49.00", desc: "Other computers, other", bcd: "20%", igst: "18%" },
    { code: "8471.50.00", desc: "Processing units (excl 8471.41/49)", bcd: "0%", igst: "18%" },
  ];

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#060D1A" }}>
      {/* Search bar */}
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-4"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(96,165,250,0.3)" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#60A5FA" }}>search</span>
        <p style={{ fontSize: "11px", color: "#93C5FD", fontWeight: 500 }}>laptop</p>
        <div className="ml-auto px-2 py-0.5 rounded" style={{ background: "rgba(96,165,250,0.15)" }}>
          <p style={{ fontSize: "8px", color: "#60A5FA" }}>4 results</p>
        </div>
      </div>

      {/* Primary result */}
      <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(30,58,95,0.5)", border: "1px solid rgba(59,130,246,0.3)" }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-black" style={{ color: "#60A5FA", fontSize: "13px", letterSpacing: "0.05em" }}>8471.30.00</p>
            <p style={{ fontSize: "10px", color: "#E2E8F0", fontWeight: 600, marginTop: "2px" }}>Portable automatic data processing machines</p>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Weight not exceeding 10 kg — laptops, notebooks, sub-notebooks</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(52,211,153,0.15)", color: "#34D399", fontSize: "8px" }}>Primary Match</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[["BCD", "20%", "#FCA5A5"], ["IGST", "18%", "#93C5FD"], ["SWS", "10% on BCD", "#FDE68A"]].map(([l, v, c]) => (
            <div key={l} className="rounded-lg px-2.5 py-2 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
              <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>{l}</p>
              <p style={{ fontSize: "12px", fontWeight: 800, color: c }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.2)" }}>
          <p style={{ fontSize: "9px", color: "#FCA5A5", fontWeight: 700 }}>Custom Notification 15/2024</p>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>BCD revised from 0% to 20% w.e.f. 01 Feb 2024 — Budget 2024 announcement</p>
        </div>
        <div className="flex gap-3 mt-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
            <p style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.5)" }}>No licensing restriction</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
            <p style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.5)" }}>No prohibition</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FDE68A" }} />
            <p style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.5)" }}>BIS compulsory</p>
          </div>
        </div>
      </div>

      {/* Related codes */}
      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Related HS Codes</p>
      <div className="space-y-1.5">
        {related.map((r) => (
          <div key={r.code} className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p style={{ fontSize: "10px", color: "#93C5FD", fontWeight: 700 }}>{r.code}</p>
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)" }}>{r.desc}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.12)", color: "#FCA5A5", fontSize: "9px" }}>BCD {r.bcd}</span>
              <span className="px-2 py-0.5 rounded" style={{ background: "rgba(96,165,250,0.1)", color: "#93C5FD", fontSize: "9px" }}>IGST {r.igst}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoDTEPScreen() {
  const rows = [
    { sb: "4892061", date: "02 Jun 2026", fob: "₹8,42,000",  rate: "0.4%", claim: "₹3,368",  status: "Received" },
    { sb: "4891204", date: "28 May 2026", fob: "₹12,14,500", rate: "0.4%", claim: "₹4,858",  status: "Filed"    },
    { sb: "4889302", date: "15 May 2026", fob: "₹6,80,000",  rate: "0.4%", claim: "₹2,720",  status: "Received" },
    { sb: "4888011", date: "04 May 2026", fob: "₹22,40,000", rate: "0.4%", claim: "₹8,960",  status: "Pending"  },
    { sb: "4885421", date: "19 Apr 2026", fob: "₹18,00,000", rate: "0.4%", claim: "₹7,200",  status: "Filed"    },
  ];
  const sc: Record<string, string> = { Received: "#34D399", Filed: "#60A5FA", Pending: "#FDE68A" };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#060D1A" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-2 p-4">
        {[
          { l: "Total Claims FY 26-27", v: "₹8,42,500", c: "#E2E8F0" },
          { l: "Scrips Received",       v: "₹5,18,000", c: "#34D399" },
          { l: "Pending (Filed)",       v: "₹2,24,500", c: "#60A5FA" },
          { l: "Pending (Not Filed)",   v: "₹1,00,000", c: "#FDE68A" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", lineHeight: 1.4 }}>{k.l}</p>
            <p style={{ fontSize: "13px", fontWeight: 800, color: k.c, marginTop: "4px" }}>{k.v}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Shipping Bill No", "Date", "FOB Value", "RoDTEP Rate", "Claim Amount", "Status"].map(h => (
                <th key={h} className="px-4 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sb} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-2.5 font-mono" style={{ color: "#93C5FD" }}>{r.sb}</td>
                <td className="px-4 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{r.date}</td>
                <td className="px-4 py-2.5 font-semibold" style={{ color: "#E2E8F0" }}>{r.fob}</td>
                <td className="px-4 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{r.rate}</td>
                <td className="px-4 py-2.5 font-bold" style={{ color: "#34D399" }}>{r.claim}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${sc[r.status]}18`, color: sc[r.status], fontSize: "8px" }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(52,211,153,0.06)", border: "0.5px solid rgba(52,211,153,0.2)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#34D399" }}>tips_and_updates</span>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>3 shipping bills from Apr 2026 are pending filing. File before 30 Jun 2026 to avoid lapse.</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsScreen() {
  const importSkus = [
    { hs: "8471.30", product: "Laptops",         total: "₹42,18,000", margin: "-8.2%" },
    { hs: "8517.12", product: "Mobile phones",    total: "₹28,44,000", margin: "+12.4%" },
    { hs: "9403.20", product: "Metal furniture",  total: "₹14,22,000", margin: "+18.6%" },
    { hs: "3926.90", product: "Plastic articles", total: "₹9,80,000",  margin: "+22.1%" },
  ];

  const importCountries = [
    { c: "China",  pct: 62, color: "#EF4444" },
    { c: "UAE",    pct: 18, color: "#60A5FA" },
    { c: "USA",    pct: 12, color: "#34D399" },
    { c: "Other",  pct: 8,  color: "#94A3B8" },
  ];

  const months = ["J","A","S","O","N","D","J","F","M","A","M","J"];
  const vals   = [38, 42, 35, 50, 55, 62, 58, 70, 66, 72, 80, 88];

  const exportMkts = [
    { c: "USA",     v: "₹42L", w: 80, color: "#34D399" },
    { c: "UAE",     v: "₹28L", w: 55, color: "#60A5FA" },
    { c: "UK",      v: "₹18L", w: 35, color: "#93C5FD" },
    { c: "Germany", v: "₹14L", w: 27, color: "#A5B4FC" },
  ];

  return (
    <div className="h-full overflow-y-auto p-3 space-y-3" style={{ background: "#060D1A" }}>
      <div className="grid grid-cols-2 gap-3">
        {/* Top Import SKUs */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>Top Import SKUs by Landed Cost</p>
          <div className="space-y-1.5">
            {importSkus.map((s) => (
              <div key={s.hs} className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: "8.5px", color: "#93C5FD", fontWeight: 700 }}>{s.hs}</p>
                  <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)" }}>{s.product}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: "9px", color: "#E2E8F0", fontWeight: 600 }}>{s.total}</p>
                  <p style={{ fontSize: "8px", color: s.margin.startsWith("+") ? "#34D399" : "#F87171" }}>{s.margin} margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Import by Country */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>Import by Origin Country</p>
          <div className="space-y-2">
            {importCountries.map((ic) => (
              <div key={ic.c}>
                <div className="flex justify-between mb-1">
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)" }}>{ic.c}</p>
                  <p style={{ fontSize: "9px", color: ic.color, fontWeight: 700 }}>{ic.pct}%</p>
                </div>
                <div className="w-full rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${ic.pct}%`, background: ic.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Import Value */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>Monthly Import Value — FY 2025-26</p>
          <div className="flex items-end gap-1 h-14">
            {vals.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-sm" style={{ height: `${h * 0.55}px`, background: i === 11 ? "#3B82F6" : "rgba(59,130,246,0.45)" }} />
                <p style={{ fontSize: "6px", color: "#4B5563" }}>{months[i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Export Markets */}
        <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>Export Markets FY 2025-26</p>
          <div className="space-y-2">
            {exportMkts.map((e) => (
              <div key={e.c} className="flex items-center gap-2">
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", width: "52px", flexShrink: 0 }}>{e.c}</p>
                <div className="flex-1 rounded-full h-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-2 rounded-full" style={{ width: `${e.w}%`, background: e.color }} />
                </div>
                <p style={{ fontSize: "9px", color: e.color, fontWeight: 700, width: "32px", textAlign: "right" }}>{e.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocVaultScreen() {
  const files = [
    { name: "CI-2026-0142.pdf",  type: "Commercial Invoice",   size: "248 KB", date: "02 Jun 2026" },
    { name: "PL-2026-0142.pdf",  type: "Packing List",         size: "185 KB", date: "02 Jun 2026" },
    { name: "BL-2026-0142.pdf",  type: "Bill of Lading",       size: "512 KB", date: "03 Jun 2026" },
    { name: "BE2026-0398.pdf",   type: "BE Copy (Customs)",     size: "1.1 MB", date: "08 Jun 2026" },
    { name: "DPC-2026-0398.pdf", type: "Duty Payment Challan", size: "94 KB",  date: "08 Jun 2026" },
  ];
  const iconColor: Record<string, string> = {
    "Commercial Invoice":  "#60A5FA",
    "Packing List":        "#34D399",
    "Bill of Lading":      "#A78BFA",
    "BE Copy (Customs)":   "#FDE68A",
    "Duty Payment Challan":"#FCA5A5",
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#060D1A" }}>
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b sticky top-0" style={{ borderColor: "rgba(96,165,250,0.1)", background: "#060D1A" }}>
        <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>search</span>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>Search documents...</p>
        </div>
        <button className="text-xs px-2.5 py-1.5 rounded-lg font-semibold" style={{ background: "#1E3A5F", color: "#60A5FA", border: "0.5px solid rgba(96,165,250,0.3)", fontSize: "9px" }}>+ Upload</button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        {["All Shipments", "FY 2026-27", "JNPT Imports", "JNPT/26/0142"].map((b, i, arr) => (
          <div key={b} className="flex items-center gap-1.5">
            <p style={{ fontSize: "9px", color: i === arr.length - 1 ? "#93C5FD" : "rgba(255,255,255,0.35)", fontWeight: i === arr.length - 1 ? 700 : 400 }}>{b}</p>
            {i < arr.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px" }}>/</span>}
          </div>
        ))}
      </div>

      {/* Shipment info strip */}
      <div className="flex gap-4 px-4 py-2.5" style={{ background: "rgba(30,58,95,0.3)", borderBottom: "0.5px solid rgba(96,165,250,0.1)" }}>
        {[["Shipment", "JNPT/26/0142"], ["Vessel", "MSC AURORA"], ["BL Date", "02 Jun 2026"], ["Importer", "Global Impex Pvt Ltd"]].map(([l, v]) => (
          <div key={l}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{l}</p>
            <p style={{ fontSize: "9.5px", color: "#E2E8F0", fontWeight: 600 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* File list */}
      <div className="p-4 space-y-2">
        {files.map((f) => (
          <div key={f.name} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${iconColor[f.type]}12`, border: `0.5px solid ${iconColor[f.type]}30` }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: iconColor[f.type] }}>picture_as_pdf</span>
              </div>
              <div>
                <p style={{ fontSize: "10px", color: "#E2E8F0", fontWeight: 600 }}>{f.name}</p>
                <p style={{ fontSize: "8.5px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>{f.type} · {f.size} · {f.date}</p>
              </div>
            </div>
            <button className="px-2.5 py-1 rounded-lg text-xs flex items-center gap-1"
              style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "0.5px solid rgba(96,165,250,0.2)", fontSize: "8.5px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>download</span> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  landed:    <LandedCostScreen />,
  fta:       <FTACheckScreen />,
  hs:        <HSLookupScreen />,
  rodtep:    <RoDTEPScreen />,
  analytics: <AnalyticsScreen />,
  vault:     <DocVaultScreen />,
};

/* ─────────────────────────────────────────────────────────── */
/* FEATURES                                                    */
/* ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "calculate",
    title: "AI Landed Cost Calculator",
    desc: "Enter HS code, origin country, FOB value — TradePilot calculates CIF, BCD, CVD, IGST, port charges, CFS, transport. Your true cost before you place the order.",
  },
  {
    icon: "handshake",
    title: "FTA Eligibility Check",
    desc: "Check if your product qualifies for reduced duty under ASEAN, SAFTA, CEPA (UAE, Australia, Mauritius) or other agreements. Know before your shipment arrives.",
  },
  {
    icon: "payments",
    title: "RoDTEP Tracker",
    desc: "Track your RoDTEP scrip credits job-by-job. Know outstanding claims, received amounts, and utilisation — all in one dashboard.",
  },
  {
    icon: "search",
    title: "Unlimited HS Code Lookup",
    desc: "Search any product — TradePilot suggests the correct HS code with duty rates, prohibitions, licensing requirements, and recent CBIC notifications.",
  },
  {
    icon: "analytics",
    title: "Trade Analytics",
    desc: "P&L per product line, per supplier, per country. Spot which SKUs cost too much to import and which export markets are most profitable.",
  },
  {
    icon: "folder",
    title: "Document Vault",
    desc: "Store all trade documents — commercial invoices, packing lists, BLs, BEs, LC copies — organised by shipment. Accessible anywhere, forever.",
  },
];

/* ─────────────────────────────────────────────────────────── */
/* FAQ                                                         */
/* ─────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How accurate is the landed cost calculator?",
    a: "Very accurate. TradePilot uses live exchange rates, current CBIC duty rates, and your actual freight/insurance inputs. The only variable is port-level charges (CFS, handling) which you input once and TradePilot remembers for all future calculations.",
  },
  {
    q: "Which FTAs does TradePilot cover?",
    a: "ASEAN-India FTA, SAFTA (SAARC), CECA (Singapore), CEPA (UAE, Australia, Mauritius), IKCEPA (Japan), AIFTA (ASEAN India), and bilateral agreements. The database is updated whenever new agreements are notified by DGFT or Ministry of Commerce.",
  },
  {
    q: "How does RoDTEP tracking work?",
    a: "Every export shipment's RoDTEP claim is tracked from shipping bill filing to scrip issuance to utilisation. The dashboard shows total pending, received, and utilized amounts — and alerts you before any claim lapses.",
  },
  {
    q: "What does ₹1,699/mo include?",
    a: "Everything — landed cost calculator, FTA checker, RoDTEP tracker, unlimited HS lookups, trade analytics, document vault, DGFT tracking, and duty benefit alerts. No tiers, no add-ons. Every feature from day one.",
  },
  {
    q: "Can TradePilot help with export incentives too?",
    a: "Yes. TradePilot tracks RoDTEP, DFIA, Advance Authorisation, and MEIS/RODTEP transitions. Know your total export benefit position at all times, per shipment and per year.",
  },
];

/* ─────────────────────────────────────────────────────────── */
/* PAGE                                                        */
/* ─────────────────────────────────────────────────────────── */
export default function TradePilotPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const hasTradePilot = isAdmin || (session?.user as { subscriptions?: { product: string; status: string }[] } | undefined)?.subscriptions?.some(
    (s) => (s.product === "TRADEPILOT" || s.product === "FULL_SUITE") && (s.status === "ACTIVE" || s.status === "TRIAL")
  );
  const ctaHref  = hasTradePilot ? "/dashboard/tradepilot" : "/pricing";
  const ctaLabel = hasTradePilot ? "Open TradePilot →" : "View Pricing & Start Free Trial";

  const [activeTab, setActiveTab] = useState("landed");
  const [openFaq, setOpenFaq]     = useState<number | null>(null);

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden" style={{ background: "#060D1A" }}>
        {/* Indigo grid */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(59,130,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.25)", color: "#60A5FA" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>public</span>
              Import/Export Intelligence · Built for Indian Traders
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Know your exact landed cost.<br />
              <span style={{ color: "#3B82F6" }}>Before you place the order.</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              AI-powered landed cost calculator, live FTA eligibility check, RoDTEP scrip tracker, and unlimited HS code lookup — one platform for every import and export decision.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <Link href={ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: "#3B82F6", color: "#fff" }}>
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#demo"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider border transition-all duration-200 hover:border-[#60A5FA] hover:text-[#60A5FA]"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                See Live Demo ↓
              </a>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "AI",      sub: "Landed cost calculator"  },
              { val: "Live",    sub: "FTA eligibility check"   },
              { val: "Auto",    sub: "RoDTEP tracking"         },
              { val: "₹1,699/mo", sub: "All features included" },
            ].map((s) => (
              <div key={s.sub} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                <p className="text-3xl font-black" style={{ color: "#3B82F6" }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES IT DIFFERENT ──────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Built different</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">What makes TradePilot different</h2>
            <p className="text-gray-500 mt-2 text-sm">Generic ERP doesn't calculate your landed cost. TradePilot does — in seconds, with live rates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-2xl bg-white border" style={{ borderColor: "#f0f0f0" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(59,130,246,0.08)", border: "1.5px solid rgba(59,130,246,0.15)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#1E3A5F" }}>{f.icon}</span>
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
      <section id="demo" className="py-20 px-6" style={{ background: "#060D1A" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(96,165,250,0.7)" }}>Interactive demo</span>
            <h2 className="text-3xl font-black text-white mt-2">See every module live</h2>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click any tab to preview the real interface with sample import/export data.</p>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeTab === t.id ? "#1E3A5F" : "rgba(255,255,255,0.05)",
                  color: activeTab === t.id ? "#60A5FA" : "rgba(255,255,255,0.45)",
                  border: activeTab === t.id ? "1px solid rgba(59,130,246,0.4)" : "0.5px solid rgba(255,255,255,0.07)",
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* App shell */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(59,130,246,0.15)" }}>
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#020810", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-1.5">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.8 }} />)}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                  app.navkaros.in/tradepilot/{activeTab}
                </div>
              </div>
            </div>

            {/* Sidebar + content */}
            <div className="flex" style={{ height: "480px" }}>
              {/* Mini sidebar */}
              <div className="flex flex-col gap-1 px-2 py-3" style={{ width: "48px", background: "#020810", borderRight: "0.5px solid rgba(59,130,246,0.1)" }}>
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ background: activeTab === t.id ? "rgba(59,130,246,0.15)" : "transparent" }}
                    title={t.label}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: activeTab === t.id ? "#60A5FA" : "rgba(255,255,255,0.2)" }}>{t.icon}</span>
                  </button>
                ))}
              </div>

              {/* Screen content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="h-full">
                    {SCREENS[activeTab]}
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
          <div className="rounded-2xl border-2 p-8 flex flex-col md:flex-row gap-8 items-center"
            style={{ background: "#060D1A", borderColor: "#1E3A5F" }}>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(96,165,250,0.7)" }}>TradePilot</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black" style={{ color: "#3B82F6" }}>₹1,699</span>
                <span className="text-base mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>14-day free trial · No credit card required</p>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: "#3B82F6", color: "#fff" }}>
                Start Free Trial →
              </Link>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {[
                "AI landed cost calculator",
                "FTA & CEPA eligibility check",
                "RoDTEP scrip tracker",
                "Unlimited HS code lookup",
                "Live CBIC duty rates",
                "Trade analytics by SKU/country",
                "Per-shipment profitability",
                "Document vault (unlimited storage)",
                "DGFT licence tracking",
                "Duty benefit alerts",
                "Multi-currency P&L",
                "Export incentive tracker",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#3B82F6" }} />
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
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions about TradePilot</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border bg-white overflow-hidden"
                style={{ borderColor: openFaq === i ? "rgba(59,130,246,0.4)" : "#e5e7eb" }}>
                <button className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "#3B82F6" }} />
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
      <section className="py-20 px-6" style={{ background: "#060D1A" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(96,165,250,0.6)" }}>Ready to get started?</p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Trade smarter.<br />
            <span style={{ color: "#3B82F6" }}>Profit more.</span>
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            14-day free trial. No credit card. No setup fee. Know your landed cost before your next order.
          </p>
          <Link href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: "#3B82F6", color: "#fff" }}>
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            TradePilot · ₹1,699/mo · All features included · 14-day free trial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
