import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;

  if (role === "ADMIN" || role === "SUPERADMIN") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/client");
}
