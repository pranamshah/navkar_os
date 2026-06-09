"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoBrand from "@/components/ui/LogoBrand";
import { motion } from "framer-motion";
import { Check, Copy, CheckCircle, Clock, FileText, Phone, MessageCircle, Mail } from "lucide-react";

interface UserStatus {
  status: string;
  clientId: string;
  name: string;
  businessName?: string;
  businessType?: string;
  email: string;
  phone?: string;
  createdAt: string;
  gstCertPath?: string;
  panCopyPath?: string;
  licenceCopyPath?: string;
}

function StatusStep({ done, active, label, sub }: { done: boolean; active: boolean; label: string; sub: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: done ? "#D4AF37" : active ? "rgba(212,175,55,0.15)" : "rgba(0,0,0,0.06)",
            border: active ? "1px solid rgba(212,175,55,0.4)" : "none",
          }}
        >
          {done ? (
            <Check size={14} style={{ color: "#1a1c1c" }} />
          ) : active ? (
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#D4AF37" }} />
          ) : (
            <div className="w-2 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.2)" }} />
          )}
        </div>
        <div className="flex-1 w-px my-1" style={{ background: "rgba(0,0,0,0.08)", minHeight: "24px" }} />
      </div>
      <div className="pb-6 pt-1">
        <p className="text-sm font-semibold" style={{ color: done || active ? "#1a1c1c" : "#7e7576" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#7e7576" }}>{sub}</p>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const { data: session, status: sessionStatus, update } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/user/status");
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        if (data.status === "ACTIVE") {
          // Go directly to /dashboard/client — skips dashboard/page.tsx entirely
          // so there is NO extra server redirect that could loop back to /status.
          // Fire update() in background to refresh the JWT, but never await it.
          update().catch(() => {});
          window.location.replace("/dashboard/client");
          return; // stop — navigating away
        }
      } else if (res.status === 401) {
        // Session expired / signed out — let the sessionStatus effect handle redirect
        return;
      }
    } catch {
      // Network error — silently ignore, will retry on next poll
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === "unauthenticated") { router.replace("/login"); return; }
    if (sessionStatus === "authenticated") {
      // Admins/superadmins skip the status screen and go straight to the admin panel
      const role = (session?.user as { role?: string } | undefined)?.role;
      if (role === "SUPERADMIN" || role === "ADMIN") {
        router.replace("/dashboard/admin");
        return;
      }
      fetchStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  // Poll every 60 seconds — only when authenticated
  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  // If ACTIVE status is detected, go directly to /dashboard/client
  useEffect(() => {
    if (userData?.status === "ACTIVE") {
      update().catch(() => {});
      window.location.replace("/dashboard/client");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.status]);

  const copyClientId = () => {
    if (!userData?.clientId) return;
    navigator.clipboard.writeText(userData.clientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const docCount = [userData?.gstCertPath, userData?.panCopyPath, userData?.licenceCopyPath].filter(Boolean).length;

  // Show spinner while session is loading OR while we're fetching user status.
  // Also show it while unauthenticated (redirect to /login is in flight).
  if (loading || sessionStatus === "loading" || sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa" }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (userData?.status === "ACTIVE") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(16,185,129,0.1)" }}>
            <CheckCircle size={32} style={{ color: "#10B981" }} />
          </div>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "32px", color: "#1a1c1c" }}>Account Activated!</h2>
          <p className="mt-2 text-sm" style={{ color: "#7e7576" }}>Redirecting to your dashboard…</p>
          <a
            href="/dashboard/client"
            className="inline-block mt-6 px-6 py-3 text-sm font-semibold rounded-lg"
            style={{ background: "#1a1c1c", color: "#D4AF37" }}
          >
            Go to Dashboard →
          </a>
        </motion.div>
      </div>
    );
  }

  if (userData?.status === "REJECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "#fafafa" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(239,68,68,0.1)" }}>
            <span style={{ fontSize: "24px" }}>✗</span>
          </div>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "28px", color: "#1a1c1c" }}>Application Not Approved</h2>
          <p className="mt-3 text-sm" style={{ color: "#7e7576" }}>
            Your account was not approved. Please contact{" "}
            <a href="mailto:support@navkaros.com" style={{ color: "#D4AF37" }}>support@navkaros.com</a>{" "}
            for assistance.
          </p>
          <Link href="/" className="inline-block mt-8 text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6" style={{ background: "#fafafa" }}>
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <LogoBrand height={120} />
        </div>

        {/* Status card */}
        <div className="p-8 mb-6" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(212,175,55,0.12)" }}>
              <Clock size={18} style={{ color: "#D4AF37" }} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>Status</p>
              <p className="font-semibold text-sm" style={{ color: "#1a1c1c" }}>Account Under Verification</p>
            </div>
          </div>

          {/* Client ID */}
          <div className="p-4 mb-5" style={{ background: "#f9f9f9", border: "0.5px solid rgba(0,0,0,0.08)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#7e7576" }}>Your Client ID</p>
            <div className="flex items-center justify-between gap-3">
              <span style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: 900, color: "#1a1c1c", letterSpacing: "0.06em" }}>
                {userData?.clientId ?? session?.user?.clientId ?? "—"}
              </span>
              <button
                onClick={copyClientId}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                style={{ color: copied ? "#10B981" : "#D4AF37" }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: "#7e7576" }}>Save this — you can use it to log in at any time</p>
          </div>

          {/* Business info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Business", val: userData?.businessName },
              { label: "Type", val: userData?.businessType?.replace("_", " ") },
              { label: "Email", val: userData?.email },
              { label: "Submitted", val: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
            ].map((row) => (
              <div key={row.label}>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#7e7576" }}>{row.label}</p>
                <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: "#1a1c1c" }}>{row.val ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline — live status based on actual data ── */}
        {(() => {
          const onboardingDone = !!userData?.businessName;
          const docsDone       = docCount > 0;
          // step states
          const step1done  = true;               // always done if they're on this page
          const step2done  = onboardingDone;
          const step2active = !onboardingDone;
          const step3done  = onboardingDone && docsDone;
          const step3active = onboardingDone && !docsDone;
          const step4active = step3done;         // under review
          return (
            <div className="p-8 mb-6" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7e7576" }}>Application Progress</h3>

              <StatusStep
                done={step1done}
                active={false}
                label="Account Created"
                sub={userData?.createdAt ? new Date(userData.createdAt).toLocaleString("en-IN") : "Just now"}
              />
              <StatusStep
                done={step2done}
                active={step2active}
                label="Business Details Submitted"
                sub={step2done ? `${userData?.businessName} · ${userData?.businessType?.replace(/_/g, " ") ?? ""}` : "Complete your business profile below"}
              />
              <StatusStep
                done={step3done}
                active={step3active}
                label="Documents Uploaded"
                sub={step3done ? `${docCount} document${docCount !== 1 ? "s" : ""} received` : step3active ? "Please upload GST certificate and PAN copy" : "Waiting for step above"}
              />
              <StatusStep
                done={false}
                active={step4active}
                label="Under Verification"
                sub={step4active ? "Our team is reviewing your documents. Usually 24–48 business hours." : "Complete the steps above to begin verification"}
              />
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.15)" }} />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold" style={{ color: "#7e7576" }}>Account Activated</p>
                  <p className="text-xs mt-0.5" style={{ color: "#7e7576" }}>
                    You will receive a WhatsApp message and email once approved
                  </p>
                </div>
              </div>

              {/* CTA if onboarding not complete */}
              {!onboardingDone && (
                <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                  <Link
                    href="/onboarding"
                    className="flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                    style={{ background: "#D4AF37", color: "#1a1c1c" }}
                  >
                    Complete Business Profile →
                  </Link>
                  <p className="text-xs text-center mt-2" style={{ color: "#7e7576" }}>Takes about 5 minutes</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Important notice */}
        <div
          className="p-5 mb-6 flex gap-3"
          style={{ background: "rgba(212,175,55,0.07)", border: "0.5px solid rgba(212,175,55,0.3)" }}
        >
          <FileText size={16} style={{ color: "#D4AF37", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#D4AF37" }}>Save Your Client ID</p>
            <p className="text-sm" style={{ color: "#4c4546", lineHeight: 1.6 }}>
              <strong style={{ fontFamily: "monospace" }}>{userData?.clientId ?? session?.user?.clientId}</strong> — Screenshot this page or write it down. You can use this to log in at any time.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="p-8 mb-8" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>Have questions? Reach us directly</p>
          <div className="flex flex-col gap-3">
            <a
              href="tel:+91-XXXXXXXXXX"
              className="flex items-center gap-3 py-3 px-4 border transition-all duration-200"
              style={{ borderColor: "rgba(0,0,0,0.1)", borderWidth: "0.5px", color: "#1a1c1c" }}
            >
              <Phone size={14} style={{ color: "#D4AF37" }} />
              <span className="text-sm font-semibold">Call Us: +91-XXXXXXXXXX</span>
            </a>
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 px-4 border transition-all duration-200"
              style={{ borderColor: "rgba(0,0,0,0.1)", borderWidth: "0.5px", color: "#1a1c1c" }}
            >
              <MessageCircle size={14} style={{ color: "#25D366" }} />
              <span className="text-sm font-semibold">WhatsApp Us</span>
            </a>
            <a
              href="mailto:support@navkaros.com"
              className="flex items-center gap-3 py-3 px-4 border transition-all duration-200"
              style={{ borderColor: "rgba(0,0,0,0.1)", borderWidth: "0.5px", color: "#1a1c1c" }}
            >
              <Mail size={14} style={{ color: "#D4AF37" }} />
              <span className="text-sm font-semibold">support@navkaros.com</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
            ← Back to Homepage
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#7e7576" }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
