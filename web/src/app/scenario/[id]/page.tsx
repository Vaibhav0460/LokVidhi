"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface NodeOption {
  id: number;
  option_text: string;
  next_node_id: number;
}

interface ScenarioNode {
  id: number;
  content_text: string;
  is_outcome: boolean;
  options: NodeOption[];
}

export default function ScenarioGame() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id;

  const [node, setNode] = useState<ScenarioNode | null>(null);
  // NEW: History stack to store previous nodes
  const [history, setHistory] = useState<ScenarioNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000").replace(/\/$/, "");

  useEffect(() => {
    if (!scenarioId) return;

    fetch(`${apiUrl}/api/scenario/${scenarioId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Scenario not found");
        return res.json();
      })
      .then((data) => {
        setNode({ ...data.node, options: data.options });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load scenario. It might not exist.');
        setLoading(false);
      });
  }, [scenarioId, apiUrl]);

  const handleOptionClick = (nextNodeId: number) => {
    if (!nextNodeId || !node) return;

    // NEW: Save current node to history before moving forward
    setHistory((prev) => [...prev, node]);

    setLoading(true);
    fetch(`${apiUrl}/api/scenario/node/${nextNodeId}`)
      .then((res) => res.json())
      .then((data) => {
        setNode({ ...data.node, options: data.options });
        setLoading(false);
      });
  };

  // NEW: Back logic - pop the last node from history and set it as current
  const handleGoBack = () => {
    if (history.length === 0) return;

    const previousNode = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1)); // Remove last entry
    setNode(previousNode);
  };

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart the scenario?")) {
      window.location.reload();
    }
  };

  if (loading && !node) return <div className="flex h-screen items-center justify-center font-medium text-gray-500">Loading scenario...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">{error}</div>;
  if (!node) return null;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-2xl w-full mt-8">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/scenario" className="flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hub
          </Link>

          <div className="flex gap-4">
             {/* Conditional Back Button */}
            {history.length > 0 && (
              <button 
                onClick={handleGoBack}
                className="flex items-center text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous Choice
              </button>
            )}
            
            <button 
              onClick={handleRestart}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Restart Scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Card */}
        <div className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 transition-all ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Progress Indicator */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md">
              Step {history.length + 1}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-10 leading-snug">
            {node.content_text}
          </h1>

          <div className="flex flex-col gap-3">
            {node.options.length > 0 ? (
              node.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionClick(opt.next_node_id)}
                  className="w-full text-left px-6 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-500 hover:shadow-md transition-all duration-200 text-gray-700 font-semibold group flex items-center justify-between"
                >
                  <span>{opt.option_text}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">&rarr;</span>
                </button>
              ))
            ) : (
              <div className="mt-4 p-8 bg-green-50 rounded-3xl border border-green-100 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-green-900 mb-2">Scenario Complete</h2>
                <p className="text-green-700 text-sm mb-6">You've reached the end of this legal path.</p>
                <Link 
                  href="/scenario" 
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md"
                >
                  Return to Hub
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}