"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ViewMode = "grouped" | "detailed";

interface TBEntry {
  group: string;
  ledger: string;
  amount: number;
  side: "Dr" | "Cr";
  isGroup?: boolean;
}

const tbData: TBEntry[] = [
  // DEBIT side
  { group: "Fixed Assets",      ledger: "Fixed Assets",         amount: 320000,  side: "Dr", isGroup: true },
  { group: "Fixed Assets",      ledger: "Computers & Equipment", amount: 220000, side: "Dr" },
  { group: "Fixed Assets",      ledger: "Office Furniture",      amount: 100000, side: "Dr" },

  { group: "Current Assets",    ledger: "Cash-in-Hand",          amount: 0,       side: "Dr", isGroup: true },
  { group: "Current Assets",    ledger: "Cash",                  amount: 124800,  side: "Dr" },
  { group: "Current Assets",    ledger: "HDFC Bank CC",          amount: 1230800, side: "Dr" },
  { group: "Current Assets",    ledger: "SBI Current Account",   amount: 312400,  side: "Dr" },
  { group: "Current Assets",    ledger: "Ravi Exports Pvt Ltd",  amount: 96000,   side: "Dr" },
  { group: "Current Assets",    ledger: "HDFC Traders",          amount: 48000,   side: "Dr" },
  { group: "Current Assets",    ledger: "Global Impex Pvt Ltd",  amount: 50000,   side: "Dr" },

  { group: "Direct Expenses",   ledger: "Direct Expenses",       amount: 0,       side: "Dr", isGroup: true },
  { group: "Direct Expenses",   ledger: "CFS Charges",           amount: 82000,   side: "Dr" },
  { group: "Direct Expenses",   ledger: "Transport Charges",     amount: 54000,   side: "Dr" },
  { group: "Direct Expenses",   ledger: "Steamer Freight",       amount: 38000,   side: "Dr" },

  { group: "Indirect Expenses", ledger: "Indirect Expenses",     amount: 0,       side: "Dr", isGroup: true },
  { group: "Indirect Expenses", ledger: "Office Rent",           amount: 28000,   side: "Dr" },
  { group: "Indirect Expenses", ledger: "Staff Salary",          amount: 144000,  side: "Dr" },
  { group: "Indirect Expenses", ledger: "Software Subscription", amount: 18200,   side: "Dr" },
  { group: "Indirect Expenses", ledger: "Telephone & Internet",  amount: 8400,    side: "Dr" },
  { group: "Indirect Expenses", ledger: "Depreciation",          amount: 12000,   side: "Dr" },

  // CREDIT side
  { group: "Capital Account",   ledger: "Capital Account",       amount: 800000,  side: "Cr", isGroup: true },
  { group: "Capital Account",   ledger: "Capital Account",       amount: 800000,  side: "Cr" },

  { group: "Reserves & Surplus",ledger: "Reserves & Surplus",    amount: 0,       side: "Cr", isGroup: true },
  { group: "Reserves & Surplus",ledger: "Retained Earnings",     amount: 177800,  side: "Cr" },

  { group: "Loans (Liability)", ledger: "Loans (Liability)",     amount: 0,       side: "Cr", isGroup: true },
  { group: "Loans (Liability)", ledger: "Term Loan - HDFC",      amount: 250000,  side: "Cr" },

  { group: "Sundry Creditors",  ledger: "Sundry Creditors",      amount: 0,       side: "Cr", isGroup: true },
  { group: "Sundry Creditors",  ledger: "Apollo World Shipping",  amount: 74000,   side: "Cr" },
  { group: "Sundry Creditors",  ledger: "Sakthi Transport",      amount: 50000,   side: "Cr" },

  { group: "Duties & Taxes",    ledger: "Duties & Taxes",        amount: 0,       side: "Cr", isGroup: true },
  { group: "Duties & Taxes",    ledger: "CGST Payable",          amount: 31070,   side: "Cr" },
  { group: "Duties & Taxes",    ledger: "SGST Payable",          amount: 31070,   side: "Cr" },
  { group: "Duties & Taxes",    ledger: "TDS Payable (194C)",    amount: 8200,    side: "Cr" },

  { group: "Sales Accounts",    ledger: "Sales Accounts",        amount: 0,       side: "Cr", isGroup: true },
  { group: "Sales Accounts",    ledger: "Ocean Freight Income",  amount: 418000,  side: "Cr" },
  { group: "Sales Accounts",    ledger: "Air Freight Income",    amount: 88000,   side: "Cr" },

  { group: "Direct Income",     ledger: "Direct Income",         amount: 0,       side: "Cr", isGroup: true },
  { group: "Direct Income",     ledger: "Documentation Charges", amount: 12000,   side: "Cr" },

  { group: "Indirect Income",   ledger: "Indirect Income",       amount: 0,       side: "Cr", isGroup: true },
  { group: "Indirect Income",   ledger: "Miscellaneous Income",  amount: 36000,   side: "Cr" },

  { group: "Provisions",        ledger: "Provisions",            amount: 0,       side: "Cr", isGroup: true },
  { group: "Provisions",        ledger: "Provision for Tax",     amount: 18000,   side: "Cr" },
  { group: "Provisions",        ledger: "Salary Payable",        amount: 72360,   side: "Cr" },
];

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// Group data for grouped view
interface GroupSummary {
  group: string;
  total: number;
  side: "Dr" | "Cr";
  entries: TBEntry[];
}

