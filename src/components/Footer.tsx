import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail, ArrowUpRight, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Mahaveer Hardware" 
                width={40} 
                height={40} 
                className="rounded-xl shadow-sm border border-slate-700 bg-white"
              />
              <div>
                <span className="font-black text-lg text-white block">
                  MAHAVEER
                </span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  Glass & Plywood Hardware
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Trusted store in Old Pallavaram, Chennai for quality architectural glass, durable marine plywood, laminates, and premium door & furniture hardware.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              GST & Business Invoicing Available
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" /> Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" /> Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" /> About Store
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" /> Showroom Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" /> Contact & Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Hardware Categories
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Door & Cabinet Mortise Locks</li>
              <li>• Stainless Steel & Brass Keels</li>
              <li>• Heavy S.S & Brass Tower Bolts</li>
              <li>• Brass & S.S Aldrops (8", 10", 12")</li>
              <li>• Toughened Architectural Glass</li>
              <li>• IS:710 Marine Grade Plywood</li>
              <li>• Decorative High-Pressure Laminates</li>
            </ul>
          </div>

          {/* Store Address & Contact */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Store Contact
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-0.5">
                  <a href="tel:7871457430" className="hover:text-white transition-colors">78714 57430</a>
                  <a href="tel:7845559880" className="hover:text-white transition-colors">78455 59880</a>
                  <a href="tel:9080457430" className="hover:text-white transition-colors">90804 57430</a>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20have%20an%20enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Mahaveer Glass & Plywood Hardware. All Rights Reserved.</p>
          <p className="text-slate-500">Old Pallavaram, Chennai, Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  );
}
