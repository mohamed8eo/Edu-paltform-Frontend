"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      console.log("🔐 AuthCallback: Processing OAuth callback...");

      // Get the provider from URL params
      const provider = searchParams.get("provider");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        console.error("❌ AuthCallback: OAuth error:", errorParam);
        setError(errorParam);
        return;
      }

      if (!provider) {
        console.error("❌ AuthCallback: No provider specified");
        setError("No provider specified");
        return;
      }

      try {
        // Call the backend session endpoint to verify the session
        console.log("🔐 AuthCallback: Verifying session with backend...");

        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("🔐 AuthCallback: Session check result:", data);

        if (data.valid && data.user) {
          console.log(
            "✅ AuthCallback: Session verified, redirecting to /home",
          );
          // Redirect to home on success
          router.push("/home");
        } else {
          console.log("❌ AuthCallback: Session verification failed");
          setError("Session verification failed");
        }
      } catch (err) {
        console.error("❌ AuthCallback: Error verifying session:", err);
        setError("Failed to verify session");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Failed
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push("/sign-in")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing Sign In...</h1>
        <p className="text-muted-foreground">
          Please wait while we verify your authentication.
        </p>
      </div>
    </div>
  );
}
