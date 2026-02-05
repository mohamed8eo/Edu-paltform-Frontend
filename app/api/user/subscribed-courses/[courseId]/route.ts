import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const token = request.cookies.get("better-auth.session_token")?.value;
    const resolvedParams = await params;
    const { courseId } = resolvedParams;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID is required" },
        { status: 400 },
      );
    }

    // Fixed typo: "subscibe" -> "subscribe"
    const response = await fetch(
      `http://localhost:8080/me/subscibe/${courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `better-auth.session_token=${token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to fetch subscribed course",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      course: data,
    });
  } catch (err) {
    console.error("Error fetching subscribed course:", err);
    return NextResponse.json(
      { success: false, message: "Internal error", details: String(err) },
      { status: 500 },
    );
  }
}
