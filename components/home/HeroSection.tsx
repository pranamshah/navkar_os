"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Suspense, useRef } from "react";

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const floatVariants2 = {
  initial: { y: 0 },
  animate: {
    y: [8, -8, 8],
    transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 },
  },
};

const floatVariants3 = {
  initial: { y: 0 },
  animate: {
    y: [-6, 6, -6],
    transition: { duration: 3.8, repeat: Infinity, ease: "easeInOut" as const, delay: 1 },
  },
};

function HeroCards() {
  return (
    <div className="relative w-full h-[480px] hidden md:block">
      {/* Card 1 - Shipment Status */}
      <motion.div
        variants={floatVariants}
        initial="initial"
        animate="animate"
        className="absolute top-12 right-0 w-64 rounded-2xl p-4 shadow-xl"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212,160,23,0.3)",
          transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "#D4A017" }}
          >
            SH
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "#0A0A0A" }}>
              MHPL/2024/00142
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Nhava Sheva → Hamburg
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "#DCFCE7", color: "#166534" }}
          >
            ● In Transit
          </span>
          <span className="text-xs" style={{ color: "#6B7280" }}>
            ETA: Dec 18
          </span>
        </div>
        <div className="mt-3 h-1.5 rounded-full" style={{ background: "#F3F4F6" }}>
          <div
            className="h-1.5 rounded-full"
            style={{ width: "65%", background: "#D4A017" }}
          />
        </div>
      </motion.div>

      {/* Card 2 - Invoice */}
      <motion.div
        variants={floatVariants2}
        initial="initial"
        animate="animate"
        className="absolute top-40 left-8 w-56 rounded-2xl p-4 shadow-xl"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212,160,23,0.3)",
          transform: "perspective(1000px) rotateY(6deg) rotateX(-3deg)",
        }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: "#6B7280" }}>
          Invoice Generated
        </p>
        <p
          className="text-2xl font-bold mb-0.5"
          style={{ fontFamily: "var(--font-sora), sans-serif", color: "#0A0A0A" }}
        >
          ₹1,24,800
        </p>
        <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
          GST inclusive · INV-2024-0892
        </p>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#D4A017" }} />
          <span className="text-xs font-medium" style={{ color: "#D4A017" }}>
            GST Compliant
          </span>
        </div>
      </motion.div>

      {/* Card 3 - Doc AI */}
      <motion.div
        variants={floatVariants3}
        initial="initial"
        animate="animate"
        className="absolute bottom-16 right-8 w-60 rounded-2xl p-4 shadow-xl"
        style={{
          background: "rgba(10,22,40,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212,160,23,0.4)",
          transform: "perspective(1000px) rotateY(-5deg) rotateX(6deg)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#D4A017" }}
          >
            <span className="text-xs font-bold text-black">AI</span>
          </div>
          <p className="text-xs font-semibold text-white">Doc AI Processing</p>
        </div>
        <div className="space-y-2">
          {["BL Number", "Shipper Name", "Cargo Weight", "Port of Loading"].map(
            (field, i) => (
              <div key={field} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {field}
                </span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.3 + 1 }}
                  className="text-xs font-medium"
                  style={{ color: "#F0C040" }}
                >
                  ✓ Extracted
                </motion.span>
              </div>
            )
          )}
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs" style={{ color: "#D4A017" }}>
            98% accuracy · 3 seconds
          </span>
        </div>
      </motion.div>

      {/* Decorative blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #D4A017, transparent)" }}
      />
    </div>
  );
}

export default function HeroSection() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const lineVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #1A1A2E 60%, #0A1628 100%)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div variants={lineVariants}>
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: "#FEF3C7",
                  color: "#92400E",
                  border: "1px solid #D4A017",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#D4A017" }}
                />
                India's #1 Freight Forwarding OS · Now in Beta
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={lineVariants}
              className="text-4xl lg:text-6xl font-bold leading-tight text-white"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              Run Your{" "}
              <span
                className="relative"
                style={{ color: "#D4A017" }}
              >
                Freight Business
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  fill="none"
                >
                  <path
                    d="M0 5 Q50 1 100 4 Q150 7 200 3"
                    stroke="#D4A017"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              </span>{" "}
              from One OS
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={lineVariants}
              className="text-lg leading-relaxed max-w-lg"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Shipments, invoicing, Doc AI, client portal, and analytics — all
              in one platform. Built specifically for Indian C&F agents and
              freight forwarders.
            </motion.p>

            {/* Feature list */}
            <motion.div variants={lineVariants} className="flex flex-col gap-2">
              {[
                "GST-compliant invoicing out of the box",
                "AI extracts BL, AWB, and invoice data in 3 seconds",
                "ICEGATE & GST Portal integration",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "#D4A017" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={lineVariants} className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 group"
                style={{ background: "#D4A017", color: "#0A0A0A" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F0C040";
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(212,160,23,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#D4A017";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={lineVariants}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-2">
                {["RM", "PN", "SA", "MK"].map((initials, i) => (
                  <div
                    key={initials}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
                    style={{
                      background: i % 2 === 0 ? "#1A1A2E" : "#D4A017",
                      borderColor: "#0A1628",
                      color: i % 2 === 0 ? "#D4A017" : "#0A0A0A",
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <p
                  className="text-sm font-medium text-white"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  500+ freight forwarders
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  already on Navkar OS
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Floating Cards Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <HeroCards />
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z"
            fill="#F8F9FA"
          />
        </svg>
      </div>
    </section>
  );
}
