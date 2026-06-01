"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, FileX, Users } from "lucide-react";

const problems = [
  {
    icon: FileX,
    title: "Manual Data Entry",
    desc: "Hours wasted re-typing BL and AWB data across spreadsheets",
  },
  {
    icon: Clock,
    title: "Delayed Invoicing",
    desc: "GST filing delays and cash flow problems from slow billing",
  },
  {
    icon: Users,
    title: "Client Visibility Gap",
    desc: "Clients call repeatedly for shipment updates you can't quickly share",
  },
  {
    icon: AlertTriangle,
    title: "Scattered Tools",
    desc: "4-5 different software tools that don't talk to each other",
  },
];

export default function ProblemBanner() {
  return (
    <section
      className="py-16 px-6"
      style={{ background: "#0A1628" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#D4A017" }}
          >
            The Problem
          </p>
          <h2
            className="text-2xl lg:text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            Indian freight forwarders are drowning in manual work
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col gap-3 p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,160,23,0.15)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(212,160,23,0.15)" }}
              >
                <problem.icon className="w-5 h-5" style={{ color: "#D4A017" }} />
              </div>
              <div>
                <h3
                  className="font-semibold text-white mb-1"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  {problem.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {problem.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-lg font-semibold" style={{ color: "#D4A017" }}>
            Navkar OS solves all of this — in one platform.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
