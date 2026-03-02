"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Briefcase, Gavel, Car, AlertTriangle, Layers, ChevronRight } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  category?: string;
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
    // Scaled down icon size from w-8/h-8 to w-6/h-6
    if (t.includes("salary") || t.includes("work")) return <Briefcase className="w-6 h-6 text-blue-600" />;
    if (t.includes("traffic") || t.includes("challan")) return <Car className="w-6 h-6 text-orange-600" />;
    if (t.includes("consumer") || t.includes("product")) return <AlertTriangle className="w-6 h-6 text-red-600" />;
    return <Gavel className="w-6 h-6 text-purple-600" />;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="max-w-6xl w-full">
        
        {/* Header - Scaled down even more */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight uppercase">
            Scenario Hub
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Select a legal path to begin interactive learning.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400 text-xs font-bold animate-pulse uppercase tracking-widest">
            Loading Scenarios...
          </div>
        ) : (
          Object.entries(groupedScenarios).map(([category, items]) => (
            <section key={category} className="mb-8">
              
              {/* Umbrella Heading - Tighter UI */}
              <div className="flex items-center gap-2 mb-3 border-b-2 border-gray-100 pb-2">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                  {category}
                </span>
                <span className="h-[1px] flex-grow bg-gray-100"></span>
                <span className="text-[9px] font-bold text-gray-400 bg-white px-2 border border-gray-100 rounded-full">
                  {items.length} Units
                </span>
              </div>

              {/* GRID FIX: Moved to 4 columns on large screens to reduce card width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((scenario) => (
                  <Link 
                    key={scenario.id} 
                    href={`/scenario/${scenario.id}`}
                    // Added mx-auto and max-w-sm to prevent over-stretching
                    className="flex flex-col p-4 bg-white rounded-lg border border-slate-200 transition-all duration-200 hover:border-blue-400 hover:shadow-sm group w-full max-w-[300px] mx-auto sm:mx-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-slate-50 rounded group-hover:bg-blue-50 transition-colors">
                        {getIcon(scenario.title)}
                      </div>
                      <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded border ${
                        scenario.difficulty_level === "Beginner" ? "border-green-200 text-green-600" :
                        scenario.difficulty_level === "Intermediate" ? "border-amber-200 text-amber-600" :
                        "border-red-200 text-red-600"
                      }`}>
                        {scenario.difficulty_level}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
                      {scenario.title}
                    </h3>
                    
                    <p className="text-[11px] text-slate-500 leading-snug mb-4 flex-grow line-clamp-2">
                      {scenario.description}
                    </p>
                    
                    <div className="flex items-center text-blue-600 font-black text-[9px] uppercase tracking-tighter group-hover:gap-1 transition-all">
                      Open Case <ChevronRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}