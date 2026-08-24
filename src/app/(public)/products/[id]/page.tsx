'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, ArrowLeft, CheckCircle2, ShieldCheck, Tag, Star } from 'lucide-react';
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
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product not found.</h2>
        <p className="text-slate-500 text-sm">The product you are looking for may have been updated or removed.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-full text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

  const originalPrice = Math.round(product.price * 1.25);
  const encodedMsg = encodeURIComponent(
    `Hello Mahaveer Glass & Plywood Hardware, I am interested in ${product.name}${
      selectedVariant ? ` (${selectedVariant})` : ''
    }. Please provide more details and current availability.`
  );
  const whatsappUrl = `https://wa.me/917871457430?text=${encodedMsg}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-xs sm:text-sm font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 aspect-square">
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-md border border-slate-200 text-xs font-bold text-slate-900 uppercase tracking-wider shadow-sm">
              {product.category}
            </div>
            
            {/* Rating */}
            <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-emerald-700 text-white text-xs font-black flex items-center gap-1 shadow-md">
              <span>4.6</span>
              <Star className="w-3 h-3 fill-white text-emerald-700" />
            </div>

            {product.availability && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold uppercase">
                {product.availability}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 text-center">
            * Visit store for exact color inspection & immediate physical delivery.
          </p>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Category: {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price Badge */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Store Price</span>
                <span className="text-xs text-slate-400 line-through">
                  MRP ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-blue-600">
                  {product.priceDisplay || `₹${product.price.toLocaleString('en-IN')}`}
                </span>
                <p className="text-[11px] font-bold text-emerald-700">Save ~20% at Store</p>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block">
                  Available Variants / Finishes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        selectedVariant === v
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
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
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h4 className="text-xs text-slate-700 font-bold uppercase tracking-wider">
                  Product Specifications
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {product.specifications.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                WhatsApp Enquiry
              </a>
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all text-center shadow-md shadow-blue-500/20"
              >
                Request Store Quote
              </Link>
            </div>

            <a
              href="tel:7871457430"
              className="w-full py-2.5 px-4 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Store Hotline: 78714 57430
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
