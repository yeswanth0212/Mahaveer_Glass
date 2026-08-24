import React from 'react';

const PRICE_LIST_ITEMS = [
  { name: '5" S.S Keel', price: '₹110', category: 'Door Hardware' },
  { name: '5" Brass Keel', price: '₹360', category: 'Door Hardware' },
  { name: '6" S.S Tower Bolt', price: '₹85', category: 'Tower Bolts' },
  { name: '8" S.S Tower Bolt', price: '₹98', category: 'Tower Bolts' },
  { name: '6" T.B Brass Tower Bolt', price: '₹240', category: 'Tower Bolts' },
  { name: '8" T.B Brass Tower Bolt', price: '₹280', category: 'Tower Bolts' },
  { name: 'S.S Door Stopper', price: '₹75', category: 'Door Stoppers' },
  { name: 'Ant Door Stopper', price: '₹290', category: 'Door Stoppers' },
  { name: 'Rim Lock', price: '₹3,100', category: 'Locks' },
  { name: 'Smart Rim Lock', price: '₹1,500', category: 'Locks' },
  { name: '10" S.S Aldrop', price: '₹260', category: 'Aldrops' },
  { name: '10" Brass Aldrop', price: '₹980', category: 'Aldrops' },
  { name: 'Door Magnet', price: '₹95', category: 'Door Magnets' },
];

const ESTIMATE_ITEMS = [
  { name: '7" Mortise Lock', type: 'KY - Antique / S.S', price: '₹650' },
  { name: '8" Mortise Lock', type: 'KY - Antique / S.S', price: '₹750' },
  { name: '8" Mortise Lock', type: 'CY - Antique / S.S / Brass', price: '₹1,800' },
  { name: '10" Mortise Lock', type: 'CY - Antique / S.S / Brass', price: '₹2,800' },
];

export default function PriceListTable() {
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
              {PRICE_LIST_ITEMS.map((item, index) => (
                <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-6 py-3.5 text-slate-500">{item.category}</td>
                  <td className="px-6 py-3.5 font-black text-blue-600 text-right">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mortise Locks & Estimate Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Mortise Locks & Finish Variants
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Available in Antique, Stainless Steel (S.S), and Polished Brass finishes.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3.5 rounded-tl-xl">Mortise Lock Model</th>
                <th scope="col" className="px-6 py-3.5">Type / Available Variants</th>
                <th scope="col" className="px-6 py-3.5 text-right rounded-tr-xl">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ESTIMATE_ITEMS.map((item, index) => (
                <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-black text-blue-600 text-right">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
