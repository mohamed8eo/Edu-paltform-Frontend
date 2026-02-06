import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api";
import { getBackendHeaders } from "@/lib/api-server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const headers = await getBackendHeaders();

    const response = await fetch(`${BACKEND_URL}/course/${slug}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch course: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}
