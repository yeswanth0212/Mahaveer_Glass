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
    <div className="space-y-12">
      {/* Standard Door Hardware Price List */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-stone-800 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-stone-100">
              Door Hardware Current Price List
            </h3>
            <p className="text-sm text-stone-400 mt-1">
              Transparent, competitive retail rates at Mahaveer Glass & Plywood Hardware.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
            In-Store Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-300">
            <thead className="bg-stone-950 text-stone-400 uppercase text-xs tracking-wider border-b border-stone-800">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-lg">Product Description</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-lg">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {PRICE_LIST_ITEMS.map((item, index) => (
                <tr key={index} className="hover:bg-stone-850 transition-colors">
                  <td className="px-6 py-4 font-semibold text-stone-100">{item.name}</td>
                  <td className="px-6 py-4 text-stone-400">{item.category}</td>
                  <td className="px-6 py-4 font-bold text-amber-400 text-right text-base">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mortise Locks & Estimate Items Table */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-stone-800 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-stone-100">
              Mortise Locks & Finish Variants
            </h3>
            <p className="text-sm text-stone-400 mt-1">
              Available in Antique, Stainless Steel (S.S), and Polished Brass finishes.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-300">
            <thead className="bg-stone-950 text-stone-400 uppercase text-xs tracking-wider border-b border-stone-800">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-lg">Mortise Lock Model</th>
                <th scope="col" className="px-6 py-4">Type / Available Variants</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {ESTIMATE_ITEMS.map((item, index) => (
                <tr key={index} className="hover:bg-stone-850 transition-colors">
                  <td className="px-6 py-4 font-semibold text-stone-100">{item.name}</td>
                  <td className="px-6 py-4 text-stone-300 font-medium">
                    <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700 text-xs">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-400 text-right text-base">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
