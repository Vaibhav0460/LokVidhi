"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface Section {
  id: number;
  section_number: string;
  legal_text: string;
  simplified_explanation: string;
}

interface ActData {
  act: {
    title: string;
    category: string;
  };
  sections: Section[];
}

export default function ActDetails({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() in Next.js 15+ (or standard async handling)
  const { id } = use(params);
  const [data, setData] = useState<ActData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
    const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");

    fetch(`${cleanUrl}/api/library/acts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Act...</div>;
  if (!data) return <div className="p-10 text-center">Act not found.</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-4xl w-full">
        
        <Link href="/library" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8 border-b border-gray-100 bg-white">
            <div className="flex items-center space-x-3 mb-2">
               <BookOpen className="w-6 h-6 text-purple-600" />
               <span className="text-sm font-bold tracking-wide text-purple-600 uppercase">
                 {data.act.category}
               </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {data.act.title}
            </h1>
          </div>

          <div className="divide-y divide-gray-100">
            {data.sections.length > 0 ? (
              data.sections.map((section) => (
                <div key={section.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {section.section_number}
                  </h3>
                  
                  {/* Original Text */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Legal Text
                    </p>
                    <p className="text-gray-700 font-serif italic bg-gray-50 p-3 rounded border border-gray-100">
                      "{section.legal_text}"
                    </p>
                  </div>

                  {/* Simplified Text */}
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
                      Simplified Explanation
                    </p>
                    <p className="text-gray-800">
                      {section.simplified_explanation}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No sections available for this Act yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}