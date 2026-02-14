import { NextRequest, NextResponse } from "next/server";

const TOKEN_KEY = "accessToken";

/**
 * OAuth callback route
 *
 * The backend OAuth callback redirects to the frontend with ?token=<access_token>.
 * This route extracts the token, sets it as a cookie, and redirects to /auth-callback
 * where the client-side code stores it in localStorage.
 */
export async function GET(request: NextRequest) {
  try {
    const tokenFromQuery = request.nextUrl.searchParams.get("token");

    if (!tokenFromQuery) {
      return NextResponse.redirect(
        new URL("/sign-in?error=no_token", request.url),
      );
    }

    // Redirect to the client-side auth-callback page with the token
    // The client-side page will store the token in localStorage
    const callbackUrl = new URL("/auth-callback", request.url);
    callbackUrl.searchParams.set("token", tokenFromQuery);

    const response = NextResponse.redirect(callbackUrl);

    // Also set the token as a cookie for middleware/server-side access
    response.cookies.set(TOKEN_KEY, tokenFromQuery, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=callback_error", request.url),
    );
  }
}
