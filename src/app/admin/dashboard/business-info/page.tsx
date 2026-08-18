'use client';

import React, { useState, useEffect } from 'react';
import { Building, Save, CheckCircle2 } from 'lucide-react';
import { IBusinessInfo } from '@/lib/types';

export default function AdminBusinessInfoPage() {
  const [info, setInfo] = useState<IBusinessInfo>({
    name: 'Mahaveer Glass & Plywood Hardware',
    address: 'No. 21, Chetty Street, Old Pallavaram, Chennai - 600 117',
    phones: ['78714 57430', '78455 59880', '90804 57430', '78456 03776'],
    whatsapp: '917871457430',
    email: 'contact@mahaveerhardware.com',
    openingHours: 'Monday - Saturday: 9:00 AM - 9:00 PM | Sunday: 9:30 AM - 2:00 PM',
    description: 'Reliable products, quality hardware, premium glass, plywood and trusted service for your home, office, interior and commercial projects.'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadInfo() {
      try {
        const res = await fetch('/api/business-info');
        if (res.ok) {
          const data = await res.json();
          if (data) setInfo(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInfo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/business-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-2xl font-extrabold text-stone-100">Business Information Settings</h1>
        <p className="text-xs text-stone-400 mt-1">Dynamically manage store address, phone numbers, WhatsApp line, and operating hours.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Business details saved! Changes are live on the public website.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 text-xs shadow-xl">
        <div>
          <label className="block font-bold text-stone-300 mb-1">Store / Business Name</label>
          <input
            type="text"
            required
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-300 mb-1">Physical Address</label>
          <input
            type="text"
            required
            value={info.address}
            onChange={(e) => setInfo({ ...info, address: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-stone-300 mb-1">Primary WhatsApp Number</label>
            <input
              type="text"
              required
              value={info.whatsapp}
              onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">Email Address</label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-300 mb-1">Opening Hours</label>
          <input
            type="text"
            value={info.openingHours}
            onChange={(e) => setInfo({ ...info, openingHours: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-300 mb-1">Store Description / Tagline</label>
          <textarea
            rows={3}
            value={info.description}
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 focus:border-amber-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Updating...' : 'Save Business Information'}
        </button>
      </form>
    </div>
  );
}
