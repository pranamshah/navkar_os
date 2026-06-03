"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Types ─────────────────────────────────────────── */
interface Subscription {
  id: string;
  product: string;
  plan: string;
  status: string;
  billingCycle: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
}

/* ── Product Catalogue ─────────────────────────────── */
const PRODUCTS = [
  {
    id: "nexlog",
    name: "Nexlog",
    tagline: "Freight Forwarding",
    icon: "navigation",
    color: "#1565C0",
    desc: "End-to-end job management for C&F agents and freight forwarders — booking, BL, tracking, and GST invoicing.",
    demoHref: "/dashboard/nexlog/demo",
    appHref: "/dashboard/nexlog",
  },
  {
    id: "entryx",
    name: "EntryX",
    tagline: "Customs Clearance",
    icon: "gavel",
    color: "#5B21B6",
    desc: "AI-powered Bill of Entry preparation, ICEGATE filing, live duty calculation for licensed CHAs.",
    demoHref: "/dashboard/entryx/demo",
    appHref: "/dashboard/entryx",
  },
  {
    id: "dockiq",
    name: "DockIQ",
    tagline: "CFS & Warehouse",
    icon: "warehouse",
    color: "#0D7057",
    desc: "Complete CFS station management — gate-in/out, yard planning, storage slab billing, importer alerts.",
    demoHref: "/dashboard/dockiq/demo",
    appHref: "/dashboard/dockiq",
  },
  {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transport & Fleet",
    icon: "local_shipping",
    color: "#92400E",
    desc: "LR generation, trip management, GPS tracking via driver app, vehicle compliance, GST freight invoicing.",
    demoHref: "/dashboard/rundesk/demo",
    appHref: "/dashboard/rundesk",
  },
  {
    id: "accura",
    name: "Accura",
    tagline: "Freight Accounting",
    icon: "account_balance_wallet",
    color: "#1A237E",
    desc: "Auto-posts income from every product. GSTR-1 & GSTR-3B ready, P&L in 3 seconds, Tally XML export.",
    demoHref: "/dashboard/accura/demo",
    appHref: "/dashboard/accura",
  },
  {
    id: "tradepilot",
    name: "TradePilot",
    tagline: "Importers & Exporters",
    icon: "public",
    color: "#004D40",
    desc: "Landed cost calculator, HSN Scout, FTA checker, RoDTEP tracker, document vault, shipment register.",
    demoHref: "/dashboard/tradepilot/demo",
    appHref: "/dashboard/tradepilot",
  },
] as const;

const NAV = [
  { href: "/dashboard/client", label: "Home", icon: "dashboard" },
  { href: "/dashboard/pricing", label: "Plans & Billing", icon: "receipt_long" },
  { href: "/dashboard/client/tickets", label: "Support", icon: "support_agent" },
  { href: "/dashboard/client/profile", label: "Profile", icon: "manage_accounts" },
];

