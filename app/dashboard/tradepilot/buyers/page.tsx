"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Buyer = {
  id: number;
  name: string;
  country: string;
  products: string;
  lastActive: string;
  importVolume: string;
  category: string;
};

const categories = ["All", "Textiles", "Metal Products", "Stone & Minerals", "Food & Agri", "Chemicals", "Electronics"];
const countryOptions = ["All Countries", "United States", "Japan", "Germany", "Australia", "UAE", "South Korea"];

export default function FindBuyersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [country, setCountry] = useState("All Countries");
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [buyers] = useState<Buyer[]>([]);

  const filtered = buyers.filter((b) => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.products.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || b.category === category;
    const matchCountry = country === "All Countries" || b.country.includes(country);
    return matchSearch && matchCategory && matchCountry;
  });

  const toggleSave = (id: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 26 }}>
          Find Buyers
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: "#CCFBF1", color: "#1E40AF" }}>
            1,000+ verified importers across 50+ countries
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border p-4 mb-5 flex flex-wrap gap-3" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex-1 min-w-48 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined" style={{ fontSize: 16, color: "#6B7280" }}>search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name or product..."
            className="w-full pl-8 pr-3 py-2 rounded-lg border text-[13px] outline-none transition-all"
            style={{ borderColor: "#E5E7EB", color: "#111827" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1E40AF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="px-3 py-2 rounded-lg border text-[13px] outline-none bg-white min-w-36"
          style={{ borderColor: "#E5E7EB", color: "#111827" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1E40AF")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
        >
          {countryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all"
              style={{
                background: category === c ? "#1E40AF" : "#fff",
                color: category === c ? "#fff" : "#6B7280",
                borderColor: category === c ? "#1E40AF" : "#E5E7EB",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((buyer, i) => (
          <motion.div
            key={buyer.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border p-5 flex flex-col"
            style={{ background: "#fff", borderColor: "#E5E7EB" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F0FDFA" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#1E40AF", fontVariationSettings: "'FILL' 1" }}>business</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#F3F4F6", color: "#6B7280" }}>
                {buyer.category}
              </span>
            </div>

            <div className="font-semibold text-[14px] mb-0.5" style={{ color: "#111827" }}>{buyer.name}</div>
            <div className="text-[12px] mb-2" style={{ color: "#6B7280" }}>{buyer.country}</div>

            <div className="text-[11px] mb-1" style={{ color: "#374151" }}>
              <span className="font-medium" style={{ color: "#6B7280" }}>Products: </span>{buyer.products}
            </div>
            <div className="text-[11px] mb-1" style={{ color: "#374151" }}>
              <span className="font-medium" style={{ color: "#6B7280" }}>Import Volume: </span>
              <span className="font-semibold" style={{ color: "#1E40AF" }}>{buyer.importVolume}</span>
            </div>
            <div className="text-[10px] mb-4" style={{ color: "#9CA3AF" }}>
              Last active: {buyer.lastActive}
            </div>

            <button
              onClick={() => toggleSave(buyer.id)}
              className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[12px] font-semibold border transition-all"
              style={{
                background: saved.has(buyer.id) ? "#F0FDFA" : "#fff",
                color: saved.has(buyer.id) ? "#1E40AF" : "#374151",
                borderColor: saved.has(buyer.id) ? "#1E40AF" : "#E5E7EB",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15, fontVariationSettings: saved.has(buyer.id) ? "'FILL' 1" : "'FILL' 0" }}>
                bookmark
              </span>
              {saved.has(buyer.id) ? "Saved" : "Save Lead"}
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <span className="material-symbols-outlined mb-3" style={{ fontSize: 44, color: "#e5e7eb" }}>person_search</span>
          <p className="text-sm font-medium" style={{ color: "#1a1c1c" }}>No buyers found. Add your first buyer to get started.</p>
        </div>
      )}
    </div>
  );
}
