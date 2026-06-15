import Link from "next/link";
import { MODULE_LIST } from "@/lib/modules";

export default function ExplorePage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#1E40AF" }}>All Modules</p>
        <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }}>
          Explore the Full Platform
        </h1>
        <p className="mt-3 max-w-xl text-sm" style={{ color: "#7e7576", lineHeight: 1.7 }}>
          Seven purpose-built modules that cover every function of a modern logistics business.
          Click any module to see an interactive demo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULE_LIST.map((mod) => (
          <div
            key={mod.id}
            className="p-8 flex flex-col"
            style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}
          >
            {/* Accent bar */}
            <div className="w-8 h-1 mb-6" style={{ background: mod.color }} />

            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#1E40AF" }}>{mod.tagline}</p>
            <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "22px", color: "#1a1c1c" }} className="mb-3">{mod.name}</h3>
            <p className="text-sm flex-1" style={{ color: "#4c4546", lineHeight: 1.65 }}>{mod.desc}</p>

            <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
              <Link
                href={`/demo/${mod.id}`}
                className="flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                style={{ background: "#1a1c1c", color: "#fff" }}
              >
                Live Demo
              </Link>
              <Link
                href="/dashboard/pricing"
                className="flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-widest border transition-all duration-200"
                style={{ borderColor: "rgba(0,0,0,0.12)", borderWidth: "0.5px", color: "#4c4546" }}
              >
                Pricing
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
