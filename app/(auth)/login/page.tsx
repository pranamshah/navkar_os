"use client";

import { useState, useRef, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import LogoBrand from "@/components/ui/LogoBrand";

type Tab = "google" | "email" | "otp";

const STATS = [
  { val: "1,200+", label: "Logistics firms" },
  { val: "4L+",    label: "Shipments tracked" },
  { val: "₹500Cr+", label: "Billed through platform" },
];

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [tab, setTab] = useState<Tab>("google");

  // Already logged in → skip login page entirely
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email tab
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP tab
  const [identifier, setIdentifier] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Handlers ─────────────────────────────────────────────────────

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/status" });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      const msg =
        res.error === "CredentialsSignin"
          ? "Incorrect email or password"
          : res.error;
      setError(msg);
      setLoading(false);
    } else {
      router.replace("/status");
      router.refresh();
    }
  };

  const handleSendOtp = async () => {
    if (!identifier.trim()) { setError("Enter your Client ID or email"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setOtpSent(true);
    setMaskedEmail(data.email);
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter the full 6-digit OTP"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, otp: code }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    // OTP verified — sign in with email (no password needed via magic token approach)
    router.replace(data.redirectUrl ?? "/status");
    router.refresh();
  };

  // ── Tab configs ───────────────────────────────────────────────────
  const TABS: { id: Tab; label: string }[] = [
    { id: "google", label: "Google" },
    { id: "email", label: "Email" },
    { id: "otp", label: "Client ID" },
  ];

  const slideVariants = {
    initial: { opacity: 0, x: 18 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, x: -18, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* ── Left brand panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: "#1a1c1c" }}
      >
        {/* Gold grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Teal glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,116,144,0.15) 0%, transparent 70%)",
            top: "30%",
            left: "20%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div className="relative z-10">
          <LogoBrand height={120} onDark href="/" />
        </div>

        <div className="relative z-10">
          <h2
            className="mb-6"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "44px",
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Welcome back to
            <br />
            <span style={{ color: "#D4AF37" }}>NavkarOS.</span>
          </h2>
          <p className="mb-10" style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            India&apos;s complete logistics operating system.
          </p>
          <div className="grid grid-cols-3 gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-bold text-xl" style={{ color: "#D4AF37" }}>{s.val}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd.
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-hidden" style={{ background: "#fafafa" }}>
        <div className="max-w-sm w-full mx-auto">

          {/* Mobile logo */}
          <div className="lg:hidden mb-12">
            <LogoBrand height={120} href="/" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Welcome back</p>
          <h1
            className="mb-8"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "36px",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
            }}
          >
            Sign in to your account
          </h1>

          {/* Tab switcher */}
          <div className="flex mb-8 border-b" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(""); }}
                className="flex-1 pb-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200 relative"
                style={{ color: tab === t.id ? "#1a1c1c" : "rgba(0,0,0,0.35)" }}
              >
                {t.label}
                {tab === t.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: "#D4AF37" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 px-4 py-3 text-xs" style={{ background: "#FEF2F2", border: "0.5px solid #FCA5A5", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Google tab ──────────────────────────────────────── */}
            {tab === "google" && (
              <motion.div key="google" {...slideVariants}>
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 border text-sm font-semibold transition-all duration-200"
                  style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#1a1c1c", background: "#fff" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  {loading ? "Redirecting…" : "Continue with Google"}
                </button>
                <p className="mt-4 text-center text-xs" style={{ color: "#7e7576" }}>
                  Fastest — uses your existing Google account
                </p>
              </motion.div>
            )}

            {/* ── Email + Password tab ─────────────────────────── */}
            {tab === "email" && (
              <motion.div key="email" {...slideVariants}>
                <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Password</label>
                      <button type="button" className="text-xs" style={{ color: "#D4AF37" }}>Forgot password?</button>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="outline-none bg-transparent pb-2 w-full pr-8"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-0 bottom-2"
                        style={{ color: "#7e7576" }}
                      >
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                    style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Client ID + OTP tab ──────────────────────────── */}
            {tab === "otp" && (
              <motion.div key="otp" {...slideVariants}>
                {!otpSent ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Client ID or Email</label>
                      <input
                        type="text"
                        placeholder="NVK-2026-XXXXX"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="outline-none bg-transparent pb-2 w-full"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px", fontFamily: "monospace" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                      style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}
                    >
                      {loading ? "Sending…" : "Send OTP"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div
                      className="px-4 py-3 text-xs"
                      style={{ background: "rgba(16,185,129,0.08)", border: "0.5px solid rgba(16,185,129,0.3)", color: "#065f46" }}
                    >
                      OTP sent to <strong>{maskedEmail}</strong>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Enter 6-Digit OTP</label>
                      <div className="flex gap-2">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => { otpRefs.current[i] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="flex-1 text-center text-lg font-bold outline-none border py-3 transition-all duration-200"
                            style={{
                              borderColor: digit ? "#D4AF37" : "rgba(0,0,0,0.15)",
                              color: "#1a1c1c",
                              borderWidth: "0.5px",
                              background: "#fff",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                      style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}
                    >
                      {loading ? "Verifying…" : "Verify & Sign In"}
                    </button>

                    <button
                      onClick={countdown > 0 ? undefined : handleSendOtp}
                      disabled={countdown > 0}
                      className="text-xs text-center"
                      style={{ color: countdown > 0 ? "#7e7576" : "#D4AF37" }}
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          <div className="mt-10 pt-8 text-center" style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
            <p className="text-sm" style={{ color: "#7e7576" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold" style={{ color: "#1a1c1c" }}>
                Create Account →
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs">
            <Link href="/" style={{ color: "#7e7576" }}>← Back to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
