'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { IGalleryItem } from '@/lib/types';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const CATEGORIES = ['Store', 'Products', 'Glass Work', 'Plywood', 'Hardware', 'Projects'];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Store');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) setItems(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);
    setErrorMsg('');

    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setErrorMsg('Failed to upload image: ' + error.message);
          setUploadingImage(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          setUploadingImage(false);
        }
      );
    } catch (err: any) {
      setErrorMsg('Failed to upload image: ' + err.message);
      setUploadingImage(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setErrorMsg('Title and uploaded image are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, imageUrl })
      });
      if (res.ok) {
        setTitle('');
        setImageUrl('');
        fetchGallery();
      } else {
        setErrorMsg('Failed to save gallery item.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this gallery photo?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-2xl font-extrabold text-stone-100">Gallery Image Management</h1>
        <p className="text-xs text-stone-400 mt-1">Upload and organize showroom, product stock, and project photos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-500" /> Upload New Photo
          </h3>
          <form onSubmit={handleAdd} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-300 mb-1">Image Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mortise Locks Display"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 mb-1">Gallery Category *</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-300 mb-1">Gallery Image *</label>
              <div className="flex flex-col items-center gap-4">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-40 rounded-xl object-cover border border-stone-800 bg-stone-950 shrink-0" 
                  />
                )}
                <div className="w-full relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label 
                    htmlFor="gallery-upload"
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors shadow-md"
            >
              {submitting ? 'Uploading...' : 'Add to Public Gallery'}
            </button>
          </form>
        </div>

        {/* Existing Gallery Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-stone-100">
            Uploaded Photos ({items.length})
          </h3>
          {loading ? (
            <div className="text-xs text-stone-400 py-6 text-center">Loading gallery...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item.id || item._id} className="relative group bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="h-40 bg-stone-950">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 flex justify-between items-center bg-stone-900">
                    <div>
                      <p className="font-bold text-stone-100 text-xs truncate max-w-[150px]">{item.title}</p>
                      <span className="text-[10px] text-amber-400 font-semibold">{item.category}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id || item._id || '')}
                      className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
