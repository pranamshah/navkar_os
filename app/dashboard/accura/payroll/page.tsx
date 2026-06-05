"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const employees: never[] = [];

export default function PayrollPage() {
  const [tab, setTab] = useState<"employees" | "run">("employees");
  const [selectedMonth] = useState("June 2026");

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Payroll</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>0 active employees</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white" style={{ background: "#0E7490" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>person_add</span>Add Employee
          </button>
        </div>
      </div>

      <div className="flex rounded-lg border overflow-hidden mb-5 w-fit" style={{ borderColor: "#E5E7EB" }}>
        {[{ id: "employees" as const, label: "Employees" }, { id: "run" as const, label: "Run Payroll" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-2 text-[13px] font-medium transition-colors"
            style={{ background: tab === t.id ? "#0E7490" : "#fff", color: tab === t.id ? "#fff" : "#6B7280" }}>
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {tab === "employees" && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {["Employee", "Designation", "Basic", "HRA", "Special", "Gross CTC", "PAN", "Bank", "Joined"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <span className="material-symbols-outlined block mb-3 mx-auto" style={{ fontSize: 36, color: "#D1D5DB" }}>group</span>
                      <p className="text-[13px] font-medium" style={{ color: "#374151" }}>No employees added yet.</p>
                      <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>Click &quot;Add Employee&quot; to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "run" && (
          <div className="rounded-xl border p-12 text-center" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
            <span className="material-symbols-outlined block mb-3" style={{ fontSize: 36, color: "#D1D5DB" }}>paid</span>
            <p className="text-[14px] font-semibold" style={{ color: "#374151" }}>Add employees first before running payroll.</p>
            <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>Payroll for <span style={{ color: "#0E7490", fontWeight: 600 }}>{selectedMonth}</span> will be calculated once employees are added.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
