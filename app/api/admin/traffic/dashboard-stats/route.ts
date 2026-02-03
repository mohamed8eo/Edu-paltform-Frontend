import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all cookies from the incoming request
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );
    const cookies = cookieStore.getAll();

    // Build Cookie header manually
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    const response = await fetch(
      "http://localhost:8080/admin/traffic/dashboard-stats",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch dashboard stats: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
