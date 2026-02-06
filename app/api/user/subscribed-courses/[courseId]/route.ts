import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const resolvedParams = await params;
    const { courseId } = resolvedParams;

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID is required" },
        { status: 400 },
      );
    }

    const headers = await getBackendHeaders();

    const response = await fetch(`${BACKEND_URL}/me/subscibe/${courseId}`, {
      method: "GET",
      headers,
    });

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
