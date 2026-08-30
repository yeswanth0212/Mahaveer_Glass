'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Layers, AlertCircle, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';
import { ICategory } from '@/lib/types';
import { setClientCategories } from '@/lib/clientProductStore';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
          setClientCategories(data);
        }
      }
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
    setErrorMsg('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() })
      });
      if (res.ok) {
        setName('');
        setDescription('');
        fetchCategories();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to add category');
      }
    } catch (err) {
      setErrorMsg('Network error adding category');
    } finally {
      setAdding(false);
    }
  };

  const handleStartEdit = (cat: ICategory) => {
    setEditingId(cat.id || cat._id || '');
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), description: editDescription.trim() })
      });
      if (res.ok) {
        handleCancelEdit();
        fetchCategories();
      } else {
        alert('Failed to update category.');
      }
    } catch {
      alert('Error updating category.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete "${catName}"? Any products under this category will no longer have an active category link.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCategories();
      } else {
        alert('Failed to delete category.');
      }
    } catch {
      alert('Error deleting category.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-amber-500" />
          Category Management
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Create, edit, or delete product classification categories for your store.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl self-start">
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
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-300 mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Brief category summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={adding}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                </>
              ) : (
                'Save Category'
              )}
            </button>
          </form>
        </div>

        {/* Existing Categories Grid */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-100">
              Active Categories ({categories.length})
            </h3>
            <span className="text-[11px] text-stone-400">
              Changes sync directly to public website
            </span>
          </div>

          {loading ? (
            <div className="text-xs text-stone-400 py-8 text-center flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-xs text-stone-400 py-8 text-center bg-stone-950 rounded-xl border border-stone-800">
              No categories found. Add your first category on the left.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => {
                const catId = c.id || c._id || '';
                const isEditing = editingId === catId;
                const isDeleting = deletingId === catId;

                return (
                  <div 
                    key={catId} 
                    className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3 flex flex-col justify-between"
                  >
                    {isEditing ? (
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase">Category Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase">Description</label>
                          <textarea
                            rows={2}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(catId)}
                            disabled={updating}
                            className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> {updating ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-lg text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-amber-400 text-xs">{c.name}</h4>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            {c.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-900 flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(c)}
                            className="p-1.5 bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-amber-400 rounded-lg transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(catId, c.name)}
                            disabled={isDeleting}
                            className="p-1.5 bg-rose-950/60 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Category"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
