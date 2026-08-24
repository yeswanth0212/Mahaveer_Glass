'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MessageSquare, Phone, CheckCircle2, ChevronRight, Layers, Star, Sparkles } from 'lucide-react';
import { IProduct, ICategory } from '@/lib/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/seedData';

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'All';
  const initialSearchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState<IProduct[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<ICategory[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState(initialSearchParam);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [resProd, resCat] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        if (resProd.ok) {
          const prodData = await resProd.json();
          if (Array.isArray(prodData) && prodData.length > 0) {
            setProducts(prodData);
          }
        }
        if (resCat.ok) {
          const catData = await resCat.json();
          if (Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
          }
        }
      } catch (err) {
        console.error('Error loading catalog data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'All');
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.typeVariant && p.typeVariant.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hardware & Glass Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse our complete range of door locks, tower bolts, keels, aldrops, marine plywood and glass hardware.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shrink-0">
          {filteredProducts.length} Items Available
        </div>
      </div>

      {/* Search Bar & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Field */}
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
          <input
            type="text"
            placeholder="Search by product name, e.g. Mortise Lock, Brass Aldrop, Keel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border-2 border-blue-500/60 focus:border-blue-600 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 text-xs sm:text-sm shadow-sm transition-all"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <label className="text-xs text-slate-500 whitespace-nowrap font-bold">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="default">Featured / Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'All'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          All Products ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-xs font-semibold">Loading catalog...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3 shadow-sm">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-slate-800 font-bold text-lg">No products found</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            No products match your current search or category filter. Try clearing your search query or choosing another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Products Grid (Clean Flipkart Style) */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map((product) => {
            const originalPrice = Math.round(product.price * 1.25);
            const encodedMsg = encodeURIComponent(
              `Hello Mahaveer Glass & Plywood Hardware, I am interested in ${product.name}. Please confirm price and availability.`
            );
            const whatsappLink = `https://wa.me/917871457430?text=${encodedMsg}`;

            return (
              <div
                key={product.id || product._id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 p-3 flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-3">
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Rating Pill */}
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-black flex items-center gap-0.5 shadow-md">
                      <span>4.6</span>
                      <Star className="w-2.5 h-2.5 fill-white text-emerald-700" />
                    </div>

                    {/* Category tag */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-slate-800 text-[9px] font-bold uppercase shadow-sm">
                      {product.category}
                    </span>

                    {/* Stock pill */}
                    {product.availability && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase">
                        {product.availability}
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <Link href={`/products/${product.id || product._id}`}>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Variant Tag */}
                  {product.typeVariant && (
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {product.typeVariant}
                    </p>
                  )}

                  {/* Pricing */}
                  <div className="mt-2 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-blue-600">
                      Buy at ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex gap-1.5">
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors text-center"
                  >
                    Details
                  </Link>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading Catalog...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
