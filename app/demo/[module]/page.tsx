import { getModuleById, MODULE_LIST } from "@/lib/modules";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ModuleDashboard } from "@/components/dashboard/ModuleDashboard";
import type { ModuleId } from "@/lib/modules";
import LogoBrand from "@/components/ui/LogoBrand";

interface Props {
  params: Promise<{ module: string }>;
}

export async function generateStaticParams() {
  return MODULE_LIST.map((m) => ({ module: m.id }));
}

export default async function DemoPage({ params }: Props) {
  const { module: moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) notFound();

  return (
    <div className="min-h-screen" style={{ background: "#f9f9f9" }}>
      {/* Demo banner */}
      <div
        className="flex items-center justify-between px-8 py-3 border-b"
        style={{ background: "#1a1c1c", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-4">
          <LogoBrand height={32} onDark href="/" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>Live Demo</span>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>— {mod.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "#D4AF37", color: "#1a1c1c" }}
          >
            Start Free →
          </Link>
        </div>
      </div>

      {/* Module tabs */}
      <div
        className="flex gap-0 border-b overflow-x-auto"
        style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}
      >
        {MODULE_LIST.map((m) => (
          <Link
            key={m.id}
            href={`/demo/${m.id}`}
            className="flex-shrink-0 px-5 py-3 text-xs font-semibold uppercase tracking-widest border-r transition-all duration-200"
            style={{
              borderColor: "rgba(0,0,0,0.06)",
              background: m.id === moduleId ? "#1a1c1c" : "transparent",
              color: m.id === moduleId ? "#fff" : "#7e7576",
              borderBottom: m.id === moduleId ? "2px solid #D4AF37" : "2px solid transparent",
            }}
          >
            {m.name}
          </Link>
        ))}
      </div>

      {/* Demo content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <ModuleDashboard moduleId={moduleId as ModuleId} />
      </div>

      {/* CTA footer */}
      <div
        className="mt-0 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{ background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)" }}
      >
        <div>
          <p
            style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "24px", color: "#1a1c1c" }}
          >
            Ready to use {mod.name} for your business?
          </p>
          <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
            Free 14-day trial. No credit card required.
          </p>
        </div>
        <div className="flex gap-4 flex-shrink-0">
          <Link
            href="/signup"
            className="px-8 py-3 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "#1a1c1c", color: "#fff" }}
          >
            Start Free Trial
          </Link>
          <Link
            href="/#pricing"
            className="px-8 py-3 text-xs font-semibold uppercase tracking-widest border"
            style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#4c4546" }}
          >
            See Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
