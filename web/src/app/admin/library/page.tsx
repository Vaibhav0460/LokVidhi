"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, ArrowLeft, Book } from 'lucide-react';

interface Act {
  id: number;
  title: string;
  category: string;
  jurisdiction: string;
}

export default function ManageLibrary() {
  const [acts, setActs] = useState<Act[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActs = async () => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
        const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");
        const res = await fetch(`${cleanUrl}/api/library/acts`);
        const data = await res.json();
        setActs(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchActs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This will delete the Act and ALL its sections.")) return;
    
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
        const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");
        
        await fetch(`${cleanUrl}/api/admin/acts/${id}`, { method: 'DELETE' });
        setActs(acts.filter(act => act.id !== id)); // UI Optimistic Update
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Library</h1>
          </div>
          <Link href="/admin/add-act" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition">
            <Plus className="w-4 h-4 mr-2" /> Add New Act
          </Link>
        </div>

        {loading ? <div className="text-center p-10">Loading...</div> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {acts.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4 font-medium text-gray-900">{act.title}</td>
                    <td className="px-6 py-4 text-gray-500">{act.category}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <Link href={`/admin/library/${act.id}`} title="Manage Sections" className="text-blue-600 hover:text-blue-800">
                        <Book className="w-5 h-5" />
                      </Link>
                      {/* Note: Edit functionality can be added similarly */}
                      <button onClick={() => handleDelete(act.id)} title="Delete Act" className="text-red-400 hover:text-red-600">
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