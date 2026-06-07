"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ─────────────────────────────────────────────────────────── */
/* MODULE TABS                                                  */
/* ─────────────────────────────────────────────────────────── */
const MODULES = [
  { id: "dashboard",    label: "Dashboard",     icon: "dashboard" },
  { id: "trips",        label: "Active Trips",  icon: "local_shipping" },
  { id: "newlr",        label: "New LR",        icon: "post_add" },
  { id: "fleet",        label: "Fleet",         icon: "directions_car" },
  { id: "ewaybill",     label: "E-Way Bill",    icon: "receipt" },
  { id: "invoicing",    label: "Invoicing",     icon: "payments" },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS                                                 */
/* ─────────────────────────────────────────────────────────── */
function DashboardScreen() {
  const kpis = [
    { label: "Active Trips",        value: "18",          change: "3 delayed", up: false },
    { label: "LRs This Month",      value: "142",         change: "+12 today",  up: true  },
    { label: "Revenue MTD",         value: "₹12,84,500",  change: "+8% vs last month", up: true },
    { label: "Fleet Utilisation",   value: "76%",         change: "19 / 25 trucks", up: true },
  ];
  const recentTrips = [
    { lr: "LR/26/00891", from: "JNPT",      to: "Bhiwandi",   truck: "MH04 BX 7792", driver: "Ramesh Kumar",   status: "In Transit" },
    { lr: "LR/26/00890", from: "Pune",       to: "Nagpur",     truck: "MH12 AB 4421", driver: "Suresh Patil",   status: "Delivered"  },
    { lr: "LR/26/00889", from: "Mumbai",     to: "Surat",      truck: "GJ05 CD 8831", driver: "Kamlesh Shah",   status: "Delayed"    },
    { lr: "LR/26/00888", from: "Nhava Sheva",to: "Pune",       truck: "MH04 GH 1102", driver: "Deepak Yadav",   status: "In Transit" },
    { lr: "LR/26/00887", from: "Thane",      to: "Nashik",     truck: "MH43 EF 5509", driver: "Vinod More",     status: "Delivered"  },
  ];
  const statusColor: Record<string, string> = { "In Transit": "#3b82f6", Delivered: "#22c55e", Delayed: "#f97316" };

  return (
    <div className="h-full overflow-y-auto p-3 space-y-3" style={{ background: "#1A0F00", fontFamily: "Inter, sans-serif" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
            <p className="mb-1" style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</p>
            <p className="font-bold" style={{ fontSize: "15px", color: "#F59E0B" }}>{k.value}</p>
            <p className="mt-0.5" style={{ color: k.up ? "#22c55e" : "#f97316", fontSize: "9px" }}>{k.change}</p>
          </div>
        ))}
      </div>
      {/* Alerts */}
      <div className="space-y-1.5">
        {[
          { text: "MH04 BX 7792 — Approaching delivery window in 2 hrs", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
          { text: "E-way bill for LR/26/00891 expires tomorrow — renew now", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" },
          { text: "MH12 AB 4421 — Maintenance due in 2,200 km", color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
        ].map((a) => (
          <div key={a.text} className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: a.bg, border: `0.5px solid ${a.border}` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: a.color }} />
            <p style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.75)" }}>{a.text}</p>
          </div>
        ))}
      </div>
      {/* Recent Trips */}
      <div className="rounded-lg overflow-hidden" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div className="px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Recent Trips</p>
        </div>
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              {["LR No", "From → To", "Truck", "Driver", "Status"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTrips.map((t) => (
              <tr key={t.lr} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2 font-mono" style={{ color: "#F59E0B" }}>{t.lr}</td>
                <td className="px-3 py-2" style={{ color: "rgba(255,255,255,0.6)" }}>{t.from} → {t.to}</td>
                <td className="px-3 py-2" style={{ color: "rgba(255,255,255,0.5)" }}>{t.truck}</td>
                <td className="px-3 py-2" style={{ color: "rgba(255,255,255,0.5)" }}>{t.driver}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColor[t.status]}18`, color: statusColor[t.status], fontSize: "8px" }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActiveTripsScreen() {
  const trips = [
    { lr: "LR/26/00891", consignor: "Ravi Exports Pvt Ltd",  from: "JNPT",       to: "Bhiwandi",     truck: "MH04 BX 7792", driver: "Ramesh Kumar",   dispatch: "05 Jul",  eta: "07 Jul",  status: "In Transit",   gps: "45 km left" },
    { lr: "LR/26/00889", consignor: "Sunrise Industries",     from: "Mumbai",     to: "Surat",        truck: "GJ05 CD 8831", driver: "Kamlesh Shah",   dispatch: "04 Jul",  eta: "06 Jul",  status: "Delayed",      gps: null         },
    { lr: "LR/26/00888", consignor: "Ganesh Traders",         from: "Nhava Sheva",to: "Pune",         truck: "MH04 GH 1102", driver: "Deepak Yadav",   dispatch: "05 Jul",  eta: "07 Jul",  status: "In Transit",   gps: null         },
    { lr: "LR/26/00886", consignor: "Mahaveer Logistics",     from: "Panvel",     to: "Aurangabad",   truck: "MH14 JK 3309", driver: "Santosh Kamble", dispatch: "04 Jul",  eta: "06 Jul",  status: "Delayed",      gps: null         },
    { lr: "LR/26/00884", consignor: "Bharat Steel Works",     from: "Tarapur",    to: "Kolhapur",     truck: "MH06 LM 7744", driver: "Pramod Shinde",  dispatch: "03 Jul",  eta: "05 Jul",  status: "Near Delivery", gps: "12 km left" },
    { lr: "LR/26/00882", consignor: "Omega Auto Parts",       from: "Chakan",     to: "Nagpur",       truck: "MH12 AB 4421", driver: "Suresh Patil",   dispatch: "03 Jul",  eta: "05 Jul",  status: "In Transit",   gps: null         },
    { lr: "LR/26/00880", consignor: "Reliance Infra",         from: "Navi Mumbai",to: "Indore",       truck: "MP09 QR 2210", driver: "Anil Tiwari",    dispatch: "02 Jul",  eta: "05 Jul",  status: "In Transit",   gps: null         },
  ];
  const statusColor: Record<string, string> = { "In Transit": "#3b82f6", Delayed: "#f97316", "Near Delivery": "#22c55e" };

  return (
    <div className="h-full overflow-auto" style={{ background: "#1A0F00" }}>
      <div className="flex items-center gap-2 px-4 py-3 sticky top-0" style={{ background: "#1A0F00", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>Active Trips</p>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", fontSize: "9px" }}>18 trips</span>
        <div className="ml-auto flex gap-2">
          {["Filter", "Export", "+ New LR"].map((b, i) => (
            <button key={b} className="px-2.5 py-1 rounded-lg font-semibold" style={{ background: i === 2 ? "#B45309" : "rgba(255,255,255,0.07)", color: i === 2 ? "#fff" : "rgba(255,255,255,0.6)", fontSize: "9px" }}>{b}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["LR No", "Consignor", "From", "To", "Truck No", "Driver", "Dispatch", "ETA", "GPS", "Status"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t.lr} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2.5 font-mono" style={{ color: "#F59E0B" }}>{t.lr}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{t.consignor}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{t.from}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{t.to}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.65)" }}>{t.truck}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{t.driver}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>{t.dispatch}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>{t.eta}</td>
                <td className="px-3 py-2.5">
                  {t.gps ? (
                    <span className="flex items-center gap-1" style={{ color: "#22c55e", fontSize: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 10 }}>gps_fixed</span>
                      {t.gps}
                    </span>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "8px" }}>—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColor[t.status]}18`, color: statusColor[t.status], fontSize: "8px" }}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewLRScreen() {
  const fields = [
    { label: "LR No",         val: "LR/26/00892",                   col: 1 },
    { label: "Date",          val: "07 Jul 2026",                    col: 1 },
    { label: "Consignor",     val: "Ravi Exports Pvt Ltd",           col: 2 },
    { label: "Consignee",     val: "Sunrise Industries",             col: 2 },
    { label: "From",          val: "JNPT (Nhava Sheva)",             col: 1 },
    { label: "To",            val: "Bhiwandi Warehouse",             col: 1 },
    { label: "Truck No",      val: "MH04 BX 7792",                   col: 1 },
    { label: "Driver",        val: "Ramesh Kumar (+91 98765 43210)", col: 2 },
    { label: "Freight (₹)",   val: "₹14,500",                        col: 1 },
    { label: "Weight (kg)",   val: "8,400 kg",                       col: 1 },
    { label: "Packages",      val: "24 cartons",                     col: 1 },
    { label: "Material",      val: "Electronic Goods",               col: 1 },
  ];
  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#1A0F00" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>New Lorry Receipt (LR)</p>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", fontSize: "9px" }}>Draft</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.label} className={f.col === 2 ? "col-span-2" : ""}>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{f.label}</p>
            <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", fontSize: "10px", color: "rgba(255,255,255,0.8)" }}>{f.val}</div>
          </div>
        ))}
      </div>
      {/* E-Way Bill auto-generating */}
      <div className="mt-3 rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(245,158,11,0.07)", border: "0.5px solid rgba(245,158,11,0.2)" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#F59E0B" }}>receipt_long</span>
        <div className="flex-1">
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>E-Way Bill</p>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>Auto-generating via GST portal API…</p>
        </div>
        <div className="flex gap-1">
          {[1,2,3].map(d => (
            <div key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: "#F59E0B", opacity: d * 0.33, animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      </div>
      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 py-2.5 rounded-xl font-bold text-xs" style={{ background: "#B45309", color: "#fff" }}>Save LR</button>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "0.5px solid rgba(34,197,94,0.25)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>whatsapp</span>
          WhatsApp LR to Driver
        </button>
      </div>
    </div>
  );
}

function FleetScreen() {
  const trucks = [
    { no: "MH04 BX 7792", type: "32ft Container", driver: "Ramesh Kumar",   status: "In Transit",   location: "Thane Bypass",  revenue: "₹2,14,000", util: "88%" },
    { no: "MH12 AB 4421", type: "22ft Body",       driver: "Suresh Patil",   status: "In Transit",   location: "Pune–Nagpur NH", revenue: "₹1,88,500", util: "80%" },
    { no: "GJ05 CD 8831", type: "32ft Container",  driver: "Kamlesh Shah",   status: "Delayed",      location: "Vapi Toll",      revenue: "₹1,62,000", util: "72%" },
    { no: "MH04 GH 1102", type: "22ft Body",       driver: "Deepak Yadav",   status: "In Transit",   location: "Khopoli Ghat",   revenue: "₹1,44,500", util: "76%" },
    { no: "MH43 EF 5509", type: "Mini Truck",      driver: "Vinod More",     status: "Available",    location: "Mumbai Depot",   revenue: "₹88,000",   util: "60%" },
    { no: "MH14 JK 3309", type: "32ft Body",       driver: "Santosh Kamble", status: "Maintenance",  location: "Mumbai Depot",   revenue: "₹54,000",   util: "32%" },
  ];
  const statusColor: Record<string, string> = { "In Transit": "#3b82f6", Available: "#22c55e", Delayed: "#f97316", Maintenance: "#ef4444" };

  return (
    <div className="h-full overflow-y-auto p-3" style={{ background: "#1A0F00" }}>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>Fleet Overview</p>
        <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontSize: "9px" }}>25 trucks total</span>
        <button className="ml-auto px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: "#B45309", color: "#fff", fontSize: "9px" }}>+ Add Truck</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {trucks.map((t) => (
          <div key={t.no} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: `0.5px solid ${t.status === "Maintenance" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}` }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-black" style={{ fontSize: "11px", color: "#F59E0B" }}>{t.no}</p>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>{t.type}</p>
              </div>
              <span className="px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${statusColor[t.status]}18`, color: statusColor[t.status], fontSize: "8px" }}>{t.status}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>Driver</span>
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.6)" }}>{t.driver}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>Location</span>
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)" }}>{t.location}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>Revenue (Mo)</span>
                <span style={{ fontSize: "8px", color: "#22c55e", fontWeight: 700 }}>{t.revenue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>Utilisation</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-14 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="h-full rounded-full" style={{ width: t.util, background: parseInt(t.util) > 70 ? "#22c55e" : parseInt(t.util) > 40 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)" }}>{t.util}</span>
                </div>
              </div>
              {t.status === "Maintenance" && (
                <div className="mt-1.5 px-2 py-1 rounded" style={{ background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.25)" }}>
                  <p style={{ fontSize: "8px", color: "#ef4444" }}>⚠ Maintenance Due — Schedule Service</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EWayBillScreen() {
  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#1A0F00" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>E-Way Bill</p>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "0.5px solid rgba(34,197,94,0.25)", fontSize: "9px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 10 }}>check_circle</span>
          Generated automatically from LR
        </span>
      </div>
      {/* E-Way Bill No */}
      <div className="rounded-xl p-4 mb-3 text-center" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)" }}>
        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>E-Way Bill No</p>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "#F59E0B", letterSpacing: "0.05em", marginTop: "4px" }}>27 1234 5678 90</p>
        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Valid till: 09 Jul 2026 · Distance: 450 km</p>
      </div>
      {/* Detail fields */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "LR No",           val: "LR/26/00891" },
          { label: "Generated On",    val: "05 Jul 2026, 14:22" },
          { label: "Consignor",       val: "Ravi Exports Pvt Ltd" },
          { label: "Consignor GSTIN", val: "27AABCR1234K1ZA" },
          { label: "Consignee",       val: "Sunrise Industries" },
          { label: "Consignee GSTIN", val: "24AABCS5678M1Z9" },
          { label: "From",            val: "JNPT, Mumbai — 400707" },
          { label: "To",              val: "Bhiwandi, Thane — 421302" },
          { label: "Value of Goods",  val: "₹3,82,000" },
          { label: "HSN Code",        val: "8471 (Computers)" },
          { label: "Transporter ID",  val: "27AABCR1234K1ZA" },
          { label: "Vehicle No",      val: "MH04BX7792" },
        ].map((f) => (
          <div key={f.label}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>{f.label}</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", fontWeight: f.label.includes("GSTIN") ? 600 : 400, fontFamily: f.label.includes("GSTIN") ? "monospace" : "inherit" }}>{f.val}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="flex-1 py-2.5 rounded-xl font-bold text-xs" style={{ background: "#B45309", color: "#fff" }}>Download PDF</button>
        <button className="px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Extend Validity</button>
      </div>
    </div>
  );
}

function InvoicingScreen() {
  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#1A0F00" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>GST Freight Invoice Preview</p>
        <span style={{ fontSize: "9px", color: "#F59E0B", background: "rgba(245,158,11,0.1)", border: "0.5px solid rgba(245,158,11,0.25)", padding: "2px 8px", borderRadius: "99px", fontWeight: 700 }}>Draft</span>
      </div>
      {/* Invoice card */}
      <div className="rounded-xl overflow-hidden" style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}>
        {/* Invoice header */}
        <div className="p-3" style={{ background: "rgba(245,158,11,0.08)", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Invoice No</p>
              <p style={{ fontSize: "14px", fontWeight: 800, color: "#F59E0B" }}>RD-INV-2026-0089</p>
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Date: 07 Jul 2026</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Bill To</p>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Sunrise Industries</p>
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>GSTIN: 24AABCS5678M1Z9</p>
            </div>
          </div>
        </div>
        {/* Trip details */}
        <div className="p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex justify-between items-center">
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>Truck No</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>MH04 BX 7792</p>
          </div>
          <div className="flex justify-between items-start">
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>LR Nos</p>
            <div className="text-right">
              {["LR/26/00889", "LR/26/00890", "LR/26/00891"].map(lr => (
                <p key={lr} style={{ fontSize: "9px", color: "#F59E0B", fontFamily: "monospace" }}>{lr}</p>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>Route</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>JNPT → Bhiwandi, Surat × 3 trips</p>
          </div>
        </div>
        {/* Line items */}
        <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}>
          <table className="w-full" style={{ fontSize: "9px" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
                {["Description", "SAC", "Amount"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2" style={{ color: "rgba(255,255,255,0.7)" }}>Road Transport Freight Charges</td>
                <td className="px-3 py-2 font-mono" style={{ color: "rgba(255,255,255,0.45)" }}>996511</td>
                <td className="px-3 py-2 font-semibold" style={{ color: "#fff" }}>₹42,500</td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2" style={{ color: "rgba(255,255,255,0.45)" }}>IGST @ 12%</td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2" style={{ color: "#F59E0B" }}>₹5,100</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between items-center px-3 py-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", background: "rgba(245,158,11,0.06)" }}>
            <p style={{ fontSize: "11px", fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>TOTAL</p>
            <p style={{ fontSize: "18px", fontWeight: 900, color: "#F59E0B" }}>₹47,600</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-2.5 rounded-xl font-bold text-xs" style={{ background: "#B45309", color: "#fff" }}>Generate &amp; Send</button>
        <button className="px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Download PDF</button>
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  dashboard:  <DashboardScreen />,
  trips:      <ActiveTripsScreen />,
  newlr:      <NewLRScreen />,
  fleet:      <FleetScreen />,
  ewaybill:   <EWayBillScreen />,
  invoicing:  <InvoicingScreen />,
};

/* ─────────────────────────────────────────────────────────── */
/* FEATURES                                                    */
/* ─────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "local_shipping",  title: "LR & Builty Management",  desc: "Create LRs in seconds. Builty auto-generated with all consignment details. Driver gets a WhatsApp copy instantly." },
  { icon: "gps_fixed",       title: "Live GPS Tracking",       desc: "Driver app shares live location. You and your client see the truck on a map in real-time. No more \"driver kahan hai?\" calls." },
  { icon: "receipt_long",    title: "Auto E-Way Bill",         desc: "Fill LR details — e-way bill generated automatically via GST portal API. No separate login, no copy-paste." },
  { icon: "payments",        title: "GST Freight Invoicing",   desc: "GST-compliant freight bills with correct SAC codes (996511–996519). One click from trip completion to invoice." },
  { icon: "analytics",       title: "Fleet Analytics",         desc: "Utilisation rate, revenue per km, vehicle-wise P&L, idle days, fuel efficiency tracking. Know which trucks earn and which drain money." },
  { icon: "phone_iphone",    title: "Driver Mobile App",       desc: "Your drivers use the RunDesk app to update trip status, share location, upload POD photos, get LR details. No phone calls needed." },
];

/* ─────────────────────────────────────────────────────────── */
/* FAQ                                                         */
/* ─────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How does GPS tracking work?",
    a: "Your driver installs the RunDesk Driver App (free) and enables location sharing. You see live location on a map. Clients can also get a tracking link for their consignment.",
  },
  {
    q: "Does RunDesk auto-generate e-way bills?",
    a: "Yes. When you fill LR details, RunDesk auto-generates the e-way bill via the GST portal API. GSTIN, distance, value — all pre-filled from the LR. No separate login needed.",
  },
  {
    q: "Can drivers receive LRs on their phone?",
    a: "Yes. When you create an LR, the driver gets a WhatsApp message with full consignment details, from/to address, and delivery instructions. The driver app also shows all assigned trips.",
  },
  {
    q: "What does ₹1,399/mo include?",
    a: "Everything — unlimited LRs, GPS tracking, e-way bill automation, GST invoicing, fleet analytics, mobile driver app, POD capture, WhatsApp notifications. No add-ons.",
  },
  {
    q: "Does RunDesk work for part-load (LCL) transport too?",
    a: "Yes. RunDesk handles FTL (full truck), LCL (part load), and container transport. You can split one trip across multiple LRs with different consignees.",
  },
];

/* ─────────────────────────────────────────────────────────── */
/* PAGE                                                        */
/* ─────────────────────────────────────────────────────────── */
export default function RunDeskPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const hasRundesk = isAdmin || (session?.user as { subscriptions?: { product: string; status: string }[] } | undefined)?.subscriptions?.some(
    (s) => (s.product === "RUNDESK" || s.product === "FULL_SUITE") && (s.status === "ACTIVE" || s.status === "TRIAL")
  );
  const ctaHref = hasRundesk ? "/dashboard/rundesk" : "/pricing";
  const ctaLabel = hasRundesk ? "Open RunDesk →" : "View Pricing & Start Free Trial";

  const [activeModule, setActiveModule] = useState("dashboard");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="pt-28 pb-20 px-6 relative overflow-hidden"
        style={{ background: "#1A0F00" }}
      >
        {/* Amber grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,1) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.25)", color: "#F59E0B" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>local_shipping</span>
              Transport Management · Built for Indian Fleets
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Every truck tracked.<br />
              <span style={{ color: "#F59E0B" }}>Every LR billed automatically.</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              GPS tracking via driver app, auto e-way bill generation, and GST freight invoicing — built exclusively for Indian transporters and fleet operators.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: "#B45309", color: "#fff" }}
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider border transition-all duration-200 hover:border-[#F59E0B] hover:text-[#F59E0B]"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
              >
                See Live Demo ↓
              </a>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "GPS Live",  sub: "Every truck tracked" },
              { val: "Auto",      sub: "E-Way bill generation" },
              { val: "1 click",   sub: "GST freight invoice" },
              { val: "₹1,399/mo", sub: "All features included" },
            ].map((s) => (
              <div
                key={s.sub}
                className="rounded-2xl p-5 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-3xl font-black" style={{ color: "#F59E0B" }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES RUNDESK DIFFERENT ─────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Built different</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">What makes RunDesk different</h2>
            <p className="text-gray-500 mt-2 text-sm">
              RunDesk is transport management built exclusively for Indian road freight. Generic TMS software doesn&apos;t speak your language.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-5 rounded-2xl bg-white border"
                style={{ borderColor: "#f0f0f0" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(180,83,9,0.08)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#B45309" }}>{f.icon}</span>
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
      <section id="demo" className="py-20 px-6" style={{ background: "#1A0F00" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(245,158,11,0.7)" }}>Interactive demo</span>
            <h2 className="text-3xl font-black text-white mt-2">See every module live</h2>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click any tab to preview the real interface with sample Indian transport data.</p>
          </div>

          {/* Module tab bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeModule === m.id ? "#B45309" : "rgba(255,255,255,0.06)",
                  color: activeModule === m.id ? "#fff" : "rgba(255,255,255,0.5)",
                  border: activeModule === m.id ? "none" : "0.5px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* App shell */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Browser bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: "#0D0700", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex gap-1.5">
                {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.8 }} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                  app.navkaros.in/rundesk/{activeModule === "dashboard" ? "" : activeModule}
                </div>
              </div>
            </div>

            {/* Sidebar + content */}
            <div className="flex" style={{ height: "480px" }}>
              {/* Mini sidebar */}
              <div
                className="flex flex-col gap-1 px-2 py-3"
                style={{ width: "48px", background: "#0D0700", borderRight: "0.5px solid rgba(255,255,255,0.06)" }}
              >
                {MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ background: activeModule === m.id ? "rgba(180,83,9,0.25)" : "transparent" }}
                    title={m.label}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, color: activeModule === m.id ? "#F59E0B" : "rgba(255,255,255,0.25)" }}
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
            style={{ background: "#1A0F00", borderColor: "#B45309" }}
          >
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(245,158,11,0.7)" }}>RunDesk</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black" style={{ color: "#F59E0B" }}>₹1,399</span>
                <span className="text-base mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>14-day free trial · No credit card required</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: "#B45309", color: "#fff" }}
              >
                Start Free Trial →
              </Link>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {[
                "Unlimited LRs & builty",
                "Live GPS via driver app",
                "Auto e-way bill generation",
                "GST freight invoicing",
                "Fleet utilisation analytics",
                "Mobile driver app (iOS + Android)",
                "POD photo capture",
                "WhatsApp LR delivery to driver",
                "Multi-branch support",
                "Vehicle maintenance tracker",
                "Consignee notifications",
                "Per-trip P&L",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#F59E0B" }} />
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
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions about RunDesk</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white overflow-hidden"
                style={{ borderColor: openFaq === i ? "rgba(180,83,9,0.4)" : "#e5e7eb" }}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "#B45309" }} />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
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
      <section className="py-20 px-6" style={{ background: "#1A0F00" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(245,158,11,0.6)" }}>Ready to get started?</p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Your fleet, always<br />
            <span style={{ color: "#F59E0B" }}>where you need it.</span>
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            14-day free trial. No credit card. No setup fee. Your existing data stays yours.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: "#B45309", color: "#fff" }}
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            RunDesk · ₹1,399/mo · All features included · 14-day free trial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
