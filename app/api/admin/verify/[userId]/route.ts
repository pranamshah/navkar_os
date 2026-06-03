import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendAccountApprovedEmail, sendAccountRejectedEmail, sendAdminNotification } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user || !["SUPERADMIN", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const { action, reason, docsNeeded } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "approve") {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "ACTIVE", verifiedAt: new Date(), verifiedBy: session.user.id },
    });
    await sendAccountApprovedEmail(user.email, user.name, user.clientId);
    return NextResponse.json({ success: true, message: "Account approved" });
  }

  if (action === "reject") {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "REJECTED", rejectionReason: reason ?? "Not specified" },
    });
    await sendAccountRejectedEmail(user.email, user.name, reason ?? "Documents could not be verified");
    return NextResponse.json({ success: true, message: "Account rejected" });
  }

  if (action === "request_docs") {
    // Send email asking for more documents
    const { Resend } = await import("resend");
    const key = process.env.RESEND_API_KEY;
    if (key) {
      try {
        await new Resend(key).emails.send({
          from: "NavkarOS <noreply@navkaros.com>",
          to: user.email,
          subject: "Additional Documents Required — NavkarOS",
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
              <div style="background:#1a1c1c;padding:20px 32px;">
                <span style="color:#D4AF37;font-weight:900;font-size:13px;letter-spacing:0.1em;">NAVKAROS</span>
              </div>
              <div style="padding:32px;background:#fff;border:1px solid #e5e7eb;">
                <p style="font-size:14px;color:#4c4546;margin:0 0 16px;">Hi ${user.name},</p>
                <p style="font-size:14px;color:#4c4546;margin:0 0 16px;">
                  To complete your account verification, we need the following additional documents:
                </p>
                <div style="background:#f9f9f9;border:1px solid #e5e7eb;padding:16px 20px;margin:0 0 20px;border-radius:4px;">
                  <p style="margin:0;font-size:14px;color:#1a1c1c;">${docsNeeded}</p>
                </div>
                <p style="font-size:13px;color:#7e7576;">
                  Please reply to this email with the requested documents, or contact us at
                  <a href="mailto:support@navkaros.com" style="color:#D4AF37;">support@navkaros.com</a>
                </p>
              </div>
            </div>`,
        });
      } catch {}
    }
    return NextResponse.json({ success: true, message: "Request sent" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
