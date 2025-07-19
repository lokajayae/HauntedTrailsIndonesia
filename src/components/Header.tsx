"use client";

import { Ghost, User, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-red-900/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Ghost className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl font-bold text-white spooky-font text-glow">
            HauntedTrails<span className="text-red-500">Indonesia</span>
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="w-8 h-8 animate-pulse bg-gray-700 rounded-full"></div>
          ) : session ? (
            <div className="flex items-center space-x-3">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full border border-red-500/50"
                />
              ) : (
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm text-white hidden md:block">
                {session.user?.name}
              </span>
              <Button
                onClick={() => signOut()}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
