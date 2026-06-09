"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LogoBrand from "@/components/ui/LogoBrand";

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
    demoHref: "/demo/nexlog",
    appHref: "/dashboard/nexlog",
    features: ["Job management", "BL/AWB AI reading", "GST invoicing", "Client portal", "WhatsApp alerts", "DO generation"],
  },
  {
    id: "entryx",
    name: "EntryX",
    tagline: "Customs Clearance",
    icon: "gavel",
    color: "#5B21B6",
    desc: "AI-powered Bill of Entry preparation, ICEGATE filing, live duty calculation for licensed CHAs.",
    demoHref: "/demo/entryx",
    appHref: "/dashboard/entryx",
    features: ["AI BE preparation", "ICEGATE filing", "Duty calculator", "HS code lookup", "OOC alerts", "DGFT integration"],
  },
  {
    id: "dockiq",
    name: "DockIQ",
    tagline: "CFS & Warehouse",
    icon: "warehouse",
    color: "#0D7057",
    desc: "Complete CFS station management — gate-in/out, yard planning, storage slab billing, importer alerts.",
    demoHref: "/demo/dockiq",
    appHref: "/dashboard/dockiq",
    features: ["Gate-in/out tracking", "Yard planning", "Storage billing", "CFS invoicing", "Importer portal", "MIS reports"],
  },
  {
    id: "rundesk",
    name: "RunDesk",
    tagline: "Transport & Fleet",
    icon: "local_shipping",
    color: "#92400E",
    desc: "LR generation, trip management, GPS tracking via driver app, vehicle compliance, GST freight invoicing.",
    demoHref: "/demo/rundesk",
    appHref: "/dashboard/rundesk",
    features: ["LR generation", "Trip management", "GPS tracking", "Vehicle compliance", "GST invoicing", "Fleet reports"],
  },
  {
    id: "accura",
    name: "Accura",
    tagline: "Freight Accounting",
    icon: "account_balance_wallet",
    color: "#1A237E",
    desc: "Auto-posts income from every product. GSTR-1 & GSTR-3B ready, P&L in 3 seconds, Tally XML export.",
    demoHref: "/demo/accura",
    appHref: "/dashboard/accura",
    features: ["Auto income posting", "GSTR-1 & 3B export", "P&L dashboard", "Tally XML", "Job profitability", "Bank reconciliation"],
  },
  {
    id: "tradepilot",
    name: "TradePilot",
    tagline: "Importers & Exporters",
    icon: "public",
    color: "#004D40",
    desc: "Landed cost calculator, HSN Scout, FTA checker, RoDTEP tracker, document vault, shipment register.",
    demoHref: "/demo/tradepilot",
    appHref: "/dashboard/tradepilot",
    features: ["Landed cost calc", "HSN Scout", "FTA checker", "RoDTEP tracker", "Document vault", "Shipment register"],
  },
] as const;

type Product = typeof PRODUCTS[number];

