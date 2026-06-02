"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { MODULE_LIST } from "@/lib/modules";

type Step = 1 | 2 | 3;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    password: "",
    userType: "" as "business" | "client" | "",
    modules: [] as string[],
  });

  const toggleModule = (id: string) => {
    setForm((f) => ({
      ...f,
      modules: f.modules.includes(id) ? f.modules.filter((m) => m !== id) : [...f.modules, id],
    }));
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          company: form.company,
          user_type: form.userType || "business",
          modules: form.modules,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.session && data.user) {
      // Session exists (email confirmation disabled) — save profile directly
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.fullName,
        company_name: form.company,
        user_type: form.userType || "business",
      });

      if (form.modules.length > 0) {
        await supabase.from("module_interests").insert({
          user_id: data.user.id,
          modules: form.modules,
        });
      }

      router.push("/dashboard");
      router.refresh();
    } else if (data.user && !data.session) {
      // Email confirmation required — profile will be created by DB trigger on confirm
      router.push("/signup/confirm");
    } else {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const fadeSlide = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden" style={{ background: "#1a1c1c" }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: "#D4AF37", color: "#1a1c1c" }}>N</div>
          <span className="font-black text-sm uppercase tracking-widest text-white">NavkarOS</span>
        </Link>

        <div className="relative z-10">
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "40px", fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Start your logistics
            <br />
            <span style={{ color: "#D4AF37" }}>transformation today.</span>
          </h2>
          <p className="mt-5" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Free to start. No credit card required.
            <br />
            14-day full access trial.
          </p>

          {/* Progress steps */}
          <div className="mt-14 flex flex-col gap-5">
            {[
              { n: 1, label: "Your Details" },
              { n: 2, label: "What You Do" },
              { n: 3, label: "Choose Modules" },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-4">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: step >= s.n ? "#D4AF37" : "rgba(255,255,255,0.1)",
                    color: step >= s.n ? "#1a1c1c" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {step > s.n ? "✓" : s.n}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: step >= s.n ? "#fff" : "rgba(255,255,255,0.35)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} NavkarOS Logistics Pvt. Ltd.
        </p>
      </div>

      {/* Right: Form steps */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-hidden">
        <div className="max-w-sm w-full mx-auto">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: "#1a1c1c", color: "#D4AF37" }}>N</div>
            <span className="font-black text-sm uppercase tracking-widest" style={{ color: "#1a1c1c" }}>NavkarOS</span>
          </Link>

          {/* Mobile step indicator */}
          <div className="lg:hidden flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full" style={{ background: step >= s ? "#D4AF37" : "rgba(0,0,0,0.12)" }} />
            ))}
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 text-xs" style={{ background: "#FEF2F2", border: "0.5px solid #FCA5A5", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" {...fadeSlide}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Step 1 of 3</p>
                <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "34px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }} className="mb-2">
                  Create your account
                </h1>
                <p className="mb-10 text-sm" style={{ color: "#7e7576" }}>
                  Already have one?{" "}
                  <Link href="/login" className="font-semibold" style={{ color: "#1a1c1c" }}>Sign in</Link>
                </p>

                <div className="flex flex-col gap-6">
                  {[
                    { key: "fullName", label: "Full Name", type: "text", placeholder: "Rajesh Mehta" },
                    { key: "company", label: "Company Name", type: "text", placeholder: "Mehta Freight Solutions" },
                    { key: "email", label: "Email Address", type: "email", placeholder: "rajesh@company.com" },
                    { key: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
                  ].map((f) => (
                    <div key={f.key} className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>{f.label}</label>
                      <input
                        required
                        type={f.type}
                        placeholder={f.placeholder}
                        minLength={f.key === "password" ? 8 : undefined}
                        value={form[f.key as keyof typeof form] as string}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="outline-none bg-transparent pb-2 w-full"
                        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      if (!form.fullName || !form.email || !form.password || form.password.length < 8) {
                        setError("Please fill all fields. Password must be at least 8 characters.");
                        return;
                      }
                      setError("");
                      setStep(2);
                    }}
                    className="w-full py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 mt-2"
                    style={{ background: "#1a1c1c", color: "#fff", cursor: "none" }}
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" {...fadeSlide}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Step 2 of 3</p>
                <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "34px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }} className="mb-2">
                  What describes you?
                </h1>
                <p className="mb-10 text-sm" style={{ color: "#7e7576" }}>
                  Helps us personalise your NavkarOS experience.
                </p>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      value: "business",
                      label: "Logistics Business",
                      desc: "Freight forwarder, CHA, C&F agent, transporter, or logistics service provider",
                    },
                    {
                      value: "client",
                      label: "Importer / Exporter",
                      desc: "Manufacturer, trader, or any business that ships goods internationally or domestically",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm({ ...form, userType: opt.value as "business" | "client" })}
                      className="p-5 text-left border transition-all duration-200 cursor-none"
                      style={{
                        borderColor: form.userType === opt.value ? "#D4AF37" : "rgba(0,0,0,0.12)",
                        borderWidth: "0.5px",
                        background: form.userType === opt.value ? "rgba(212,175,55,0.06)" : "#fff",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: "#1a1c1c" }}>{opt.label}</span>
                        <div
                          className="w-4 h-4 rounded-full border flex items-center justify-center"
                          style={{
                            borderColor: form.userType === opt.value ? "#D4AF37" : "rgba(0,0,0,0.2)",
                            background: form.userType === opt.value ? "#D4AF37" : "transparent",
                          }}
                        >
                          {form.userType === opt.value && (
                            <div className="w-2 h-2 rounded-full" style={{ background: "#fff" }} />
                          )}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: "#7e7576", lineHeight: 1.5 }}>{opt.desc}</p>
                    </button>
                  ))}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none"
                      style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#7e7576" }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (!form.userType) { setError("Please select your type."); return; }
                        setError("");
                        setStep(3);
                      }}
                      className="flex-[2] py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none"
                      style={{ background: "#1a1c1c", color: "#fff" }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" {...fadeSlide}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#D4AF37" }}>Step 3 of 3</p>
                <h1 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "32px", fontWeight: 400, color: "#1a1c1c", letterSpacing: "-0.02em" }} className="mb-2">
                  Which modules interest you?
                </h1>
                <p className="mb-7 text-sm" style={{ color: "#7e7576" }}>
                  Select all that apply — you can change this later.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-8">
                  {MODULE_LIST.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className="p-3 text-left border transition-all duration-200 cursor-none"
                      style={{
                        borderColor: form.modules.includes(mod.id) ? "#D4AF37" : "rgba(0,0,0,0.1)",
                        borderWidth: "0.5px",
                        background: form.modules.includes(mod.id) ? "rgba(212,175,55,0.07)" : "#fff",
                      }}
                    >
                      <p className="text-xs font-bold" style={{ color: "#1a1c1c" }}>{mod.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#7e7576" }}>{mod.tagline}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 text-xs font-semibold uppercase tracking-widest border transition-all duration-200 cursor-none"
                    style={{ borderColor: "rgba(0,0,0,0.15)", borderWidth: "0.5px", color: "#7e7576" }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="flex-[2] py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-none"
                    style={{ background: loading ? "#ccc" : "#1a1c1c", color: "#fff" }}
                  >
                    {loading ? "Creating account…" : "Create Account →"}
                  </button>
                </div>

                <p className="mt-5 text-xs text-center" style={{ color: "#7e7576" }}>
                  By signing up you agree to our{" "}
                  <Link href="#" style={{ color: "#1a1c1c" }}>Terms</Link>
                  {" & "}
                  <Link href="#" style={{ color: "#1a1c1c" }}>Privacy Policy</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
