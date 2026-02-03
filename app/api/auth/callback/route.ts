import { NextRequest, NextResponse } from "next/server";

const TOKEN_KEY = "better-auth.session_token";

// This route handles the OAuth callback from social providers
// The OAuth provider redirects here with a code or token
export async function GET(request: NextRequest) {
  try {
    console.log("🔐 OAuth callback received");
    console.log("🌐 Current URL:", request.url);
    console.log("🔍 Search params:", request.nextUrl.searchParams.toString());
    console.log(
      "🍪 Current cookies:",
      request.cookies
        .getAll()
        .map((c) => `${c.name}=${c.value?.substring(0, 10)}...`),
    );

    // Get the token from query params (if passed by backend) or from cookies
    const tokenFromQuery = request.nextUrl.searchParams.get("token");
    const tokenFromCookie = request.cookies.get(TOKEN_KEY)?.value;

    const token = tokenFromQuery || tokenFromCookie;

    if (!token) {
      console.log("❌ No token found in OAuth callback");
      // Redirect to sign-in if no token
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    console.log(
      "✅ Token received in callback:",
      token.substring(0, 30) + "...",
    );
    console.log("📋 Token length:", token.length);

    // Create response with redirect to home
    const response = NextResponse.redirect(new URL("/home", request.url));

    // Set the cookie with proper attributes for cross-site OAuth
    // SameSite=None; Secure is required for cross-site cookie sending
    const isLocalhost = request.headers.get("host")?.includes("localhost");

    response.cookies.set(TOKEN_KEY, token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      ...(isLocalhost ? {} : { sameSite: "none", secure: true }),
    });

    console.log("🍪 Cookie set with proper attributes");

    // Also return the token in a header so the client can store it in localStorage
    response.headers.set("X-Auth-Token", token);
    console.log("📤 Token header set for client");

    return response;
  } catch (error) {
    console.error("💥 Error in OAuth callback:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
