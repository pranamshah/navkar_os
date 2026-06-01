"use client";

import { motion } from "framer-motion";
import { modules } from "@/data/homepage";
import {
  Ship,
  FileText,
  Receipt,
  Users,
  BarChart3,
  Truck,
  Package,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Ship,
  FileText,
  Receipt,
  Users,
  BarChart3,
  Truck,
  Package,
};

const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
  Core: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "AI-Powered": { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
  "GST Ready": { bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
  "White-label": { bg: "#FFF7ED", color: "#9A3412", border: "#FED7AA" },
  Insights: { bg: "#FEF3C7", color: "#92400E", border: "#D4A017" },
  New: { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
  Beta: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
};

export default function ModulesGrid() {
  return (
    <section
      id="modules"
      className="py-24 px-6"
      style={{ background: "#F8F9FA" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #D4A017" }}
          >
            Everything You Need
          </span>
          <h2
            className="text-3xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-sora), sans-serif",
              color: "#0A0A0A",
            }}
          >
            7 Modules. One Platform.
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "#6B7280" }}
          >
            Every tool your freight forwarding business needs, deeply integrated
            and built for Indian compliance.
          </p>
        </motion.div>

        {/* 4 + 3 grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-5">
          {modules.slice(0, 4).map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 lg:max-w-3xl lg:mx-auto">
          {modules.slice(4).map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i + 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ mod, index }: { mod: (typeof modules)[0]; index: number }) {
  const Icon = iconMap[mod.icon] || Ship;
  const badge = badgeColors[mod.badge] ?? badgeColors["Core"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex flex-col gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#D4A017";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,160,23,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E5E7EB";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
          style={{ background: "#FEF3C7" }}
        >
          <Icon className="w-5 h-5" style={{ color: "#D4A017" }} />
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
          }}
        >
          {mod.badge}
        </span>
      </div>
      <div>
        <h3
          className="font-semibold mb-1.5"
          style={{
            fontFamily: "var(--font-sora), sans-serif",
            color: "#0A0A0A",
            fontSize: "15px",
          }}
        >
          {mod.name}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          {mod.desc}
        </p>
      </div>
    </motion.div>
  );
}
