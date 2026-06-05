"use client";

import { useState, useEffect } from "react";

interface LedgerOption {
  id: string;
  name: string;
  openingBalance: number;
  openingType: string;
  group: { name: string; nature: string };
}

interface VoucherLine {
  id: string;
  type: string;
  amount: number;
  narration: string | null;
}

interface Voucher {
  id: string;
  voucherNo: string;
  date: string;
  narration: string | null;
  totalAmount: number;
  voucherType: string;
  lines: VoucherLine[];
}

interface TxRow {
  date: string;
  voucherNo: string;
  particulars: string;
  type: string;
  amount: number;
  balance: number;
  balanceType: string;
}

function fmt(n: number) { return "₹" + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 }); }

function getThisMonthFrom() {
  const d = new Date(); d.setDate(1); return d.toISOString().split("T")[0];
}
function getToday() { return new Date().toISOString().split("T")[0]; }

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

export default function LedgerReportPage() {
  const [ledgers, setLedgers] = useState<LedgerOption[]>([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const [dateFrom, setDateFrom] = useState(getThisMonthFrom);
  const [dateTo, setDateTo] = useState(getToday);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLedgers, setLoadingLedgers] = useState(true);

  useEffect(() => {
    fetch("/api/accura/ledgers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setLedgers(data); })
      .catch(() => {})
      .finally(() => setLoadingLedgers(false));
  }, []);

  useEffect(() => {
    if (!selectedLedgerId) return;
    async function fetchVouchers() {
      setLoading(true);
      try {
        const res = await fetch(`/api/accura/vouchers?from=${dateFrom}&to=${dateTo}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter vouchers that have a line for this ledger
          const filtered = data.filter((v: Voucher) =>
            v.lines?.some((l) => (l as unknown as { ledger?: { id: string } }).ledger?.id === selectedLedgerId ||
              (l as unknown as { ledgerId?: string }).ledgerId === selectedLedgerId)
          );
          setVouchers(filtered);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchVouchers();
  }, [selectedLedgerId, dateFrom, dateTo]);

  const selectedLedger = ledgers.find((l) => l.id === selectedLedgerId);

  // Build running balance rows
  const openingBalance = selectedLedger?.openingBalance ?? 0;
  const openingType = selectedLedger?.openingType ?? "Dr";
  let runningBalance = openingType === "Dr" ? openingBalance : -openingBalance;

  const txRows: TxRow[] = vouchers.map((v) => {
    const line = v.lines?.find(
      (l) =>
        (l as unknown as { ledger?: { id: string } }).ledger?.id === selectedLedgerId ||
        (l as unknown as { ledgerId?: string }).ledgerId === selectedLedgerId
    );
    const lineType = line?.type ?? "Dr";
    const lineAmount = line?.amount ?? v.totalAmount;
    const delta = lineType === "Dr" ? lineAmount : -lineAmount;
    runningBalance += delta;
    const balAbs = Math.abs(runningBalance);
    const balType = runningBalance >= 0 ? "Dr" : "Cr";
    return {
      date: v.date?.split("T")[0] ?? "",
      voucherNo: v.voucherNo,
      particulars: v.narration ?? v.voucherType,
      type: lineType,
      amount: lineAmount,
      balance: balAbs,
      balanceType: balType,
    };
  });

  const closingBalance = runningBalance;
  const closingType = closingBalance >= 0 ? "Dr" : "Cr";

  function exportCSV() {
    const rows = [
      "Date,Voucher No,Particulars,Dr/Cr,Amount,Balance,Balance Type",
      `Opening Balance,,,,,${openingBalance},${openingType}`,
      ...txRows.map((r) => `${r.date},${r.voucherNo},"${r.particulars}",${r.type},${r.amount},${r.balance},${r.balanceType}`),
      `Closing Balance,,,,,${Math.abs(closingBalance)},${closingType}`,
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger-${selectedLedger?.name ?? "report"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif", background: "#F8FAFC", minHeight: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Ledger Report</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · Running balance format</p>
        </div>
        {selectedLedgerId && txRows.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-xl border p-4 mb-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
              Select Ledger
            </label>
            {loadingLedgers ? (
              <div className="h-9 rounded-md animate-pulse" style={{ background: "#F3F4F6" }} />
            ) : (
              <select
                value={selectedLedgerId}
                onChange={(e) => setSelectedLedgerId(e.target.value)}
                className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
                style={{ borderColor: "#E5E7EB", color: selectedLedgerId ? "#111827" : "#9CA3AF" }}
              >
                <option value="">-- Select a ledger --</option>
                {ledgers.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.group?.name})</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
              style={{ borderColor: "#E5E7EB", color: "#111827" }}
            />
          </div>
        </div>
      </div>

      {/* Ledger account */}
      {!selectedLedgerId ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined mb-3" style={{ fontSize: 48, color: "#E5E7EB" }}>menu_book</span>
          <p className="text-[14px] font-medium" style={{ color: "#6B7280" }}>Select a ledger to view its account.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          {/* Ledger title */}
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
            <div>
              <h2 className="text-[15px] font-bold" style={{ color: "#111827" }}>{selectedLedger?.name}</h2>
              <p className="text-[11px]" style={{ color: "#6B7280" }}>{selectedLedger?.group?.name} · {dateFrom} to {dateTo}</p>
            </div>
            <div className="text-right">
              <div className="text-[11px]" style={{ color: "#6B7280" }}>Opening Balance</div>
              <div className="text-[15px] font-bold font-mono" style={{ color: "#111827" }}>
                {fmt(openingBalance)} <span className="text-[12px] font-normal">{openingType}</span>
              </div>
            </div>
          </div>

          {/* Transactions table */}
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Date</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Voucher No</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Particulars</th>
                <th className="text-center px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Dr/Cr</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Amount</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : txRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <span className="material-symbols-outlined mb-2 block" style={{ fontSize: 36, color: "#E5E7EB" }}>receipt_long</span>
                    <p className="text-[13px]" style={{ color: "#9CA3AF" }}>No transactions found for this period.</p>
                  </td>
                </tr>
              ) : (
                txRows.map((row, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: "#F3F4F6" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "#6B7280" }}>{row.date}</td>
                    <td className="px-4 py-3 font-mono text-[12px]" style={{ color: "#374151" }}>{row.voucherNo}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: "#111827" }}>{row.particulars}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: row.type === "Dr" ? "#ECFDF5" : "#FEF2F2",
                          color: row.type === "Dr" ? "#059669" : "#DC2626",
                        }}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono" style={{ color: "#111827" }}>{fmt(row.amount)}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium">
                      <span style={{ color: row.balanceType === "Dr" ? "#059669" : "#DC2626" }}>
                        {fmt(row.balance)} <span className="text-[11px]">{row.balanceType}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Closing balance footer */}
          {!loading && (
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
              <span className="text-[13px] font-bold" style={{ color: "#111827" }}>Closing Balance</span>
              <span className="font-bold font-mono text-[15px]" style={{ color: closingType === "Dr" ? "#059669" : "#DC2626" }}>
                {fmt(closingBalance)} <span className="text-[12px] font-normal">{closingType}</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
