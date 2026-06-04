"use client";

import { motion } from "framer-motion";

const bsData = {
  liabilities: [
    { group: "Capital Account", items: [
      { name: "Capital Account", amount: 800000 },
      { name: "Retained Earnings", amount: 177800 },
      { name: "Net Profit (Current Year)", amount: 524300 },
    ]},
    { group: "Loans (Liability)", items: [
      { name: "SBI Working Capital Loan", amount: 500000 },
    ]},
    { group: "Current Liabilities", items: [
      { name: "Apollo World Shipping (Creditor)", amount: 74000 },
      { name: "Sakthi Transport (Creditor)", amount: 50000 },
    ]},
    { group: "Duties & Taxes", items: [
      { name: "CGST Payable", amount: 31070 },
      { name: "SGST Payable", amount: 31070 },
      { name: "TDS Payable (194C)", amount: 8200 },
    ]},
  ],
  assets: [
    { group: "Fixed Assets", items: [
      { name: "Computer Equipment", amount: 120000 },
      { name: "Office Furniture", amount: 45000 },
      { name: "Less: Accumulated Depreciation", amount: -32000 },
    ]},
    { group: "Bank Accounts", items: [
      { name: "HDFC Bank CC", amount: 1230800 },
      { name: "SBI Current Account", amount: 312400 },
    ]},
    { group: "Cash-in-Hand", items: [
      { name: "Cash", amount: 124800 },
    ]},
    { group: "Sundry Debtors", items: [
      { name: "Ravi Exports Pvt Ltd", amount: 96000 },
      { name: "HDFC Traders", amount: 48000 },
      { name: "Global Impex Pvt Ltd", amount: 50000 },
    ]},
    { group: "Loans & Advances (Asset)", items: [
      { name: "Advance to Staff", amount: 20000 },
      { name: "Security Deposits", amount: 60000 },
    ]},
    { group: "Stock-in-Trade", items: [
      { name: "Closing Stock", amount: 0 },
    ]},
  ],
};

function fmt(n: number) {
  if (n < 0) return "(" + "₹" + Math.abs(n).toLocaleString("en-IN") + ")";
  return "₹" + n.toLocaleString("en-IN");
}

export default function BalanceSheetPage() {
  const totalLiab = bsData.liabilities.flatMap((g) => g.items).reduce((s, i) => s + i.amount, 0);
  const totalAssets = bsData.assets.flatMap((g) => g.items).reduce((s, i) => s + i.amount, 0);
  const balanced = Math.abs(totalLiab - totalAssets) < 1;

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Balance Sheet</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Navkar Freight Co. · As on 30 Jun 2026</p>
        </div>
        <div className="flex items-center gap-2">
          {balanced ? (
            <span className="flex items-center gap-1 text-[12px] px-2 py-1 rounded-md" style={{ background: "#ECFDF5", color: "#059669" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>Balanced
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[12px] px-2 py-1 rounded-md" style={{ background: "#FEF2F2", color: "#DC2626" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>Difference: {fmt(Math.abs(totalLiab - totalAssets))}
            </span>
          )}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>download</span>Export PDF
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          {/* Left: Liabilities */}
          <div>
            <div className="px-5 py-3 border-b font-semibold text-[12px] uppercase tracking-wide" style={{ background: "#FEF2F2", borderColor: "#E5E7EB", color: "#DC2626" }}>
              Liabilities
            </div>
            {bsData.liabilities.map((group) => (
              <div key={group.group}>
                <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#F9FAFB", color: "#9CA3AF" }}>{group.group}</div>
                {group.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center px-5 py-2.5 border-b text-[13px]" style={{ borderColor: "#F3F4F6" }}>
                    <span style={{ color: "#374151" }}>{item.name}</span>
                    <span className="font-mono font-medium" style={{ color: "#111827" }}>{fmt(item.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between items-center px-5 py-3 font-bold text-[14px] border-t" style={{ borderColor: "#E5E7EB", background: "#FEF2F2" }}>
              <span style={{ color: "#DC2626" }}>Total Liabilities</span>
              <span className="font-mono" style={{ color: "#DC2626" }}>{fmt(totalLiab)}</span>
            </div>
          </div>

          {/* Right: Assets */}
          <div>
            <div className="px-5 py-3 border-b font-semibold text-[12px] uppercase tracking-wide" style={{ background: "#ECFDF5", borderColor: "#E5E7EB", color: "#059669" }}>
              Assets
            </div>
            {bsData.assets.map((group) => (
              <div key={group.group}>
                <div className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#F9FAFB", color: "#9CA3AF" }}>{group.group}</div>
                {group.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center px-5 py-2.5 border-b text-[13px]" style={{ borderColor: "#F3F4F6" }}>
                    <span style={{ color: item.amount < 0 ? "#DC2626" : "#374151" }}>{item.name}</span>
                    <span className="font-mono font-medium" style={{ color: item.amount < 0 ? "#DC2626" : "#111827" }}>{fmt(item.amount)}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between items-center px-5 py-3 font-bold text-[14px] border-t" style={{ borderColor: "#E5E7EB", background: "#ECFDF5" }}>
              <span style={{ color: "#059669" }}>Total Assets</span>
              <span className="font-mono" style={{ color: "#059669" }}>{fmt(totalAssets)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
