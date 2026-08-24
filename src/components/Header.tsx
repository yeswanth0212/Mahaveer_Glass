'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageSquare, Menu, X, ShieldCheck } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-xl text-white border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
      {/* Top Notification / Quick Contact Bar */}
      <div className="bg-black/50 px-4 py-2 border-b border-white/5 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:7871457430" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-white" />
              <span>78714 57430</span>
            </a>
            <a href="tel:7845559880" className="hidden md:inline hover:text-white transition-colors">
              78455 59880
            </a>
            <a 
              href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20have%20an%20enquiry" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-neutral-300 flex items-center gap-1 font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white text-black" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.png" 
              alt="Mahaveer Hardware" 
              width={48} 
              height={48} 
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-gray-300 transition-colors">
                MAHAVEER
              </span>
              <span className="text-xs tracking-wider text-neutral-400 font-medium uppercase">
                Glass & Plywood Hardware
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-neutral-400 hover:text-white font-medium transition-all duration-300 text-sm hover:-translate-y-0.5">
              Home
            </Link>
            <Link href="/products" className="text-neutral-400 hover:text-white font-medium transition-all duration-300 text-sm hover:-translate-y-0.5">
              Products
            </Link>
            <Link href="/about" className="text-neutral-400 hover:text-white font-medium transition-all duration-300 text-sm hover:-translate-y-0.5">
              About Us
            </Link>
            <Link href="/gallery" className="text-neutral-400 hover:text-white font-medium transition-all duration-300 text-sm hover:-translate-y-0.5">
              Gallery
            </Link>
            <Link href="/contact" className="text-neutral-400 hover:text-white font-medium transition-all duration-300 text-sm hover:-translate-y-0.5">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/contact" 
              className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 hover:-translate-y-0.5"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/gallery"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full py-3 rounded-lg bg-white text-black font-bold text-base shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
