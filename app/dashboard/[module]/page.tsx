import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getModuleById, type ModuleId } from "@/lib/modules";
import { ModuleDashboard } from "@/components/dashboard/ModuleDashboard";

interface Props {
  params: Promise<{ module: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { module: moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) redirect("/dashboard");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("modules")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const subscribedModules = (sub?.modules as ModuleId[]) || [];
  const hasAccess = subscribedModules.includes(moduleId as ModuleId);

  if (!hasAccess) {
    return (
      <div className="p-8 lg:p-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md text-center">
          <div
            className="w-14 h-14 flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(30,64,175,0.1)", border: "0.5px solid rgba(30,64,175,0.3)" }}
          >
            <div className="w-5 h-5" style={{ color: "#1E40AF" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
          <h2
            className="mb-3"
            style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "28px", color: "#1a1c1c", letterSpacing: "-0.02em" }}
          >
            {mod.name} is not in your plan.
          </h2>
          <p className="mb-8 text-sm" style={{ color: "#7e7576", lineHeight: 1.7 }}>
            Upgrade your plan to unlock {mod.name} and {mod.tagline.toLowerCase()}.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard/pricing"
              className="px-8 py-3 text-xs font-semibold uppercase tracking-widest"
              style={{ background: "#1a1c1c", color: "#fff" }}
            >
              Upgrade Plan
            </Link>
            <Link
              href={`/demo/${moduleId}`}
              className="px-8 py-3 text-xs font-semibold uppercase tracking-widest border"
              style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#4c4546" }}
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ModuleDashboard moduleId={moduleId as ModuleId} />;
}
