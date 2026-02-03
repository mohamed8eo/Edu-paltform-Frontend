import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET() {
  try {
    // Get all cookies from the incoming request
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Get the authorization header from the incoming request
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    // Build Cookie header string for the backend request
    const cookieHeader = allCookies
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    console.log(
      "🚀 Proxy: Forwarding cookies:",
      allCookies.map((c) => c.name).join(", "),
    );
    console.log("🚀 Proxy: Auth header:", authHeader || "none");

    // Build headers for the backend request
    const backendHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward authorization header if present
    if (authHeader) {
      backendHeaders["Authorization"] = authHeader;
    }

    const response = await fetch("http://localhost:8080/admin/traffic/daily", {
      method: "GET",
      headers: {
        ...backendHeaders,
        Cookie: cookieHeader,
      },
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
