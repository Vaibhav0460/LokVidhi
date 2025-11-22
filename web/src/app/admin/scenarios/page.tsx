"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, ArrowLeft, Layers } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
}

export default function ManageScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
        const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");
        // Using the public route for list, but admin route for delete
        // Note: Ideally create a GET /api/admin/scenarios route if different from public
        // For now, let's grab them from a public route or add a GET /admin/scenarios
        // Actually, let's just query the public list or add the GET route.
        // I'll assume you can add the GET /scenarios route to admin.ts if needed, 
        // OR just use the DB directly. 
        // FIX: Let's add GET /api/admin/scenarios to admin.ts if it's missing? 
        // Actually, let's just use the public one for now, it's effectively the same.
        // But wait, public route is /api/scenario/ (singular) and returns... logic?
        // Let's just use the database directly in a new Admin GET route if needed.
        // SIMPLIFICATION: I'll fetch from /api/library/acts style but for scenarios.
        // Wait, we don't have a "list all" for scenarios in admin.ts yet?
        // Let's add it quickly to admin.ts? No, let's stick to the pattern.
        // I will add the GET /scenarios list route to admin.ts below step 2.
        
        // Assuming we added the route below:
        const res = await fetch(`${cleanUrl}/api/admin/scenarios`); 
        const data = await res.json();
        setScenarios(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this Scenario? This will delete ALL nodes and options inside it.")) return;
    
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
        const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");
        
        await fetch(`${cleanUrl}/api/admin/scenarios/${id}`, { method: 'DELETE' });
        setScenarios(scenarios.filter(s => s.id !== id));
    } catch (err) {
        alert("Failed to delete");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/admin" className="text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Manage Scenarios</h1>
          </div>
          <Link href="/admin/add-scenario" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition">
            <Plus className="w-4 h-4 mr-2" /> New Scenario
          </Link>
        </div>

        {loading ? <div className="text-center p-10">Loading...</div> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scenarios.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4 text-gray-500">#{s.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{s.title}</td>
                    <td className="px-6 py-4 text-gray-500">{s.difficulty_level}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <Link href={`/admin/scenarios/${s.id}`} title="Manage Nodes" className="text-blue-600 hover:text-blue-800">
                        <Layers className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(s.id)} title="Delete" className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}