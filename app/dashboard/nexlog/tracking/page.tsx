"use client";

import { useState } from "react";

const tracking = {
  sea: [
    { job: "IMP/2526/089", vessel: "MV Pacific Ace V.2614E", location: "Berthed JNPT", stage: "At Customs", eta: "08 Jun 2026", delay: "On Time" },
    { job: "IMP/2526/088", vessel: "MV OOCL Brussels", location: "Discharged Chennai", stage: "CFS Destuffed", eta: "06 Jun 2026", delay: "Delayed" },
    { job: "IMP/2526/087", vessel: "MV CMA CGM Marco Polo", location: "Arabian Sea", stage: "In Transit", eta: "15 Jun 2026", delay: "On Time" },
    { job: "EXP/2526/044", vessel: "MV MSC Gulsun", location: "Sailing — Indian Ocean", stage: "Vessel Sailed", eta: "22 Jun 2026", delay: "Critical" },
  ],
  air: [
    { job: "AIR/2526/032", flight: "EK 502 Emirates", location: "Delivered Dubai", stage: "Delivered", eta: "—", delay: "On Time" },
    { job: "AIR/2526/031", flight: "AI 916 Air India", location: "Hyderabad Airport", stage: "Booking Confirmed", eta: "10 Jun 2026", delay: "On Time" },
  ],
  surface: [
    { job: "RD/2526/044", flight: "Truck MH04AB1234", location: "Pune NHK", stage: "In Transit", eta: "06 Jun 2026", delay: "On Time" },
  ],
};

const delayColors: Record<string, { bg: string; fg: string }> = {
  "On Time": { bg: "#ECFDF5", fg: "#059669" },
  "Delayed": { bg: "#FFFBEB", fg: "#D97706" },
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
            {list.map((t: { job: string; vessel?: string; flight?: string; location: string; stage: string; eta: string; delay: string }, i: number) => (
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
