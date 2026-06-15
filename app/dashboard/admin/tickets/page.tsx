"use client";

import { useState } from "react";

type TicketStatus = "Open" | "In Progress" | "Resolved";

interface AdminTicket {
  id: string;
  subject: string;
  category: string;
  client: string;
  clientId: string;
  status: TicketStatus;
  createdAt: string;
}

const MOCK_TICKETS: AdminTicket[] = [];

const STATUS_STYLE: Record<TicketStatus, { bg: string; text: string }> = {
  Open: { bg: "rgba(30,64,175,0.12)", text: "#1E40AF" },
  "In Progress": { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
  Resolved: { bg: "rgba(34,197,94,0.1)", text: "#16a34a" },
};

const TABS: { label: string; value: TicketStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Open", value: "Open" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
];

const COLUMNS = ["Ticket ID", "Subject", "Category", "Client", "Status", "Created", "Action"];

export default function AdminTicketsPage() {
  const [activeTab, setActiveTab] = useState<TicketStatus | "All">("All");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered =
    activeTab === "All"
      ? MOCK_TICKETS
      : MOCK_TICKETS.filter((t) => t.status === activeTab);

  const counts: Record<TicketStatus | "All", number> = {
    All: MOCK_TICKETS.length,
    Open: MOCK_TICKETS.filter((t) => t.status === "Open").length,
    "In Progress": MOCK_TICKETS.filter((t) => t.status === "In Progress").length,
    Resolved: MOCK_TICKETS.filter((t) => t.status === "Resolved").length,
  };

  function handleReply(ticketId: string) {
    if (replyingTo === ticketId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(ticketId);
      setReplyText("");
    }
  }

  return (
    <div className="p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Admin
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          Support Tickets
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Manage and respond to client support requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
        {TABS.map(({ label, value }) => {
          const active = activeTab === value;
          return (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className="flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-all relative"
              style={{ color: active ? "#1a1c1c" : "#b0a8a9" }}
            >
              {label}
              <span
                className="px-1.5 py-0.5 rounded text-xs font-semibold"
                style={{
                  background: active ? "rgba(30,64,175,0.12)" : "rgba(0,0,0,0.04)",
                  color: active ? "#1E40AF" : "#b0a8a9",
                }}
              >
                {counts[value]}
              </span>
              {active && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                  style={{ background: "#1E40AF" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-xl border bg-white overflow-hidden"
        style={{ borderColor: "rgba(0,0,0,0.07)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#f9f9fa", borderBottom: "1px solid #E5E7EB" }}>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left font-semibold uppercase tracking-widest whitespace-nowrap"
                    style={{ color: "#b0a8a9" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-16 text-center"
                    style={{ color: "#b0a8a9" }}
                  >
                    No tickets in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((ticket) => {
                  const s = STATUS_STYLE[ticket.status];
                  const isReplying = replyingTo === ticket.id;
                  return (
                    <>
                      <tr
                        key={ticket.id}
                        className="transition-colors hover:bg-[#fafafa]"
                        style={{ borderBottom: isReplying ? "none" : "1px solid rgba(0,0,0,0.04)" }}
                      >
                        <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap" style={{ color: "#1E40AF" }}>
                          {ticket.id}
                        </td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#1a1c1c", maxWidth: 260 }}>
                          <span className="line-clamp-1">{ticket.subject}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#7e7576" }}>
                          {ticket.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div style={{ color: "#1a1c1c" }}>{ticket.client}</div>
                          <div className="font-mono text-xs" style={{ color: "#1E40AF" }}>
                            {ticket.clientId}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-widest"
                            style={{ background: s.bg, color: s.text }}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#7e7576" }}>
                          {ticket.createdAt}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleReply(ticket.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-80"
                            style={{
                              background: isReplying ? "#1a1c1c" : "rgba(30,64,175,0.1)",
                              color: isReplying ? "#1E40AF" : "#1E40AF",
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                              {isReplying ? "close" : "reply"}
                            </span>
                            {isReplying ? "Cancel" : "Reply"}
                          </button>
                        </td>
                      </tr>
                      {isReplying && (
                        <tr
                          key={`${ticket.id}-reply`}
                          style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                        >
                          <td colSpan={COLUMNS.length} className="px-4 pb-4 pt-1">
                            <div
                              className="rounded-lg p-4 flex flex-col gap-3"
                              style={{ background: "rgba(30,64,175,0.04)", border: "1px solid rgba(30,64,175,0.15)" }}
                            >
                              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                                Replying to {ticket.id}: {ticket.subject}
                              </p>
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply…"
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none transition-all"
                                style={{
                                  border: "1px solid #E5E7EB",
                                  color: "#1a1c1c",
                                  background: "#ffffff",
                                  fontFamily: "Inter, sans-serif",
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "#1E40AF")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
                                  style={{ background: "#1a1c1c", color: "#1E40AF" }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                                    send
                                  </span>
                                  Send Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                  className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-all"
                                  style={{ background: "rgba(0,0,0,0.05)", color: "#7e7576" }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
