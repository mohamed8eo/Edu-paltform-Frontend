import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/api";

/**
 * Social Sign-In API Route
 *
 * This route handles social authentication by:
 * 1. Calling the backend's /auth/sign-in-social endpoint
 * 2. Returning both the OAuth URL and token in the response
 * 3. Allowing the client to store the token in localStorage
 *
 * This ensures consistency with email/password authentication
 * where the token is stored in localStorage for client-side access.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, callbackURL } = body;

    console.log(
      "🔐 [API/auth/sign-in-social] Starting social sign-in:",
      provider,
    );
    console.log("🔐 [API/auth/sign-in-social] Callback URL:", callbackURL);

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 },
      );
    }

    // Call the backend's social sign-in endpoint
    const backendResponse = await fetch(`${BACKEND_URL}/auth/sign-in-social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies from the incoming request
        Cookie: request.headers.get("Cookie") || "",
      },
      body: JSON.stringify({ provider, callbackURL }),
      credentials: "include", // Important: allows cookies to be sent/received
    });

    console.log(
      "📡 [API/auth/sign-in-social] Backend response status:",
      backendResponse.status,
    );

    // Get the Set-Cookie header from the backend response
    const setCookieHeader = backendResponse.headers.get("set-cookie");
    console.log(
      "🍪 [API/auth/sign-in-social] Set-Cookie header:",
      setCookieHeader,
    );

    // Try to parse the response body for the token
    let responseData: any = {};
    try {
      const text = await backendResponse.text();
      if (text) {
        responseData = JSON.parse(text);
        console.log(
          "📥 [API/auth/sign-in-social] Response data:",
          responseData,
        );
      }
    } catch (e) {
      console.log("⚠️ [API/auth/sign-in-social] Could not parse response body");
    }

    // Build the response
    // We'll forward the Set-Cookie header if present
    const response = new NextResponse(
      JSON.stringify({
        ...responseData,
        // Even if backend doesn't return token in body, we need to ensure
        // the client can authenticate. The backend should set HttpOnly cookies.
      }),
      {
        status: backendResponse.ok ? 200 : backendResponse.status,
        headers: {
          "Content-Type": "application/json",
          // Forward the Set-Cookie header from the backend
          ...(setCookieHeader && { "Set-Cookie": setCookieHeader }),
        },
      },
    );

    // If the backend redirected, we need to handle that
    if (backendResponse.redirected) {
      console.log(
        "🔄 [API/auth/sign-in-social] Backend redirected to:",
        backendResponse.url,
      );

      // The backend has set cookies, now we need to extract the token
      // so the client can also store it in localStorage

      // Return the redirect URL so client can navigate
      return NextResponse.json({
        url: backendResponse.url,
        // Also return the token if it was set in a cookie we can read
        // This is a fallback - normally the token would be in HttpOnly cookie
        message: "OAuth flow initiated, cookies should be set",
      });
    }

    // If we have a URL in the response data (OAuth authorization URL)
    if (responseData.url) {
      console.log("🔄 [API/auth/sign-in-social] OAuth URL:", responseData.url);
      return NextResponse.json({
        url: responseData.url,
        // If backend returns token in body (non-HttpOnly), pass it to client
        ...(responseData.token && { token: responseData.token }),
      });
    }

    console.log("✅ [API/auth/sign-in-social] Response prepared");
    return response;
  } catch (error) {
    console.error("❌ [API/auth/sign-in-social] Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate social sign-in" },
      { status: 500 },
    );
  }
}
