import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      businessName, businessType, city, state, stateCode,
      whatsapp, gstin, pan, iecCode, chaLicenceNo,
      businessAddress, yearsInBusiness,
      gstCertPath, panCopyPath, licenceCopyPath,
    } = body;

    // Update user record
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        businessName,
        businessType,
        city,
        state,
        stateCode,
        whatsapp,
        gstin,
        pan,
        iecCode,
        chaLicenceNo,
        businessAddress,
        yearsInBusiness,
        gstCertPath,
        panCopyPath,
        licenceCopyPath,
        status: "PENDING_VERIFICATION",
      },
    });

    // Email to client
    try {
      await resend.emails.send({
        from: "NavkarOS <noreply@navkaros.com>",
        to: user.email,
        subject: "Application Received — NavkarOS",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
            <div style="background: #1a1c1c; padding: 24px 32px;">
              <span style="font-weight: 900; font-size: 13px; letter-spacing: 0.1em; color: #D4AF37;">NAVKAROS</span>
            </div>
            <div style="padding: 32px; background: #fff; border: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #4c4546; margin: 0 0 16px;">Hi ${user.name},</p>
              <p style="font-size: 14px; color: #4c4546; margin: 0 0 24px;">
                Your application has been submitted. We will verify your documents within
                <strong>48 business hours</strong> and send you a WhatsApp and email confirmation.
              </p>
              <div style="background: #f9f9f9; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #7e7576; text-transform: uppercase;">Your Client ID</p>
                <p style="margin: 0; font-family: monospace; font-size: 24px; font-weight: 900; color: #1a1c1c; letter-spacing: 0.08em;">${user.clientId}</p>
              </div>
              <p style="font-size: 12px; color: #7e7576;">
                You can check your application status at <a href="${process.env.NEXT_PUBLIC_APP_URL}/status" style="color: #D4AF37;">navkaros.com/status</a>
              </p>
            </div>
          </div>
        `,
      });
    } catch {}

    // Email to admin
    try {
      await resend.emails.send({
        from: "NavkarOS <noreply@navkaros.com>",
        to: process.env.ADMIN_EMAIL ?? "pranam@navkaros.com",
        subject: `New Verification Request: ${user.name} — ${gstin ?? "No GSTIN"}`,
        html: `
          <p>New verification request:</p>
          <ul>
            <li><strong>Name:</strong> ${user.name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Business:</strong> ${businessName}</li>
            <li><strong>Type:</strong> ${businessType}</li>
            <li><strong>GSTIN:</strong> ${gstin ?? "N/A"}</li>
            <li><strong>City:</strong> ${city}</li>
          </ul>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/admin/verifications">Review at Admin Panel →</a></p>
        `,
      });
    } catch {}

    return NextResponse.json({ success: true, redirectUrl: "/status" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
