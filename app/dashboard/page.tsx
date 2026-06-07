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

    // Not yet approved by admin → show verification progress
    if (!dbUser || dbUser.status === "PENDING_VERIFICATION") {
      redirect("/status");
    }

    // Admin approved (ACTIVE) → check if they have an active subscription
    // If not, gate them at pricing so they choose a plan before accessing modules
    if (dbUser.status === "ACTIVE") {
      const activeSub = await prisma.subscription.findFirst({
        where: {
          userId,
          status: { in: ["TRIAL", "ACTIVE"] },
        },
        select: { id: true },
      });

      if (!activeSub) {
        redirect("/dashboard/pricing");
      }
    }
  }

  redirect("/dashboard/client");
}
