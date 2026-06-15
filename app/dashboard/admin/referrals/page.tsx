"use client";

import { useEffect, useState } from "react";

interface ReferralCode {
  id: string;
  code: string;
  discountPercent: number;
  description: string | null;
  expiresAt: string;
  usedBy: string | null;
  usedAt: string | null;
  createdAt: string;
}

function timeLeft(expiresAt: string): { label: string; expired: boolean } {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return { label: "Expired", expired: true };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { label: `${h}h ${m}m left`, expired: false };
}

export default function ReferralsPage() {
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [discount, setDiscount] = useState(10);
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/referrals");
    const data = await res.json();
    setCodes(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Refresh timers every minute
  useEffect(() => {
    const t = setInterval(() => setCodes((c) => [...c]), 60_000);
    return () => clearInterval(t);
  }, []);

  const create = async () => {
    setCreating(true);
    const res = await fetch("/api/admin/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountPercent: discount, description }),
    });
    if (res.ok) {
      setDescription("");
      await load();
    }
    setCreating(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/admin/referrals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCodes((c) => c.filter((r) => r.id !== id));
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const active   = codes.filter((c) => !c.usedBy && new Date(c.expiresAt) > new Date());
  const used     = codes.filter((c) => c.usedBy);
  const expired  = codes.filter((c) => !c.usedBy && new Date(c.expiresAt) <= new Date());

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          Referral Codes
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Generate discount codes to share with customers. Each code is valid for 24 hours.
        </p>
      </div>

      {/* Create card */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: "#fff", borderColor: "rgba(0,0,0,0.07)" }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#7e7576" }}>
          Generate New Code
        </h2>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Discount selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b0a8a9" }}>
              Discount %
            </label>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 25, 30, 50].map((v) => (
                <button
                  key={v}
                  onClick={() => setDiscount(v)}
                  className="px-4 py-2 rounded-lg text-sm font-bold border transition-all"
                  style={{
                    background: discount === v ? "#1a1c1c" : "#f9f9f9",
                    color: discount === v ? "#1E40AF" : "#7e7576",
                    borderColor: discount === v ? "#1a1c1c" : "rgba(0,0,0,0.08)",
                  }}
                >
                  {v}%
                </button>
              ))}
              {/* Custom input */}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={![5,10,15,20,25,30,50].includes(discount) ? discount : ""}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(1, Number(e.target.value))))}
                  placeholder="Custom"
                  className="w-20 px-3 py-2 rounded-lg border text-sm font-bold outline-none text-center"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: "#1a1c1c" }}
                />
                <span className="text-sm font-bold" style={{ color: "#7e7576" }}>%</span>
              </div>
            </div>
          </div>

          {/* Optional note */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b0a8a9" }}>
              Note (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. For Rajesh @ ABC Freight"
              className="px-3 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "#1a1c1c" }}
              onKeyDown={(e) => e.key === "Enter" && !creating && create()}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={create}
            disabled={creating}
            className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
            style={{ background: "#1E40AF", color: "#1a1c1c" }}
          >
            {creating ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin inline-block" style={{ borderColor: "rgba(26,28,28,0.3)", borderTopColor: "#1a1c1c" }} />
                Generating…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                Generate Code
              </>
            )}
          </button>
        </div>

        <p className="text-xs mt-4" style={{ color: "#b0a8a9" }}>
          Code expires in 24 hours · One-time use · Valid on any NavkarOS subscription
        </p>
      </div>

      {/* Active codes */}
      {active.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#16a34a" }}>
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Active ({active.length})
          </h3>
          <div className="flex flex-col gap-2">
            {active.map((c) => {
              const { label } = timeLeft(c.expiresAt);
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border"
                  style={{ background: "#fff", borderColor: "rgba(34,197,94,0.2)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                >
                  {/* Code */}
                  <div
                    className="font-mono text-lg font-black tracking-widest px-4 py-2 rounded-lg select-all"
                    style={{ background: "#1a1c1c", color: "#1E40AF", letterSpacing: "0.12em" }}
                  >
                    {c.code}
                  </div>

                  {/* Discount badge */}
                  <div
                    className="px-3 py-1 rounded-full text-sm font-black"
                    style={{ background: "rgba(30,64,175,0.12)", color: "#92660a" }}
                  >
                    {c.discountPercent}% OFF
                  </div>

                  {/* Note */}
                  {c.description && (
                    <p className="text-xs flex-1 truncate" style={{ color: "#7e7576" }}>{c.description}</p>
                  )}
                  {!c.description && <div className="flex-1" />}

                  {/* Timer */}
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#16a34a" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>timer</span>
                    {label}
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => copy(c.code)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
                    style={{
                      background: copied === c.code ? "rgba(34,197,94,0.1)" : "rgba(30,64,175,0.1)",
                      color: copied === c.code ? "#16a34a" : "#92660a",
                      border: `1px solid ${copied === c.code ? "rgba(34,197,94,0.3)" : "rgba(30,64,175,0.3)"}`,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                      {copied === c.code ? "check" : "content_copy"}
                    </span>
                    {copied === c.code ? "Copied!" : "Copy"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => remove(c.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50"
                    style={{ color: "rgba(0,0,0,0.25)" }}
                    title="Delete code"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#1E40AF", borderTopColor: "transparent" }} />
        </div>
      )}

      {/* Empty state */}
      {!loading && codes.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16" style={{ color: "#b0a8a9" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40 }}>confirmation_number</span>
          <p className="text-sm font-semibold">No referral codes yet. Generate one above.</p>
        </div>
      )}

      {/* Used codes */}
      {used.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7e7576" }}>
            Used ({used.length})
          </h3>
          <div className="flex flex-col gap-2">
            {used.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-5 py-3 rounded-xl border opacity-60"
                style={{ background: "#f9f9f9", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <span className="font-mono font-black tracking-widest text-sm" style={{ color: "#4c4546" }}>{c.code}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)", color: "#7e7576" }}>{c.discountPercent}% OFF</span>
                {c.description && <span className="text-xs flex-1 truncate" style={{ color: "#b0a8a9" }}>{c.description}</span>}
                {!c.description && <div className="flex-1" />}
                <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>
                  ✓ Used {c.usedAt ? new Date(c.usedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expired codes */}
      {expired.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#b0a8a9" }}>
            Expired ({expired.length})
          </h3>
          <div className="flex flex-col gap-2">
            {expired.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-5 py-3 rounded-xl border opacity-40"
                style={{ background: "#f9f9f9", borderColor: "rgba(0,0,0,0.06)" }}
              >
                <span className="font-mono font-black tracking-widest text-sm line-through" style={{ color: "#7e7576" }}>{c.code}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)", color: "#7e7576" }}>{c.discountPercent}% OFF</span>
                {c.description && <span className="text-xs flex-1 truncate" style={{ color: "#b0a8a9" }}>{c.description}</span>}
                {!c.description && <div className="flex-1" />}
                <span className="text-xs" style={{ color: "#dc2626" }}>Expired</span>
                <button
                  onClick={() => remove(c.id)}
                  className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 transition-all"
                  style={{ color: "rgba(0,0,0,0.2)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
