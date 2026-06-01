"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/homepage";

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #D4A017" }}
          >
            Customer Stories
          </span>
          <h2
            className="text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
          >
            Loved by Freight Forwarders
            <br />
            <span style={{ color: "#D4A017" }}>Across India</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col gap-5 p-6 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(212,160,23,0.25)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#D4A017";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,160,23,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,160,23,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-current"
                    style={{ color: "#D4A017" }}
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote
                  className="absolute -top-1 -left-1 w-6 h-6 opacity-20"
                  style={{ color: "#D4A017" }}
                />
                <p
                  className="text-sm leading-relaxed pl-5"
                  style={{ color: "#1A1A2E" }}
                >
                  {t.quote}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t" style={{ borderColor: "#E5E7EB" }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "#FEF3C7", color: "#92400E" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
