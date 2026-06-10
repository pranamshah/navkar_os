"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type BookingType = "FTL" | "PTL" | "ODC";
type BookingSource = "Walk-in" | "Phone" | "WhatsApp" | "Portal";
type PaymentTerms = "Paid" | "To Pay" | "TBB";

export default function NewBookingPage() {
  const [bookingType, setBookingType] = useState<BookingType>("FTL");
  const [bookingSource, setBookingSource] = useState<BookingSource>("Walk-in");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>("Paid");
  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h2
      className="text-sm font-semibold mb-4 pb-2 border-b"
      style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", borderColor: "#E5E7EB", fontSize: 16 }}
    >
      {title}
    </h2>
  );

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[11px] font-semibold mb-1 uppercase tracking-wider" style={{ color: "#6B7280" }}>
      {children}
    </label>
  );

  const TextInput = ({ placeholder, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border text-[13px] outline-none focus:ring-2"
      style={{ borderColor: "#E5E7EB", color: "#111827", background: "#fff" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
      {...rest}
    />
  );

  function RadioGroup<T extends string>({
    options,
    value,
    onChange,
  }: {
    options: T[];
    value: T;
    onChange: (v: T) => void;
  }) {
    return (
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all"
            style={{
              background: value === opt ? "#7C3AED" : "#fff",
              color: value === opt ? "#fff" : "#374151",
              borderColor: value === opt ? "#7C3AED" : "#E5E7EB",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-[13px] font-medium"
          style={{ background: "#7C3AED" }}
        >
          Coming soon — booking creation is under development.
        </motion.div>
      )}

      <div className="mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827" }}
        >
          New Booking
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Create a new transport booking</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic */}
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <SectionHeader title="Basic Information" />
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FieldLabel>Booking Type</FieldLabel>
              <RadioGroup<BookingType>
                options={["FTL", "PTL", "ODC"]}
                value={bookingType}
                onChange={setBookingType}
              />
            </div>
            <div>
              <FieldLabel>Booking Source</FieldLabel>
              <RadioGroup<BookingSource>
                options={["Walk-in", "Phone", "WhatsApp", "Portal"]}
                value={bookingSource}
                onChange={setBookingSource}
              />
            </div>
            <div>
              <FieldLabel>Payment Terms</FieldLabel>
              <RadioGroup<PaymentTerms>
                options={["Paid", "To Pay", "TBB"]}
                value={paymentTerms}
                onChange={setPaymentTerms}
              />
            </div>
          </div>
        </div>

        {/* Consignor */}
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <SectionHeader title="Consignor" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Client Name</FieldLabel>
              <TextInput placeholder="e.g. Reliance Industries Ltd." />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <TextInput placeholder="+91 98765 43210" type="tel" />
            </div>
          </div>
        </div>

        {/* Consignee */}
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <SectionHeader title="Consignee" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Name</FieldLabel>
              <TextInput placeholder="Consignee name" />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <TextInput placeholder="+91 98765 43210" type="tel" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Delivery Address</FieldLabel>
              <TextInput placeholder="Full delivery address" />
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <SectionHeader title="Route" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel>From Location</FieldLabel>
              <TextInput placeholder="e.g. Mumbai" />
            </div>
            <div>
              <FieldLabel>To Location</FieldLabel>
              <TextInput placeholder="e.g. Pune" />
            </div>
            <div>
              <FieldLabel>Distance KM</FieldLabel>
              <TextInput placeholder="Auto-calculated" type="number" />
            </div>
          </div>
        </div>

        {/* Cargo */}
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <SectionHeader title="Cargo Details" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Goods Description</FieldLabel>
              <TextInput placeholder="e.g. Electronic Goods" />
            </div>
            <div>
              <FieldLabel>HS Code</FieldLabel>
              <TextInput placeholder="e.g. 8471.30" />
            </div>
            <div>
              <FieldLabel>No. of Packages</FieldLabel>
              <TextInput placeholder="0" type="number" />
            </div>
            <div>
              <FieldLabel>Weight (KG)</FieldLabel>
              <TextInput placeholder="0.00" type="number" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Consignment Value (₹)</FieldLabel>
              <TextInput placeholder="0.00" type="number" />
            </div>
          </div>
        </div>

        {/* Freight */}
        <div className="rounded-xl border p-5" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <SectionHeader title="Freight & Delivery" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Freight Amount (₹)</FieldLabel>
              <TextInput placeholder="0.00" type="number" />
            </div>
            <div>
              <FieldLabel>Expected Delivery Date</FieldLabel>
              <TextInput type="date" />
            </div>
            <div className="col-span-2">
              <FieldLabel>Special Instructions</FieldLabel>
              <textarea
                placeholder="Any special handling or delivery instructions..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-[13px] outline-none resize-none"
                style={{ borderColor: "#E5E7EB", color: "#111827", background: "#fff" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-6">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#7C3AED" }}
          >
            Create Booking
          </button>
        </div>
      </form>
    </div>
  );
}
