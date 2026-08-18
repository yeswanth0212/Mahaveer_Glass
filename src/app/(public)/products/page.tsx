'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MessageSquare, Phone, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { IProduct, ICategory } from '@/lib/types';


function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Title Header */}
      <div className="border-b border-stone-800 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
          Glass, Plywood & Hardware Catalog
        </h1>
        <p className="text-stone-400 text-sm sm:text-base">
          Browse our complete range of door locks, tower bolts, keels, aldrops, marine plywood and glass hardware.
        </p>
      </div>

      {/* Search Bar & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Field */}
        <div className="md:col-span-8 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by product name, e.g., Mortise Lock, Brass Aldrop, Keel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <label className="text-xs text-stone-400 whitespace-nowrap font-medium">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full py-3 px-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="default">Featured / Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
            selectedCategory === 'All'
              ? 'bg-amber-500 text-stone-950 border-amber-500'
              : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
          }`}
        >
          All Products ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-400 text-sm">Loading products...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-stone-900/60 rounded-2xl border border-stone-800 p-8 space-y-3">
          <Layers className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="text-stone-200 font-bold text-lg">No products available.</h3>
          <p className="text-stone-400 text-sm max-w-md mx-auto">
            No products match your current search or category filter. Try clearing your search query or choosing another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Cards Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const encodedMsg = encodeURIComponent(
              `Hello Mahaveer Glass & Plywood Hardware, I am interested in ${product.name}. Please provide more details and availability.`
            );
            const whatsappLink = `https://wa.me/917871457430?text=${encodedMsg}`;

            return (
              <div
                key={product.id || product._id}
                className="group bg-stone-900 rounded-2xl border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-48 sm:h-52 bg-stone-950 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-950/80 backdrop-blur-md rounded-md border border-stone-800 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {product.category}
                    </div>
                    {product.availability && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-950/90 border border-emerald-700/60 rounded text-[10px] font-bold text-emerald-400">
                        {product.availability}
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="p-5 space-y-3">
                    <Link href={`/products/${product.id || product._id}`}>
                      <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {product.typeVariant && (
                      <p className="text-xs text-amber-500/90 font-medium">
                        Variant: {product.typeVariant}
                      </p>
                    )}

                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="pt-2 border-t border-stone-850 flex items-baseline justify-between">
                      <span className="text-xs text-stone-500">Price</span>
                      <span className="text-lg font-extrabold text-amber-400">
                        {product.priceDisplay || `₹${product.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <Link
                    href={`/products/${product.id || product._id}`}
                    className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-stone-700"
                  >
                    View Specifications & Details
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/contact?product=${encodeURIComponent(product.name)}`}
                      className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors text-center shadow-md"
                    >
                      Enquire Now
                    </Link>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center flex items-center justify-center gap-1 shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600" />
                      WhatsApp
                    </a>
                  </div>
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
    <Suspense fallback={<div className="p-12 text-center text-stone-400 text-sm">Loading Catalog...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
