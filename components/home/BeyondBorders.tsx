"use client";

import { motion } from "framer-motion";

function PortScene() {
  return (
    <svg
      viewBox="0 0 1200 520"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.18 }}
    >
      {/* Sky stars */}
      {[
        [120, 40], [280, 20], [450, 60], [600, 15], [750, 45], [900, 25], [1050, 55], [180, 80],
        [350, 35], [520, 70], [680, 28], [840, 65], [990, 38], [1100, 80], [60, 30],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.2} fill="#D4AF37" />
      ))}

      {/* Horizon line */}
      <line x1="0" y1="310" x2="1200" y2="310" stroke="#D4AF37" strokeWidth="0.5" />

      {/* Container Ship — main hull */}
      <path
        d="M200,280 L980,280 L1010,310 L170,310 Z"
        fill="#D4AF37"
        opacity="0.4"
      />
      {/* Ship superstructure */}
      <rect x="700" y="220" width="120" height="60" fill="#D4AF37" opacity="0.35" rx="2" />
      <rect x="720" y="200" width="80" height="24" fill="#D4AF37" opacity="0.3" rx="1" />
      <rect x="740" y="188" width="40" height="14" fill="#D4AF37" opacity="0.25" rx="1" />
      {/* Funnel */}
      <rect x="760" y="168" width="18" height="22" fill="#D4AF37" opacity="0.3" rx="2" />
      <path d="M754,168 L776,168 L780,160 L750,160 Z" fill="#D4AF37" opacity="0.2" />

      {/* Containers on deck */}
      {Array.from({ length: 14 }).map((_, i) => (
        <g key={`c${i}`}>
          <rect
            x={220 + i * 37}
            y={248}
            width={33}
            height={32}
            fill="#D4AF37"
            opacity={0.12 + (i % 3) * 0.08}
            stroke="#D4AF37"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
          <line x1={220 + i * 37 + 16} y1={248} x2={220 + i * 37 + 16} y2={280} stroke="#D4AF37" strokeWidth="0.3" strokeOpacity="0.15" />
        </g>
      ))}

      {/* Port Crane 1 */}
      <g transform="translate(80, 100)">
        <line x1="20" y1="210" x2="20" y2="30" stroke="#D4AF37" strokeWidth="3" />
        <line x1="20" y1="30" x2="140" y2="30" stroke="#D4AF37" strokeWidth="2.5" />
        <line x1="140" y1="30" x2="140" y2="90" stroke="#D4AF37" strokeWidth="2" />
        <line x1="20" y1="30" x2="0" y2="80" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="20" y1="60" x2="140" y2="60" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
        <line x1="90" y1="60" x2="90" y2="100" stroke="#D4AF37" strokeWidth="1.5" />
        <rect x="80" y="100" width="20" height="15" fill="#D4AF37" opacity="0.3" />
        <line x1="0" y1="210" x2="40" y2="210" stroke="#D4AF37" strokeWidth="3" />
        <line x1="8" y1="160" x2="32" y2="210" stroke="#D4AF37" strokeWidth="1.5" />
        <line x1="8" y1="140" x2="32" y2="210" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Port Crane 2 (smaller, behind) */}
      <g transform="translate(980, 80)" opacity="0.7">
        <line x1="20" y1="230" x2="20" y2="40" stroke="#D4AF37" strokeWidth="2.5" />
        <line x1="20" y1="40" x2="120" y2="40" stroke="#D4AF37" strokeWidth="2" />
        <line x1="120" y1="40" x2="120" y2="100" stroke="#D4AF37" strokeWidth="1.8" />
        <line x1="70" y1="40" x2="70" y2="95" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="60" y="95" width="18" height="12" fill="#D4AF37" opacity="0.3" />
        <line x1="0" y1="230" x2="40" y2="230" stroke="#D4AF37" strokeWidth="2.5" />
      </g>

      {/* Ocean waves */}
      <motion.path
        d="M0,330 Q150,315 300,330 Q450,345 600,330 Q750,315 900,330 Q1050,345 1200,330 L1200,520 L0,520 Z"
        fill="#D4AF37"
        opacity="0.06"
        animate={{
          d: [
            "M0,330 Q150,315 300,330 Q450,345 600,330 Q750,315 900,330 Q1050,345 1200,330 L1200,520 L0,520 Z",
            "M0,338 Q150,325 300,338 Q450,352 600,338 Q750,325 900,338 Q1050,352 1200,338 L1200,520 L0,520 Z",
            "M0,330 Q150,315 300,330 Q450,345 600,330 Q750,315 900,330 Q1050,345 1200,330 L1200,520 L0,520 Z",
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,350 Q200,335 400,352 Q600,368 800,352 Q1000,336 1200,352 L1200,520 L0,520 Z"
        fill="#D4AF37"
        opacity="0.04"
        animate={{
          d: [
            "M0,350 Q200,335 400,352 Q600,368 800,352 Q1000,336 1200,352 L1200,520 L0,520 Z",
            "M0,358 Q200,345 400,360 Q600,376 800,360 Q1000,345 1200,360 L1200,520 L0,520 Z",
            "M0,350 Q200,335 400,352 Q600,368 800,352 Q1000,336 1200,352 L1200,520 L0,520 Z",
          ]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Gold light shimmer on water */}
      <ellipse cx="600" cy="360" rx="200" ry="40" fill="#D4AF37" opacity="0.04" />

      {/* Port dock */}
      <rect x="0" y="308" width="1200" height="8" fill="#D4AF37" opacity="0.15" />
    </svg>
  );
}

export default function BeyondBorders() {
  return (
    <section className="py-20 px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden"
          style={{ background: "#1a1c1c", height: "520px" }}
        >
          {/* Port scene */}
          <PortScene />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-8"
            style={{
              backgroundImage: "linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Animated gold ribbons */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
            <motion.path
              d="M-100,260 Q360,200 720,260 Q1080,320 1540,260"
              stroke="#D4AF37"
              strokeWidth="0.8"
              fill="none"
              animate={{ d: [
                "M-100,260 Q360,200 720,260 Q1080,320 1540,260",
                "M-100,280 Q360,220 720,245 Q1080,290 1540,280",
                "M-100,260 Q360,200 720,260 Q1080,320 1540,260",
              ]}}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M-100,290 Q400,235 760,290 Q1100,345 1540,290"
              stroke="#D4AF37"
              strokeWidth="0.4"
              fill="none"
              animate={{ d: [
                "M-100,290 Q400,235 760,290 Q1100,345 1540,290",
                "M-100,305 Q400,255 760,275 Q1100,310 1540,305",
                "M-100,290 Q400,235 760,290 Q1100,345 1540,290",
              ]}}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
          </svg>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(48px, 7vw, 88px)",
                fontWeight: 400,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Beyond Borders.
            </motion.h2>
            <div className="w-12 mt-6" style={{ height: "0.5px", background: "#D4AF37" }} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 max-w-md"
              style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", fontWeight: 300, lineHeight: 1.7 }}
            >
              Indian logistics, built for the world. NavkarOS handles every
              trade lane, every document format, every GST scenario — so you
              can focus on growing your business.
            </motion.p>
            <motion.a
              href="/signup"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-10 px-10 py-4 text-xs font-semibold uppercase tracking-widest cursor-none transition-all duration-200 inline-block"
              style={{ background: "#D4AF37", color: "#1a1c1c" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#D4AF37";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Start Free — No Credit Card
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
