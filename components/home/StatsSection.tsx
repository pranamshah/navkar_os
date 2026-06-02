"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import { Anchor, Zap } from "lucide-react";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(parseFloat((value * eased).toFixed(value % 1 !== 0 ? 1 : 0)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  const fmt =
    value % 1 !== 0
      ? display.toFixed(1)
      : Math.round(display).toLocaleString("en-IN");

  return <span ref={ref}>{fmt}{suffix}</span>;
}

const SERVICES = [
  { label: "IC", color: "#3B82F6", name: "ICEGATE" },
  { label: "GS", color: "#16A34A", name: "GSTN" },
  { label: "WA", color: "#22C55E", name: "WhatsApp" },
  { label: "MT", color: "#0EA5E9", name: "MarineTraffic" },
  { label: "RP", color: "#8B5CF6", name: "Razorpay" },
  { label: "TV", color: "#F59E0B", name: "Tally" },
];

export default function StatsSection() {
  return (
    <section className="py-14 px-6" style={{ background: "#f0f0f0" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Bento grid — desktop 3-col, mobile 2-col */}
          <div
            className="hidden lg:grid gap-3"
            style={{
              gridTemplateColumns: "1fr 1.15fr 1.15fr",
              gridTemplateAreas: `
                "left  mid-top   right-top"
                "left  mid-mid   right-mid"
                "left  bottom    bottom"
              `,
            }}
          >

            {/* ── LEFT: tall platform card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4 p-6"
              style={{
                gridArea: "left",
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.07)",
                borderRadius: "18px",
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(212,175,55,0.12)",
                  borderRadius: "12px",
                }}
              >
                <Anchor size={20} strokeWidth={1.5} color="#D4AF37" />
              </div>

              {/* Copy */}
              <div>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#1a1c1c",
                    letterSpacing: "-0.01em",
                  }}
                >
                  FreightOps Core
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#7e7576",
                    marginTop: "6px",
                    lineHeight: 1.65,
                  }}
                >
                  End-to-end job management for Indian freight. Track FCL, LCL,
                  Air, and Breakbulk shipments from a single screen.
                </p>
              </div>

              {/* Jobs stat inline */}
              <div
                className="flex items-center gap-3 px-3 py-2.5"
                style={{
                  background: "rgba(0,0,0,0.03)",
                  borderRadius: "10px",
                }}
              >
                <div className="flex gap-1">
                  {[{ color: "#3B82F6" }, { color: "#16A34A" }, { color: "#F59E0B" }].map(
                    (s, i) => (
                      <div
                        key={i}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: s.color + "22",
                          border: `1.5px solid ${s.color}44`,
                        }}
                      />
                    )
                  )}
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#1a1c1c" }}>
                    12,000+ jobs / mo
                  </p>
                  <p style={{ fontSize: "10px", color: "#7e7576" }}>Active on platform</p>
                </div>
              </div>

              <div className="flex-1" />

              {/* CTA row */}
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center gap-1.5 cursor-none"
                  style={{
                    background: "#1a1c1c",
                    color: "#fff",
                    padding: "9px 16px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: "none",
                  }}
                >
                  <Zap size={11} strokeWidth={2} color="#D4AF37" />
                  Start Free
                </button>

                {/* Toggle */}
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 36,
                      height: 20,
                      background: "#D4AF37",
                      borderRadius: "999px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: 3,
                        top: 3,
                        width: 14,
                        height: 14,
                        background: "#fff",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "#7e7576" }}>Free Beta</span>
                </div>
              </div>
            </motion.div>

            {/* ── MID TOP: 98% DocAI ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="p-5"
              style={{
                gridArea: "mid-top",
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.07)",
                borderRadius: "18px",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1c1c" }}>
                    DocAI
                  </p>
                  <p style={{ fontSize: "11px", color: "#7e7576" }}>
                    AI Document Processing
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#D4AF37",
                    fontWeight: 600,
                    background: "rgba(212,175,55,0.1)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  Accuracy
                </span>
              </div>

              <p
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  color: "#1a1c1c",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  margin: "8px 0 6px",
                }}
              >
                <CountUp value={98} suffix="%" />
              </p>

              <div className="flex items-center justify-between">
                <span style={{ fontSize: "11px", color: "#7e7576" }}>
                  Indian doc formats
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#16A34A",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Live Model
                </span>
              </div>
            </motion.div>

            {/* ── RIGHT TOP: 14hrs large display ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="p-5"
              style={{
                gridArea: "right-top",
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.07)",
                borderRadius: "18px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Dot pattern */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 72,
                  height: 72,
                  backgroundImage:
                    "radial-gradient(circle, rgba(0,0,0,0.11) 1px, transparent 1px)",
                  backgroundSize: "8px 8px",
                }}
              />

              <p
                style={{
                  fontSize: "62px",
                  fontWeight: 800,
                  color: "#1a1c1c",
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  position: "relative",
                }}
              >
                <CountUp value={14} suffix="" />
                <span style={{ fontSize: "26px", letterSpacing: "-0.02em" }}>hrs</span>
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1a1c1c",
                  marginTop: "8px",
                }}
              >
                Team&apos;s Weekly Saving
              </p>
              <p style={{ fontSize: "11px", color: "#7e7576", marginTop: "2px" }}>
                Per ops team, per week
              </p>
            </motion.div>

            {/* ── MID MID: placeholder — stretches to match right-mid height ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.17, ease: [0.22, 1, 0.36, 1] }}
              className="p-5 flex flex-col justify-between"
              style={{
                gridArea: "mid-mid",
                background: "#1a1c1c",
                border: "0.5px solid rgba(0,0,0,0.07)",
                borderRadius: "18px",
              }}
            >
              <div>
                <p
                  style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  Platform Reach
                </p>
                <p
                  style={{
                    fontSize: "46px",
                    fontWeight: 800,
                    color: "#D4AF37",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    margin: "10px 0 6px",
                  }}
                >
                  <CountUp value={500} suffix="+" />
                </p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                  Active Businesses
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                  Across India
                </p>
              </div>

              <div
                className="flex items-center gap-1.5 mt-3"
                style={{
                  padding: "6px 10px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  width: "fit-content",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#16A34A",
                    flexShrink: 0,
                    display: "block",
                  }}
                />
                <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>
                  GROWING DAILY
                </span>
              </div>
            </motion.div>

            {/* ── RIGHT MID: Shipments counter ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="p-5"
              style={{
                gridArea: "right-mid",
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.07)",
                borderRadius: "18px",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1c1c" }}>
                Shipments Tracked
              </p>
              <p style={{ fontSize: "11px", color: "#7e7576", marginBottom: "10px" }}>
                All freight modes
              </p>

              <p
                style={{
                  fontSize: "42px",
                  fontWeight: 800,
                  color: "#1a1c1c",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                <CountUp value={12} suffix="k+" />
              </p>
              <p style={{ fontSize: "11px", color: "#D4AF37", marginTop: "4px", fontWeight: 500 }}>
                Per month · On platform
              </p>
            </motion.div>

            {/* ── BOTTOM WIDE: integrations bar ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.27, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between px-5 py-4"
              style={{
                gridArea: "bottom",
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.07)",
                borderRadius: "18px",
              }}
            >
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#7e7576", letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0 }}>
                Connected
              </p>

              <div className="flex items-center gap-4">
                {SERVICES.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-2 flex-shrink-0">
                    {i > 0 && (
                      <div
                        style={{ width: 1, height: 18, background: "rgba(0,0,0,0.08)" }}
                      />
                    )}
                    <div className="flex items-center gap-1.5">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          background: s.color + "18",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "8px",
                          fontWeight: 800,
                          color: s.color,
                          flexShrink: 0,
                        }}
                      >
                        {s.label}
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#1a1c1c" }}>
                        {s.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#16A34A",
                    display: "block",
                  }}
                />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#16A34A" }}>
                  All Live
                </span>
              </div>
            </motion.div>
          </div>

          {/* Mobile fallback — simple 2-col grid */}
          <div className="lg:hidden grid grid-cols-2 gap-3">
            {[
              { val: 500, suffix: "+", label: "Active Businesses", sub: "Across India" },
              { val: 12, suffix: "k+", label: "Jobs / Month", sub: "On platform" },
              { val: 98, suffix: "%", label: "DocAI Accuracy", sub: "Indian doc formats" },
              { val: 14, suffix: "hrs", label: "Saved Weekly", sub: "Per ops team" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-5"
                style={{
                  background: "#fff",
                  border: "0.5px solid rgba(0,0,0,0.07)",
                  borderRadius: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    color: "#1a1c1c",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  <CountUp value={s.val} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1c1c", marginTop: "6px" }}>
                  {s.label}
                </p>
                <p style={{ fontSize: "11px", color: "#7e7576", marginTop: "2px" }}>
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
