"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "smart-entry" | "scanner" | "anomaly";

const anomalies = [
  { id: 1, type: "Duplicate Entry", severity: "high" as const, desc: "Payment voucher PMT/25-26/089 appears to be a duplicate of PMT/25-26/082 — same party, same amount (₹54,000), 3 days apart.", ledger: "Sakthi Transport", amount: 54000 },
  { id: 2, type: "Unusual Amount", severity: "medium" as const, desc: "CFS Charges voucher on Jun 12 is 2.4× the average monthly CFS spend. Verify against invoice.", ledger: "CFS Charges", amount: 196000 },
  { id: 3, type: "Missing GSTIN", severity: "low" as const, desc: "Sales invoice INV/25-26/071 has party GSTIN but no corresponding GSTR-1 entry was generated. Check GST settings.", ledger: "Global Impex Pvt Ltd", amount: 50000 },
];

const smartEntryResult = {
  type: "Payment Voucher",
  date: "2026-06-14",
  party: "Apollo World Shipping",
  amount: 74000,
  ledger: "Apollo World Shipping (Sundry Creditors)",
  payFrom: "HDFC Bank CC",
  narration: "Being payment against bill APL/2026/0892 for shipping charges",
};

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function AIPage() {
  const [tab, setTab] = useState<Tab>("smart-entry");
  const [nlpQuery, setNlpQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [analysing, setAnalysing] = useState(false);

  const handleNLP = () => {
    if (!nlpQuery.trim()) return;
    setAnalysing(true);
    setTimeout(() => { setAnalysing(false); setShowResult(true); }, 1400);
  };

  const tabs = [
    { id: "smart-entry" as Tab, label: "Smart Entry", icon: "auto_awesome" },
    { id: "scanner" as Tab, label: "Document Scanner", icon: "document_scanner" },
    { id: "anomaly" as Tab, label: "Anomaly Detection", icon: "policy" },
  ];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0E7490, #7C3AED)" }}>
          <span className="material-symbols-outlined text-white" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>AI Tools</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Powered by Accura AI</p>
        </div>
      </div>

      <div className="flex rounded-lg border overflow-hidden mb-5 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-medium transition-colors"
            style={{ background: tab === t.id ? "#0E7490" : "#fff", color: tab === t.id ? "#fff" : "#6B7280" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {tab === "smart-entry" && (
          <div className="max-w-2xl">
            <div className="rounded-xl border p-5 mb-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <h2 className="text-sm font-semibold mb-2" style={{ color: "#111827" }}>Natural Language Entry</h2>
              <p className="text-[12px] mb-4" style={{ color: "#6B7280" }}>Describe the transaction in plain English and AI will create the voucher for you.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Paid Apollo World Shipping ₹74,000 from HDFC for freight charges on Jun 14"
                  value={nlpQuery}
                  onChange={(e) => { setNlpQuery(e.target.value); setShowResult(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleNLP()}
                  className="flex-1 px-4 py-2.5 rounded-lg border text-[13px] outline-none"
                  style={{ borderColor: "#E5E7EB", color: "#111827" }}
                />
                <button onClick={handleNLP} disabled={!nlpQuery.trim() || analysing}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-60 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #0E7490, #7C3AED)" }}>
                  {analysing ? (
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>refresh</span>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
                  )}
                  {analysing ? "Analysing..." : "Parse"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#A5F3FC" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#0E7490", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-[13px] font-semibold" style={{ color: "#0E7490" }}>Voucher detected — review and save</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    {Object.entries(smartEntryResult).map(([k, v]) => (
                      <div key={k}>
                        <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "#9CA3AF" }}>{k.replace(/([A-Z])/g, " $1").trim()}</div>
                        <div className="font-medium" style={{ color: "#111827" }}>{k === "amount" ? fmt(v as number) : v as string}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 rounded-lg text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>
                      Save as Payment Voucher
                    </button>
                    <button onClick={() => setShowResult(false)} className="px-4 py-2 rounded-lg text-[13px] border" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>
                      Edit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {tab === "scanner" && (
          <div className="max-w-xl">
            <div className="rounded-xl border p-10 text-center" style={{ background: "#fff", borderColor: "#E5E7EB", borderStyle: "dashed" }}>
              <span className="material-symbols-outlined mb-3 block" style={{ fontSize: 48, color: "#9CA3AF" }}>document_scanner</span>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#111827" }}>Upload Invoice / Bill</h3>
              <p className="text-[13px] mb-5" style={{ color: "#6B7280" }}>AI extracts party, amount, GST, and date from PDF or image invoices and creates the voucher automatically.</p>
              <button className="px-6 py-3 rounded-lg text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>
                Upload Document
              </button>
              <div className="mt-4 text-[11px]" style={{ color: "#9CA3AF" }}>Supports: PDF, JPG, PNG, HEIC</div>
            </div>
          </div>
        )}

        {tab === "anomaly" && (
          <div className="space-y-3">
            <div className="rounded-xl border p-4 flex items-start gap-3 mb-2" style={{ background: "#F5F3FF", borderColor: "#DDD6FE" }}>
              <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 18, color: "#7C3AED", fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: "#7C3AED" }}>AI Anomaly Scan Complete</div>
                <div className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>Scanned 248 vouchers · {anomalies.length} issues found · Last run: Today 9:00 AM</div>
              </div>
            </div>

            {anomalies.map((a) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: a.id * 0.05 }}
                className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined mt-0.5" style={{
                      fontSize: 18,
                      color: a.severity === "high" ? "#DC2626" : a.severity === "medium" ? "#D97706" : "#0E7490",
                      fontVariationSettings: "'FILL' 1"
                    }}>
                      {a.severity === "high" ? "error" : a.severity === "medium" ? "warning" : "info"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>{a.type}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide" style={{
                          background: a.severity === "high" ? "#FEF2F2" : a.severity === "medium" ? "#FFFBEB" : "#ECFEFF",
                          color: a.severity === "high" ? "#DC2626" : a.severity === "medium" ? "#D97706" : "#0E7490",
                        }}>{a.severity}</span>
                      </div>
                      <p className="text-[12px]" style={{ color: "#6B7280" }}>{a.desc}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px]" style={{ color: "#9CA3AF" }}>
                        <span>{a.ledger}</span>
                        <span className="font-mono">{fmt(a.amount)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[12px] px-3 py-1.5 rounded-md border hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
                    Review
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
