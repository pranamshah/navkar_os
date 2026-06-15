"use client";

import { useState } from "react";
import Link from "next/link";

const ACCENT = "#1E40AF";

type Job = {
  no: string;
  date: string;
  client: string;
  type: string;
  mode: string;
  commodity: string;
  stage: string;
  beNo: string;
};

const jobs: Job[] = [];

const stageColors: Record<string, { bg: string; fg: string }> = {
  JOB_CREATED: { bg: "#F3F4F6", fg: "#374151" },
  DOCUMENTS_RECEIVED: { bg: "#DBEAFE", fg: "#1E40AF" },
  BE_DRAFTED: { bg: "#FEF3C7", fg: "#92400E" },
  BE_FILED: { bg: "#DBEAFE", fg: "#1E40AF" },
  ASSESSMENT: { bg: "#FEF3C7", fg: "#92400E" },
  EXAMINATION: { bg: "#FFEDD5", fg: "#9A3412" },
  OOC_GRANTED: { bg: "#DCFCE7", fg: "#1E40AF" },
  JOB_CLOSED: { bg: "#F3F4F6", fg: "#374151" },
};

const stageLabelMap: Record<string, string> = {
  JOB_CREATED: "Job Created",
  DOCUMENTS_RECEIVED: "Docs Received",
  BE_DRAFTED: "BE Drafted",
  BE_FILED: "BE Filed",
  ASSESSMENT: "Assessment",
  EXAMINATION: "Examination",
  OOC_GRANTED: "OOC Granted",
  JOB_CLOSED: "Closed",
};

const filterTabs = [
  { id: "", label: "All" },
  { id: "IMPORT", label: "Import" },
  { id: "EXPORT", label: "Export" },
  { id: "AIR", label: "Air" },
  { id: "SEA", label: "Sea" },
];

export default function EntryXJobsList() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");

  const filtered = jobs.filter((j) => {
    const matchSearch =
      !search ||
      j.no.toLowerCase().includes(search.toLowerCase()) ||
      j.client.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      !activeTab ||
      j.type === activeTab ||
      j.mode === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>All Jobs</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            {filtered.length} jobs · {jobs.filter((j) => j.stage !== "JOB_CLOSED").length} active
          </p>
        </div>
        <Link
          href="/dashboard/entryx/jobs/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] text-white font-medium"
          style={{ background: ACCENT }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New Job
        </Link>
      </div>

      {/* Filter tabs + search */}
      <div className="rounded-xl border p-4 mb-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex gap-1 mb-3 border-b pb-2" style={{ borderColor: "#E5E7EB" }}>
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="px-3 py-1 rounded text-[12px] font-medium transition-all"
              style={{
                background: activeTab === t.id ? ACCENT : "transparent",
                color: activeTab === t.id ? "#fff" : "#6B7280",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md border" style={{ borderColor: "#E5E7EB" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#9CA3AF" }}>search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job no, client..."
            className="flex-1 text-[13px] outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Job No", "Date", "Client", "Type", "Mode", "Commodity", "Stage", "BE No", ""].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-3 font-semibold text-[10px] uppercase tracking-wider"
                  style={{ color: "#6B7280" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>inbox</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No jobs found</p>
                    <p className="text-xs mt-1 mb-3" style={{ color: "#7e7576" }}>
                      Create your first CHA job to get started.
                    </p>
                    <Link
                      href="/dashboard/entryx/jobs/new"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] text-white font-medium"
                      style={{ background: ACCENT }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                      New Job
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((j) => (
                <tr key={j.no} style={{ borderTop: "1px solid #F3F4F6" }} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-[11px]" style={{ color: ACCENT }}>{j.no}</td>
                  <td className="py-3 px-3 text-[11px]" style={{ color: "#6B7280" }}>{j.date}</td>
                  <td className="py-3 px-3 font-medium" style={{ color: "#111827" }}>{j.client}</td>
                  <td className="py-3 px-3">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: j.type === "IMPORT" ? "#DCFCE7" : "#F5F3FF",
                        color: j.type === "IMPORT" ? "#1E40AF" : "#1E40AF",
                      }}
                    >
                      {j.type}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: j.mode === "SEA" ? "#DBEAFE" : "#FEF3C7",
                        color: j.mode === "SEA" ? "#1E40AF" : "#92400E",
                      }}
                    >
                      {j.mode}
                    </span>
                  </td>
                  <td className="py-3 px-3" style={{ color: "#6B7280" }}>{j.commodity}</td>
                  <td className="py-3 px-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        background: stageColors[j.stage]?.bg ?? "#F3F4F6",
                        color: stageColors[j.stage]?.fg ?? "#374151",
                      }}
                    >
                      {stageLabelMap[j.stage] ?? j.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>{j.beNo || "—"}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/dashboard/entryx/jobs/${j.no}`}
                      className="text-[11px] font-semibold px-2 py-1 rounded"
                      style={{ color: ACCENT, background: "#DCFCE7" }}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
