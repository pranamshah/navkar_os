"use client";

import { motion } from "framer-motion";

type Supplier = {
  name: string;
  country: string;
  products: string;
  paymentTerms: string;
  activeShipments: number;
};

const suppliers: Supplier[] = [];

export default function SuppliersPage() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 26 }}>
            My Suppliers
          </h1>
          <p className="text-xs" style={{ color: "#6B7280" }}>Manage all your import suppliers in one place</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
          style={{ background: "#1E40AF" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F766E")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#1E40AF")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
          Add Supplier
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border"
        style={{ background: "#fff", borderColor: "#E5E7EB" }}
      >
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
              {["Supplier Name", "Country", "Products Supplied", "Payment Terms", "Active Shipments", ""].map((h) => (
                <th key={h} className="text-left py-3 px-5 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#e5e7eb" }}>storefront</span>
                    <div>
                      <p className="text-[13px] font-medium" style={{ color: "#1a1c1c" }}>No suppliers added yet</p>
                      <p className="text-[11px] mt-1" style={{ color: "#6B7280" }}>
                        Add your first supplier to start managing imports
                      </p>
                    </div>
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold text-white"
                      style={{ background: "#1E40AF" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                      Add Supplier
                    </button>
                  </div>
                </td>
              </tr>
            ) : suppliers.map((s) => (
              <tr key={s.name} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td className="py-3 px-5 font-semibold" style={{ color: "#111827" }}>{s.name}</td>
                <td className="py-3 px-5" style={{ color: "#6B7280" }}>{s.country}</td>
                <td className="py-3 px-5" style={{ color: "#6B7280" }}>{s.products}</td>
                <td className="py-3 px-5" style={{ color: "#374151" }}>{s.paymentTerms}</td>
                <td className="py-3 px-5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: s.activeShipments > 0 ? "#CCFBF1" : "#F3F4F6", color: s.activeShipments > 0 ? "#1E40AF" : "#6B7280" }}>
                    {s.activeShipments} active
                  </span>
                </td>
                <td className="py-3 px-5 text-right">
                  <button className="text-[11px] font-semibold px-2 py-1 rounded" style={{ color: "#1E40AF", background: "#F0FDFA" }}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
