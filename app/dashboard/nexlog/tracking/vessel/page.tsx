"use client";

const vessels: { name: string; imo: string; line: string; port: string; speed: string; update: string; eta: string }[] = [];

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
            {vessels.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#e5e7eb" }}>directions_boat</span>
                    <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No vessels tracked yet</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>They will appear here once added.</p>
                  </div>
                </td>
              </tr>
            ) : vessels.map((v) => (
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
