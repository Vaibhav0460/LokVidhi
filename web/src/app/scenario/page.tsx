"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Briefcase, Gavel, Car, AlertTriangle } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
}

export default function ScenarioHub() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        // Use env var or fallback
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
        const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");
        
        const res = await fetch(`${cleanUrl}/api/scenario`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        setScenarios(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  // Helper to assign icons dynamically based on title/content
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("salary") || t.includes("work")) return <Briefcase className="w-8 h-8 text-blue-600" />;
    if (t.includes("traffic") || t.includes("challan")) return <Car className="w-8 h-8 text-orange-600" />;
    if (t.includes("consumer") || t.includes("product")) return <AlertTriangle className="w-8 h-8 text-red-600" />;
    return <Gavel className="w-8 h-8 text-purple-600" />;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Learn by Doing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a real-life legal scenario and play through it. Make choices, see the consequences, and learn your rights along the way.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading Scenarios...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scenarios.length > 0 ? (
              scenarios.map((scenario) => (
                <Link 
                  key={scenario.id} 
                  href={`/scenario/${scenario.id}`}
                  className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-blue-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                      {getIcon(scenario.title)}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      scenario.difficulty_level === "Beginner" ? "bg-green-100 text-green-800" :
                      scenario.difficulty_level === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {scenario.difficulty_level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {scenario.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 h-[60px]">
                    {scenario.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Start Scenario &rarr;
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No scenarios available yet. Check back soon!
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}