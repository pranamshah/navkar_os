"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const countries = [
  "China", "United States", "Germany", "Japan", "South Korea",
  "Taiwan", "Vietnam", "Bangladesh", "Sri Lanka", "UAE",
  "United Kingdom", "France", "Italy", "Australia", "Brazil",
  "Indonesia", "Malaysia", "Thailand", "Singapore", "Turkey",
];

const incoterms = ["EXW", "FOB", "CIF", "CFR", "DAP"];

const BCD_RATE = 0.075;
const IGST_RATE = 0.18;
const SWS_RATE = 0.10;
const LANDING_RATE = 0.01;

type CalcResult = {
  fob: number;
  freight: number;
  insurance: number;
  cif: number;
  landing: number;
  av: number;
  bcd: number;
  sws: number;
  igst: number;
  totalDuty: number;
  cfsPort: number;
  cnfFee: number;
  totalLanded: number;
  effectiveDutyRate: number;
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function DutyCalculatorPage() {
  const [hsCode, setHsCode] = useState("");
  const [country, setCountry] = useState("");
  const [invoiceValue, setInvoiceValue] = useState("");
  const [incoterm, setIncoterm] = useState("FOB");
  const [freight, setFreight] = useState("");
  const [insurance, setInsurance] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const calculate = () => {
    const inv = parseFloat(invoiceValue) || 0;
    const fr = parseFloat(freight) || 0;
    const ins = parseFloat(insurance) || 0;

    let fob = inv;
    if (incoterm === "EXW") fob = inv * 1.02;
    if (incoterm === "CIF" || incoterm === "CFR") fob = inv - fr - ins;

    const cif = fob + fr + ins;
    const landing = cif * LANDING_RATE;
    const av = cif + landing;
    const bcd = av * BCD_RATE;
    const sws = bcd * SWS_RATE;
    const igst = (av + bcd + sws) * IGST_RATE;
    const totalDuty = bcd + sws + igst;
    const cfsPort = av * 0.005 + 5000;
    const cnfFee = av * 0.01 + 8000;
    const totalLanded = av + totalDuty + cfsPort + cnfFee;
    const effectiveDutyRate = inv > 0 ? (totalDuty / inv) * 100 : 0;

    setResult({ fob, freight: fr, insurance: ins, cif, landing, av, bcd, sws, igst, totalDuty, cfsPort, cnfFee, totalLanded, effectiveDutyRate });
  };

  const rows = result ? [
    { label: "FOB Value", calc: "Entered value", amount: fmt(result.fob), bold: false },
    { label: "Freight", calc: "Entered", amount: fmt(result.freight), bold: false },
    { label: "Insurance", calc: "Entered", amount: fmt(result.insurance), bold: false },
    { label: "CIF Value", calc: "FOB + Freight + Insurance", amount: fmt(result.cif), bold: false },
    { label: "Landing Charges (1%)", calc: "CIF × 1%", amount: fmt(result.landing), bold: false },
    { label: "Assessable Value (AV)", calc: "CIF + Landing", amount: fmt(result.av), bold: true },
    { label: "Basic Customs Duty (BCD)", calc: `AV × ${(BCD_RATE * 100).toFixed(1)}%`, amount: fmt(result.bcd), bold: false },
    { label: "Social Welfare Surcharge", calc: "BCD × 10%", amount: fmt(result.sws), bold: false },
    { label: "IGST", calc: "(AV + BCD + SWS) × 18%", amount: fmt(result.igst), bold: false },
    { label: "Total Duty", calc: "BCD + SWS + IGST", amount: fmt(result.totalDuty), bold: true, highlight: true },
    { label: "CFS + Port Charges (est.)", calc: "0.5% of AV + ₹5,000 fixed", amount: fmt(result.cfsPort), bold: false },
    { label: "C&F Agent Fee (est.)", calc: "1% of AV + ₹8,000 fixed", amount: fmt(result.cnfFee), bold: false },
    { label: "Total Landed Cost", calc: "AV + Duty + Charges", amount: fmt(result.totalLanded), bold: true, highlight: true, teal: true },
    { label: "Effective Duty Rate", calc: "Total Duty / Invoice Value", amount: result.effectiveDutyRate.toFixed(1) + "%", bold: true },
  ] : [];

  return (
    <div className="p-6 max-w-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "'EB Garamond', Georgia, serif", color: "#111827", fontSize: 26 }}>
          Duty Calculator
        </h1>
        <p className="text-xs" style={{ color: "#6B7280" }}>Calculate exact landed cost including all duties and charges</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="rounded-xl border p-6 h-fit" style={{ background: "#fff", borderColor: "#E5E7EB" }}>
          <h2 className="text-sm font-semibold mb-5" style={{ color: "#111827" }}>Shipment Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>HS Code</label>
              <input
                type="text"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                placeholder="e.g. 73044900"
                className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-all"
                style={{ borderColor: "#E5E7EB", color: "#111827" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>Origin Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-all bg-white"
                style={{ borderColor: "#E5E7EB", color: country ? "#111827" : "#9CA3AF" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              >
                <option value="">Select country</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>Invoice Value (₹)</label>
              <input
                type="number"
                value={invoiceValue}
                onChange={(e) => setInvoiceValue(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-all"
                style={{ borderColor: "#E5E7EB", color: "#111827" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>Incoterms</label>
              <div className="flex gap-2 flex-wrap">
                {incoterms.map((t) => (
                  <button
                    key={t}
                    onClick={() => setIncoterm(t)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all"
                    style={{
                      background: incoterm === t ? "#0D9488" : "#fff",
                      color: incoterm === t ? "#fff" : "#6B7280",
                      borderColor: incoterm === t ? "#0D9488" : "#E5E7EB",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>Freight Amount (₹)</label>
              <input
                type="number"
                value={freight}
                onChange={(e) => setFreight(e.target.value)}
                placeholder="e.g. 25000"
                className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-all"
                style={{ borderColor: "#E5E7EB", color: "#111827" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#6B7280" }}>Insurance Amount (₹)</label>
              <input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full px-3 py-2.5 rounded-lg border text-[13px] outline-none transition-all"
                style={{ borderColor: "#E5E7EB", color: "#111827" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0D9488")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>

            <button
              onClick={calculate}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors mt-2"
              style={{ background: "#0D9488" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#0F766E")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0D9488")}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calculate</span>
                Calculate Landed Cost
              </span>
            </button>
          </div>
        </div>

        {/* Result waterfall */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border flex flex-col items-center justify-center"
              style={{ background: "#fff", borderColor: "#E5E7EB", minHeight: 400 }}
            >
              <span className="material-symbols-outlined mb-3" style={{ fontSize: 48, color: "#e5e7eb" }}>calculate</span>
              <p className="text-sm font-medium" style={{ color: "#1a1c1c" }}>Enter shipment details</p>
              <p className="text-[11px] mt-1 text-center max-w-48" style={{ color: "#7e7576" }}>
                Fill in the form and click Calculate to see the full duty breakdown
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border overflow-hidden"
              style={{ background: "#fff", borderColor: "#E5E7EB" }}
            >
              <div className="px-5 py-4 border-b" style={{ borderColor: "#E5E7EB", background: "#F0FDFA" }}>
                <h2 className="text-sm font-semibold" style={{ color: "#0D9488" }}>Landed Cost Breakdown</h2>
                <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>BCD @ 7.5% · IGST @ 18% · SWS @ 10%</p>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                      <th className="text-left py-2.5 px-4 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>Step</th>
                      <th className="text-left py-2.5 px-4 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>Calculation</th>
                      <th className="text-right py-2.5 px-4 font-semibold text-[10px] uppercase tracking-wider" style={{ color: "#6B7280" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid #F3F4F6",
                          background: row.teal ? "#F0FDFA" : row.highlight ? "#FFFBEB" : "transparent",
                        }}
                      >
                        <td className="py-2.5 px-4" style={{ fontWeight: row.bold ? 700 : 400, color: row.teal ? "#0D9488" : "#111827" }}>{row.label}</td>
                        <td className="py-2.5 px-4 text-[11px]" style={{ color: "#6B7280" }}>{row.calc}</td>
                        <td className="py-2.5 px-4 text-right font-mono" style={{ fontWeight: row.bold ? 700 : 400, color: row.teal ? "#0D9488" : "#111827" }}>{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t" style={{ borderColor: "#E5E7EB" }}>
                <p className="text-[10px]" style={{ color: "#9CA3AF" }}>
                  * Estimates based on standard BCD 7.5% and IGST 18%. Actual rates may vary by HS code. Always verify with official ICEGATE data.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
