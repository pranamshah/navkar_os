"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "accura_cost_centres";

interface CostCentre {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  createdAt: string;
}

const emptyForm = {
  name: "",
  code: "",
  description: "",
};

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function CostCentresPage() {
  const [items, setItems] = useState<CostCentre[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<CostCentre | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<CostCentre | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  // Save to localStorage whenever items change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const filtered = items.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(item: CostCentre) {
    setEditTarget(item);
    setForm({ name: item.name, code: item.code, description: item.description });
    setFormError("");
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) { setFormError("Name is required."); return; }

    if (editTarget) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === editTarget.id
            ? { ...c, name: form.name.trim(), code: form.code.trim(), description: form.description.trim() }
            : c
        )
      );
    } else {
      const newItem: CostCentre = {
        id: generateId(),
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim(),
        active: true,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  }

  function toggleActive(id: string) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((c) => c.id !== id));
    setDeleteTarget(null);
  }

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif", background: "#F8FAFC", minHeight: "100%" }}>
      {/* Local storage notice */}
      <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-lg mb-5 text-[12px]"
        style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}
      >
        <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ fontSize: 16 }}>info</span>
        <span>Cost centres are stored locally and will be synced to the cloud in a future update.</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Cost Centres</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            {loaded ? `${filtered.length} cost centre${filtered.length !== 1 ? "s" : ""}` : "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2" style={{ fontSize: 15, color: "#9CA3AF" }}>search</span>
            <input
              type="text"
              placeholder="Search cost centres..."
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
            New Cost Centre
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        {!loaded ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#0E7490", borderTopColor: "transparent" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#D1D5DB" }}>category</span>
            <p className="text-[13px]" style={{ color: "#6B7280" }}>
              {search ? "No cost centres match your search." : "No cost centres yet. Create your first one."}
            </p>
            {!search && (
              <button
                onClick={openNew}
                className="mt-1 px-4 py-2 rounded-md text-[13px] text-white"
                style={{ background: "#0E7490" }}
              >
                + New Cost Centre
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Code</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Description</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Active</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.id}
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
                      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#ECFEFF" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#0E7490" }}>category</span>
                      </div>
                      <span className="font-medium" style={{ color: "#111827" }}>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    {item.code ? (
                      <span className="font-mono text-[12px] px-2 py-0.5 rounded" style={{ background: "#F3F4F6", color: "#374151" }}>
                        {item.code}
                      </span>
                    ) : (
                      <span style={{ color: "#D1D5DB" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: item.description ? "#374151" : "#D1D5DB" }}>
                    {item.description || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => toggleActive(item.id)}
                      className="relative w-10 h-5 rounded-full transition-colors"
                      style={{ background: item.active ? "#0E7490" : "#D1D5DB" }}
                      title={item.active ? "Click to deactivate" : "Click to activate"}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                        style={{ transform: item.active ? "translateX(22px)" : "translateX(2px)" }}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#6B7280" }}>edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#DC2626" }}>delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
                  {editTarget ? "Edit Cost Centre" : "New Cost Centre"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100">
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#6B7280" }}>close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>
                    Name <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Mumbai Branch"
                    className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>Code (optional)</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. MUM-001"
                    className="w-full px-3 py-2 rounded-md border text-[13px] font-mono outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>Description (optional)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of this cost centre..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1 resize-none"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                  />
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
                    className="flex-1 px-4 py-2.5 rounded-md text-[13px] font-medium text-white"
                    style={{ background: "#0E7490" }}
                  >
                    {editTarget ? "Update" : "Create Cost Centre"}
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
                <h3 className="text-base font-semibold" style={{ color: "#111827" }}>Delete Cost Centre</h3>
              </div>
              <p className="text-[13px] mb-5" style={{ color: "#6B7280" }}>
                Delete <strong style={{ color: "#111827" }}>{deleteTarget.name}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2 rounded-md text-[13px] font-medium border"
                  style={{ borderColor: "#E5E7EB", color: "#374151" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteTarget.id)}
                  className="flex-1 px-4 py-2 rounded-md text-[13px] font-medium text-white"
                  style={{ background: "#DC2626" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
