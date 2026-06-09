"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Ship, Plane, MapPin, Calendar, FileText, Download, ChevronRight, ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import LogoBrand from "@/components/ui/LogoBrand";

/* ── Types ─────────────────────────────────────────── */
interface Container {
  id: string;
  containerNo: string;
  sealNo?: string;
  size: string;
  type: string;
}

interface Document {
  id: string;
  type: string;
  label: string;
  fileUrl: string;
  createdAt: string;
}

interface TrackingUpdate {
  stage: string;
  notes?: string;
  createdAt: string;
}

interface JobData {
  jobNo: string;
  jobType: string;
  mode: string;
  status: string;
  stage: string;
  portLoading?: string;
  portDischarge?: string;
  finalDest?: string;
  countryOrigin?: string;
  commodity?: string;
  packages?: number;
  packageType?: string;
  grossWeight?: number;
  cbm?: number;
  shippingLine?: string;
  vessel?: string;
  voyage?: string;
  flightNo?: string;
  mblNo?: string;
  hblNo?: string;
  mawbNo?: string;
  hawbNo?: string;
  sailingDate?: string;
  etaOriginal?: string;
  etaUpdated?: string;
  arrivalDate?: string;
  clearanceDate?: string;
  gateOutDate?: string;
  deliveryDate?: string;
  clientName?: string;
  containers: Container[];
  documents: Document[];
  trackingUpdates: TrackingUpdate[];
  createdAt: string;
  updatedAt: string;
}

