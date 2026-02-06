import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const token = request.cookies.get("better-auth.session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Call backend endpoint to get all completed lessons
    const response = await fetch(
      `http://localhost:8080/course/${slug}/lessons/progress`,
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
        message: "Failed to fetch completed lessons",
      }));
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch completed lessons",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Backend returns array of completed lessons
    // Transform to a map of lessonId -> completedLesson for easier lookup
    const completedLessons = Array.isArray(data)
      ? data.map(
          (item: {
            lessonId: string;
            completed: boolean;
            completedAt: string;
          }) => ({
            lessonId: item.lessonId,
            completed: item.completed,
            completedAt: item.completedAt,
          }),
        )
      : [];

    return NextResponse.json({
      success: true,
      completedLessons,
    });
  } catch (err) {
    console.error("Error fetching completed lessons:", err);
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
