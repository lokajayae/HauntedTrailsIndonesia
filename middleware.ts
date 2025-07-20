import { NextResponse } from "next/server";

export function middleware() {
  // For Firebase Auth, we handle authentication client-side
  // This middleware is just for any other custom logic you might need
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes (optional)
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
