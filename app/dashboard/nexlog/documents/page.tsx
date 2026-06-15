"use client";

const docs: { job: string; client: string; type: string; label: string; date: string; size: string }[] = [];

export default function DocumentsPage() {
  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Document Vault</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>All shipping documents · cloud backed</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#9CA3AF" }}>search</span>
            <input placeholder="Search documents..." className="text-[12px] outline-none w-48" />
          </div>
          <button className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white" style={{ background: "#1565C0" }}>+ Upload</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Total Documents", value: docs.length.toString(), icon: "folder", color: "#1565C0", bg: "#E3F2FD" },
          { label: "Shared Links Active", value: "0", icon: "link", color: "#1E40AF", bg: "#F5F3FF" },
          { label: "Pending Upload", value: "0", icon: "upload_file", color: "#1E40AF", bg: "#FFFBEB" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border p-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-medium mb-1" style={{ color: "#6B7280" }}>{k.label}</div>
                <div className="text-2xl font-bold" style={{ color: "#111827" }}>{k.value}</div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: k.color }}>{k.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>{["Job No", "Client", "Type", "Document", "Date", "Size", ""].map((h) => <th key={h} className="text-left py-2.5 px-3 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {docs.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center text-[13px]" style={{ color: "#9CA3AF" }}>No documents yet — upload your first document</td></tr>
            )}
            {docs.map((d, i) => (
              <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                <td className="py-2.5 px-3 font-mono text-[11px]" style={{ color: "#1565C0" }}>{d.job}</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: "#111827" }}>{d.client}</td>
                <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#E3F2FD", color: "#1565C0" }}>{d.type}</span></td>
                <td className="py-2.5 px-3" style={{ color: "#374151" }}>{d.label}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{d.date}</td>
                <td className="py-2.5 px-3" style={{ color: "#6B7280" }}>{d.size}</td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button className="px-2 py-1 rounded text-[11px] font-semibold" style={{ background: "#E3F2FD", color: "#1565C0" }}>Share Link</button>
                    <button className="px-2 py-1 rounded text-[11px] font-semibold" style={{ background: "#F3F4F6", color: "#374151" }}>Download</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
