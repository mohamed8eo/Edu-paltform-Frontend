import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/api";

/**
 * Social Sign-In API Route
 *
 * Redirects to the backend's OAuth login URL for the given provider.
 * The backend handles the OAuth flow and redirects back to the frontend
 * with ?token=<access_token> in the URL.
 */
export async function GET(request: NextRequest) {
  try {
    const provider = request.nextUrl.searchParams.get("provider");

    if (!provider || !["google", "github"].includes(provider)) {
      return NextResponse.json(
        { error: "Valid provider (google or github) is required" },
        { status: 400 },
      );
    }

    // Redirect to the backend's OAuth login URL
    const loginUrl = `${BACKEND_URL}/auth/${provider}/login`;
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Social sign-in error:", error);
    return NextResponse.json(
      { error: "Failed to initiate social sign-in" },
      { status: 500 },
    );
  }
}
