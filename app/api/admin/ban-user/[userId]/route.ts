import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    // Get all cookies from the incoming request
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );
    const cookies = cookieStore.getAll();

    // Build Cookie header manually
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    const response = await fetch(
      `http://localhost:8080/admin/ban-user/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to ban user: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error banning user:", error);
    return NextResponse.json({ error: "Failed to ban user" }, { status: 500 });
  }
}
