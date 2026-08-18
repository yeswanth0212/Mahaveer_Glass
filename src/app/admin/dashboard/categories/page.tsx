'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Layers, AlertCircle } from 'lucide-react';
import { ICategory } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        setName('');
        setDescription('');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-2xl font-extrabold text-stone-100">Category Management</h1>
        <p className="text-xs text-stone-400 mt-1">Manage product classification categories for Mahaveer store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-500" /> Add New Category
          </h3>
          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-300 mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Architectural Hardware"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-300 mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Brief category summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors shadow-md"
            >
              {adding ? 'Adding...' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Existing Categories Grid */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-stone-100">
            Active Categories ({categories.length})
          </h3>
          {loading ? (
            <div className="text-xs text-stone-400 py-6 text-center">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div key={c.id || c._id} className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                  <h4 className="font-bold text-amber-400 text-xs">{c.name}</h4>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{c.description || 'No description'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
