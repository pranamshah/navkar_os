"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ─────────────────────────────────────────────────────────── */
/* CONSTANTS                                                    */
/* ─────────────────────────────────────────────────────────── */
const PRIMARY   = "#0D7057";
const LIGHT     = "#10B981";
const ACCENT    = "#34D399";
const DARK_BG   = "#071A14";
const LIGHT_BG  = "#f9f9f9";

/* ─────────────────────────────────────────────────────────── */
/* TABS                                                         */
/* ─────────────────────────────────────────────────────────── */
const TABS = [
  { id: "yard",       label: "Yard View",   icon: "view_in_ar"    },
  { id: "gatelog",    label: "Gate Log",    icon: "garage"        },
  { id: "containers", label: "Containers",  icon: "inventory_2"   },
  { id: "billing",    label: "Billing",     icon: "calculate"     },
  { id: "invoice",    label: "Invoice",     icon: "receipt_long"  },
  { id: "reports",    label: "Reports",     icon: "bar_chart"     },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS                                                 */
/* ─────────────────────────────────────────────────────────── */

/* Bay type: 0=empty, 1=normal, 2=detention, 3=examination */
const YARD_GRID: number[] = [
  1, 1, 2, 1, 0,   1, 1, 1, 3, 1,
  0, 1, 1, 1, 1,   2, 1, 0, 1, 1,
  1, 0, 1, 1, 2,   1, 1, 1, 0, 1,
  1, 1, 0, 1, 1,   1, 2, 1, 1, 0,
];

const BAY_CONTAINERS = [
  "TCNU8456731","MSCU4218903","CMAU7631042","","",
  "MSCU1190284","TCNU3347821","CMAU9021456","HLXU5544317","TCNU6782341",
  "","MSCU7810293","CMAU4459871","TCNU2234908","MSCU8823411",
  "HLXU3310928","MSCU5567234","","CMAU3319012","TCNU9978234",
  "TCNU1122334","","MSCU6643219","HLXU7732098","CMAU2287643",
  "TCNU8834512","MSCU3345678","CMAU1109234","","TCNU4421876",
  "TCNU5534218","MSCU9987123","","HLXU6612309","CMAU8871234",
  "TCNU3312988","MSCU4481239","CMAU5576123","TCNU7723098","",
];

const BAY_COLORS: Record<number, string> = {
  0: "#1E3A2F",
  1: "#0D7057",
  2: "#1E40AF",
  3: "#DC2626",
};

function YardViewScreen() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto" style={{ background: DARK_BG }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 sticky top-0"
        style={{ background: DARK_BG, borderBottom: "0.5px solid rgba(13,112,87,0.3)" }}
      >
        <p className="text-xs font-bold text-white">Yard 3D View — Block A</p>
        <div className="flex gap-2">
          {["Block A", "Block B", "Block C"].map((b, i) => (
            <button
              key={b}
              className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{
                background: i === 0 ? PRIMARY : "rgba(255,255,255,0.06)",
                color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                fontSize: "9px",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-4 pt-3 pb-1">
        {[
          { color: "#0D7057", label: "Occupied (Normal)" },
          { color: "#1E40AF", label: "Detention Alert" },
          { color: "#DC2626", label: "Examination Hold" },
          { color: "#1E3A2F", label: "Empty Bay" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.45)" }}>{l.label}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="px-4 py-3">
        {/* Row labels */}
        <div className="flex gap-1 mb-1 pl-6">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex-1 text-center" style={{ fontSize: "7px", color: "rgba(255,255,255,0.25)" }}>
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        {Array.from({ length: 4 }, (_, row) => (
          <div key={row} className="flex gap-1 mb-1 items-center">
            <div className="w-5 text-right" style={{ fontSize: "7px", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
              {row + 1}
            </div>
            {Array.from({ length: 10 }, (_, col) => {
              const idx = row * 10 + col;
              const type = YARD_GRID[idx];
              const cno = BAY_CONTAINERS[idx];
              return (
                <div
                  key={col}
                  className="flex-1 rounded-sm relative cursor-pointer transition-all duration-150"
                  style={{
                    height: "28px",
                    background: BAY_COLORS[type],
                    border: hovered === idx ? "1.5px solid #34D399" : "1px solid rgba(0,0,0,0.3)",
                    opacity: hovered === idx ? 1 : 0.85,
                  }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === idx && cno && (
                    <div
                      className="absolute z-10 px-2 py-1 rounded-lg text-center pointer-events-none"
                      style={{
                        background: "#071A14",
                        border: "0.5px solid #34D399",
                        bottom: "calc(100% + 4px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                        minWidth: "90px",
                      }}
                    >
                      <p style={{ fontSize: "8px", color: ACCENT, fontWeight: 700 }}>{cno}</p>
                    </div>
                  )}
                  {type === 2 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#1E40AF" }} />
                    </div>
                  )}
                  {type === 3 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#DC2626" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2 px-4 pb-4">
        {[
          { label: "Total Bays",              val: "40",  color: "rgba(255,255,255,0.7)" },
          { label: "Occupied (70%)",          val: "28",  color: ACCENT },
          { label: "Free Days Expiring Today", val: "4",   color: "#1E40AF" },
          { label: "Under Examination",       val: "2",   color: "#DC2626" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(13,112,87,0.12)", border: "0.5px solid rgba(13,112,87,0.3)" }}
          >
            <p style={{ fontSize: "16px", fontWeight: 800, color: s.color }}>{s.val}</p>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GateLogScreen() {
  const entries = [
    { time: "14:32", vehicle: "MH04 BZ 7821", container: "TCNU8456731", seal: "IN2340982", trucker: "Ajay Logistics", action: "Gate-Out", status: "Complete" },
    { time: "14:18", vehicle: "TN22 AX 4509", container: "MSCU4218903", seal: "SG9871234", trucker: "Sunrise Transport", action: "Gate-In",  status: "Complete" },
    { time: "13:55", vehicle: "MH43 CD 1122", container: "CMAU7631042", seal: "IN7734521", trucker: "Ravi Cargo", action: "Gate-In",  status: "Complete" },
    { time: "13:40", vehicle: "TN09 PQ 8844", container: "HLXU5544317", seal: "CN1198234", trucker: "Global Movers",    action: "Gate-Out", status: "Complete" },
    { time: "12:58", vehicle: "MH12 JK 3398", container: "TCNU6782341", seal: "IN4423098", trucker: "Ajay Logistics",  action: "Gate-In",  status: "Complete" },
    { time: "12:34", vehicle: "TN63 RS 7712", container: "MSCU1190284", seal: "SG5567123", trucker: "Sakthi Cargo",    action: "Gate-In",  status: "Complete" },
    { time: "11:49", vehicle: "MH01 UV 5590", container: "CMAU9021456", seal: "IN8812009", trucker: "Sunrise Transport", action: "Gate-Out", status: "Complete" },
    { time: "11:20", vehicle: "TN37 WX 2201", container: "TCNU3347821", seal: "IN3390124", trucker: "Ravi Cargo",       action: "Gate-In",  status: "Complete" },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: DARK_BG }}>
      <div
        className="flex items-center gap-2 px-4 py-2.5 sticky top-0"
        style={{ background: DARK_BG, borderBottom: "0.5px solid rgba(13,112,87,0.3)" }}
      >
        <p className="text-xs font-bold text-white">Gate Activity Log — Today</p>
        <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(52,211,153,0.12)", color: ACCENT, fontSize: "9px" }}>
          Live
        </span>
        <button
          className="text-xs px-2.5 py-1 rounded-lg font-semibold"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: "9px" }}
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Time", "Vehicle No", "Container No", "Seal No", "Trucker", "Action", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-semibold"
                  style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr
                key={i}
                style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}
              >
                <td className="px-3 py-2.5 font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{e.time}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{e.vehicle}</td>
                <td className="px-3 py-2.5 font-mono font-bold" style={{ color: ACCENT }}>{e.container}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{e.seal}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.6)" }}>{e.trucker}</td>
                <td className="px-3 py-2.5">
                  <span
                    className="px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: e.action === "Gate-In" ? "rgba(13,112,87,0.2)" : "rgba(59,130,246,0.15)",
                      color: e.action === "Gate-In" ? LIGHT : "#60a5fa",
                      fontSize: "8px",
                    }}
                  >
                    {e.action}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className="px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "rgba(52,211,153,0.1)", color: ACCENT, fontSize: "8px" }}
                  >
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 flex items-center gap-6" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        {[["Gate-In Today", "5"], ["Gate-Out Today", "3"], ["Pending Clearance", "1"]].map(([l, v]) => (
          <div key={l}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{l}</p>
            <p className="font-bold text-xs text-white mt-0.5">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContainersScreen() {
  const containers = [
    { no: "TCNU8456731", size: "20'", importer: "Sunrise Industries", gateIn: "10 Jun 2026", freeDays: 7, dwell: 27, due: "₹22,800", status: "Invoice Due"      },
    { no: "MSCU4218903", size: "40'", importer: "Ravi Exports Pvt Ltd", gateIn: "25 Jun 2026", freeDays: 7, dwell: 12, due: "₹3,400", status: "Normal"           },
    { no: "CMAU7631042", size: "40'", importer: "Global Impex Solutions", gateIn: "28 Jun 2026", freeDays: 7, dwell: 9,  due: "₹1,700", status: "Normal"           },
    { no: "HLXU5544317", size: "20'", importer: "HDFC Traders",          gateIn: "15 Jun 2026", freeDays: 5, dwell: 22, due: "₹18,700", status: "Detention Alert" },
    { no: "TCNU6782341", size: "20'", importer: "Lotus Logistics",        gateIn: "01 Jul 2026", freeDays: 7, dwell: 6,  due: "₹0",     status: "In Free Days"    },
    { no: "MSCU1190284", size: "40'", importer: "Sunrise Industries",     gateIn: "03 Jul 2026", freeDays: 7, dwell: 4,  due: "₹0",     status: "In Free Days"    },
    { no: "TCNU3347821", size: "20'", importer: "Sakthi Cargo Co.",       gateIn: "18 Jun 2026", freeDays: 7, dwell: 19, due: "₹11,900", status: "Normal"          },
  ];

  const statusColor: Record<string, string> = {
    "Invoice Due":     "#1E40AF",
    "Normal":          LIGHT,
    "Detention Alert": "#ef4444",
    "In Free Days":    "#60a5fa",
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: DARK_BG }}>
      <div
        className="flex items-center gap-2 px-4 py-2.5 sticky top-0"
        style={{ background: DARK_BG, borderBottom: "0.5px solid rgba(13,112,87,0.3)" }}
      >
        <p className="text-xs font-bold text-white">Active Containers</p>
        <div className="ml-auto flex gap-2">
          {["Filter", "Export", "+ Gate-In"].map((b, i) => (
            <button
              key={b}
              className="text-xs px-2.5 py-1 rounded-lg font-semibold"
              style={{
                background: i === 2 ? PRIMARY : "rgba(255,255,255,0.07)",
                color: i === 2 ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: "9px",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Container No", "Size", "Importer", "Gate-In Date", "Free Days", "Dwell Days", "Storage Due", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-semibold"
                  style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr
                key={c.no}
                style={{
                  borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                  background: c.status === "Detention Alert" ? "rgba(239,68,68,0.04)" : "transparent",
                }}
              >
                <td className="px-3 py-2.5 font-mono font-bold" style={{ color: ACCENT }}>{c.no}</td>
                <td className="px-3 py-2.5">
                  <span
                    className="px-1.5 py-0.5 rounded font-bold"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: "8px" }}
                  >
                    {c.size}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{c.importer}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{c.gateIn}</td>
                <td className="px-3 py-2.5 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{c.freeDays}</td>
                <td
                  className="px-3 py-2.5 text-center font-bold"
                  style={{ color: c.dwell > 20 ? "#1E40AF" : "rgba(255,255,255,0.7)" }}
                >
                  {c.dwell}
                </td>
                <td
                  className="px-3 py-2.5 font-bold"
                  style={{ color: c.due === "₹0" ? "rgba(255,255,255,0.3)" : c.status === "Detention Alert" ? "#ef4444" : ACCENT }}
                >
                  {c.due}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className="px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: `${statusColor[c.status]}18`,
                      color: statusColor[c.status],
                      fontSize: "8px",
                    }}
                  >
                    {c.status}
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

function BillingScreen() {
  const slabs = [
    { label: "Days 1–7 (Free period)",    days: 7,  rate: "—",        amount: "₹0",      color: "rgba(255,255,255,0.3)" },
    { label: "Days 8–15 (₹850/day)",      days: 8,  rate: "₹850/day", amount: "₹6,800",  color: LIGHT },
    { label: "Days 16–27 (₹1,200/day)",   days: 12, rate: "₹1,200/day",amount: "₹14,400", color: ACCENT },
  ];

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: DARK_BG }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-white">Storage Calculation</p>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: "rgba(52,211,153,0.12)", color: ACCENT, fontSize: "8px", border: `0.5px solid ${ACCENT}40` }}
        >
          Auto-calculated
        </span>
      </div>

      {/* Container info */}
      <div
        className="rounded-xl p-3 mb-4 grid grid-cols-2 gap-3"
        style={{ background: "rgba(13,112,87,0.1)", border: `0.5px solid ${PRIMARY}40` }}
      >
        {[
          ["Container No", "TCNU8456731"],
          ["Size", "20' Dry"],
          ["Gate-In Date", "10 Jun 2026"],
          ["Today", "07 Jul 2026"],
          ["Total Dwell", "27 days"],
          ["Importer", "Sunrise Industries"],
        ].map(([l, v]) => (
          <div key={l}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{l}</p>
            <p style={{ fontSize: "10px", color: "#fff", fontWeight: 600, marginTop: "2px" }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Tariff slabs */}
      <p
        className="text-xs font-semibold mb-3 uppercase tracking-wider"
        style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}
      >
        Tariff Breakdown
      </p>
      <div className="space-y-2 mb-4">
        {slabs.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)" }}>{s.label}</p>
              <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", marginTop: "1px" }}>
                {s.days} days × {s.rate}
              </p>
            </div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: s.color }}>{s.amount}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        className="flex items-center justify-between px-4 py-4 rounded-2xl"
        style={{ background: `${PRIMARY}20`, border: `1.5px solid ${PRIMARY}` }}
      >
        <div>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Total Storage Charges</p>
          <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>27 days · 2 slab rates</p>
        </div>
        <p style={{ fontSize: "26px", fontWeight: 900, color: ACCENT }}>₹22,800</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="flex-1 py-2.5 rounded-xl font-bold text-xs"
          style={{ background: PRIMARY, color: "#fff" }}
        >
          Generate Invoice
        </button>
        <button
          className="px-4 py-2.5 rounded-xl text-xs"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
        >
          Recalculate
        </button>
      </div>
    </div>
  );
}

function InvoiceScreen() {
  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: DARK_BG }}>
      {/* Invoice card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: `0.5px solid ${PRIMARY}60`, background: "#0A2018" }}
      >
        {/* Invoice header */}
        <div
          className="px-5 py-4 flex items-start justify-between"
          style={{ background: `${PRIMARY}25`, borderBottom: `0.5px solid ${PRIMARY}40` }}
        >
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              DockIQ · CFS Invoice
            </p>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#fff", marginTop: "2px" }}>DQ-INV-2026-0142</p>
          </div>
          <div className="text-right">
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>Invoice Date</p>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#fff" }}>07 Jul 2026</p>
          </div>
        </div>

        {/* To / Container info */}
        <div className="px-5 py-3 grid grid-cols-2 gap-4" style={{ borderBottom: `0.5px solid rgba(255,255,255,0.06)` }}>
          <div>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Bill To</p>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#fff", marginTop: "2px" }}>Sunrise Industries Pvt Ltd</p>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>GSTIN: 27AAPSA1234C1Z8</p>
          </div>
          <div>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Container Details</p>
            <p style={{ fontSize: "11px", fontWeight: 700, color: ACCENT, marginTop: "2px" }}>TCNU8456731</p>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>20' Dry · Gate-In: 10 Jun · Gate-Out: 07 Jul</p>
          </div>
        </div>

        {/* Line items */}
        <div className="px-5 py-3">
          {[
            { desc: "Container Storage (27 days — 2 slabs)", hsn: "9967", taxable: "₹22,800", igst: "—",      total: "₹22,800" },
            { desc: "Handling Charges (Gate-In + Gate-Out)", hsn: "9967", taxable: "₹3,500",  igst: "—",      total: "₹3,500"  },
            { desc: "Port Infrastructure Dues",              hsn: "9967", taxable: "₹1,200",  igst: "—",      total: "₹1,200"  },
            { desc: "IGST @ 18% on ₹27,500",                hsn: "—",    taxable: "—",        igst: "₹4,950", total: "₹4,950"  },
          ].map((row) => (
            <div
              key={row.desc}
              className="flex justify-between items-center py-2"
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex-1">
                <p style={{ fontSize: "9.5px", color: "rgba(255,255,255,0.75)" }}>{row.desc}</p>
                {row.hsn !== "—" && (
                  <p style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.25)", marginTop: "1px" }}>HSN: {row.hsn}</p>
                )}
              </div>
              <div className="text-right ml-4">
                <p style={{ fontSize: "10px", fontWeight: 600, color: row.igst !== "—" ? "#1E40AF" : "rgba(255,255,255,0.7)" }}>
                  {row.igst !== "—" ? row.igst : row.total}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: `${PRIMARY}20`, borderTop: `0.5px solid ${PRIMARY}40` }}
        >
          <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Total Amount Due</p>
          <p style={{ fontSize: "22px", fontWeight: 900, color: ACCENT }}>₹32,450</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs"
          style={{ background: "#25D366", color: "#fff" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>smartphone</span>
          Send via WhatsApp
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(255,255,255,0.12)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>mail</span>
          Send via Email
        </button>
        <button
          className="px-4 py-2.5 rounded-xl text-xs"
          style={{ background: PRIMARY, color: "#fff" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
        </button>
      </div>
    </div>
  );
}

function ReportsScreen() {
  const weeklyCounts = [28, 34, 41, 38, 45, 52, 49];
  const weekLabels   = ["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6","Wk 7"];
  const maxVal = Math.max(...weeklyCounts);

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: DARK_BG }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-white">Reports — July 2026</p>
        <button
          className="text-xs px-2.5 py-1 rounded-lg font-semibold"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", fontSize: "9px" }}
        >
          Download PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "Total Containers Handled", val: "142",        color: ACCENT   },
          { label: "Total Storage Revenue",    val: "₹18,42,000", color: LIGHT    },
          { label: "Avg Dwell Days",           val: "12.4 days",  color: "#f59e0b"},
          { label: "Occupancy Rate",           val: "68%",        color: "#60a5fa"},
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl p-3"
            style={{ background: "rgba(13,112,87,0.1)", border: "0.5px solid rgba(13,112,87,0.25)" }}
          >
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{k.label}</p>
            <p style={{ fontSize: "16px", fontWeight: 800, color: k.color, marginTop: "3px" }}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div
        className="rounded-xl p-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        <p className="font-semibold mb-3" style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>
          Weekly Container Count — This Month
        </p>
        <div className="flex items-end gap-2" style={{ height: "80px" }}>
          {weeklyCounts.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <p style={{ fontSize: "7px", color: "rgba(255,255,255,0.4)" }}>{v}</p>
              <div
                className="w-full rounded-t-sm transition-all duration-300"
                style={{
                  height: `${(v / maxVal) * 56}px`,
                  background: i === weeklyCounts.length - 1 ? ACCENT : PRIMARY,
                  opacity: i === weeklyCounts.length - 1 ? 1 : 0.65,
                }}
              />
              <p style={{ fontSize: "7px", color: "rgba(255,255,255,0.3)" }}>{weekLabels[i]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top importers */}
      <div className="mt-3">
        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "8px" }}>Top Importers by Revenue</p>
        {[
          { name: "Sunrise Industries Pvt Ltd", rev: "₹4,82,000", pct: 78 },
          { name: "Ravi Exports Pvt Ltd",        rev: "₹2,14,500", pct: 52 },
          { name: "HDFC Traders",                rev: "₹1,88,000", pct: 44 },
        ].map((imp) => (
          <div key={imp.name} className="mb-2.5">
            <div className="flex justify-between mb-1">
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)" }}>{imp.name}</p>
              <p style={{ fontSize: "9px", fontWeight: 700, color: ACCENT }}>{imp.rev}</p>
            </div>
            <div className="w-full rounded-full" style={{ height: "4px", background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${imp.pct}%`, background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  yard:       <YardViewScreen />,
  gatelog:    <GateLogScreen />,
  containers: <ContainersScreen />,
  billing:    <BillingScreen />,
  invoice:    <InvoiceScreen />,
  reports:    <ReportsScreen />,
};

/* ─────────────────────────────────────────────────────────── */
/* FEATURES                                                     */
/* ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "garage",
    title: "Automatic Gate-in / Gate-out",
    desc: "Driver shows vehicle number — gate logs container, seal, weight, trucker automatically. No paperwork.",
  },
  {
    icon: "calculate",
    title: "Storage Slab Billing",
    desc: "Configure your CFS tariff slabs (free days, per-day rates). DockIQ calculates storage charges automatically as days pass. No more manual tracking.",
  },
  {
    icon: "view_in_ar",
    title: "Yard 3D View",
    desc: "See every row, bay, and tier in your yard at a glance. Container location, dwell days, importer — visible on one screen.",
  },
  {
    icon: "phone_iphone",
    title: "Mobile Gate App",
    desc: "Your gate operator uses the DockIQ mobile app to scan and log containers. No desktop needed at the gate.",
  },
  {
    icon: "receipt_long",
    title: "Auto Invoice Generation",
    desc: "When container moves out, DockIQ auto-generates the storage + handling invoice. Email + WhatsApp sent to importer instantly.",
  },
  {
    icon: "people",
    title: "Importer Portal",
    desc: "Your importers get a login to track their containers, view charges, download invoices — reducing your phone calls by 70%.",
  },
];

/* ─────────────────────────────────────────────────────────── */
/* PRICING FEATURES                                            */
/* ─────────────────────────────────────────────────────────── */
const PRICING_FEATURES = [
  "Unlimited container handling",
  "Automatic gate-in/out log",
  "Storage slab billing engine",
  "Yard 3D visual map",
  "Mobile gate operator app",
  "Auto invoice generation",
  "WhatsApp & email notifications",
  "Importer self-service portal",
  "Multiple tariff configurations",
  "CFS analytics & reports",
  "Examination hold tracking",
  "Multi-bay/multi-block support",
];

/* ─────────────────────────────────────────────────────────── */
/* FAQ                                                         */
/* ─────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "How does automatic storage billing work?",
    a: "You configure your CFS tariff slabs (e.g., free 7 days, ₹850/day for days 8-15, ₹1,200/day thereafter). DockIQ tracks every container's dwell time and calculates charges automatically. No manual calculation.",
  },
  {
    q: "Can gate operators use a mobile app?",
    a: "Yes. Your gate team uses the DockIQ mobile app (iOS + Android) to log container arrivals and departures — scan vehicle number, enter seal, take photo. All synced instantly.",
  },
  {
    q: "How does the importer portal work?",
    a: "Importers get a login where they can see their containers' current location in the yard, dwell days, upcoming charges, and download invoices. Reduces your inbound calls significantly.",
  },
  {
    q: "What does ₹1,599/mo include?",
    a: "Everything — unlimited containers, gate logging, automatic billing, yard view, mobile app, importer portal, auto invoicing, WhatsApp notifications. No add-ons.",
  },
  {
    q: "Does DockIQ support multiple tariff configurations?",
    a: "Yes. You can set different tariff slabs for different container sizes (20', 40', 45'), different cargo types (dry, reefer, hazmat), and different customers.",
  },
];

/* ─────────────────────────────────────────────────────────── */
/* PAGE                                                         */
/* ─────────────────────────────────────────────────────────── */
export default function DockIQPage() {
  const { data: session } = useSession();
  const role    = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const hasDockiq = isAdmin || (session?.user as { subscriptions?: { product: string; status: string }[] } | undefined)
    ?.subscriptions?.some(
      (s) => (s.product === "DOCKIQ" || s.product === "FULL_SUITE") && (s.status === "ACTIVE" || s.status === "TRIAL")
    );

  const ctaHref  = hasDockiq ? "/dashboard/dockiq" : "/pricing";
  const ctaLabel = hasDockiq ? "Open DockIQ →" : "View Pricing & Start Free Trial";

  const [activeTab, setActiveTab]   = useState("yard");
  const [openFaq,   setOpenFaq]     = useState<number | null>(null);

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        className="pt-28 pb-20 px-6 relative overflow-hidden"
        style={{ background: DARK_BG }}
      >
        {/* Teal grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${PRIMARY}ff 1px,transparent 1px),linear-gradient(90deg,${PRIMARY}ff 1px,transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Badge */}
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{
                background: `${PRIMARY}1A`,
                borderColor: `${PRIMARY}40`,
                color: ACCENT,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>warehouse</span>
              CFS &amp; Warehouse · Built for Indian Ports
            </span>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Every container tracked.<br />
              <span style={{ color: ACCENT }}>Every rupee billed automatically.</span>
            </h1>

            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              DockIQ handles your entire CFS workflow — gate-in/out logging, automatic storage slab billing,
              yard management, and importer invoicing — so your team stops chasing spreadsheets and starts
              running the yard.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: PRIMARY, color: "#fff" }}
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              >
                See Live Demo ↓
              </a>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "Auto",       sub: "Storage slab billing"   },
              { val: "Real-time",  sub: "Yard occupancy view"     },
              { val: "Zero",       sub: "Manual billing errors"   },
              { val: "₹1,599/mo", sub: "All features included"   },
            ].map((s) => (
              <div
                key={s.sub}
                className="rounded-2xl p-5 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-3xl font-black" style={{ color: ACCENT }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES DOCKIQ DIFFERENT ───────────────────── */}
      <section className="py-20 px-6" style={{ background: LIGHT_BG }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Built different</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">What makes DockIQ different</h2>
            <p className="text-gray-500 mt-2 text-sm">
              CFS management built exclusively for Indian port stations and warehouse operators.
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
                  style={{ background: `${PRIMARY}12` }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: PRIMARY }}>{f.icon}</span>
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

      {/* ── INTERACTIVE DEMO ──────────────────────────────── */}
      <section id="demo" className="py-20 px-6" style={{ background: DARK_BG }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: `${ACCENT}99` }}
            >
              Interactive demo
            </span>
            <h2 className="text-3xl font-black text-white mt-2">See DockIQ live</h2>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Click any tab to preview the real interface with sample CFS data.
            </p>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeTab === t.id ? PRIMARY : "rgba(255,255,255,0.06)",
                  color:      activeTab === t.id ? "#fff"   : "rgba(255,255,255,0.5)",
                  border:     activeTab === t.id ? "none"   : "0.5px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* App shell */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: "1px solid rgba(13,112,87,0.2)" }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: "#041008", borderBottom: "0.5px solid rgba(13,112,87,0.2)" }}
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
                  <span className="w-2 h-2 rounded-full" style={{ background: LIGHT }} />
                  app.navkaros.in/dockiq/{activeTab === "yard" ? "" : activeTab}
                </div>
              </div>
            </div>

            {/* Sidebar + content */}
            <div className="flex" style={{ height: "480px" }}>
              {/* Mini sidebar */}
              <div
                className="flex flex-col gap-1 px-2 py-3"
                style={{ width: "48px", background: "#041008", borderRight: "0.5px solid rgba(13,112,87,0.2)" }}
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ background: activeTab === t.id ? `${PRIMARY}30` : "transparent" }}
                    title={t.label}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, color: activeTab === t.id ? ACCENT : "rgba(255,255,255,0.25)" }}
                    >
                      {t.icon}
                    </span>
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
                    className="h-full"
                  >
                    {SCREENS[activeTab]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: LIGHT_BG }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Pricing</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">One plan. Everything included.</h2>
            <p className="text-sm text-gray-500 mt-2">No tiers, no hidden add-ons. Every feature from day one.</p>
          </div>
          <div
            className="rounded-2xl border-2 p-8 flex flex-col md:flex-row gap-8 items-center"
            style={{ background: DARK_BG, borderColor: PRIMARY }}
          >
            <div className="flex-1">
              <p
                className="text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: `${ACCENT}99` }}
              >
                DockIQ
              </p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black" style={{ color: ACCENT }}>₹1,599</span>
                <span className="text-base mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                14-day free trial · No credit card required
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: PRIMARY, color: "#fff" }}
              >
                Start Free Trial →
              </Link>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {PRICING_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: LIGHT_BG }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions about DockIQ</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white overflow-hidden"
                style={{ borderColor: openFaq === i ? `${PRIMARY}60` : "#e5e7eb" }}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {openFaq === i
                    ? <ChevronUp   className="h-4 w-4 flex-shrink-0" style={{ color: PRIMARY }} />
                    : <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />}
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

      {/* ── BOTTOM CTA ────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: DARK_BG }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: `${ACCENT}80` }}
          >
            Ready to get started?
          </p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Your CFS.<br />
            <span style={{ color: ACCENT }}>Finally automated.</span>
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            14-day free trial. No credit card. No setup fee. Your existing yard data stays yours.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: PRIMARY, color: "#fff" }}
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            DockIQ · ₹1,599/mo · All features included · 14-day free trial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
