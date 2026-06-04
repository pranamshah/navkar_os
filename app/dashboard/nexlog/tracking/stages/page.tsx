"use client";

const updates = [
  { job: "IMP/2526/089", stage: "Customs Examination Started", by: "Priya M", time: "5 min ago", notified: true },
  { job: "EXP/2526/044", stage: "Vessel Sailed", by: "Rajesh K", time: "32 min ago", notified: true },
  { job: "IMP/2526/088", stage: "CFS Destuffed", by: "Priya M", time: "1 hr ago", notified: true },
  { job: "AIR/2526/032", stage: "Delivered to Consignee", by: "Anita S", time: "2 hrs ago", notified: false },
  { job: "IMP/2526/087", stage: "In Transit Update", by: "System Auto", time: "3 hrs ago", notified: true },
  { job: "AIR/2526/031", stage: "Booking Confirmed", by: "Anita S", time: "4 hrs ago", notified: true },
  { job: "IMP/2526/086", stage: "Arrived Port", by: "Rajesh K", time: "6 hrs ago", notified: false },
];

export default function StageUpdatesPage() {
  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Stage Updates</h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Chronological log of all status updates</p>
      </div>
      <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <div className="space-y-0">
          {updates.map((u, i) => (
            <div key={i} className="flex gap-3 py-3" style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : undefined }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E3F2FD" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#1565C0" }}>update</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[11px]" style={{ color: "#1565C0" }}>{u.job}</span>
                    <span className="mx-2" style={{ color: "#D1D5DB" }}>·</span>
                    <span className="text-[13px] font-semibold" style={{ color: "#111827" }}>{u.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {u.notified && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "#ECFDF5", color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 11 }}>check</span>Client notified</span>}
                    <span className="text-[11px]" style={{ color: "#9CA3AF" }}>{u.time}</span>
                  </div>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Updated by {u.by}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
