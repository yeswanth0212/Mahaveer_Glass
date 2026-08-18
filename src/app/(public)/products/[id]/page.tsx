'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, ArrowLeft, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { IProduct } from '@/lib/types';


import { INITIAL_PRODUCTS } from '@/lib/seedData';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const initialProd = INITIAL_PRODUCTS.find(p => p.id === id || p._id === id) || null;
  const [product, setProduct] = useState<IProduct | null>(initialProd);
  const [selectedVariant, setSelectedVariant] = useState<string>(initialProd?.variants?.[0] || '');
  const [loading, setLoading] = useState(!initialProd);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.variants && data.variants.length > 0 && !selectedVariant) {
            setSelectedVariant(data.variants[0]);
          }
        }
      } catch {
        // Keep initial product if fetch fails
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-stone-400 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-100">Product not found.</h2>
        <p className="text-stone-400 text-sm">The product you are looking for may have been updated or removed.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const encodedMsg = encodeURIComponent(
    `Hello Mahaveer Glass & Plywood Hardware, I am interested in ${product.name}${
      selectedVariant ? ` (${selectedVariant})` : ''
    }. Please provide more details and availability.`
  );
  const whatsappUrl = `https://wa.me/917871457430?text=${encodedMsg}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 h-80 sm:h-96">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-stone-950/90 rounded-md border border-stone-800 text-xs font-bold text-amber-400 uppercase tracking-wider">
              {product.category}
            </div>
            {product.availability && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-950/90 border border-emerald-700/60 rounded text-xs font-bold text-emerald-400">
                {product.availability}
              </div>
            )}
          </div>
          <p className="text-xs text-stone-500 text-center">
            * Visit store for exact color and finish inspection.
          </p>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Category: {product.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price Badge */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-400 font-medium">Retail Price</span>
              <span className="text-2xl font-extrabold text-amber-400">
                {product.priceDisplay || `Starting from ₹${product.price.toLocaleString('en-IN')}`}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-stone-300 text-sm leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
                  Available Variants / Finishes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedVariant === v
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                          : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <h4 className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                  Product Specifications
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {product.specifications.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                WhatsApp Enquiry
              </a>
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all text-center shadow-lg shadow-amber-950/30"
              >
                Submit Form Enquiry
              </Link>
            </div>

            <a
              href="tel:7871457430"
              className="w-full py-3 px-4 rounded-xl bg-stone-950 hover:bg-stone-850 text-stone-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-stone-800"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              Direct Store Call: 78714 57430
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
