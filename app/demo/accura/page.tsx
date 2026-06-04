"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, TrendingUp, TrendingDown, AlertCircle, Download, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

/* ─────────────────────────────────────────────────────────── */
/* VS TALLY DATA                                               */
/* ─────────────────────────────────────────────────────────── */
const TALLY_COMPARE = [
  { tally: "Desktop only — no browser or mobile",         accura: "Fully cloud — browser and mobile" },
  { tally: "No concept of freight job numbers",           accura: "Every entry linked to job no & BL" },
  { tally: "100% manual data entry",                      accura: "Auto-populated from NavkarOS invoices" },
  { tally: "No bank statement auto-import",               accura: "CSV & PDF import with AI matching" },
  { tally: "No auto-reconciliation",                      accura: "1-click bank vs ledger reconciliation" },
  { tally: "No per-job profitability",                    accura: "Real-time margin per shipment job" },
  { tally: "No WhatsApp payment reminders",               accura: "1-click WhatsApp reminder generation" },
  { tally: "No CA collaboration login",                   accura: "CA gets their own read-only login" },
  { tally: "No cash flow forecasting",                    accura: "30/60/90-day forward cash projection" },
  { tally: "No AI receipt scanning",                      accura: "Upload bill photo → AI fills all fields" },
  { tally: "No GSTR-2A reconciliation",                   accura: "Auto-reconcile against GSTR-2A portal" },
  { tally: "Ugly 1990s interface",                        accura: "Modern dashboard, mobile-first" },
  { tally: "Tally Gold = ₹54,000/year",                   accura: "Accura Pro = ₹22,068/year — does MORE" },
];

