"use client";

import { motion } from "framer-motion";

const personas = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Freight Forwarders",
    desc: "Manage FCL/LCL jobs, track shipments across ports, and generate BLs — all from one dashboard.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Customs Agents (CHA)",
    desc: "File BE, track OOC status, manage client documents and stay ahead of every deadline.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "C&F Agents",
    desc: "GST invoicing, client-wise billing, and account reconciliation — without switching between apps.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    title: "Importers & Exporters",
    desc: "Track your shipments in real time, share updates with your team, and keep logistics partners accountable.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Transport Companies",
    desc: "Coordinate inland movement, CFS transfers and last-mile delivery within your existing freight operations.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Logistics Teams",
    desc: "Give every team member role-specific access — ops, accounts, sales — and eliminate the Monday morning status calls.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function WhoItsFor() {
  return (
    <section id="whoisfor" className="py-28 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-16"
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#7e7576" }}>
            Who It&apos;s For
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "clamp(36px, 4.5vw, 58px)",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Built for every corner of
            <br />
            <span style={{ color: "#D4AF37" }}>Indian logistics.</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ border: "0.5px solid rgba(0,0,0,0.08)", background: "rgba(0,0,0,0.08)" }}
        >
          {personas.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="group p-8 flex flex-col gap-4 transition-colors duration-200"
              style={{ background: "#fff" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fafafa"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              <div style={{ color: "#D4AF37" }}>{p.icon}</div>
              <div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#1a1c1c" }}>{p.title}</h3>
                <p className="text-sm" style={{ color: "#7e7576", lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
