import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  DoorOpen, 
  Lock, 
  Layers, 
  Sparkles,
  Wrench,
  ChevronRight
} from 'lucide-react';
import PriceListTable from '@/components/PriceListTable';
import { INITIAL_CATEGORIES } from '@/lib/seedData';

export const metadata = {
  title: 'Mahaveer Glass & Plywood Hardware | Old Pallavaram, Chennai',
  description: 'Quality glass, marine plywood, laminates, door locks, hinges, aldrops, tower bolts and architectural hardware store in Old Pallavaram, Chennai.',
};

export default function HomePage() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1917_1px,transparent_1px),linear-gradient(to_bottom,#1f1917_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400" />
                MAHAVEER GLASS & PLYWOOD HARDWARE
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-100 leading-[1.15]">
                Quality Glass, Plywood & Hardware <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">Under One Roof</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Reliable products, quality hardware and trusted service for your home, office and commercial projects. Serving Old Pallavaram and all across Chennai.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-950/40 transition-all flex items-center gap-2 active:scale-95"
                >
                  View Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="px-7 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-base border border-stone-700 transition-all active:scale-95"
                >
                  Get a Quote
                </Link>
                <a
                  href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20am%20interested%20in%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/30"
                >
                  <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
                  WhatsApp Us
                </a>
              </div>

              {/* Phone Quick Access */}
              <div className="pt-4 border-t border-stone-850 flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1 font-semibold text-stone-300">
                  <Phone className="w-3.5 h-3.5 text-amber-500" /> Store Hotline:
                </span>
                <a href="tel:7871457430" className="hover:text-amber-400">78714 57430</a>
                <span>•</span>
                <a href="tel:7845559880" className="hover:text-amber-400">78455 59880</a>
                <span>•</span>
                <a href="tel:9080457430" className="hover:text-amber-400">90804 57430</a>
              </div>
            </div>

            {/* Hero Right Hardware Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-amber-900/30 shadow-2xl bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80"
                  alt="Mahaveer Glass and Hardware Store Display"
                  className="w-full h-80 sm:h-96 object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700/60 shadow-lg">
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Chennai Store</p>
                  <h4 className="text-stone-100 font-bold text-base mt-0.5">No. 21, Chetty Street, Old Pallavaram</h4>
                  <p className="text-stone-300 text-xs mt-1">Complete stocks of Brass Keels, Aldrops, Mortise Locks & Marine Plywood</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
            Explore Product Categories
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            From heavy door brass locks to high-pressure laminates and architectural toughened glass fittings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {INITIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group p-6 rounded-2xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-stone-800 group-hover:bg-amber-500/10 border border-stone-700 group-hover:border-amber-500/30 flex items-center justify-center text-amber-500 transition-colors">
                  {cat.name.includes('Lock') ? <Lock className="w-6 h-6" /> :
                   cat.name.includes('Plywood') || cat.name.includes('Laminates') ? <Layers className="w-6 h-6" /> :
                   <DoorOpen className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-stone-800 flex items-center text-xs font-semibold text-amber-500 group-hover:translate-x-1 transition-transform">
                View Category Products <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CURRENT PRICE LIST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriceListTable />
      </section>

      {/* 4. WHY CHOOSE MAHAVEER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-850 rounded-3xl border border-stone-800 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl space-y-4 mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-100">
              Why Choose Mahaveer Glass & Plywood Hardware?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              We provide glass, plywood and hardware products for home, office, interior and construction-related requirements in Old Pallavaram, Chennai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                1
              </div>
              <h3 className="text-stone-100 font-bold text-base">Wide Range of Hardware Products</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Stocking S.S & Brass keels, tower bolts, aldrops, rim locks, mortise locks, door stoppers, and magnetic catchers under one roof.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                2
              </div>
              <h3 className="text-stone-100 font-bold text-base">Convenient Local Location</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Situated at No. 21, Chetty Street, Old Pallavaram, easily accessible for local contractors, carpenters, home owners and builders.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                3
              </div>
              <h3 className="text-stone-100 font-bold text-base">Product Enquiry Support</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Direct phone and WhatsApp assistance to verify product specifications, exact dimensions, finish variants and current prices.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                4
              </div>
              <h3 className="text-stone-100 font-bold text-base">Multiple Product Categories</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Solutions covering marine plywood, decorative high pressure laminates, toughened architectural glass, and modular kitchen hardware.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                5
              </div>
              <h3 className="text-stone-100 font-bold text-base">Direct Customer Assistance</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Personalized service to help you select the exact hardware grade, mortise lock sizes (7", 8", 10"), and finish variants (Antique / S.S / Brass).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOCATION & CONTACT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 text-stone-950 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Visit Our Store or Send an Enquiry
            </h2>
            <p className="text-stone-900 text-sm sm:text-base font-medium max-w-xl">
              No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117. Call us directly for bulk contractor quotes and custom requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0 justify-center">
            <a
              href="tel:7871457430"
              className="px-6 py-3 rounded-xl bg-stone-950 text-stone-100 font-bold text-sm hover:bg-stone-900 transition-colors shadow-lg flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              Call 78714 57430
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-amber-200 text-stone-950 font-bold text-sm hover:bg-white transition-colors shadow-md"
            >
              Get Store Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
