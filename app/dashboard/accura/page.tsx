"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n: number) {
  if (Math.abs(n) >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (Math.abs(n) >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n.toLocaleString("en-IN");
}

function getThisMonthFrom() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0];
}
function getToday() {
  return new Date().toISOString().split("T")[0];
}
function getLastMonthRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 0);
  return { from: from.toISOString().split("T")[0], to: to.toISOString().split("T")[0] };
}
function getThisQuarterRange() {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3);
  const from = new Date(now.getFullYear(), q * 3, 1);
  const to = new Date(now.getFullYear(), q * 3 + 3, 0);
  return { from: from.toISOString().split("T")[0], to: to.toISOString().split("T")[0] };
}
function getThisFYRange() {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return { from: `${year}-04-01`, to: `${year + 1}-03-31` };
}
function getLastFYRange() {
  const { from, to } = getThisFYRange();
  const y1 = parseInt(from.split("-")[0]) - 1;
  const y2 = parseInt(to.split("-")[0]) - 1;
  return { from: `${y1}-04-01`, to: `${y2}-03-31` };
}

const quickActions = [
  { label: "New Payment", shortcut: "F5", href: "/dashboard/accura/vouchers/payment", icon: "payments", color: "#0E7490" },
  { label: "New Receipt", shortcut: "F6", href: "/dashboard/accura/vouchers/receipt", icon: "receipt", color: "#059669" },
  { label: "New Sales Invoice", shortcut: "F8", href: "/dashboard/accura/vouchers/sales", icon: "description", color: "#7C3AED" },
  { label: "Run Payroll", shortcut: "", href: "/dashboard/accura/payroll?tab=run", icon: "paid", color: "#D97706" },
];

const alerts: {
  type: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}[] = [];

