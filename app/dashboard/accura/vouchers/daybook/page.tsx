"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type VoucherType = "PAYMENT" | "RECEIPT" | "JOURNAL" | "SALES" | "PURCHASE" | "CONTRA" | "DEBIT_NOTE" | "CREDIT_NOTE";

interface VoucherLine {
  id: string;
  type: string;
  amount: number;
  ledger?: { id: string; name: string };
}

interface Voucher {
  id: string;
  date: string;
  voucherType: VoucherType;
  voucherNo: string;
  narration: string | null;
  totalAmount: number;
  lines: VoucherLine[];
}

const voucherTypeColors: Record<string, { text: string; bg: string; border: string }> = {
  PAYMENT:    { text: "#DC2626", bg: "#FEF2F2",  border: "#FECACA" },
  RECEIPT:    { text: "#059669", bg: "#ECFDF5",  border: "#A7F3D0" },
  JOURNAL:    { text: "#1E40AF", bg: "#F5F3FF",  border: "#DDD6FE" },
  SALES:      { text: "#0E7490", bg: "#ECFEFF",  border: "#A5F3FC" },
  PURCHASE:   { text: "#1E40AF", bg: "#FFFBEB",  border: "#FDE68A" },
  CONTRA:     { text: "#374151", bg: "#F3F4F6",  border: "#E5E7EB" },
  DEBIT_NOTE: { text: "#B45309", bg: "#FFF7ED",  border: "#FED7AA" },
  CREDIT_NOTE:{ text: "#0891B2", bg: "#F0FDFA",  border: "#99F6E4" },
};

const typeLabels: Record<string, string> = {
  PAYMENT: "Payment", RECEIPT: "Receipt", SALES: "Sales Invoice",
  JOURNAL: "Journal", PURCHASE: "Purchase", CONTRA: "Contra",
  DEBIT_NOTE: "Debit Note", CREDIT_NOTE: "Credit Note",
};

const voucherEditPaths: Record<string, string> = {
  PAYMENT: "/dashboard/accura/vouchers/payment",
  RECEIPT: "/dashboard/accura/vouchers/receipt",
  SALES: "/dashboard/accura/vouchers/sales",
  JOURNAL: "/dashboard/accura/vouchers/journal",
  PURCHASE: "/dashboard/accura/vouchers/purchase",
  CONTRA: "/dashboard/accura/vouchers/contra",
  DEBIT_NOTE: "/dashboard/accura/vouchers/debit-note",
  CREDIT_NOTE: "/dashboard/accura/vouchers/credit-note",
};

const allTypes: (string)[] = ["ALL", "PAYMENT", "RECEIPT", "SALES", "PURCHASE", "JOURNAL", "CONTRA", "DEBIT_NOTE", "CREDIT_NOTE"];

function today() { return new Date().toISOString().split("T")[0]; }
function firstOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}

function fmt(n: number) {
  if (!n) return "—";
  return "₹" + n.toLocaleString("en-IN");
}

function getPartyName(voucher: Voucher): string {
  if (!voucher.lines?.length) return "—";
  const line = voucher.lines.find((l) => l.type === "Dr") ?? voucher.lines[0];
  return line?.ledger?.name ?? "—";
}

