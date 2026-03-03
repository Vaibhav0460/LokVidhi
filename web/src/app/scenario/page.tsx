"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Briefcase, Gavel, Car, AlertTriangle, Layers, ChevronRight, ArrowRight } from 'lucide-react';

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
    <main className="flex min-h-screen flex-col items-center p-6 bg-[#FCFCFD]">
      <div className="max-w-6xl w-full">
        
        {/* Refined Header */}
        <div className="text-left py-10 border-b border-slate-100 mb-10">
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">
            Legal <span className="font-semibold">Scenarios</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Interactive decision-based learning paths.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
            Synchronizing Scenarios...
          </div>
        ) : (
          Object.entries(groupedScenarios).map(([category, items]) => (
            <section key={category} className="mb-12">
              
              {/* SOPHISTICATED UMBRELLA HEADING */}
              <div className="flex items-center gap-4 mb-6 group">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] whitespace-nowrap">
                  {category}
                </h2>
                <div className="h-[1px] flex-grow bg-slate-100 group-hover:bg-blue-100 transition-colors"></div>
                <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                  {items.length.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Sophisticated 4-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((scenario) => (
                  <Link 
                    key={scenario.id} 
                    href={`/scenario/${scenario.id}`}
                    className="flex flex-col p-5 bg-white rounded-lg border border-slate-100 transition-all duration-300 hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] group w-full max-w-[280px] mx-auto sm:mx-0"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="p-2.5 bg-slate-50 rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 transition-all">
                        {getIcon(scenario.title)}
                      </div>

                      {/* SOPHISTICATED DIFFICULTY TAG */}
                      <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm border ${
                        scenario.difficulty_level === "Beginner" ? "border-emerald-100 text-emerald-600 bg-emerald-50/30" :
                        scenario.difficulty_level === "Intermediate" ? "border-amber-100 text-amber-600 bg-amber-50/30" :
                        "border-rose-100 text-rose-600 bg-rose-50/30"
                      }`}>
                        {scenario.difficulty_level}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight tracking-tight">
                      {scenario.title}
                    </h3>
                    
                    <p className="text-[12px] text-slate-500 leading-relaxed mb-6 flex-grow line-clamp-2 font-medium opacity-80">
                      {scenario.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 font-bold text-[10px] uppercase tracking-[0.15em] transition-all">
                      Explore Case <ArrowRight className="w-3 h-3 translate-y-[-1px] group-hover:translate-x-1 transition-transform" />
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