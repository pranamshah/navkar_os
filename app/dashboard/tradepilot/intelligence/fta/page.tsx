"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ftaCountries = [
  "ASEAN (Brunei, Cambodia, Indonesia, Laos, Malaysia, Myanmar, Philippines, Singapore, Thailand, Vietnam)",
  "Japan",
  "South Korea",
  "UAE",
  "Australia",
  "Sri Lanka",
  "Mauritius",
  "Singapore",
  "Nepal",
  "Bhutan",
];

type FtaResult = {
  applicable: boolean;
  ftaName: string;
  mnfRate: string;
  ftaRate: string;
  cooRequired: string;
  savingPerUnit: string;
};

const demoFtaData: Record<string, FtaResult> = {
  malaysia: {
    applicable: true,
    ftaName: "India-ASEAN FTA (AIFTA)",
    mnfRate: "10%",
    ftaRate: "0% (Nil)",
    cooRequired: "Form AI — Certificate of Origin required from local chamber",
    savingPerUnit: "~10% of assessable value per unit",
  },
  japan: {
    applicable: true,
    ftaName: "India-Japan CEPA (Comprehensive Economic Partnership Agreement)",
    mnfRate: "7.5%",
    ftaRate: "2.5%",
    cooRequired: "Certificate of Origin Form IJCEP required",
    savingPerUnit: "~5% of assessable value per unit",
  },
  "south korea": {
    applicable: true,
    ftaName: "India-Korea CEPA",
    mnfRate: "10%",
    ftaRate: "5%",
    cooRequired: "Certificate of Origin — bilateral verification required",
    savingPerUnit: "~5% of assessable value per unit",
  },
  uae: {
    applicable: true,
    ftaName: "India-UAE CEPA (Comprehensive Economic Partnership Agreement)",
    mnfRate: "5%",
    ftaRate: "0% (Nil) for select categories",
    cooRequired: "UAE COO required — notarised by Dubai Chamber",
    savingPerUnit: "~5% of assessable value per unit",
  },
  australia: {
    applicable: true,
    ftaName: "India-Australia ECTA (Economic Cooperation and Trade Agreement)",
    mnfRate: "7.5%",
    ftaRate: "0% on most goods",
    cooRequired: "ECTA Certificate of Origin required",
    savingPerUnit: "~7.5% of assessable value per unit",
  },
};

const activeFtas = [
  { name: "India-ASEAN FTA", abbr: "AIFTA", countries: "Brunei, Cambodia, Indonesia, Laos, Malaysia, Myanmar, Philippines, Singapore, Thailand, Vietnam", year: "2010" },
  { name: "India-Japan CEPA", abbr: "IJCEPA", countries: "Japan", year: "2011" },
  { name: "India-South Korea CEPA", abbr: "IKCEPA", countries: "South Korea", year: "2010" },
  { name: "India-UAE CEPA", abbr: "UAE-CEPA", countries: "United Arab Emirates", year: "2022" },
  { name: "India-Australia ECTA", abbr: "IA-ECTA", countries: "Australia", year: "2022" },
  { name: "India-Sri Lanka FTA", abbr: "ISLFTA", countries: "Sri Lanka", year: "2000" },
  { name: "India-Mauritius CECPA", abbr: "IMCECPA", countries: "Mauritius", year: "2021" },
  { name: "India-Singapore CECA", abbr: "ISCECA", countries: "Singapore", year: "2005" },
];

export default function FtaCheckerPage() {
  const [hsCode, setHsCode] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [result, setResult] = useState<FtaResult | null>(null);
  const [checked, setChecked] = useState(false);

  const checkFta = () => {
    const key = originCountry.toLowerCase();
    const match = Object.entries(demoFtaData).find(([k]) => key.includes(k))?.[1];
    setResult(match ?? null);
    setChecked(true);
  };

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 26 }}>
          FTA Checker
        </h1>
        <p className="text-xs" style={{ color: "#6B7280" }}>Check if your shipment qualifies for preferential duty under India&apos;s Free Trade Agreements</p>
      </div>

      {/* Input */}
      <div className="rounded-xl border p-5 mb-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>HS Code</label>
            <input
              type="text"
              value={hsCode}
              onChange={(e) => setHsCode(e.target.value)}
              placeholder="e.g. 73044900"
              className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-all"
              style={{ borderColor: "#E5E7EB", color: "#111827" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>Origin Country</label>
            <select
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-all bg-white"
              style={{ borderColor: "#E5E7EB", color: originCountry ? "#111827" : "#9CA3AF" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
            >
              <option value="">Select country</option>
              {ftaCountries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={checkFta}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: "#0D9488" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F766E")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0D9488")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>public</span>
          Check FTA
        </button>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {checked && (
          <motion.div
            key={result ? "found" : "not-found"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border p-5 mb-6"
            style={{
              background: result ? "#F0FDFA" : "#FFF7ED",
              borderColor: result ? "#0D9488" : "#FCD34D",
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    background: result ? "#0D9488" : "#EF4444",
                    color: "#fff",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                    {result ? "check_circle" : "cancel"}
                  </span>
                  FTA {result ? "Applicable" : "Not Applicable"}
                </span>
              </div>
              <div className="flex-1">
                {result ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#0D9488" }}>Agreement</span>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: "#111827" }}>{result.ftaName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg p-3" style={{ background: "#fff" }}>
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>MFN Rate</span>
                        <p className="text-xl font-bold mt-0.5" style={{ color: "#DC2626" }}>{result.mnfRate}</p>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: "#fff" }}>
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>FTA Rate</span>
                        <p className="text-xl font-bold mt-0.5" style={{ color: "#059669" }}>{result.ftaRate}</p>
                      </div>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "#fff" }}>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>COO Document Required</span>
                      <p className="text-[12px] mt-0.5" style={{ color: "#374151" }}>{result.cooRequired}</p>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: "#fff" }}>
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>Estimated Duty Saving</span>
                      <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#059669" }}>{result.savingPerUnit}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#92400E" }}>No FTA benefit available</p>
                    <p className="text-[12px] mt-1" style={{ color: "#6B7280" }}>
                      India does not have an active FTA with the selected country for this product. Standard MFN rates will apply.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active FTAs reference */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>India&apos;s Active Free Trade Agreements</h2>
        <div className="grid grid-cols-4 gap-3">
          {activeFtas.map((fta) => (
            <div
              key={fta.abbr}
              className="rounded-xl border p-4 transition-all"
              style={{ background: "#fff", borderColor: "#E5E7EB" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: "#F0FDFA", color: "#0D9488" }}>{fta.abbr}</span>
                <span className="text-[9px]" style={{ color: "#9CA3AF" }}>Since {fta.year}</span>
              </div>
              <div className="text-[11px] font-semibold leading-tight mb-1" style={{ color: "#111827" }}>{fta.name}</div>
              <div className="text-[10px] leading-relaxed" style={{ color: "#6B7280" }}>{fta.countries}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
