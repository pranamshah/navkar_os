"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react"; // Check still used in checkbox + password strength
import LogoBrand from "@/components/ui/LogoBrand";

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
  const { status } = useSession();
  const [showPass, setShowPass] = useState(false);

  // Already logged in → skip signup page entirely
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);
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

    router.replace("/onboarding");
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
          <LogoBrand height={120} onDark href="/" />
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
            Freight software built
            <br />
            <span style={{ color: "#D4AF37" }}>for India&apos;s trade.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginTop: "16px" }}>
            Nexlog, EntryX, DockIQ, RunDesk, Accura, TradePilot — everything your logistics business needs, fully integrated.
          </p>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd.
        </p>
      </div>

      {/* ── Right form panel ─────────────────────────────────── */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-hidden" style={{ background: "#fafafa" }}>
        <div className="max-w-sm w-full mx-auto">

          <div className="lg:hidden mb-12">
            <LogoBrand height={120} href="/" />
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
