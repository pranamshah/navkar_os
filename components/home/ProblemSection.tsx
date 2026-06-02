"use client";

import { motion } from "framer-motion";
import { problems } from "@/data/homepage";

const illustrations: Record<string, React.ReactNode> = {
  "Six Systems, Zero Sync": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      {[0,1,2,3,4,5].map(i => {
        const x = 10 + (i % 3) * 24, y = 8 + Math.floor(i / 2) * 22;
        return (
          <g key={i}>
            <rect x={x} y={y} width="18" height="14" rx="2" fill={i % 2 === 0 ? "#E3F2FD" : "#FFF3E0"} />
            <rect x={x+2} y={y+3} width="10" height="1.5" rx="1" fill="#90A4AE" opacity="0.6" />
            <rect x={x+2} y={y+6} width="7" height="1.5" rx="1" fill="#90A4AE" opacity="0.4" />
          </g>
        );
      })}
      <circle cx="64" cy="12" r="7" fill="#FF5252" opacity="0.8" />
      <line x1="61" y1="9" x2="67" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="67" y1="9" x2="61" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Excel Running Operations": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="8" y="6" width="64" height="48" rx="3" fill="#E8F5E9" />
      {[0,1,2,3].map(r =>
        [0,1,2,3].map(c => (
          <rect key={`${r}${c}`} x={8 + c*16} y={12 + r*12} width="15" height="11" fill={r===2 && c===2 ? "#FF5252" : "#fff"} stroke="#C8E6C9" strokeWidth="0.5" />
        ))
      )}
      <text x="11" y="32" fontSize="7" fill="#D32F2F">#ERR!</text>
      <rect x="8" y="48" width="64" height="6" fill="#1B5E20" opacity="0.15" />
    </svg>
  ),
  "Importers in the Dark": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <circle cx="28" cy="22" r="12" fill="#E3F2FD" />
      <circle cx="28" cy="18" r="5" fill="#90CAF9" opacity="0.6" />
      <path d="M16 34 Q16 28 28 28 Q40 28 40 34" fill="#90CAF9" opacity="0.3" />
      <line x1="44" y1="22" x2="72" y2="22" stroke="#FF5252" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="55" y="14" width="18" height="16" rx="2" fill="#FFEBEE" />
      <circle cx="64" cy="20" r="4" fill="#FF5252" opacity="0.3" />
      <line x1="61" y1="17" x2="67" y2="23" stroke="#FF5252" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <text x="52" y="38" fontSize="8" fill="#FF5252" opacity="0.7">?</text>
      <text x="60" y="38" fontSize="8" fill="#FF5252" opacity="0.5">?</text>
      <text x="68" y="38" fontSize="8" fill="#FF5252" opacity="0.3">?</text>
    </svg>
  ),
  "GST is a Manual Job": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="6" y="8" width="28" height="44" rx="4" fill="#E8F5E9" />
      <text x="12" y="26" fontSize="13" fill="#2E7D32" fontWeight="bold" opacity="0.7">₹</text>
      <rect x="10" y="30" width="20" height="2.5" rx="1" fill="#4CAF50" opacity="0.4" />
      <rect x="10" y="35" width="16" height="2.5" rx="1" fill="#4CAF50" opacity="0.3" />
      <rect x="10" y="40" width="18" height="2.5" rx="1" fill="#4CAF50" opacity="0.25" />
      <path d="M38 30 L46 30" stroke="#FF9800" strokeWidth="2" strokeDasharray="3 2" />
      <rect x="46" y="18" width="28" height="30" rx="4" fill="#FFF3E0" />
      <text x="51" y="33" fontSize="8" fill="#E65100" fontWeight="bold">CGST?</text>
      <text x="51" y="43" fontSize="8" fill="#E65100" fontWeight="bold">IGST?</text>
      <circle cx="76" cy="14" r="6" fill="#FF5252" opacity="0.7" />
      <text x="73" y="18" fontSize="7" fill="white" fontWeight="bold">!</text>
    </svg>
  ),
  "Customs Filing Errors": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="8" y="6" width="38" height="48" rx="3" fill="#EDE7F6" />
      <rect x="12" y="12" width="24" height="2.5" rx="1" fill="#7E57C2" opacity="0.5" />
      <rect x="12" y="18" width="18" height="2.5" rx="1" fill="#7E57C2" opacity="0.4" />
      <rect x="12" y="24" width="22" height="2.5" rx="1" fill="#FF5252" opacity="0.6" />
      <rect x="12" y="30" width="16" height="2.5" rx="1" fill="#7E57C2" opacity="0.3" />
      <rect x="12" y="36" width="20" height="2.5" rx="1" fill="#7E57C2" opacity="0.25" />
      <circle cx="24" cy="25.5" r="8" fill="none" stroke="#FF5252" strokeWidth="1.5" />
      <line x1="28" y1="22" x2="20" y2="30" stroke="#FF5252" strokeWidth="1.5" strokeLinecap="round" />
      <text x="52" y="26" fontSize="9" fill="#FF5252" fontWeight="bold">HOLD</text>
    </svg>
  ),
  "Invisible Cost Leakage": (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="20" y="6" width="40" height="28" rx="4" fill="#E8F5E9" />
      <text x="32" y="25" fontSize="15" fill="#2E7D32" fontWeight="bold" opacity="0.7">₹</text>
      <path d="M40 34 Q36 40 38 48 Q40 54 40 54 Q40 54 42 48 Q44 40 40 34Z" fill="#FF5252" opacity="0.7" />
      <path d="M34 38 Q28 42 30 50" stroke="#FF5252" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M46 38 Q52 42 50 50" stroke="#FF5252" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="40" cy="55" rx="10" ry="3" fill="#FF5252" opacity="0.2" />
    </svg>
  ),
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
            Indian logistics runs on six disconnected tools, WhatsApp, and Excel. NavkarOS replaces all of it — one platform for every stakeholder, every workflow.
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
              style={{ background: "#f9f9f9", boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.04)";
              }}
            >
              <div className="w-full h-20 mb-6 flex items-center">
                {illustrations[p.title]}
              </div>
              <h3
                className="mb-4"
                style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "22px", fontWeight: 400, color: "#1a1c1c" }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.65 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
