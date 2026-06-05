"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Nature = "ASSETS" | "LIABILITIES" | "INCOME" | "EXPENSE";

interface LedgerGroup {
  id: string;
  name: string;
  nature: Nature;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  isSystem: boolean;
  children: { id: string; name: string }[];
  _count: { ledgers: number };
}

const natureColors: Record<Nature, { text: string; bg: string; border: string }> = {
  ASSETS: { text: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  LIABILITIES: { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  INCOME: { text: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC" },
  EXPENSE: { text: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
};

const emptyForm = {
  name: "",
  nature: "" as Nature | "",
  parentId: "",
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<LedgerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<LedgerGroup | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<LedgerGroup | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/accura/groups")
      .then((r) => r.json())
      .then((data) => setGroups(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.nature.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(group: LedgerGroup) {
    setEditTarget(group);
    setForm({
      name: group.name,
      nature: group.nature,
      parentId: group.parentId ?? "",
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    if (!form.nature) { setFormError("Nature is required."); return; }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        nature: form.nature,
        parentId: form.parentId || null,
      };

      if (editTarget) {
        const res = await fetch("/api/accura/groups", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editTarget.id, ...payload }),
        });
        if (!res.ok) { const d = await res.json(); setFormError(d.error ?? "Failed to update."); return; }
        const updated: LedgerGroup = await res.json();
        setGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      } else {
        const res = await fetch("/api/accura/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) { const d = await res.json(); setFormError(d.error ?? "Failed to create."); return; }
        const created: LedgerGroup = await res.json();
        setGroups((prev) => [...prev, created]);
      }
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError("");
    setDeleting(true);
    try {
      const res = await fetch(`/api/accura/groups?id=${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { setDeleteError(data.error ?? "Failed to delete."); return; }
      setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  // Exclude the group being edited from parent options to prevent circular refs
  const parentOptions = groups.filter((g) => !editTarget || g.id !== editTarget.id);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif", background: "#F8FAFC", minHeight: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Ledger Groups</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            {loading ? "Loading..." : `${filtered.length} group${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2" style={{ fontSize: 15, color: "#9CA3AF" }}>search</span>
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md border text-[13px] outline-none focus:ring-1"
              style={{ borderColor: "#E5E7EB", background: "#fff", color: "#111827", width: 220 }}
            />
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white"
            style={{ background: "#0E7490" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Group
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#0E7490", borderTopColor: "transparent" }} />
            <span className="ml-3 text-[13px]" style={{ color: "#6B7280" }}>Loading groups...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#D1D5DB" }}>folder_open</span>
            <p className="text-[13px]" style={{ color: "#6B7280" }}>
              {search ? "No groups match your search." : "No groups yet. Create your first ledger group."}
            </p>
            {!search && (
              <button
                onClick={openNew}
                className="mt-1 px-4 py-2 rounded-md text-[13px] text-white"
                style={{ background: "#0E7490" }}
              >
                + New Group
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Nature</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Parent Group</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Ledgers</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>System</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((group, i) => {
                const nc = natureColors[group.nature] ?? natureColors.ASSETS;
                return (
                  <motion.tr
                    key={group.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className="border-b group"
                    style={{ borderColor: "#F3F4F6" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: nc.bg }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14, color: nc.text }}>folder</span>
                        </div>
                        <span className="font-medium" style={{ color: "#111827" }}>{group.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: nc.bg, color: nc.text, border: `1px solid ${nc.border}` }}
                      >
                        {group.nature}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {group.parent ? (
                        <span className="text-[13px]" style={{ color: "#374151" }}>{group.parent.name}</span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>Root</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: group._count.ledgers > 0 ? "#EFF6FF" : "#F9FAFB",
                          color: group._count.ledgers > 0 ? "#1D4ED8" : "#9CA3AF",
                        }}
                      >
                        {group._count.ledgers}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {group.isSystem ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}>Yes</span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "#F9FAFB", color: "#9CA3AF" }}>No</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(group)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#6B7280" }}>edit</span>
                        </button>
                        <button
                          onClick={() => { setDeleteTarget(group); setDeleteError(""); }}
                          disabled={group.isSystem}
                          className="p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={group.isSystem ? "System groups cannot be deleted" : "Delete"}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#DC2626" }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Nature legend */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center gap-4 mt-3">
          {(Object.entries(natureColors) as [Nature, typeof natureColors.ASSETS][]).map(([nature, c]) => (
            <div key={nature} className="flex items-center gap-1.5 text-[11px]">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text }} />
              <span style={{ color: "#6B7280" }}>{nature.charAt(0) + nature.slice(1).toLowerCase()}</span>
            </div>
          ))}
        </div>
      )}

      {/* New / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-xl p-6 w-full"
              style={{ background: "#fff", maxWidth: 480 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold" style={{ color: "#111827" }}>
                  {editTarget ? "Edit Group" : "New Ledger Group"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100">
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#6B7280" }}>close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>
                    Name <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Bank Accounts"
                    className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                    autoFocus
                  />
                </div>

                {/* Nature */}
                <div>
                  <label className="block text-[12px] font-medium mb-1.5" style={{ color: "#374151" }}>
                    Nature <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["ASSETS", "LIABILITIES", "INCOME", "EXPENSE"] as Nature[]).map((n) => {
                      const nc = natureColors[n];
                      const selected = form.nature === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, nature: n }))}
                          className="px-3 py-2 rounded-md border text-[12px] font-medium text-left transition-all"
                          style={{
                            borderColor: selected ? nc.text : "#E5E7EB",
                            background: selected ? nc.bg : "#fff",
                            color: selected ? nc.text : "#374151",
                          }}
                        >
                          {n.charAt(0) + n.slice(1).toLowerCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Parent Group */}
                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>Parent Group (optional)</label>
                  <select
                    value={form.parentId}
                    onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                  >
                    <option value="">None (Root group)</option>
                    {parentOptions.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {formError && (
                  <p className="text-[12px] px-3 py-2 rounded-md" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-md text-[13px] font-medium border"
                    style={{ borderColor: "#E5E7EB", color: "#374151" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-md text-[13px] font-medium text-white flex items-center justify-center gap-2"
                    style={{ background: submitting ? "#9CA3AF" : "#0E7490" }}
                  >
                    {submitting && <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                    {submitting ? "Saving..." : editTarget ? "Update Group" : "Create Group"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-xl p-6 w-full"
              style={{ background: "#fff", maxWidth: 400 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#FEF2F2" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#DC2626" }}>warning</span>
                </div>
                <h3 className="text-base font-semibold" style={{ color: "#111827" }}>Delete Group</h3>
              </div>
              <p className="text-[13px] mb-2" style={{ color: "#6B7280" }}>
                Delete <strong style={{ color: "#111827" }}>{deleteTarget.name}</strong>? This cannot be undone.
              </p>
              {deleteTarget._count.ledgers > 0 && (
                <p className="text-[12px] px-3 py-2 rounded-md mb-3" style={{ background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}>
                  This group has {deleteTarget._count.ledgers} linked ledger(s) and cannot be deleted.
                </p>
              )}
              {deleteError && (
                <p className="text-[12px] px-3 py-2 rounded-md mb-3" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                  {deleteError}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2 rounded-md text-[13px] font-medium border"
                  style={{ borderColor: "#E5E7EB", color: "#374151" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting || deleteTarget._count.ledgers > 0}
                  className="flex-1 px-4 py-2 rounded-md text-[13px] font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#DC2626" }}
                >
                  {deleting && <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
