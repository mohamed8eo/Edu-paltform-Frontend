import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const headers = await getBackendHeaders();

    const response = await fetch(`${BACKEND_URL}/course/delete/${slug}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to delete course: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
