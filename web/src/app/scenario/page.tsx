"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Briefcase, Gavel, Car, AlertTriangle, Layers } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  category?: string; // NEW: Optional category field
}

export default function ScenarioHub() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000").replace(/\/$/, "");
        const res = await fetch(`${apiUrl}/api/scenario`);
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

  // NEW: Group scenarios by category
  const groupedScenarios = useMemo(() => {
    return scenarios.reduce((acc, scenario) => {
      const category = scenario.category || "General Legal Situations";
      if (!acc[category]) acc[category] = [];
      acc[category].push(scenario);
      return acc;
    }, {} as Record<string, Scenario[]>);
  }, [scenarios]);

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("salary") || t.includes("work")) return <Briefcase className="w-8 h-8 text-blue-600" />;
    if (t.includes("traffic") || t.includes("challan")) return <Car className="w-8 h-8 text-orange-600" />;
    if (t.includes("consumer") || t.includes("product")) return <AlertTriangle className="w-8 h-8 text-red-600" />;
    return <Gavel className="w-8 h-8 text-purple-600" />;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-6xl w-full">
        
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Legal Learning Paths
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore interactive scenarios categorized by real-life situations. Make choices, understand laws, and build your legal literacy.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
             <p className="text-gray-500 font-medium">Loading your legal journey...</p>
          </div>
        ) : scenarios.length > 0 ? (
          /* NEW: Nested Map for Categories */
          Object.entries(groupedScenarios).map(([category, items]) => (
            <section key={category} className="mb-16">
              
              {/* Category Header (The Umbrella) */}
              <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                  {category}
                </h2>
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                  {items.length} Scenarios
                </span>
              </div>

              {/* Grid of Scenarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((scenario) => (
                  <Link 
                    key={scenario.id} 
                    href={`/scenario/${scenario.id}`}
                    className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        {getIcon(scenario.title)}
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                        scenario.difficulty_level === "Beginner" ? "bg-green-100 text-green-700" :
                        scenario.difficulty_level === "Intermediate" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {scenario.difficulty_level}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {scenario.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                      {scenario.description}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-50 flex items-center text-blue-600 font-bold text-xs uppercase tracking-wider group-hover:gap-2 transition-all">
                      Explore Case <span className="transition-all">&rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No scenarios available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}