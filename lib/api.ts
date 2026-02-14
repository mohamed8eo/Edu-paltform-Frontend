// Backend URL configuration
// Use NEXT_PUBLIC_BACKEND_URL for client-side components
// Use BACKEND_URL for server-side components (API routes)

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export { BACKEND_URL, NEXT_PUBLIC_BACKEND_URL };
