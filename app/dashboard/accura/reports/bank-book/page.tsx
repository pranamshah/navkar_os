"use client";

import { useState, useEffect } from "react";

interface Voucher {
  id: string;
  voucherNo: string;
  date: string;
  narration: string | null;
  totalAmount: number;
  voucherType: string;
}

interface LedgerOption {
  id: string;
  name: string;
  group: { name: string; nature: string };
}

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 }); }

function getThisMonthFrom() {
  const d = new Date(); d.setDate(1); return d.toISOString().split("T")[0];
}
function getToday() { return new Date().toISOString().split("T")[0]; }

function exportCSV(receipts: Voucher[], payments: Voucher[]) {
  const rows: string[] = [
    "Type,Date,Voucher No,Narration,Amount",
    ...receipts.map((v) => `Receipt,${v.date?.split("T")[0] ?? ""},${v.voucherNo},"${v.narration ?? ""}",${v.totalAmount}`),
    ...payments.map((v) => `Payment,${v.date?.split("T")[0] ?? ""},${v.voucherNo},"${v.narration ?? ""}",${v.totalAmount}`),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bank-book.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b" style={{ borderColor: "#F3F4F6" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded animate-pulse" style={{ background: "#F3F4F6" }} />
        </td>
      ))}
    </tr>
  );
}

