"use client"; // This tells Next.js this page needs interactivity (state/clicks)

import { useState, useEffect } from 'react';

// Define what our data looks like so TypeScript is happy
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

export default function Home() {
  const [node, setNode] = useState<ScenarioNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Load the Story Start (Scenario ID 1)
  useEffect(() => {
    fetch('http://localhost:4000/api/scenario/1')
      .then((res) => res.json())
      .then((data) => {
        // Combine the node and its options into one object for easier use
        setNode({ ...data.node, options: data.options });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to connect to the backend.');
        setLoading(false);
      });
  }, []);

  // 2. Handle Button Clicks (Move to next step)
  const handleOptionClick = (nextNodeId: number) => {
    // If there is no next node (e.g., end of story), just return
    if (!nextNodeId) return;

    setLoading(true);
    fetch(`http://localhost:4000/api/scenario/node/${nextNodeId}`)
      .then((res) => res.json())
      .then((data) => {
        setNode({ ...data.node, options: data.options });
        setLoading(false);
      });
  };

  // 3. Render the UI
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!node) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        
        {/* The Question / Content */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {node.content_text}
        </h1>

        {/* The Choices */}
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
            // If no options, it's the end of the story
            <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
              <strong>End of Scenario.</strong> Refresh to start again.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}