"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const FILTERS = ["All", "Pending Assignment", "FTL", "PTL"] as const;
type Filter = typeof FILTERS[number];

const bookings: {
  bookingNo: string;
  date: string;
  consignor: string;
  from: string;
  to: string;
  freight: string;
  paymentTerms: string;
  status: string;
  statusColor: string;
  statusBg: string;
}[] = [];

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827" }}
          >
            All Bookings
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Manage and track all transport bookings</p>
        </div>
        <Link
          href="/dashboard/rundesk/bookings/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
          style={{ background: "#7C3AED" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
          New Booking
        </Link>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F3F4F6" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
              style={{
                background: activeFilter === f ? "#fff" : "transparent",
                color: activeFilter === f ? "#7C3AED" : "#6B7280",
                boxShadow: activeFilter === f ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <span
            className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ fontSize: 16, color: "#9CA3AF" }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-[13px] outline-none"
            style={{ borderColor: "#E5E7EB", background: "#fff", color: "#111827" }}
          />
        </div>
      </div>

      {/* Table */}
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
              {["Booking No", "Date", "Consignor", "From", "To", "Freight (₹)", "Payment Terms", "Status"].map((h) => (
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
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#E5E7EB" }}>list_alt</span>
                    <p className="text-[13px] font-medium" style={{ color: "#6B7280" }}>No bookings found</p>
                    <p className="text-[12px]" style={{ color: "#9CA3AF" }}>Create your first booking to get started.</p>
                    <Link
                      href="/dashboard/rundesk/bookings/new"
                      className="mt-2 px-4 py-1.5 rounded-md text-[13px] text-white"
                      style={{ background: "#7C3AED" }}
                    >
                      + New Booking
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.bookingNo} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td className="py-3 px-4 font-mono text-[11px]" style={{ color: "#7C3AED" }}>{b.bookingNo}</td>
                  <td className="py-3 px-4" style={{ color: "#6B7280" }}>{b.date}</td>
                  <td className="py-3 px-4 font-medium" style={{ color: "#111827" }}>{b.consignor}</td>
                  <td className="py-3 px-4" style={{ color: "#6B7280" }}>{b.from}</td>
                  <td className="py-3 px-4" style={{ color: "#6B7280" }}>{b.to}</td>
                  <td className="py-3 px-4 font-mono" style={{ color: "#111827" }}>{b.freight}</td>
                  <td className="py-3 px-4" style={{ color: "#6B7280" }}>{b.paymentTerms}</td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: b.statusBg, color: b.statusColor }}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
