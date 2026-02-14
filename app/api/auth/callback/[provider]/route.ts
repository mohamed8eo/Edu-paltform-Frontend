import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "accessToken";

/**
 * Provider-specific OAuth callback route
 *
 * Handles callbacks from the backend OAuth flow.
 * The backend redirects here with ?token=<access_token>.
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
    const callbackUrl = new URL("/auth-callback", request.url);
    callbackUrl.searchParams.set("token", tokenFromQuery);

    const response = NextResponse.redirect(callbackUrl);

    // Set the token as a cookie for middleware/server-side access
    response.cookies.set(TOKEN_KEY, tokenFromQuery, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error in OAuth provider callback:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=callback_error", request.url),
    );
  }
}
