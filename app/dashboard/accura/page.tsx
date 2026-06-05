"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const kpis = [
  {
    label: "Revenue This Month",
    value: "₹0",
    icon: "trending_up",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    label: "Expenses",
    value: "₹0",
    icon: "receipt_long",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    label: "Net Profit",
    value: "₹0",
    icon: "account_balance",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    label: "GST Payable",
    value: "₹0",
    icon: "gavel",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    label: "Outstanding Receivables",
    value: "₹0",
    icon: "arrow_outward",
    color: "#0E7490",
    bg: "#ECFEFF",
  },
  {
    label: "Cash Position",
    value: "₹0",
    icon: "savings",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const months: string[] = [];
const revenueData: number[] = [];
const expenseData: number[] = [];
const maxVal = 900;

const alerts: {
  type: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}[] = [];

const quickActions = [
  { label: "New Payment", shortcut: "F5", href: "/dashboard/accura/vouchers/payment", icon: "payments", color: "#0E7490" },
  { label: "New Receipt", shortcut: "F6", href: "/dashboard/accura/vouchers/receipt", icon: "receipt", color: "#059669" },
  { label: "New Sales Invoice", shortcut: "F8", href: "/dashboard/accura/vouchers/sales", icon: "description", color: "#7C3AED" },
  { label: "Run Payroll", shortcut: "", href: "/dashboard/accura/payroll?tab=run", icon: "paid", color: "#D97706" },
];

export default function AccuraDashboard() {
  const [selectedDate] = useState("June 2026");

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>
            Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Navkar Freight Co. · FY 2025–26
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm cursor-pointer hover:bg-white transition-colors"
            style={{ borderColor: "#E5E7EB", background: "#fff", color: "#374151" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>calendar_month</span>
            <span className="text-[13px]">{selectedDate}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#9CA3AF" }}>expand_more</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
            style={{ background: "#0E7490" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi, i) => (
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
                <div className="text-[11px] font-medium mb-1.5" style={{ color: "#6B7280" }}>
                  {kpi.label}
                </div>
                <div className="text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>
                  {kpi.value}
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: kpi.bg }}
              >
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
        <div
          className="col-span-2 rounded-xl border p-5"
          style={{ background: "#fff", borderColor: "#E5E7EB" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>Revenue vs Expenses</h2>
              <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Last 12 months · in ₹ thousands</p>
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

          {/* Pure CSS Bar Chart */}
          {months.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 text-center">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: 32, color: "#e5e7eb" }}>bar_chart</span>
              <p className="text-[12px]" style={{ color: "#7e7576" }}>No data yet.</p>
            </div>
          ) : (
            <div className="flex items-end gap-1.5 h-36">
              {months.map((month, i) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="flex items-end gap-0.5 w-full" style={{ height: 120 }}>
                    <div
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: `${(revenueData[i] / maxVal) * 100}%`,
                        background: "#0E7490",
                        opacity: i === months.length - 1 ? 1 : 0.65,
                      }}
                    />
                    <div
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: `${(expenseData[i] / maxVal) * 100}%`,
                        background: "#FDA4AF",
                        opacity: i === months.length - 1 ? 1 : 0.65,
                      }}
                    />
                  </div>
                  <div className="text-[9px]" style={{ color: "#9CA3AF" }}>{month}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div
          className="rounded-xl border p-4"
          style={{ background: "#fff", borderColor: "#E5E7EB" }}
        >
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>
            Alerts & Reminders
          </h2>
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
                <span
                  className="material-symbols-outlined flex-shrink-0 mt-0.5"
                  style={{ fontSize: 15, color: alert.color, fontVariationSettings: "'FILL' 1" }}
                >
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
      <div
        className="rounded-xl border p-4"
        style={{ background: "#fff", borderColor: "#E5E7EB" }}
      >
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
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 17, color: action.color, fontVariationSettings: "'FILL' 1" }}
              >
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
