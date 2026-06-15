"use client";

import { useState } from "react";
import Link from "next/link";

const jobs: { no: string; client: string; route: string; mode: string; type: string; stage: string; eta: string; handler: string }[] = [];

const stageColors: Record<string, { bg: string; fg: string }> = {
  "At Customs": { bg: "#FFFBEB", fg: "#1E40AF" },
  "Vessel Sailed": { bg: "#E3F2FD", fg: "#1565C0" },
  "Delivered": { bg: "#ECFDF5", fg: "#059669" },
  "CFS Destuffed": { bg: "#F5F3FF", fg: "#1E40AF" },
  "In Transit": { bg: "#E3F2FD", fg: "#1565C0" },
  "Booking Confirmed": { bg: "#F3F4F6", fg: "#374151" },
  "Arrived Port": { bg: "#FEF3C7", fg: "#92400E" },
  "Cargo Received": { bg: "#F3F4F6", fg: "#374151" },
};

export default function JobsList() {
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  const filtered = jobs.filter((j) =>
    (!search || j.no.toLowerCase().includes(search.toLowerCase()) || j.client.toLowerCase().includes(search.toLowerCase())) &&
    (!modeFilter || j.mode === modeFilter) &&
    (!typeFilter || j.type === typeFilter) &&
    (!stageFilter || j.stage === stageFilter)
  );

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>All Jobs</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{filtered.length} jobs · {jobs.filter(j => j.stage !== "Delivered").length} active</p>
        </div>
        <Link href="/dashboard/nexlog/jobs/new" className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] text-white font-medium" style={{ background: "#1565C0" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New Job
        </Link>
      </div>

      <div className="rounded-xl border p-4 mb-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border" style={{ borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#9CA3AF" }}>search</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by job no, client..." className="flex-1 text-[13px] outline-none" />
          </div>
          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="px-3 py-2 rounded-md border text-[13px]" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <option value="">All Modes</option><option value="SEA">Sea</option><option value="AIR">Air</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-md border text-[13px]" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <option value="">All Types</option><option value="IMPORT">Import</option><option value="EXPORT">Export</option>
          </select>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-3 py-2 rounded-md border text-[13px]" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <option value="">All Stages</option>
            {Object.keys(stageColors).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Job No", "Client", "Route", "Type", "Mode", "Stage", "ETA", "Handler", ""].map((h) => (
                <th key={h} className="text-left py-3 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>
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
                    <p className="text-xs mt-1 mb-3" style={{ color: "#7e7576" }}>Create your first job to get started.</p>
                    <Link href="/dashboard/nexlog/jobs/new" className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] text-white font-medium" style={{ background: "#1565C0" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                      New Job
                    </Link>
                  </div>
                </td>
              </tr>
            ) : filtered.map((j) => (
              <tr key={j.no} style={{ borderTop: "1px solid #F3F4F6" }} className="hover:bg-gray-50">
                <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{j.no}</td>
                <td className="py-3 px-3 font-medium" style={{ color: "#111827" }}>{j.client}</td>
                <td className="py-3 px-3" style={{ color: "#6B7280" }}>{j.route}</td>
                <td className="py-3 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: j.type === "IMPORT" ? "#E3F2FD" : "#F5F3FF", color: j.type === "IMPORT" ? "#1565C0" : "#1E40AF" }}>{j.type}</span></td>
                <td className="py-3 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: j.mode === "SEA" ? "#DBEAFE" : "#FEF3C7", color: j.mode === "SEA" ? "#1E40AF" : "#92400E" }}>{j.mode}</span></td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: stageColors[j.stage]?.bg, color: stageColors[j.stage]?.fg }}>{j.stage}</span></td>
                <td className="py-3 px-3 text-[11px]" style={{ color: "#6B7280" }}>{j.eta}</td>
                <td className="py-3 px-3 text-[11px]" style={{ color: "#6B7280" }}>{j.handler}</td>
                <td className="py-3 px-3"><Link href={`/dashboard/nexlog/jobs/${j.no}`} className="text-[11px] font-semibold px-2 py-1 rounded" style={{ color: "#1565C0", background: "#E3F2FD" }}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
