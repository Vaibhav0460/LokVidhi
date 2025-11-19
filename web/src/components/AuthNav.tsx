"use client";

// --- THIS IS THE FIX ---
// All client-side hooks AND functions (useSession, signIn, signOut)
// MUST be imported from "next-auth/react".
import { useSession, signIn, signOut } from "next-auth/react";
// ---------------------

import Link from "next/link";

export default function AuthNav() {
  const { data: session, status } = useSession();

  // Show nothing while loading the session
  if (status === "loading") {
    return null;
  }

  // If logged in, show user name and Sign Out
  if (session) {
    return (
      <div className="flex items-center gap-6">
        <span className="text-gray-600">
          Hi, {session.user?.name?.split(" ")[0] || session.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // If logged out, show Login and Sign Up
  return (
    <div className="flex items-center gap-6">
      <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
        Login
      </Link>
      <Link href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Sign Up
      </Link>
    </div>
  );
}