import React from 'react';
import Link from 'next/link';
import { IProduct } from '@/lib/types';
import { getVariantPriceRange } from '@/lib/pricingUtils';

interface PriceListTableProps {
  products?: IProduct[];
}

export default function PriceListTable({ products = [] }: PriceListTableProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Products with variant finish/models
  const variantProducts = products.filter(p => 
    (p.variantsData && p.variantsData.length > 0) || (p.variants && p.variants.length > 0)
  );

  return (
    <div className="space-y-8">
      {/* Standard Door Hardware Price List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Door Hardware Store Price List
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent, competitive retail rates at Mahaveer Glass & Plywood Hardware.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
            ✓ In-Store Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3.5 rounded-tl-xl">Product Description</th>
                <th scope="col" className="px-6 py-3.5">Category</th>
                <th scope="col" className="px-6 py-3.5 text-right rounded-tr-xl">Store Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {products.map((item) => {
                const range = getVariantPriceRange(item);
                const priceStr = range.isRange 
                  ? `₹${range.minPrice.toLocaleString('en-IN')} – ₹${range.maxPrice.toLocaleString('en-IN')}`
                  : `₹${range.minPrice.toLocaleString('en-IN')}`;

                return (
                  <tr key={item.id || item._id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      <Link href={`/products/${item.id || item._id}`} className="hover:text-blue-600">
                        {item.name}
                      </Link>
                      {item.typeVariant && (
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {item.typeVariant}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{item.category}</td>
                    <td className="px-6 py-3.5 font-black text-blue-600 text-right">{priceStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mortise Locks & Variants Table if any exist */}
      {variantProducts.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Product Options & Finish Variants
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Available models, dimensions and finish specifications.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5 rounded-tl-xl">Product Model</th>
                  <th scope="col" className="px-6 py-3.5">Type / Available Variants</th>
                  <th scope="col" className="px-6 py-3.5 text-right rounded-tr-xl">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {variantProducts.map((item) => {
                  const variantsText = item.variantsData && item.variantsData.length > 0
                    ? item.variantsData.map(v => `${v.name} (₹${v.sellingPrice})`).join(' · ')
                    : item.variants?.join(' · ') || item.typeVariant || 'Standard';

                  const range = getVariantPriceRange(item);
                  const priceStr = range.isRange 
                    ? `From ₹${range.minPrice.toLocaleString('en-IN')}`
                    : `₹${range.minPrice.toLocaleString('en-IN')}`;

                  return (
                    <tr key={item.id || item._id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-900">
                        <Link href={`/products/${item.id || item._id}`} className="hover:text-blue-600">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                          {variantsText}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-black text-blue-600 text-right">{priceStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
