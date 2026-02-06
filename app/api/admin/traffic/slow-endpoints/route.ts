import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET() {
  try {
    const headers = await getBackendHeaders();

    const response = await fetch(
      `${BACKEND_URL}/admin/traffic/slow-endpoints`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch slow endpoints" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching slow endpoints:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
