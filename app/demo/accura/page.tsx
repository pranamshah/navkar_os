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
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "income",    label: "Income",    icon: "trending_up" },
  { id: "expenses",  label: "Expenses",  icon: "payments" },
  { id: "gst",       label: "GST",       icon: "account_balance" },
  { id: "pnl",       label: "P&L",       icon: "bar_chart" },
  { id: "bank",      label: "Bank",      icon: "account_balance_wallet" },
];

/* ─────────────────────────────────────────────────────────── */
/* MOCK SCREENS — light-themed, matching real software design  */
/* ─────────────────────────────────────────────────────────── */

function DashboardScreen() {
  const kpis = [
    { label: "Revenue",                value: "₹8,42,500",  icon: "trending_up",         color: "#059669", bg: "#ECFDF5" },
    { label: "Expenses",               value: "₹3,18,200",  icon: "receipt_long",         color: "#DC2626", bg: "#FEF2F2" },
    { label: "Net Profit",             value: "₹5,24,300",  icon: "account_balance",      color: "#059669", bg: "#ECFDF5" },
    { label: "GST Payable",            value: "₹62,140",    icon: "gavel",                color: "#DC2626", bg: "#FEF2F2" },
    { label: "Outstanding Receivables",value: "₹1,94,000",  icon: "arrow_outward",        color: "#0E7490", bg: "#ECFEFF" },
    { label: "Cash Position",          value: "₹12,30,800", icon: "savings",              color: "#1E40AF", bg: "#F5F3FF" },
  ];
  const quickActions = [
    { label: "New Payment",      shortcut: "F5", icon: "payments",     color: "#0E7490" },
    { label: "New Receipt",      shortcut: "F6", icon: "receipt",      color: "#059669" },
    { label: "New Sales Invoice",shortcut: "F8", icon: "description",  color: "#1E40AF" },
    { label: "Run Payroll",      shortcut: "",   icon: "paid",         color: "#1E40AF" },
  ];
  const txns = [
    { date: "05 Jul", type: "Sales Invoice", party: "Ravi Exports",      amount: "₹78,500",  bal: "₹78,500",  tc: { text: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC" } },
    { date: "04 Jul", type: "Receipt",       party: "HDFC Traders",      amount: "₹48,000",  bal: "₹1,26,500",tc: { text: "#059669", bg: "#ECFDF5", border: "#A7F3D0" } },
    { date: "03 Jul", type: "Payment",       party: "Apollo World",       amount: "₹18,000",  bal: "₹1,08,500",tc: { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" } },
    { date: "02 Jul", type: "Sales Invoice", party: "Global Impex",       amount: "₹15,000",  bal: "₹1,23,500",tc: { text: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC" } },
    { date: "01 Jul", type: "Payment",       party: "Fast Transport",     amount: "₹54,000",  bal: "₹69,500",  tc: { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" } },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <p className="font-semibold" style={{ color: "#111827", fontSize: "13px" }}>Dashboard</p>
          <p style={{ color: "#6B7280", fontSize: "10px" }}>Navkar Freight Co. · FY 2025–26</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#6B7280" }}>calendar_month</span>
          <span style={{ color: "#374151", fontSize: "10px" }}>01 Jul 2026 – 07 Jul 2026</span>
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#9CA3AF" }}>expand_more</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border p-2.5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p style={{ color: "#6B7280", fontSize: "9px", fontWeight: 500 }}>{k.label}</p>
                <p className="font-bold mt-1" style={{ fontSize: "13px", color: "#111827" }}>{k.value}</p>
              </div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: k.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: k.color, fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border mx-4 mb-2 p-2.5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <p className="font-semibold mb-2" style={{ color: "#111827", fontSize: "10px" }}>Quick Actions</p>
        <div className="flex items-center gap-1.5">
          {quickActions.map((a) => (
            <div key={a.label} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border" style={{ borderColor: a.color + "33", color: a.color, background: a.color + "0D", fontSize: "9px", fontWeight: 500 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: a.color, fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
              {a.label}
              {a.shortcut && <kbd className="text-[8px] font-mono px-1 py-0.5 rounded border" style={{ borderColor: a.color + "44", color: a.color, background: a.color + "10" }}>{a.shortcut}</kbd>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border mx-4 mb-4 overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <div className="px-3 py-2 border-b" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
          <p className="font-semibold" style={{ color: "#111827", fontSize: "10px" }}>Recent Transactions</p>
        </div>
        <table className="w-full" style={{ fontSize: "9px" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Date","Type","Party","Amount","Balance"].map(h => (
                <th key={h} className="px-3 py-1.5 text-left font-semibold text-[9px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.date + t.party} className="border-b" style={{ borderColor: "#F3F4F6" }}>
                <td className="px-3 py-2" style={{ color: "#6B7280" }}>{t.date}</td>
                <td className="px-3 py-2">
                  <span className="px-1.5 py-0.5 rounded-full font-semibold" style={{ background: t.tc.bg, color: t.tc.text, border: `1px solid ${t.tc.border}`, fontSize: "8px" }}>{t.type}</span>
                </td>
                <td className="px-3 py-2 font-medium" style={{ color: "#111827" }}>{t.party}</td>
                <td className="px-3 py-2 font-mono font-semibold" style={{ color: "#111827" }}>{t.amount}</td>
                <td className="px-3 py-2 font-mono" style={{ color: "#6B7280" }}>{t.bal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IncomeScreen() {
  const rows = [
    { no: "SV-2026-0142", date: "05 Jul", party: "Ravi Exports",      amount: "₹66,525", gst: "₹11,975", total: "₹78,500",  status: "Posted" },
    { no: "SV-2026-0141", date: "04 Jul", party: "HDFC Traders",      amount: "₹40,678", gst: "₹7,322",  total: "₹48,000",  status: "Posted" },
    { no: "SV-2026-0140", date: "03 Jul", party: "Global Impex",       amount: "₹12,712", gst: "₹2,288",  total: "₹15,000",  status: "Posted" },
    { no: "SV-2026-0139", date: "02 Jul", party: "Sakthi Cargo",       amount: "₹8,475",  gst: "₹1,525",  total: "₹10,000",  status: "Posted" },
    { no: "SV-2026-0138", date: "01 Jul", party: "Sunrise Logistics",  amount: "₹22,034", gst: "₹3,966",  total: "₹26,000",  status: "Draft"  },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="font-semibold" style={{ color: "#111827", fontSize: "13px" }}>Sales Vouchers</p>
          <p style={{ color: "#6B7280", fontSize: "10px" }}>July 2026</p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white" style={{ background: "#1E40AF", fontSize: "10px", fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>+ New Sales Invoice
        </button>
      </div>

      {/* Totals strip */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-3">
        {[["Total Sales","₹18.5L","#1E40AF","#F5F3FF"],["IGST Collected","₹2.22L","#0E7490","#ECFEFF"],["Net Receivable","₹20.72L","#059669","#ECFDF5"]].map(([l,v,c,bg]) => (
          <div key={l} className="rounded-xl border p-2.5" style={{ background: bg as string, borderColor: "#E5E7EB" }}>
            <p style={{ color: "#6B7280", fontSize: "9px" }}>{l}</p>
            <p className="font-bold mt-0.5" style={{ color: c as string, fontSize: "13px" }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mx-4 rounded-xl border overflow-hidden mb-4" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <table className="w-full" style={{ fontSize: "10px" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Voucher No","Date","Party (Ledger)","Amount","GST","Total","Status"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-[10px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.no} className="border-b" style={{ borderColor: "#F3F4F6" }}>
                <td className="px-3 py-2 font-mono font-medium" style={{ color: "#0E7490" }}>{r.no}</td>
                <td className="px-3 py-2" style={{ color: "#6B7280" }}>{r.date}</td>
                <td className="px-3 py-2 font-medium" style={{ color: "#111827" }}>{r.party}</td>
                <td className="px-3 py-2 font-mono" style={{ color: "#374151" }}>{r.amount}</td>
                <td className="px-3 py-2 font-mono" style={{ color: "#0E7490" }}>{r.gst}</td>
                <td className="px-3 py-2 font-mono font-semibold" style={{ color: "#111827" }}>{r.total}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded-full font-semibold" style={r.status === "Posted"
                    ? { background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontSize: "9px" }
                    : { background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB", fontSize: "9px" }}>
                    {r.status}
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

function ExpensesScreen() {
  const rows = [
    { vendor: "Apollo World Connect", category: "CFS Charges",       date: "05 Jul", amount: "₹82,000",  status: "Posted" },
    { vendor: "Fast Transport",       category: "Road Freight",       date: "04 Jul", amount: "₹54,000",  status: "Posted" },
    { vendor: "JNPT Port Trust",      category: "Port Dues",          date: "03 Jul", amount: "₹28,000",  status: "Posted" },
    { vendor: "Staff Salary July",    category: "Salary & Wages",     date: "01 Jul", amount: "₹1,44,000",status: "Posted" },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="font-semibold" style={{ color: "#111827", fontSize: "13px" }}>Purchase Vouchers</p>
          <p style={{ color: "#6B7280", fontSize: "10px" }}>July 2026</p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white" style={{ background: "#DC2626", fontSize: "10px", fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>+ New Purchase
        </button>
      </div>

      {/* Total card */}
      <div className="mx-4 mb-3 rounded-xl border p-3" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
        <p style={{ color: "#6B7280", fontSize: "10px" }}>Total Expenses — July 2026</p>
        <p className="font-bold mt-0.5" style={{ color: "#DC2626", fontSize: "18px" }}>₹3,18,200</p>
      </div>

      {/* Table */}
      <div className="mx-4 rounded-xl border overflow-hidden mb-4" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <table className="w-full" style={{ fontSize: "10px" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Vendor","Category","Date","Amount","Status"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-[10px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.vendor} className="border-b" style={{ borderColor: "#F3F4F6" }}>
                <td className="px-3 py-2.5 font-medium" style={{ color: "#111827" }}>{r.vendor}</td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "#FFFBEB", color: "#1E40AF", border: "1px solid #FDE68A", fontSize: "9px" }}>{r.category}</span>
                </td>
                <td className="px-3 py-2.5" style={{ color: "#6B7280" }}>{r.date}</td>
                <td className="px-3 py-2.5 font-mono font-semibold" style={{ color: "#DC2626" }}>{r.amount}</td>
                <td className="px-3 py-2.5">
                  <span className="px-2 py-0.5 rounded-full font-semibold" style={{ background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontSize: "9px" }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#F9FAFB", borderTop: "2px solid #E5E7EB" }}>
              <td colSpan={3} className="px-3 py-2 font-semibold" style={{ color: "#374151", fontSize: "10px" }}>Total (4 entries)</td>
              <td className="px-3 py-2 font-mono font-bold" style={{ color: "#DC2626", fontSize: "10px" }}>₹3,08,000</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function GstScreen() {
  const [gstTab, setGstTab] = useState<"summary"|"gstr1"|"gstr3b">("summary");

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="font-semibold" style={{ color: "#111827", fontSize: "13px" }}>GST Module</p>
          <p style={{ color: "#6B7280", fontSize: "10px" }}>GSTIN: 33AAACN7890F1Z2 · June 2026</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-1 rounded-md border text-[10px]" style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}>June 2026 ▾</div>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-white" style={{ background: "#0E7490", fontSize: "10px", fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>file_upload</span>File on GST Portal
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex rounded-lg border overflow-hidden mx-4 mb-3 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {[["summary","GST Summary"],["gstr1","GSTR-1"],["gstr3b","GSTR-3B"]].map(([id,label]) => (
          <button key={id} onClick={() => setGstTab(id as "summary"|"gstr1"|"gstr3b")}
            className="px-3 py-1.5 text-[11px] font-medium transition-colors"
            style={{ background: gstTab === id ? "#0E7490" : "#fff", color: gstTab === id ? "#fff" : "#6B7280" }}>
            {label}
          </button>
        ))}
      </div>

      {gstTab === "summary" && (
        <div className="px-4 space-y-3 pb-4">
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total Outward Supplies", val: "₹8,42,500",   sub: "Sales this period",    color: "#0E7490", bg: "#ECFEFF" },
              { label: "ITC Available",          val: "₹69,560",     sub: "Input Tax Credit",      color: "#059669", bg: "#ECFDF5" },
              { label: "GST Payable",            val: "₹62,540",     sub: "IGST after setoff",     color: "#DC2626", bg: "#FEF2F2" },
              { label: "Filing Due",             val: "20 Jul 2026", sub: "GSTR-3B deadline",      color: "#1E40AF", bg: "#FFFBEB" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border p-2.5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <p style={{ color: "#6B7280", fontSize: "9px", fontWeight: 500 }}>{kpi.label}</p>
                <p className="font-bold font-mono mt-1" style={{ color: kpi.color, fontSize: "12px" }}>{kpi.val}</p>
                <p style={{ color: "#9CA3AF", fontSize: "9px", marginTop: "1px" }}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* GSTR-3B table */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <div className="px-3 py-2 border-b" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
              <p className="font-semibold" style={{ color: "#111827", fontSize: "11px" }}>GST Liability Summary — June 2026</p>
            </div>
            <table className="w-full" style={{ fontSize: "10px" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {["","Taxable Amount","CGST","SGST","IGST","Total GST"].map((h) => (
                    <th key={h} className="px-3 py-2 text-right first:text-left font-semibold text-[9px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: "#F3F4F6" }}>
                  <td className="px-3 py-2 font-medium" style={{ color: "#111827" }}>Outward Supplies (Sales)</td>
                  <td className="px-3 py-2 text-right font-mono">₹8,42,500</td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: "#0E7490" }}>₹24,820</td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: "#0E7490" }}>₹24,820</td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: "#1E40AF" }}>₹82,460</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold">₹1,32,100</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "#F3F4F6" }}>
                  <td className="px-3 py-2 font-medium" style={{ color: "#111827" }}>ITC Available (Purchases)</td>
                  <td className="px-3 py-2 text-right font-mono">₹3,18,200</td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: "#059669" }}>(₹12,400)</td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: "#059669" }}>(₹12,400)</td>
                  <td className="px-3 py-2 text-right font-mono" style={{ color: "#059669" }}>(₹44,760)</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold" style={{ color: "#059669" }}>(₹69,560)</td>
                </tr>
                <tr style={{ background: "#FFFBEB" }}>
                  <td className="px-3 py-2.5 font-bold" style={{ color: "#111827" }}>Net GST Payable</td>
                  <td />
                  <td className="px-3 py-2.5 text-right font-mono font-bold" style={{ color: "#1E40AF" }}>₹12,420</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold" style={{ color: "#1E40AF" }}>₹12,420</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold" style={{ color: "#DC2626" }}>₹37,700</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-[12px]" style={{ color: "#DC2626" }}>₹62,540</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {gstTab !== "summary" && (
        <div className="px-4 pb-4">
          <div className="rounded-xl border p-8 text-center" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <span className="material-symbols-outlined block mb-2" style={{ fontSize: 32, color: "#D1D5DB" }}>receipt_long</span>
            <p style={{ color: "#374151", fontSize: "12px", fontWeight: 500 }}>{gstTab === "gstr1" ? "GSTR-1 — Outward Supplies" : "GSTR-3B — Return Summary"}</p>
            <p style={{ color: "#9CA3AF", fontSize: "11px", marginTop: "4px" }}>June 2026 · Data ready for download</p>
            <button className="mt-3 flex items-center gap-1 mx-auto px-3 py-1.5 rounded-md border text-[11px]" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>download</span>Download {gstTab === "gstr1" ? "JSON" : "Excel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PnlScreen() {
  const incomeRows = [
    { label: "Service Charges",        val: "₹4,18,000" },
    { label: "Reimbursement Billing",  val: "₹1,92,500" },
    { label: "Air Freight",            val: "₹88,000"   },
    { label: "Other Income",           val: "₹44,000"   },
  ];
  const directExp = [
    { label: "CFS Charges",            val: "₹82,000" },
    { label: "Transport",              val: "₹54,000" },
    { label: "Steamer Agent",          val: "₹38,000" },
  ];
  const indirectExp = [
    { label: "Rent",                   val: "₹28,000"   },
    { label: "Salary",                 val: "₹1,44,000" },
    { label: "Software",               val: "₹18,200"   },
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="font-semibold" style={{ color: "#111827", fontSize: "13px" }}>Profit & Loss Statement</p>
          <p style={{ color: "#6B7280", fontSize: "10px" }}>April 2026 – July 2026</p>
        </div>
        <div className="flex gap-1.5">
          {["Download PDF","Export Excel","Send to CA"].map(b => (
            <button key={b} className="px-2 py-1 rounded-md border text-[9px]" style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}>{b}</button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 space-y-2">
        {/* Income section */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: "#E5E7EB", background: "#ECFDF5" }}>
            <p className="font-semibold text-[10px] uppercase tracking-wide" style={{ color: "#059669" }}>Income</p>
          </div>
          {incomeRows.map(r => (
            <div key={r.label} className="flex justify-between px-3 py-2 border-b" style={{ borderColor: "#F3F4F6" }}>
              <span style={{ color: "#374151", fontSize: "11px" }}>{r.label}</span>
              <span className="font-mono" style={{ color: "#111827", fontSize: "11px" }}>{r.val}</span>
            </div>
          ))}
          <div className="flex justify-between px-3 py-2" style={{ background: "#ECFDF5" }}>
            <span className="font-bold" style={{ color: "#059669", fontSize: "11px" }}>TOTAL INCOME</span>
            <span className="font-bold font-mono" style={{ color: "#059669", fontSize: "12px" }}>₹7,42,500</span>
          </div>
        </div>

        {/* Direct Expenses */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: "#E5E7EB", background: "#FEF2F2" }}>
            <p className="font-semibold text-[10px] uppercase tracking-wide" style={{ color: "#DC2626" }}>Direct Expenses</p>
          </div>
          {directExp.map(r => (
            <div key={r.label} className="flex justify-between px-3 py-2 border-b" style={{ borderColor: "#F3F4F6" }}>
              <span style={{ color: "#374151", fontSize: "11px" }}>{r.label}</span>
              <span className="font-mono" style={{ color: "#DC2626", fontSize: "11px" }}>{r.val}</span>
            </div>
          ))}
          <div className="flex justify-between px-3 py-2" style={{ background: "#ECFDF5" }}>
            <span className="font-bold" style={{ color: "#059669", fontSize: "11px" }}>GROSS PROFIT</span>
            <span className="font-bold font-mono" style={{ color: "#059669", fontSize: "12px" }}>₹5,68,500</span>
          </div>
        </div>

        {/* Indirect Expenses */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <div className="px-3 py-2 border-b" style={{ borderColor: "#E5E7EB", background: "#FFFBEB" }}>
            <p className="font-semibold text-[10px] uppercase tracking-wide" style={{ color: "#1E40AF" }}>Indirect Expenses</p>
          </div>
          {indirectExp.map(r => (
            <div key={r.label} className="flex justify-between px-3 py-2 border-b" style={{ borderColor: "#F3F4F6" }}>
              <span style={{ color: "#374151", fontSize: "11px" }}>{r.label}</span>
              <span className="font-mono" style={{ color: "#1E40AF", fontSize: "11px" }}>{r.val}</span>
            </div>
          ))}
          <div className="flex justify-between items-center px-3 py-3" style={{ background: "#F0FDF4", borderTop: "2px solid #A7F3D0" }}>
            <span className="font-bold" style={{ color: "#059669", fontSize: "12px" }}>NET PROFIT (Before Tax)</span>
            <span className="font-bold font-mono" style={{ color: "#059669", fontSize: "16px" }}>₹3,78,300</span>
          </div>
        </div>

        <div className="flex justify-end">
          <span style={{ color: "#6B7280", fontSize: "10px" }}>Net Margin: <strong style={{ color: "#059669" }}>50.9%</strong></span>
        </div>
      </div>
    </div>
  );
}

function BankScreen() {
  const txns = [
    { date: "03 Jul", desc: "NEFT CR - Ravi Exports",       debit: "",        credit: "₹78,500", status: "matched"  },
    { date: "02 Jul", desc: "NEFT DR - Apollo World",        debit: "₹18,000", credit: "",        status: "matched"  },
    { date: "01 Jul", desc: "RTGS DR - Sakthi Transport",    debit: "₹54,000", credit: "",        status: "possible" },
    { date: "30 Jun", desc: "CR - Bank Interest",            debit: "",        credit: "₹1,240",  status: "unmatched"},
    { date: "29 Jun", desc: "NEFT CR - Global Impex",        debit: "",        credit: "₹15,000", status: "matched"  },
  ];
  const statusConfig: Record<string, { text: string; bg: string; border: string; icon: string; label: string }> = {
    matched:   { text: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: "check_circle", label: "Matched"   },
    possible:  { text: "#1E40AF", bg: "#FFFBEB", border: "#FDE68A", icon: "help",         label: "Possible"  },
    unmatched: { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "cancel",       label: "Unmatched" },
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <p className="font-semibold" style={{ color: "#111827", fontSize: "13px" }}>Bank Reconciliation</p>
          <p style={{ color: "#6B7280", fontSize: "10px" }}>HDFC Current – XXXX4521</p>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-[10px]" style={{ borderColor: "#E5E7EB", color: "#374151", background: "#fff" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>upload_file</span>Import Statement
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-3">
        {[
          ["Bank Balance",    "₹12,30,800", "#111827","#fff"],
          ["Book Balance",    "₹12,18,560", "#111827","#fff"],
          ["Difference",      "₹12,240",    "#DC2626","#FEF2F2"],
        ].map(([l,v,c,bg]) => (
          <div key={l} className="rounded-xl border p-2.5" style={{ background: bg as string, borderColor: "#E5E7EB" }}>
            <p style={{ color: "#6B7280", fontSize: "9px" }}>{l}</p>
            <p className="font-bold font-mono mt-0.5" style={{ color: c as string, fontSize: "13px" }}>{v}</p>
            {l === "Difference" && <p style={{ color: "#DC2626", fontSize: "9px" }}>unreconciled</p>}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mx-4 rounded-xl border overflow-hidden mb-4" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        <table className="w-full" style={{ fontSize: "10px" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              {["Date","Description","Debit","Credit","Status"].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-[9px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => {
              const sc = statusConfig[t.status];
              return (
                <tr key={t.desc} className="border-b" style={{ borderColor: "#F3F4F6" }}>
                  <td className="px-3 py-2.5" style={{ color: "#6B7280" }}>{t.date}</td>
                  <td className="px-3 py-2.5 font-medium" style={{ color: "#111827" }}>{t.desc}</td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: t.debit ? "#DC2626" : "#D1D5DB" }}>{t.debit || "—"}</td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: t.credit ? "#059669" : "#D1D5DB" }}>{t.credit || "—"}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-full font-semibold" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, fontSize: "9px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 10, color: sc.text, fontVariationSettings: "'FILL' 1" }}>{sc.icon}</span>
                      {sc.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SCREENS: Record<string, React.ReactNode> = {
  dashboard: <DashboardScreen />,
  income:    <IncomeScreen />,
  expenses:  <ExpensesScreen />,
  gst:       <GstScreen />,
  pnl:       <PnlScreen />,
  bank:      <BankScreen />,
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
  { q: "How does auto-population from other modules work?", a: "When you raise an invoice in Nexlog, EntryX, DockIQ, or RunDesk, it automatically creates an income entry in Accura. Your accounting team sees it instantly. Zero double-entry." },
  { q: "Can I export data to my CA's software?", a: "Yes. Accura generates TallyPrime-compatible XML with one click. Your CA imports it in 30 seconds — all entries appear with proper ledger heads. GSTR-1 and GSTR-3B Excel files match the exact GST portal upload template." },
  { q: "Is the GST export CA-ready?", a: "Completely. GSTR-1 and GSTR-3B Excel files match the exact GST portal upload template. Your CA downloads and uploads directly — no re-entry." },
  { q: "What accounting modules are included?", a: "Every module is included in the single ₹1,499/mo plan: Invoicing, Income Ledger, Expense Ledger, Bank Reconciliation, GST (GSTR-1, GSTR-3B, GSTR-2A), P&L, Per-Job Profitability, Receivables Tracker, AI Receipt Scanner, CA Login, WhatsApp Reminders, Multi-currency, TDS/TCS." },
  { q: "Does Accura work without other NavkarOS modules?", a: "Yes — Accura works standalone. You manually enter invoices and expenses. It works best when paired with Nexlog, EntryX, DockIQ, or RunDesk since those auto-populate entries." },
];

/* ─────────────────────────────────────────────────────────── */
/* PAGE                                                        */
/* ─────────────────────────────────────────────────────────── */
export default function AccuraPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const hasAccura = isAdmin || (session?.user as { subscriptions?: { product: string; status: string }[] } | undefined)?.subscriptions?.some(
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
          style={{ backgroundImage: "linear-gradient(rgba(30,64,175,1) 1px,transparent 1px),linear-gradient(90deg,rgba(30,64,175,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{ background: "rgba(30,64,175,0.1)", borderColor: "rgba(30,64,175,0.25)", color: "#1E40AF" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>account_balance</span>
              Freight Accounting · Built for Indian Logistics
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
              Your CA will love you<br />
              <span style={{ color: "#1E40AF" }}>for switching to Accura.</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              Freight-specific accounting that auto-posts from every NavkarOS invoice, generates GSTR-1 in one click, and shows real-time per-job profitability — built exclusively for Indian logistics.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <Link href={ctaHref} className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
                style={{ background: "#1E40AF", color: "#1a1c1c" }}>
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#demo" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider border transition-all duration-200 hover:border-[#1E40AF] hover:text-[#1E40AF]"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                See Live Demo ↓
              </a>
            </div>
          </motion.div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "1 click", sub: "to GSTR-1 export" },
              { val: "13",      sub: "accounting modules" },
              { val: "0 hrs",   sub: "manual data entry" },
              { val: "100%",    sub: "GST & TDS compliant" },
            ].map((s) => (
              <div key={s.sub} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}>
                <p className="text-3xl font-black" style={{ color: "#1E40AF" }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ACCURA ───────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Built different</span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">What makes Accura different</h2>
            <p className="text-gray-500 mt-2 text-sm">Accura is accounting built exclusively for Indian logistics. Generic software doesn't speak your language.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "sync", title: "Auto-populated from every module", desc: "Invoices raised in Nexlog, EntryX, DockIQ, or RunDesk auto-post to Accura. Zero double-entry." },
              { icon: "account_balance", title: "GST-native, not an afterthought", desc: "GSTR-1 & GSTR-3B in one click. GSTR-2A auto-reconciliation. CA-ready export — matches GST portal template exactly." },
              { icon: "route", title: "Per-job profitability", desc: "See margin on every shipment in real time. Know which clients and routes are profitable, which aren't." },
              { icon: "phone_iphone", title: "CA collaboration login", desc: "Your CA gets a read-only login. No printing, no emailing, no WhatsApp. They log in, download what they need." },
              { icon: "smart_toy", title: "AI receipt scanner", desc: "Upload a bill photo — AI fills vendor, amount, GST, date. What takes 5 minutes takes 5 seconds." },
              { icon: "receipt_long", title: "WhatsApp payment reminders", desc: "One click to send a polite WhatsApp reminder with outstanding invoice details. Collections made effortless." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-2xl bg-white border" style={{ borderColor: "#f0f0f0" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(30,64,175,0.1)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#1E40AF" }}>{f.icon}</span>
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
      <section id="demo" className="py-20 px-6" style={{ background: "#111213" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(30,64,175,0.7)" }}>Interactive demo</span>
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
                  background: activeModule === m.id ? "#1E40AF" : "rgba(255,255,255,0.06)",
                  color: activeModule === m.id ? "#1a1c1c" : "rgba(255,255,255,0.5)",
                  border: activeModule === m.id ? "none" : "0.5px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {/* App shell — light-themed browser chrome */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid #E5E7EB" }}>
            {/* Browser bar — light */}
            <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <div className="flex gap-1.5">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />)}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1 rounded-md border text-xs" style={{ background: "#fff", borderColor: "#E5E7EB", color: "#6B7280", maxWidth: 340 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#059669" }}>lock</span>
                  <span style={{ fontSize: "11px" }}>app.navkaros.in/accura/{activeModule === "dashboard" ? "dashboard" : activeModule}</span>
                </div>
              </div>
            </div>

            {/* Sidebar + content */}
            <div className="flex" style={{ height: "520px" }}>
              {/* Mini sidebar — light */}
              <div className="flex flex-col gap-1 px-2 py-3" style={{ width: "120px", background: "#F9FAFB", borderRight: "1px solid #E5E7EB", flexShrink: 0 }}>
                {MODULES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg transition-all duration-150 w-full"
                    style={{
                      background: activeModule === m.id ? "#ECFEFF" : "transparent",
                    }}
                    title={m.label}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: activeModule === m.id ? "#0E7490" : "#9CA3AF", fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                    <span style={{ fontSize: "9px", color: activeModule === m.id ? "#0E7490" : "#6B7280", fontWeight: activeModule === m.id ? 600 : 400, lineHeight: 1.2, textAlign: "center" }}>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Screen content */}
              <div className="flex-1 overflow-hidden" style={{ background: "#F8FAFC" }}>
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
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(30,64,175,0.7)" }}>Zero learning curve</span>
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
                  style={{ background: "rgba(30,64,175,0.12)", border: "1.5px solid rgba(30,64,175,0.25)" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#1E40AF" }}>{s.icon}</span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(30,64,175,0.5)" }}>Step {s.step}</p>
                <p className="font-black text-white text-base mb-3">{s.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{s.desc}</p>
              </div>
            ))}
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
          <div className="rounded-2xl border-2 p-8 flex flex-col md:flex-row gap-8 items-center" style={{ background: "#1a1c1c", borderColor: "#1E40AF" }}>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "rgba(30,64,175,0.7)" }}>Accura</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black" style={{ color: "#1E40AF" }}>₹1,499</span>
                <span className="text-base mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
              </div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>14-day free trial · No credit card required</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200"
                style={{ background: "#1E40AF", color: "#1a1c1c" }}>
                Start Free Trial →
              </Link>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {["Unlimited invoices & entries","All 13 accounting modules","AI receipt scanner","Per-job profitability","CA collaboration login","GSTR-1 & GSTR-3B export","Bank reconciliation","WhatsApp payment reminders","Multi-currency support","Tally XML export"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#1E40AF" }} />
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
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Questions about Accura</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div key={i} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: openFaq === i ? "rgba(30,64,175,0.4)" : "#e5e7eb" }}>
                <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm text-gray-800">{f.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-[#1E40AF] flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />}
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
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(30,64,175,0.6)" }}>Ready to get started?</p>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Accounting built for<br />
            <span style={{ color: "#1E40AF" }}>Indian logistics.</span>
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            14-day free trial. No credit card. No setup fee. Your existing data stays yours.
          </p>
          <Link href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-90"
            style={{ background: "#1E40AF", color: "#1a1c1c" }}>
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Accura · ₹1,499/mo · All modules included · 14-day free trial
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
