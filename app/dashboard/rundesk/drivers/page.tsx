"use client";

import { motion } from "framer-motion";

type Driver = {
  name: string;
  phone: string;
  licenceNo: string;
  licenceExpiry: string;
  daysUntilExpiry: number;
  tripsThisMonth: number;
  status: "Active" | "Inactive" | "On Trip";
};

const drivers: Driver[] = [];

function getLicenceBadge(daysUntilExpiry: number) {
  if (daysUntilExpiry < 0) {
    return { label: "Expired", color: "#DC2626", bg: "#FEF2F2" };
  }
  if (daysUntilExpiry <= 30) {
    return { label: `${daysUntilExpiry}d left`, color: "#1E40AF", bg: "#FFFBEB" };
  }
  return { label: "Valid", color: "#059669", bg: "#ECFDF5" };
}

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Active: { color: "#059669", bg: "#ECFDF5" },
  Inactive: { color: "#6B7280", bg: "#F3F4F6" },
  "On Trip": { color: "#1E40AF", bg: "#F5F3FF" },
};

export default function DriversPage() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827" }}
          >
            Driver List
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Manage drivers, licences, and performance
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
          style={{ background: "#1E40AF" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
          Add Driver
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="rounded-xl border overflow-hidden"
        style={{ background: "#fff", borderColor: "#E5E7EB" }}
      >
        <table className="w-full text-[12px]">
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["Name", "Phone", "Licence No", "Licence Expiry", "Trips This Month", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 font-semibold text-[10px] uppercase tracking-wider"
                  style={{ color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#E5E7EB" }}>person_pin</span>
                    <p className="text-[13px] font-medium" style={{ color: "#6B7280" }}>No drivers found</p>
                    <p className="text-[12px]" style={{ color: "#9CA3AF" }}>
                      Add your first driver to get started.
                    </p>
                    <button
                      className="mt-2 px-4 py-1.5 rounded-md text-[13px] text-white"
                      style={{ background: "#1E40AF" }}
                    >
                      + Add Driver
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              drivers.map((d) => {
                const licenceBadge = getLicenceBadge(d.daysUntilExpiry);
                const statusStyle = STATUS_STYLES[d.status] ?? { color: "#6B7280", bg: "#F3F4F6" };
                return (
                  <tr key={d.licenceNo} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td className="py-3 px-4 font-medium" style={{ color: "#111827" }}>{d.name}</td>
                    <td className="py-3 px-4" style={{ color: "#6B7280" }}>{d.phone}</td>
                    <td className="py-3 px-4 font-mono text-[11px]" style={{ color: "#374151" }}>{d.licenceNo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: "#6B7280" }}>{d.licenceExpiry}</span>
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: licenceBadge.bg, color: licenceBadge.color }}
                        >
                          {licenceBadge.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold" style={{ color: "#111827" }}>
                      {d.tripsThisMonth}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
