"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { stats } from "@/data/homepage";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(parseFloat((value * eased).toFixed(value % 1 !== 0 ? 1 : 0)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  const fmt = value % 1 !== 0 ? display.toFixed(1) : Math.round(display).toLocaleString("en-IN");

  return <span ref={ref}>{fmt}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#1a1c1d" }}>
      <div className="max-w-5xl mx-auto">
        <p
          className="text-center text-xs font-semibold uppercase tracking-widest mb-12"
          style={{ color: "rgba(30,64,175,0.7)" }}
        >
          What NavkarOS Delivers
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.id}
              className="reveal text-center p-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <p
                className="font-black text-4xl lg:text-5xl mb-1"
                style={{ color: "#60A5FA", letterSpacing: "-0.03em" }}
              >
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="font-semibold text-white text-sm mb-0.5">{s.label}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
