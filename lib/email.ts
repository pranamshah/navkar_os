import { Resend } from "resend";

// Lazy getter — never instantiated at module level so build doesn't fail
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

// Use Resend's shared sender (works without domain verification).
// Once navkaros.in is verified in Resend, set RESEND_FROM env var.
const FROM = process.env.RESEND_FROM ?? "NavkarOS <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://navkaros.in";

// ── Shared layout wrapper ────────────────────────────────────────────────────
function layout(content: string) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;">
      <div style="background:#1a1c1c;padding:20px 32px;display:flex;align-items:center;gap:12px;">
        <div style="background:#D4AF37;color:#1a1c1c;font-weight:900;font-size:13px;padding:6px 10px;border-radius:6px;">N</div>
        <span style="font-weight:900;font-size:13px;letter-spacing:0.1em;color:#fff;text-transform:uppercase;">NavkarOS</span>
      </div>
      <div style="padding:32px;">${content}</div>
      <div style="padding:16px 32px;background:#f9f9f9;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:11px;color:#7e7576;">
          Questions? Email <a href="mailto:support@navkaros.com" style="color:#D4AF37;">support@navkaros.com</a>
        </p>
      </div>
    </div>`;
}

function clientIdBox(clientId: string) {
  return `
    <div style="background:#f9f9f9;border:1px solid #e5e7eb;padding:20px;border-radius:4px;margin:24px 0;">
      <p style="margin:0 0 6px;font-size:11px;color:#7e7576;text-transform:uppercase;letter-spacing:0.08em;">Your Client ID</p>
      <p style="margin:0;font-family:monospace;font-size:26px;font-weight:900;color:#1a1c1c;letter-spacing:0.06em;">${clientId}</p>
      <p style="margin:8px 0 0;font-size:11px;color:#7e7576;">Save this — you can use it to log in at any time.</p>
    </div>`;
}

function btn(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#1a1c1c;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:2px;">${text}</a>`;
}

// ── Email senders ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string, name: string, clientId: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to NavkarOS — Application Received",
      html: layout(`
        <p style="font-size:14px;color:#4c4546;margin:0 0 16px;">Hi ${name},</p>
        <p style="font-size:14px;color:#4c4546;margin:0 0 20px;">Welcome to NavkarOS! Your application has been submitted successfully.</p>
        ${clientIdBox(clientId)}
        <p style="font-size:14px;color:#4c4546;font-weight:600;margin:0 0 12px;">What happens next:</p>
        <ol style="font-size:14px;color:#4c4546;padding-left:20px;margin:0 0 24px;line-height:1.9;">
          <li>Complete your business onboarding (~5 minutes)</li>
          <li>Our team verifies documents within <strong>48 business hours</strong></li>
          <li>Confirmation sent to your email &amp; WhatsApp</li>
          <li>Start your free 14-day trial on any product</li>
        </ol>
        ${btn("Complete Onboarding →", `${APP_URL}/onboarding`)}
      `),
    });
  } catch (err) {
    console.error("sendWelcomeEmail failed:", err);
  }
}

export async function sendAccountApprovedEmail(email: string, name: string, clientId: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "Your NavkarOS Account is Active!",
      html: layout(`
        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);padding:16px 20px;margin-bottom:24px;border-radius:4px;">
          <p style="margin:0;font-size:14px;font-weight:700;color:#065f46;">✅ Account Verified & Activated</p>
        </div>
        <p style="font-size:14px;color:#4c4546;margin:0 0 16px;">Hi ${name},</p>
        <p style="font-size:14px;color:#4c4546;margin:0 0 20px;">
          Great news — your NavkarOS account has been verified and activated. Your <strong>14-day free trial starts now.</strong>
        </p>
        ${clientIdBox(clientId)}
        <p style="font-size:14px;color:#4c4546;margin:0 0 8px;">You can log in using:</p>
        <ul style="font-size:14px;color:#4c4546;padding-left:20px;margin:0 0 24px;line-height:1.9;">
          <li>Your registered email + password</li>
          <li>Client ID + OTP</li>
          <li>Google (if you used Google sign-up)</li>
        </ul>
        ${btn("Go to Dashboard →", `${APP_URL}/dashboard/client`)}
        <p style="font-size:12px;color:#7e7576;margin-top:20px;">
          Ready to subscribe? <a href="${APP_URL}/pricing" style="color:#D4AF37;">View pricing →</a>
        </p>
      `),
    });
  } catch (err) {
    console.error("sendAccountApprovedEmail failed:", err);
  }
}

