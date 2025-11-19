import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

export const runtime = 'nodejs';

// Define which routes are public and which are protected
const protectedRoutes = ['/scenario'];
const authRoutes = ['/login', '/signup'];

export default auth((req: NextRequest) => {
  const session = (req as any).auth;
  const { nextUrl } = req;
  const isLoggedIn = !!session;

  const isProtectedRoute = protectedRoutes.some(path => nextUrl.pathname.startsWith(path));
  const isAuthRoute = authRoutes.some(path => nextUrl.pathname.startsWith(path));

  // 1. If user is logged in and tries to access /login or /signup...
  if (isAuthRoute && isLoggedIn) {
    // ...redirect them to the main app (e.g., /scenario).
    return NextResponse.redirect(new URL("/scenario", nextUrl));
  }

  // 2. If user is NOT logged in and tries to access a protected page...
  if (isProtectedRoute && !isLoggedIn) {
    // ...redirect them to the login page.
    // We also add `callbackUrl` so they are sent back to the page
    // they were trying to access after they log in.
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Otherwise, let them proceed.
  return NextResponse.next();
});

// We need to update the matcher to run the middleware on all
// the routes we care about (auth pages and protected pages).
export const config = {
  matcher: [
    "/scenario/:path*",
    "/login",
    "/signup"
  ],
};