function buildGrouped(side: "Dr" | "Cr"): GroupSummary[] {
  const sideData = tbData.filter((e) => e.side === side && !e.isGroup);
  const groups: Record<string, GroupSummary> = {};
  sideData.forEach((e) => {
    if (!groups[e.group]) {
      groups[e.group] = { group: e.group, total: 0, side, entries: [] };
    }
    groups[e.group].total += e.amount;
    groups[e.group].entries.push(e);
  });
  return Object.values(groups);
}

export default function TrialBalancePage() {
  const [view, setView] = useState<ViewMode>("grouped");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const drGroups = buildGrouped("Dr");
  const crGroups = buildGrouped("Cr");
  const totalDr = drGroups.reduce((s, g) => s + g.total, 0);
  const totalCr = crGroups.reduce((s, g) => s + g.total, 0);

  const maxRows = Math.max(drGroups.length, crGroups.length);

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Trial Balance</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>As at 30 June 2026 · Navkar Freight Co.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] cursor-pointer" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#6B7280" }}>calendar_month</span>
            <span style={{ color: "#374151" }}>30 Jun 2026</span>
          </div>
          {/* View toggle */}
          <div className="flex rounded-md border overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
            {(["grouped", "detailed"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-1.5 text-[12px] font-medium capitalize transition-colors"
                style={{
                  background: view === v ? "#0E7490" : "#fff",
                  color: view === v ? "#fff" : "#6B7280",
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          {/* Export buttons */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12px] hover:bg-gray-50" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
            PDF
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12px] hover:bg-gray-50" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>table_view</span>
            Excel
          </button>
        </div>
      </div>

      {/* Totals banner */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 rounded-lg p-3 border flex items-center justify-between" style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}>
          <span className="text-[12px] font-medium" style={{ color: "#059669" }}>Total Debit</span>
          <span className="text-lg font-bold font-mono" style={{ color: "#059669" }}>{fmt(totalDr)}</span>
        </div>
        <div className="flex-1 rounded-lg p-3 border flex items-center justify-between" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
          <span className="text-[12px] font-medium" style={{ color: "#DC2626" }}>Total Credit</span>
          <span className="text-lg font-bold font-mono" style={{ color: "#DC2626" }}>{fmt(totalCr)}</span>
        </div>
        <div className="rounded-lg p-3 border flex items-center gap-2" style={{ background: totalDr === totalCr ? "#ECFDF5" : "#FEF2F2", borderColor: totalDr === totalCr ? "#A7F3D0" : "#FECACA" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: totalDr === totalCr ? "#059669" : "#DC2626", fontVariationSettings: "'FILL' 1" }}>
            {totalDr === totalCr ? "check_circle" : "error"}
          </span>
          <span className="text-[12px] font-medium" style={{ color: totalDr === totalCr ? "#059669" : "#DC2626" }}>
            {totalDr === totalCr ? "Balanced" : "Difference: " + fmt(Math.abs(totalDr - totalCr))}
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* DEBIT side */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <div className="px-4 py-2.5 border-b" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
            <h3 className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "#059669" }}>Debit</h3>
          </div>
          <table className="w-full text-[13px]">
            <tbody>
              {drGroups.map((grp, i) => (
                <motion.tbody key={grp.group} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  {/* Group header row */}
                  <tr
                    className="cursor-pointer border-b"
                    style={{ background: "#F9FAFB", borderColor: "#F3F4F6" }}
                    onClick={() => toggleGroup("Dr-" + grp.group)}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#9CA3AF" }}>
                          {expandedGroups["Dr-" + grp.group] ? "expand_more" : "chevron_right"}
                        </span>
                        <span className="font-semibold text-[12px]" style={{ color: "#374151" }}>{grp.group}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-semibold" style={{ color: "#059669" }}>
                      {fmt(grp.total)}
                    </td>
                  </tr>
                  {/* Detail rows */}
                  {view === "detailed" || expandedGroups["Dr-" + grp.group] ? grp.entries.map((e) => (
                    <tr
                      key={e.ledger}
                      className="border-b cursor-pointer"
                      style={{ borderColor: "#F9FAFB" }}
                      onMouseEnter={(el) => ((el.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                      onMouseLeave={(el) => ((el.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <td className="px-8 py-1.5 text-[12px]" style={{ color: "#6B7280" }}>{e.ledger}</td>
                      <td
                        className="px-4 py-1.5 text-right text-[12px] font-mono cursor-pointer hover:text-teal-600"
                        style={{ color: "#374151" }}
                      >
                        {fmt(e.amount)}
                      </td>
                    </tr>
                  )) : null}
                </motion.tbody>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#F0FDF4", borderTop: "2px solid #A7F3D0" }}>
                <td className="px-4 py-2.5 font-bold text-[12px]" style={{ color: "#059669" }}>Total Dr</td>
                <td className="px-4 py-2.5 text-right font-mono font-bold text-[14px]" style={{ color: "#059669" }}>{fmt(totalDr)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* CREDIT side */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
          <div className="px-4 py-2.5 border-b" style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
            <h3 className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "#DC2626" }}>Credit</h3>
          </div>
          <table className="w-full text-[13px]">
            <tbody>
              {crGroups.map((grp, i) => (
                <motion.tbody key={grp.group} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <tr
                    className="cursor-pointer border-b"
                    style={{ background: "#F9FAFB", borderColor: "#F3F4F6" }}
                    onClick={() => toggleGroup("Cr-" + grp.group)}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: "#9CA3AF" }}>
                          {expandedGroups["Cr-" + grp.group] ? "expand_more" : "chevron_right"}
                        </span>
                        <span className="font-semibold text-[12px]" style={{ color: "#374151" }}>{grp.group}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-semibold" style={{ color: "#DC2626" }}>
                      {fmt(grp.total)}
                    </td>
                  </tr>
                  {view === "detailed" || expandedGroups["Cr-" + grp.group] ? grp.entries.map((e) => (
                    <tr
                      key={e.ledger + e.amount}
                      className="border-b cursor-pointer"
                      style={{ borderColor: "#F9FAFB" }}
                      onMouseEnter={(el) => ((el.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                      onMouseLeave={(el) => ((el.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <td className="px-8 py-1.5 text-[12px]" style={{ color: "#6B7280" }}>{e.ledger}</td>
                      <td
                        className="px-4 py-1.5 text-right text-[12px] font-mono cursor-pointer hover:text-teal-600"
                        style={{ color: "#374151" }}
                      >
                        {fmt(e.amount)}
                      </td>
                    </tr>
                  )) : null}
                </motion.tbody>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#FEF2F2", borderTop: "2px solid #FECACA" }}>
                <td className="px-4 py-2.5 font-bold text-[12px]" style={{ color: "#DC2626" }}>Total Cr</td>
                <td className="px-4 py-2.5 text-right font-mono font-bold text-[14px]" style={{ color: "#DC2626" }}>{fmt(totalCr)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="mt-3 text-[11px]" style={{ color: "#9CA3AF" }}>
        Click any group to expand · Click any amount to drill down to ledger transactions
      </p>
    </div>
  );
}
