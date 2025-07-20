"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Ghost } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to sign in
        router.push(
          "/auth/signin?from=" + encodeURIComponent(window.location.pathname)
        );
      } else {
        // User is authenticated
        setIsChecking(false);
      }
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <Ghost className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 spooky-font">
            Haunted<span className="text-red-500">Trails</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Checking if you dare to enter...
          </p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
