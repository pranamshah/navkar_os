"use client";

import { useState, useRef, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import LogoBrand from "@/components/ui/LogoBrand";

type Tab = "email" | "clientid";
type ForgotStep = "idle" | "enter" | "verify";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [tab, setTab] = useState<Tab>("email");

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Email tab ────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── Client ID tab ────────────────────────────────────────────────
  const [clientId, setClientId] = useState("");
  const [clientPass, setClientPass] = useState(false);
  const [showClientPass, setShowClientPass] = useState(false);
  const [clientPassword, setClientPassword] = useState("");

  // ── Forgot password (shared) ─────────────────────────────────────
  const [forgotStep, setForgotStep] = useState<ForgotStep>("idle");
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetForgot = () => {
    setForgotStep("idle");
    setForgotIdentifier("");
    setMaskedEmail("");
    setOtp(["", "", "", "", "", ""]);
    setCountdown(0);
    setError("");
  };

  // ── Handlers ─────────────────────────────────────────────────────

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Incorrect email or password" : res.error);
      setLoading(false);
    } else {
      router.replace("/dashboard");
    }
  };

  const handleClientIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    // Pass clientId as the "email" field — auth.ts detects no "@" and looks up by clientId
    const res = await signIn("credentials", { email: clientId.toUpperCase(), password: clientPassword, redirect: false });
    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Incorrect Client ID or password" : res.error);
      setLoading(false);
    } else {
      router.replace("/dashboard");
    }
  };

  const handleSendOtp = async () => {
    const id = forgotIdentifier.trim();
    if (!id) { setError("Enter your email or Client ID"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: id }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setMaskedEmail(data.email);
    setForgotStep("verify");
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(30);
    const iv = setInterval(() => setCountdown((c) => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; }), 1000);
  };

  const handleOtpChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter the full 6-digit OTP"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: forgotIdentifier.trim(), otp: code }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }

    const signInResult = await signIn("credentials", {
      email: data.email,
      signInToken: data.signInToken,
      redirect: false,
    });
    if (signInResult?.error) {
      setError("Sign-in failed — the token may have expired. Please try again.");
      setLoading(false);
      return;
    }
    router.replace(data.redirectUrl ?? "/dashboard");
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "email", label: "Email" },
    { id: "clientid", label: "Client ID" },
  ];

  const slideVariants = {
    initial: { opacity: 0, x: 18 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, x: -18, transition: { duration: 0.2 } },
  };

  // ── Shared forgot-password panel ─────────────────────────────────
  const ForgotPanel = () => (
    <div className="mt-6 pt-6" style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
      {forgotStep === "idle" && (
        <button
          type="button"
          onClick={() => { setForgotStep("enter"); setForgotIdentifier(tab === "email" ? email : clientId); setError(""); }}
          className="text-xs font-semibold"
          style={{ color: "#D4AF37" }}
        >
          Forgot password?
        </button>
      )}

      {forgotStep === "enter" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Reset via OTP</p>
            <button type="button" onClick={resetForgot} className="text-xs" style={{ color: "#7e7576" }}>Cancel</button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
              {tab === "email" ? "Email Address" : "Email or Client ID"}
            </label>
            <input
              type="text"
              placeholder={tab === "email" ? "you@company.com" : "you@company.com or RAJ12345"}
              value={forgotIdentifier}
              onChange={(e) => setForgotIdentifier(e.target.value)}
              className="outline-none bg-transparent pb-2 w-full"
              style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
              onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
              onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
            />
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full py-3 text-xs font-semibold uppercase tracking-widest"
            style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}
          >
            {loading ? "Sending…" : "Send OTP to Email"}
          </button>
        </div>
      )}

      {forgotStep === "verify" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Enter OTP</p>
            <button type="button" onClick={resetForgot} className="text-xs" style={{ color: "#7e7576" }}>Cancel</button>
          </div>
          <div
            className="px-3 py-2.5 text-xs"
            style={{ background: "rgba(16,185,129,0.08)", border: "0.5px solid rgba(16,185,129,0.3)", color: "#065f46" }}
          >
            OTP sent to <strong>{maskedEmail}</strong>
          </div>
          <div className="flex gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="flex-1 text-center text-lg font-bold outline-none border py-3 transition-all duration-200"
                style={{ borderColor: digit ? "#D4AF37" : "rgba(0,0,0,0.15)", color: "#1a1c1c", borderWidth: "0.5px", background: "#fff" }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full py-3 text-xs font-semibold uppercase tracking-widest"
            style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}
          >
            {loading ? "Verifying…" : "Verify & Sign In"}
          </button>
          <button
            type="button"
            onClick={countdown > 0 ? undefined : handleSendOtp}
            disabled={countdown > 0}
            className="text-xs text-center"
            style={{ color: countdown > 0 ? "#7e7576" : "#D4AF37" }}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* ── Left brand panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden" style={{ background: "#1a1c1c" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute pointer-events-none" style={{ width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,116,144,0.15) 0%, transparent 70%)", top: "30%", left: "20%", transform: "translate(-50%, -50%)" }} />
        <div className="relative z-10"><LogoBrand height={120} onDark href="/" /></div>
        <div className="relative z-10">
          <h2 className="mb-6" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "44px", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Welcome back to<br /><span style={{ color: "#D4AF37" }}>NavkarOS.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            India&apos;s complete logistics operating system — freight forwarding, customs, CFS, transport, and accounting in one platform.
          </p>
        </div>
        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd.</p>
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-hidden" style={{ background: "#fafafa" }}>
        <div className="max-w-sm w-full mx-auto">
          <div className="lg:hidden mb-12"><LogoBrand height={120} href="/" /></div>

          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Welcome back</p>
          <h1 className="mb-8" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "36px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }}>
            Sign in to your account
          </h1>

          {/* Tab switcher */}
          <div className="flex mb-8 border-b" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => { setTab(t.id); setError(""); resetForgot(); }}
                className="flex-1 pb-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200 relative"
                style={{ color: tab === t.id ? "#1a1c1c" : "rgba(0,0,0,0.35)" }}>
                {t.label}
                {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#D4AF37" }} />}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 text-xs" style={{ background: "#FEF2F2", border: "0.5px solid #FCA5A5", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Email + Password ─────────────────────────────── */}
            {tab === "email" && (
              <motion.div key="email" {...slideVariants}>
                <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Email Address</label>
                    <input required type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Password</label>
                    <div className="relative">
                      <input required type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="outline-none bg-transparent pb-2 w-full pr-8"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 bottom-2" style={{ color: "#7e7576" }}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                    style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}>
                    {loading ? "Signing in…" : "Sign In"}
                  </button>
                </form>
                {forgotStep === "idle" ? null : null}
                <ForgotPanel />
              </motion.div>
            )}

            {/* ── Client ID + Password ──────────────────────────── */}
            {tab === "clientid" && (
              <motion.div key="clientid" {...slideVariants}>
                <form onSubmit={handleClientIdLogin} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Client ID</label>
                    <input required type="text" placeholder="e.g. RAJ12345" value={clientId} onChange={(e) => setClientId(e.target.value)}
                      className="outline-none bg-transparent pb-2 w-full"
                      style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px", fontFamily: "monospace" }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Password</label>
                    <div className="relative">
                      <input required type={showClientPass ? "text" : "password"} placeholder="••••••••" value={clientPassword} onChange={(e) => setClientPassword(e.target.value)}
                        className="outline-none bg-transparent pb-2 w-full pr-8"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")} />
                      <button type="button" onClick={() => setShowClientPass(!showClientPass)} className="absolute right-0 bottom-2" style={{ color: "#7e7576" }}>
                        {showClientPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                    style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}>
                    {loading ? "Signing in…" : "Sign In"}
                  </button>
                </form>
                <ForgotPanel />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-8 text-center" style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
            <p className="text-sm" style={{ color: "#7e7576" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold" style={{ color: "#1a1c1c" }}>Create Account →</Link>
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
