"use client";

import { useEffect, useState } from "react";
import { Monitor, Check, X, Trash2, RefreshCw } from "lucide-react";

type Device = {
  id: string;
  token: string;
  name: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  lastSeenAt: string;
  createdAt: string;
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  APPROVED: { bg: "rgba(34,197,94,0.1)", text: "#16a34a" },
  PENDING:  { bg: "rgba(212,175,55,0.12)", text: "#92660a" },
  REJECTED: { bg: "rgba(239,68,68,0.1)", text: "#dc2626" },
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/devices");
    if (res.ok) setDevices(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const patch = async (id: string, update: { status?: string; name?: string }) => {
    setActioning(id);
    await fetch("/api/admin/devices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...update }),
    });
    setDevices((prev) => prev.map((d) => d.id === id ? { ...d, ...update } as Device : d));
    setActioning(null);
    setEditId(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this device? It will need to re-register.")) return;
    setActioning(id);
    await fetch("/api/admin/devices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setActioning(null);
  };

  const pending = devices.filter((d) => d.status === "PENDING");
  const rest = devices.filter((d) => d.status !== "PENDING");

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#D4AF37" }}>Security</p>
          <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "32px", fontWeight: 400, color: "#1a1c1c" }}>
            Allowed Devices
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
            Only approved devices can access the admin dashboard.
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded transition-colors"
          style={{ color: "#7e7576" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1c1c")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#D4AF37" }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
              {pending.length} Awaiting Approval
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {pending.map((d) => (
              <DeviceRow key={d.id} d={d} actioning={actioning} editId={editId} editName={editName}
                setEditId={setEditId} setEditName={setEditName}
                onApprove={() => patch(d.id, { status: "APPROVED" })}
                onReject={() => patch(d.id, { status: "REJECTED" })}
                onRename={() => patch(d.id, { name: editName })}
                onDelete={() => remove(d.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All other devices */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(0,0,0,0.1)", borderTopColor: "#D4AF37" }} />
        </div>
      ) : rest.length === 0 && pending.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-4" style={{ color: "#7e7576" }}>
          <Monitor size={36} style={{ color: "rgba(0,0,0,0.1)" }} />
          <p className="text-sm">No devices registered yet.</p>
          <p className="text-xs" style={{ color: "#b0a8a9" }}>
            Visit the admin dashboard from a new device to trigger registration.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rest.map((d) => (
            <DeviceRow key={d.id} d={d} actioning={actioning} editId={editId} editName={editName}
              setEditId={setEditId} setEditName={setEditName}
              onApprove={() => patch(d.id, { status: "APPROVED" })}
              onReject={() => patch(d.id, { status: "REJECTED" })}
              onRename={() => patch(d.id, { name: editName })}
              onDelete={() => remove(d.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DeviceRow({
  d, actioning, editId, editName, setEditId, setEditName,
  onApprove, onReject, onRename, onDelete,
}: {
  d: Device;
  actioning: string | null;
  editId: string | null;
  editName: string;
  setEditId: (id: string | null) => void;
  setEditName: (n: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const busy = actioning === d.id;
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-lg border"
      style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: STATUS_STYLE[d.status]?.bg ?? "rgba(0,0,0,0.05)" }}
      >
        <Monitor size={18} style={{ color: STATUS_STYLE[d.status]?.text ?? "#7e7576" }} />
      </div>

      <div className="flex-1 min-w-0">
        {editId === d.id ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onRename(); if (e.key === "Escape") setEditId(null); }}
              className="text-sm font-semibold outline-none border-b bg-transparent"
              style={{ color: "#1a1c1c", borderColor: "#D4AF37" }}
            />
            <button onClick={onRename} className="text-xs px-2 py-1 rounded" style={{ background: "rgba(212,175,55,0.1)", color: "#92660a" }}>Save</button>
            <button onClick={() => setEditId(null)} className="text-xs" style={{ color: "#7e7576" }}>Cancel</button>
          </div>
        ) : (
          <button
            className="text-sm font-semibold text-left hover:underline"
            style={{ color: "#1a1c1c" }}
            onClick={() => { setEditId(d.id); setEditName(d.name ?? ""); }}
            title="Click to rename"
          >
            {d.name || "Unnamed Device"}
          </button>
        )}
        <div className="flex items-center gap-3 mt-0.5">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: STATUS_STYLE[d.status]?.bg, color: STATUS_STYLE[d.status]?.text }}
          >
            {d.status}
          </span>
          <span className="text-xs" style={{ color: "#b0a8a9" }}>
            Last seen {timeAgo(d.lastSeenAt)}
          </span>
          <span className="text-xs font-mono" style={{ color: "#b0a8a9" }}>
            {d.token.slice(0, 8)}…
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {d.status !== "APPROVED" && (
          <button
            onClick={onApprove}
            disabled={busy}
            title="Approve"
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#16a34a" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(34,197,94,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Check size={16} />
          </button>
        )}
        {d.status !== "REJECTED" && (
          <button
            onClick={onReject}
            disabled={busy}
            title="Reject"
            className="p-2 rounded-lg transition-colors"
            style={{ color: "#dc2626" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={busy}
          title="Remove device"
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#7e7576" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
