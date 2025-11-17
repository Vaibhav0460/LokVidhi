"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">
          Hi, {session.user.name?.split(" ")[0]}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Login with Google
    </button>
  );
}