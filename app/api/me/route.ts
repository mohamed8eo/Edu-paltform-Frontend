import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 /api/me endpoint called");

    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get("better-auth.session_token")?.value;
    const authHeader = request.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    const token = cookieToken || bearerToken;

    console.log(
      "🍪 Cookie token:",
      cookieToken ? `${cookieToken.substring(0, 20)}...` : "missing",
    );
    console.log(
      "🔑 Bearer token:",
      bearerToken ? `${bearerToken.substring(0, 20)}...` : "missing",
    );
    console.log("✅ Using token:", token ? "yes" : "no");

    if (!token) {
      console.log("❌ No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Forward the request to your backend with the token
    // Changed from http://localhost:8080/me to http://localhost:8080/auth/me
    const backendUrl = "http://localhost:8080/me";
    console.log("📡 Calling backend:", backendUrl);
    console.log("🔑 Token being sent:", token.substring(0, 30) + "...");
    console.log("📋 Token length:", token.length);
    console.log("🔍 Token first 10 chars:", token.substring(0, 10));
    console.log("🔍 Token last 10 chars:", token.substring(token.length - 10));

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📥 Backend response status:", response.status);
    console.log(
      "📋 Response headers:",
      Object.fromEntries(
        [...response.headers].filter(
          ([k]) =>
            k.toLowerCase().startsWith("x-") ||
            k.toLowerCase() === "content-type",
        ),
      ),
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Backend error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: response.status },
      );
    }

    const userData = await response.json();
    console.log("✅ User data received:", userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("💥 Error in /api/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
