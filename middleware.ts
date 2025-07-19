// Middleware is not needed with Firebase Authentication
// Firebase Auth handles authentication state client-side
import { NextResponse } from "next/server";

export function middleware() {
  // You can add any custom middleware logic here if needed
  // For now, just pass through all requests
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
