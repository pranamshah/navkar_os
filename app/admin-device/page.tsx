"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LogoBrand from "@/components/ui/LogoBrand";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function AdminDeviceContent() {
  const params = useSearchParams();
  const from = params.get("from") ?? "/dashboard/admin";

  const [status, setStatus] = useState<"checking" | "pending" | "approved" | "rejected" | "registering">("checking");
  const [deviceToken, setDeviceToken] = useState<string>("");
  const [deviceName, setDeviceName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if a device cookie already exists
    const existing = document.cookie.split(";").find((c) => c.trim().startsWith("navkar_admin_device="));
    if (existing) {
      const token = existing.split("=")[1]?.trim();
      if (token) {
        setDeviceToken(token);
        checkStatus(token);
        return;
      }
    }
    // No cookie → show registration form
    setStatus("registering");
  }, []);

  const checkStatus = async (token: string) => {
    setStatus("checking");

    // Try to self-approve via PATCH — succeeds silently if user is admin, 403 if not
    await fetch("/api/admin/devices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, status: "APPROVED" }),
    }).catch(() => {});

    // Now check actual status
    const res = await fetch(`/api/admin/devices?token=${token}`);
    if (!res.ok) { setStatus("registering"); return; }
    const data = await res.json();
    if (!data) { setStatus("registering"); return; }
    if (data.status === "APPROVED") {
      setStatus("approved");
      setTimeout(() => { window.location.href = from; }, 800);
    } else if (data.status === "REJECTED") {
      setStatus("rejected");
    } else {
      setStatus("pending");
    }
  };

  const register = async () => {
    setError("");
    if (!deviceName.trim()) { setError("Please enter a name for this device"); return; }
    const token = uuid();
    const res = await fetch("/api/admin/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name: deviceName }),
    });
    if (!res.ok) { setError("Registration failed. Try again."); return; }
    const data = await res.json();
    // Set cookie (1 year)
    document.cookie = `navkar_admin_device=${token}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Strict`;
    setDeviceToken(token);
    // If server auto-approved (admin session), go straight in
    if (data.status === "APPROVED") {
      setStatus("approved");
      setTimeout(() => { window.location.href = from; }, 800);
    } else {
      setStatus("pending");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "#fafafa" }}>
      <div className="mb-10"><LogoBrand height={100} href="/" /></div>
      <div className="max-w-md w-full p-10 shadow-sm" style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>

        {status === "checking" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(0,0,0,0.1)", borderTopColor: "#D4AF37" }} />
            <p className="text-sm" style={{ color: "#7e7576" }}>Checking device status…</p>
          </div>
        )}

        {status === "registering" && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>New Device</p>
            <h1 className="mb-2" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "28px", color: "#1a1c1c", fontWeight: 400 }}>
              Register this device
            </h1>
            <p className="text-sm mb-8" style={{ color: "#7e7576", lineHeight: 1.7 }}>
              Admin access is restricted to approved devices. Register this device and wait for the super-admin to approve it.
            </p>
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
            <div className="flex flex-col gap-2 mb-6">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>Device Name</label>
              <input
                type="text"
                placeholder="e.g. Pranam's MacBook Pro"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="outline-none bg-transparent pb-2 w-full"
                style={{ borderBottom: "0.5px solid rgba(0,0,0,0.2)", color: "#1a1c1c", fontSize: "15px" }}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#D4AF37")}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(0,0,0,0.2)")}
                onKeyDown={(e) => e.key === "Enter" && register()}
              />
            </div>
            <button
              onClick={register}
              className="w-full py-4 text-xs font-semibold uppercase tracking-widest"
              style={{ background: "#1a1c1c", color: "#fff" }}
            >
              Register Device →
            </button>
          </>
        )}

        {status === "pending" && (
          <div className="flex flex-col items-center text-center gap-5 py-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#D4AF37" }}>hourglass_top</span>
            </div>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "26px", color: "#1a1c1c", fontWeight: 400 }}>
              Awaiting Approval
            </h2>
            <p className="text-sm" style={{ color: "#7e7576", lineHeight: 1.7 }}>
              Your device has been registered. Ask the super-admin to approve it from the <strong>Admin → Devices</strong> page.
            </p>
            <button
              onClick={() => checkStatus(deviceToken)}
              className="text-xs px-4 py-2 font-semibold uppercase tracking-widest"
              style={{ background: "rgba(212,175,55,0.1)", color: "#92660a", border: "0.5px solid rgba(212,175,55,0.3)" }}
            >
              Refresh Status
            </button>
            <p className="text-xs mt-2" style={{ color: "#b0a8a9" }}>
              Device token: <span className="font-mono">{deviceToken.slice(0, 8)}…</span>
            </p>
          </div>
        )}

        {status === "approved" && (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#16a34a" }}>verified</span>
            </div>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "26px", color: "#1a1c1c", fontWeight: 400 }}>Device Approved</h2>
            <p className="text-sm" style={{ color: "#7e7576" }}>Redirecting to admin dashboard…</p>
          </div>
        )}

        {status === "rejected" && (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#dc2626" }}>block</span>
            </div>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: "26px", color: "#1a1c1c", fontWeight: 400 }}>Access Denied</h2>
            <p className="text-sm" style={{ color: "#7e7576" }}>This device has been rejected. Contact the super-admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDevicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fafafa" }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(0,0,0,0.1)", borderTopColor: "#D4AF37" }} />
      </div>
    }>
      <AdminDeviceContent />
    </Suspense>
  );
}