export default function BankBookPage() {
  const [dateFrom, setDateFrom] = useState(getThisMonthFrom);
  const [dateTo, setDateTo] = useState(getToday);
  const [selectedBank, setSelectedBank] = useState("");
  const [receipts, setReceipts] = useState<Voucher[]>([]);
  const [payments, setPayments] = useState<Voucher[]>([]);
  const [bankLedgers, setBankLedgers] = useState<LedgerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const openingBalance = 0; // TODO: from ledger opening balance

  useEffect(() => {
    fetch("/api/accura/ledgers")
      .then((r) => r.json())
      .then((data: LedgerOption[]) => {
        if (Array.isArray(data)) {
          setBankLedgers(data.filter((l) => ["Bank Accounts", "Cash-in-Hand"].includes(l.group?.name ?? "")));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [rRes, pRes] = await Promise.all([
          fetch(`/api/accura/vouchers?type=RECEIPT&from=${dateFrom}&to=${dateTo}`).then((r) => r.json()),
          fetch(`/api/accura/vouchers?type=PAYMENT&from=${dateFrom}&to=${dateTo}`).then((r) => r.json()),
        ]);
        setReceipts(Array.isArray(rRes) ? rRes : []);
        setPayments(Array.isArray(pRes) ? pRes : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dateFrom, dateTo]);

  const totalReceipts = receipts.reduce((s, v) => s + v.totalAmount, 0);
  const totalPayments = payments.reduce((s, v) => s + v.totalAmount, 0);
  const closingBalance = openingBalance + totalReceipts - totalPayments;

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif", background: "#F8FAFC", minHeight: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Bank Book</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · Bank transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border text-[13px] outline-none"
            style={{ borderColor: "#E5E7EB", color: "#111827" }}
          />
          <span className="text-[13px]" style={{ color: "#6B7280" }}>to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border text-[13px] outline-none"
            style={{ borderColor: "#E5E7EB", color: "#111827" }}
          />
          <button
            onClick={() => exportCSV(receipts, payments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Bank ledger filter */}
      <div className="rounded-xl border p-4 mb-5 flex items-center gap-3" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#0E7490" }}>account_balance_wallet</span>
        <div className="text-[13px] font-medium" style={{ color: "#374151" }}>Select bank ledger to filter:</div>
        <select
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          className="px-3 py-1.5 rounded-md border text-[13px] outline-none"
          style={{ borderColor: "#E5E7EB", color: "#111827", minWidth: 200 }}
        >
          <option value="">All bank / cash accounts</option>
          {bankLedgers.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        {selectedBank && (
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "#ECFEFF", color: "#0E7490" }}>
            Ledger filter coming soon
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>Opening Balance</div>
          <div className="text-xl font-bold font-mono" style={{ color: "#111827" }}>{fmt(openingBalance)}</div>
        </div>
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#D1FAE5" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>Total Receipts</div>
          {loading
            ? <div className="h-7 w-28 rounded animate-pulse" style={{ background: "#F3F4F6" }} />
            : <div className="text-xl font-bold font-mono" style={{ color: "#059669" }}>{fmt(totalReceipts)}</div>}
        </div>
        <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#FECACA" }}>
          <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>Total Payments</div>
          {loading
            ? <div className="h-7 w-28 rounded animate-pulse" style={{ background: "#F3F4F6" }} />
            : <div className="text-xl font-bold font-mono" style={{ color: "#DC2626" }}>{fmt(totalPayments)}</div>}
        </div>
      </div>

      {/* Two-column ledger */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="grid grid-cols-2 divide-x" style={{ divideColor: "#E5E7EB" }}>
          {/* Receipts column */}
          <div>
            <div className="px-4 py-2.5 border-b" style={{ background: "#ECFDF5", borderColor: "#D1FAE5" }}>
              <h3 className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "#059669" }}>Receipts (Dr)</h3>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <th className="text-left px-4 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Date</th>
                  <th className="text-left px-4 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Particulars</th>
                  <th className="text-right px-4 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
                  : receipts.length === 0
                    ? <tr><td colSpan={3} className="px-4 py-8 text-center text-[13px]" style={{ color: "#9CA3AF" }}>No receipts</td></tr>
                    : receipts.map((v) => (
                      <tr key={v.id} className="border-b" style={{ borderColor: "#F3F4F6" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                        <td className="px-4 py-2.5 text-[12px]" style={{ color: "#6B7280" }}>{v.date?.split("T")[0] ?? ""}</td>
                        <td className="px-4 py-2.5">
                          <div className="font-medium" style={{ color: "#111827" }}>{v.narration ?? "Receipt"}</div>
                          <div className="text-[11px] font-mono" style={{ color: "#9CA3AF" }}>{v.voucherNo}</div>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium" style={{ color: "#059669" }}>{fmt(v.totalAmount)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Payments column */}
          <div>
            <div className="px-4 py-2.5 border-b" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
              <h3 className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "#DC2626" }}>Payments (Cr)</h3>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <th className="text-left px-4 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Date</th>
                  <th className="text-left px-4 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Particulars</th>
                  <th className="text-right px-4 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
                  : payments.length === 0
                    ? <tr><td colSpan={3} className="px-4 py-8 text-center text-[13px]" style={{ color: "#9CA3AF" }}>No payments</td></tr>
                    : payments.map((v) => (
                      <tr key={v.id} className="border-b" style={{ borderColor: "#F3F4F6" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                        <td className="px-4 py-2.5 text-[12px]" style={{ color: "#6B7280" }}>{v.date?.split("T")[0] ?? ""}</td>
                        <td className="px-4 py-2.5">
                          <div className="font-medium" style={{ color: "#111827" }}>{v.narration ?? "Payment"}</div>
                          <div className="text-[11px] font-mono" style={{ color: "#9CA3AF" }}>{v.voucherNo}</div>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium" style={{ color: "#DC2626" }}>{fmt(v.totalAmount)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer totals */}
        <div className="grid grid-cols-2 border-t divide-x" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>Total Receipts</span>
            <span className="font-bold font-mono text-[14px]" style={{ color: "#059669" }}>{fmt(totalReceipts)}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>Total Payments</span>
            <span className="font-bold font-mono text-[14px]" style={{ color: "#DC2626" }}>{fmt(totalPayments)}</span>
          </div>
        </div>

        {/* Closing balance */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ background: "#EFF6FF", borderColor: "#BFDBFE" }}>
          <span className="text-[13px] font-semibold" style={{ color: "#1D4ED8" }}>Closing Balance (Dr)</span>
          <span className="font-bold font-mono text-[15px]" style={{ color: "#1D4ED8" }}>{fmt(closingBalance)}</span>
        </div>
      </div>
    </div>
  );
}
