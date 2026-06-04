import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, company, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Send notification to company owner
    await resend.emails.send({
      from: "NavkarOS <onboarding@resend.dev>",
      to: "pranamsshah@gmail.com",
      replyTo: email,
      subject: `New Contact Form Message from ${name} — NavkarOS`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
          <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 28px;">
            <h1 style="font-size: 24px; color: #1a1c1c; margin: 0; font-weight: 700;">NavkarOS</h1>
            <p style="font-size: 12px; color: #7e7576; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.1em;">New Contact Form Submission</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 12px; color: #7e7576; text-transform: uppercase; letter-spacing: 0.08em; width: 120px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 15px; color: #1a1c1c; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 12px; color: #7e7576; text-transform: uppercase; letter-spacing: 0.08em;">Company</td>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 15px; color: #1a1c1c;">${company || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 12px; color: #7e7576; text-transform: uppercase; letter-spacing: 0.08em;">Email</td>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 15px; color: #1a1c1c;"><a href="mailto:${email}" style="color: #D4AF37; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 12px; color: #7e7576; text-transform: uppercase; letter-spacing: 0.08em;">Phone</td>
              <td style="padding: 10px 0; border-bottom: 0.5px solid #e5e7eb; font-size: 15px; color: #1a1c1c;">${phone || "—"}</td>
            </tr>
          </table>

          <div style="background: #f9f9f9; padding: 20px; border-left: 3px solid #D4AF37; margin-bottom: 28px;">
            <p style="font-size: 12px; color: #7e7576; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 10px;">Message</p>
            <p style="font-size: 15px; color: #1a1c1c; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="text-align: center; padding-top: 20px; border-top: 0.5px solid #e5e7eb;">
            <a href="mailto:${email}" style="display: inline-block; padding: 12px 28px; background: #1a1c1c; color: #D4AF37; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none;">
              Reply to ${name} →
            </a>
          </div>

          <p style="font-size: 11px; color: #b0b0b0; text-align: center; margin-top: 28px;">
            NavkarOS · 7, Mannady Street, George Town, Chennai — 600 001 · navkaros.in
          </p>
        </div>
      `,
    });

    // Auto-reply to the sender
    await resend.emails.send({
      from: "NavkarOS <onboarding@resend.dev>",
      to: email,
      subject: "We received your message — NavkarOS",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
          <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 28px;">
            <h1 style="font-size: 24px; color: #1a1c1c; margin: 0; font-weight: 700;">NavkarOS</h1>
          </div>
          <h2 style="font-size: 28px; color: #1a1c1c; font-weight: 400; margin-bottom: 16px;">Thanks, ${name}!</h2>
          <p style="font-size: 15px; color: #4c4546; line-height: 1.7; margin-bottom: 20px;">
            We've received your message and our team will get back to you within <strong>4 working hours</strong>.
          </p>
          <p style="font-size: 15px; color: #4c4546; line-height: 1.7; margin-bottom: 28px;">
            In the meantime, feel free to explore our products at <a href="https://navkaros.in" style="color: #D4AF37;">navkaros.in</a> or start a free trial — no credit card required.
          </p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://navkaros.in/signup" style="display: inline-block; padding: 12px 28px; background: #1a1c1c; color: #D4AF37; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none;">
              Start Free Trial →
            </a>
          </div>
          <p style="font-size: 11px; color: #b0b0b0; text-align: center; margin-top: 28px;">
            NavkarOS · 7, Mannady Street, George Town, Chennai — 600 001 · hello@navkaros.in
          </p>
        </div>
      `,
    }).catch(() => {
      // Don't fail the request if auto-reply fails
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Error sending email:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
