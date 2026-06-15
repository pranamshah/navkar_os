"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  clientId: string;
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: "rgba(34,197,94,0.1)", text: "#16a34a", label: "Active" },
  PENDING_VERIFICATION: { bg: "rgba(30,64,175,0.12)", text: "#1E40AF", label: "Pending" },
  REJECTED: { bg: "rgba(239,68,68,0.1)", text: "#dc2626", label: "Rejected" },
  SUSPENDED: { bg: "rgba(156,163,175,0.15)", text: "#6b7280", label: "Suspended" },
};

const COLUMNS = ["Client ID", "Name", "Email", "Business", "Type", "Status", "Joined", "Actions"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users?status=ALL&page=1");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.clientId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Admin
        </p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
              All Users
            </h1>
            <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
              Manage and view all registered clients on the platform.
            </p>
          </div>
          {!loading && (
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(30,64,175,0.1)", color: "#1E40AF" }}
            >
              {filtered.length} {filtered.length === 1 ? "user" : "users"}
            </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg max-w-sm"
          style={{ border: "1px solid #E5E7EB", background: "#ffffff" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#b0a8a9" }}>
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or client ID…"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#1a1c1c", fontFamily: "Inter, sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#b0a8a9" }}>
                close
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl border bg-white overflow-hidden"
        style={{ borderColor: "rgba(0,0,0,0.07)" }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#1E40AF", borderTopColor: "transparent" }}
            />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
              Loading users…
            </p>
          </div>
        ) : (
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
                      {search ? `No users matching "${search}"` : "No users found."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const s =
                      STATUS_STYLE[user.status] ?? STATUS_STYLE.PENDING_VERIFICATION;
                    return (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-[#fafafa]"
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                      >
                        <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap" style={{ color: "#1E40AF" }}>
                          {user.clientId}
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "#1a1c1c" }}>
                          {user.name || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#4c4546" }}>
                          {user.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#4c4546" }}>
                          {user.businessName || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#7e7576" }}>
                          {user.businessType || "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-widest"
                            style={{ background: s.bg, color: s.text }}
                          >
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#7e7576" }}>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link
                            href={`/dashboard/admin/verifications?id=${user.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-80"
                            style={{ background: "rgba(26,28,28,0.06)", color: "#1a1c1c" }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                              visibility
                            </span>
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
