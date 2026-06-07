import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role   = (session.user as { role?: string; status?: string })?.role;
  const status = (session.user as { role?: string; status?: string })?.status;

  if (role === "ADMIN" || role === "SUPERADMIN") {
    redirect("/dashboard/admin");
  }

  // Pending users must complete onboarding & document upload first
  if (status === "PENDING_VERIFICATION") {
    redirect("/status");
  }

  redirect("/dashboard/client");
}
