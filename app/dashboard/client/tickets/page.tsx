"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  lastReply: string;
  clientId?: string;
  clientName?: string;
}

const CLIENT_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to access Accura dashboard",
    category: "Technical",
    status: "Open",
    createdAt: "2 days ago",
    lastReply: "Our team is looking into this.",
  },
  {
    id: "TKT-002",
    subject: "Invoice not generated for job NXL/26/0142",
    category: "Technical",
    status: "In Progress",
    createdAt: "5 days ago",
    lastReply: "We've identified the issue and will fix it within 24 hours.",
  },
  {
    id: "TKT-003",
    subject: "Billing query for June invoice",
    category: "Billing",
    status: "Resolved",
    createdAt: "12 days ago",
    lastReply: "Your invoice has been corrected and resent.",
  },
];

const ALL_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to access Accura dashboard",
    category: "Technical",
    status: "Open",
    createdAt: "2 days ago",
    lastReply: "Our team is looking into this.",
    clientId: "NVK-2026-A1B2C",
    clientName: "Sundar Shipping Co.",
  },
  {
    id: "TKT-002",
    subject: "Invoice not generated for job NXL/26/0142",
    category: "Technical",
    status: "In Progress",
    createdAt: "5 days ago",
    lastReply: "We've identified the issue and will fix it within 24 hours.",
    clientId: "NVK-2026-D3E4F",
    clientName: "Coastal Freight Pvt. Ltd.",
  },
  {
    id: "TKT-003",
    subject: "Billing query for June invoice",
    category: "Billing",
    status: "Resolved",
    createdAt: "12 days ago",
    lastReply: "Your invoice has been corrected and resent.",
    clientId: "NVK-2026-G5H6I",
    clientName: "Malabar Customs House",
  },
  {
    id: "TKT-004",
    subject: "ICEGATE filing rejected — IEC mismatch",
    category: "Technical",
    status: "Open",
    createdAt: "1 day ago",
    lastReply: "Please verify your IEC number in Settings → Profile.",
    clientId: "NVK-2026-J7K8L",
    clientName: "Chennai Clearance Agents",
  },
  {
    id: "TKT-005",
    subject: "Need to add a second branch",
    category: "General",
    status: "In Progress",
    createdAt: "3 days ago",
    lastReply: "Multi-branch is available on Pro. We'll upgrade your account today.",
    clientId: "NVK-2026-M9N0O",
    clientName: "Trans India Logistics",
  },
];

const STATUS_STYLE: Record<Ticket["status"], { bg: string; text: string }> = {
  Open: { bg: "rgba(212,175,55,0.12)", text: "#D4AF37" },
  "In Progress": { bg: "rgba(59,130,246,0.1)", text: "#2563eb" },
  Resolved: { bg: "rgba(34,197,94,0.1)", text: "#16a34a" },
};

