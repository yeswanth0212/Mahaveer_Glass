'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Layers, MessageSquare, Image as ImageIcon, ArrowRight, Plus, ExternalLink } from 'lucide-react';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalEnquiries: 0,
    totalGalleryImages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [resProd, resCat, resEnq, resGal] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/enquiries'),
          fetch('/api/gallery')
        ]);

        const prod = resProd.ok ? await resProd.json() : [];
        const cat = resCat.ok ? await resCat.json() : [];
        const enq = resEnq.ok ? await resEnq.json() : [];
        const gal = resGal.ok ? await resGal.json() : [];

        setStats({
          totalProducts: Array.isArray(prod) ? prod.length : 0,
          totalCategories: Array.isArray(cat) ? cat.length : 0,
          totalEnquiries: Array.isArray(enq) ? enq.length : 0,
          totalGalleryImages: Array.isArray(gal) ? gal.length : 0
        });
      } catch (err) {
        console.error('Failed loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
            Store Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time management for Mahaveer Glass & Plywood Hardware store catalog and customer requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/products"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/dashboard/products"
          className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Products</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-stone-100 group-hover:text-amber-400 transition-colors">
            {loading ? '...' : stats.totalProducts}
          </p>
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <span>Manage Catalog & Prices</span> <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </Link>

        <Link
          href="/admin/dashboard/categories"
          className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Categories</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-stone-100 group-hover:text-amber-400 transition-colors">
            {loading ? '...' : stats.totalCategories}
          </p>
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <span>Manage Categories</span> <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </Link>

        <Link
          href="/admin/dashboard/enquiries"
          className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Customer Enquiries</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-stone-100 group-hover:text-amber-400 transition-colors">
            {loading ? '...' : stats.totalEnquiries}
          </p>
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <span>View Recent Requests</span> <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </Link>

        <Link
          href="/admin/dashboard/gallery"
          className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all shadow-xl space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Gallery Photos</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-stone-100 group-hover:text-amber-400 transition-colors">
            {loading ? '...' : stats.totalGalleryImages}
          </p>
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <span>Manage Showroom Photos</span> <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </Link>
      </div>

      {/* Quick Info Box */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
        <h3 className="text-base font-bold text-stone-100">Live Website Sync</h3>
        <p className="text-xs text-stone-400 leading-relaxed">
          Any product created, price updated, or photo uploaded inside this admin dashboard automatically updates the public website in real-time. Unauthenticated customers visiting <code className="text-amber-400">/</code> will immediately see price adjustments made here.
        </p>
      </div>
    </div>
  );
}
