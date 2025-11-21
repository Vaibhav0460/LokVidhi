"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // To get the ID from the URL

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
  const scenarioId = params.id; // Get the ID from the URL (e.g., '1')

  const [node, setNode] = useState<ScenarioNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Load the scenario start based on the ID
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
  }, [scenarioId]);

  const handleOptionClick = (nextNodeId: number) => {
    if (!nextNodeId) return;

    setLoading(true);
    fetch(`${apiUrl}/api/scenario/node/${nextNodeId}`)
      .then((res) => res.json())
      .then((data) => {
        setNode({ ...data.node, options: data.options });
        setLoading(false);
      });
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!node) return null;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {node.content_text}
        </h1>

        <div className="flex flex-col gap-4">
          {node.options.length > 0 ? (
            node.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleOptionClick(opt.next_node_id)}
                className="w-full text-left px-6 py-4 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 text-blue-900 font-medium"
              >
                {opt.option_text}
              </button>
            ))
          ) : (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
              <strong>End of Scenario.</strong>
              <br />
              <a href="/scenario" className="text-blue-600 underline mt-2 inline-block">Back to Hub</a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}