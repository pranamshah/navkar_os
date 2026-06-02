"use client";

import { motion } from "framer-motion";
import { stakeholders } from "@/data/homepage";

export default function StakeholdersBento() {
  return (
    <section id="stakeholders" className="py-28 px-6" style={{ background: "#f3f3f4" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 reveal">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(246,190,57,0.12)",
              color: "#B8860B",
              border: "1px solid rgba(212,160,23,0.25)",
            }}
          >
            Built for Every Player
          </span>
          <h2
            className="font-black mb-4"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1a1c1d", letterSpacing: "-0.03em" }}
          >
            Every Stakeholder.{" "}
            <span style={{ color: "#D4A017" }}>One OS.</span>
          </h2>
          <p className="text-lg max-w-xl" style={{ color: "#5d5f5f" }}>
            From independent C&F agents to large freight forwarding companies —
            NavkarOS adapts to how you work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Large feature card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-2 glass rounded-3xl overflow-hidden relative group cursor-none"
            style={{ minHeight: "320px" }}
          >
            {/* Dark gradient overlay background */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #1a1c1d 0%, #2f3132 100%)",
              }}
            />
            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <div className="text-5xl mb-5">🏢</div>
              <h4
                className="font-bold text-2xl mb-2 text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                C&F Agents & Freight Forwarders
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                Replace Excel, WhatsApp chaos, and Tally with one login. Every job, invoice,
                and document in a single system built for how Indian freight forwarders actually work.
                Auto-generate job numbers, track 11-stage status, and invoice clients in seconds.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                {["FreightOps", "BillGen", "AccountsOS"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: "rgba(246,190,57,0.2)", color: "#f6be39" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CHA card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-3xl p-8 flex flex-col justify-between cursor-none group"
          >
            <div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ background: "#1a1c1d" }}
              >
                ⚖️
              </div>
              <h4
                className="font-bold text-xl mb-2"
                style={{ color: "#1a1c1d", letterSpacing: "-0.02em" }}
              >
                Custom House Agents
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "#5d5f5f" }}>
                DocAI reads Bills of Entry, Gatepass OOC, and duty receipts in seconds.
                BE number, exam type, assess value — all extracted and linked to the job.
              </p>
            </div>
            <span
              className="mt-5 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#D4A017" }}
            >
              DocAI + ConnectLayer →
            </span>
          </motion.div>

          {/* Three smaller cards */}
          {stakeholders.slice(2).map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-7 cursor-none group transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f6be39";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(212,160,23,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(196,199,200,0.35)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="text-2xl mb-3">{s.icon}</div>
              <h4
                className="font-bold text-base mb-2"
                style={{ color: "#1a1c1d", letterSpacing: "-0.01em" }}
              >
                {s.title}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "#5d5f5f" }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
