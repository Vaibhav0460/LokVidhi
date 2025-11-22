"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export default function AuthNav() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside (UX 101)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show nothing while loading the session
  if (status === "loading") { return null; }

  // If logged in, show Avatar + Dropdown
  if (session) {
    const userImage = session.user?.image;
    const userName = session.user?.name || session.user?.email || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Avatar Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none"
        >
          {userImage ? (
            // If they have an image (Google), show it
            <img src={userImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            // If not, show their initial in a nice blue circle
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold select-none">
              {userInitial}
            </div>
          )}
        </button>

        {/* The Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">
            
            {/* Greeting Header */}
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <p className="text-xs text-gray-500">Hi, there!</p>
              <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
            </div>

            {/* Profile Link (Placeholder) */}
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-2" />
              My Profile
            </Link>

            {/* Sign Out */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}
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