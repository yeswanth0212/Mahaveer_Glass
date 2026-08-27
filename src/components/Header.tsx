'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, Search, ShoppingBag, ShieldCheck } from 'lucide-react';



export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      {/* Top Notification / Quick Contact Bar */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="truncate">No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a href="tel:7871457430" className="hover:text-white transition-colors flex items-center gap-1 font-medium">
              <Phone className="w-3 h-3 text-blue-400" />
              <span>78714 57430</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20have%20an%20enquiry" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <MessageSquare className="w-3 h-3 fill-emerald-400 text-slate-900" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <Image 
              src="/logo.png" 
              alt="Mahaveer Hardware" 
              width={44} 
              height={44} 
              className="rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                MAHAVEER
              </span>
              <span className="text-[10px] tracking-wider text-blue-600 font-bold uppercase -mt-0.5">
                Glass & Plywood Hardware
              </span>
            </div>
          </Link>

          {/* Search Bar - Modern Flipkart/Amazon Pill with Blue Border */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for Products, Locks, Plywood, Aldrops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-2 border-blue-500/60 focus:border-blue-600 focus:bg-white rounded-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
              />
              <Search className="w-4 h-4 text-blue-600 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Nav Actions */}
          <div className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
            <Link href="/gallery" className="hover:text-blue-600 transition-colors">Gallery</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search Bar (under logo on small screens) */}
        <form onSubmit={handleSearch} className="md:hidden pb-3 relative">
          <input
            type="text"
            placeholder="Search for Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-2 border-blue-500/70 focus:border-blue-600 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white shadow-sm"
          />
          <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 -mt-1.5" />
        </form>
      </div>



      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            All Products
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            About Us
          </Link>
          <Link
            href="/gallery"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            Showroom Gallery
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600"
          >
            Contact Store
          </Link>
          <div className="pt-3">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
            >
              Get a Quick Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
