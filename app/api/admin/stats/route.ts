import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["SUPERADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalUsers, activeUsers, pendingUsers, rejectedUsers,
    totalRevenue, subscriptions, openTickets,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.user.count({ where: { role: "CLIENT", status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "CLIENT", status: "PENDING_VERIFICATION" } }),
    prisma.user.count({ where: { role: "CLIENT", status: "REJECTED" } }),
    prisma.invoice.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.subscription.count({ where: { status: { in: ["TRIAL", "ACTIVE"] } } }),
    prisma.ticket.count({ where: { status: "OPEN" } }),
  ]);

  // Monthly revenue for last 6 months
  const now = new Date();
  const monthlyRevenue = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      return prisma.invoice
        .aggregate({ where: { status: "PAID", paidAt: { gte: start, lte: end } }, _sum: { amount: true } })
        .then((r) => ({
          month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
          revenue: r._sum.amount ?? 0,
        }));
    })
  );

  return NextResponse.json({
    totalUsers,
    activeUsers,
    pendingUsers,
    rejectedUsers,
    totalRevenue: totalRevenue._sum.amount ?? 0,
    activeSubscriptions: subscriptions,
    openTickets,
    monthlyRevenue: monthlyRevenue.reverse(),
  });
}
