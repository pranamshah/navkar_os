"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";

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
  PENDING_VERIFICATION: { bg: "rgba(30,64,175,0.12)", text: "#1E40AF", label: "Pending" },
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
        borderColor: accent ? "rgba(30,64,175,0.25)" : "rgba(0,0,0,0.07)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent ? "rgba(255,255,255,0.5)" : "#7e7576" }}>
          {label}
        </span>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, color: accent ? "#1E40AF" : "#b0a8a9" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: accent ? "#1E40AF" : "#1a1c1c" }}>
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
        style={{ background: "#1a1c1c", borderColor: "rgba(30,64,175,0.25)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          {label}
        </p>
        <p className="text-sm font-black" style={{ color: "#1E40AF" }}>
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
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
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

      {/* NavkarOS Suite */}
      <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#1E40AF" }}>Admin Access</p>
            <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>All Products</h2>
            <p className="text-sm mt-0.5" style={{ color: "#7e7576" }}>Full access to all 6 products — no subscription required.</p>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Products", value: "6" },
            { label: "Access Level", value: "Full" },
            { label: "Status", value: "Admin" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 border" style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>{s.label}</p>
              <p className="font-black text-2xl" style={{ color: "#1a1c1c" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Full product cards — 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            {
              id: "nexlog", name: "Nexlog", tagline: "Freight Forwarding", icon: "navigation", color: "#1565C0",
              desc: "End-to-end job management for C&F agents and freight forwarders — booking, BL, tracking, and GST invoicing.",
              features: ["Job management", "BL/AWB AI reading", "GST invoicing", "Client portal"],
              href: "/dashboard/nexlog",
            },
            {
              id: "entryx", name: "EntryX", tagline: "Customs Clearance", icon: "gavel", color: "#5B21B6",
              desc: "AI-powered Bill of Entry preparation, ICEGATE filing, live duty calculation for licensed CHAs.",
              features: ["AI BE preparation", "ICEGATE filing", "Duty calculator", "HS code lookup"],
              href: "/dashboard/entryx",
            },
            {
              id: "dockiq", name: "DockIQ", tagline: "CFS & Warehouse", icon: "warehouse", color: "#0D7057",
              desc: "Complete CFS station management — gate-in/out, yard planning, storage slab billing, importer alerts.",
              features: ["Gate-in/out tracking", "Yard planning", "Storage billing", "CFS invoicing"],
              href: "/dashboard/dockiq",
            },
            {
              id: "rundesk", name: "RunDesk", tagline: "Transport & Fleet", icon: "local_shipping", color: "#92400E",
              desc: "LR generation, trip management, GPS tracking via driver app, vehicle compliance, GST freight invoicing.",
              features: ["LR generation", "Trip management", "GPS tracking", "Vehicle compliance"],
              href: "/dashboard/rundesk",
            },
            {
              id: "accura", name: "Accura", tagline: "Freight Accounting", icon: "account_balance_wallet", color: "#1A237E",
              desc: "Auto-posts income from every product. GSTR-1 & GSTR-3B ready, P&L in 3 seconds, Tally XML export.",
              features: ["Auto income posting", "GSTR-1 & 3B export", "P&L dashboard", "Tally XML"],
              href: "/dashboard/accura",
            },
            {
              id: "tradepilot", name: "TradePilot", tagline: "Importers & Exporters", icon: "public", color: "#004D40",
              desc: "Landed cost calculator, HSN Scout, FTA checker, RoDTEP tracker, document vault, shipment register.",
              features: ["Landed cost calc", "HSN Scout", "FTA checker", "RoDTEP tracker"],
              href: "/dashboard/tradepilot",
            },
          ].map((p) => (
            <div
              key={p.id}
              className="rounded-xl border flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
              style={{ background: "#ffffff", borderColor: `${p.color}30`, boxShadow: `0 0 0 1px ${p.color}10` }}
            >
              {/* Card header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ background: `${p.color}08`, borderBottom: `1px solid ${p.color}15` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: p.color }}>{p.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>{p.tagline}</p>
                    <p className="font-black text-sm" style={{ color: "#1a1c1c" }}>{p.name}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}
                >
                  Active
                </span>
              </div>
              {/* Card body */}
              <div className="px-5 py-4 flex-1 flex flex-col">
                <p className="text-xs mb-3 flex-1" style={{ color: "#7e7576", lineHeight: 1.65 }}>{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${p.color}08`, color: p.color, border: `0.5px solid ${p.color}20` }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <a
                  href={p.href}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90 no-underline"
                  style={{ background: "#1a1c1c", color: "#1E40AF", textDecoration: "none" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                  Open {p.name}
                </a>
              </div>
            </div>
          ))}
        </div>
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(30,64,175,0.06)" }} />
                <Bar
                  dataKey="revenue"
                  fill="#1E40AF"
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
              style={{ color: "#1E40AF" }}
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
                        <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#1E40AF" }}>
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
