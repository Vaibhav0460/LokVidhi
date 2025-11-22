"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, Book, ChevronRight } from 'lucide-react';

interface Act {
  id: number;
  title: string;
  category: string;
  jurisdiction: string;
}

export default function LibraryPage() {
  const [acts, setActs] = useState<Act[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`http://127.0.0.1:4000/api/library/acts`)
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

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-5xl w-full">
        
        <div className="text-center py-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Legal Library
          </h1>
          <p className="text-xl text-gray-600">
            Browse the raw text of Indian laws, simplified for you.
          </p>
        </div>

        {loading ? (
          <div className="text-center p-10">Loading Library...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {acts.map((act) => (
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}