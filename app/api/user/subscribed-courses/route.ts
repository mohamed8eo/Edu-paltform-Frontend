import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("better-auth.session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const response = await fetch("http://localhost:8080/me/subscibe/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token}`,
      },
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
