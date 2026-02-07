import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

// Handle OAuth callback from the backend
// The backend sets the session cookie and redirects here with ?session=true
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = request.nextUrl.pathname.split("/").pop() || "unknown";

    console.log("🔍 [OAuth Callback] Provider:", provider);
    console.log(
      "🔍 [OAuth Callback] Search params:",
      Object.fromEntries(searchParams),
    );

    // Check if there's a session cookie set by the backend
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );
    const sessionCookie = cookieStore.get("better-auth.session_token");
    const lastUsedLoginMethod = cookieStore.get(
      "better-auth.last_used_login_method",
    );

    console.log("🔍 [OAuth Callback] Session cookie:", !!sessionCookie);
    console.log(
      "🔍 [OAuth Callback] Login method:",
      lastUsedLoginMethod?.value,
    );

    if (sessionCookie) {
      // Session is set, redirect to home
      console.log(
        "✅ [OAuth Callback] Session cookie found, redirecting to /home",
      );
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // No session cookie, try to verify session with backend
    try {
      const headers = await getBackendHeaders();
      const response = await fetch(`${BACKEND_URL}/auth/session`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🔍 [OAuth Callback] Session verify response:", data);

        if (data.authenticated) {
          return NextResponse.redirect(new URL("/home", request.url));
        }
      }
    } catch (e) {
      console.error("🔍 [OAuth Callback] Session verify error:", e);
    }

    // If we reach here, something went wrong
    console.log(
      "❌ [OAuth Callback] No session found, redirecting to /sign-in",
    );
    return NextResponse.redirect(
      new URL("/sign-in?error=oauth_failed", request.url),
    );
  } catch (error) {
    console.error("❌ [OAuth Callback] Error:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=callback_error", request.url),
    );
  }
}
