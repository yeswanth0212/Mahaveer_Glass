import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle2, Building, Wrench } from 'lucide-react';

export const metadata = {
  title: 'About Us | Mahaveer Glass & Plywood Hardware',
  description: 'Learn about Mahaveer Glass & Plywood Hardware in Old Pallavaram, Chennai.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title Header */}
      <div className="max-w-3xl space-y-4 border-b border-stone-800 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Store Overview
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-100 tracking-tight">
          Mahaveer Glass & Plywood Hardware
        </h1>
        <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
          Located at No. 21, Chetty Street, Old Pallavaram, Chennai, our store provides architectural glass, commercial & marine plywood, decorative laminates, and door hardware solutions for home, office, interior and construction requirements.
        </p>
      </div>

      {/* Store Location & Core Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-stone-900 rounded-3xl border border-stone-800 p-8 space-y-6 shadow-xl">
          <h2 className="text-2xl font-bold text-stone-100">
            Products & Solutions Provided
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            We maintain inventory across multiple product categories to supply carpenters, interior designers, architects, building contractors, and homeowners across Chennai.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-850 space-y-1">
              <h4 className="text-amber-400 font-bold text-sm">Door Hardware & Locks</h4>
              <p className="text-xs text-stone-400">Keels (SS & Brass), Tower Bolts, Aldrops, Rim locks & Mortise handle locks (7", 8", 10").</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-850 space-y-1">
              <h4 className="text-amber-400 font-bold text-sm">Glass Hardware & Accessories</h4>
              <p className="text-xs text-stone-400">Glass patch fittings, spider fittings, hinges, wall clamps, and rubber door stoppers/magnets.</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-850 space-y-1">
              <h4 className="text-amber-400 font-bold text-sm">Plywood & Blockboards</h4>
              <p className="text-xs text-stone-400">BWP Marine Grade Plywood, Commercial Grade Plywood, alternate hardwood sheets for interior work.</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-850 space-y-1">
              <h4 className="text-amber-400 font-bold text-sm">Laminates & Kitchen Hardware</h4>
              <p className="text-xs text-stone-400">1mm High-pressure gloss laminates, modular kitchen tandem boxes, hydraulic soft-close hinges.</p>
            </div>
          </div>
        </div>

        {/* Location Quick Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl border border-stone-800 p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <Building className="w-6 h-6" />
              <h3 className="text-xl font-bold text-stone-100">Physical Store Location</h3>
            </div>
            <div className="space-y-3 text-sm text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117, Tamil Nadu</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>78714 57430</p>
                  <p>78455 59880</p>
                  <p>90804 57430</p>
                  <p>78456 03776</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col gap-3">
            <Link
              href="/contact"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl text-center shadow-md transition-colors"
            >
              Contact Store Team
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 p-8 sm:p-12 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
          Why Choose Mahaveer Glass & Plywood Hardware?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-stone-100 text-base">Wide range of hardware products</h4>
              <p className="text-xs text-stone-400 mt-1">Complete stocks of door keels, tower bolts, aldrops, rim locks, mortise handles, and door catches.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-stone-100 text-base">Convenient local location</h4>
              <p className="text-xs text-stone-400 mt-1">Located in Old Pallavaram, Chennai for quick walk-in purchases and site material dispatches.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-stone-100 text-base">Product enquiry support</h4>
              <p className="text-xs text-stone-400 mt-1">Immediate response on phone and WhatsApp regarding size, finish, and current pricing.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-stone-100 text-base">Multiple product categories</h4>
              <p className="text-xs text-stone-400 mt-1">Covering architectural glass fittings, marine grade plywood, laminates, and kitchen hardware.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-stone-100 text-base">Direct customer assistance</h4>
              <p className="text-xs text-stone-400 mt-1">Helping customers choose Antique, S.S, and Brass finish variants for door fittings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
