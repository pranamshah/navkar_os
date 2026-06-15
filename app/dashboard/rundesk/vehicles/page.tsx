"use client";

import { motion } from "framer-motion";

type ComplianceBadge = {
  label: string;
  valid: boolean;
};

type Vehicle = {
  vehicleNo: string;
  type: string;
  makeModel: string;
  lastTrip: string;
  compliance: ComplianceBadge[];
};

const vehicles: Vehicle[] = [];

function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ background: "#fff", borderColor: "#E5E7EB" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div
            className="text-lg font-bold tracking-widest font-mono"
            style={{ color: "#111827", letterSpacing: "0.1em" }}
          >
            {vehicle.vehicleNo}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>
            {vehicle.type} · {vehicle.makeModel}
          </div>
        </div>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 28, color: "#1E40AF", fontVariationSettings: "'FILL' 1" }}
        >
          directions_truck
        </span>
      </div>

      <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
        Last trip: <span style={{ color: "#6B7280" }}>{vehicle.lastTrip || "—"}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {vehicle.compliance.map((badge) => (
          <span
            key={badge.label}
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              background: badge.valid ? "#ECFDF5" : "#FEF2F2",
              color: badge.valid ? "#059669" : "#DC2626",
            }}
          >
            {badge.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function VehiclesPage() {
  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-semibold"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827" }}
          >
            Fleet Management
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            Manage vehicles, compliance, and utilisation
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] text-white transition-colors"
          style={{ background: "#1E40AF" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border flex flex-col items-center justify-center py-20"
          style={{ background: "#fff", borderColor: "#E5E7EB" }}
        >
          <span
            className="material-symbols-outlined mb-4"
            style={{ fontSize: 48, color: "#E5E7EB", fontVariationSettings: "'FILL' 1" }}
          >
            directions_truck
          </span>
          <p className="text-[14px] font-semibold" style={{ color: "#6B7280" }}>No vehicles added yet</p>
          <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>
            Add your first vehicle to start managing your fleet.
          </p>
          <button
            className="mt-4 px-4 py-2 rounded-lg text-[13px] text-white font-medium"
            style={{ background: "#1E40AF" }}
          >
            + Add Vehicle
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.vehicleNo} vehicle={v} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
