import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MODULE_LIST, PLANS, type ModuleId } from "@/lib/modules";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, subRes, interestsRes] = await Promise.all([
    supabase.from("profiles").select("full_name, company_name").eq("id", user.id).single(),
    supabase.from("subscriptions").select("plan, modules, status").eq("user_id", user.id).eq("status", "active").maybeSingle(),
    supabase.from("module_interests").select("modules").eq("user_id", user.id).maybeSingle(),
  ]);

  const profile = profileRes.data;
  const subscription = subRes.data;
  const interests = interestsRes.data;

  const subscribedModules = (subscription?.modules as ModuleId[]) || [];
  const plan = PLANS.find((p) => p.id === subscription?.plan);

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 400,
            color: "#1a1c1c",
            letterSpacing: "-0.02em",
          }}
        >
          {profile?.full_name
            ? `Welcome back, ${profile.full_name.split(" ")[0]}.`
            : "Welcome to NavkarOS."}
        </h1>
        {profile?.company_name && (
          <p className="mt-1 text-sm" style={{ color: "#7e7576" }}>{profile.company_name}</p>
        )}
      </div>

      {subscribedModules.length === 0 ? (
        /* ── No subscription ── */
        <div>
          {/* Suggested modules from signup */}
          {interests?.modules && interests.modules.length > 0 && (
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>
                Modules you selected
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(interests.modules as string[]).map((id) => {
                  const mod = MODULE_LIST.find((m) => m.id === id);
                  if (!mod) return null;
                  return (
                    <Link
                      key={id}
                      href={`/demo/${mod.id}`}
                      className="p-6 border transition-all duration-200 block"
                      style={{
                        background: "#fff",
                        borderColor: "rgba(0,0,0,0.08)",
                        borderWidth: "0.5px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#D4AF37" }}>{mod.tagline}</p>
                      <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "20px", color: "#1a1c1c" }} className="mb-2">{mod.name}</h3>
                      <p className="text-xs" style={{ color: "#7e7576", lineHeight: 1.6 }}>{mod.desc}</p>
                      <p className="mt-3 text-xs font-semibold" style={{ color: "#D4AF37" }}>View Demo →</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          <div
            className="p-8 lg:p-10 grid lg:grid-cols-2 gap-8 items-center mb-10"
            style={{ background: "#1a1c1c" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Ready to get started?</p>
              <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "32px", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Subscribe to unlock your modules.
              </h2>
              <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Choose a plan that fits your business. Starter from ₹999/month.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/pricing"
                className="px-8 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                style={{ background: "#D4AF37", color: "#1a1c1c" }}
              >
                See Pricing
              </Link>
              <Link
                href="/dashboard/explore"
                className="px-8 py-3 text-xs font-semibold uppercase tracking-widest border transition-all duration-200"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              >
                Explore Modules
              </Link>
            </div>
          </div>

          {/* Quick links to demos */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>
              Try all module demos
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {MODULE_LIST.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/demo/${mod.id}`}
                  className="p-4 text-center border transition-all duration-200 block"
                  style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)", borderWidth: "0.5px" }}
                >
                  <p className="text-xs font-bold" style={{ color: "#1a1c1c" }}>{mod.name}</p>
                  <p className="text-xs mt-1" style={{ color: "#D4AF37", fontSize: "10px" }}>Demo</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Subscribed: show module cards ── */
        <div>
          {plan && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8"
              style={{ background: "rgba(212,175,55,0.1)", border: "0.5px solid rgba(212,175,55,0.3)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D4AF37" }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
                {plan.name} Plan · Active
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {subscribedModules.map((id) => {
              const mod = MODULE_LIST.find((m) => m.id === id);
              if (!mod) return null;
              return (
                <Link
                  key={id}
                  href={`/dashboard/${mod.id}`}
                  className="p-8 transition-all duration-300 block group"
                  style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.03)";
                  }}
                >
                  <div
                    className="w-8 h-8 mb-5 flex items-center justify-center"
                    style={{ background: `${mod.color}18`, border: `0.5px solid ${mod.color}30` }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: mod.color }} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#D4AF37" }}>{mod.tagline}</p>
                  <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "22px", color: "#1a1c1c" }} className="mb-2">{mod.name}</h3>
                  <p className="text-xs" style={{ color: "#7e7576", lineHeight: 1.6 }}>{mod.desc}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>Open →</p>
                </Link>
              );
            })}
          </div>

          {/* Not-subscribed modules preview */}
          {MODULE_LIST.filter((m) => !subscribedModules.includes(m.id)).length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>
                Upgrade to unlock
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {MODULE_LIST.filter((m) => !subscribedModules.includes(m.id)).map((mod) => (
                  <div
                    key={mod.id}
                    className="p-5 relative overflow-hidden"
                    style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.06)", opacity: 0.6 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(249,249,249,0.7)" }}>
                      <Link href="/dashboard/pricing" className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5" style={{ background: "#1a1c1c", color: "#fff" }}>
                        Upgrade
                      </Link>
                    </div>
                    <p className="text-xs font-bold" style={{ color: "#1a1c1c" }}>{mod.name}</p>
                    <p className="text-xs mt-1" style={{ color: "#7e7576" }}>{mod.tagline}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
