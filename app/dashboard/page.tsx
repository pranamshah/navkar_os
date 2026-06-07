import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as { role?: string; id?: string })?.role;
  const userId = (session.user as { id?: string })?.id;

  if (role === "ADMIN" || role === "SUPERADMIN") {
    redirect("/dashboard/admin");
  }

  // Always read status directly from DB (not JWT) to avoid stale-token loops
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });
    if (dbUser?.status === "PENDING_VERIFICATION") {
      redirect("/status");
    }
  }

  redirect("/dashboard/client");
}
