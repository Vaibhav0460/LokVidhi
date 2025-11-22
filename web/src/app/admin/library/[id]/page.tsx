"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Edit2, X } from 'lucide-react';

interface Section {
  id: number;
  section_number: string;
  legal_text: string;
  simplified_explanation: string;
}

export default function ManageSections({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sections, setSections] = useState<Section[]>([]);
  const [actTitle, setActTitle] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Edit Mode State
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ 
    section_number: '', 
    legal_text: '', 
    simplified_explanation: '' 
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
  const cleanUrl = apiUrl.replace(/["']/g, "").trim().replace(/\/$/, "");

  const fetchData = async () => {
    try {
        const actRes = await fetch(`${cleanUrl}/api/library/acts/${id}`);
        const actData = await actRes.json();
        setActTitle(actData.act.title);

        const secRes = await fetch(`${cleanUrl}/api/admin/acts/${id}/sections`);
        const secData = await secRes.json();
        setSections(secData);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  // --- ACTIONS ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.section_number) return;

    if (editingId) {
      // UPDATE Existing Section
      await fetch(`${cleanUrl}/api/admin/sections/${editingId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
    } else {
      // CREATE New Section
      await fetch(`${cleanUrl}/api/admin/sections`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ...formData, act_id: id })
      });
    }
    
    resetForm();
    fetchData();
  };

  const handleEditClick = (sec: Section) => {
    setEditingId(sec.id);
    setFormData({
      section_number: sec.section_number,
      legal_text: sec.legal_text,
      simplified_explanation: sec.simplified_explanation
    });
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (secId: number) => {
    if(!confirm("Delete this section?")) return;
    await fetch(`${cleanUrl}/api/admin/sections/${secId}`, { method: 'DELETE' });
    fetchData();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ section_number: '', legal_text: '', simplified_explanation: '' });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center mb-6">
          <Link href="/admin/library" className="text-gray-500 hover:text-gray-700 mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
             <h2 className="text-sm text-gray-500 font-medium">Manage Sections for</h2>
             <h1 className="text-2xl font-bold text-gray-900">{loading ? "..." : actTitle}</h1>
          </div>
        </div>

        {/* FORM (Dual Mode: Add / Edit) */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border mb-8 transition-colors ${editingId ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'}`}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  {editingId ? (
                    <><Edit2 className="w-4 h-4 mr-2 text-blue-600" /> Edit Section</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2 text-green-600" /> Add New Section</>
                  )}
                </div>
                {editingId && (
                  <button onClick={resetForm} className="text-xs text-gray-500 hover:text-gray-800 flex items-center">
                    <X className="w-3 h-3 mr-1" /> Cancel
                  </button>
                )}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    placeholder="Section Number (e.g. Section 302)" 
                    className="w-full p-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.section_number}
                    onChange={e => setFormData({...formData, section_number: e.target.value})}
                    required
                />
                <textarea 
                    placeholder="Original Legal Text..." 
                    rows={3}
                    className="w-full p-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    value={formData.legal_text}
                    onChange={e => setFormData({...formData, legal_text: e.target.value})}
                />
                <textarea 
                    placeholder="Simplified Explanation..." 
                    rows={3}
                    className="w-full p-2 border rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.simplified_explanation}
                    onChange={e => setFormData({...formData, simplified_explanation: e.target.value})}
                />
                <div className="flex justify-end gap-2">
                  {editingId && (
                    <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 text-sm font-medium">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className={`text-white px-6 py-2 rounded hover:opacity-90 text-sm font-medium flex items-center ${editingId ? 'bg-blue-600' : 'bg-green-600'}`}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Update Section' : 'Save Section'}
                  </button>
                </div>
            </form>
        </div>

        {/* SECTIONS LIST */}
        <div className="space-y-4">
            {sections.map(sec => (
                <div key={sec.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start group hover:shadow-sm transition-all">
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 flex items-center">
                          {sec.section_number}
                          {/* Visual indicator that this is the one being edited */}
                          {editingId === sec.id && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Editing...</span>}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{sec.simplified_explanation}</p>
                    </div>
                    <div className="flex items-center gap-2 pl-4">
                        <button onClick={() => handleEditClick(sec)} className="text-blue-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(sec.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
            {sections.length === 0 && <div className="text-center text-gray-400 py-4">No sections yet.</div>}
        </div>

      </div>
    </main>
  );
}