"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HsnResult = {
  code: string;
  description: string;
  bcd: string;
  igst: string;
  sws: string;
  policy: "Free" | "Restricted" | "Prohibited";
  antiDumping: string;
  related: { code: string; description: string }[];
};

const demoData: Record<string, HsnResult> = {
  "stainless steel pipes": {
    code: "73044900",
    description: "Stainless steel seamless tubes and pipes, other",
    bcd: "7.5%",
    igst: "18%",
    sws: "10% of BCD",
    policy: "Free",
    antiDumping: "Anti-dumping duty applicable on imports from China — check DGTR notification 14/2022.",
    related: [
      { code: "73041900", description: "Seamless line pipe (iron/steel)" },
      { code: "73045100", description: "Cold-drawn or cold-rolled stainless tubes" },
      { code: "73049000", description: "Other seamless tubes/pipes of iron/steel" },
    ],
  },
  "cotton yarn": {
    code: "52052200",
    description: "Cotton yarn (not for retail), combed, 232.56 decitex to 714.29 decitex",
    bcd: "5%",
    igst: "5%",
    sws: "10% of BCD",
    policy: "Free",
    antiDumping: "No anti-dumping duties currently in force.",
    related: [
      { code: "52051200", description: "Cotton yarn, uncombed, 714.29 decitex or more" },
      { code: "52062100", description: "Cotton yarn for retail sale, combed" },
      { code: "52081100", description: "Woven fabrics of cotton, plain weave" },
    ],
  },
  "electronic components": {
    code: "85340000",
    description: "Printed circuits (PCBs)",
    bcd: "10%",
    igst: "18%",
    sws: "10% of BCD",
    policy: "Free",
    antiDumping: "No specific anti-dumping notifications. Some components may attract SCMTR duties.",
    related: [
      { code: "85322500", description: "Fixed capacitors, ceramic dielectric, multi-layer" },
      { code: "85333100", description: "Wirewound variable resistors" },
      { code: "85423100", description: "Processors and controllers (integrated circuits)" },
    ],
  },
};

const exampleChips = ["Stainless Steel Pipes", "Cotton Yarn", "Electronic Components"];

