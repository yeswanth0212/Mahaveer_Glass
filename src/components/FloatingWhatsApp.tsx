'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/917871457430?text=${encodeURIComponent(
    'Hello Mahaveer Glass & Plywood Hardware, I have an enquiry regarding products and availability.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center border-2 border-stone-900 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="w-7 h-7 fill-white text-emerald-500" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-bold pl-0 group-hover:pl-2">
        Chat on WhatsApp
      </span>
    </a>
  );
}
