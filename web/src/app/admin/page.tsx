"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert, Users, FileText, Activity, RefreshCw } from "lucide-react";
import Link from 'next/link';


export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State for stats
  const [stats, setStats] = useState({ users: 0, scenarios: 0, acts: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // 1. Fetch Stats Function
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
      const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");
      
      const res = await fetch(`${cleanUrl}/api/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    // Security Check
    const userRole = (session?.user as any)?.role;
    if (!session || userRole !== "admin") {
      router.push("/");
      return;
    }

    // 2. Fetch data if authorized
    fetchStats();
  }, [session, status, router]);

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
            <p className="text-gray-500">Welcome back, {session?.user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={fetchStats} 
               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
               title="Refresh Stats"
             >
               <RefreshCw className={`w-5 h-5 ${loadingStats ? 'animate-spin' : ''}`} />
             </button>
             <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Admin Access
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Users Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Total Users</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="text-blue-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {loadingStats ? "..." : stats.users}
            </p>
          </div>
          
          {/* Scenarios Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Active Scenarios</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <Activity className="text-green-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {loadingStats ? "..." : stats.scenarios}
            </p>
          </div>

          {/* Acts Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Library Acts</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="text-purple-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {loadingStats ? "..." : stats.acts}
            </p>
          </div>
        </div>

        {/* CMS Actions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/add-act" className="block">
            <button className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group cursor-pointer">
              <FileText className="w-10 h-10 text-gray-400 group-hover:text-blue-600 mb-3" />
              <span className="font-medium text-gray-600 group-hover:text-blue-700">Add New Legal Act</span>
            </button>
          </Link>
          
          <Link href="/admin/add-scenario" className="group"> {/* FIX: Add Link */}
            <button className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group cursor-pointer h-full">
              <Activity className="w-10 h-10 text-gray-400 group-hover:text-green-600 mb-3" />
              <span className="font-medium text-gray-600 group-hover:text-green-700">Create New Scenario</span>
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}