"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Nature = "ASSETS" | "LIABILITIES" | "INCOME" | "EXPENSE";

interface LedgerGroup {
  id: string;
  name: string;
  nature: Nature;
}

interface Ledger {
  id: string;
  name: string;
  groupId: string;
  group: { id: string; name: string; nature: Nature };
  openingBalance: number;
  openingType: "Dr" | "Cr";
  gstin?: string | null;
  pan?: string | null;
  creditPeriod: number;
  billByBill: boolean;
  isFreightLedger: boolean;
  isActive: boolean;
}

const natureColors: Record<Nature, { text: string; bg: string; border: string }> = {
  ASSETS: { text: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  LIABILITIES: { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  INCOME: { text: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC" },
  EXPENSE: { text: "#1E40AF", bg: "#FFFBEB", border: "#FDE68A" },
};

const natureIcon: Record<Nature, string> = {
  ASSETS: "account_balance_wallet",
  LIABILITIES: "credit_card",
  INCOME: "trending_up",
  EXPENSE: "receipt",
};

function fmt(n: number) {
  return "₹" + (n ?? 0).toLocaleString("en-IN");
}

const emptyForm = {
  name: "",
  groupId: "",
  openingBalance: "",
  openingType: "Dr" as "Dr" | "Cr",
  gstin: "",
  pan: "",
  creditPeriod: "",
  billByBill: false,
  isFreightLedger: false,
};

export default function LedgersPage() {
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [groups, setGroups] = useState<LedgerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Ledger | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Ledger | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/accura/ledgers").then((r) => r.json()),
      fetch("/api/accura/groups").then((r) => r.json()),
    ])
      .then(([ledgerData, groupData]) => {
        setLedgers(Array.isArray(ledgerData) ? ledgerData : []);
        setGroups(Array.isArray(groupData) ? groupData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = ledgers.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.group?.name?.toLowerCase().includes(search.toLowerCase());
    const matchGroup = groupFilter === "all" || l.groupId === groupFilter;
    return matchSearch && matchGroup;
  });

  function openNew() {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(ledger: Ledger) {
    setEditTarget(ledger);
    setForm({
      name: ledger.name,
      groupId: ledger.groupId,
      openingBalance: String(ledger.openingBalance ?? ""),
      openingType: ledger.openingType ?? "Dr",
      gstin: ledger.gstin ?? "",
      pan: ledger.pan ?? "",
      creditPeriod: String(ledger.creditPeriod ?? ""),
      billByBill: ledger.billByBill ?? false,
      isFreightLedger: ledger.isFreightLedger ?? false,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    if (!form.groupId) { setFormError("Please select a group."); return; }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        groupId: form.groupId,
        openingBalance: parseFloat(form.openingBalance) || 0,
        openingType: form.openingType,
        gstin: form.gstin || null,
        pan: form.pan || null,
        creditPeriod: parseInt(form.creditPeriod) || 0,
        billByBill: form.billByBill,
        isFreightLedger: form.isFreightLedger,
      };

      if (editTarget) {
        const res = await fetch("/api/accura/ledgers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editTarget.id, ...payload }),
        });
        if (!res.ok) { const d = await res.json(); setFormError(d.error ?? "Failed to update."); return; }
        const updated: Ledger = await res.json();
        setLedgers((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      } else {
        const res = await fetch("/api/accura/ledgers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) { const d = await res.json(); setFormError(d.error ?? "Failed to create."); return; }
        const created: Ledger = await res.json();
        setLedgers((prev) => [...prev, created]);
      }
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/accura/ledgers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id, isActive: false }),
      });
      if (res.ok) {
        setLedgers((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  }

  const uniqueGroups = groups.filter((g) => ledgers.some((l) => l.groupId === g.id));

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif", background: "#F8FAFC", minHeight: "100%" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Ledgers</h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            {loading ? "Loading..." : `${filtered.length} ledger${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2" style={{ fontSize: 15, color: "#9CA3AF" }}>search</span>
            <input
              type="text"
              placeholder="Search ledgers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md border text-[13px] outline-none focus:ring-1"
              style={{ borderColor: "#E5E7EB", background: "#fff", color: "#111827", width: 220 }}
            />
          </div>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md border text-[13px] outline-none cursor-pointer"
            style={{ borderColor: "#E5E7EB", background: "#fff", color: "#374151" }}
          >
            <option value="all">All Groups</option>
            {uniqueGroups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white"
            style={{ background: "#0E7490" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
            New Ledger
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#0E7490", borderTopColor: "transparent" }} />
            <span className="ml-3 text-[13px]" style={{ color: "#6B7280" }}>Loading ledgers...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#D1D5DB" }}>account_balance</span>
            <p className="text-[13px]" style={{ color: "#6B7280" }}>
              {search || groupFilter !== "all" ? "No ledgers match your filters." : "No ledgers yet. Create your first ledger."}
            </p>
            {!search && groupFilter === "all" && (
              <button
                onClick={openNew}
                className="mt-1 px-4 py-2 rounded-md text-[13px] text-white"
                style={{ background: "#0E7490" }}
              >
                + New Ledger
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Group</th>
                <th className="text-right px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Opening Bal</th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>GSTIN</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Bill-by-Bill</th>
                <th className="text-center px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ledger, i) => {
                const nature = ledger.group?.nature as Nature ?? "ASSETS";
                const gc = natureColors[nature] ?? natureColors.ASSETS;
                const icon = natureIcon[nature] ?? "account_balance_wallet";
                return (
                  <motion.tr
                    key={ledger.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className="border-b cursor-pointer group"
                    style={{ borderColor: "#F3F4F6" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: gc.bg }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14, color: gc.text }}>{icon}</span>
                        </div>
                        <span className="font-medium" style={{ color: "#111827" }}>{ledger.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: gc.bg, color: gc.text, border: `1px solid ${gc.border}` }}
                      >
                        {ledger.group?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      <span style={{ color: ledger.openingType === "Dr" ? "#059669" : "#DC2626" }}>
                        {fmt(ledger.openingBalance)}
                      </span>
                      <span className="ml-1 text-[10px]" style={{ color: "#9CA3AF" }}>{ledger.openingType}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      {ledger.gstin ? (
                        <span className="font-mono text-[11px]" style={{ color: "#374151" }}>{ledger.gstin}</span>
                      ) : (
                        <span style={{ color: "#D1D5DB" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: ledger.billByBill ? "#059669" : "#D1D5DB" }}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(ledger)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#6B7280" }}>edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(ledger)}
                          className="p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
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

      {/* Legend */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center gap-4 mt-3">
          {(Object.entries(natureColors) as [Nature, typeof natureColors.ASSETS][]).map(([type, c]) => (
            <div key={type} className="flex items-center gap-1.5 text-[11px]">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.text }} />
              <span style={{ color: "#6B7280" }}>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-end"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="h-full overflow-y-auto"
              style={{ background: "#fff", width: 480, padding: "24px" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold" style={{ color: "#111827" }}>
                  {editTarget ? "Edit Ledger" : "New Ledger"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded hover:bg-gray-100"
                >
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
                    placeholder="e.g. HDFC Bank Current Account"
                    className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                  />
                </div>

                {/* Group */}
                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>
                    Group <span style={{ color: "#DC2626" }}>*</span>
                  </label>
                  {groups.length === 0 ? (
                    <p className="text-[12px] py-2 px-3 rounded-md border" style={{ borderColor: "#E5E7EB", color: "#6B7280", background: "#F9FAFB" }}>
                      No groups found. Create groups first.
                    </p>
                  ) : (
                    <select
                      value={form.groupId}
                      onChange={(e) => setForm((f) => ({ ...f, groupId: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1"
                      style={{ borderColor: "#E5E7EB", color: "#111827" }}
                    >
                      <option value="">Select a group...</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>{g.name} ({g.nature})</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Opening Balance + Dr/Cr */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>Opening Balance</label>
                    <input
                      type="number"
                      value={form.openingBalance}
                      onChange={(e) => setForm((f) => ({ ...f, openingBalance: e.target.value }))}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1"
                      style={{ borderColor: "#E5E7EB", color: "#111827" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>Type</label>
                    <div className="flex rounded-md border overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
                      {(["Dr", "Cr"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, openingType: t }))}
                          className="px-4 py-2 text-[13px] font-medium transition-colors"
                          style={{
                            background: form.openingType === t ? "#0E7490" : "#fff",
                            color: form.openingType === t ? "#fff" : "#374151",
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* GSTIN */}
                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>GSTIN (optional)</label>
                  <input
                    type="text"
                    value={form.gstin}
                    onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))}
                    placeholder="27AABCR1234A1Z5"
                    maxLength={15}
                    className="w-full px-3 py-2 rounded-md border text-[13px] font-mono outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                  />
                </div>

                {/* PAN */}
                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>PAN (optional)</label>
                  <input
                    type="text"
                    value={form.pan}
                    onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value.toUpperCase() }))}
                    placeholder="AABCR1234A"
                    maxLength={10}
                    className="w-full px-3 py-2 rounded-md border text-[13px] font-mono outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                  />
                </div>

                {/* Credit Period */}
                <div>
                  <label className="block text-[12px] font-medium mb-1" style={{ color: "#374151" }}>Credit Period (days)</label>
                  <input
                    type="number"
                    value={form.creditPeriod}
                    onChange={(e) => setForm((f) => ({ ...f, creditPeriod: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:ring-1"
                    style={{ borderColor: "#E5E7EB", color: "#111827" }}
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-1">
                  {[
                    { key: "billByBill" as const, label: "Bill-by-Bill tracking", desc: "Track outstanding bills individually" },
                    { key: "isFreightLedger" as const, label: "Is Freight Ledger", desc: "Used for freight charges in shipments" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: "#111827" }}>{label}</p>
                        <p className="text-[11px]" style={{ color: "#6B7280" }}>{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                        style={{ background: form[key] ? "#0E7490" : "#D1D5DB" }}
                      >
                        <span
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                          style={{ transform: form[key] ? "translateX(22px)" : "translateX(2px)" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {formError && (
                  <p className="text-[12px] px-3 py-2 rounded-md" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
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
                    {submitting && (
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    )}
                    {submitting ? "Saving..." : editTarget ? "Update Ledger" : "Create Ledger"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
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
                <h3 className="text-base font-semibold" style={{ color: "#111827" }}>Delete Ledger</h3>
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
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-md text-[13px] font-medium text-white flex items-center justify-center gap-2"
                  style={{ background: deleting ? "#9CA3AF" : "#DC2626" }}
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
