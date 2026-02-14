"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tokenManager } from "@/app/auth-api";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(errorParam);
        return;
      }

      // Get the token from the URL query parameter
      // The backend OAuth callback redirects to the frontend with ?token=<access_token>
      const token = searchParams.get("token");

      if (token) {
        // Store the token in localStorage and cookie
        tokenManager.setToken(token);
        // Redirect to home
        router.push("/home");
        return;
      }

      // If no token in URL, check if the cookie was already set by the API callback route
      if (tokenManager.hasToken()) {
        router.push("/home");
        return;
      }

      setError("No authentication token received");
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
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

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-muted-foreground">
          Please wait while we verify your authentication.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
