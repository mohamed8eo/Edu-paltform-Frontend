import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [API/me] BACKEND_URL:", BACKEND_URL);

    const headers = await getBackendHeaders();

    console.log(
      "🔍 [API/me] Forwarding headers with Authorization Bearer token",
    );

    const response = await fetch(`${BACKEND_URL}/me`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal error", details: String(err) },
      { status: 500 },
    );
  }
}
