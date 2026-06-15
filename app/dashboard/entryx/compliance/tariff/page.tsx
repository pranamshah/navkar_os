"use client";

import { useState } from "react";

const ACCENT = "#1E40AF";

export default function TariffMasterPage() {
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) setSearched(true);
  };

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Tariff Master</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
          Search by HS code or product description to find duty rates and trade policy
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="rounded-xl border p-5 mb-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex gap-3">
          <div
            className="flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors"
            style={{ borderColor: ACCENT }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: ACCENT }}>search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by HS code (e.g. 85176290) or product description (e.g. mobile phones)..."
              className="flex-1 text-[13px] outline-none"
              style={{ color: "#111827" }}
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setSearched(false); }}
                className="material-symbols-outlined"
                style={{ fontSize: 16, color: "#9CA3AF" }}
              >
                close
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-[13px] font-bold text-white"
            style={{ background: ACCENT }}
          >
            Search
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-[11px]" style={{ color: "#6B7280" }}>Quick searches:</span>
          {["8517", "6110", "2709", "8703", "7308"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setSearch(code)}
              className="px-2 py-0.5 rounded text-[11px] font-medium"
              style={{ background: "#F0FDF4", color: ACCENT, border: "1px solid #BBF7D0" }}
            >
              {code}
            </button>
          ))}
        </div>
      </form>

      {/* Results / Empty State */}
      {!searched ? (
        <div className="rounded-xl border p-10 flex flex-col items-center justify-center" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <span className="material-symbols-outlined mb-4" style={{ fontSize: 56, color: "#d1d5db" }}>gavel</span>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#1a1c1c" }}
          >
            Tariff Master Search
          </h2>
          <p className="text-[13px] text-center max-w-md" style={{ color: "#7e7576" }}>
            Enter a 4-digit to 8-digit HS code or a product description above to look up
            basic customs duty, IGST, social welfare surcharge, and trade policy notifications.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-lg">
            {[
              { icon: "tag", label: "HS Code lookup", desc: "4-digit to 8-digit" },
              { icon: "description", label: "Duty structure", desc: "BCD · IGST · SWS" },
              { icon: "notifications", label: "CBIC notifications", desc: "Exemptions & amendments" },
            ].map((tip) => (
              <div
                key={tip.label}
                className="p-3 rounded-lg border text-center"
                style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}
              >
                <span className="material-symbols-outlined mb-1" style={{ fontSize: 22, color: ACCENT }}>
                  {tip.icon}
                </span>
                <div className="text-[12px] font-semibold" style={{ color: "#111827" }}>{tip.label}</div>
                <div className="text-[11px]" style={{ color: "#6B7280" }}>{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border p-10 flex flex-col items-center justify-center" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>search_off</span>
          <p className="text-[13px] font-semibold" style={{ color: "#1a1c1c" }}>
            No results for &quot;{search}&quot;
          </p>
          <p className="text-[12px] mt-1" style={{ color: "#7e7576" }}>
            Tariff data integration coming soon. Try a valid HS code.
          </p>
        </div>
      )}
    </div>
  );
}
