"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react";
import LogoBrand from "@/components/ui/LogoBrand";

const BENEFITS = [
  "Free 14-day trial on all products",
  "Account verified within 48 hours",
  "No credit card to start",
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < strength ? colors[strength - 1] : "rgba(0,0,0,0.08)" }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[strength - 1] ?? "#7e7576" }}>
        {password ? labels[strength - 1] ?? "Weak" : ""}
      </p>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleGoogleSignup = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/onboarding" });
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (!agreed) { setError("Please accept the Terms of Service to continue"); return; }
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }

    // Auto sign in
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push("/onboarding");
    router.refresh();
  };

  const fadeSlide = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: "#1a1c1c" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
            bottom: "20%", right: "10%",
          }}
        />

        <div className="relative z-10">
          <LogoBrand height={80} onDark href="/" />
        </div>

        <div className="relative z-10">
          <h2
            className="mb-6"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "42px",
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Join 1,200+
            <br />
            <span style={{ color: "#D4AF37" }}>logistics professionals.</span>
          </h2>
          <div className="flex flex-col gap-4 mt-8">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.2)" }}>
                  <Check size={11} style={{ color: "#D4AF37" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd.
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-hidden" style={{ background: "#fafafa" }}>
        <div className="max-w-sm w-full mx-auto">

          <div className="lg:hidden mb-12">
            <LogoBrand height={80} href="/" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Get started</p>
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
            Create your account
          </h1>

          {error && (
            <div className="mb-6 px-4 py-3 text-xs" style={{ background: "#FEF2F2", border: "0.5px solid #FCA5A5", color: "#DC2626" }}>
              {error}
            </div>
          )}

          {/* Google signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 border text-sm font-semibold mb-6 transition-all duration-200"
            style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#1a1c1c", background: "#fff" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#D4AF37"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.1)" }} />
            <span className="text-xs" style={{ color: "#7e7576" }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.1)" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignup} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Full Name *</label>
              <input
                required
                type="text"
                placeholder="Rajesh Mehta"
                value={form.name}
                onChange={set("name")}
                className="outline-none bg-transparent pb-2 w-full"
                style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Email Address *</label>
              <input
                required
                type="email"
                placeholder="rajesh@company.com"
                value={form.email}
                onChange={set("email")}
                className="outline-none bg-transparent pb-2 w-full"
                style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Phone / WhatsApp *</label>
              <input
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set("phone")}
                className="outline-none bg-transparent pb-2 w-full"
                style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Password *</label>
              <div className="relative">
                <input
                  required
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  className="outline-none bg-transparent pb-2 w-full pr-8"
                  style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 bottom-2" style={{ color: "#7e7576" }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Confirm Password *</label>
              <div className="relative">
                <input
                  required
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  className="outline-none bg-transparent pb-2 w-full pr-8"
                  style={{
                    borderBottom: `0.5px solid ${form.confirm && form.confirm !== form.password ? "#EF4444" : "rgba(0,0,0,0.2)"}`,
                    color: "#1a1c1c",
                    fontSize: "15px",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = form.confirm && form.confirm !== form.password ? "#EF4444" : "rgba(0,0,0,0.2)")}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 bottom-2" style={{ color: "#7e7576" }}>
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="w-4 h-4 flex-shrink-0 border mt-0.5 flex items-center justify-center transition-all duration-200"
                style={{
                  borderColor: agreed ? "#D4AF37" : "rgba(0,0,0,0.25)",
                  borderWidth: "0.5px",
                  background: agreed ? "#D4AF37" : "transparent",
                }}
              >
                {agreed && <Check size={10} style={{ color: "#1a1c1c" }} />}
              </button>
              <span className="text-xs leading-relaxed" style={{ color: "#7e7576" }}>
                I agree to the{" "}
                <Link href="#" style={{ color: "#1a1c1c" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" style={{ color: "#1a1c1c" }}>Privacy Policy</Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 mt-2"
              style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: "#7e7576" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "#1a1c1c" }}>Sign In →</Link>
          </p>

          <p className="mt-4 text-center text-xs">
            <Link href="/" style={{ color: "#7e7576" }}>← Back to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