export default function DayBookPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState(firstOfMonth());
  const [toDate, setToDate] = useState(today());
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ from: fromDate, to: toDate });
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      const res = await fetch(`/api/accura/vouchers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVouchers(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, typeFilter]);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this voucher? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/accura/vouchers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setVouchers((prev) => prev.filter((v) => v.id !== id));
      } else {
        const err = await res.json();
        alert(err.error ?? "Failed to delete");
      }
    } catch {
      alert("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (voucher: Voucher) => {
    const path = voucherEditPaths[voucher.voucherType];
    if (path) router.push(`${path}?id=${voucher.id}`);
  };

  const totalDr = vouchers.reduce((s, v) => {
    const drLines = v.lines?.filter((l) => l.type === "Dr") ?? [];
    return s + drLines.reduce((a, l) => a + l.amount, 0);
  }, 0);
  const totalCr = vouchers.reduce((s, v) => {
    const crLines = v.lines?.filter((l) => l.type === "Cr") ?? [];
    return s + crLines.reduce((a, l) => a + l.amount, 0);
  }, 0);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Day Book</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>All vouchers · filtered by date range</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range inputs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2 py-1.5 rounded-md border text-[13px] outline-none focus:border-[#0E7490]"
                style={{ borderColor: "#E5E7EB", color: "#374151" }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2 py-1.5 rounded-md border text-[13px] outline-none focus:border-[#0E7490]"
                style={{ borderColor: "#E5E7EB", color: "#374151" }}
              />
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard/accura/vouchers")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white"
            style={{ background: "#0E7490" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Voucher
          </button>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {allTypes.map((t) => {
          const isActive = typeFilter === t;
          const c = t === "ALL" ? null : voucherTypeColors[t];
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1 rounded-full text-[12px] font-medium border transition-all"
              style={{
                background: isActive ? (c?.bg || "#111827") : "#fff",
                color: isActive ? (c?.text || "#fff") : "#6B7280",
                borderColor: isActive ? (c?.border || "#111827") : "#E5E7EB",
              }}
            >
              {t === "ALL" ? "All" : typeLabels[t] ?? t}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-[13px]" style={{ color: "#6B7280" }}>
          <span className="material-symbols-outlined animate-spin mr-2" style={{ fontSize: 18 }}>progress_activity</span>
          Loading vouchers…
        </div>
      )}

      {/* Empty state */}
      {!loading && vouchers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#D1D5DB" }}>receipt_long</span>
          <p className="text-[14px] font-medium" style={{ color: "#374151" }}>No vouchers found</p>
          <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>Try adjusting the date range or type filter</p>
        </div>
      )}

      {/* Table */}
      {!loading && vouchers.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                {["Date", "Type", "Number", "Party / Account", "Dr Amount", "Cr Amount", "Narration", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide ${i >= 4 && i <= 5 ? "text-right" : "text-left"}`}
                    style={{ color: "#6B7280" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v, i) => {
                const tc = voucherTypeColors[v.voucherType] ?? voucherTypeColors.JOURNAL;
                const drAmt = v.lines?.filter((l) => l.type === "Dr").reduce((s, l) => s + l.amount, 0) ?? 0;
                const crAmt = v.lines?.filter((l) => l.type === "Cr").reduce((s, l) => s + l.amount, 0) ?? 0;
                const partyName = getPartyName(v);
                const displayDate = new Date(v.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                return (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b group"
                    style={{ borderColor: "#F3F4F6" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <td className="px-4 py-2.5 text-[12px]" style={{ color: "#6B7280" }}>{displayDate}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                        {typeLabels[v.voucherType] ?? v.voucherType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: "#374151" }}>{v.voucherNo}</td>
                    <td className="px-4 py-2.5 font-medium" style={{ color: "#111827" }}>{partyName}</td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: drAmt ? "#059669" : "#D1D5DB" }}>{fmt(drAmt)}</td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: crAmt ? "#DC2626" : "#D1D5DB" }}>{fmt(crAmt)}</td>
                    <td className="px-4 py-2.5 text-[12px] max-w-xs truncate" style={{ color: "#6B7280" }}>{v.narration ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(v)}
                          className="p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit voucher"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#0E7490" }}>edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          disabled={deletingId === v.id}
                          className="p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete voucher"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#DC2626" }}>
                            {deletingId === v.id ? "progress_activity" : "delete"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: "#F9FAFB", borderTop: "2px solid #E5E7EB" }}>
                <td colSpan={4} className="px-4 py-2.5 text-[12px] font-semibold" style={{ color: "#374151" }}>
                  Total ({vouchers.length} vouchers)
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-bold" style={{ color: "#059669" }}>
                  {fmt(totalDr)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-bold" style={{ color: "#DC2626" }}>
                  {fmt(totalCr)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
