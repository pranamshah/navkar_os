"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/homepage";

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((idx: number) => {
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => go((current + 1) % testimonials.length), [current, go]);
  const prev = useCallback(() => go((current - 1 + testimonials.length) % testimonials.length), [current, go]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="px-8 lg:px-16 py-32">
      <div className="max-w-7xl mx-auto">
        <h2
          className="mb-20 text-center reveal"
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 400,
            color: "#1a1c1c",
            letterSpacing: "-0.02em",
          }}
        >
          What India's Logistics Leaders Say
        </h2>

        {/* Desktop: all 3 visible, centre elevated */}
        <div className="hidden md:grid grid-cols-3 gap-10">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="p-12 flex flex-col gap-8"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.06)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
                transform: i === 1 ? "translateY(-28px)" : undefined,
              }}
            >
              <p
                className="italic flex-1"
                style={{ fontSize: "17px", color: "#1a1c1c", lineHeight: 1.75, fontWeight: 300, fontFamily: "'EB Garamond', Georgia, serif" }}
              >
                "{t.quote}"
              </p>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
                  {t.name}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#7e7576" }}>
                  {t.role}, {t.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div
            className="relative overflow-hidden p-10"
            style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", boxShadow: "0 20px 40px rgba(0,0,0,0.04)", minHeight: "280px" }}
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir * 50 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, x: dir * -50, transition: { duration: 0.3 } }}
                className="flex flex-col gap-6"
              >
                <p
                  className="italic"
                  style={{ fontSize: "17px", color: "#1a1c1c", lineHeight: 1.75, fontWeight: 300, fontFamily: "'EB Garamond', Georgia, serif" }}
                >
                  "{testimonials[current].quote}"
                </p>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
                    {testimonials[current].name}
                  </p>
                  <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#7e7576" }}>
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "28px" : "8px",
                    height: "8px",
                    background: i === current ? "#D4AF37" : "rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prev} className="w-9 h-9 border flex items-center justify-center transition-all" style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; }}
              >
                <ChevronLeft className="w-4 h-4" style={{ color: "#1a1c1c" }} />
              </button>
              <button onClick={next} className="w-9 h-9 border flex items-center justify-center transition-all" style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; }}
              >
                <ChevronRight className="w-4 h-4" style={{ color: "#1a1c1c" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
