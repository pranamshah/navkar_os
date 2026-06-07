"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import LogoBrand from "@/components/ui/LogoBrand";

const NAV = [
  { href: "/dashboard/admin", label: "Overview", icon: "dashboard" },
  { href: "/dashboard/admin/verifications", label: "Verifications", icon: "verified_user" },
  { href: "/dashboard/admin/users", label: "All Users", icon: "group" },
  { href: "/dashboard/admin/tickets", label: "Tickets", icon: "support_agent" },
  { href: "/dashboard/admin/billing", label: "Billing", icon: "receipt_long" },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) =>
    href === "/dashboard/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col min-h-screen border-r"
      style={{ background: "#1a1c1c", borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <LogoBrand height={26} onDark href="/" />
      </div>

      {/* Admin badge */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
            style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}
          >
            {(session?.user?.name || session?.user?.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#ffffff" }}>
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs" style={{ color: "#D4AF37" }}>
              {session?.user?.role || "ADMIN"}
            </p>
          </div>
        </div>
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
                color: active ? "#1a1c1c" : "rgba(255,255,255,0.5)",
                background: active ? "#D4AF37" : "transparent",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, color: active ? "#1a1c1c" : "rgba(212,175,55,0.6)" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 w-full px-3 py-2 rounded text-xs font-semibold uppercase tracking-widest transition-all duration-200"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            logout
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#f9f9f9" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
