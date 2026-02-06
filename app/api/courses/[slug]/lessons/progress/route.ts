import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const headers = await getBackendHeaders();

    const response = await fetch(
      `${BACKEND_URL}/course/${slug}/lessons/progress`,
      {
        method: "GET",
        headers,
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
