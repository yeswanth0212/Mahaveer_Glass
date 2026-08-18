'use client';

import React, { useState, useEffect } from 'react';
import { IGalleryItem } from '@/lib/types';

import { X, Image as ImageIcon, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Store', 'Products', 'Glass Work', 'Plywood', 'Hardware', 'Projects'];

export default function GalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<IGalleryItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        }
      } catch (err) {
        console.error('Failed loading gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-800 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
          Showroom & Product Gallery
        </h1>
        <p className="text-stone-400 text-sm sm:text-base">
          Browse real photographs of our hardware products, glass installations, marine plywood stocks and store displays.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === cat
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/60 rounded-2xl border border-stone-800 p-8 space-y-2">
          <ImageIcon className="w-10 h-10 text-stone-600 mx-auto" />
          <h3 className="text-stone-300 font-bold">No images found in this category.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id || item._id}
              onClick={() => setLightboxImage(item)}
              className="group relative bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-all duration-300 cursor-pointer shadow-xl h-64"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold rounded uppercase">
                  {item.category}
                </span>
                <h4 className="text-stone-100 font-bold text-sm group-hover:text-amber-400 transition-colors line-clamp-1">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal Overlay */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-stone-800 hover:bg-stone-700 rounded-full text-stone-200 focus:outline-none z-10"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-96 sm:h-[500px] w-full rounded-2xl overflow-hidden bg-stone-950">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-2">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {lightboxImage.category}
                </span>
                <h3 className="text-xl font-bold text-stone-100">
                  {lightboxImage.title}
                </h3>
              </div>
              <a
                href={`https://wa.me/917871457430?text=Hello%20Mahaveer%20Hardware,%20I%20saw%20this%20image%20in%20your%20gallery:%20${encodeURIComponent(
                  lightboxImage.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Enquire Image on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
