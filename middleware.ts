import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Admin routes
  if (pathname.startsWith("/dashboard/admin")) {
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
    if (user.role !== "SUPERADMIN" && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/client", req.url));
    }
  }

  // Client routes
  if (
    pathname.startsWith("/dashboard/client") ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/pricing")
  ) {
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
    if (
      user.status === "PENDING_VERIFICATION" &&
      !pathname.startsWith("/status") &&
      !pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/status", req.url));
    }
  }

  // Redirect logged-in admin away from /login
  if (pathname === "/login" && user?.role === "SUPERADMIN") {
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  }

  // Redirect logged-in client away from /login
  if (pathname === "/login" && user?.role === "CLIENT") {
    if (user.status === "ACTIVE") {
      return NextResponse.redirect(new URL("/dashboard/client", req.url));
    }
    return NextResponse.redirect(new URL("/status", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/app/:path*",
    "/status",
    "/onboarding/:path*",
    "/login",
  ],
};