/* ── Sidebar ───────────────────────────────────────── */
function ClientSidebar({
  name, email, clientId, subscriptions,
}: {
  name?: string; email?: string; clientId?: string; subscriptions: Subscription[];
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard/client" ? pathname === href : pathname.startsWith(href);

  const activeSubs = subscriptions.filter((s) => ["ACTIVE", "TRIAL"].includes(s.status));

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col min-h-screen border-r"
      style={{ background: "#1a1c1c", borderColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: "#D4AF37", color: "#1a1c1c" }}
          >
            N
          </div>
          <span className="font-black text-sm uppercase tracking-widest" style={{ color: "#ffffff" }}>
            NavkarOS
          </span>
        </Link>
      </div>

      {/* User card */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
            style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.25)" }}
          >
            {(name || email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>{name || "Client"}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{email}</p>
          </div>
        </div>
        {clientId && (
          <div
            className="flex items-center gap-1.5 px-2 py-1.5 rounded"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 12, color: "#D4AF37" }}>badge</span>
            <span className="font-mono text-xs font-semibold" style={{ color: "#D4AF37" }}>{clientId}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold uppercase tracking-widest transition-all duration-200"
              style={{
                color: active ? "#1a1c1c" : "rgba(255,255,255,0.45)",
                background: active ? "#D4AF37" : "transparent",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 15, color: active ? "#1a1c1c" : "rgba(212,175,55,0.5)" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Active subscriptions */}
      {activeSubs.length > 0 && (
        <div className="px-3 pb-3">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
            Active
          </p>
          {activeSubs.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 px-3 py-2 rounded mb-0.5"
              style={{ background: "rgba(212,175,55,0.05)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                {s.product}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-all"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ── Demo Modal ────────────────────────────────────── */
function DemoModal({ product, onClose }: {
  product: typeof PRODUCTS[number]; onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="fixed z-50 rounded-2xl border overflow-hidden"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(480px, 92vw)",
          background: "#ffffff",
          borderColor: "rgba(0,0,0,0.08)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* Modal top bar */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: "#1a1c1c" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${product.color}20`, border: `1px solid ${product.color}40` }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: product.color }}>
                {product.icon}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
                {product.tagline}
              </p>
              <p className="font-black text-base" style={{ color: "#ffffff" }}>{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)", color: "#ffffff" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm mb-5" style={{ color: "#4c4546", lineHeight: 1.6 }}>
            {product.desc}
          </p>

          <div
            className="p-4 rounded-xl mb-5 border"
            style={{ background: "rgba(212,175,55,0.04)", borderColor: "rgba(212,175,55,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#D4AF37" }}>lock</span>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
                Subscription Required
              </p>
            </div>
            <p className="text-xs" style={{ color: "#7e7576" }}>
              Subscribe to <strong>{product.name}</strong> to unlock full access. Explore pricing to find a plan that fits your workflow.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/pricing"
              className="flex-1 py-3 rounded-lg text-center text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
              style={{ background: "#1a1c1c", color: "#D4AF37" }}
              onClick={onClose}
            >
              View Pricing
            </Link>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest"
              style={{ background: "rgba(0,0,0,0.05)", color: "#7e7576" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Product Card ──────────────────────────────────── */
function ProductCard({
  product, subscription, onDemoClick,
}: {
  product: typeof PRODUCTS[number];
  subscription?: Subscription;
  onDemoClick: () => void;
}) {
  const unlocked = !!subscription;
  const isActive = subscription?.status === "ACTIVE";
  const isTrial = subscription?.status === "TRIAL";

  return (
    <div
      className="rounded-xl border flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{
        background: "#ffffff",
        borderColor: unlocked ? `${product.color}30` : "rgba(0,0,0,0.07)",
        boxShadow: unlocked ? `0 0 0 1px ${product.color}15` : "none",
      }}
    >
      {/* Card header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: unlocked ? `${product.color}08` : "#f9f9f9",
          borderBottom: "1px solid",
          borderColor: unlocked ? `${product.color}15` : "rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: unlocked ? `${product.color}18` : "rgba(0,0,0,0.06)",
              border: `1px solid ${unlocked ? product.color + "30" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: unlocked ? product.color : "#b0a8a9" }}
            >
              {product.icon}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
              {product.tagline}
            </p>
            <p className="font-black text-sm" style={{ color: unlocked ? "#1a1c1c" : "#7e7576" }}>
              {product.name}
            </p>
          </div>
        </div>
        {unlocked ? (
          <span
            className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded"
            style={{
              background: isActive ? "rgba(34,197,94,0.1)" : "rgba(212,175,55,0.12)",
              color: isActive ? "#16a34a" : "#D4AF37",
            }}
          >
            {isTrial ? "Trial" : "Active"}
          </span>
        ) : (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 18, color: "#d0cbcc" }}
          >
            lock
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="px-5 py-4 flex-1 flex flex-col">
        <p className="text-xs mb-4 flex-1" style={{ color: "#7e7576", lineHeight: 1.65 }}>
          {product.desc}
        </p>

        {unlocked && subscription ? (
          <div className="flex flex-col gap-3">
            {subscription.currentPeriodEnd && (
              <p className="text-xs" style={{ color: "#b0a8a9" }}>
                Renews:{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </p>
            )}
            <Link
              href={product.appHref}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
              style={{ background: "#1a1c1c", color: "#D4AF37" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              Open {product.name}
            </Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/dashboard/pricing"
              className="flex-1 py-2.5 rounded-lg text-center text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
              style={{ background: "#1a1c1c", color: "#D4AF37" }}
            >
              Subscribe
            </Link>
            <button
              onClick={onDemoClick}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all hover:bg-[rgba(0,0,0,0.07)]"
              style={{ background: "rgba(0,0,0,0.04)", color: "#7e7576" }}
            >
              Learn More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [demoProduct, setDemoProduct] = useState<typeof PRODUCTS[number] | null>(null);

  useEffect(() => {
    async function loadSubs() {
      try {
        const res = await fetch("/api/client/subscriptions");
        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data.subscriptions || []);
        }
      } catch {
        // no subs yet
      } finally {
        setSubsLoading(false);
      }
    }
    if (status === "authenticated") loadSubs();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const user = session?.user;
  const activeCount = subscriptions.filter((s) => ["ACTIVE", "TRIAL"].includes(s.status)).length;

  const getSubForProduct = (productId: string) =>
    subscriptions.find((s) => s.product.toLowerCase() === productId && ["ACTIVE", "TRIAL"].includes(s.status));

  return (
    <div className="flex min-h-screen" style={{ background: "#f9f9f9" }}>
      <ClientSidebar
        name={user?.name ?? undefined}
        email={user?.email ?? undefined}
        clientId={user?.clientId ?? undefined}
        subscriptions={subscriptions}
      />

      <main className="flex-1 overflow-auto p-8">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
            Welcome back
          </p>
          <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
            {user?.name || "Client Dashboard"}
          </h1>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div
            className="rounded-xl p-4 border"
            style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>Client ID</p>
            <p className="font-mono font-black text-base" style={{ color: "#D4AF37" }}>
              {user?.clientId || "—"}
            </p>
          </div>
          <div
            className="rounded-xl p-4 border"
            style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>Account Status</p>
            <p
              className="font-black text-sm uppercase tracking-widest"
              style={{ color: user?.status === "ACTIVE" ? "#16a34a" : "#D4AF37" }}
            >
              {user?.status === "ACTIVE" ? "Verified" : user?.status || "—"}
            </p>
          </div>
          <div
            className="rounded-xl p-4 border"
            style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>Active Products</p>
            {subsLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#D4AF37", borderTopColor: "transparent" }} />
            ) : (
              <p className="font-black text-base" style={{ color: "#1a1c1c" }}>
                {activeCount} / {PRODUCTS.length}
              </p>
            )}
          </div>
        </div>

        {/* Products grid header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
            Your Products
          </h2>
          {activeCount === 0 && (
            <Link
              href="/dashboard/pricing"
              className="text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
              style={{ color: "#D4AF37" }}
            >
              Explore Plans →
            </Link>
          )}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              subscription={getSubForProduct(product.id)}
              onDemoClick={() => setDemoProduct(product)}
            />
          ))}
        </div>

        {/* Upgrade CTA for users with no subs */}
        {!subsLoading && activeCount === 0 && (
          <div
            className="mt-8 rounded-2xl p-8 border flex items-center justify-between"
            style={{ background: "#1a1c1c", borderColor: "rgba(212,175,55,0.2)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>
                Get Started
              </p>
              <p className="text-xl font-black" style={{ color: "#ffffff" }}>
                Choose a plan that fits your workflow
              </p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                Subscribe to individual products or save more with bundle plans for your business type.
              </p>
            </div>
            <Link
              href="/dashboard/pricing"
              className="flex-shrink-0 ml-8 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
              style={{ background: "#D4AF37", color: "#1a1c1c" }}
            >
              View Pricing →
            </Link>
          </div>
        )}
      </main>

      {/* Demo modal */}
      {demoProduct && (
        <DemoModal product={demoProduct} onClose={() => setDemoProduct(null)} />
      )}
    </div>
  );
}
