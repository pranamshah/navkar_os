import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as { role?: string; id?: string; userId?: string };
  const role = user.role;
  // NextAuth JWT sets token.userId; the session callback maps it to session.user.id
  // Use the first non-null value we find
  const userId = user.id || user.userId;

  if (role === "ADMIN" || role === "SUPERADMIN") {
    redirect("/dashboard/admin");
  }

  if (!userId) {
    // Session exists but no userId — shouldn't happen, but safe fallback
    redirect("/login");
  }

  // Read status directly from DB — never trust stale JWT for routing decisions
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true },
  });

  if (!dbUser || dbUser.status === "PENDING_VERIFICATION") {
    redirect("/status");
  }

  // ACTIVE or VERIFIED → client dashboard
  redirect("/dashboard/client");
}
