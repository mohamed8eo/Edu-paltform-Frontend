import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieToken = request.cookies.get("better-auth.session_token")?.value;
  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const token = cookieToken || bearerToken;

  console.log("🔍 Middleware: Checking path:", pathname);
  console.log(
    "🍪 Cookie token:",
    cookieToken ? `${cookieToken.substring(0, 20)}...` : "missing",
  );
  console.log(
    "🔑 Bearer token:",
    bearerToken ? `${bearerToken.substring(0, 20)}...` : "missing",
  );
  console.log("✅ Token available:", !!token);

  if (pathname === "/") {
    if (token) {
      console.log("✅ Token found on home page, redirecting to /home");
      return NextResponse.redirect(new URL("/home", request.url));
    }
    console.log("ℹ️ No token on home page, allowing access");
    return NextResponse.next();
  }

  if (
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/api/auth")
  ) {
    console.log("ℹ️ Public route, allowing access");
    return NextResponse.next();
  }

  if (!token) {
    console.log("❌ No token found, redirecting to /sign-in");
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  console.log("✅ Authenticated, allowing access to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
