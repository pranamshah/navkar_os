"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

function InfoRow({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b last:border-0" style={{ borderColor: "#F3F4F6" }}>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b0a8a9" }}>
        {label}
      </span>
      <span
        className={mono ? "font-mono font-black text-sm" : "text-sm font-semibold"}
        style={{ color: mono ? "#1E40AF" : "#1a1c1c" }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default function ClientProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [copied, setCopied] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  function handleCopyId() {
    if (user?.clientId) {
      navigator.clipboard.writeText(user.clientId).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("Please fill in all fields.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    // Simulate save
    setPwSaved(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setTimeout(() => setPwSaved(false), 4000);
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "#1E40AF", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="p-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Account
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          Profile &amp; Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Your personal details and account security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — Profile summary card */}
        <div className="xl:col-span-1">
          <div
            className="rounded-xl border bg-white overflow-hidden"
            style={{ borderColor: "rgba(0,0,0,0.07)" }}
          >
            {/* Gold accent top */}
            <div
              className="h-2 w-full"
              style={{ background: "linear-gradient(90deg, #1E40AF 0%, #c9a227 100%)" }}
            />
            <div className="p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mb-4"
                style={{
                  background: "rgba(30,64,175,0.12)",
                  color: "#1E40AF",
                  border: "2px solid rgba(30,64,175,0.25)",
                }}
              >
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>

              <p className="font-black text-base mb-0.5" style={{ color: "#1a1c1c" }}>
                {user?.name || "—"}
              </p>
              <p className="text-xs mb-4" style={{ color: "#7e7576" }}>
                {user?.email || "—"}
              </p>

              {/* Client ID box */}
              {user?.clientId && (
                <div
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg mb-2"
                  style={{
                    background: "rgba(30,64,175,0.07)",
                    border: "1px solid rgba(30,64,175,0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#1E40AF" }}>
                      badge
                    </span>
                    <span
                      className="font-mono font-black text-sm truncate"
                      style={{ color: "#1E40AF" }}
                    >
                      {user.clientId}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest flex-shrink-0 transition-opacity hover:opacity-70"
                    style={{ color: copied ? "#16a34a" : "#1E40AF" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {copied ? "check" : "content_copy"}
                    </span>
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}

              {/* Status badge */}
              <span
                className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mt-1"
                style={{
                  background:
                    user?.status === "ACTIVE"
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(30,64,175,0.12)",
                  color: user?.status === "ACTIVE" ? "#16a34a" : "#1E40AF",
                }}
              >
                {user?.status === "ACTIVE" ? "Verified" : user?.status || "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Right — Details + Security */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Personal & Business Info */}
          <div
            className="rounded-xl border bg-white overflow-hidden"
            style={{ borderColor: "rgba(0,0,0,0.07)" }}
          >
            <div
              className="px-6 py-4 border-b flex items-center gap-2"
              style={{ background: "#f9f9fa", borderColor: "#E5E7EB" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#1E40AF" }}>
                person
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
                Personal &amp; Business Info
              </h2>
            </div>
            <div className="px-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div>
                  <InfoRow label="Full Name" value={user?.name} />
                  <InfoRow label="Email Address" value={user?.email} />
                  <InfoRow label="Client ID" value={user?.clientId} mono />
                </div>
                <div>
                  <InfoRow label="Business Name" value={(user as any)?.businessName} />
                  <InfoRow label="Business Type" value={(user as any)?.businessType} />
                  <InfoRow label="Phone" value={(user as any)?.phone} />
                </div>
              </div>
            </div>
          </div>

          {/* Security — Change Password */}
          <div
            className="rounded-xl border bg-white overflow-hidden"
            style={{ borderColor: "rgba(0,0,0,0.07)" }}
          >
            <div
              className="px-6 py-4 border-b flex items-center gap-2"
              style={{ background: "#f9f9fa", borderColor: "#E5E7EB" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#1E40AF" }}>
                lock
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
                Security
              </h2>
            </div>
            <div className="px-6 py-6">
              {pwSaved && (
                <div
                  className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold"
                  style={{
                    background: "rgba(34,197,94,0.08)",
                    color: "#16a34a",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    check_circle
                  </span>
                  Password updated successfully.
                </div>
              )}
              {pwError && (
                <div
                  className="mb-4 px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-semibold"
                  style={{
                    background: "rgba(239,68,68,0.07)",
                    color: "#dc2626",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    error
                  </span>
                  {pwError}
                </div>
              )}

              <form onSubmit={handleSavePassword} className="flex flex-col gap-4 max-w-md">
                {[
                  { label: "Current Password", value: currentPw, setter: setCurrentPw },
                  { label: "New Password", value: newPw, setter: setNewPw },
                  { label: "Confirm New Password", value: confirmPw, setter: setConfirmPw },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label
                      className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                      style={{ color: "#7e7576" }}
                    >
                      {label}
                    </label>
                    <input
                      type="password"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{
                        border: "1px solid #E5E7EB",
                        color: "#1a1c1c",
                        background: "#f9f9fa",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#1E40AF")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90 w-fit px-6"
                  style={{ background: "#1a1c1c", color: "#1E40AF" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    save
                  </span>
                  Save Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