export default function HsnScoutPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<HsnResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (q?: string) => {
    const searchTerm = (q ?? query).toLowerCase().trim();
    const match =
      demoData[searchTerm] ||
      Object.entries(demoData).find(([k]) => k.includes(searchTerm) || searchTerm.includes(k.split(" ")[0]))?.[1];
    setResult(match ?? null);
    setSearched(true);
  };

  const policyColor = (p: string) => {
    if (p === "Free") return { color: "#166534", bg: "#DCFCE7" };
    if (p === "Restricted") return { color: "#92400E", bg: "#FEF3C7" };
    return { color: "#991B1B", bg: "#FEE2E2" };
  };

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 26 }}>
          HSN Scout
        </h1>
        <p className="text-xs" style={{ color: "#6B7280" }}>Find the correct 8-digit ITC-HS code using plain English</p>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border p-6 mb-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <label className="block text-sm font-medium mb-2" style={{ color: "#1a1c1c" }}>
          Describe your product
        </label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined" style={{ fontSize: 18, color: "#6B7280" }}>
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. 'stainless steel wire rods' or 'polyester fabric for garments'"
              className="w-full pl-9 pr-4 py-3 rounded-lg border text-[13px] outline-none transition-all"
              style={{ borderColor: "#E5E7EB", color: "#111827" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
            />
          </div>
          <button
            onClick={() => handleSearch()}
            className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: "#0D9488" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F766E")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0D9488")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
            Search
          </button>
        </div>

        {/* Example chips */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[11px]" style={{ color: "#6B7280" }}>Try:</span>
          {exampleChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setQuery(chip);
                handleSearch(chip);
              }}
              className="px-3 py-1 rounded-full text-[11px] font-medium border transition-all"
              style={{ borderColor: "#0D9488", color: "#0D9488", background: "#F0FDFA" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#CCFBF1")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#F0FDFA")}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!searched && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 rounded-xl border"
            style={{ background: "#fff", borderColor: "#E5E7EB" }}
          >
            <span className="material-symbols-outlined mb-3" style={{ fontSize: 48, color: "#e5e7eb" }}>manage_search</span>
            <p className="text-sm font-medium" style={{ color: "#1a1c1c" }}>Enter a product description to find its HS code</p>
            <p className="text-[11px] mt-1" style={{ color: "#7e7576" }}>Covers all ITC-HS 2022 codes with duty rates</p>
          </motion.div>
        )}

        {searched && !result && (
          <motion.div
            key="no-result"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 rounded-xl border"
            style={{ background: "#fff", borderColor: "#E5E7EB" }}
          >
            <span className="material-symbols-outlined mb-3" style={{ fontSize: 48, color: "#e5e7eb" }}>search_off</span>
            <p className="text-sm font-medium" style={{ color: "#1a1c1c" }}>No results found</p>
            <p className="text-[11px] mt-1" style={{ color: "#7e7576" }}>Try the example chips above or a different description</p>
          </motion.div>
        )}

        {searched && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Main code card */}
            <div className="rounded-xl border p-6" style={{ background: "#fff", borderColor: "#0D9488" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#0D9488" }}>ITC-HS Code</div>
                  <div className="text-5xl font-bold tracking-tight mb-2" style={{ fontFamily: "monospace", color: "#111827" }}>{result.code}</div>
                  <div className="text-[13px]" style={{ color: "#374151" }}>{result.description}</div>
                </div>
                <div className="flex-shrink-0">
                  {(() => { const { color, bg } = policyColor(result.policy); return (
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: bg, color }}>
                      {result.policy}
                    </span>
                  ); })()}
                </div>
              </div>
            </div>

            {/* Duty rates */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Basic Customs Duty (BCD)", value: result.bcd, icon: "receipt_long", color: "#D97706", bg: "#FEF3C7" },
                { label: "IGST Rate", value: result.igst, icon: "percent", color: "#7C3AED", bg: "#F5F3FF" },
                { label: "Social Welfare Surcharge", value: result.sws, icon: "volunteer_activism", color: "#1D4ED8", bg: "#DBEAFE" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.bg }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: "#6B7280" }}>{item.label}</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: "#111827" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Import policy + anti-dumping */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#0D9488" }}>policy</span>
                  <span className="text-[11px] font-semibold" style={{ color: "#374151" }}>Import Policy</span>
                </div>
                <p className="text-[12px]" style={{ color: "#6B7280" }}>
                  This product is classified as <strong style={{ color: "#111827" }}>{result.policy}</strong> for import. No special licence required.
                </p>
              </div>
              <div className="rounded-xl border p-4" style={{ background: result.antiDumping.includes("applicable") ? "#FFFBEB" : "#fff", borderColor: result.antiDumping.includes("applicable") ? "#FCD34D" : "#E5E7EB" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#D97706" }}>warning</span>
                  <span className="text-[11px] font-semibold" style={{ color: "#374151" }}>Anti-Dumping Notes</span>
                </div>
                <p className="text-[12px]" style={{ color: "#6B7280" }}>{result.antiDumping}</p>
              </div>
            </div>

            {/* Related HS codes */}
            <div className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#0D9488" }}>account_tree</span>
                <span className="text-[12px] font-semibold" style={{ color: "#374151" }}>Related HS Codes</span>
              </div>
              <div className="space-y-1.5">
                {result.related.map((r) => (
                  <div key={r.code} className="flex items-center gap-3 py-1.5 px-2 rounded-lg" style={{ background: "#F9FAFB" }}>
                    <span className="font-mono text-[11px] font-bold" style={{ color: "#0D9488" }}>{r.code}</span>
                    <span className="text-[11px]" style={{ color: "#6B7280" }}>{r.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
