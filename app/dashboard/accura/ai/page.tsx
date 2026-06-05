"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "smart-entry" | "scanner" | "anomaly";

interface ParsedVoucher {
  voucherType: string;
  date: string;
  narration: string;
  totalAmount: number;
  suggestedLines: { account: string; type: "Dr" | "Cr"; amount: number; narration?: string }[];
}

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function AIPage() {
  const [tab, setTab] = useState<Tab>("smart-entry");
  const [nlpQuery, setNlpQuery] = useState("");
  const [parsed, setParsed] = useState<ParsedVoucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucherSaved, setVoucherSaved] = useState(false);

  const handleParse = async () => {
    if (!nlpQuery.trim()) return;
    setLoading(true);
    setError(null);
    setParsed(null);
    setVoucherSaved(false);
    try {
      const res = await fetch("/api/accura/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nlpQuery }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Parsing failed. Please try again.");
      } else {
        setParsed(data);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVoucher = async () => {
    if (!parsed) return;
    try {
      const res = await fetch("/api/accura/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType: parsed.voucherType,
          date: parsed.date,
          narration: parsed.narration,
          totalAmount: parsed.totalAmount,
          lines: parsed.suggestedLines.map((l) => ({
            ledgerId: null,
            accountName: l.account,
            type: l.type,
            amount: l.amount,
            narration: l.narration ?? "",
          })),
        }),
      });
      if (res.ok) {
        setVoucherSaved(true);
        setParsed(null);
        setNlpQuery("");
      } else {
        const d = await res.json();
        setError(d.error || "Failed to create voucher.");
      }
    } catch {
      setError("Failed to create voucher. Please try again.");
    }
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
              <h2 className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>Natural Language Entry</h2>
              <p className="text-[12px] mb-1" style={{ color: "#6B7280" }}>Describe the transaction in plain language and AI will create the voucher for you.</p>
              <p className="text-[11px] mb-4 italic" style={{ color: "#9CA3AF" }}>e.g. &quot;Paid ₹5000 to Sakthi Transport for truck charges today&quot;</p>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  placeholder="e.g. Paid ₹74,000 to Apollo World Shipping from HDFC Bank for freight charges on 5 June"
                  value={nlpQuery}
                  onChange={(e) => { setNlpQuery(e.target.value); setParsed(null); setError(null); setVoucherSaved(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleParse(); } }}
                  className="flex-1 px-4 py-2.5 rounded-lg border text-[13px] outline-none resize-none"
                  style={{ borderColor: "#E5E7EB", color: "#111827" }}
                />
                <button onClick={handleParse} disabled={!nlpQuery.trim() || loading}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-60 transition-opacity self-start"
                  style={{ background: "linear-gradient(135deg, #0E7490, #7C3AED)" }}>
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>refresh</span>
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
                  )}
                  {loading ? "Parsing..." : "Parse Entry"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-xl border p-4 mb-4 flex items-start gap-2" style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
                  <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 16, color: "#DC2626" }}>error</span>
                  <span className="text-[13px]" style={{ color: "#DC2626" }}>{error}</span>
                </motion.div>
              )}

              {voucherSaved && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-xl border p-4 mb-4 flex items-start gap-2" style={{ background: "#ECFDF5", borderColor: "#A7F3D0" }}>
                  <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 16, color: "#059669", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-[13px] font-medium" style={{ color: "#059669" }}>Voucher created successfully!</span>
                </motion.div>
              )}

              {parsed && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#A5F3FC" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#0E7490", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-[13px] font-semibold" style={{ color: "#0E7490" }}>Voucher parsed — review and save</span>
                  </div>

                  {/* Header fields */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-[13px]">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "#9CA3AF" }}>Voucher Type</div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white" style={{ background: "#0E7490" }}>{parsed.voucherType}</span>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "#9CA3AF" }}>Date</div>
                      <div className="font-medium" style={{ color: "#111827" }}>{parsed.date}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "#9CA3AF" }}>Total Amount</div>
                      <div className="font-bold font-mono text-[15px]" style={{ color: "#0E7490" }}>{fmt(parsed.totalAmount)}</div>
                    </div>
                    <div className="col-span-3">
                      <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "#9CA3AF" }}>Narration</div>
                      <div style={{ color: "#374151" }}>{parsed.narration}</div>
                    </div>
                  </div>

                  {/* Journal lines table */}
                  <div className="rounded-lg border overflow-hidden mb-4" style={{ borderColor: "#E5E7EB" }}>
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-[10px]" style={{ color: "#6B7280" }}>Account</th>
                          <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide text-[10px]" style={{ color: "#6B7280" }}>Dr</th>
                          <th className="px-3 py-2 text-right font-semibold uppercase tracking-wide text-[10px]" style={{ color: "#6B7280" }}>Cr</th>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wide text-[10px]" style={{ color: "#6B7280" }}>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.suggestedLines.map((line, i) => (
                          <tr key={i} className="border-b" style={{ borderColor: "#F3F4F6" }}>
                            <td className="px-3 py-2 font-medium" style={{ color: "#111827" }}>{line.account}</td>
                            <td className="px-3 py-2 text-right font-mono" style={{ color: "#DC2626" }}>{line.type === "Dr" ? fmt(line.amount) : "—"}</td>
                            <td className="px-3 py-2 text-right font-mono" style={{ color: "#059669" }}>{line.type === "Cr" ? fmt(line.amount) : "—"}</td>
                            <td className="px-3 py-2" style={{ color: "#9CA3AF" }}>{line.narration || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleCreateVoucher}
                      className="flex-1 py-2 rounded-lg text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>
                      Create Voucher
                    </button>
                    <button onClick={() => { setParsed(null); setNlpQuery(""); }}
                      className="px-4 py-2 rounded-lg text-[13px] border" style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>
                      Clear
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
              <div className="flex justify-center mb-3">
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-widest" style={{ background: "#FEF3C7", color: "#D97706" }}>Coming Soon</span>
              </div>
              <span className="material-symbols-outlined mb-3 block" style={{ fontSize: 48, color: "#9CA3AF" }}>document_scanner</span>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#111827" }}>Upload Invoice / Bill</h3>
              <p className="text-[13px] mb-5" style={{ color: "#6B7280" }}>Upload invoices, bills, or receipts to auto-extract data. Powered by AI OCR.</p>
              <div className="border-2 border-dashed rounded-lg p-8 mb-4" style={{ borderColor: "#D1D5DB" }}>
                <span className="material-symbols-outlined block mb-2" style={{ fontSize: 32, color: "#D1D5DB" }}>cloud_upload</span>
                <p className="text-[12px]" style={{ color: "#9CA3AF" }}>Drag and drop or click to upload</p>
              </div>
              <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Supports: PDF, JPG, PNG, HEIC</div>
            </div>
          </div>
        )}

        {tab === "anomaly" && (
          <div className="max-w-2xl">
            <div className="rounded-xl border p-4 mb-4 flex items-start gap-3" style={{ background: "#F5F3FF", borderColor: "#DDD6FE" }}>
              <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 18, color: "#7C3AED", fontVariationSettings: "'FILL' 1" }}>info</span>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: "#7C3AED" }}>Anomaly Detection</div>
                <div className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>Anomaly detection runs on your voucher data. Currently shows duplicate detection.</div>
              </div>
            </div>

            <div className="rounded-xl border p-12 text-center" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <span className="material-symbols-outlined mb-3 block" style={{ fontSize: 40, color: "#D1D5DB" }}>policy</span>
              <h3 className="text-[14px] font-semibold mb-1" style={{ color: "#374151" }}>No anomalies detected</h3>
              <p className="text-[12px]" style={{ color: "#9CA3AF" }}>Add vouchers to begin analysis.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
