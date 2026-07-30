import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optimistic route protection only: this just checks for the presence of
// the non-httpOnly `auth_status` cookie set by the Go backend on
// login/register (see pkg/auth/cookies.go on the backend). It cannot verify
// or decode the actual JWTs — the backend independently enforces auth on
// every protected API call, which is the real security boundary. This is
// purely a UX shortcut so signed-out users get redirected before rendering
// a page that would just fail its data fetch.
const PROTECTED_PREFIXES = [
  "/show-times",
  "/reservations",
  "/payments",
  "/tickets",
];

const AUTH_PAGES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("auth_status");

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_PAGES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
