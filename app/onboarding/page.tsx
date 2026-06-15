"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Upload, X, Lock } from "lucide-react";
import Link from "next/link";
import LogoBrand from "@/components/ui/LogoBrand";

const CITIES = [
  "Chennai", "Mumbai", "JNPT / Nhava Sheva", "Mundra", "Kolkata",
  "Cochin", "Vizag", "Tuticorin", "Delhi / ICD", "Bengaluru",
  "Hyderabad", "Ahmedabad", "Other",
];

const YEARS_OPTIONS = [
  "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years",
];

// State code → state name map (first 2 digits of GSTIN)
const GSTIN_STATES: Record<string, { name: string; code: string }> = {
  "01": { name: "Jammu & Kashmir", code: "01" },
  "02": { name: "Himachal Pradesh", code: "02" },
  "03": { name: "Punjab", code: "03" },
  "04": { name: "Chandigarh", code: "04" },
  "05": { name: "Uttarakhand", code: "05" },
  "06": { name: "Haryana", code: "06" },
  "07": { name: "Delhi", code: "07" },
  "08": { name: "Rajasthan", code: "08" },
  "09": { name: "Uttar Pradesh", code: "09" },
  "10": { name: "Bihar", code: "10" },
  "11": { name: "Sikkim", code: "11" },
  "12": { name: "Arunachal Pradesh", code: "12" },
  "13": { name: "Nagaland", code: "13" },
  "14": { name: "Manipur", code: "14" },
  "15": { name: "Mizoram", code: "15" },
  "16": { name: "Tripura", code: "16" },
  "17": { name: "Meghalaya", code: "17" },
  "18": { name: "Assam", code: "18" },
  "19": { name: "West Bengal", code: "19" },
  "20": { name: "Jharkhand", code: "20" },
  "21": { name: "Odisha", code: "21" },
  "22": { name: "Chhattisgarh", code: "22" },
  "23": { name: "Madhya Pradesh", code: "23" },
  "24": { name: "Gujarat", code: "24" },
  "26": { name: "Dadra & Nagar Haveli", code: "26" },
  "27": { name: "Maharashtra", code: "27" },
  "28": { name: "Andhra Pradesh (old)", code: "28" },
  "29": { name: "Karnataka", code: "29" },
  "30": { name: "Goa", code: "30" },
  "31": { name: "Lakshadweep", code: "31" },
  "32": { name: "Kerala", code: "32" },
  "33": { name: "Tamil Nadu", code: "33" },
  "34": { name: "Puducherry", code: "34" },
  "35": { name: "Andaman & Nicobar", code: "35" },
  "36": { name: "Telangana", code: "36" },
  "37": { name: "Andhra Pradesh", code: "37" },
};

const BUSINESS_TYPES = [
  { id: "CF_AGENT", label: "C&F Agent / Freight Forwarder", icon: "🚢" },
  { id: "CHA", label: "Custom House Agent (CHA)", icon: "📋" },
  { id: "IMPORTER_EXPORTER", label: "Importer / Exporter", icon: "🌐" },
  { id: "CFS_WAREHOUSE", label: "CFS Station / Warehouse", icon: "🏭" },
  { id: "TRANSPORTER", label: "Transporter / Fleet Operator", icon: "🚛" },
  { id: "OTHER", label: "Other", icon: "⚙️" },
];

interface UploadedFile {
  file: File;
  url?: string;
  uploading?: boolean;
  error?: string;
}

