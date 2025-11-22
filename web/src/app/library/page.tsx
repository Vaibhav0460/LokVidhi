"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, ChevronRight, Search } from 'lucide-react'; // 1. Import Search Icon

interface Act {
  id: number;
  title: string;
  category: string;
  jurisdiction: string;
}

export default function LibraryPage() {
  const [acts, setActs] = useState<Act[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // 2. Add Search State

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
    const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");

    fetch(`${cleanUrl}/api/library/acts`)
      .then((res) => res.json())
      .then((data) => {
        setActs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 3. Filter Acts based on Search Query
  // We check if the Title OR Category matches the search text
  const filteredActs = acts.filter(act => 
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-5xl w-full">
        
        <div className="text-center py-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Legal Library
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse the raw text of Indian laws, simplified for you.
          </p>

          {/* 4. Search Bar UI */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
              placeholder="Search for an Act (e.g., IPC, Contract)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center p-10 text-gray-500">Loading Library...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredActs.length > 0 ? (
              filteredActs.map((act) => (
                <Link 
                  key={act.id} 
                  href={`/library/${act.id}`}
                  className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <Scale className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {act.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                          {act.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  </div>
                </Link>
              ))
            ) : (
              // 5. Empty State
              <div className="col-span-full text-center py-10 text-gray-500">
                No acts found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}