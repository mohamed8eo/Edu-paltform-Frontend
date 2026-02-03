import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Get all cookies from the incoming request
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );
    const cookies = cookieStore.getAll();

    // Build Cookie header manually
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    // Get the request body
    const body = await request.json();

    const response = await fetch(
      `http://localhost:8080/course/update/${slug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to update course: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}
