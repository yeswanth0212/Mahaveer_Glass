import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-300 border-t border-white/10">
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
                className="rounded-lg shadow-md border border-neutral-800"
              />
              <span className="font-extrabold text-lg text-white">
                MAHAVEER
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Mahaveer Glass & Plywood Hardware is your trusted store in Old Pallavaram, Chennai for quality architectural glass, durable marine plywood, laminates, and premium door & furniture hardware.
            </p>
            <p className="text-xs text-neutral-500 font-medium">
              GST & Business Registration Available
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 group hover:translate-x-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" /> Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 group hover:translate-x-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" /> Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 group hover:translate-x-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 group hover:translate-x-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" /> Showroom Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-1.5 group hover:translate-x-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" /> Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider border-b border-white/10 pb-2">
              Product Categories
            </h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="hover:text-white transition-colors cursor-default">• Door & Cabinet Hardware</li>
              <li className="hover:text-white transition-colors cursor-default">• Rim Locks & Mortise Locks</li>
              <li className="hover:text-white transition-colors cursor-default">• S.S & Brass Tower Bolts</li>
              <li className="hover:text-white transition-colors cursor-default">• Brass & Stainless Steel Aldrops</li>
              <li className="hover:text-white transition-colors cursor-default">• Toughened Glass Fittings</li>
              <li className="hover:text-white transition-colors cursor-default">• Marine Plywood & Laminates</li>
              <li className="hover:text-white transition-colors cursor-default">• Modular Kitchen Accessories</li>
            </ul>
          </div>

          {/* Store Address & Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider border-b border-white/10 pb-2">
              Store Contact
            </h3>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span className="hover:text-white transition-colors">No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <a href="tel:7871457430" className="hover:text-white transition-colors">78714 57430</a>
                  <a href="tel:7845559880" className="hover:text-white transition-colors">78455 59880</a>
                  <a href="tel:9080457430" className="hover:text-white transition-colors">90804 57430</a>
                  <a href="tel:7845603776" className="hover:text-white transition-colors">78456 03776</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Mahaveer Glass & Plywood Hardware. All Rights Reserved.</p>
          <p className="text-neutral-600">Old Pallavaram, Chennai, Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  );
}
