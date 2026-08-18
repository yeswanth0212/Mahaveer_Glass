'use client';

import React from 'react';
import { Settings, ShieldCheck, KeyRound, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto text-stone-100">
      <div className="border-b border-stone-800 pb-6">
        <h1 className="text-2xl font-extrabold">System & Security Settings</h1>
        <p className="text-xs text-stone-400 mt-1">Admin credentials, JWT session configuration and database parameters.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-100">Security Configuration</h3>
            <p className="text-stone-400 mt-1 leading-relaxed">
              Passwords are stored as salted bcrypt hashes. JWT authentication tokens are transmitted inside HTTP-Only secure cookies to prevent XSS script access.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-800">
          <h4 className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">Active Environment Variable Settings</h4>
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 space-y-2 font-mono text-[11px] text-stone-300">
            <p><span className="text-amber-400">ADMIN_EMAIL:</span> admin@mahaveerhardware.com</p>
            <p><span className="text-amber-400">AUTHENTICATION:</span> JWT Cookie (mahaveer_admin_token)</p>
            <p><span className="text-amber-400">DATABASE:</span> MongoDB / Local Persistent JSON Fallback Store</p>
            <p><span className="text-amber-400">WHATSAPP LINE:</span> 917871457430</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300">
          <p className="font-bold mb-1">Production Deployment Advice:</p>
          <p className="text-[11px] leading-relaxed text-amber-200/90">
            Before deploying to production (e.g. Vercel / Netlify / AWS), change <code className="text-amber-400">ADMIN_PASSWORD</code> and <code className="text-amber-400">JWT_SECRET</code> inside environment variables.
          </p>
        </div>
      </div>
    </div>
  );
}
