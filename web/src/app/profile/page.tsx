"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Shield, LogOut, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-20 w-20 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // Get user initials
  const initials = session.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session.user?.email?.[0].toUpperCase();

  return (
    <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="px-8 pb-8 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-4xl font-bold text-blue-600">{initials}</span>
                )}
              </div>
            </div>

            {/* Actions (Top Right) */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>

            {/* User Info */}
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {session.user?.name || "LokVidhi User"}
              </h1>
              <p className="text-gray-500 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {session.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Account Security
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Login Method</label>
                <p className="text-sm font-medium text-gray-900 mt-1 bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-200">
                  {session.user?.image?.includes("google") ? "Google OAuth" : "Email & Password"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">User ID</label>
                <p className="text-sm font-mono text-gray-600 mt-1">
                  {session.user?.id || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats (Placeholder for future features) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Your Activity
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-600 text-sm">Scenarios Completed</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-gray-600 text-sm">Calculations Saved</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-400 italic">
                  * Progress tracking coming soon!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}