/* ── Stage Labels ───────────────────────────────────── */
const STAGE_LABELS: Record<string, string> = {
  JOB_CREATED: "Job Created",
  BOOKING_CONFIRMED: "Booking Confirmed",
  CARGO_READY: "Cargo Ready",
  STUFFING_DONE: "Stuffed / Loaded",
  GATE_IN: "Gate In at Port",
  BL_DRAFT: "BL Draft Issued",
  BL_RELEASED: "BL Released",
  VESSEL_SAILED: "Vessel Sailed",
  IN_TRANSIT: "In Transit",
  ARRIVED: "Arrived at Port",
  CUSTOMS_FILED: "Customs Filed",
  CUSTOMS_CLEARED: "Customs Cleared",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

const ORDERED_STAGES = [
  "JOB_CREATED", "BOOKING_CONFIRMED", "CARGO_READY", "STUFFING_DONE",
  "GATE_IN", "BL_RELEASED", "VESSEL_SAILED", "IN_TRANSIT",
  "ARRIVED", "CUSTOMS_CLEARED", "OUT_FOR_DELIVERY", "DELIVERED",
];

function fmt(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Stage Timeline ─────────────────────────────────── */
function StageTimeline({ currentStage, updates }: { currentStage: string; updates: TrackingUpdate[] }) {
  const currentIdx = ORDERED_STAGES.indexOf(currentStage);
  const done = currentIdx;

  return (
    <div className="relative">
      {ORDERED_STAGES.map((stage, i) => {
        const isDone = i < done;
        const isCurrent = i === done;
        const label = STAGE_LABELS[stage] ?? stage.replace(/_/g, " ");
        const update = updates.find((u) => u.stage === stage);

        return (
          <div key={stage} className="flex gap-4 mb-1">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                style={{
                  background: isDone ? "#D4AF37" : isCurrent ? "rgba(212,175,55,0.15)" : "rgba(0,0,0,0.05)",
                  border: isCurrent ? "1.5px solid #D4AF37" : "none",
                }}
              >
                {isDone ? (
                  <CheckCircle size={13} style={{ color: "#1a1c1c" }} />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#D4AF37" }} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.15)" }} />
                )}
              </div>
              {i < ORDERED_STAGES.length - 1 && (
                <div className="w-px flex-1 my-0.5" style={{ background: isDone ? "#D4AF37" : "rgba(0,0,0,0.08)", minHeight: "20px" }} />
              )}
            </div>
            <div className="pb-4 pt-0.5 flex-1">
              <p className="text-xs font-semibold" style={{ color: isDone || isCurrent ? "#1a1c1c" : "#aaa" }}>
                {label}
              </p>
              {update && (
                <p className="text-xs mt-0.5" style={{ color: "#7e7576" }}>
                  {update.notes && <span>{update.notes} · </span>}
                  {fmt(update.createdAt)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Info Row ───────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
      <span className="text-xs font-semibold uppercase tracking-widest flex-shrink-0" style={{ color: "#7e7576" }}>{label}</span>
      <span className="text-xs text-right font-semibold" style={{ color: "#1a1c1c" }}>{value}</span>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function TrackPage() {
  const [jobNo, setJobNo] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [job, setJob] = useState<JobData | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobNo.trim() || !pin.trim()) { setError("Enter both Job Number and PIN"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobNo: jobNo.trim(), pin: pin.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setJob(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAir = job?.mode?.toLowerCase().includes("air");

  return (
    <div className="min-h-screen" style={{ background: "#fafafa" }}>
      {/* ── Navbar strip ───────────────────────────────── */}
      <div
        className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between border-b"
        style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderColor: "rgba(0,0,0,0.07)" }}
      >
        <LogoBrand height={120} href="/" />
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-all"
          style={{ color: "#7e7576" }}
        >
          <ArrowLeft size={13} />
          Home
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* ── Search form ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          {!job && (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: "rgba(212,175,55,0.1)" }}>
                  <Search size={22} style={{ color: "#D4AF37" }} />
                </div>
                <h1
                  className="mb-2"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "36px", color: "#1a1c1c", letterSpacing: "-0.02em" }}
                >
                  Track Your Shipment
                </h1>
                <p className="text-sm" style={{ color: "#7e7576" }}>
                  Enter the shipment details provided by your freight forwarder.
                </p>
              </div>

              <div
                className="p-8 rounded-2xl border"
                style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 4px 32px rgba(0,0,0,0.05)" }}
              >
                <form onSubmit={handleTrack} className="flex flex-col gap-6">

                  {error && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.07)", border: "0.5px solid rgba(239,68,68,0.3)", color: "#DC2626" }}>
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                      Job / Shipment Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NL/2025/00123"
                      value={jobNo}
                      onChange={(e) => setJobNo(e.target.value.toUpperCase())}
                      className="outline-none bg-transparent pb-2 w-full text-sm"
                      style={{
                        borderBottom: "0.5px solid rgba(0,0,0,0.2)",
                        color: "#1a1c1c",
                        fontFamily: "monospace",
                        letterSpacing: "0.05em",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                      Access PIN
                    </label>
                    <input
                      type="text"
                      placeholder="6-digit PIN from your forwarder"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={8}
                      className="outline-none bg-transparent pb-2 w-full text-sm"
                      style={{
                        borderBottom: "0.5px solid rgba(0,0,0,0.2)",
                        color: "#1a1c1c",
                        fontFamily: "monospace",
                        letterSpacing: "0.1em",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                    <p className="text-xs" style={{ color: "#aaa" }}>
                      Contact your freight forwarder if you don&apos;t have a PIN.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all"
                    style={{ background: loading ? "#ccc" : "#1a1c1c", color: loading ? "#fff" : "#D4AF37" }}
                  >
                    {loading ? "Searching…" : "Track Shipment →"}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-xs" style={{ color: "#aaa" }}>
                This portal is provided by NavkarOS. Your data is secure and only accessible with the correct PIN.
              </p>
            </motion.div>
          )}

          {/* ── Results ─────────────────────────────────── */}
          {job && (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

              {/* Back button */}
              <button
                onClick={() => { setJob(null); setJobNo(""); setPin(""); }}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-8 transition-all"
                style={{ color: "#7e7576" }}
              >
                <ArrowLeft size={12} /> Track Another Shipment
              </button>

              {/* Header card */}
              <div
                className="p-6 rounded-2xl border mb-5"
                style={{ background: "#1a1c1c", borderColor: "rgba(212,175,55,0.2)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>
                      {job.jobType} · {job.mode}
                    </p>
                    <p className="font-black text-xl" style={{ color: "#fff", fontFamily: "monospace" }}>{job.jobNo}</p>
                    {job.clientName && (
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{job.clientName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isAir ? (
                      <Plane size={16} style={{ color: "#D4AF37" }} />
                    ) : (
                      <Ship size={16} style={{ color: "#D4AF37" }} />
                    )}
                    <span
                      className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{
                        background: job.status === "ACTIVE" ? "rgba(16,185,129,0.15)" : "rgba(212,175,55,0.12)",
                        color: job.status === "ACTIVE" ? "#10B981" : "#D4AF37",
                      }}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Route */}
                {(job.portLoading || job.portDischarge) && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Origin</p>
                      <p className="text-sm font-semibold" style={{ color: "#fff" }}>{job.portLoading ?? "—"}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    <div className="flex-1 text-right">
                      <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Destination</p>
                      <p className="text-sm font-semibold" style={{ color: "#fff" }}>{job.portDischarge ?? "—"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Current stage */}
              <div
                className="px-5 py-4 rounded-xl border mb-5 flex items-center gap-3"
                style={{ background: "rgba(212,175,55,0.05)", borderColor: "rgba(212,175,55,0.25)" }}
              >
                <Clock size={16} style={{ color: "#D4AF37", flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>Current Stage</p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "#1a1c1c" }}>
                    {STAGE_LABELS[job.stage] ?? job.stage.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {/* Key dates */}
              <div
                className="p-6 rounded-2xl border mb-5"
                style={{ background: "#fff", borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>Key Dates</p>
                <InfoRow label="Sailing / Departure" value={fmt(job.sailingDate)} />
                <InfoRow label="ETA (Original)" value={fmt(job.etaOriginal)} />
                <InfoRow label="ETA (Updated)" value={fmt(job.etaUpdated)} />
                <InfoRow label="Arrived at Port" value={fmt(job.arrivalDate)} />
                <InfoRow label="Customs Cleared" value={fmt(job.clearanceDate)} />
                <InfoRow label="Gate Out" value={fmt(job.gateOutDate)} />
                <InfoRow label="Delivered" value={fmt(job.deliveryDate)} />
              </div>

              {/* Shipment details */}
              <div
                className="p-6 rounded-2xl border mb-5"
                style={{ background: "#fff", borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>Shipment Details</p>
                <InfoRow label="Commodity" value={job.commodity} />
                <InfoRow label="Packages" value={job.packages ? `${job.packages} ${job.packageType ?? ""}`.trim() : null} />
                <InfoRow label="Gross Weight" value={job.grossWeight ? `${job.grossWeight} kg` : null} />
                <InfoRow label="CBM" value={job.cbm ? `${job.cbm} m³` : null} />
                <InfoRow label={isAir ? "Airline / Flight" : "Shipping Line"} value={job.shippingLine} />
                <InfoRow label={isAir ? "Flight No" : "Vessel / Voyage"} value={isAir ? job.flightNo : (job.vessel ? `${job.vessel}${job.voyage ? ` / ${job.voyage}` : ""}` : null)} />
                <InfoRow label={isAir ? "MAWB" : "MBL"} value={isAir ? job.mawbNo : job.mblNo} />
                <InfoRow label={isAir ? "HAWB" : "HBL"} value={isAir ? job.hawbNo : job.hblNo} />
              </div>

              {/* Containers */}
              {job.containers.length > 0 && (
                <div
                  className="p-6 rounded-2xl border mb-5"
                  style={{ background: "#fff", borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>
                    Containers ({job.containers.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {job.containers.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                        style={{ background: "#f9f9f9" }}
                      >
                        <div className="flex items-center gap-2">
                          <Package size={13} style={{ color: "#D4AF37" }} />
                          <span className="text-xs font-semibold font-mono" style={{ color: "#1a1c1c" }}>{c.containerNo}</span>
                        </div>
                        <span className="text-xs" style={{ color: "#7e7576" }}>{c.size} {c.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {job.documents.length > 0 && (
                <div
                  className="p-6 rounded-2xl border mb-5"
                  style={{ background: "#fff", borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>
                    Documents ({job.documents.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {job.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-3 rounded-lg border transition-all duration-200"
                        style={{ borderColor: "rgba(0,0,0,0.07)", textDecoration: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; e.currentTarget.style.background = "rgba(212,175,55,0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)" }}>
                            <FileText size={14} style={{ color: "#D4AF37" }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "#1a1c1c" }}>{doc.label || doc.type}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{doc.type} · {fmt(doc.createdAt)}</p>
                          </div>
                        </div>
                        <Download size={14} style={{ color: "#D4AF37", flexShrink: 0 }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracking timeline */}
              <div
                className="p-6 rounded-2xl border mb-5"
                style={{ background: "#fff", borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7e7576" }}>
                  Shipment Progress
                </p>
                <StageTimeline currentStage={job.stage} updates={job.trackingUpdates} />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-xs" style={{ color: "#aaa" }}>
                  Last updated: {fmt(job.updatedAt)}
                </p>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} style={{ color: "#aaa" }} />
                  <p className="text-xs" style={{ color: "#aaa" }}>NavkarOS · Powered by Nexlog</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
