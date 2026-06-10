"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ChannelFilter = "All" | "RMS" | "Yellow Channel" | "Red Channel";

type ExamRow = {
  containerNo: string;
  beNo: string;
  cha: string;
  channel: "RMS" | "Yellow" | "Red";
  examStatus: string;
  examDate: string;
  oocDate: string;
  remarks: string;
};

const containers: ExamRow[] = [];

const channelStyle: Record<ExamRow["channel"], { color: string; bg: string; label: string }> = {
  RMS: { color: "#059669", bg: "#ECFDF5", label: "RMS" },
  Yellow: { color: "#D97706", bg: "#FFFBEB", label: "Yellow" },
  Red: { color: "#DC2626", bg: "#FEF2F2", label: "Red" },
};

const filterTabs: ChannelFilter[] = ["All", "RMS", "Yellow Channel", "Red Channel"];

export default function ExamQueuePage() {
  const [activeFilter, setActiveFilter] = useState<ChannelFilter>("All");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = containers.filter((c) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "RMS") return c.channel === "RMS";
    if (activeFilter === "Yellow Channel") return c.channel === "Yellow";
    if (activeFilter === "Red Channel") return c.channel === "Red";
    return true;
  });

  const handleMarkOOC = (containerNo: string) => {
    setToast(`OOC marking for ${containerNo} — Coming soon.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg"
          style={{ background: "#D97706", color: "#fff", maxWidth: 360 }}
        >
          {toast}
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ color: "#111827", fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            Examination Queue
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Containers under customs examination — RMS, Yellow &amp; Red channel
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 mb-4">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            style={{
              background: activeFilter === tab ? "#D97706" : "#fff",
              color: activeFilter === tab ? "#fff" : "#6B7280",
              borderColor: activeFilter === tab ? "#D97706" : "#E5E7EB",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {["Container No", "BE No", "CHA", "Exam Channel", "Exam Status", "Exam Date", "OOC Date", "Remarks", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 font-semibold text-[10px] uppercase tracking-wider"
                    style={{ color: "#6B7280" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center" style={{ color: "#6B7280" }}>
                  <div className="flex flex-col items-center gap-3">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 48, color: "#E5E7EB" }}
                    >
                      gavel
                    </span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#374151" }}>
                        No containers under examination
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                        Containers flagged for customs examination will appear here.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const ch = channelStyle[c.channel];
                return (
                  <tr key={c.containerNo} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td className="py-3 px-3 font-mono font-semibold" style={{ color: "#D97706" }}>
                      {c.containerNo}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>
                      {c.beNo}
                    </td>
                    <td className="py-3 px-3" style={{ color: "#374151" }}>
                      {c.cha}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: ch.bg, color: ch.color }}
                      >
                        {ch.label}
                      </span>
                    </td>
                    <td className="py-3 px-3" style={{ color: "#374151" }}>
                      {c.examStatus}
                    </td>
                    <td className="py-3 px-3 text-[11px]" style={{ color: "#6B7280" }}>
                      {c.examDate || "—"}
                    </td>
                    <td className="py-3 px-3 text-[11px]" style={{ color: "#6B7280" }}>
                      {c.oocDate || "—"}
                    </td>
                    <td className="py-3 px-3 text-[11px]" style={{ color: "#6B7280" }}>
                      {c.remarks || "—"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        className="px-2.5 py-1 rounded text-[11px] font-semibold transition-all"
                        style={{ background: "#ECFDF5", color: "#059669" }}
                        onClick={() => handleMarkOOC(c.containerNo)}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.background = "#D1FAE5")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.background = "#ECFDF5")
                        }
                      >
                        Mark OOC
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
