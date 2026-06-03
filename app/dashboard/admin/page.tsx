"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  rejectedUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  openTickets: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

interface RecentUser {
  id: string;
  clientId: string;
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  city: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: "rgba(34,197,94,0.1)", text: "#16a34a", label: "Active" },
  PENDING_VERIFICATION: { bg: "rgba(212,175,55,0.12)", text: "#D4AF37", label: "Pending" },
  REJECTED: { bg: "rgba(239,68,68,0.1)", text: "#dc2626", label: "Rejected" },
  SUSPENDED: { bg: "rgba(156,163,175,0.15)", text: "#6b7280", label: "Suspended" },
};

function KPICard({ label, value, icon, sub, accent }: {
  label: string; value: string | number; icon: string; sub?: string; accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 border"
      style={{
        background: accent ? "#1a1c1c" : "#ffffff",
        borderColor: accent ? "rgba(212,175,55,0.25)" : "rgba(0,0,0,0.07)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent ? "rgba(255,255,255,0.5)" : "#7e7576" }}>
          {label}
        </span>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, color: accent ? "#D4AF37" : "#b0a8a9" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: accent ? "#D4AF37" : "#1a1c1c" }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: accent ? "rgba(255,255,255,0.4)" : "#7e7576" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-4 py-3 border"
        style={{ background: "#1a1c1c", borderColor: "rgba(212,175,55,0.25)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          {label}
        </p>
        <p className="text-sm font-black" style={{ color: "#D4AF37" }}>
          ₹{Number(payload[0].value).toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users?status=ALL&page=1"),
        ]);
        const statsData = await statsRes.json();
        const usersData = await usersRes.json();
        setStats(statsData);
        setRecent((usersData.users || []).slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
            Loading
          </p>
        </div>
      </div>
    );
  }

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          Dashboard Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Platform metrics and recent activity
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon="group"
          sub="All registered clients"
        />
        <KPICard
          label="Active"
          value={stats?.activeUsers ?? 0}
          icon="verified"
          sub="Verified accounts"
        />
        <KPICard
          label="Pending"
          value={stats?.pendingUsers ?? 0}
          icon="pending"
          sub="Awaiting verification"
          accent
        />
        <KPICard
          label="Rejected"
          value={stats?.rejectedUsers ?? 0}
          icon="cancel"
          sub="Rejected applications"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPICard
          label="Total Revenue"
          value={fmtCurrency(stats?.totalRevenue ?? 0)}
          icon="payments"
          sub="All paid invoices"
        />
        <KPICard
          label="Active Subscriptions"
          value={stats?.activeSubscriptions ?? 0}
          icon="subscriptions"
          sub="Trial + Active plans"
        />
        <KPICard
          label="Open Tickets"
          value={stats?.openTickets ?? 0}
          icon="support_agent"
          sub="Awaiting resolution"
        />
      </div>

      {/* Revenue Chart + Recent Signups */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div
          className="lg:col-span-2 rounded-xl p-6 border"
          style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>
            Monthly Revenue (6 months)
          </h2>
          {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.monthlyRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#7e7576", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#7e7576" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,175,55,0.06)" }} />
                <Bar
                  dataKey="revenue"
                  fill="#D4AF37"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-xs" style={{ color: "#b0a8a9" }}>No revenue data yet</p>
            </div>
          )}
        </div>

        {/* Recent Signups */}
        <div
          className="lg:col-span-3 rounded-xl border overflow-hidden"
          style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
              Recent Signups
            </h2>
            <a
              href="/dashboard/admin/verifications"
              className="text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
              style={{ color: "#D4AF37" }}
            >
              View All →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  {["Client ID", "Name", "Business", "City", "Status", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-semibold uppercase tracking-widest"
                      style={{ color: "#b0a8a9" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "#b0a8a9" }}>
                      No signups yet
                    </td>
                  </tr>
                ) : (
                  recent.map((u) => {
                    const s = STATUS_COLORS[u.status] ?? STATUS_COLORS.PENDING_VERIFICATION;
                    return (
                      <tr
                        key={u.id}
                        className="transition-colors"
                        style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
                      >
                        <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#D4AF37" }}>
                          {u.clientId}
                        </td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#1a1c1c" }}>
                          {u.name}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#4c4546" }}>
                          {u.businessName || "—"}
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
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
