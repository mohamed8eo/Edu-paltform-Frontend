import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("better-auth.session_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID is required" },
        { status: 400 },
      );
    }

    const response = await fetch("http://localhost:8080/me/add-course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token}`,
      },
      body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { success: false, message: error.message || "Failed to add course" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    console.error("Error adding course:", err);
    return NextResponse.json(
      { success: false, message: "Internal error", details: String(err) },
      { status: 500 },
    );
  }
}
