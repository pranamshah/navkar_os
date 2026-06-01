"use client";

import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/homepage";

function CountUp({
  value,
  suffix,
  duration = 2,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = 0;
    const end = value;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(parseFloat((start + (end - start) * eased).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  const formatted =
    value % 1 === 0 ? Math.round(displayed).toString() : displayed.toFixed(1);

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section
      className="py-20 px-6"
      style={{ background: "#0A1628" }}
    >
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
            style={{ background: "rgba(212,160,23,0.15)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}
          >
            By The Numbers
          </span>
          <h2
            className="text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            Trusted by India's Best Freight Teams
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,160,23,0.15)",
              }}
            >
              <div
                className="text-4xl lg:text-5xl font-bold mb-2"
                style={{
                  fontFamily: "var(--font-sora), sans-serif",
                  color: "#D4A017",
                }}
              >
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="font-semibold text-white mb-1"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                {stat.label}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
