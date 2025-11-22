"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Edit2, X, CheckCircle } from 'lucide-react';

interface Node {
  id: number;
  content_text: string;
  is_outcome: boolean;
}

export default function ManageNodes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [scenarioTitle, setScenarioTitle] = useState("Scenario");
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    content_text: '', 
    is_outcome: false
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");

  const fetchData = async () => {
    try {
        // 1. Get Scenario Details (reuse existing public route or create admin one)
        // We can define a simple GET /api/admin/scenarios/:id route or just query list
        // For simplicity, let's just show the ID or generic title if we don't have the specific route ready
        setScenarioTitle(`Scenario #${id}`); // Placeholder

        // 2. Get Nodes
        const res = await fetch(`${cleanUrl}/api/admin/scenarios/${id}/nodes`);
        const data = await res.json();
        setNodes(data);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.content_text) return;

    if (editingId) {
      await fetch(`${cleanUrl}/api/admin/nodes/${editingId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
    } else {
      await fetch(`${cleanUrl}/api/admin/nodes`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ...formData, scenario_id: id })
      });
    }
    
    resetForm();
    fetchData();
  };

  const handleDelete = async (nodeId: number) => {
    if(!confirm("Delete this node?")) return;
    await fetch(`${cleanUrl}/api/admin/nodes/${nodeId}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEdit = (node: Node) => {
    setEditingId(node.id);
    setFormData({ content_text: node.content_text, is_outcome: node.is_outcome });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ content_text: '', is_outcome: false });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center mb-6">
          <Link href="/admin/scenarios" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
             <h2 className="text-sm text-gray-500 font-medium">Manage Nodes for</h2>
             <h1 className="text-2xl font-bold text-gray-900">{scenarioTitle}</h1>
          </div>
        </div>

        {/* FORM */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border mb-8 transition-colors ${editingId ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'}`}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  {editingId ? (
                    <><Edit2 className="w-4 h-4 mr-2 text-blue-600" /> Edit Node</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2 text-green-600" /> Add New Node (Question/Step)</>
                  )}
                </div>
                {editingId && (
                  <button onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-800 flex items-center">
                    <X className="w-3 h-3 mr-1" /> Cancel
                  </button>
                )}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea 
                    placeholder="Enter the question text or story outcome..." 
                    rows={3}
                    className="w-full p-2 border rounded text-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                    value={formData.content_text}
                    onChange={e => setFormData({...formData, content_text: e.target.value})}
                    required
                />
                
                <label className="flex items-center space-x-2 cursor-pointer w-fit">
                    <input 
                        type="checkbox" 
                        className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                        checked={formData.is_outcome}
                        onChange={e => setFormData({...formData, is_outcome: e.target.checked})}
                    />
                    <span className="text-sm text-gray-700">Is this an Outcome? (End of path)</span>
                </label>

                <div className="flex justify-end">
                  <button type="submit" className={`text-white px-6 py-2 rounded hover:opacity-90 text-sm font-medium flex items-center ${editingId ? 'bg-blue-600' : 'bg-green-600'}`}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Update Node' : 'Save Node'}
                  </button>
                </div>
            </form>
        </div>

        {/* LIST */}
        <div className="space-y-4">
            {nodes.map(node => (
                <div key={node.id} className={`bg-white p-4 rounded-lg border flex justify-between items-start ${node.is_outcome ? 'border-l-4 border-l-purple-500' : 'border-gray-200'}`}>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-400">ID: {node.id}</span>
                            {node.is_outcome && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Outcome</span>}
                        </div>
                        <p className="text-gray-900">{node.content_text}</p>
                    </div>
                    <div className="flex items-center gap-2 pl-4">
                        <button onClick={() => handleEdit(node)} className="text-blue-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(node.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
            {nodes.length === 0 && <div className="text-center text-gray-400 py-4">No nodes yet. Add the first question!</div>}
        </div>

      </div>
    </main>
  );
}