import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-yellow-700 flex items-center justify-center text-stone-950 font-bold text-lg shadow-md border border-amber-500/40">
                M
              </div>
              <span className="font-extrabold text-lg text-stone-100">
                MAHAVEER
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Mahaveer Glass & Plywood Hardware is your trusted store in Old Pallavaram, Chennai for quality architectural glass, durable marine plywood, laminates, and premium door & furniture hardware.
            </p>
            <p className="text-xs text-stone-500 font-medium">
              GST & Business Registration Available
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-stone-100 font-bold text-base uppercase tracking-wider text-amber-500 border-b border-stone-800 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /> Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /> Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /> Showroom Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /> Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-stone-100 font-bold text-base uppercase tracking-wider text-amber-500 border-b border-stone-800 pb-2">
              Product Categories
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>• Door & Cabinet Hardware</li>
              <li>• Rim Locks & Mortise Locks</li>
              <li>• S.S & Brass Tower Bolts</li>
              <li>• Brass & Stainless Steel Aldrops</li>
              <li>• Toughened Glass Fittings</li>
              <li>• Marine Plywood & Laminates</li>
              <li>• Modular Kitchen Accessories</li>
            </ul>
          </div>

          {/* Store Address & Contact */}
          <div className="space-y-4">
            <h3 className="text-stone-100 font-bold text-base uppercase tracking-wider text-amber-500 border-b border-stone-800 pb-2">
              Store Contact
            </h3>
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <a href="tel:7871457430" className="hover:text-amber-400 transition-colors">78714 57430</a>
                  <a href="tel:7845559880" className="hover:text-amber-400 transition-colors">78455 59880</a>
                  <a href="tel:9080457430" className="hover:text-amber-400 transition-colors">90804 57430</a>
                  <a href="tel:7845603776" className="hover:text-amber-400 transition-colors">78456 03776</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-900 text-center text-xs text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Mahaveer Glass & Plywood Hardware. All Rights Reserved.</p>
          <p className="text-stone-600">Old Pallavaram, Chennai, Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  );
}