function DropZone({
  label, required, hint, value, onChange,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  value: UploadedFile | null;
  onChange: (f: UploadedFile | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); return; }
    const item: UploadedFile = { file, uploading: true };
    onChange(item);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "navkaros/onboarding");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) onChange({ file, url: data.url });
    else onChange({ file, error: data.error ?? "Upload failed" });
  };

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: "#7e7576" }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {value ? (
        <div
          className="flex items-center gap-3 px-4 py-3 border"
          style={{
            borderColor: value.error ? "#FCA5A5" : value.url ? "rgba(16,185,129,0.3)" : "rgba(30,64,175,0.3)",
            borderWidth: "0.5px",
            background: value.error ? "#FEF2F2" : value.url ? "rgba(16,185,129,0.04)" : "rgba(30,64,175,0.04)",
          }}
        >
          {value.uploading && !value.url && !value.error && (
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "#1E40AF", borderTopColor: "transparent" }} />
          )}
          {value.url && <Check size={14} style={{ color: "#10B981" }} />}
          {value.error && <X size={14} style={{ color: "#EF4444" }} />}
          <span className="flex-1 text-xs truncate" style={{ color: "#1a1c1c" }}>{value.file.name}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs"
            style={{ color: "#7e7576" }}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className="w-full border-2 border-dashed py-8 text-center transition-all duration-200"
          style={{ borderColor: "rgba(0,0,0,0.12)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1E40AF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
        >
          <Upload size={20} style={{ color: "#7e7576", margin: "0 auto 8px" }} />
          <p className="text-sm" style={{ color: "#7e7576" }}>Drag & drop or click to upload</p>
          <p className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.3)" }}>PDF, JPG, PNG — max 5MB</p>
          {hint && <p className="text-xs mt-1" style={{ color: "#1E40AF" }}>{hint}</p>}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Step 2
  const [gstin, setGstin] = useState("");
  const [gstinState, setGstinState] = useState<{ name: string; code: string } | null>(null);
  const [gstinValid, setGstinValid] = useState<boolean | null>(null);
  const [pan, setPan] = useState("");
  const [iecCode, setIecCode] = useState("");
  const [chaLicenceNo, setChaLicenceNo] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [state, setState] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");

  // Step 3
  const [gstCert, setGstCert] = useState<UploadedFile | null>(null);
  const [panCopy, setPanCopy] = useState<UploadedFile | null>(null);
  const [licenceCopy, setLicenceCopy] = useState<UploadedFile | null>(null);

  const validateGstin = (val: string) => {
    const upper = val.toUpperCase();
    setGstin(upper);
    if (upper.length >= 2) {
      const stateInfo = GSTIN_STATES[upper.slice(0, 2)];
      if (stateInfo) {
        setGstinState(stateInfo);
        setState(stateInfo.name);
        setStateCode(stateInfo.code);
      } else {
        setGstinState(null);
      }
    }
    if (upper.length === 15) {
      const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      setGstinValid(re.test(upper));
    } else {
      setGstinValid(null);
    }
  };

  const needsIec = ["CF_AGENT", "FREIGHT_FORWARDER", "IMPORTER_EXPORTER"].includes(businessType);
  const needsCha = businessType === "CHA";

  const handleSubmit = async () => {
    if (!gstCert?.url) { setError("Please upload GST Certificate"); return; }
    if (!panCopy?.url) { setError("Please upload PAN Card copy"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/onboarding/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName, businessType, city, state, stateCode, whatsapp,
        gstin, pan: pan.toUpperCase(), iecCode, chaLicenceNo,
        businessAddress, yearsInBusiness,
        gstCertPath: gstCert.url,
        panCopyPath: panCopy.url,
        licenceCopyPath: licenceCopy?.url,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.replace("/status");
    router.refresh();
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const STEPS = [
    { n: 1, label: "Business Details" },
    { n: 2, label: "Registration" },
    { n: 3, label: "Documents" },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-[280px_1fr]" style={{ background: "#fafafa" }}>
      {/* ── Left progress sidebar ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col p-12 relative" style={{ background: "#1a1c1c" }}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(30,64,175,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,64,175,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative z-10 mb-16">
          <LogoBrand height={120} onDark href="/" />
        </div>

        <div className="relative z-10 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Account Setup</p>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "28px", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Let&apos;s set up<br />your business
          </h2>
        </div>

        <div className="relative z-10 flex flex-col gap-1">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex items-center gap-4 py-4 px-3 rounded-lg transition-all duration-200"
              style={{ background: step === s.n ? "rgba(30,64,175,0.1)" : "transparent" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: step > s.n ? "#1E40AF" : step === s.n ? "rgba(30,64,175,0.2)" : "rgba(255,255,255,0.08)",
                  color: step > s.n ? "#1a1c1c" : step === s.n ? "#1E40AF" : "rgba(255,255,255,0.3)",
                  border: step === s.n ? "1px solid rgba(30,64,175,0.4)" : "none",
                }}
              >
                {step > s.n ? <Check size={12} /> : s.n}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: step >= s.n ? "#fff" : "rgba(255,255,255,0.3)" }}>
                  Step {s.n}
                </p>
                <p className="text-sm" style={{ color: step >= s.n ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right content ───────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-hidden">
        <div className="max-w-lg w-full mx-auto">
          {/* Mobile progress bar */}
          <div className="lg:hidden flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full" style={{ background: step >= s ? "#1E40AF" : "rgba(0,0,0,0.1)" }} />
            ))}
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 text-xs" style={{ background: "#FEF2F2", border: "0.5px solid #FCA5A5", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── STEP 1 ───────────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="s1" {...slideVariants}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1E40AF" }}>Step 1 of 3</p>
                <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "34px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }} className="mb-2">
                  Tell us about your business
                </h1>
                <p className="mb-8 text-sm" style={{ color: "#7e7576" }}>
                  This helps us customise NavkarOS for your specific needs.
                </p>

                <div className="flex flex-col gap-6">
                  {/* Business Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Business Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Mehta Freight Solutions Pvt. Ltd."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#1E40AF")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "#7e7576" }}>Business Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BUSINESS_TYPES.map((bt) => (
                        <button
                          key={bt.id}
                          type="button"
                          onClick={() => setBusinessType(bt.id)}
                          className="flex items-center gap-2 p-3 text-left border transition-all duration-200"
                          style={{
                            borderColor: businessType === bt.id ? "#1E40AF" : "rgba(0,0,0,0.1)",
                            borderWidth: "0.5px",
                            background: businessType === bt.id ? "rgba(30,64,175,0.06)" : "#fff",
                          }}
                        >
                          <span>{bt.icon}</span>
                          <span className="text-xs font-semibold" style={{ color: "#1a1c1c", lineHeight: 1.3 }}>{bt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>City / Port you operate from *</label>
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: city ? "#1a1c1c" : "#7e7576", fontSize: "15px" }}
                    >
                      <option value="">Select city/port</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#1E40AF")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                    <p className="text-xs" style={{ color: "#7e7576" }}>Used for shipment and invoice notifications</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!businessName || !businessType || !city || !whatsapp) { setError("Please fill all required fields"); return; }
                      setError("");
                      setStep(2);
                    }}
                    className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                    style={{ background: "#1a1c1c", color: "#fff" }}
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2 ───────────────────────────────────────── */}
            {step === 2 && (
              <motion.div key="s2" {...slideVariants}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1E40AF" }}>Step 2 of 3</p>
                <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "34px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }} className="mb-2">
                  Registration details
                </h1>
                <p className="mb-8 text-sm" style={{ color: "#7e7576" }}>
                  Required for GST compliance and account verification.
                </p>

                <div className="flex flex-col gap-6">
                  {/* GSTIN */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>GSTIN *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="22AAAAA0000A1Z5"
                        value={gstin}
                        onChange={(e) => validateGstin(e.target.value)}
                        maxLength={15}
                        className="outline-none bg-transparent pb-2 w-full pr-24"
                        style={{
                          borderBottom: `0.5px solid ${gstinValid === false ? "#EF4444" : gstinValid === true ? "#10B981" : "rgba(0,0,0,0.2)"}`,
                          color: "#1a1c1c",
                          fontSize: "15px",
                          fontFamily: "monospace",
                          textTransform: "uppercase",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#1E40AF")}
                        onBlur={(e) => {
                          e.currentTarget.style.borderBottomColor = gstinValid === false ? "#EF4444" : gstinValid === true ? "#10B981" : "rgba(0,0,0,0.2)";
                        }}
                      />
                      {gstinValid !== null && (
                        <span className="absolute right-0 bottom-2 text-xs font-semibold" style={{ color: gstinValid ? "#10B981" : "#EF4444" }}>
                          {gstinValid ? "✅ Valid" : "❌ Invalid"}
                        </span>
                      )}
                    </div>
                    {gstinState && (
                      <p className="text-xs" style={{ color: "#10B981" }}>
                        State: {gstinState.name} (Code: {gstinState.code})
                      </p>
                    )}
                  </div>

                  {/* PAN */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>PAN Number *</label>
                    <input
                      type="text"
                      placeholder="AAAAA9999A"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      maxLength={10}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px", fontFamily: "monospace", textTransform: "uppercase" }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#1E40AF")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                  </div>

                  {/* IEC (conditional) */}
                  {needsIec && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>IEC Code {needsIec && businessType === "IMPORTER_EXPORTER" ? "*" : "(Optional)"}</label>
                      <input
                        type="text"
                        placeholder="XXXXXXXXXX"
                        value={iecCode}
                        onChange={(e) => setIecCode(e.target.value.toUpperCase())}
                        className="outline-none bg-transparent pb-2 w-full"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px", fontFamily: "monospace" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#1E40AF")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                      />
                    </div>
                  )}

                  {/* CHA Licence (conditional) */}
                  {needsCha && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>CHA Licence Number *</label>
                      <input
                        type="text"
                        placeholder="CHA/XXXXXX/XXXX"
                        value={chaLicenceNo}
                        onChange={(e) => setChaLicenceNo(e.target.value)}
                        className="outline-none bg-transparent pb-2 w-full"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#1E40AF")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                      />
                    </div>
                  )}

                  {/* Business Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Business Address *</label>
                    <input
                      type="text"
                      placeholder="Office No. 201, Shipping House, Mumbai 400001"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#1E40AF")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                  </div>

                  {/* State (auto-filled) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>State *</label>
                      <input
                        type="text"
                        placeholder="Auto-filled from GSTIN"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="outline-none bg-transparent pb-2 w-full"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px", background: "transparent" }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>State Code</label>
                      <input
                        type="text"
                        value={stateCode}
                        readOnly
                        className="outline-none bg-transparent pb-2 w-full"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.08)", color: "#7e7576", fontSize: "15px" }}
                      />
                    </div>
                  </div>

                  {/* Years in Business */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Years in Business</label>
                    <select
                      value={yearsInBusiness}
                      onChange={(e) => setYearsInBusiness(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: yearsInBusiness ? "#1a1c1c" : "#7e7576", fontSize: "15px" }}
                    >
                      <option value="">Select…</option>
                      {YEARS_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setStep(1); setError(""); }} className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200" style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#7e7576" }}>
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!gstin || !pan || !businessAddress || !state) { setError("Please fill all required fields"); return; }
                        if (gstinValid === false) { setError("GSTIN format is invalid"); return; }
                        if (needsCha && !chaLicenceNo) { setError("CHA Licence Number is required"); return; }
                        setError("");
                        setStep(3);
                      }}
                      className="flex-[2] py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                      style={{ background: "#1a1c1c", color: "#fff" }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3 ───────────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="s3" {...slideVariants}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1E40AF" }}>Step 3 of 3</p>
                <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "34px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }} className="mb-2">
                  Upload verification documents
                </h1>
                <p className="mb-8 text-sm" style={{ color: "#7e7576" }}>
                  We verify these within 48 hours. All documents are stored securely.
                </p>

                <div className="flex flex-col gap-6">
                  <DropZone
                    label="GST Certificate"
                    required
                    value={gstCert}
                    onChange={setGstCert}
                  />
                  <DropZone
                    label="PAN Card Copy"
                    required
                    value={panCopy}
                    onChange={setPanCopy}
                  />
                  {(needsCha || needsIec) && (
                    <DropZone
                      label={needsCha ? "CHA Licence Certificate" : "IEC Certificate"}
                      required
                      hint={needsCha ? "CHA licence issued by Customs" : "Import Export Code certificate"}
                      value={licenceCopy}
                      onChange={setLicenceCopy}
                    />
                  )}

                  {/* Security notice */}
                  <div
                    className="flex items-start gap-3 px-4 py-3"
                    style={{ background: "rgba(0,0,0,0.03)", border: "0.5px solid rgba(0,0,0,0.08)" }}
                  >
                    <Lock size={14} style={{ color: "#7e7576", flexShrink: 0, marginTop: "2px" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "#7e7576" }}>
                      Your documents are encrypted and stored securely. Only our verification team has access. We never share your data with third parties.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setStep(2); setError(""); }} className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200" style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#7e7576" }}>
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-[2] py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                      style={{ background: loading ? "#ccc" : "#1E40AF", color: "#1a1c1c" }}
                    >
                      {loading ? "Submitting…" : "Submit Application →"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
