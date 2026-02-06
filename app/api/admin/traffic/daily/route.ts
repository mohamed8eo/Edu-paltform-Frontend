import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET() {
  try {
    // Get the authorization header from the incoming request
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    // Get backend headers with cookies and token
    const backendHeaders = await getBackendHeaders();

    // Forward authorization header if present in the incoming request
    if (authHeader) {
      (backendHeaders as Record<string, string>)["Authorization"] = authHeader;
    }

    console.log("🚀 Proxy: Forwarding headers with Authorization Bearer token");

    const response = await fetch(`${BACKEND_URL}/admin/traffic/daily`, {
      method: "GET",
      headers: backendHeaders,
    });

    console.log("🚀 Proxy: Backend response status:", response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch traffic data: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic data" },
      { status: 500 },
    );
  }
}
