"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Employee {
  id: string;
  name: string;
  designation: string;
  basic: number;
  hra: number;
  special: number;
  pan: string;
  bank: string;
  joiningDate: string;
  active: boolean;
}

const employees: Employee[] = [
  { id: "e1", name: "Priya Sundaram", designation: "Operations Manager", basic: 35000, hra: 14000, special: 8000, pan: "AAAPS1234A", bank: "HDFC - ****4521", joiningDate: "2023-03-01", active: true },
  { id: "e2", name: "Karthik Rajan", designation: "Freight Coordinator", basic: 22000, hra: 8800, special: 4000, pan: "AAAKR5678B", bank: "SBI - ****8834", joiningDate: "2024-01-15", active: true },
  { id: "e3", name: "Deepa Nair", designation: "Accounts Executive", basic: 20000, hra: 8000, special: 3500, pan: "AAADN9012C", bank: "ICICI - ****2267", joiningDate: "2024-06-01", active: true },
  { id: "e4", name: "Ramesh Kumar", designation: "Driver", basic: 12000, hra: 4800, special: 1200, pan: "AAARK3456D", bank: "SBI - ****5591", joiningDate: "2022-11-01", active: true },
];

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

function calcPayroll(emp: Employee) {
  const gross = emp.basic + emp.hra + emp.special;
  const pf = Math.round(emp.basic * 0.12);
  const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
  const tds = gross > 50000 ? Math.round((gross - 50000) * 0.1 / 12) : 0;
  const net = gross - pf - esi - tds;
  return { gross, pf, esi, tds, net };
}

export default function PayrollPage() {
  const [tab, setTab] = useState<"employees" | "run">("employees");
  const [selectedMonth] = useState("June 2026");
  const [processed, setProcessed] = useState(false);

  const totalPayroll = employees.reduce((s, e) => s + calcPayroll(e).net, 0);

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Payroll</h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{employees.filter((e) => e.active).length} active employees</p>
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
                {employees.map((emp) => {
                  const { gross } = calcPayroll(emp);
                  return (
                    <tr key={emp.id} className="border-b cursor-pointer" style={{ borderColor: "#F3F4F6" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F9FAFB")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "#0E7490" }}>
                            {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium" style={{ color: "#111827" }}>{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#6B7280" }}>{emp.designation}</td>
                      <td className="px-4 py-3 font-mono">{fmt(emp.basic)}</td>
                      <td className="px-4 py-3 font-mono">{fmt(emp.hra)}</td>
                      <td className="px-4 py-3 font-mono">{fmt(emp.special)}</td>
                      <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#0E7490" }}>{fmt(gross)}</td>
                      <td className="px-4 py-3 font-mono text-[11px]" style={{ color: "#374151" }}>{emp.pan}</td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: "#6B7280" }}>{emp.bank}</td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: "#6B7280" }}>{emp.joiningDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "run" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold" style={{ color: "#111827" }}>
                Payroll for <span style={{ color: "#0E7490" }}>{selectedMonth}</span>
              </div>
              {!processed ? (
                <button onClick={() => setProcessed(true)} className="flex items-center gap-2 px-5 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#059669" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>paid</span>Process Payroll
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-md" style={{ background: "#ECFDF5", color: "#059669" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Payroll Processed
                </span>
              )}
            </div>

            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#E5E7EB", background: "#fff" }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                    {["Employee", "Gross", "PF (12%)", "ESI", "TDS", "Net Payable"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-right first:text-left font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#6B7280" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const { gross, pf, esi, tds, net } = calcPayroll(emp);
                    return (
                      <tr key={emp.id} className="border-b" style={{ borderColor: "#F3F4F6" }}>
                        <td className="px-4 py-3 font-medium" style={{ color: "#111827" }}>{emp.name}</td>
                        <td className="px-4 py-3 text-right font-mono">{fmt(gross)}</td>
                        <td className="px-4 py-3 text-right font-mono" style={{ color: "#DC2626" }}>{fmt(pf)}</td>
                        <td className="px-4 py-3 text-right font-mono" style={{ color: "#DC2626" }}>{fmt(esi)}</td>
                        <td className="px-4 py-3 text-right font-mono" style={{ color: "#DC2626" }}>{fmt(tds)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: "#059669" }}>{fmt(net)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
                    <td className="px-4 py-3 font-bold" style={{ color: "#111827" }}>Total</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">{fmt(employees.reduce((s, e) => s + calcPayroll(e).gross, 0))}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: "#DC2626" }}>{fmt(employees.reduce((s, e) => s + calcPayroll(e).pf, 0))}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: "#DC2626" }}>{fmt(employees.reduce((s, e) => s + calcPayroll(e).esi, 0))}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: "#DC2626" }}>{fmt(employees.reduce((s, e) => s + calcPayroll(e).tds, 0))}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[15px]" style={{ color: "#059669" }}>{fmt(totalPayroll)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
