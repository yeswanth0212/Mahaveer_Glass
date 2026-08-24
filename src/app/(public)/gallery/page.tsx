'use client';

import React, { useState, useEffect } from 'react';
import { IGalleryItem } from '@/lib/types';
import { X, Image as ImageIcon, Sparkles, MessageSquare } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Real Store Displays & Photos
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Showroom & Product Gallery
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Browse real photographs of our hardware products, glass installations, marine plywood stocks and store displays in Old Pallavaram.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shrink-0">
          {filteredItems.length} Photographs
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2 shadow-sm">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-slate-800 font-bold">No images found in this category.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id || item._id}
              onClick={() => setLightboxImage(item)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-sm aspect-square flex flex-col justify-between"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute bottom-3 left-3 right-3 space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded uppercase">
                  {item.category}
                </span>
                <h4 className="text-white font-bold text-xs line-clamp-1">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal Overlay */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 focus:outline-none z-10 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-80 sm:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-2">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {lightboxImage.category}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {lightboxImage.title}
                </h3>
              </div>
              <a
                href={`https://wa.me/917871457430?text=Hello%20Mahaveer%20Hardware,%20I%20saw%20this%20image%20in%20your%20gallery:%20${encodeURIComponent(
                  lightboxImage.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition-colors flex items-center gap-1.5 shadow-md shrink-0"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
