"use client";

import { motion } from "framer-motion";

type YardStatus = "IN_YARD" | "UNDER_EXAM" | "OOC" | "GATED_OUT";

type ContainerCard = {
  containerNo: string;
  size: string;
  daysInYard: number;
  clientName: string;
  status: YardStatus;
};

const containers: ContainerCard[] = [];

const statusConfig: Record<
  YardStatus,
  { label: string; color: string; bg: string; border: string; headerBg: string; icon: string }
> = {
  IN_YARD: {
    label: "In Yard",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    headerBg: "#DBEAFE",
    icon: "warehouse",
  },
  UNDER_EXAM: {
    label: "Under Exam",
    color: "#1E40AF",
    bg: "#FFFBEB",
    border: "#FDE68A",
    headerBg: "#FEF3C7",
    icon: "gavel",
  },
  OOC: {
    label: "OOC",
    color: "#059669",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    headerBg: "#DCFCE7",
    icon: "check_circle",
  },
  GATED_OUT: {
    label: "Gated Out",
    color: "#6B7280",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    headerBg: "#F3F4F6",
    icon: "logout",
  },
};

const statuses: YardStatus[] = ["IN_YARD", "UNDER_EXAM", "OOC", "GATED_OUT"];

export default function YardViewPage() {
  const grouped = statuses.reduce<Record<YardStatus, ContainerCard[]>>(
    (acc, s) => {
      acc[s] = containers.filter((c) => c.status === s);
      return acc;
    },
    { IN_YARD: [], UNDER_EXAM: [], OOC: [], GATED_OUT: [] }
  );

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ color: "#111827", fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          Yard View
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
          Visual overview of all containers grouped by status
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {statuses.map((s) => {
          const cfg = statusConfig[s];
          return (
            <div
              key={s}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
              style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}
              >
                {cfg.icon}
              </span>
              {cfg.label}
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: cfg.border, color: cfg.color }}
              >
                {grouped[s].length}
              </span>
            </div>
          );
        })}
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-4">
        {statuses.map((status) => {
          const cfg = statusConfig[status];
          const cards = grouped[status];

          return (
            <div key={status} className="flex flex-col rounded-xl border overflow-hidden" style={{ borderColor: cfg.border }}>
              {/* Column Header */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: cfg.headerBg }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 15, color: cfg.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {cfg.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <span
                  className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: cfg.border, color: cfg.color }}
                >
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="flex flex-col gap-2 p-3 flex-1 overflow-y-auto"
                style={{ background: "#F9FAFB", minHeight: 240, maxHeight: 560 }}
              >
                {cards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <span
                      className="material-symbols-outlined mb-2"
                      style={{ fontSize: 28, color: "#E5E7EB" }}
                    >
                      {cfg.icon}
                    </span>
                    <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                      No containers
                    </p>
                  </div>
                ) : (
                  cards.map((c, i) => (
                    <motion.div
                      key={c.containerNo}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-3 rounded-lg border"
                      style={{ background: "#fff", borderColor: cfg.border }}
                    >
                      <div
                        className="text-sm font-bold font-mono tracking-wide mb-1"
                        style={{ color: cfg.color }}
                      >
                        {c.containerNo}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {c.size}
                        </span>
                        <span className="text-[11px]" style={{ color: "#6B7280" }}>
                          {c.daysInYard}d
                        </span>
                      </div>
                      <div className="mt-1.5 text-[11px] truncate" style={{ color: "#374151" }}>
                        {c.clientName}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
