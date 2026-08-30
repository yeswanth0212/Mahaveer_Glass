'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  DoorOpen, 
  Lock, 
  Layers, 
  Sparkles,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Award,
  Users,
  ShieldCheck,
  Zap,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import PriceListTable from '@/components/PriceListTable';
import { INITIAL_CATEGORIES } from '@/lib/seedData';
import { IProduct } from '@/lib/types';
import { getClientProducts, setClientProducts } from '@/lib/clientProductStore';
import { getVariantPriceRange, formatWhatsAppEnquiryUrl } from '@/lib/pricingUtils';

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>(getClientProducts());
  const [categories, setCategories] = useState<any[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    async function loadData() {
      try {
        const [resP, resC] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        if (resP.ok) {
          const data = await resP.json();
          if (Array.isArray(data)) {
            setProducts(data);
            setClientProducts(data);
          }
        }
        if (resC.ok) {
          const catData = await resC.json();
          if (Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
          }
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    }
    loadData();
  }, []);

  const quickLookItems = [
    { title: 'Brass Locks', sub: 'Mortise & Rim', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=80', href: '/products?category=Locks%20%26%20Mortise' },
    { title: 'Tower Bolts', sub: 'S.S & Brass', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400&auto=format&fit=crop&q=80', href: '/products?category=Tower%20Bolts' },
    { title: 'Brass Aldrops', sub: 'Antique & Gold', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80', href: '/products?category=Brass%20Aldrops' },
    { title: 'Marine Plywood', sub: 'IS:710 Grade', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80', href: '/products?category=Plywood%20%26%20Laminates' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16 space-y-8 sm:space-y-12">

      {/* 1. HERO PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-6 sm:p-12 overflow-hidden shadow-xl shadow-blue-500/10">
          {/* Subtle background circles */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute top-0 right-1/3 w-60 h-60 bg-blue-400/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                No. 1 Hardware Store in Old Pallavaram, Chennai
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Premium Glass, Marine Plywood & Architectural Hardware
              </h1>

              <p className="text-blue-100 text-xs sm:text-base max-w-2xl leading-relaxed">
                Direct wholesale & retail stocks of Brass Keels, Aldrops, Mortise Locks, Toughened Glass fittings and heavy-duty hinges at the best market prices.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-full bg-white text-blue-700 font-extrabold text-xs sm:text-sm hover:bg-blue-50 shadow-lg shadow-black/10 transition-all flex items-center gap-2 active:scale-95"
                >
                  Explore All Products
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20am%20interested%20in%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-white text-emerald-500" />
                  WhatsApp Us
                </a>

                <a
                  href="tel:7871457430"
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  78714 57430
                </a>
              </div>
            </div>

            {/* Hero Quick Highlight Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-2xl text-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Fast Enquiry</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Store Open Today
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Call or visit our Chennai store for on-the-spot quotes for carpenters, interior designers and builders.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Mortise Locks</span>
                    <span className="font-bold text-slate-900">From ₹1,200</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Brass Aldrops (10")</span>
                    <span className="font-bold text-slate-900">From ₹450</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Marine Plywood</span>
                    <span className="font-bold text-slate-900">Wholesale Rates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "STILL LOOKING FOR THESE?" (FLIPKART STYLE CONTAINER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-100/90 border border-blue-100 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Still looking for these?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Popular categories frequently checked by Chennai customers</p>
            </div>
            <Link 
              href="/products" 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickLookItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">
                    {item.sub}
                  </p>
                  <span className="text-[11px] font-bold text-blue-600 mt-1 inline-block">
                    View Store →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "SUGGESTED FOR YOU" PRODUCT CARDS */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Suggested For You
              </h2>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                Best Sellers
              </span>
            </div>

            <Link
              href="/products"
              className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md shadow-slate-900/10"
              title="Browse all products"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid with Rating Pills & Price Format */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {products.slice(0, 10).map((product) => {
              const range = getVariantPriceRange(product);
              const whatsappLink = formatWhatsAppEnquiryUrl({
                product,
                selectedVariantName: product.variantsData?.[0]?.name || product.variants?.[0] || undefined,
                quantity: 1,
                businessWhatsApp: '917871457430'
              });

              return (
                <div
                  key={product.id || product._id}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 p-3 flex flex-col justify-between"
                >
                  {/* Clickable Card Area */}
                  <Link href={`/products/${product.id || product._id}`} className="block cursor-pointer">
                    {/* Product Image Box with Rating Badge */}
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

                      {/* Stock pill */}
                      {product.availability && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase">
                          {product.availability}
                        </span>
                      )}
                    </div>

                    {/* Product Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Variant Tag */}
                    {product.typeVariant && (
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {product.typeVariant}
                      </p>
                    )}

                    {/* Variant Count Badge */}
                    {range.hasVariants && (
                      <div className="mt-1">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                          {range.variantCount} Variants
                        </span>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="mt-2 space-y-0.5">
                      {range.isRange ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-slate-900">
                              From ₹{range.minPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400">– ₹{range.maxPrice.toLocaleString('en-IN')}</span>
                          </div>
                          {range.maxDiscountPercentage > 0 && (
                            <p className="text-[11px] font-bold text-emerald-600">
                              Save up to {range.maxDiscountPercentage}% OFF
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            {range.maxDiscountPercentage > 0 && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{Math.round(range.minPrice * 100 / (100 - range.maxDiscountPercentage)).toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-sm font-black text-slate-900">
                              ₹{range.minPrice.toLocaleString('en-IN')}
                            </span>
                            {range.maxDiscountPercentage > 0 && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded">
                                {range.maxDiscountPercentage}% OFF
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-blue-600">
                            ₹{range.minPrice.toLocaleString('en-IN')} at Store
                          </p>
                        </>
                      )}
                    </div>
                  </Link>

                  {/* Card Action Button */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex gap-1.5">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Enquire
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. EXPLORE CATEGORIES GRID */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Shop By Product Category
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Direct store supply in Old Pallavaram, Chennai</p>
              </div>
              <Link href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id || cat.name}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                      {cat.name.includes('Lock') ? <Lock className="w-5 h-5" /> :
                       cat.name.includes('Plywood') || cat.name.includes('Laminates') ? <Layers className="w-5 h-5" /> :
                       <DoorOpen className="w-5 h-5" />}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Browse Products <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CURRENT PRICE LIST TABLE */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PriceListTable products={products} />
        </section>
      )}

      {/* 6. WHY CHOOSE MAHAVEER & LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Chennai Hardware Distributor</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Visit Our Old Pallavaram Store
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Situated at No. 21, Chetty Street, Old Pallavaram. We stock complete hardware lines, toughened glass keels, marine plywood, and locks for contractors, carpenters, and homeowners.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="tel:7871457430"
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Phone className="w-4 h-4" />
                  Call 78714 57430
                </a>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  Store Directions →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-slate-900">
              <div className="p-4 rounded-2xl bg-white space-y-1">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h4 className="font-extrabold text-xs">Quality Hardware</h4>
                <p className="text-[11px] text-slate-500">Brass & Stainless Steel</p>
              </div>
              <div className="p-4 rounded-2xl bg-white space-y-1">
                <Award className="w-6 h-6 text-blue-600" />
                <h4 className="font-extrabold text-xs">Best Pricing</h4>
                <p className="text-[11px] text-slate-500">Direct Wholesale Rates</p>
              </div>
              <div className="p-4 rounded-2xl bg-white space-y-1">
                <Zap className="w-6 h-6 text-blue-600" />
                <h4 className="font-extrabold text-xs">Instant Stock</h4>
                <p className="text-[11px] text-slate-500">Ready in Store</p>
              </div>
              <div className="p-4 rounded-2xl bg-white space-y-1">
                <Users className="w-6 h-6 text-blue-600" />
                <h4 className="font-extrabold text-xs">Contractor Deals</h4>
                <p className="text-[11px] text-slate-500">Special Bulk Quotes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
