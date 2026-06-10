"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FormState = {
  containerNo: string;
  sealNo: string;
  size: "20FT" | "40FT" | "40HC";
  containerType: "DC" | "OT" | "FR" | "RF";
  shippingLine: string;
  blNo: string;
  igmNo: string;
  vesselName: string;
  voyage: string;
  grossWeight: string;
  deliveryMode: "FCL" | "LCL";
  chaName: string;
  importerName: string;
  sealIntact: boolean;
  condition: "Good" | "Damaged";
};

const now = new Date();
const gateInTimestamp = now.toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export default function GateInPage() {
  const [form, setForm] = useState<FormState>({
    containerNo: "",
    sealNo: "",
    size: "20FT",
    containerType: "DC",
    shippingLine: "",
    blNo: "",
    igmNo: "",
    vesselName: "",
    voyage: "",
    grossWeight: "",
    deliveryMode: "FCL",
    chaName: "",
    importerName: "",
    sealIntact: true,
    condition: "Good",
  });
  const [toast, setToast] = useState<string | null>(null);
  const [containerError, setContainerError] = useState<string>("");

  const containerPattern = /^[A-Z]{4}\d{7}$/;

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "containerNo") {
      const val = (value as string).toUpperCase();
      if (val && !containerPattern.test(val)) {
        setContainerError("Format: 4 letters + 7 digits (e.g. MSCU1234567)");
      } else {
        setContainerError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (containerError) return;
    setToast("Coming soon — Gate In recording will be available shortly.");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="p-6 max-w-3xl" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg"
          style={{ background: "#D97706", color: "#fff", maxWidth: 360 }}
        >
          {toast}
        </motion.div>
      )}

      <div className="mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ color: "#111827", fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          Gate In
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
          Record a new container gate-in entry
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Auto Stamp */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl border"
          style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18, color: "#D97706", fontVariationSettings: "'FILL' 1" }}
          >
            schedule
          </span>
          <div>
            <div className="text-[11px] font-medium" style={{ color: "#92400E" }}>
              Gate In Date / Time
            </div>
            <div className="text-sm font-semibold" style={{ color: "#111827" }}>
              {gateInTimestamp}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] font-medium" style={{ color: "#92400E" }}>
                Free Days
              </div>
              <div className="text-sm font-semibold" style={{ color: "#111827" }}>
                10{" "}
                <span className="text-[11px] font-normal" style={{ color: "#6B7280" }}>
                  (default)
                </span>
              </div>
            </div>
            <div
              className="text-[10px] px-2 py-1 rounded"
              style={{ background: "#FEF3C7", color: "#92400E" }}
            >
              Auto-fetched from shipping line rate card
            </div>
          </div>
        </div>

        {/* Section: Container Details */}
        <Section title="Container Details" icon="inventory_2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Container No</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm font-mono uppercase"
                style={{
                  borderColor: containerError ? "#EF4444" : "#E5E7EB",
                  outline: "none",
                  background: "#fff",
                  color: "#111827",
                }}
                placeholder="e.g. MSCU1234567"
                value={form.containerNo}
                onChange={(e) => handleChange("containerNo", e.target.value.toUpperCase())}
                required
              />
              {containerError && (
                <p className="text-[11px] mt-1" style={{ color: "#EF4444" }}>
                  {containerError}
                </p>
              )}
              {!containerError && (
                <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
                  Format: 4 uppercase letters + 7 digits
                </p>
              )}
            </div>
            <div>
              <Label>Seal No</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="Seal number"
                value={form.sealNo}
                onChange={(e) => handleChange("sealNo", e.target.value)}
              />
            </div>
            <div>
              <Label>Container Type</Label>
              <div className="flex gap-2 mt-1">
                {(["DC", "OT", "FR", "RF"] as const).map((t) => (
                  <RadioChip
                    key={t}
                    label={t}
                    active={form.containerType === t}
                    onClick={() => handleChange("containerType", t)}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <Label>Size</Label>
              <div className="flex gap-2 mt-1">
                {(["20FT", "40FT", "40HC"] as const).map((s) => (
                  <RadioChip
                    key={s}
                    label={s}
                    active={form.size === s}
                    onClick={() => handleChange("size", s)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Section: Shipment Info */}
        <Section title="Shipment Info" icon="directions_boat">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Shipping Line</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="e.g. MSC, Maersk"
                value={form.shippingLine}
                onChange={(e) => handleChange("shippingLine", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>BL No</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="Bill of Lading number"
                value={form.blNo}
                onChange={(e) => handleChange("blNo", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>IGM No</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="IGM number"
                value={form.igmNo}
                onChange={(e) => handleChange("igmNo", e.target.value)}
              />
            </div>
            <div>
              <Label>Vessel Name</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="Vessel name"
                value={form.vesselName}
                onChange={(e) => handleChange("vesselName", e.target.value)}
              />
            </div>
            <div>
              <Label>Voyage</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="Voyage number"
                value={form.voyage}
                onChange={(e) => handleChange("voyage", e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* Section: Cargo */}
        <Section title="Cargo" icon="inventory">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Gross Weight (KG)</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="e.g. 24000"
                type="number"
                min={0}
                value={form.grossWeight}
                onChange={(e) => handleChange("grossWeight", e.target.value)}
              />
            </div>
            <div>
              <Label>Delivery Mode</Label>
              <div className="flex gap-2 mt-1">
                {(["FCL", "LCL"] as const).map((m) => (
                  <RadioChip
                    key={m}
                    label={m}
                    active={form.deliveryMode === m}
                    onClick={() => handleChange("deliveryMode", m)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Section: Client */}
        <Section title="Client" icon="groups">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CHA Name</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="Custom House Agent name"
                value={form.chaName}
                onChange={(e) => handleChange("chaName", e.target.value)}
              />
            </div>
            <div>
              <Label>Importer Name</Label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "#E5E7EB", outline: "none", background: "#fff", color: "#111827" }}
                placeholder="Importer / consignee name"
                value={form.importerName}
                onChange={(e) => handleChange("importerName", e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* Section: Condition */}
        <Section title="Condition" icon="fact_check">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Seal Intact</Label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium border transition-all"
                  style={{
                    background: form.sealIntact ? "#D97706" : "#fff",
                    color: form.sealIntact ? "#fff" : "#6B7280",
                    borderColor: form.sealIntact ? "#D97706" : "#E5E7EB",
                  }}
                  onClick={() => handleChange("sealIntact", true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium border transition-all"
                  style={{
                    background: !form.sealIntact ? "#EF4444" : "#fff",
                    color: !form.sealIntact ? "#fff" : "#6B7280",
                    borderColor: !form.sealIntact ? "#EF4444" : "#E5E7EB",
                  }}
                  onClick={() => handleChange("sealIntact", false)}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <Label>Container Condition</Label>
              <div className="flex gap-2 mt-1">
                {(["Good", "Damaged"] as const).map((c) => (
                  <RadioChip
                    key={c}
                    label={c}
                    active={form.condition === c}
                    activeColor={c === "Damaged" ? "#EF4444" : "#D97706"}
                    onClick={() => handleChange("condition", c)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: "#E5E7EB", color: "#6B7280", background: "#fff" }}
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: "#D97706" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#B45309")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#D97706")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>login</span>
            Record Gate In
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
      <div className="flex items-center gap-2 mb-4">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16, color: "#D97706", fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-medium mb-1" style={{ color: "#374151" }}>
      {children}
    </label>
  );
}

function RadioChip({
  label,
  active,
  activeColor = "#D97706",
  onClick,
}: {
  label: string;
  active: boolean;
  activeColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
      style={{
        background: active ? activeColor : "#F9FAFB",
        color: active ? "#fff" : "#6B7280",
        borderColor: active ? activeColor : "#E5E7EB",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
