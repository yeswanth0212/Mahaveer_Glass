'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, AlertCircle, Package, Star, Upload, Loader2 } from 'lucide-react';
import { IProduct, ICategory } from '@/lib/types';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Door Hardware',
    price: '',
    typeVariant: '',
    shortDescription: '',
    specifications: '',
    variants: '',
    imageUrl: '',
    availability: 'In Stock',
    available: true,
    featured: false
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [resP, resC] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      if (resP.ok) setProducts(await resP.json());
      if (resC.ok) setCategories(await resC.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: categories[0]?.name || 'Door Hardware',
      price: '',
      typeVariant: '',
      shortDescription: '',
      specifications: '',
      variants: '',
      imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
      availability: 'In Stock',
      available: true,
      featured: false
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: IProduct) => {
    setEditingId(p.id || p._id || '');
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      typeVariant: p.typeVariant || '',
      shortDescription: p.shortDescription || p.description || '',
      specifications: p.specifications ? p.specifications.join(', ') : '',
      variants: p.variants ? p.variants.join(', ') : '',
      imageUrl: p.imageUrl || p.image || '',
      availability: p.availability || (p.available === false ? 'Out of Stock' : 'In Stock'),
      available: p.available !== undefined ? p.available : true,
      featured: Boolean(p.featured)
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(50);
    setErrorMsg('');

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.imageUrl) {
        setUploadProgress(100);
        setFormData(prev => ({ ...prev, imageUrl: json.imageUrl }));
      } else {
        setErrorMsg(json.error || 'Failed to upload image');
      }
    } catch (err: any) {
      setErrorMsg('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? It will be removed from the public website immediately.')) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      setErrorMsg('Name, Category, and Price are required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      specifications: formData.specifications ? formData.specifications.split(',').map((s) => s.trim()) : [],
      variants: formData.variants ? formData.variants.split(',').map((v) => v.trim()) : []
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed saving product.');
      }
    } catch {
      setErrorMsg('Network error saving product.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-100">Product Catalog Management</h1>
          <p className="text-xs text-stone-400 mt-1">Add, edit prices, update variants, mark featured/availability in Firestore.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-12 text-center text-stone-400 text-xs">Loading products from Firestore...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-stone-400 text-xs bg-stone-900 rounded-2xl border border-stone-800">
          No products found.
        </div>
      ) : (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Variants</th>
                  <th className="px-6 py-3.5">Availability</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filtered.map((p) => (
                  <tr key={p.id || p._id} className="hover:bg-stone-850 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={p.imageUrl || p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-950 border border-stone-800 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-stone-100 text-xs">{p.name}</p>
                          {p.featured && <span title="Featured Product"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /></span>}
                        </div>
                        {p.typeVariant && <p className="text-[10px] text-amber-500">{p.typeVariant}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-amber-400">
                      {p.priceDisplay || `₹${p.price.toLocaleString('en-IN')}`}
                    </td>
                    <td className="px-6 py-4 text-stone-400 max-w-xs truncate">
                      {p.variants && p.variants.length > 0 ? p.variants.join(', ') : 'Default'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                        p.available === false || p.availability === 'Out of Stock'
                          ? 'bg-rose-950 border-rose-800 text-rose-400'
                          : 'bg-emerald-950 border-emerald-800 text-emerald-400'
                      }`}>
                        {p.availability || (p.available === false ? 'Out of Stock' : 'In Stock')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg transition-colors"
                        title="Edit Product & Price"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id || p._id || '')}
                        className="p-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-800 pb-4">
              <h2 className="text-lg font-bold text-stone-100">
                {editingId ? 'Edit Product Details & Price' : 'Add New Hardware Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8 Mortise Lock CY"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Price (₹ Amount) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1800"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Type / Sub-Variant Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. CY - Antique / S.S / Brass"
                    value={formData.typeVariant}
                    onChange={(e) => setFormData({ ...formData, typeVariant: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">Variants (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Antique, S.S, Brass"
                    value={formData.variants}
                    onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e: any) => setFormData({ 
                      ...formData, 
                      availability: e.target.value,
                      available: e.target.value !== 'Out of Stock'
                    })}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="On Order">On Order</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-0"
                  />
                  Mark as Featured Product
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      available: e.target.checked,
                      availability: e.target.checked ? 'In Stock' : 'Out of Stock'
                    })}
                    className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-0"
                  />
                  Product Available for Purchase
                </label>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Product Image *</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-xl object-cover border border-stone-800 bg-stone-950 shrink-0" 
                    />
                  )}
                  <div className="flex-1 w-full relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        uploadingImage ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-stone-700 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Uploading {Math.round(uploadProgress)}%...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span>Click to upload image</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Product description for customers..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Specifications (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Material: Solid Brass, Finish: Satin, Length: 8 inches"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md"
                >
                  {saving ? 'Saving to Firestore...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
