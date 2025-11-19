"use client";

import Link from "next/link";
import AuthNav from "./AuthNav"; // <-- FIX: Changed to relative path

export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Logo / Home Link */}
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          Lok<span className="text-blue-600">Vidhi</span>
        </Link>

        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
           <Link href="/scenario" className="text-gray-600 hover:text-gray-900 font-medium">
            Scenarios
          </Link>
          <Link href="/calculator" className="text-gray-600 hover:text-gray-900 font-medium">
            Calculators
          </Link>
          <Link href="/chatbot" className="text-gray-600 hover:text-gray-900 font-medium">
            AI Assistant
          </Link>
        </div>

        {/* User Auth Menu */}
        <AuthNav />
      </nav>
    </header>
  );
}