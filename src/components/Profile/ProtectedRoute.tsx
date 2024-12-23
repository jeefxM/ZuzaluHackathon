"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isConnected, status } = useAccount();

  useEffect(() => {
    if (!isConnected && status !== "connecting" && status !== "reconnecting") {
      router.replace("/lottery");
    }
  }, [isConnected, status, router]);

  // Show loading state while checking connection
  if (status === "connecting" || status === "reconnecting") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white font-mono">Loading...</div>
      </div>
    );
  }

  // If not connected, show nothing (will redirect via useEffect)
  if (!isConnected) {
    return null;
  }

  // If connected, show the protected content
  return <>{children}</>;
}