/* ─────────────────────────────────────────────────────────── */
/* MODULE TABS                                                 */
/* ─────────────────────────────────────────────────────────── */
const MODULES = [
  { id: "dashboard",    label: "Dashboard",       icon: "dashboard" },
  { id: "income",       label: "Income",          icon: "receipt_long" },
  { id: "expenses",     label: "Expenses",        icon: "payments" },
  { id: "gst",          label: "GST",             icon: "account_balance" },
  { id: "pnl",          label: "P&L",             icon: "trending_up" },
  { id: "receivables",  label: "Receivables",     icon: "pending_actions" },
  { id: "jobpnl",       label: "Job P&L",         icon: "route" },
  { id: "bank",         label: "Bank",            icon: "account_balance_wallet" },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS                                                */
/* ─────────────────────────────────────────────────────────── */
function DashboardScreen() {
  const kpis = [
    { label: "Revenue This Month",     value: "₹8,42,500",  change: "+12%", up: true  },
    { label: "Expenses This Month",    value: "₹3,18,200",  change: "-4%",  up: false },
    { label: "Net Profit",             value: "₹5,24,300",  change: "+18%", up: true  },
    { label: "GST Payable",            value: "₹62,140",    change: "Due 20 Jul", up: false },
    { label: "Outstanding Receivables",value: "₹1,94,000",  change: "6 invoices", up: false },
    { label: "Cash Position",          value: "₹12,30,800", change: "3 accounts", up: true  },
  ];
  const bars = [42,38,55,60,48,72,65,80,74,68,88,94];
  const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"];

  return (
    <div className="h-full overflow-y-auto p-3 space-y-3" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg p-2.5" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
            <p className="mb-1" style={{ color: "#6B7280", fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</p>
            <p className="font-bold" style={{ fontSize: "13px", color: "#111827" }}>{k.value}</p>
            <p className="mt-0.5" style={{ color: k.up ? "#059669" : "#D97706", fontSize: "9px" }}>{k.change}</p>
          </div>
        ))}
      </div>
      {/* Bar Chart */}
      <div className="rounded-lg p-3" style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
        <p className="font-semibold mb-2" style={{ color: "#111827", fontSize: "10px" }}>Revenue vs Expenses — Last 12 Months</p>
        <div className="flex items-end gap-1 h-14">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-sm" style={{ height: `${h * 0.55}px`, background: "#0E7490", opacity: i === 11 ? 1 : 0.6 }} />
              <div className="w-full rounded-sm" style={{ height: `${h * 0.33}px`, background: "#FDA4AF", opacity: i === 11 ? 1 : 0.6 }} />
              <p style={{ fontSize: "6px", color: "#9CA3AF" }}>{months[i]}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-1.5">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: "#0E7490" }}/><p style={{ fontSize: "8px", color: "#6B7280" }}>Revenue</p></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: "#FDA4AF" }}/><p style={{ fontSize: "8px", color: "#6B7280" }}>Expenses</p></div>
        </div>
      </div>
      {/* Alerts */}
      <div className="space-y-1.5">
        {[
          { text: "HDFC Traders — ₹48,000 overdue 42 days", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { text: "GST filing due in 3 days — ₹62,140 payable", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
          { text: "TDS deposit due 7th July — ₹8,200 under 194C", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
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

function IncomeScreen() {
  const rows = [
    { inv: "INV-2026-0142", job: "NXL/26/0142", client: "Ravi Exports", desc: "Ocean Freight FCL", taxable: "₹66,525", igst: "₹11,975", total: "₹78,500", recd: "₹78,500", bal: "₹0",     status: "Paid",    src: "NEXLOG" },
    { inv: "INV-2026-0141", job: "NXL/26/0141", client: "HDFC Traders", desc: "Air Freight + CHA", taxable: "₹40,678", igst: "₹7,322",  total: "₹48,000", recd: "₹0",      bal: "₹48,000", status: "Overdue", src: "NEXLOG" },
    { inv: "INV-2026-0140", job: "BE/26/0341",  client: "Global Impex",  desc: "CHA Service Fee",  taxable: "₹12,712", igst: "₹2,288",  total: "₹15,000", recd: "₹7,500",  bal: "₹7,500",  status: "Partial", src: "ENTRYX" },
    { inv: "INV-2026-0139", job: "RD/26/0089",  client: "Sakthi Cargo",  desc: "Transport LR",     taxable: "₹8,475",  igst: "₹1,525",  total: "₹10,000", recd: "₹10,000", bal: "₹0",     status: "Paid",    src: "RUNDESK" },
  ];
  const statusColor: Record<string, string> = { Paid: "#22c55e", Overdue: "#ef4444", Partial: "#f59e0b" };
  const srcColor: Record<string, string> = { NEXLOG: "#1565C0", ENTRYX: "#5B21B6", RUNDESK: "#92400E", DOCKIQ: "#0D7057" };

  return (
    <div className="h-full overflow-auto" style={{ background: "#0f1010" }}>
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b sticky top-0" style={{ borderColor: "rgba(255,255,255,0.07)", background: "#0f1010" }}>
        <p className="text-xs font-bold text-white">Income Ledger</p>
        <div className="ml-auto flex gap-2">
          {["Filter","Export Excel","+ Add Income"].map((b, i) => (
            <button key={b} className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ background: i === 2 ? "#D4AF37" : "rgba(255,255,255,0.07)", color: i === 2 ? "#1a1c1c" : "rgba(255,255,255,0.6)", fontSize: "9px" }}>{b}</button>
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Invoice No","Job No","Client","Description","Taxable","IGST","Total","Received","Balance","Status","Source"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.inv} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2.5 font-mono" style={{ color: "#D4AF37" }}>{r.inv}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{r.job}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{r.client}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{r.desc}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.7)" }}>{r.taxable}</td>
                <td className="px-3 py-2.5" style={{ color: "#D4AF37" }}>{r.igst}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: "#fff" }}>{r.total}</td>
                <td className="px-3 py-2.5" style={{ color: "#22c55e" }}>{r.recd}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: r.bal === "₹0" ? "rgba(255,255,255,0.3)" : "#ef4444" }}>{r.bal}</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColor[r.status]}18`, color: statusColor[r.status], fontSize: "8px" }}>{r.status}</span></td>
                <td className="px-3 py-2.5"><span className="px-1.5 py-0.5 rounded font-bold" style={{ background: `${srcColor[r.src]}20`, color: srcColor[r.src], fontSize: "8px" }}>{r.src}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 flex items-center gap-6" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        {[["Total Invoiced","₹1,51,500"],["Total Received","₹95,500"],["Outstanding","₹55,500"]].map(([l,v]) => (
          <div key={l}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>{l}</p>
            <p className="font-bold text-xs text-white mt-0.5">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpenseScreen() {
  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#0f1010" }}>
      <p className="text-xs font-bold text-white mb-3">Add Expense</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Date", val: "05 Jul 2026", type: "date" },
          { label: "Category", val: "CFS Charges ▾", type: "select" },
          { label: "Vendor Name", val: "Apollo World Connect", type: "text" },
          { label: "Vendor GSTIN", val: "27AAPCA1234B1Z5", type: "text" },
          { label: "Payment Mode", val: "NEFT ▾", type: "select" },
          { label: "Amount (₹)", val: "₹18,000", type: "number" },
        ].map((f) => (
          <div key={f.label}>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{f.label}</p>
            <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", fontSize: "10px", color: "rgba(255,255,255,0.8)" }}>{f.val}</div>
          </div>
        ))}
      </div>
      {/* ITC toggle */}
      <div className="flex items-center gap-3 mt-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(212,175,55,0.06)", border: "0.5px solid rgba(212,175,55,0.2)" }}>
        <div className="w-8 h-4 rounded-full flex items-center px-0.5" style={{ background: "#D4AF37" }}>
          <div className="w-3 h-3 rounded-full bg-white ml-auto" />
        </div>
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>GST Input Credit applicable</p>
        <div className="ml-auto grid grid-cols-3 gap-2">
          {[["CGST Input","₹1,620"],["SGST Input","₹1,620"],["IGST Input","—"]].map(([l,v]) => (
            <div key={l} className="text-center">
              <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}>{l}</p>
              <p style={{ fontSize: "10px", color: "#D4AF37", fontWeight: 600 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      {/* AI scan */}
      <div className="mt-3 rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(99,102,241,0.08)", border: "0.5px solid rgba(99,102,241,0.2)" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#818cf8" }}>document_scanner</span>
        <div>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>AI Bill Scanner</p>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>Upload photo → all fields fill automatically</p>
        </div>
        <button className="ml-auto text-xs px-3 py-1 rounded-lg font-semibold" style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: "9px" }}>Upload Bill</button>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="flex-1 py-2.5 rounded-xl font-bold text-xs" style={{ background: "#D4AF37", color: "#1a1c1c" }}>Save Expense</button>
        <button className="px-4 py-2.5 rounded-xl text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Cancel</button>
      </div>
    </div>
  );
}

function GstScreen() {
  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: "#0f1010" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-white">GST Summary — June 2026</p>
        <div className="flex gap-2">
          <button className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", fontSize: "9px" }}>GSTR-1 Export</button>
          <button className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", fontSize: "9px" }}>GSTR-3B Export</button>
        </div>
      </div>
      {/* Output tax */}
      <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#D4AF37", fontSize: "9px", textTransform: "uppercase" }}>Output Tax (Collected)</p>
        {[["CGST Collected","₹24,820"],["SGST Collected","₹24,820"],["IGST Collected","₹82,460"]].map(([l,v]) => (
          <div key={l} className="flex justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)" }}>{l}</p>
            <p style={{ fontSize: "10px", color: "#fff", fontWeight: 600 }}>{v}</p>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-1">
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>Total Output Tax</p>
          <p style={{ fontSize: "11px", color: "#D4AF37", fontWeight: 800 }}>₹1,32,100</p>
        </div>
      </div>
      {/* ITC */}
      <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-semibold mb-2" style={{ color: "#22c55e", fontSize: "9px", textTransform: "uppercase" }}>Input Tax Credit (ITC)</p>
        {[["CGST Input","₹12,400"],["SGST Input","₹12,400"],["IGST Input","₹44,760"]].map(([l,v]) => (
          <div key={l} className="flex justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)" }}>{l}</p>
            <p style={{ fontSize: "10px", color: "#22c55e", fontWeight: 600 }}>{v}</p>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-1">
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>Total ITC Available</p>
          <p style={{ fontSize: "11px", color: "#22c55e", fontWeight: 800 }}>₹69,560</p>
        </div>
      </div>
      {/* Net payable */}
      <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <div>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Net GST Payable</p>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Due by 20 Jul 2026</p>
        </div>
        <p style={{ fontSize: "22px", fontWeight: 800, color: "#ef4444" }}>₹62,540</p>
      </div>
    </div>
  );
}

function PnlScreen() {
  const rows = [
    { label: "Service Charges",           val: "₹4,18,000", type: "income" },
    { label: "Reimbursement Billing",      val: "₹1,92,500", type: "income" },
    { label: "Air Freight Coordination",   val: "₹88,000",   type: "income" },
    { label: "Other Income",               val: "₹44,000",   type: "income" },
    { label: "TOTAL INCOME",               val: "₹7,42,500", type: "total"  },
    { label: "CFS Charges",                val: "₹82,000",   type: "expense" },
    { label: "Transport Charges",          val: "₹54,000",   type: "expense" },
    { label: "Steamer Agent Charges",      val: "₹38,000",   type: "expense" },
    { label: "GROSS PROFIT",               val: "₹5,68,500", type: "gross"  },
    { label: "Office Rent",                val: "₹28,000",   type: "indirect" },
    { label: "Staff Salary",               val: "₹1,44,000", type: "indirect" },
    { label: "Software & Professional",    val: "₹18,200",   type: "indirect" },
    { label: "NET PROFIT (Before Tax)",    val: "₹3,78,300", type: "net"    },
  ];
  const rowStyle: Record<string, { color: string; fontWeight: number; borderTop?: string }> = {
    income:   { color: "rgba(255,255,255,0.7)", fontWeight: 400 },
    expense:  { color: "rgba(255,255,255,0.55)", fontWeight: 400 },
    indirect: { color: "rgba(255,255,255,0.45)", fontWeight: 400 },
    total:    { color: "#fff", fontWeight: 700, borderTop: "0.5px solid rgba(255,255,255,0.15)" },
    gross:    { color: "#22c55e", fontWeight: 700, borderTop: "0.5px solid rgba(255,255,255,0.15)" },
    net:      { color: "#D4AF37", fontWeight: 800, borderTop: "1px solid rgba(212,175,55,0.4)" },
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0f1010" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b sticky top-0" style={{ borderColor: "rgba(255,255,255,0.07)", background: "#0f1010" }}>
        <p className="text-xs font-bold text-white">Profit & Loss — Apr–Jun 2026</p>
        <div className="ml-auto flex gap-2">
          {["Download PDF","Export Excel","Send to CA"].map((b) => (
            <button key={b} className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: "9px" }}>{b}</button>
          ))}
        </div>
      </div>
      <div className="px-4 py-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between py-2 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)", ...rowStyle[r.type] }}>
            <p style={{ fontSize: "10px" }}>{r.label}</p>
            <p style={{ fontSize: "10px" }}>{r.val}</p>
          </div>
        ))}
        <div className="flex justify-between pt-3 mt-2">
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>Net Margin</p>
          <p style={{ fontSize: "10px", color: "#22c55e", fontWeight: 700 }}>50.9%</p>
        </div>
      </div>
    </div>
  );
}

function ReceivablesScreen() {
  const clients = [
    { name: "Ravi Exports Pvt Ltd",   invoiced: "₹3,42,000", recd: "₹3,42,000", outstanding: "₹0",      days: 0,  status: "Clear"   },
    { name: "HDFC Traders",            invoiced: "₹1,94,500", recd: "₹1,46,500", outstanding: "₹48,000", days: 42, status: "Critical" },
    { name: "Global Impex Solutions",  invoiced: "₹88,000",   recd: "₹80,500",   outstanding: "₹7,500",  days: 18, status: "Overdue"  },
    { name: "Sunrise Logistics",       invoiced: "₹62,000",   recd: "₹32,000",   outstanding: "₹30,000", days: 8,  status: "Due Soon" },
  ];
  const sc: Record<string, string> = { Clear: "#22c55e", Critical: "#ef4444", Overdue: "#f97316", "Due Soon": "#f59e0b" };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0f1010" }}>
      {/* Aging strip */}
      <div className="grid grid-cols-4 gap-2 p-4">
        {[["Current (0-7d)","₹30,000","#6b7280"],["Due Soon (8-30d)","₹37,500","#f59e0b"],["Overdue (31-60d)","₹48,000","#f97316"],["Critical (60d+)","₹0","#ef4444"]].map(([l,v,c]) => (
          <div key={l} className="rounded-xl p-2.5 text-center" style={{ background: `${c}10`, border: `0.5px solid ${c}30` }}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)" }}>{l}</p>
            <p style={{ fontSize: "12px", fontWeight: 700, color: c as string }}>{v}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Client","Total Invoiced","Received","Outstanding","Days Overdue","Status","Actions"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.name} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{c.name}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.6)" }}>{c.invoiced}</td>
                <td className="px-3 py-2.5" style={{ color: "#22c55e" }}>{c.recd}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: c.outstanding === "₹0" ? "rgba(255,255,255,0.3)" : "#ef4444" }}>{c.outstanding}</td>
                <td className="px-3 py-2.5" style={{ color: c.days > 30 ? "#ef4444" : "rgba(255,255,255,0.5)" }}>{c.days > 0 ? `${c.days} days` : "—"}</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full font-bold" style={{ background: `${sc[c.status]}18`, color: sc[c.status], fontSize: "8px" }}>{c.status}</span></td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1">
                    {["Remind","Record"].map(a => <button key={a} className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", fontSize: "8px" }}>{a}</button>)}
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

function JobPnlScreen() {
  const jobs = [
    { no: "NXL/26/0142", client: "Ravi Exports",  route: "INNSA → DEHAM", mode: "SEA", rev: "₹78,500",  cost: "₹38,200", margin: "₹40,300", pct: "51.3%",  pos: true },
    { no: "NXL/26/0141", client: "HDFC Traders",  route: "INMAA → SGSIN", mode: "SEA", rev: "₹48,000",  cost: "₹28,800", margin: "₹19,200", pct: "40.0%",  pos: true },
    { no: "BE/26/0341",  client: "Global Impex",   route: "JNPT Import",   mode: "SEA", rev: "₹15,000",  cost: "₹6,200",  margin: "₹8,800",  pct: "58.7%",  pos: true },
    { no: "RD/26/0089",  client: "Sakthi Cargo",   route: "JNPT → Nhava", mode: "ROAD",rev: "₹10,000",  cost: "₹12,400", margin: "-₹2,400", pct: "-24.0%", pos: false },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0f1010" }}>
      <div className="grid grid-cols-4 gap-2 p-4">
        {[["Avg Margin","47.5%","#22c55e"],["Best Lane","INNSA→DEHAM","#D4AF37"],["Total Jobs","4","#fff"],["Loss Jobs","1","#ef4444"]].map(([l,v,c]) => (
          <div key={l} className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{l}</p>
            <p style={{ fontSize: "13px", fontWeight: 700, color: c as string, marginTop: "2px" }}>{v}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Job No","Client","Route","Mode","Revenue","Direct Cost","Gross Margin","Margin %"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.no} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)", background: !j.pos ? "rgba(239,68,68,0.04)" : "transparent" }}>
                <td className="px-3 py-2.5 font-mono" style={{ color: "#D4AF37" }}>{j.no}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{j.client}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.45)" }}>{j.route}</td>
                <td className="px-3 py-2.5"><span className="px-1.5 py-0.5 rounded font-bold" style={{ background: j.mode === "SEA" ? "rgba(59,130,246,0.15)" : "rgba(146,64,14,0.2)", color: j.mode === "SEA" ? "#60a5fa" : "#d97706", fontSize: "8px" }}>{j.mode}</span></td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "#fff" }}>{j.rev}</td>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{j.cost}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: j.pos ? "#22c55e" : "#ef4444" }}>{j.margin}</td>
                <td className="px-3 py-2.5 font-black" style={{ color: j.pos ? "#22c55e" : "#ef4444" }}>{j.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BankScreen() {
  const txns = [
    { date: "03 Jul", desc: "NEFT CR - Ravi Exports",        debit: "",         credit: "₹78,500", matched: "INV-2026-0142", status: "green"  },
    { date: "02 Jul", desc: "NEFT DR - Apollo World Connect", debit: "₹18,000",  credit: "",        matched: "EXP-2026-0088", status: "green"  },
    { date: "01 Jul", desc: "RTGS DR - Sakthi Transport",     debit: "₹54,000",  credit: "",        matched: "Possible match", status: "yellow" },
    { date: "30 Jun", desc: "CR - Bank Interest",             debit: "",         credit: "₹1,240",  matched: "Unmatched",    status: "red"    },
  ];
  const sc: Record<string, string> = { green: "#22c55e", yellow: "#f59e0b", red: "#ef4444" };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0f1010" }}>
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="rounded-xl p-3 flex-1" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>HDFC Current A/C — xxxx4892</p>
          <p className="font-bold text-base text-white mt-0.5">₹12,30,800</p>
          <p style={{ fontSize: "8px", color: "#22c55e" }}>● Reconciled till 01 Jul</p>
        </div>
        <button className="px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: "#D4AF37", color: "#1a1c1c", fontSize: "9px" }}>Import Statement</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Date","Description","Debit","Credit","Matched Entry","Status"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.desc} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td className="px-3 py-2.5" style={{ color: "rgba(255,255,255,0.5)" }}>{t.date}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{t.desc}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: "#ef4444" }}>{t.debit}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: "#22c55e" }}>{t.credit}</td>
                <td className="px-3 py-2.5" style={{ color: sc[t.status] }}>{t.matched}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc[t.status] }} />
                    <span style={{ fontSize: "8px", color: sc[t.status], textTransform: "capitalize" }}>{t.status === "green" ? "Matched" : t.status === "yellow" ? "Review" : "Unmatched"}</span>
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

const SCREENS: Record<string, React.ReactNode> = {
  dashboard:   <DashboardScreen />,
  income:      <IncomeScreen />,
  expenses:    <ExpenseScreen />,
  gst:         <GstScreen />,
  pnl:         <PnlScreen />,
  receivables: <ReceivablesScreen />,
  jobpnl:      <JobPnlScreen />,
  bank:        <BankScreen />,
};

/* ─────────────────────────────────────────────────────────── */
/* FEATURES GRID                                               */
/* ─────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "dashboard",           title: "Finance Dashboard",       desc: "6 live KPI cards, 4 charts, smart alerts for overdue invoices, GST and TDS deadlines." },
  { icon: "receipt_long",        title: "Income Ledger",           desc: "Auto-populated from Nexlog, EntryX, DockIQ, RunDesk. Filter, export, record payment in seconds." },
  { icon: "payments",            title: "Expense Ledger",          desc: "25 freight-specific categories. AI bill scanner. ITC tracking. Recurring bills. TDS auto-flag." },
  { icon: "account_balance",     title: "GST Module",              desc: "Auto GSTR-1 & GSTR-3B Excel export. GSTR-2A reconciliation. Net payable in one number." },
  { icon: "trending_up",         title: "P&L Statement",           desc: "Full P&L in under 1 second. PDF for CA. Excel for finance. Period comparison built-in." },
  { icon: "pending_actions",     title: "Receivables & Payables",  desc: "Aging analysis. WhatsApp payment reminder generator. One-click follow-up." },
  { icon: "route",               title: "Per-Job Profitability",   desc: "Tally can NEVER do this. Margin on every individual shipment. Best lane. Worst job. Instantly." },
  { icon: "account_balance_wallet", title: "Bank Reconciliation",  desc: "Import CSV or PDF bank statement. AI auto-matches. Green/yellow/red confidence display." },
  { icon: "folder_shared",       title: "CA Collaboration",        desc: "Invite your CA — they get read-only access, can download everything, add review comments." },
  { icon: "waterfall_chart",     title: "Cash Flow Forecast",      desc: "30/60/90-day projection. Red zone alert when cash goes negative. Follow-up suggestions." },
  { icon: "badge",               title: "TDS Management",          desc: "Auto-flag on save. TDS register per section. Deposit countdown. Form 16A generator." },
  { icon: "group",               title: "Payroll",                 desc: "Employee setup, monthly payroll run, salary slip PDFs via email, auto expense entry." },
];

/* ─────────────────────────────────────────────────────────── */
/* FAQ                                                         */
/* ─────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Does Accura replace Tally completely?", a: "For logistics businesses — yes. Every feature a C&F agent, CHA, or transporter needs from Tally is in Accura, plus 10+ features Tally doesn't have at all (per-job profitability, WhatsApp reminders, AI receipt scanning, cloud access)." },
  { q: "How does auto-population from other modules work?", a: "When you raise an invoice in Nexlog, EntryX, DockIQ, or RunDesk, it automatically creates an income entry in Accura. Your accounting team sees it instantly. Zero double-entry." },
  { q: "Can I export to Tally if my CA insists on it?", a: "Yes. Accura generates TallyPrime-compatible XML with one click. Your CA imports it in 30 seconds — all entries appear with proper ledger heads." },
  { q: "Is the GST export CA-ready?", a: "Completely. GSTR-1 and GSTR-3B Excel files match the exact GST portal upload template. Your CA downloads and uploads directly — no re-entry." },
  { q: "What's the difference between Starter and Pro?", a: "Starter covers up to 50 invoices/month and 1 user. Pro is unlimited invoices, 3 users, all modules including AI receipt scanner, Tally XML, CA collaboration and per-job P&L." },
];

/* ─────────────────────────────────────────────────────────── */
/* PAGE                                                        */
/* ─────────────────────────────────────────────────────────── */
export default function AccuraPage() {
  const { data: session } = useSession();
  const hasAccura = (session?.user as { subscriptions?: { product: string; status: string }[] } | undefined)?.subscriptions?.some(
    (s) => (s.product === "ACCURA" || s.product === "FULL_SUITE") && (s.status === "ACTIVE" || s.status === "TRIAL")
  );
  const ctaHref = hasAccura ? "/dashboard/accura" : "/pricing";
  const ctaLabel = hasAccura ? "Open Accura →" : "View Pricing & Start Free Trial";

  const [activeModule, setActiveModule] = useState("dashboard");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="pt-28 pb-20 px-6 relative overflow-hidden"
        style={{ background: "#1a1c1c" }}
      >
        {/* Gold grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{ background: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.25)", color: "#D4AF37" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>account_balance</span>
              Freight Accounting · Built Better Than Tally
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Your CA will love you<br />
              <span style={{ color: "#D4AF37" }}>for switching to Accura.</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              Freight-specific accounting that auto-posts from every NavkarOS invoice, generates GSTR-1 in one click, shows per-job profitability, and costs ₹31,932 less per year than Tally Gold.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: "#D4AF37", color: "#1a1c1c" }}>
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#demo" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider border transition-all duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                See Live Demo ↓
              </a>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "₹31,932", sub: "Saved/year vs Tally Gold" },
              { val: "1 click", sub: "to GSTR-1 export" },
              { val: "13",      sub: "accounting modules" },
              { val: "0 hrs",   sub: "manual data entry" },
            ].map((s) => (
              <div key={s.sub} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                <p className="text-3xl font-black" style={{ color: "#D4AF37" }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VS TALLY ─────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">The difference</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">Tally vs Accura</h2>
            <p className="text-gray-500 mt-2 text-sm">13 things Tally cannot do. Accura does all of them.</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-2">
              <div className="px-6 py-4 font-black text-sm" style={{ background: "#f3f4f6", color: "#6b7280" }}>
                ❌ Tally Silver / Gold
              </div>
              <div className="px-6 py-4 font-black text-sm" style={{ background: "#1a1c1c", color: "#D4AF37" }}>
                ✅ Accura by NavkarOS
              </div>
            </div>
            {TALLY_COMPARE.map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-t" style={{ borderColor: "#f0f0f0" }}>
                <div className="px-6 py-3.5 text-sm flex items-center gap-2" style={{ color: "#9ca3af", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                  <span className="text-red-300 text-xs flex-shrink-0">✕</span> {row.tally}
                </div>
                <div className="px-6 py-3.5 text-sm flex items-center gap-2 font-medium" style={{ color: "#1a1c1c", background: i % 2 === 0 ? "rgba(212,175,55,0.04)" : "rgba(212,175,55,0.02)" }}>
                  <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#D4AF37" }} /> {row.accura}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ─────────────────────────────────────── */}
      <section id="demo" className="py-20 px-6" style={{ background: "#111213" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.7)" }}>Interactive demo</span>
            <h2 className="text-3xl font-black text-white mt-2">See every module live</h2>
            <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click any tab to preview the real interface with sample data.</p>
          </div>

          {/* Module tab bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeModule === m.id ? "#D4AF37" : "rgba(255,255,255,0.06)",
                  color: activeModule === m.id ? "#1a1c1c" : "rgba(255,255,255,0.5)",
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
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#0a0b0b", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-1.5">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.8 }} />)}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
                  app.navkaros.in/accura/{activeModule === "dashboard" ? "" : activeModule}
                </div>
              </div>
            </div>

            {/* Sidebar + content */}
            <div className="flex" style={{ height: "480px" }}>
              {/* Mini sidebar */}
              <div className="flex flex-col gap-1 px-2 py-3" style={{ width: "48px", background: "#080909", borderRight: "0.5px solid rgba(255,255,255,0.06)" }}>
                {MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ background: activeModule === m.id ? "rgba(212,175,55,0.15)" : "transparent" }}
                    title={m.label}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: activeModule === m.id ? "#D4AF37" : "rgba(255,255,255,0.25)" }}>{m.icon}</span>
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

      {/* ── FEATURES GRID ────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">What's included</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">13 modules. Everything in one.</h2>
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
                  style={{ background: "rgba(26,35,126,0.08)", border: "1.5px solid rgba(26,35,126,0.12)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#1A237E" }}>{f.icon}</span>
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

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#1a1c1c" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(212,175,55,0.7)" }}>Zero learning curve</span>
            <h2 className="text-3xl font-black text-white mt-2">How Accura works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "bolt", title: "Auto-entries from every invoice", desc: "When your team raises an invoice in Nexlog, EntryX, DockIQ, or RunDesk — Accura records it automatically. Zero manual entry." },
              { step: "02", icon: "tune", title: "Review, categorize, reconcile", desc: "Accura pre-fills everything. You review in seconds. Match bank transactions with one click. Flag anything for your CA." },
              { step: "03", icon: "download", title: "Export → CA → GST portal", desc: "Download GSTR-1 for the CA. Send them the CA export ZIP. P&L in PDF. Balance sheet. Done in minutes, not days." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(212,175,55,0.12)", border: "1.5px solid rgba(212,175,55,0.25)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#D4AF37" }}>{s.icon}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(212,175,55,0.5)" }}>Step {s.step}</p>
                <p className="font-black text-white text-base mb-3">{s.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Pricing</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">Simple, honest pricing</h2>
            <p className="text-sm text-gray-500 mt-2">Tally Silver = ₹1,500/mo. Knows nothing about freight.<br />Accura Starter = ₹1,499/mo. Built for logistics. Speaks your language.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Starter", price: "₹1,499", cycle: "/mo", highlight: false,
                badge: null,
                features: ["Up to 50 invoices/month","1 user","Income & Expense Ledger","GST Summary + Export","Basic P&L","Bank Reconciliation","14-day free trial"],
              },
              {
                name: "Pro", price: "₹2,299", cycle: "/mo", highlight: true,
                badge: "Most Popular",
                features: ["Unlimited invoices","3 users","All 13 modules","AI receipt scanner","Per-job profitability","CA collaboration login","Tally XML export","Priority support","14-day free trial"],
              },
              {
                name: "Enterprise", price: "Custom", cycle: "", highlight: false,
                badge: null,
                features: ["Unlimited users","Multi-GSTIN","Multi-branch","Custom SLA","Dedicated support","On-premise option","Volume discounts"],
              },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl border p-6 flex flex-col relative ${p.highlight ? "border-[#D4AF37] border-2 shadow-xl" : "border-gray-100 bg-white"}`}
                style={{ background: p.highlight ? "#1a1c1c" : "#fff" }}>
                {p.badge && (
                  <div className="absolute -top-px right-5 bg-[#D4AF37] px-3 py-1 rounded-b-xl">
                    <span className="text-[#1a1c1c] text-xs font-black uppercase tracking-wider">{p.badge}</span>
                  </div>
                )}
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: p.highlight ? "rgba(212,175,55,0.7)" : "#9ca3af" }}>{p.name}</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className="text-4xl font-black" style={{ color: p.highlight ? "#D4AF37" : "#1a1c1c" }}>{p.price}</span>
                  <span className="text-sm mb-1.5" style={{ color: p.highlight ? "rgba(255,255,255,0.4)" : "#9ca3af" }}>{p.cycle}</span>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: p.highlight ? "#D4AF37" : "#1A237E" }} />
                      <span style={{ color: p.highlight ? "rgba(255,255,255,0.75)" : "#374151" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={p.name === "Enterprise" ? "/contact" : "/pricing"}
                  className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-center transition-all duration-200 block"
                  style={{
                    background: p.highlight ? "#D4AF37" : "#1a1c1c",
                    color: p.highlight ? "#1a1c1c" : "#D4AF37",
                  }}>
                  {p.name === "Enterprise" ? "Talk to Sales" : "View Pricing →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions about Accura</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: openFaq === i ? "rgba(212,175,55,0.4)" : "#e5e7eb" }}>
                <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-[#D4AF37] flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-4"><p className="text-sm text-gray-600 leading-relaxed">{f.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#1a1c1c" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(212,175,55,0.6)" }}>Ready to switch?</p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Stop fighting Tally.<br />
            <span style={{ color: "#D4AF37" }}>Start using Accura.</span>
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            14-day free trial. No credit card. No setup fee. Your existing data stays yours.
          </p>
          <Link href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: "#D4AF37", color: "#1a1c1c" }}>
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Accura Pro · ₹2,299/mo · Tally Gold = ₹4,500/mo and does less.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
