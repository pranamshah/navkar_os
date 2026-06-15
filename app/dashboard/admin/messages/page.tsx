"use client";

import { useEffect, useState } from "react";
import { Mail, Building2, Phone, Clock, Archive, MailOpen, Trash2, RefreshCw } from "lucide-react";

type Message = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
  createdAt: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  UNREAD:   { bg: "rgba(30,64,175,0.12)", text: "#92660a", label: "Unread" },
  READ:     { bg: "rgba(16,185,129,0.1)",  text: "#065f46", label: "Read" },
  ARCHIVED: { bg: "rgba(0,0,0,0.06)",      text: "#7e7576", label: "Archived" },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ" | "ARCHIVED">("ALL");
  const [actioning, setActioning] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) setMessages(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const action = async (id: string, status: string) => {
    setActioning(id);
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: status as Message["status"] } : m));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status: status as Message["status"] } : null);
    setActioning(null);
  };

  const deleteMsg = async (id: string) => {
    setActioning(id);
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    setActioning(null);
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (msg.status === "UNREAD") action(msg.id, "READ");
  };

  const filtered = filter === "ALL" ? messages : messages.filter((m) => m.status === filter);
  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f9f9f9" }}>

      {/* ── Left: message list ─────────────────────────────────── */}
      <div className="w-96 flex-shrink-0 flex flex-col border-r overflow-hidden" style={{ borderColor: "rgba(0,0,0,0.08)", background: "#fff" }}>

        {/* Header */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-base font-bold" style={{ color: "#1a1c1c" }}>Messages</h1>
              {unreadCount > 0 && (
                <p className="text-xs mt-0.5" style={{ color: "#1E40AF" }}>{unreadCount} unread</p>
              )}
            </div>
            <button
              onClick={load}
              className="p-2 rounded transition-colors duration-150"
              style={{ color: "#7e7576" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1">
            {(["ALL", "UNREAD", "READ", "ARCHIVED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all duration-150"
                style={{
                  background: filter === f ? "#1a1c1c" : "transparent",
                  color: filter === f ? "#1E40AF" : "#7e7576",
                }}
              >
                {f === "ALL" ? `All (${messages.length})` : f === "UNREAD" ? `New (${unreadCount})` : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(0,0,0,0.1)", borderTopColor: "#1E40AF" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-3">
              <Mail size={28} style={{ color: "rgba(0,0,0,0.15)" }} />
              <p className="text-sm" style={{ color: "#7e7576" }}>No messages here</p>
            </div>
          ) : (
            filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className="w-full text-left px-5 py-4 border-b transition-all duration-150 relative"
                style={{
                  borderColor: "rgba(0,0,0,0.06)",
                  background: selected?.id === msg.id ? "rgba(30,64,175,0.06)" : "transparent",
                }}
                onMouseEnter={(e) => { if (selected?.id !== msg.id) e.currentTarget.style.background = "#fafafa"; }}
                onMouseLeave={(e) => { if (selected?.id !== msg.id) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Unread dot */}
                {msg.status === "UNREAD" && (
                  <span
                    className="absolute top-5 right-4 w-2 h-2 rounded-full"
                    style={{ background: "#1E40AF" }}
                  />
                )}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "#1a1c1c", fontWeight: msg.status === "UNREAD" ? 700 : 500 }}
                  >
                    {msg.name}
                  </p>
                  <span className="text-xs flex-shrink-0" style={{ color: "#7e7576" }}>
                    {timeAgo(msg.createdAt)}
                  </span>
                </div>
                {msg.company && (
                  <p className="text-xs mb-1 truncate" style={{ color: "#1E40AF" }}>{msg.company}</p>
                )}
                <p className="text-xs line-clamp-2" style={{ color: "#7e7576" }}>{msg.message}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right: message detail ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color: "#7e7576" }}>
            <Mail size={40} style={{ color: "rgba(0,0,0,0.1)" }} />
            <p className="text-sm">Select a message to read</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-8 py-10">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
              <span
                className="px-3 py-1 text-xs font-semibold uppercase tracking-widest rounded-full"
                style={{ background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.text }}
              >
                {STATUS_COLORS[selected.status]?.label}
              </span>
              <div className="flex items-center gap-2">
                {selected.status !== "READ" && selected.status !== "ARCHIVED" && (
                  <button
                    onClick={() => action(selected.id, "READ")}
                    disabled={!!actioning}
                    title="Mark as read"
                    className="p-2 rounded transition-colors duration-150"
                    style={{ color: "#7e7576" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#10b981")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                  >
                    <MailOpen size={16} />
                  </button>
                )}
                {selected.status !== "ARCHIVED" && (
                  <button
                    onClick={() => action(selected.id, "ARCHIVED")}
                    disabled={!!actioning}
                    title="Archive"
                    className="p-2 rounded transition-colors duration-150"
                    style={{ color: "#7e7576" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1E40AF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                  >
                    <Archive size={16} />
                  </button>
                )}
                {selected.status === "ARCHIVED" && (
                  <button
                    onClick={() => action(selected.id, "READ")}
                    disabled={!!actioning}
                    title="Unarchive"
                    className="p-2 rounded transition-colors duration-150"
                    style={{ color: "#7e7576" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                  >
                    <MailOpen size={16} />
                  </button>
                )}
                <button
                  onClick={() => deleteMsg(selected.id)}
                  disabled={!!actioning}
                  title="Delete"
                  className="p-2 rounded transition-colors duration-150"
                  style={{ color: "#7e7576" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Sender info */}
            <div className="flex items-start gap-5 mb-8">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black flex-shrink-0"
                style={{ background: "rgba(30,64,175,0.12)", color: "#1E40AF", border: "1px solid rgba(30,64,175,0.3)" }}
              >
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold mb-1" style={{ color: "#1a1c1c" }}>{selected.name}</h2>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center gap-1.5 text-xs transition-colors duration-150"
                    style={{ color: "#1E40AF" }}
                  >
                    <Mail size={12} />
                    {selected.email}
                  </a>
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "#7e7576" }}
                    >
                      <Phone size={12} />
                      {selected.phone}
                    </a>
                  )}
                  {selected.company && (
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "#7e7576" }}>
                      <Building2 size={12} />
                      {selected.company}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1.5 mb-6">
              <Clock size={12} style={{ color: "#7e7576" }} />
              <span className="text-xs" style={{ color: "#7e7576" }}>
                {new Date(selected.createdAt).toLocaleString("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
                {" · "}
                {timeAgo(selected.createdAt)}
              </span>
            </div>

            {/* Message body */}
            <div
              className="px-6 py-6 mb-8"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.08)",
                borderLeft: "3px solid #1E40AF",
              }}
            >
              <p style={{ fontSize: "15px", color: "#1a1c1c", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {selected.message}
              </p>
            </div>

            {/* Reply button */}
            <a
              href={`mailto:${selected.email}?subject=Re: Your enquiry — NavkarOS`}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
              style={{ background: "#1a1c1c", color: "#fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1E40AF";
                e.currentTarget.style.color = "#1a1c1c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1a1c1c";
                e.currentTarget.style.color = "#fff";
              }}
            >
              <Mail size={13} />
              Reply to {selected.name} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
