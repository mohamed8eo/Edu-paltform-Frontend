import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  try {
    const resolvedParams = await params;
    const { slug, id } = resolvedParams;

    const token = request.cookies.get("better-auth.session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { completed } = body;

    // Call backend endpoint
    const response = await fetch(
      `http://localhost:8080/course/${slug}/lessons/${id}/progress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `better-auth.session_token=${token}`,
        },
        body: JSON.stringify({ completed }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to update lesson progress",
      }));
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to update lesson progress",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("Error updating lesson progress:", err);
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  try {
    const resolvedParams = await params;
    const { slug, id } = resolvedParams;

    const token = request.cookies.get("better-auth.session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Call backend endpoint
    const response = await fetch(
      `http://localhost:8080/course/${slug}/lessons/${id}/progress`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `better-auth.session_token=${token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to fetch lesson progress",
      }));
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch lesson progress",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("Error fetching lesson progress:", err);
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
