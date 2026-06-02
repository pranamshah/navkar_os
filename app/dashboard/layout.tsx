import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";
import type { ModuleId } from "@/lib/modules";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileRes, subRes] = await Promise.all([
    supabase.from("profiles").select("full_name, company_name").eq("id", user.id).single(),
    supabase.from("subscriptions").select("plan, modules, status").eq("user_id", user.id).eq("status", "active").maybeSingle(),
  ]);

  const profile = profileRes.data;
  const subscription = subRes.data;

  return (
    <div className="flex min-h-screen" style={{ background: "#f9f9f9" }}>
      <Sidebar
        userEmail={user.email}
        userName={profile?.full_name || undefined}
        subscribedModules={(subscription?.modules as ModuleId[]) || []}
        plan={subscription?.plan || undefined}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
