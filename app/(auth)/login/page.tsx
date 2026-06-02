"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left: Dark brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: "#1a1c1c" }}
      >
        {/* Gold grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <Link href="/" className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: "#D4AF37", color: "#1a1c1c" }}>N</div>
            <span className="font-black text-sm uppercase tracking-widest text-white">NavkarOS</span>
          </div>
        </Link>

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
            The Operating System
            <br />
            for Indian Logistics.
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            500+ logistics businesses. 12,000+ shipments tracked.
            <br />
            One platform to run it all.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { val: "500+", label: "Businesses" },
              { val: "98%", label: "Accuracy" },
              { val: "14hrs", label: "Saved/week" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-semibold text-xl" style={{ color: "#D4AF37" }}>{s.val}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd.
        </p>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12">
        <div className="max-w-sm w-full mx-auto">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: "#1a1c1c", color: "#D4AF37" }}>N</div>
            <span className="font-black text-sm uppercase tracking-widest" style={{ color: "#1a1c1c" }}>NavkarOS</span>
          </Link>

          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>
            Welcome back
          </p>
          <h1
            className="mb-2"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "36px",
              fontWeight: 400,
              color: "#1a1c1c",
              letterSpacing: "-0.02em",
            }}
          >
            Sign in to NavkarOS
          </h1>
          <p className="mb-10 text-sm" style={{ color: "#7e7576" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold" style={{ color: "#1a1c1c" }}>
              Create one free
            </Link>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {error && (
              <div
                className="px-4 py-3 text-xs"
                style={{ background: "#FEF2F2", border: "0.5px solid #FCA5A5", color: "#DC2626" }}
              >
                {error}
              </div>
            )}

            {[
              { key: "email", label: "Email Address", type: "email", placeholder: "you@company.com", value: email, set: setEmail },
              { key: "password", label: "Password", type: "password", placeholder: "••••••••", value: password, set: setPassword },
            ].map((f) => (
              <div key={f.key} className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
                  {f.label}
                </label>
                <input
                  required
                  type={f.type}
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="outline-none bg-transparent pb-2 w-full transition-colors duration-200"
                  style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 mt-2"
              style={{
                background: loading ? "#ccc" : "#1a1c1c",
                color: "#fff",
                cursor: loading ? "not-allowed" : "none",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs" style={{ color: "#7e7576" }}>
            <Link href="/" className="hover:text-gray-900 transition-colors">← Back to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
