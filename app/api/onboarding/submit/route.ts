import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, sendAdminNotification } from "@/lib/email";

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

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        businessName, businessType, city, state, stateCode,
        whatsapp, gstin, pan, iecCode, chaLicenceNo,
        businessAddress, yearsInBusiness,
        gstCertPath, panCopyPath, licenceCopyPath,
        status: "PENDING_VERIFICATION",
      },
    });

    await sendWelcomeEmail(user.email, user.name, user.clientId);
    await sendAdminNotification(
      `New Verification Request: ${user.name} — ${gstin ?? "No GSTIN"}`,
      `<p>New verification request:</p>
       <ul>
         <li><strong>Name:</strong> ${user.name}</li>
         <li><strong>Email:</strong> ${user.email}</li>
         <li><strong>Business:</strong> ${businessName}</li>
         <li><strong>Type:</strong> ${businessType}</li>
         <li><strong>GSTIN:</strong> ${gstin ?? "N/A"}</li>
         <li><strong>City:</strong> ${city}</li>
       </ul>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/admin/verifications">Review →</a></p>`
    );

    return NextResponse.json({ success: true, redirectUrl: "/status" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
