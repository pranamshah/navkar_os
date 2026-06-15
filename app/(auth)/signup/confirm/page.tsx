import Link from "next/link";
import LogoBrand from "@/components/ui/LogoBrand";

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ background: "#f9f9f9" }}>
      <div className="max-w-md w-full text-center">
        <div className="inline-flex mb-12">
          <LogoBrand height={120} href="/" />
        </div>

        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8" style={{ background: "rgba(30,64,175,0.12)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "36px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }} className="mb-4">
          Check your email
        </h1>
        <p className="text-sm mb-8" style={{ color: "#7e7576", lineHeight: 1.7 }}>
          We&apos;ve sent a confirmation link to your email address. Click the link to activate your account and get started with NavkarOS.
        </p>
        <p className="text-xs mb-10" style={{ color: "#9e9596" }}>
          Didn&apos;t get the email? Check your spam folder or{" "}
          <Link href="/signup" style={{ color: "#1a1c1c", fontWeight: 600 }}>try again</Link>.
        </p>

        <Link
          href="/login"
          className="inline-block px-10 py-4 text-xs font-semibold uppercase tracking-widest"
          style={{ background: "#1a1c1c", color: "#fff" }}
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
