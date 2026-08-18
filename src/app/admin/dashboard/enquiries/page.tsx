'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, Clock3 } from 'lucide-react';
import { IEnquiry } from '@/lib/types';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        setEnquiries(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'New' | 'Contacted' | 'Completed') => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchEnquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-2xl font-extrabold text-stone-100">Customer Enquiries</h1>
        <p className="text-xs text-stone-400 mt-1">Review website inquiries, customer phone leads and order requests.</p>
      </div>

      {loading ? (
        <div className="text-xs text-stone-400 py-12 text-center">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="p-12 text-center text-stone-400 text-xs bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
          <MessageSquare className="w-8 h-8 text-stone-600 mx-auto" />
          <p className="font-bold text-stone-300">No enquiries found.</p>
        </div>
      ) : (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Phone & Email</th>
                  <th className="px-6 py-3.5">Product Requirement</th>
                  <th className="px-6 py-3.5">Message</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {enquiries.map((e) => (
                  <tr key={e.id || e._id} className="hover:bg-stone-850 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-100">{e.name}</td>
                    <td className="px-6 py-4 space-y-1">
                      <a href={`tel:${e.phone}`} className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {e.phone}
                      </a>
                      {e.email && <p className="text-[10px] text-stone-400">{e.email}</p>}
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-200">{e.product || 'General'}</td>
                    <td className="px-6 py-4 text-stone-300 max-w-xs leading-relaxed">{e.message}</td>
                    <td className="px-6 py-4 text-[10px] text-stone-400">{e.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                          e.status === 'New'
                            ? 'bg-amber-950 border-amber-800 text-amber-400'
                            : e.status === 'Contacted'
                            ? 'bg-blue-950 border-blue-800 text-blue-400'
                            : 'bg-emerald-950 border-emerald-800 text-emerald-400'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <select
                        value={e.status}
                        onChange={(ev: any) => handleStatusChange(e.id || e._id || '', ev.target.value)}
                        className="py-1 px-2 bg-stone-950 border border-stone-800 rounded text-[11px] text-stone-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
