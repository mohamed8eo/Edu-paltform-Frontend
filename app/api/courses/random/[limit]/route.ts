import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ limit: string }> },
) {
  try {
    const resolvedParams = await params;
    const { limit } = resolvedParams;

    const token = request.cookies.get("better-auth.session_token")?.value;

    // Call backend endpoint
    const response = await fetch(
      `http://localhost:8080/course/random/${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Cookie: `better-auth.session_token=${token}` }),
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to fetch random courses",
      }));
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch random courses",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      courses: data,
    });
  } catch (err) {
    console.error("Error fetching random courses:", err);
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