export async function sendAccountRejectedEmail(email: string, name: string, reason: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "Update on Your NavkarOS Application",
      html: layout(`
        <p style="font-size:14px;color:#4c4546;margin:0 0 16px;">Hi ${name},</p>
        <p style="font-size:14px;color:#4c4546;margin:0 0 20px;">
          We were unable to approve your NavkarOS application at this time.
        </p>
        <div style="background:#FEF2F2;border:1px solid #FCA5A5;padding:16px 20px;margin-bottom:24px;border-radius:4px;">
          <p style="margin:0 0 6px;font-size:11px;color:#7e7576;text-transform:uppercase;letter-spacing:0.06em;">Reason</p>
          <p style="margin:0;font-size:14px;color:#1a1c1c;font-weight:600;">${reason}</p>
        </div>
        <p style="font-size:14px;color:#4c4546;margin:0 0 8px;font-weight:600;">What to do next:</p>
        <ul style="font-size:14px;color:#4c4546;padding-left:20px;margin:0 0 24px;line-height:1.9;">
          <li>Review the reason above</li>
          <li>Reply to this email with the correct documents or information</li>
          <li>Or contact us on WhatsApp for immediate assistance</li>
        </ul>
        ${btn("Contact Support", "mailto:support@navkaros.com")}
      `),
    });
  } catch (err) {
    console.error("sendAccountRejectedEmail failed:", err);
  }
}

export async function sendOtpEmail(email: string, name: string, otp: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: `Your NavkarOS Login OTP: ${otp}`,
      html: layout(`
        <p style="font-size:14px;color:#4c4546;margin:0 0 20px;">Hi ${name}, your one-time password:</p>
        <div style="background:#f9f9f9;border:1px solid #e5e7eb;padding:28px;text-align:center;margin:0 0 20px;border-radius:4px;">
          <span style="font-family:monospace;font-size:40px;font-weight:900;letter-spacing:0.25em;color:#1a1c1c;">${otp}</span>
        </div>
        <p style="font-size:12px;color:#7e7576;margin:0;">
          ⏱ Expires in <strong>10 minutes</strong>. Do not share this OTP with anyone.<br>
          If you did not request this, ignore this email.
        </p>
      `),
    });
  } catch (err) {
    console.error("sendOtpEmail failed:", err);
  }
}

export async function sendPaymentConfirmEmail(
  email: string, name: string, product: string, plan: string,
  amount: number, trialEndsAt: Date
) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: `Payment Confirmed — ${product} ${plan} Plan`,
      html: layout(`
        <p style="font-size:14px;color:#4c4546;margin:0 0 16px;">Hi ${name},</p>
        <p style="font-size:14px;color:#4c4546;margin:0 0 20px;">
          Your payment is confirmed. Your <strong>14-day free trial</strong> has started.
        </p>
        <div style="background:#f9f9f9;border:1px solid #e5e7eb;padding:20px;margin-bottom:24px;border-radius:4px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:12px;color:#7e7576;">Plan</span>
            <span style="font-size:14px;font-weight:700;color:#1a1c1c;">${product} ${plan}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:12px;color:#7e7576;">Amount Paid</span>
            <span style="font-size:14px;font-weight:700;color:#1a1c1c;">₹${amount.toLocaleString("en-IN")}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:12px;color:#7e7576;">Trial Ends</span>
            <span style="font-size:14px;font-weight:700;color:#10B981;">${trialEndsAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
        ${btn("Go to Dashboard →", `${APP_URL}/dashboard/client`)}
      `),
    });
  } catch (err) {
    console.error("sendPaymentConfirmEmail failed:", err);
  }
}

export async function sendAdminNotification(subject: string, html: string) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "pranam@navkaros.com";
  try {
    await getResend().emails.send({ from: FROM, to: adminEmail, subject, html });
  } catch (err) {
    console.error("sendAdminNotification failed:", err);
  }
}
