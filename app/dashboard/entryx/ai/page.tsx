"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const ACCENT = "#1E40AF";

type TabId = "docai" | "duty" | "fta";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "docai", label: "DocAI", icon: "document_scanner" },
  { id: "duty", label: "Duty Estimator", icon: "calculate" },
  { id: "fta", label: "FTA Checker", icon: "public" },
];

const currencies = ["USD", "EUR", "GBP", "JPY", "CNY", "AUD", "SGD"];
const countries = [
  "China", "USA", "Germany", "Japan", "South Korea", "Singapore", "UAE",
  "Bangladesh", "Vietnam", "Thailand", "Malaysia", "Indonesia",
];

export default function EntryXAiPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) ?? "docai";
  const [tab, setTab] = useState<TabId>(initialTab);

  // DocAI state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docDragging, setDocDragging] = useState(false);

  // Duty Estimator state
  const [hsCode, setHsCode] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [invoiceValue, setInvoiceValue] = useState("");
  const [incoterms, setIncoterms] = useState("CIF");

  // FTA state
  const [ftaHsCode, setFtaHsCode] = useState("");
  const [ftaOrigin, setFtaOrigin] = useState("");

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: "#111827" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: ACCENT }}>auto_awesome</span>
          AI Tools
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
          DocAI document extraction · Duty estimation · FTA eligibility checker
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: "#E5E7EB" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors"
            style={{
              borderColor: tab === t.id ? ACCENT : "transparent",
              color: tab === t.id ? ACCENT : "#6B7280",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* DocAI Tab */}
      {tab === "docai" && (
        <div className="grid grid-cols-2 gap-5">
          {/* Upload Box */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDocDragging(true); }}
              onDragLeave={() => setDocDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDocDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) setDocFile(file);
              }}
              className="rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center transition-colors"
              style={{
                borderColor: docDragging ? ACCENT : "#D1D5DB",
                background: docDragging ? "#F0FDF4" : "#F9FAFB",
                minHeight: 280,
                cursor: "pointer",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: docFile ? ACCENT : "#9CA3AF" }}>
                {docFile ? "check_circle" : "upload_file"}
              </span>
              {docFile ? (
                <>
                  <div className="text-[14px] font-semibold mt-3" style={{ color: "#111827" }}>{docFile.name}</div>
                  <div className="text-[12px] mt-1" style={{ color: ACCENT }}>File ready for analysis</div>
                </>
              ) : (
                <>
                  <div className="text-[15px] font-bold mt-3" style={{ color: "#111827" }}>
                    Drag &amp; drop document here
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: "#6B7280" }}>
                    Commercial Invoice, Packing List · PDF, JPG, PNG
                  </div>
                  <div className="flex gap-1 mt-4">
                    {["CI", "PL", "BE", "AWB", "BL"].map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: "#fff", color: ACCENT, border: "1px solid #BBF7D0" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <label
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-md border text-[13px] font-medium cursor-pointer"
                style={{ borderColor: "#E5E7EB", color: "#374151" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>attach_file</span>
                Choose File
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => e.target.files && setDocFile(e.target.files[0])}
                />
              </label>
              <button
                className="flex-1 px-4 py-2 rounded-md text-[13px] font-bold text-white"
                style={{ background: ACCENT, opacity: docFile ? 1 : 0.5 }}
                disabled={!docFile}
              >
                <span className="material-symbols-outlined inline-block align-middle mr-1" style={{ fontSize: 15 }}>
                  document_scanner
                </span>
                Analyse Document
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Extracted Data</h3>
            {!docFile ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>
                  document_scanner
                </span>
                <p className="text-[13px] font-medium" style={{ color: "#1a1c1c" }}>No document uploaded yet</p>
                <p className="text-[12px] mt-1" style={{ color: "#7e7576" }}>
                  Upload a document to extract data
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span
                  className="material-symbols-outlined mb-3 animate-spin"
                  style={{ fontSize: 40, color: ACCENT }}
                >
                  sync
                </span>
                <p className="text-[13px] font-medium" style={{ color: "#1a1c1c" }}>
                  Click &quot;Analyse Document&quot; to extract fields
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Duty Estimator Tab */}
      {tab === "duty" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Calculate Import Duty</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "#374151" }}>HS Code *</label>
                <input
                  type="text"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
                  style={{ borderColor: "#E5E7EB" }}
                  placeholder="e.g. 85176290"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "#374151" }}>Country of Origin *</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "#374151" }}>Invoice Value (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={invoiceValue}
                  onChange={(e) => setInvoiceValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
                  style={{ borderColor: "#E5E7EB" }}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "#374151" }}>Incoterms</label>
                <select
                  value={incoterms}
                  onChange={(e) => setIncoterms(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  {["CIF", "FOB", "CFR", "EXW", "DDP", "DAP"].map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <button
                className="w-full px-4 py-2.5 rounded-md text-[13px] font-bold text-white"
                style={{ background: ACCENT }}
              >
                <span className="material-symbols-outlined inline-block align-middle mr-1" style={{ fontSize: 15 }}>calculate</span>
                Calculate Duty
              </button>
            </div>
          </div>

          {/* Duty Result */}
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>Duty Waterfall</h3>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>calculate</span>
              <p className="text-[13px] font-medium" style={{ color: "#1a1c1c" }}>No calculation yet</p>
              <p className="text-[12px] mt-1" style={{ color: "#7e7576" }}>
                Fill in HS code, origin and value to estimate duties
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FTA Checker Tab */}
      {tab === "fta" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#111827" }}>Check FTA Eligibility</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "#374151" }}>HS Code *</label>
                <input
                  type="text"
                  value={ftaHsCode}
                  onChange={(e) => setFtaHsCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
                  style={{ borderColor: "#E5E7EB" }}
                  placeholder="e.g. 85176290"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "#374151" }}>Country of Origin *</label>
                <select
                  value={ftaOrigin}
                  onChange={(e) => setFtaOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-[13px] outline-none"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div
                className="rounded-lg p-3 text-[12px]"
                style={{ background: "#F0FDF4", borderLeft: "3px solid #1E40AF" }}
              >
                <div className="font-semibold mb-1" style={{ color: "#1E40AF" }}>Active FTAs with India</div>
                <div style={{ color: "#374151" }}>ASEAN, SAFTA, Japan CEPA, South Korea CEPA, Singapore CECA, UAE CEPA, Mauritius CECPA</div>
              </div>
              <button
                className="w-full px-4 py-2.5 rounded-md text-[13px] font-bold text-white"
                style={{ background: ACCENT }}
              >
                <span className="material-symbols-outlined inline-block align-middle mr-1" style={{ fontSize: 15 }}>public</span>
                Check FTA
              </button>
            </div>
          </div>

          {/* FTA Result */}
          <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>FTA Result</h3>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>public</span>
              <p className="text-[13px] font-medium" style={{ color: "#1a1c1c" }}>No result yet</p>
              <p className="text-[12px] mt-1" style={{ color: "#7e7576" }}>
                Enter HS code and country of origin to check FTA eligibility
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
