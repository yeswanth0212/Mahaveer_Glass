'use client';

import React from 'react';
import { ShieldCheck, Database, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-stone-100">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-2xl font-extrabold">System & Cloud Settings</h1>
        <p className="text-xs text-stone-400 mt-1">Firebase Authentication, Cloud Firestore Database, and Vercel Deployment Parameters.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-100">Cloud Storage Architecture</h3>
            <p className="text-stone-400 mt-1 leading-relaxed">
              All store products, categories, enquiries, gallery items, and business information are saved to Google Cloud Firestore. Firebase Authentication manages owner session credentials. Zero read-only filesystem dependencies.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-800">
          <h4 className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">Active Firebase Parameters</h4>
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-2 font-mono text-[11px] text-stone-300">
            <p><span className="text-amber-400">ADMIN_EMAIL:</span> admin@mahaveerhardware.com</p>
            <p><span className="text-amber-400">AUTHENTICATION:</span> Firebase Auth & HTTP-Only Secure Token</p>
            <p><span className="text-amber-400">DATABASE:</span> Google Cloud Firestore (Collections: products, categories, enquiries, gallery, business)</p>
            <p><span className="text-amber-400">STORAGE:</span> Firebase Storage / Cloud Image URLs</p>
            <p><span className="text-amber-400">VERCEL COMPATIBILITY:</span> 100% Serverless Writable Cloud DB</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300">
          <p className="font-bold mb-1">Vercel Environment Variables Checklist:</p>
          <p className="text-[11px] leading-relaxed text-amber-200/90">
            Add <code className="text-amber-400">NEXT_PUBLIC_FIREBASE_API_KEY</code>, <code className="text-amber-400">NEXT_PUBLIC_FIREBASE_PROJECT_ID</code>, and <code className="text-amber-400">ADMIN_PASSWORD</code> inside your Vercel Project Settings for live serverless deployment.
          </p>
        </div>
      </div>
    </div>
  );
}
