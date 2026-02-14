// Server-only API utilities
// This file can only be used in Server Components (API routes)
// Do NOT import this file in client components

import { cookies } from "next/headers";

/**
 * Creates headers for backend API requests including authentication
 * Use this ONLY in API routes and Server Components
 * @returns Object containing Cookie and Authorization headers
 */
export async function getBackendHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Build Cookie header
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  // Extract access token from cookies for Authorization header
  const tokenCookie = allCookies.find((c) => c.name === "accessToken");
  const token = tokenCookie?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Cookie: cookieHeader,
  };

  // Add Bearer token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