export default function ClientTicketsPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  const [tickets, setTickets] = useState<Ticket[]>(isAdmin ? ALL_TICKETS : CLIENT_TICKETS);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState<"All" | Ticket["status"]>("All");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    const newTicket: Ticket = {
      id: `TKT-00${tickets.length + 1}`,
      subject: subject.trim(),
      category,
      status: "Open",
      createdAt: "Just now",
      lastReply: "Your ticket has been received. We'll respond shortly.",
    };
    setTickets([newTicket, ...tickets]);
    setSubject("");
    setCategory("Technical");
    setDescription("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const visibleTickets = filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Help &amp; Support
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          {isAdmin ? "All Support Tickets" : "Support Tickets"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          {isAdmin
            ? "All tickets from every client — manage and respond from here."
            : "Submit a request or track the status of your open tickets."}
        </p>
      </div>

      {/* Filter bar (admin only) */}
      {isAdmin && (
        <div className="flex items-center gap-2 mb-6">
          {(["All", "Open", "In Progress", "Resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all"
              style={{
                background: filter === f ? "#1a1c1c" : "rgba(0,0,0,0.05)",
                color: filter === f ? "#D4AF37" : "#7e7576",
              }}
            >
              {f}
              {f === "All" && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px]"
                  style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37" }}>
                  {tickets.length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className={isAdmin ? "flex flex-col gap-4" : "grid grid-cols-1 xl:grid-cols-3 gap-6"}>
        {/* Ticket List */}
        <div className={isAdmin ? "flex flex-col gap-4" : "xl:col-span-2 flex flex-col gap-4"}>
          {!isAdmin && (
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                Your Tickets
              </h2>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}
              >
                {tickets.length} total
              </span>
            </div>
          )}

          {visibleTickets.map((ticket) => {
            const statusStyle = STATUS_STYLE[ticket.status];
            return (
              <div
                key={ticket.id}
                className="rounded-xl border bg-white overflow-hidden transition-shadow hover:shadow-md"
                style={{ borderColor: "rgba(0,0,0,0.07)" }}
              >
                <div
                  className="px-5 py-4 flex items-center justify-between border-b"
                  style={{ background: "#f9f9fa", borderColor: "#E5E7EB" }}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-semibold" style={{ color: "#D4AF37" }}>
                      {ticket.id}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest"
                      style={{ background: statusStyle.bg, color: statusStyle.text }}
                    >
                      {ticket.status}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "rgba(0,0,0,0.04)", color: "#7e7576" }}
                    >
                      {ticket.category}
                    </span>
                    {isAdmin && ticket.clientName && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(21,101,192,0.08)", color: "#1565C0" }}
                      >
                        {ticket.clientName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: "#b0a8a9" }}>
                    {ticket.createdAt}
                  </span>
                </div>

                <div className="px-5 py-4">
                  <p className="font-semibold text-sm mb-2" style={{ color: "#1a1c1c" }}>
                    {ticket.subject}
                  </p>
                  <div className="flex items-start gap-2">
                    <span
                      className="material-symbols-outlined flex-shrink-0"
                      style={{ fontSize: 14, color: "#b0a8a9", marginTop: 1 }}
                    >
                      reply
                    </span>
                    <p className="text-xs" style={{ color: "#7e7576", lineHeight: 1.65 }}>
                      {ticket.lastReply}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {visibleTickets.length === 0 && (
            <div
              className="rounded-xl border bg-white flex flex-col items-center justify-center py-16"
              style={{ borderColor: "rgba(0,0,0,0.07)" }}
            >
              <span className="material-symbols-outlined mb-3" style={{ fontSize: 40, color: "#D4AF37" }}>
                support_agent
              </span>
              <p className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>No tickets found</p>
              <p className="text-xs mt-1" style={{ color: "#7e7576" }}>
                {isAdmin ? "No tickets match this filter." : "Submit a new ticket using the form."}
              </p>
            </div>
          )}
        </div>

        {/* New Ticket Form — clients only */}
        {!isAdmin && (
          <div
            className="rounded-xl border bg-white p-6 self-start"
            style={{ borderColor: "rgba(0,0,0,0.07)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#D4AF37" }}>
                add_circle
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
                New Ticket
              </h2>
            </div>

            {submitted && (
              <div
                className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold"
                style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                Ticket submitted successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: "#7e7576" }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe your issue"
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{ border: "1px solid #E5E7EB", color: "#1a1c1c", background: "#f9f9fa", fontFamily: "Inter, sans-serif" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: "#7e7576" }}
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all appearance-none"
                  style={{ border: "1px solid #E5E7EB", color: "#1a1c1c", background: "#f9f9fa", fontFamily: "Inter, sans-serif" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                >
                  <option value="Technical">Technical</option>
                  <option value="Billing">Billing</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: "#7e7576" }}
                >
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
                  style={{ border: "1px solid #E5E7EB", color: "#1a1c1c", background: "#f9f9fa", fontFamily: "Inter, sans-serif" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
                style={{ background: "#1a1c1c", color: "#D4AF37" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>send</span>
                Submit Ticket
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
