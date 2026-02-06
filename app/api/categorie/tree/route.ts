import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET() {
  try {
    const headers = await getBackendHeaders();

    const response = await fetch(`${BACKEND_URL}/categorie/tree`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch category tree: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return NextResponse.json(
      { error: "Failed to fetch category tree" },
      { status: 500 },
    );
  }
}
