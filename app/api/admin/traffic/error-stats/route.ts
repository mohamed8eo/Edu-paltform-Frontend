import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET() {
  try {
    const headers = await getBackendHeaders();

    const response = await fetch(`${BACKEND_URL}/admin/traffic/error-stats`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch error stats: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching error stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch error stats" },
      { status: 500 },
    );
  }
}
