"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/homepage";

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-8 lg:px-16 py-32">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-center mb-16 reveal"
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 400,
            color: "#1a1c1c",
            letterSpacing: "-0.02em",
          }}
        >
          Logistics Solved.
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="cursor-none"
              style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center p-8 text-left"
              >
                <span
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "#1a1c1c",
                  }}
                >
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="material-symbols-outlined flex-shrink-0 ml-4"
                  style={{ fontSize: "20px", color: open === i ? "#1E40AF" : "#7e7576", fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="px-8 pb-8 pt-2"
                      style={{
                        borderTop: "0.5px solid rgba(0,0,0,0.06)",
                        fontSize: "15px",
                        color: "#4c4546",
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
