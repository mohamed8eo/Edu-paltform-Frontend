"use client";

import { useEffect } from "react";
import { authApi } from "@/app/auth-api";

export default function SignOutPage() {
  useEffect(() => {
    // Perform sign out on component mount
    authApi.signOut();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Signing out...</h1>
        <p className="text-muted-foreground">
          Please wait while we sign you out.
        </p>
      </div>
    </div>
  );
}
