import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET(request: NextRequest) {
  try {
    const headers = await getBackendHeaders();

    const response = await fetch(`${BACKEND_URL}/me/subscibe/all`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to fetch subscribed courses",
      }));
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch subscribed courses",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Backend returns: { success: true, data: [{ id, title, slug, description, thumbnail, level, language, ... }] }
    // Pass through the courses array directly
    const courses = Array.isArray(data.data) ? data.data : [];

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (err) {
    console.error("Error fetching subscribed courses:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
