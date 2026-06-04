"use client";

const vessels = [
  { name: "MV Pacific Ace", imo: "9876543", line: "Hapag-Lloyd", port: "Berthed JNPT", speed: "0 kn", update: "2 hrs ago", eta: "Berthed" },
  { name: "MV OOCL Brussels", imo: "9785412", line: "OOCL", port: "Chennai Outer Anchorage", speed: "0 kn", update: "1 hr ago", eta: "Berthed" },
  { name: "MV CMA CGM Marco Polo", imo: "9454436", line: "CMA CGM", port: "Arabian Sea (16°N, 71°E)", speed: "18.2 kn", update: "30 min ago", eta: "14 Jun 2026" },
  { name: "MV MSC Gulsun", imo: "9839430", line: "MSC", port: "Indian Ocean (8°S, 78°E)", speed: "21.4 kn", update: "45 min ago", eta: "20 Jun 2026" },
  { name: "MV Ever Ace", imo: "9893890", line: "Evergreen", port: "Suez Canal", speed: "10 kn", update: "3 hrs ago", eta: "28 Jun 2026" },
];

export default function VesselTrackerPage() {
  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Vessel Tracker</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Live AIS data · {vessels.length} active vessels</p>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Vessel", "IMO", "Line", "Current Position", "Speed", "Last Update", "ETA Chennai"].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {vessels.map((v) => (
              <tr key={v.imo} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-3 px-3 font-semibold" style={{ color: "#111827" }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#1565C0" }}>directions_boat</span>
                    {v.name}
                  </div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px]" style={{ color: "#6B7280" }}>{v.imo}</td>
                <td className="py-3 px-3" style={{ color: "#374151" }}>{v.line}</td>
                <td className="py-3 px-3" style={{ color: "#374151" }}>{v.port}</td>
                <td className="py-3 px-3 font-mono" style={{ color: "#1565C0" }}>{v.speed}</td>
                <td className="py-3 px-3 text-[11px]" style={{ color: "#6B7280" }}>{v.update}</td>
                <td className="py-3 px-3 font-semibold" style={{ color: "#111827" }}>{v.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
