'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-stone-100">Page Not Found</h1>
      <p className="text-stone-400 text-sm max-w-md">
        The page or product link you requested could not be located on Mahaveer Glass & Plywood Hardware website.
      </p>
      <div className="flex gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
