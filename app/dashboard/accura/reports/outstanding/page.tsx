"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Tab = "receivables" | "payables";

interface OutstandingItem {
  party: string;
  ref: string;
  date: string;
  due: string;
  amount: number;
  age: number;
  status: "overdue" | "current";
}

interface Voucher {
  id: string;
  voucherNo: string;
  date: string;
  narration: string | null;
  totalAmount: number;
}

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function daysSince(dateStr: string): number {
  const due = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

function vouchersToOutstanding(vouchers: Voucher[]): OutstandingItem[] {
  return vouchers.map((v) => {
    const rawDate = v.date?.split("T")[0] ?? new Date().toISOString().split("T")[0];
    const due = addDays(rawDate, 30);
    const age = daysSince(due);
    return {
      party: v.narration ?? "Unknown",
      ref: v.voucherNo,
      date: rawDate,
      due,
      amount: v.totalAmount,
      age,
      status: age > 0 ? "overdue" : "current",
    };
  });
}

const ageBuckets = (age: number) => {
  if (age <= 0) return { label: "Not due", color: "#059669", bg: "#ECFDF5" };
  if (age <= 30) return { label: "1–30 days", color: "#D97706", bg: "#FFFBEB" };
  if (age <= 60) return { label: "31–60 days", color: "#DC2626", bg: "#FEF2F2" };
  return { label: "60+ days", color: "#7F1D1D", bg: "#FEE2E2" };
};

function SkeletonRow() {
  return (
    <tr className="border-b" style={{ borderColor: "#F3F4F6" }}>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded animate-pulse" style={{ background: "#F3F4F6", width: i === 5 ? "80px" : "100%" }} />
        </td>
      ))}
    </tr>
  );
}

export default function OutstandingPage() {
  const [tab, setTab] = useState<Tab>("receivables");
  const [receivables, setReceivables] = useState<OutstandingItem[]>([]);
  const [payables, setPayables] = useState<OutstandingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [salesRes, purchaseRes] = await Promise.all([
          fetch("/api/accura/vouchers?type=SALES").then((r) => r.json()),
          fetch("/api/accura/vouchers?type=PURCHASE").then((r) => r.json()),
        ]);
        setReceivables(Array.isArray(salesRes) ? vouchersToOutstanding(salesRes) : []);
        setPayables(Array.isArray(purchaseRes) ? vouchersToOutstanding(purchaseRes) : []);
      } catch (e) {
        console.error(e);
        setReceivables([]);
        setPayables([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const data = tab === "receivables" ? receivables : payables;
  const totalOutstanding = data.reduce((s, i) => s + i.amount, 0);
  const overdueTotal = data.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const partyCount = new Set(data.map((i) => i.party)).size;

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Outstanding</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · As on today</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>Export
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border overflow-hidden mb-5 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {(["receivables", "payables"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 text-[13px] font-medium transition-colors"
            style={{ background: tab === t ? "#0E7490" : "#fff", color: tab === t ? "#fff" : "#6B7280" }}>
            {t === "receivables" ? "Receivables (Debtors)" : "Payables (Creditors)"}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>Total Outstanding</div>
          {loading
            ? <div className="h-7 w-32 rounded animate-pulse mt-1" style={{ background: "#F3F4F6" }} />
            : <div className="text-xl font-bold font-mono" style={{ color: "#0E7490" }}>{fmt(totalOutstanding)}</div>}
        </div>
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#FECACA" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>Overdue Amount</div>
          {loading
            ? <div className="h-7 w-32 rounded animate-pulse mt-1" style={{ background: "#F3F4F6" }} />
            : <div className="text-xl font-bold font-mono" style={{ color: "#DC2626" }}>{fmt(overdueTotal)}</div>}
        </div>
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>No. of Parties</div>
          {loading
            ? <div className="h-7 w-16 rounded animate-pulse mt-1" style={{ background: "#F3F4F6" }} />
            : <div className="text-xl font-bold" style={{ color: "#111827" }}>{partyCount}</div>}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={tab} className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        {!loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="material-symbols-outlined mb-3" style={{ fontSize: 48, color: "#E5E7EB" }}>receipt_long</span>
            <p className="text-[14px] font-medium" style={{ color: "#6B7280" }}>No outstanding entries yet.</p>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Party</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Invoice Ref</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Date</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Due Date</th>
                <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Amount</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Age (Days)</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                : data.map((inv) => {
                    const bucket = ageBuckets(inv.age);
                    return (
                      <tr key={inv.ref} className="border-b" style={{ borderColor: "#F3F4F6" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                        <td className="px-4 py-3 font-medium" style={{ color: "#111827" }}>{inv.party}</td>
                        <td className="px-4 py-3 font-mono text-[12px]" style={{ color: "#374151" }}>{inv.ref}</td>
                        <td className="px-4 py-3" style={{ color: "#6B7280" }}>{inv.date}</td>
                        <td className="px-4 py-3" style={{ color: inv.status === "overdue" ? "#DC2626" : "#6B7280" }}>{inv.due}</td>
                        <td className="px-4 py-3 text-right font-mono font-medium" style={{ color: "#111827" }}>{fmt(inv.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono font-medium text-[12px]" style={{ color: bucket.color }}>
                            {inv.age > 0 ? `+${inv.age}` : inv.age}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: bucket.bg, color: bucket.color }}>
                            {bucket.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
            {!loading && data.length > 0 && (
              <tfoot>
                <tr style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
                  <td colSpan={4} className="px-4 py-3 font-semibold text-[13px]" style={{ color: "#111827" }}>Total</td>
                  <td className="px-4 py-3 text-right font-bold font-mono text-[14px]" style={{ color: "#0E7490" }}>{fmt(totalOutstanding)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </motion.div>
    </div>
  );
}
