import { NextResponse, type NextRequest } from "next/server";
// Import from the new central auth.ts file
import { auth } from "@/auth";

// --- THIS IS THE FIX ---
// Force this middleware to run on the Node.js runtime, not the Edge.
export const runtime = 'nodejs';
// ---------------------

// This is the new middleware function Next.js is looking for
export default auth((req: NextRequest) => { // Explicitly type req
  // The 'auth' property is dynamically added by the 'auth' wrapper.
  // We cast to 'any' here to access it, silencing the TS error.
  const session = (req as any).auth;

  // If the user is not authenticated (session is null)...
  if (!session) {
    // ...redirect them to the login page.
    const loginUrl = new URL("/api/auth/signin", req.url);
    // Tell the login page where to send them back after success
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If they are authenticated, let them proceed.
  return NextResponse.next();
});

// This part stays the same: tell the bouncer which doors to guard
export const config = {
  matcher: [
    "/scenario",
    // "/dashboard",
    // "/profile"
  ],
};