const NAV = [
  { href: "/dashboard/client", label: "Home", icon: "dashboard" },
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
      {/* Logo — clicking goes back to homepage */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <LogoBrand height={120} onDark href="/" />
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

/* ── Active Product Card ──────────────────────────── */
function ActiveProductCard({ product, subscription }: { product: Product; subscription: Subscription }) {
  const isActive = subscription.status === "ACTIVE";
  return (
    <div
      className="rounded-xl border flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg"
      style={{
        background: "#ffffff",
        borderColor: `${product.color}30`,
        boxShadow: `0 0 0 1px ${product.color}10`,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: `${product.color}08`,
          borderBottom: `1px solid ${product.color}15`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${product.color}18`, border: `1px solid ${product.color}30` }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: product.color }}>
              {product.icon}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
              {product.tagline}
            </p>
            <p className="font-black text-sm" style={{ color: "#1a1c1c" }}>{product.name}</p>
          </div>
        </div>
        <span
          className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{
            background: isActive ? "rgba(34,197,94,0.1)" : "rgba(212,175,55,0.12)",
            color: isActive ? "#16a34a" : "#D4AF37",
          }}
        >
          {subscription.status === "TRIAL" ? "Trial" : "Active"}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 flex flex-col">
        <p className="text-xs mb-3 flex-1" style={{ color: "#7e7576", lineHeight: 1.65 }}>{product.desc}</p>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.features.slice(0, 4).map((f) => (
            <span
              key={f}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${product.color}08`, color: product.color, border: `0.5px solid ${product.color}20` }}
            >
              {f}
            </span>
          ))}
        </div>

        {subscription.currentPeriodEnd && (
          <p className="text-xs mb-3" style={{ color: "#b0a8a9" }}>
            Renews:{" "}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </p>
        )}
        <Link
          href={product.appHref}
          className="flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
          style={{ background: "#1a1c1c", color: "#D4AF37" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
          Open {product.name}
        </Link>
      </div>
    </div>
  );
}

/* ── Explore Product Card (for pending/no-sub users) */
function ExploreProductCard({ product }: { product: Product }) {
  return (
    <div
      className="rounded-xl border flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "#f9f9f9", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${product.color}12`, border: `1px solid ${product.color}20` }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: product.color }}>
              {product.icon}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>{product.tagline}</p>
            <p className="font-black text-sm" style={{ color: "#1a1c1c" }}>{product.name}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 flex flex-col">
        <p className="text-xs mb-4 flex-1" style={{ color: "#7e7576", lineHeight: 1.65 }}>{product.desc}</p>
        <div className="flex gap-2">
          <Link
            href="/dashboard/pricing"
            className="flex-1 py-2.5 rounded-lg text-center text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
            style={{ background: "#1a1c1c", color: "#D4AF37" }}
          >
            Get Started
          </Link>
          <Link
            href={product.demoHref}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
            style={{ background: "rgba(0,0,0,0.04)", color: "#7e7576" }}
          >
            Demo
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Pending / Under Review View ─────────────────── */
function PendingView({ name, clientId, products }: { name?: string; clientId?: string; products: typeof PRODUCTS }) {
  return (
    <main className="flex-1 overflow-auto p-8">
      {/* Status banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl border flex items-start gap-4"
        style={{ background: "rgba(212,175,55,0.05)", borderColor: "rgba(212,175,55,0.3)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(212,175,55,0.12)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#D4AF37" }}>schedule</span>
        </div>
        <div className="flex-1">
          <p className="font-black text-base mb-1" style={{ color: "#1a1c1c" }}>
            Account Under Review
          </p>
          <p className="text-sm" style={{ color: "#4c4546", lineHeight: 1.6 }}>
            We&apos;re verifying your documents — this usually takes <strong>24–48 business hours</strong>. You&apos;ll receive a WhatsApp message and email once your account is activated.
          </p>
          {clientId && (
            <p className="text-xs mt-2" style={{ color: "#7e7576" }}>
              Your Client ID: <span className="font-mono font-black" style={{ color: "#D4AF37" }}>{clientId}</span> — keep this safe, you can always log in with it.
            </p>
          )}
        </div>
        <Link
          href="/status"
          className="flex-shrink-0 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-all"
          style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}
        >
          View Status
        </Link>
      </motion.div>

      {/* Welcome */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Hello, {name || "there"}
        </p>
        <h1 className="text-xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          Explore NavkarOS Products
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          While your account is being verified, browse our suite and pick the products you need.
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <ExploreProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}

/* ── Active / No-Subs View ────────────────────────── */
function ActiveNoSubsView({ name, products }: { name?: string; products: typeof PRODUCTS }) {
  return (
    <main className="flex-1 overflow-auto p-8">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Welcome back
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          {name || "Your Dashboard"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Your account is verified. Choose a product to get started.
        </p>
      </div>

      {/* Subtle CTA */}
      <div
        className="mb-8 p-6 rounded-2xl border flex items-center justify-between gap-6"
        style={{ background: "#1a1c1c", borderColor: "rgba(212,175,55,0.15)" }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Get Started</p>
          <p className="font-black text-base" style={{ color: "#fff" }}>Choose a plan that fits your workflow</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Individual products or bundle plans — all at free beta pricing</p>
        </div>
        <Link
          href="/dashboard/pricing"
          className="flex-shrink-0 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all hover:opacity-90"
          style={{ background: "#D4AF37", color: "#1a1c1c" }}
        >
          View Plans →
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
          Available Products
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <ExploreProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}

/* ── Active + Has Subs View ───────────────────────── */
function ActiveWithSubsView({
  name, products, subscriptions,
}: { name?: string; products: typeof PRODUCTS; subscriptions: Subscription[] }) {
  const getSubForProduct = (productId: string) =>
    subscriptions.find((s) => s.product.toLowerCase() === productId && ["ACTIVE", "TRIAL"].includes(s.status));

  const myProducts = products.filter((p) => !!getSubForProduct(p.id));

  return (
    <main className="flex-1 overflow-auto p-8">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>
          Welcome back
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          {name || "Your Dashboard"}
        </h1>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div
          className="rounded-xl p-4 border"
          style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>Active Products</p>
          <p className="font-black text-2xl" style={{ color: "#1a1c1c" }}>{myProducts.length}</p>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>Account Status</p>
          <p className="font-black text-sm uppercase tracking-widest" style={{ color: "#16a34a" }}>Verified</p>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>Billing</p>
          <Link href="/dashboard/pricing" className="font-black text-sm" style={{ color: "#D4AF37" }}>
            Manage →
          </Link>
        </div>
      </div>

      {/* My products header */}
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>
          Your Products
        </h2>
      </div>

      {/* Only show subscribed products */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myProducts.map((product, i) => {
          const sub = getSubForProduct(product.id)!;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <ActiveProductCard product={product} subscription={sub} />
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}

/* ── Admin View ────────────────────────────────────── */
function AdminView({ name, products }: { name?: string; products: typeof PRODUCTS }) {
  const mockSub: Subscription = {
    id: "admin",
    product: "",
    plan: "FULL_SUITE",
    status: "ACTIVE",
    billingCycle: "ANNUAL",
    currentPeriodEnd: "",
  };
  return (
    <main className="flex-1 overflow-auto p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#D4AF37" }}>
          Admin Access
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: "#1a1c1c" }}>
          {name || "NavkarOS Admin"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#7e7576" }}>
          Full access to all 6 products — no subscription required.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Products", value: "6" },
          { label: "Access Level", value: "Full" },
          { label: "Status", value: "Admin" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 border" style={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7e7576" }}>{s.label}</p>
            <p className="font-black text-2xl" style={{ color: "#1a1c1c" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7e7576" }}>All Products</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <ActiveProductCard product={product} subscription={{ ...mockSub, product: product.id.toUpperCase() }} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);
  // Read status directly from DB (not stale JWT) to avoid PendingView loop after admin approval
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  useEffect(() => {
    if (status !== "authenticated") return;
    if (isAdmin) { setSubsLoading(false); setDbStatus("ACTIVE"); return; }

    async function loadData() {
      try {
        // Fetch status + subscriptions in parallel
        const [statusRes, subsRes] = await Promise.allSettled([
          fetch("/api/user/status"),
          fetch("/api/client/subscriptions"),
        ]);
        if (statusRes.status === "fulfilled" && statusRes.value.ok) {
          const d = await statusRes.value.json();
          setDbStatus(d.status);
        } else {
          // Fall back to JWT status so we never get stuck loading
          setDbStatus((session?.user as { status?: string })?.status ?? "PENDING_VERIFICATION");
        }
        if (subsRes.status === "fulfilled" && subsRes.value.ok) {
          const d = await subsRes.value.json();
          setSubscriptions(d.subscriptions || []);
        }
      } catch {
        setDbStatus((session?.user as { status?: string })?.status ?? "PENDING_VERIFICATION");
      } finally {
        setSubsLoading(false);
      }
    }
    loadData();
  }, [status, isAdmin, session?.user]);

  if (status === "loading" || subsLoading) {
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
  // Use fresh DB status — falls back to JWT status if API call failed
  const isVerified = (dbStatus ?? (user?.status as string)) === "ACTIVE" ||
                     (dbStatus ?? (user?.status as string)) === "VERIFIED";
  const activeSubs = subscriptions.filter((s) => ["ACTIVE", "TRIAL"].includes(s.status));

  // Determine which view to show
  let view: "admin" | "pending" | "active-no-subs" | "active-with-subs";
  if (isAdmin) {
    view = "admin";
  } else if (!isVerified) {
    view = "pending";
  } else if (activeSubs.length === 0) {
    view = "active-no-subs";
  } else {
    view = "active-with-subs";
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#f9f9f9" }}>
      <ClientSidebar
        name={user?.name ?? undefined}
        email={user?.email ?? undefined}
        clientId={user?.clientId ?? undefined}
        subscriptions={subscriptions}
      />

      <AnimatePresence mode="wait">
        {view === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <AdminView name={user?.name ?? undefined} products={PRODUCTS} />
          </motion.div>
        )}
        {view === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <PendingView
              name={user?.name ?? undefined}
              clientId={user?.clientId ?? undefined}
              products={PRODUCTS}
            />
          </motion.div>
        )}
        {view === "active-no-subs" && (
          <motion.div
            key="active-no-subs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <ActiveNoSubsView
              name={user?.name ?? undefined}
              products={PRODUCTS}
            />
          </motion.div>
        )}
        {view === "active-with-subs" && (
          <motion.div
            key="active-with-subs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <ActiveWithSubsView
              name={user?.name ?? undefined}
              products={PRODUCTS}
              subscriptions={subscriptions}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
