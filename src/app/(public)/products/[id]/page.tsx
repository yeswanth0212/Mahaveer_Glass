'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, ArrowLeft, CheckCircle2, ShieldCheck, Tag, Star, Plus, Minus, Sparkles, Check } from 'lucide-react';
import { IProduct, IProductVariant } from '@/lib/types';
import { getClientProductById, setClientProducts } from '@/lib/clientProductStore';
import { computeProductPricing, formatWhatsAppEnquiryUrl } from '@/lib/pricingUtils';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Instant 0ms synchronous retrieval from client cache
  const cached = getClientProductById(id);
  const [product, setProduct] = useState<IProduct | null>(cached);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    if (cached?.variantsData && cached.variantsData.length > 0) {
      return cached.variantsData[0].id || cached.variantsData[0].name;
    }
    return cached?.variants?.[0] || '';
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data: IProduct = await res.json();
          setProduct(data);
          if (data.variantsData && data.variantsData.length > 0) {
            const currentSelected = data.variantsData.find(v => v.id === selectedVariantId || v.name === selectedVariantId);
            if (!currentSelected) {
              setSelectedVariantId(data.variantsData[0].id || data.variantsData[0].name);
            }
          } else if (data.variants && data.variants.length > 0 && !selectedVariantId) {
            setSelectedVariantId(data.variants[0]);
          }
        }
      } catch {
        // Keep cached product if fetch fails
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, selectedVariantId]);

  if (loading && !product) {
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

  // Dynamic pricing computation based on selected variant
  const pricing = computeProductPricing(product, selectedVariantId);
  const totalSellingPrice = pricing.sellingPrice * quantity;
  const totalBasePrice = pricing.basePrice * quantity;
  const totalSavings = pricing.discountAmount * quantity;

  // Enriched WhatsApp enquiry link
  const whatsappUrl = formatWhatsAppEnquiryUrl({
    product,
    selectedVariantName: pricing.variantName,
    quantity,
    businessWhatsApp: '917871457430'
  });

  const hasVariants = Boolean(
    (product.variantsData && product.variantsData.length > 0) ||
    (product.variants && product.variants.length > 1)
  );

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
            
            {/* Category badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-md border border-slate-200 text-xs font-bold text-slate-900 uppercase tracking-wider shadow-sm">
              {product.category}
            </div>

            {/* Discount Badge on Image */}
            {pricing.hasDiscount && (
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{pricing.discountPercentage}% OFF</span>
              </div>
            )}
            
            {/* Rating */}
            <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-emerald-700 text-white text-xs font-black flex items-center gap-1 shadow-md">
              <span>4.8</span>
              <Star className="w-3 h-3 fill-white text-emerald-700" />
            </div>

            {product.availability && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold uppercase">
                {product.availability}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Genuine Hardware
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Verified Retail Rates
            </span>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {product.name}
              </h1>
              {product.typeVariant && (
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {product.typeVariant}
                </p>
              )}
            </div>

            {/* Price Display Card (Dynamically updates when variant or quantity changes) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 to-slate-50 border border-blue-100/80 shadow-sm space-y-2">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">
                    Store Price {quantity > 1 ? `(${quantity} units)` : ''}
                  </span>
                  {pricing.hasDiscount && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs sm:text-sm text-slate-400 line-through">
                        MRP ₹{totalBasePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold rounded-full">
                        {pricing.discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-blue-700">
                    ₹{totalSellingPrice.toLocaleString('en-IN')}
                  </span>
                  {pricing.hasDiscount && (
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">
                      You Save ₹{totalSavings.toLocaleString('en-IN')} at Store
                    </p>
                  )}
                </div>
              </div>

              {pricing.variantName && (
                <div className="pt-2 border-t border-blue-100/60 flex items-center justify-between text-xs text-slate-600">
                  <span>Selected Option: <strong className="text-slate-900">{pricing.variantName}</strong></span>
                  <span className={`font-semibold ${pricing.inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {pricing.inStock ? '● In Stock & Ready for Delivery' : '○ Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Quantity / Size Variant Selector */}
            {hasVariants && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    <span>Select Quantity / Size / Variant:</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {(product.variantsData?.length || product.variants?.length)} Options Available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.variantsData && product.variantsData.length > 0 ? (
                    product.variantsData.map((v) => {
                      const isSelected = selectedVariantId === v.id || selectedVariantId === v.name;
                      const disc = v.basePrice > v.sellingPrice && v.basePrice > 0
                        ? Math.round(((v.basePrice - v.sellingPrice) / v.basePrice) * 100)
                        : 0;

                      return (
                        <button
                          key={v.id || v.name}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id || v.name)}
                          className={`p-3 rounded-2xl text-left border transition-all relative ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {v.name}
                            </p>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white shrink-0" />
                            )}
                          </div>

                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>
                              ₹{v.sellingPrice.toLocaleString('en-IN')}
                            </span>
                            {v.basePrice > v.sellingPrice && (
                              <span className={`text-[10px] line-through ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                ₹{v.basePrice}
                              </span>
                            )}
                          </div>

                          {disc > 0 && (
                            <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {disc}% OFF
                            </span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    product.variants?.map((v) => {
                      const isSelected = selectedVariantId === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariantId(v)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
              <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">
                Quantity:
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Decrease Quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1.5 text-xs font-black text-slate-900 bg-white min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Increase Quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h4 className="text-xs text-slate-700 font-bold uppercase tracking-wider">
                  Product Specifications & Features
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
                className="py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                Enquire via WhatsApp
              </a>
              <Link
                href={`/contact?product=${encodeURIComponent(product.name + (pricing.variantName ? ` - ${pricing.variantName}` : ''))}`}
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
              Direct Store Hotline: 78714 57430
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
