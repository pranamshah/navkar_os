"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  city: string;
  state: string;
  gstin: string;
  pan: string;
  iecCode: string;
  chaLicenceNo: string;
  yearsInBusiness: string;
  gstCertPath: string;
  panCopyPath: string;
  licenceCopyPath: string;
  status: string;
  rejectionReason: string;
  verifiedAt: string;
  createdAt: string;
}

type StatusFilter = "ALL" | "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED";

const TABS: { label: string; value: StatusFilter; icon: string }[] = [
  { label: "All", value: "ALL", icon: "group" },
  { label: "Pending", value: "PENDING_VERIFICATION", icon: "pending" },
  { label: "Active", value: "ACTIVE", icon: "verified" },
  { label: "Rejected", value: "REJECTED", icon: "cancel" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: "rgba(34,197,94,0.1)", text: "#16a34a", label: "Active" },
  PENDING_VERIFICATION: { bg: "rgba(212,175,55,0.12)", text: "#D4AF37", label: "Pending" },
  REJECTED: { bg: "rgba(239,68,68,0.1)", text: "#dc2626", label: "Rejected" },
  SUSPENDED: { bg: "rgba(156,163,175,0.15)", text: "#6b7280", label: "Suspended" },
};

function DocViewer({ label, url, onClose }: { label: string; url: string; onClose: () => void }) {
  const isPdf = url.includes("application/pdf") || url.toLowerCase().endsWith(".pdf");
  // Convert data: URL to blob URL so browser renders it properly
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  useEffect(() => {
    if (url.startsWith("data:")) {
      const arr = url.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] ?? "application/octet-stream";
      const bstr = atob(arr[1]);
      const u8 = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
      const blob = new Blob([u8], { type: mime });
      const objUrl = URL.createObjectURL(blob);
      setBlobUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    } else {
      setBlobUrl(url);
    }
  }, [url]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-lg overflow-hidden shadow-2xl"
        style={{ width: "min(860px, 96vw)", height: "90vh", background: "#1a1c1c" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-sm font-semibold" style={{ color: "#D4AF37" }}>{label}</span>
          <div className="flex items-center gap-3">
            {blobUrl && (
              <a
                href={blobUrl}
                download={`${label.replace(/\s+/g, "_")}.${isPdf ? "pdf" : "jpg"}`}
                className="text-xs px-3 py-1.5 rounded font-semibold transition-colors"
                style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37" }}
              >
                Download
              </a>
            )}
            <button onClick={onClose} className="text-xs px-3 py-1.5 rounded font-semibold" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
              Close ✕
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
          {!blobUrl ? (
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Loading…</div>
          ) : isPdf ? (
            <iframe src={blobUrl} className="w-full h-full rounded" style={{ border: "none", minHeight: "600px" }} title={label} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={blobUrl} alt={label} className="max-w-full max-h-full object-contain rounded" />
          )}
        </div>
      </div>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url?: string }) {
  const [open, setOpen] = useState(false);
  if (!url) return (
    <div className="flex items-center gap-2 py-2 px-3 rounded border" style={{ borderColor: "rgba(0,0,0,0.08)", background: "#f9f9f9" }}>
      <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#b0a8a9" }}>attach_file</span>
      <span className="text-xs" style={{ color: "#b0a8a9" }}>{label} — Not uploaded</span>
    </div>
  );
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 py-2 px-3 rounded border transition-colors hover:border-[#D4AF37]"
        style={{ borderColor: "rgba(0,0,0,0.08)", background: "#f9f9f9" }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#D4AF37" }}>description</span>
        <span className="text-xs font-semibold" style={{ color: "#1a1c1c" }}>{label}</span>
        <span className="text-xs ml-auto" style={{ color: "#7e7576" }}>View →</span>
      </button>
      {open && <DocViewer label={label} url={url} onClose={() => setOpen(false)} />}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#b0a8a9" }}>{label}</p>
      <p className="text-sm" style={{ color: value ? "#1a1c1c" : "#b0a8a9" }}>{value || "—"}</p>
    </div>
  );
}

export default function VerificationsPage() {
  const [tab, setTab] = useState<StatusFilter>("PENDING_VERIFICATION");
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Action modal state
  const [action, setAction] = useState<"approve" | "reject" | "request_docs" | null>(null);
  const [reason, setReason] = useState("");
  const [docsNeeded, setDocsNeeded] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?status=${tab}&page=${page}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const openDrawer = (u: User) => {
    setSelected(u);
    setDrawerOpen(true);
    setAction(null);
    setReason("");
    setDocsNeeded("");
    setActionMsg("");
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
    setAction(null);
  };

  const handleAction = async () => {
    if (!selected || !action) return;
    setActionLoading(true);
    setActionMsg("");
    try {
      const res = await fetch(`/api/admin/verify/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason, docsNeeded }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        setTimeout(() => {
          closeDrawer();
          loadUsers();
        }, 1200);
      } else {
        setActionMsg(data.error || "Something went wrong");
      }
    } catch {
      setActionMsg("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const tabCounts: Record<StatusFilter, number> = {
    ALL: total,
    PENDING_VERIFICATION: 0,
    ACTIVE: 0,
    REJECTED: 0,
  };

  return (
    <div className="p-8 relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          Verifications
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Review and verify client account applications
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit border"
        style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
      >
        {TABS.map(({ label, value, icon }) => {
          const active = tab === value;
          return (
            <button
              key={value}
              onClick={() => { setTab(value); setPage(1); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-200"
              style={{
                background: active ? "#1a1c1c" : "transparent",
                color: active ? "#D4AF37" : "#7e7576",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
            {total} {tab === "ALL" ? "total" : tab.toLowerCase().replace("_", " ")} users
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div
              className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }}
            />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#e5e5e5" }}>inbox</span>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b0a8a9" }}>
              No users found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  {["Client ID", "Name / Email", "Business", "GSTIN", "City", "Status", "Joined", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-semibold uppercase tracking-widest"
                      style={{ color: "#b0a8a9" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const s = STATUS_COLORS[u.status] ?? STATUS_COLORS.PENDING_VERIFICATION;
                  return (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-[rgba(0,0,0,0.015)] cursor-pointer"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                      onClick={() => openDrawer(u)}
                    >
                      <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#D4AF37" }}>
                        {u.clientId}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: "#1a1c1c" }}>{u.name}</p>
                        <p style={{ color: "#7e7576" }}>{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: "#4c4546" }}>{u.businessName || "—"}</p>
                        <p style={{ color: "#7e7576" }}>{u.businessType || "—"}</p>
                      </td>
                      <td className="px-4 py-3 font-mono" style={{ color: "#4c4546" }}>
                        {u.gstin || "—"}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#7e7576" }}>
                        {u.city || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-widest"
                          style={{ background: s.bg, color: s.text }}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#7e7576" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); openDrawer(u); }}
                          className="px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-80"
                          style={{ background: "#1a1c1c", color: "#D4AF37" }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t flex items-center gap-2" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-widest transition-all disabled:opacity-30"
              style={{ background: "rgba(0,0,0,0.05)", color: "#4c4546" }}
            >
              ← Prev
            </button>
            <span className="text-xs font-semibold" style={{ color: "#7e7576" }}>
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-widest transition-all disabled:opacity-30"
              style={{ background: "rgba(0,0,0,0.05)", color: "#4c4546" }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Side Drawer */}
      {drawerOpen && selected && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div
            className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-y-auto"
            style={{
              width: "min(560px, 95vw)",
              background: "#ffffff",
              borderLeft: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
            }}
          >
            {/* Drawer Header */}
            <div
              className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
              style={{ borderColor: "rgba(0,0,0,0.07)", background: "#1a1c1c" }}
            >
              <div>
                <p className="font-mono text-sm font-semibold" style={{ color: "#D4AF37" }}>
                  {selected.clientId}
                </p>
                <p className="text-base font-black" style={{ color: "#ffffff" }}>
                  {selected.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {(() => {
                  const s = STATUS_COLORS[selected.status] ?? STATUS_COLORS.PENDING_VERIFICATION;
                  return (
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold uppercase tracking-widest"
                      style={{ background: "rgba(212,175,55,0.15)", color: s.text }}
                    >
                      {s.label}
                    </span>
                  );
                })()}
                <button
                  onClick={closeDrawer}
                  className="w-8 h-8 rounded flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#ffffff" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
              {/* Business Info */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0a8a9" }}>
                  Business Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="Business Name" value={selected.businessName} />
                  <DetailRow label="Business Type" value={selected.businessType} />
                  <DetailRow label="Years in Business" value={selected.yearsInBusiness} />
                  <DetailRow label="City" value={selected.city} />
                  <DetailRow label="State" value={selected.state} />
                  <DetailRow label="Phone" value={selected.phone} />
                  <DetailRow label="WhatsApp" value={selected.whatsapp} />
                  <DetailRow label="Email" value={selected.email} />
                </div>
                {selected.businessAddress && (
                  <div className="mt-3">
                    <DetailRow label="Business Address" value={selected.businessAddress} />
                  </div>
                )}
              </section>

              {/* Tax / Compliance */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0a8a9" }}>
                  Tax & Compliance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow label="GSTIN" value={selected.gstin} />
                  <DetailRow label="PAN" value={selected.pan} />
                  {selected.iecCode && <DetailRow label="IEC Code" value={selected.iecCode} />}
                  {selected.chaLicenceNo && <DetailRow label="CHA Licence No." value={selected.chaLicenceNo} />}
                </div>
              </section>

              {/* Documents */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0a8a9" }}>
                  Documents
                </h3>
                <div className="flex flex-col gap-2">
                  <DocLink label="GST Certificate" url={selected.gstCertPath} />
                  <DocLink label="PAN Copy" url={selected.panCopyPath} />
                  <DocLink label="Licence Copy" url={selected.licenceCopyPath} />
                </div>
              </section>

              {/* Rejection reason if any */}
              {selected.rejectionReason && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#dc2626" }}>
                    Rejection Reason
                  </h3>
                  <p className="text-sm p-3 rounded border" style={{ color: "#4c4546", borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
                    {selected.rejectionReason}
                  </p>
                </section>
              )}

              {/* Action Panel */}
              {selected.status === "PENDING_VERIFICATION" && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0a8a9" }}>
                    Actions
                  </h3>

                  {!action ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setAction("approve")}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-lg border text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)", color: "#16a34a" }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                        Approve Account
                      </button>
                      <button
                        onClick={() => setAction("request_docs")}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-lg border text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.25)", color: "#D4AF37" }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>description</span>
                        Request Documents
                      </button>
                      <button
                        onClick={() => setAction("reject")}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-lg border text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)", color: "#dc2626" }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>cancel</span>
                        Reject Application
                      </button>
                    </div>
                  ) : (
                    <div
                      className="p-4 rounded-lg border"
                      style={{
                        borderColor: action === "approve" ? "rgba(34,197,94,0.2)" : action === "reject" ? "rgba(239,68,68,0.2)" : "rgba(212,175,55,0.25)",
                        background: action === "approve" ? "rgba(34,197,94,0.04)" : action === "reject" ? "rgba(239,68,68,0.04)" : "rgba(212,175,55,0.04)",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7e7576" }}>
                        {action === "approve" ? "Confirm Approval" : action === "reject" ? "Reason for Rejection" : "Documents Required"}
                      </p>

                      {action === "approve" && (
                        <p className="text-sm mb-4" style={{ color: "#4c4546" }}>
                          This will activate <strong>{selected.name}</strong>&apos;s account and send them a welcome email.
                        </p>
                      )}

                      {action === "reject" && (
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Explain why the application is being rejected..."
                          rows={3}
                          className="w-full px-3 py-2 rounded border text-sm mb-3 resize-none outline-none"
                          style={{ borderColor: "rgba(239,68,68,0.25)", background: "#ffffff", color: "#1a1c1c" }}
                        />
                      )}

                      {action === "request_docs" && (
                        <textarea
                          value={docsNeeded}
                          onChange={(e) => setDocsNeeded(e.target.value)}
                          placeholder="List the documents needed, e.g. Clear copy of GST certificate, PAN copy..."
                          rows={3}
                          className="w-full px-3 py-2 rounded border text-sm mb-3 resize-none outline-none"
                          style={{ borderColor: "rgba(212,175,55,0.25)", background: "#ffffff", color: "#1a1c1c" }}
                        />
                      )}

                      {actionMsg && (
                        <p className="text-xs font-semibold mb-3" style={{ color: actionMsg.includes("error") || actionMsg.includes("wrong") ? "#dc2626" : "#16a34a" }}>
                          {actionMsg}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={handleAction}
                          disabled={actionLoading || (action === "reject" && !reason.trim()) || (action === "request_docs" && !docsNeeded.trim())}
                          className="flex-1 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-widest transition-all disabled:opacity-40"
                          style={{ background: "#1a1c1c", color: "#D4AF37" }}
                        >
                          {actionLoading ? "Processing..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => { setAction(null); setReason(""); setDocsNeeded(""); }}
                          className="px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-widest transition-all"
                          style={{ background: "rgba(0,0,0,0.06)", color: "#7e7576" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
