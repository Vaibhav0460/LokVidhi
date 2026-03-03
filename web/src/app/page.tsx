"use client";

import Link from 'next/link';
import { 
  Gavel, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Calculator, 
  Users,
  ArrowUpRight,
  Percent
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FCFCFD] text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 px-6 border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/20 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">
              India's Premier Legal Literacy Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.05] mb-8">
            Knowledge is <br />
            <span className="font-semibold text-slate-900 italic">Common Ground.</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed mb-12 font-medium">
            Bridging the gap between the complex halls of justice and the everyday citizen. 
            Access a digital library, play through legal scenarios, and calculate liabilities—all in one place.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/scenario" className="bg-slate-900 text-white px-10 py-4 rounded-lg font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
              Start a Scenario <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/library" className="bg-white text-slate-600 border border-slate-200 px-10 py-4 rounded-lg font-bold text-sm hover:border-blue-200 hover:text-blue-600 transition-all">
              The Digital Library
            </Link>
          </div>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">
            The Lokvidhi Suite
          </h2>
          <p className="text-3xl font-light leading-tight">
            Tools designed for <span className="font-semibold text-slate-900">clariy.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1: Scenarios */}
          <div className="group flex flex-col items-start">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-500">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-4 tracking-tight">Interactive Scenarios</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
              Experience the law through decision-based storytelling. Navigate traffic violations, workplace disputes, or property issues with real-time consequences.
            </p>
            [Image of a legal decision tree flowchart]
            <Link href="/scenario" className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 flex items-center gap-2 transition-colors">
              Enter Hub <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Feature 2: Library */}
          <div className="group flex flex-col items-start">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-4 tracking-tight">Simplified Library</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
              Access the BNS, BNSS, and specialized acts in plain English. We translate legalese into understandable rights and duties for every citizen.
            </p>
            <Link href="/library" className="mt-auto text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 flex items-center gap-2 transition-colors">
              Search Acts <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* NEW Feature 3: Interactive Calculators */}
          <div className="group flex flex-col items-start">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-500">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-4 tracking-tight">Legal Calculators</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 font-medium">
              Estimate alimony, calculate court fees, or determine compensation for motor accidents instantly. Verified tools based on current Indian gazettes.
            </p>
            <Link href="/calculators" className="mt-auto text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 flex items-center gap-2 transition-colors">
              Launch Tools <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- SOCIETAL IMPACT SECTION --- */}
      <section className="bg-[#0F172A] py-32 px-6 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.4em] mb-8">
              The Mission
            </h2>
            <h3 className="text-4xl md:text-5xl font-light leading-tight mb-12">
              Equity starts with <br />
              <span className="font-semibold">understanding.</span>
            </h3>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="mt-1 shrink-0 w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-blue-400 bg-slate-900/50">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Preventative Awareness</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">Early legal education reduces litigation. We help citizens identify illegal practices before they escalate into courtroom battles.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="mt-1 shrink-0 w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-blue-400 bg-slate-900/50">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Citizen Resilience</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">From rent disputes to consumer fraud, our tools provide the middle-class with the same logic used by legal professionals.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
               <img 
                 src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" 
                 alt="Scales of Justice" 
                 className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
               />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-600/20 blur-2xl rounded-full" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <h2 className="text-lg font-black tracking-tighter text-slate-900">LOKVIDHI</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Digital Jurisprudence for the Common Citizen
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <Link href="/about" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link href="/admin" className="hover:text-blue-600 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}