"use client";

import { useState } from "react";

const tracking = {
  sea: [] as { job: string; vessel?: string; flight?: string; location: string; stage: string; eta: string; delay: string }[],
  air: [] as { job: string; vessel?: string; flight?: string; location: string; stage: string; eta: string; delay: string }[],
  surface: [] as { job: string; vessel?: string; flight?: string; location: string; stage: string; eta: string; delay: string }[],
};

const delayColors: Record<string, { bg: string; fg: string }> = {
  "On Time": { bg: "#ECFDF5", fg: "#059669" },
  "Delayed": { bg: "#FFFBEB", fg: "#1E40AF" },
  "Critical": { bg: "#FEF2F2", fg: "#DC2626" },
};

export default function TrackingPage() {
  const [mode, setMode] = useState<"sea" | "air" | "surface">("sea");
  const list = tracking[mode];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Live Tracking</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Real-time shipment status across all modes</p>
      </div>

      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        {(["sea", "air", "surface"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className="px-4 py-2 text-[13px] font-medium border-b-2 capitalize" style={{ borderColor: mode === m ? "#1565C0" : "transparent", color: mode === m ? "#1565C0" : "#6B7280" }}>
            {m} ({tracking[m].length})
          </button>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Job No", "Mode", mode === "sea" ? "Vessel" : "Flight/Vehicle", "Current Location", "Stage", "ETA", "Status"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>inbox</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No active shipments</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>They will appear here once added.</p>
                  </div>
                </td>
              </tr>
            ) : list.map((t: { job: string; vessel?: string; flight?: string; location: string; stage: string; eta: string; delay: string }, i: number) => (
              <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{t.job}</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: "#E3F2FD", color: "#1565C0" }}>{mode}</span></td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{t.vessel || t.flight}</td>
                <td className="py-2.5 px-3" style={{ color: "#374151" }}>{t.location}</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#F3F4F6", color: "#374151" }}>{t.stage}</span></td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{t.eta}</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: delayColors[t.delay].bg, color: delayColors[t.delay].fg }}>{t.delay}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
