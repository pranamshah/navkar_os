"use client";

import Link from "next/link";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { suite } from "@/data/homepage";

const COLORS: Record<string, string> = {
  nexlog: "#3B82F6",
  entryx: "#8B5CF6",
  dockiq: "#10B981",
  rundesk: "#F59E0B",
  accura: "#6366F1",
  tradepilot: "#14B8A6",
};

const ICONS: Record<string, string> = {
  nexlog: "navigation",
  entryx: "gavel",
  dockiq: "warehouse",
  rundesk: "local_shipping",
  accura: "account_balance",
  tradepilot: "public",
};

export default function SuiteScroll() {
  return (
    <section id="suite" style={{ background: "#f9f9f9" }}>
      <ContainerScroll
        titleComponent={
          <div className="mb-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#D4AF37" }}
            >
              The NavkarOS Suite
            </p>
            <h2
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 400,
                color: "#1a1c1c",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Six Products.
              <br />
              <span style={{ color: "#D4AF37" }}>Every Role Covered.</span>
            </h2>
            <p
              className="mt-4 max-w-xl mx-auto"
              style={{ fontSize: "15px", color: "#4c4546", lineHeight: 1.7 }}
            >
              Purpose-built for each stakeholder in India's logistics chain — use one standalone or connect them all.
            </p>
          </div>
        }
      >
        {/* 3×2 grid of products inside dark card */}
        <div className="h-full w-full overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 h-full">
            {suite.map((product) => {
              const color = COLORS[product.id] ?? "#D4AF37";
              const icon = ICONS[product.id] ?? "star";
              return (
                <Link
                  key={product.id}
                  href={`/demo/${product.id}`}
                  className="group relative flex flex-col p-4 md:p-6 rounded-xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.borderColor = `${color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {/* Color accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: color, opacity: 0.6 }}
                  />

                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 flex-shrink-0"
                    style={{ background: `${color}18`, border: `0.5px solid ${color}30` }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color, fontSize: "18px" }}
                    >
                      {icon}
                    </span>
                  </div>

                  {/* Labels */}
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>
                    {product.tagline}
                  </p>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: "'EB Garamond', Georgia, serif",
                      fontSize: "18px",
                      fontWeight: 400,
                      color: "#fff",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-xs leading-relaxed flex-1 hidden md:block"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {product.desc}
                  </p>

                  {/* Arrow */}
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>
                      Demo
                    </span>
                    <span className="text-xs" style={{ color }}>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