export default function AccuraDashboard() {
  const [dateFrom, setDateFrom] = useState(getThisMonthFrom);
  const [dateTo, setDateTo] = useState(getToday);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [draftFrom, setDraftFrom] = useState(dateFrom);
  const [draftTo, setDraftTo] = useState(dateTo);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [kpiData, setKpiData] = useState({ revenue: 0, expenses: 0, netProfit: 0, gstPayable: 0, receivables: 0, cash: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [salesRes, purchaseRes, paymentRes, receiptRes] = await Promise.all([
        fetch(`/api/accura/vouchers?type=SALES&from=${dateFrom}&to=${dateTo}`).then((r) => r.json()),
        fetch(`/api/accura/vouchers?type=PURCHASE&from=${dateFrom}&to=${dateTo}`).then((r) => r.json()),
        fetch(`/api/accura/vouchers?type=PAYMENT&from=${dateFrom}&to=${dateTo}`).then((r) => r.json()),
        fetch(`/api/accura/vouchers?type=RECEIPT&from=${dateFrom}&to=${dateTo}`).then((r) => r.json()),
      ]);

      const revenue = Array.isArray(salesRes) ? salesRes.reduce((s: number, v: { totalAmount: number }) => s + v.totalAmount, 0) : 0;
      const expenses = Array.isArray(purchaseRes) ? purchaseRes.reduce((s: number, v: { totalAmount: number }) => s + v.totalAmount, 0) : 0;
      const payments = Array.isArray(paymentRes) ? paymentRes.reduce((s: number, v: { totalAmount: number }) => s + v.totalAmount, 0) : 0;
      const receipts = Array.isArray(receiptRes) ? receiptRes.reduce((s: number, v: { totalAmount: number }) => s + v.totalAmount, 0) : 0;

      setKpiData({
        revenue,
        expenses,
        netProfit: revenue - expenses,
        gstPayable: 0,
        receivables: revenue - receipts,
        cash: receipts - payments,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const kpiCards = [
    { label: "Revenue", value: fmt(kpiData.revenue), icon: "trending_up", color: "#059669", bg: "#ECFDF5" },
    { label: "Expenses", value: fmt(kpiData.expenses), icon: "receipt_long", color: "#D97706", bg: "#FFFBEB" },
    { label: "Net Profit", value: fmt(kpiData.netProfit), icon: "account_balance", color: kpiData.netProfit >= 0 ? "#059669" : "#DC2626", bg: kpiData.netProfit >= 0 ? "#ECFDF5" : "#FEF2F2" },
    { label: "GST Payable", value: fmt(kpiData.gstPayable), icon: "gavel", color: "#DC2626", bg: "#FEF2F2" },
    { label: "Outstanding Receivables", value: fmt(kpiData.receivables), icon: "arrow_outward", color: "#0E7490", bg: "#ECFEFF" },
    { label: "Cash Position", value: fmt(kpiData.cash), icon: "savings", color: "#7C3AED", bg: "#F5F3FF" },
  ];

  function applyPreset(preset: string) {
    let from = dateFrom, to = dateTo;
    if (preset === "this-month") { from = getThisMonthFrom(); to = getToday(); }
    else if (preset === "last-month") { const r = getLastMonthRange(); from = r.from; to = r.to; }
    else if (preset === "this-quarter") { const r = getThisQuarterRange(); from = r.from; to = r.to; }
    else if (preset === "this-fy") { const r = getThisFYRange(); from = r.from; to = r.to; }
    else if (preset === "last-fy") { const r = getLastFYRange(); from = r.from; to = r.to; }
    setDraftFrom(from);
    setDraftTo(to);
    setDateFrom(from);
    setDateTo(to);
    setShowDatePicker(false);
  }

  function applyDates() {
    setDateFrom(draftFrom);
    setDateTo(draftTo);
    setShowDatePicker(false);
  }

  const dateLabel = `${dateFrom} → ${dateTo}`;

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · FY 2025–26</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date picker trigger */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => { setDraftFrom(dateFrom); setDraftTo(dateTo); setShowDatePicker((v) => !v); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm cursor-pointer hover:bg-white transition-colors"
              style={{ borderColor: "#E5E7EB", background: "#fff", color: "#374151" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_month</span>
              <span className="text-[13px]">{dateLabel}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#9CA3AF" }}>expand_more</span>
            </button>

            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 z-50 rounded-xl border shadow-lg p-4"
                  style={{ background: "#fff", borderColor: "#E5E7EB", width: 300 }}
                >
                  {/* Quick presets */}
                  <div className="mb-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>Quick Select</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "This Month", id: "this-month" },
                        { label: "Last Month", id: "last-month" },
                        { label: "This Quarter", id: "this-quarter" },
                        { label: "This FY", id: "this-fy" },
                        { label: "Last FY", id: "last-fy" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => applyPreset(p.id)}
                          className="px-2 py-1 rounded-md text-[12px] transition-colors hover:bg-gray-100"
                          style={{ border: "1px solid #E5E7EB", color: "#374151" }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom range inputs */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1" style={{ color: "#6B7280" }}>From</label>
                      <input
                        type="date"
                        value={draftFrom}
                        onChange={(e) => setDraftFrom(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-md border text-[13px] outline-none"
                        style={{ borderColor: "#E5E7EB", color: "#111827" }}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1" style={{ color: "#6B7280" }}>To</label>
                      <input
                        type="date"
                        value={draftTo}
                        onChange={(e) => setDraftTo(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-md border text-[13px] outline-none"
                        style={{ borderColor: "#E5E7EB", color: "#111827" }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={applyDates}
                    className="w-full py-2 rounded-md text-[13px] font-medium text-white transition-colors"
                    style={{ background: "#0E7490" }}
                  >
                    Apply
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors disabled:opacity-60"
            style={{ background: "#0E7490" }}
          >
            <span className={`material-symbols-outlined ${loading ? "animate-spin" : ""}`} style={{ fontSize: 15 }}>refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl p-4 border"
            style={{ background: "#fff", borderColor: "#E5E7EB" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-[11px] font-medium mb-1.5" style={{ color: "#6B7280" }}>{kpi.label}</div>
                {loading
                  ? <div className="h-8 w-24 rounded animate-pulse" style={{ background: "#F3F4F6" }} />
                  : <div className="text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>{kpi.value}</div>}
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: kpi.color, fontVariationSettings: "'FILL' 1" }}>
                  {kpi.icon}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Bar Chart */}
        <div className="col-span-2 rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>Revenue vs Expenses</h2>
              <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Selected period</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: "#0E7490" }} />
                <span style={{ color: "#6B7280" }}>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: "#FDA4AF" }} />
                <span style={{ color: "#6B7280" }}>Expenses</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-end gap-2 h-36">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="flex items-end gap-0.5 w-full" style={{ height: 120 }}>
                    <div className="flex-1 rounded-t-sm animate-pulse" style={{ height: `${30 + i * 8}%`, background: "#E5E7EB" }} />
                    <div className="flex-1 rounded-t-sm animate-pulse" style={{ height: `${20 + i * 5}%`, background: "#F3F4F6" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-36 text-center">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>bar_chart</span>
              <p className="text-[12px]" style={{ color: "#7e7576" }}>
                {kpiData.revenue === 0 && kpiData.expenses === 0 ? "No data yet." : "Chart coming soon."}
              </p>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Alerts & Reminders</h2>
          <div className="flex flex-col gap-2">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>notifications_none</span>
                <p className="text-[12px]" style={{ color: "#7e7576" }}>No alerts right now.</p>
              </div>
            ) : alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-lg border text-[12px]"
                style={{ background: alert.bg, borderColor: alert.border }}
              >
                <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ fontSize: 15, color: alert.color, fontVariationSettings: "'FILL' 1" }}>
                  {alert.icon}
                </span>
                <div>
                  <div className="font-medium" style={{ color: "#111827" }}>{alert.title}</div>
                  <div style={{ color: "#6B7280" }}>{alert.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Quick Actions</h2>
        <div className="flex items-center gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[13px] font-medium transition-all hover:shadow-sm hover:-translate-y-0.5"
              style={{
                borderColor: action.color + "33",
                color: action.color,
                background: action.color + "0D",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17, color: action.color, fontVariationSettings: "'FILL' 1" }}>
                {action.icon}
              </span>
              {action.label}
              {action.shortcut && (
                <kbd
                  className="ml-1 text-[10px] font-mono px-1 py-0.5 rounded border"
                  style={{ borderColor: action.color + "44", color: action.color, background: action.color + "10" }}
                >
                  {action.shortcut}
                </kbd>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
