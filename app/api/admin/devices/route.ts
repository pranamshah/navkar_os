import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Bootstrap token: first device that presents this token is auto-approved.
// Set ADMIN_BOOTSTRAP_TOKEN in Vercel env vars for your own laptop.
const BOOTSTRAP = process.env.ADMIN_BOOTSTRAP_TOKEN;

async function isAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  return role === "ADMIN" || role === "SUPERADMIN";
}

// GET /api/admin/devices?token=xxx  — check a specific device token status (public, no auth needed)
// GET /api/admin/devices             — list all devices (admin only)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (token) {
    const device = await prisma.adminDevice.findUnique({ where: { token } });
    if (!device) return NextResponse.json(null, { status: 404 });

    // If device is pending but the requester is an admin — auto-approve now
    if (device.status === "PENDING") {
      const session = await auth();
      const role = session?.user?.role;
      if (role === "ADMIN" || role === "SUPERADMIN") {
        await prisma.adminDevice.update({ where: { token }, data: { status: "APPROVED", lastSeenAt: new Date() } });
        return NextResponse.json({ status: "APPROVED", name: device.name });
      }
    }

    // Update last seen
    await prisma.adminDevice.update({ where: { token }, data: { lastSeenAt: new Date() } }).catch(() => {});
    return NextResponse.json({ status: device.status, name: device.name });
  }

  // List all — admin only
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const devices = await prisma.adminDevice.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(devices);
}

// POST /api/admin/devices — register a new device token
export async function POST(req: Request) {
  const { token, name } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  // Check if already registered
  const existing = await prisma.adminDevice.findUnique({ where: { token } });
  if (existing) return NextResponse.json({ status: existing.status });

  // Auto-approve if:
  // 1. The registering user is already signed in as ADMIN/SUPERADMIN, OR
  // 2. Bootstrap token env var matches (for first-time setup without a session)
  const session = await auth();
  const role = session?.user?.role;
  const isAdminUser = role === "ADMIN" || role === "SUPERADMIN";
  const isBootstrap = BOOTSTRAP && token === BOOTSTRAP;
  const autoApprove = isAdminUser || isBootstrap;

  const device = await prisma.adminDevice.create({
    data: {
      token,
      name: name || (session?.user?.name ? `${session.user.name}'s Device` : "Unnamed Device"),
      status: autoApprove ? "APPROVED" : "PENDING",
    },
  });
  return NextResponse.json({ status: device.status });
}

// PATCH /api/admin/devices — approve / reject / rename (admin only)
// Accepts either { id } or { token } as the device identifier
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, token: deviceToken, status, name } = await req.json();
  if (!id && !deviceToken) return NextResponse.json({ error: "Missing id or token" }, { status: 400 });
  const where = id ? { id } : { token: deviceToken as string };
  const updated = await prisma.adminDevice.update({
    where,
    data: { ...(status && { status }), ...(name && { name }) },
  });
  return NextResponse.json(updated);
}

// DELETE /api/admin/devices — remove a device (admin only)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.adminDevice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
