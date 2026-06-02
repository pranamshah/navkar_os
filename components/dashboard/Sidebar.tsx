"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MODULE_LIST, type ModuleId } from "@/lib/modules";
import {
  LayoutDashboard, Compass, CreditCard, LogOut, ChevronRight, Zap,
} from "lucide-react";

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  subscribedModules?: ModuleId[];
  plan?: string;
}

export default function Sidebar({ userEmail, userName, subscribedModules = [], plan }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const navItem = (href: string, label: string, Icon: React.ElementType) => (
    <Link
      key={href}
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 rounded"
      style={{
        color: isActive(href) ? "#1a1c1c" : "#7e7576",
        background: isActive(href) ? "rgba(212,175,55,0.12)" : "transparent",
        borderLeft: isActive(href) ? "2px solid #D4AF37" : "2px solid transparent",
      }}
    >
      <Icon size={14} strokeWidth={1.8} />
      {label}
    </Link>
  );

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col border-r min-h-screen"
      style={{ background: "#fafafa", borderColor: "rgba(0,0,0,0.08)" }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: "#1a1c1c", color: "#D4AF37" }}>N</div>
          <span className="font-black text-sm uppercase tracking-widest" style={{ color: "#1a1c1c" }}>NavkarOS</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ background: "#1a1c1c", color: "#D4AF37" }}>
            {(userName || userEmail || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "#1a1c1c" }}>{userName || "User"}</p>
            <p className="text-xs truncate" style={{ color: "#7e7576" }}>{userEmail}</p>
          </div>
        </div>
        {plan && (
          <div className="mt-3 flex items-center gap-1.5">
            <Zap size={11} style={{ color: "#D4AF37" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
              {plan} Plan
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="flex flex-col gap-1 mb-6">
          {navItem("/dashboard", "Dashboard", LayoutDashboard)}
          {navItem("/dashboard/explore", "Explore Modules", Compass)}
          {navItem("/dashboard/pricing", "Pricing", CreditCard)}
        </div>

        {subscribedModules.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest px-4 mb-3" style={{ color: "#bbb" }}>
              Your Modules
            </p>
            <div className="flex flex-col gap-1">
              {subscribedModules.map((id) => {
                const mod = MODULE_LIST.find((m) => m.id === id);
                if (!mod) return null;
                const href = `/dashboard/${mod.id}`;
                return (
                  <Link
                    key={id}
                    href={href}
                    className="flex items-center justify-between px-4 py-2.5 rounded transition-all duration-200"
                    style={{
                      background: isActive(href) ? "rgba(212,175,55,0.1)" : "transparent",
                      borderLeft: isActive(href) ? "2px solid #D4AF37" : "2px solid transparent",
                    }}
                  >
                    <div>
                      <p className="text-xs font-semibold" style={{ color: isActive(href) ? "#1a1c1c" : "#4c4546" }}>
                        {mod.name}
                      </p>
                      <p className="text-xs" style={{ color: "#7e7576", fontSize: "10px" }}>{mod.tagline}</p>
                    </div>
                    <ChevronRight size={12} style={{ color: "#bbb" }} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {subscribedModules.length === 0 && (
          <div className="mt-2 mx-1">
            <div className="p-4" style={{ background: "rgba(212,175,55,0.08)", border: "0.5px solid rgba(212,175,55,0.2)" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#1a1c1c" }}>Unlock Your Modules</p>
              <p className="text-xs mb-3" style={{ color: "#7e7576", lineHeight: 1.5 }}>Subscribe to access FreightOps, DocAI, BillGen, and more.</p>
              <Link
                href="/dashboard/pricing"
                className="block text-center text-xs font-semibold uppercase tracking-widest py-2 transition-all duration-200"
                style={{ background: "#1a1c1c", color: "#fff" }}
              >
                View Plans
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t pt-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 rounded cursor-none"
          style={{ color: "#7e7576" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7e7576")}
        >
          <LogOut size={14} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
