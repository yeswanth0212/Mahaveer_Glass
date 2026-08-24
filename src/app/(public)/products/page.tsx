'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MessageSquare, Phone, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { IProduct, ICategory } from '@/lib/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/seedData';

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<IProduct[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<ICategory[]>(INITIAL_CATEGORIES);
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
      <div className="border-b border-white/10 pb-6 space-y-2 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight relative z-10">
          Glass, Plywood & Hardware Catalog
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base relative z-10">
          Browse our complete range of door locks, tower bolts, keels, aldrops, marine plywood and glass hardware.
        </p>
      </div>

      {/* Search Bar & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Field */}
        <div className="md:col-span-8 relative group">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search by product name, e.g., Mortise Lock, Brass Aldrop, Keel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 text-sm transition-all shadow-inner"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <label className="text-xs text-neutral-400 whitespace-nowrap font-medium">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full py-3 px-3 bg-neutral-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all shadow-inner"
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
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
            selectedCategory === 'All'
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
              : 'bg-black text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
          }`}
        >
          All Products ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'bg-black text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          <p className="text-neutral-400 text-sm animate-pulse">Loading products...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-neutral-900/40 backdrop-blur-sm rounded-2xl border border-white/5 p-8 space-y-3 shadow-inner">
          <Layers className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-white font-bold text-lg">No products available.</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            No products match your current search or category filter. Try clearing your search query or choosing another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-white/10 transition-colors"
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
                className="group bg-neutral-900/40 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col justify-between hover:-translate-y-1 relative"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
                
                <div className="relative z-10">
                  {/* Product Image */}
                  <div className="relative h-48 sm:h-52 bg-black overflow-hidden border-b border-white/5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                      {product.category}
                    </div>
                    {product.availability && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-900/90 border border-neutral-700 rounded text-[10px] font-bold text-neutral-300">
                        {product.availability}
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="p-5 space-y-3">
                    <Link href={`/products/${product.id || product._id}`}>
                      <h3 className="text-base font-bold text-white group-hover:text-neutral-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {product.typeVariant && (
                      <p className="text-xs text-neutral-400 font-medium">
                        Variant: {product.typeVariant}
                      </p>
                    )}

                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                      {product.shortDescription}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                      <span className="text-xs text-neutral-500">Price</span>
                      <span className="text-lg font-extrabold text-white">
                        {product.priceDisplay || `₹${product.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 space-y-2 relative z-10">
                  <Link
                    href={`/products/${product.id || product._id}`}
                    className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10 hover:border-white/30"
                  >
                    View Specifications & Details
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/contact?product=${encodeURIComponent(product.name)}`}
                      className="py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-colors text-center shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                      Enquire Now
                    </Link>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs transition-colors text-center flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
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
