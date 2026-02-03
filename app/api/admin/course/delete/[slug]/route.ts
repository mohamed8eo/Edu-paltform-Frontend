import { NextResponse } from "next/server";

export async function DELETE(
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

    const response = await fetch(
      `http://localhost:8080/course/delete/${slug}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      },
    );

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
