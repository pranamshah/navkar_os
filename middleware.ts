import { NextRequest, NextResponse } from "next/server";

const DEVICE_COOKIE = "navkar_admin_device";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard admin dashboard routes (not API — API has its own auth check)
  if (!pathname.startsWith("/dashboard/admin")) return NextResponse.next();

  const deviceToken = req.cookies.get(DEVICE_COOKIE)?.value;

  if (!deviceToken) {
    // No device cookie → redirect to device registration page
    const url = req.nextUrl.clone();
    url.pathname = "/admin-device";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Token exists — let the page load; the page/API will verify status from DB
  // (middleware has no DB access, so we check status in the layout)
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/admin/:path*"],
};
