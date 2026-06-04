"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "company" | "gst" | "opening" | "ca" | "backup";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("company");
  const [saved, setSaved] = useState(false);

  const [company, setCompany] = useState({
    name: "Navkar Freight Co.",
    type: "Partnership",
    address: "12, Rajaji Salai, Chennai – 600 001",
    pan: "AAACN7890F",
    gstin: "33AAACN7890F1Z2",
    fyStart: "2025-04-01",
    email: "accounts@navkarfreight.in",
    phone: "+91 90807 67398",
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "company" as Tab, label: "Company Profile", icon: "business" },
    { id: "gst" as Tab, label: "GST Settings", icon: "tune" },
    { id: "opening" as Tab, label: "Opening Balances", icon: "start" },
    { id: "ca" as Tab, label: "CA Collaboration", icon: "manage_accounts" },
    { id: "backup" as Tab, label: "Backup & Export", icon: "backup" },
  ];

  return (
    <div className="p-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: "#111827" }}>Settings</h1>
        <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Configure your company and accounting preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-left transition-colors"
                style={{ background: tab === t.id ? "#ECFEFF" : "transparent", color: tab === t.id ? "#0E7490" : "#374151", fontWeight: tab === t.id ? 600 : 400 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: tab === t.id ? "#0E7490" : "#9CA3AF" }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          <motion.div key={tab} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
            {tab === "company" && (
              <div className="rounded-xl border p-6" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <h2 className="text-sm font-semibold mb-5" style={{ color: "#111827" }}>Company Profile</h2>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { key: "name", label: "Company Name", type: "text" },
                    { key: "type", label: "Business Type", type: "text" },
                    { key: "pan", label: "PAN", type: "text" },
                    { key: "gstin", label: "GSTIN", type: "text" },
                    { key: "email", label: "Email", type: "email" },
                    { key: "phone", label: "Phone", type: "tel" },
                    { key: "fyStart", label: "Financial Year Start", type: "date" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>{field.label}</label>
                      <input type={field.type} value={company[field.key as keyof typeof company]} onChange={(e) => setCompany({ ...company, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border text-[13px] outline-none focus:border-[#0E7490]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>Address</label>
                    <textarea rows={2} value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border text-[13px] outline-none resize-none focus:border-[#0E7490]" style={{ borderColor: "#E5E7EB", color: "#111827" }} />
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  {saved && <span className="mr-3 text-[12px] flex items-center gap-1" style={{ color: "#059669" }}><span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>Saved!</span>}
                  <button onClick={handleSave} className="px-5 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>Save Changes</button>
                </div>
              </div>
            )}

            {tab === "gst" && (
              <div className="rounded-xl border p-6 space-y-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>GST Settings</h2>
                {[
                  { label: "GSTIN", value: "33AAACN7890F1Z2", note: "Tamil Nadu — State Code 33" },
                  { label: "HSN/SAC Default", value: "996511 — Freight Transport (Air)", note: "Used as default for sales invoices" },
                  { label: "Default GST Rate", value: "18%", note: "Applied on new sales lines" },
                  { label: "E-Invoice Applicable", value: "No (below ₹5 Cr threshold)", note: "Enable when turnover crosses ₹5 Cr" },
                  { label: "Auto-generate GSTR-1", value: "Yes — on every sales voucher save", note: "" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between py-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                    <div>
                      <div className="text-[13px] font-medium" style={{ color: "#111827" }}>{item.label}</div>
                      {item.note && <div className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{item.note}</div>}
                    </div>
                    <div className="text-[13px] font-semibold" style={{ color: "#0E7490" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === "opening" && (
              <div className="rounded-xl border p-6" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <h2 className="text-sm font-semibold mb-2" style={{ color: "#111827" }}>Opening Balances</h2>
                <p className="text-[12px] mb-4" style={{ color: "#6B7280" }}>Enter opening balances as on 01 April 2025 (start of FY 2025-26).</p>
                <div className="rounded-lg border p-4 flex items-center gap-3" style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#D97706" }}>info</span>
                  <div className="text-[12px]" style={{ color: "#374151" }}>
                    Opening balances are set at the time of company creation. To modify, go to each ledger and update the opening balance directly.
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md border text-[13px] hover:bg-gray-50" style={{ borderColor: "#E5E7EB", color: "#374151" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>Go to Ledgers
                </button>
              </div>
            )}

            {tab === "ca" && (
              <div className="rounded-xl border p-6 space-y-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>CA Collaboration Mode</h2>
                <p className="text-[12px]" style={{ color: "#6B7280" }}>Grant your CA read-only or full access to your books. They can review, add comments, and export reports without logging in as you.</p>
                <div className="rounded-lg border p-4" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-medium" style={{ color: "#111827" }}>CA Access</div>
                      <div className="text-[12px] mt-0.5" style={{ color: "#9CA3AF" }}>No CA linked yet</div>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-medium text-white" style={{ background: "#0E7490" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>Invite CA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "backup" && (
              <div className="rounded-xl border p-6 space-y-4" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
                <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>Backup & Export</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Export to Tally XML", icon: "code", desc: "Compatible with TallyPrime import", color: "#0E7490" },
                    { label: "Export to Excel", icon: "table_chart", desc: "All vouchers and ledgers", color: "#059669" },
                    { label: "Download Full Backup", icon: "backup", desc: "JSON format — all data", color: "#7C3AED" },
                    { label: "Export GST Data", icon: "receipt_long", desc: "GSTR-1 / GSTR-3B JSON", color: "#D97706" },
                  ].map((item) => (
                    <button key={item.label} className="flex items-start gap-3 p-4 rounded-lg border text-left hover:bg-gray-50 transition-colors" style={{ borderColor: "#E5E7EB" }}>
                      <span className="material-symbols-outlined mt-0.5" style={{ fontSize: 20, color: item.color }}>{item.icon}</span>
                      <div>
                        <div className="text-[13px] font-semibold" style={{ color: "#111827" }}>{item.label}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="text-[11px] pt-2" style={{ color: "#9CA3AF" }}>Last backup: Never · Auto-backup: Daily at 11:30 PM IST</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
