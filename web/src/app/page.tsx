// This is your new homepage.
// It lives at /lokvidhi/web/src/app/page.tsx

"use client";

import { BookOpen, Bot, Calculator } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      
      {/* 1. Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center text-center p-12 md:p-24">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Indian Law, <span className="text-blue-600">Simplified.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
          Understand your rights without the legalese. LokVidhi turns complex legal codes into interactive stories, simple guides, and tools you can actually use.
        </p>

        {session ? (
          <Link href="/scenario" className="mt-10 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
          Go to Dashboard
        </Link>
        ) : (
          <Link href="/signup" className="mt-10 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
            Get Started For Free
          </Link>
        )}
      </section>

      {/* 2. Features Section */}
      <section className="w-full bg-gray-50 border-t border-b border-gray-100 py-20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
          
          {/* Feature 1: Scenarios */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900"><Link href="/scenario" className="text-gray-600 hover:text-gray-900 font-medium">Interactive Scenarios</Link></h3>
            <p className="mt-2 text-gray-600">
              "My landlord is keeping my deposit." Play through real-life stories to see your rights and next steps.
            </p>
          </div>

          {/* Feature 2: Calculators */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Calculator className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900"><Link href="/calculator" className="text-gray-600 hover:text-gray-900 font-medium">Legal Calculators</Link></h3>
            <p className="mt-2 text-gray-600">
              Instantly calculate your severance pay, rent deposit refund, or stamp duty. No math, just answers.
            </p>
          </div>

          {/* Feature 3: AI Assistant */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Bot className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900"><Link href="/chatbot" className="text-gray-600 hover:text-gray-900 font-medium">AI Legal Bot (Beta)</Link></h3>
            <p className="mt-2 text-gray-600">
              Ask questions in plain English (or Hindi!) and get answers based on actual Bare Acts, not just a guess.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}