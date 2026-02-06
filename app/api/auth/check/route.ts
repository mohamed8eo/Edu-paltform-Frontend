import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET() {
  try {
    const headers = await getBackendHeaders();

    console.log(
      "🔍 [API/auth/check] Forwarding headers with Authorization Bearer token",
    );

    const response = await fetch(`${BACKEND_URL}/auth/session`, {
      method: "GET",
      headers,
    });

    console.log("Session check response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Session check raw response:", data);

      // Check if the session is actually authenticated
      if (data.authenticated === true) {
        console.log("Session check succeeded: authenticated = true");
        return NextResponse.json({ valid: true, user: data });
      } else {
        console.log(
          "Session check failed: authenticated =",
          data.authenticated,
        );
        return NextResponse.json({ valid: false }, { status: 401 });
      }
    } else {
      console.log("Session check failed: HTTP status", response.status);
      return NextResponse.json({ valid: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to verify session" },
      { status: 500 },
    );
  }
}
