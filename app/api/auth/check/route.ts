import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET() {
  try {
    const headers = await getBackendHeaders();

    // Validate token by calling GET /user/me
    // If the token is valid, the backend will return user data
    const response = await fetch(`${BACKEND_URL}/user/me`, {
      method: "GET",
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.UserAccount || data;
      return NextResponse.json({ valid: true, user });
    } else {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to verify authentication" },
      { status: 500 },
    );
  }
}
