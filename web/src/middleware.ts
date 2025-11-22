import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = 'nodejs';

export default auth((req) => {
  const { nextUrl } = req;
  
  // Cast to 'any' to access custom properties
  const session = (req as any).auth;
  
  const isLoggedIn = !!session;
  
  // --- THE FIX ---
  // Middleware (Raw Token) has role at root: session.role
  // Client (Processed Session) has role at user: session.user.role
  const userRole = session?.user?.role || session?.role; 
  
  const isAdmin = userRole === "admin";
  // ----------------
  
  const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');
  const isPrivate = nextUrl.pathname.startsWith('/scenario') || nextUrl.pathname.startsWith('/profile');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  // 1. Admin Security Check
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // 2. Redirect logged-in users away from Login/Signup pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/scenario", nextUrl));
  }

  // 3. Protect private routes (Scenarios, Profile)
  if (isPrivate && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/scenario/:path*",
    "/profile",     
    "/admin/:path*",
    "/login",       
    "/signup"       
  ],
};