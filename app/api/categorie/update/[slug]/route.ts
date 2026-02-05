import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    console.log("=== PUT Request Debug ===");
    console.log("Slug:", slug);

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Get all cookies from the incoming request
    const cookieStore = await import("next/headers").then((mod) =>
      mod.cookies(),
    );
    const cookies = cookieStore.getAll();

    // Build Cookie header manually
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
    console.log("Cookies:", cookieHeader ? "Present" : "None");

    const backendUrl = `http://localhost:8080/categorie/update/${slug}`;
    console.log("Backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response ok:", response.ok);

    // Try to get response text for better debugging
    const responseText = await response.text();
    console.log("Backend response text:", responseText);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to update category: ${response.status}`,
          details: responseText,
        },
        { status: response.status },
      );
    }

    // Parse the response text as JSON
    const data = responseText ? JSON.parse(responseText) : {};
    return NextResponse.json(data);
  } catch (error) {
    console.error("=== PUT Error ===");
    console.error("Error updating category:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    
    return NextResponse.json(
      {
        error: "Failed to update category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}