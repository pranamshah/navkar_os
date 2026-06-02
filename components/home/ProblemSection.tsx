"use client";

import { motion } from "framer-motion";
import { problems } from "@/data/homepage";

const illustrations: Record<string, React.ReactNode> = {
  WhatsApp_Chaos: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="4" y="8" width="44" height="28" rx="6" fill="#E8F5E9" />
      <rect x="8" y="14" width="28" height="4" rx="2" fill="#4CAF50" opacity="0.6" />
      <rect x="8" y="22" width="20" height="4" rx="2" fill="#4CAF50" opacity="0.4" />
      <rect x="32" y="20" width="44" height="28" rx="6" fill="#FFF3E0" />
      <rect x="36" y="26" width="28" height="4" rx="2" fill="#FF9800" opacity="0.5" />
      <rect x="36" y="34" width="20" height="4" rx="2" fill="#FF9800" opacity="0.4" />
      <rect x="4" y="42" width="36" height="10" rx="4" fill="#E3F2FD" />
      <rect x="8" y="45" width="18" height="3" rx="1.5" fill="#2196F3" opacity="0.5" />
      <circle cx="68" cy="12" r="7" fill="#FF5252" opacity="0.8" />
      <text x="65" y="16" fontSize="8" fill="white" fontWeight="bold">!</text>
    </svg>
  ),
  Excel_Dependency: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="8" y="6" width="64" height="48" rx="3" fill="#E8F5E9" />
      {[0,1,2,3].map(r => (
        <g key={r}>
          {[0,1,2,3].map(c => (
            <rect key={c} x={8 + c*16} y={12 + r*12} width="15" height="11" fill={r===2 && c===2 ? "#FF5252" : "#fff"} stroke="#C8E6C9" strokeWidth="0.5" />
          ))}
        </g>
      ))}
      <rect x="40" y="24" width="15" height="11" fill="#FF5252" opacity="0.3" />
      <text x="43" y="32" fontSize="7" fill="#D32F2F">#ERR</text>
      <rect x="8" y="48" width="64" height="6" rx="0" fill="#1B5E20" opacity="0.15" />
    </svg>
  ),
  Tally_Friction: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="6" y="8" width="28" height="44" rx="4" fill="#E3F2FD" />
      <rect x="10" y="14" width="20" height="3" rx="1.5" fill="#1565C0" opacity="0.5" />
      <rect x="10" y="20" width="16" height="3" rx="1.5" fill="#1565C0" opacity="0.4" />
      <rect x="10" y="26" width="18" height="3" rx="1.5" fill="#1565C0" opacity="0.3" />
      <rect x="10" y="32" width="14" height="3" rx="1.5" fill="#1565C0" opacity="0.4" />
      <path d="M38 30 L46 30" stroke="#FF5252" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="42" cy="30" r="5" fill="#FF5252" opacity="0.2" />
      <rect x="48" y="8" width="28" height="44" rx="4" fill="#FFF3E0" />
      <rect x="52" y="14" width="20" height="3" rx="1.5" fill="#E65100" opacity="0.5" />
      <rect x="52" y="20" width="16" height="3" rx="1.5" fill="#E65100" opacity="0.4" />
      <rect x="52" y="26" width="18" height="3" rx="1.5" fill="#E65100" opacity="0.3" />
    </svg>
  ),
  Delayed_Rates: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="6" y="6" width="68" height="48" rx="4" fill="#FFF8E1" />
      <polyline points="12,46 26,36 36,40 50,24 64,28" stroke="#FFC107" strokeWidth="2" fill="none" />
      <polyline points="12,46 26,36 36,40 50,24 64,28" stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
      <circle cx="64" cy="28" r="4" fill="#FF5252" />
      <line x1="12" y1="8" x2="12" y2="48" stroke="#E0E0E0" strokeWidth="0.5" />
      <line x1="6" y1="48" x2="74" y2="48" stroke="#E0E0E0" strokeWidth="0.5" />
      <text x="56" y="22" fontSize="7" fill="#FF5252" fontWeight="bold">EXP</text>
    </svg>
  ),
  Document_Hunt: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="8" y="6" width="22" height="28" rx="2" fill="#E3F2FD" />
      <rect x="12" y="10" width="14" height="2.5" rx="1" fill="#90CAF9" />
      <rect x="12" y="15" width="10" height="2.5" rx="1" fill="#90CAF9" opacity="0.7" />
      <rect x="12" y="20" width="12" height="2.5" rx="1" fill="#90CAF9" opacity="0.5" />
      <rect x="16" y="22" width="22" height="28" rx="2" fill="#F3E5F5" />
      <rect x="20" y="26" width="14" height="2.5" rx="1" fill="#CE93D8" />
      <rect x="20" y="31" width="10" height="2.5" rx="1" fill="#CE93D8" opacity="0.7" />
      <rect x="24" y="14" width="22" height="28" rx="2" fill="#FFF3E0" />
      <rect x="28" y="18" width="14" height="2.5" rx="1" fill="#FFCC80" />
      <rect x="28" y="23" width="10" height="2.5" rx="1" fill="#FFCC80" opacity="0.7" />
      <circle cx="58" cy="40" r="10" stroke="#FF5252" strokeWidth="2" fill="none" opacity="0.6" />
      <line x1="65" y1="47" x2="72" y2="54" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  Payment_Leakage: (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="20" y="6" width="40" height="28" rx="4" fill="#E8F5E9" />
      <text x="32" y="26" fontSize="16" fill="#2E7D32" fontWeight="bold" opacity="0.7">₹</text>
      <path d="M40 34 Q36 40 38 46 Q40 52 40 52 Q40 52 42 46 Q44 40 40 34Z" fill="#FF5252" opacity="0.7" />
      <path d="M34 38 Q28 42 30 48 Q32 52 32 52" stroke="#FF5252" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M46 38 Q52 42 50 48 Q48 52 48 52" stroke="#FF5252" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="40" cy="54" rx="10" ry="3" fill="#FF5252" opacity="0.2" />
    </svg>
  ),
};

const iconMap: Record<string, string> = {
  "WhatsApp Chaos": "WhatsApp_Chaos",
  "Excel Dependency": "Excel_Dependency",
  "Tally Friction": "Tally_Friction",
  "Delayed Rates": "Delayed_Rates",
  "Document Hunt": "Document_Hunt",
  "Payment Leakage": "Payment_Leakage",
};

export default function ProblemSection() {
  return (
    <section className="px-8 lg:px-16 py-32" style={{ background: "#ffffff" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 reveal">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
            }}
          >
            Sound familiar?
          </h2>
          <p
            className="max-w-xl"
            style={{ fontSize: "18px", fontWeight: 300, color: "#4c4546", lineHeight: 1.7 }}
          >
            Traditional Indian logistics is manual, chaotic, and slow. NavkarOS
            replaces the mess with precision — one platform for every workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="p-10 transition-all duration-500 cursor-none flex flex-col"
              style={{
                background: "#f9f9f9",
                boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.04)";
              }}
            >
              {/* SVG illustration */}
              <div className="w-full h-20 mb-6 flex items-center">
                {illustrations[iconMap[p.title]]}
              </div>

              <h3
                className="mb-4"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "22px",
                  fontWeight: 400,
                  color: "#1a1c1c",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
