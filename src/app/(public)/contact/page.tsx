'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, MapPin, Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get('product') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: initialProduct,
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setErrorMsg('Please fill in your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    // Save to database first
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.warn('Failed storing enquiry in DB, redirecting to WhatsApp anyway:', err);
    }

    // Construct formatted WhatsApp message
    const waText = `Hello Mahaveer Glass & Plywood Hardware,\n\nI have a product enquiry:\n• *Name*: ${formData.name}\n• *Phone*: ${formData.phone}\n${formData.email ? `• *Email*: ${formData.email}\n` : ''}${formData.product ? `• *Product*: ${formData.product}\n` : ''}• *Message*: ${formData.message}`;

    const waUrl = `https://wa.me/917871457430?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp directly in new window/tab
    window.open(waUrl, '_blank');

    setSubmitted(true);
    setSubmitting(false);
    setFormData({ name: '', phone: '', email: '', product: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title Header */}
      <div className="border-b border-stone-800 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
          Contact & Location Details
        </h1>
        <p className="text-stone-400 text-sm sm:text-base">
          Get in touch with Mahaveer Glass & Plywood Hardware for material quotes, product availability and store visits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Business Details & Phone Buttons */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-stone-100 border-b border-stone-800 pb-3">
              Mahaveer Glass & Plywood Hardware
            </h2>

            {/* Address */}
            <div className="flex items-start gap-3 text-sm text-stone-300">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-100">Store Address:</p>
                <p className="mt-1 leading-relaxed">
                  No. 21, Chetty Street, Old Pallavaram,<br />
                  Chennai - 600 117, Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Clickable Phone Numbers Grid */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Clickable Direct Phone Call Lines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="tel:7871457430"
                  className="p-3 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-200 text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>78714 57430</span>
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                </a>
                <a
                  href="tel:7845559880"
                  className="p-3 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-200 text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>78455 59880</span>
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                </a>
                <a
                  href="tel:9080457430"
                  className="p-3 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-200 text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>90804 57430</span>
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                </a>
                <a
                  href="tel:7845603776"
                  className="p-3 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-200 text-xs font-bold transition-all flex items-center justify-between"
                >
                  <span>78456 03776</span>
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                </a>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20have%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                Send Instant WhatsApp Message
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Enquiry Form */}
        <div className="lg:col-span-7 bg-stone-900 rounded-3xl border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-stone-100">Send an Online Product Enquiry</h2>
            <p className="text-xs text-stone-400 mt-1">
              Fill out the form below. Your request will be recorded directly in our store management system.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-stone-100">Enquiry Sent to WhatsApp & Saved!</h3>
              <p className="text-xs text-stone-300">
                Your enquiry has been recorded in our store system and opened in WhatsApp for direct messaging.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-stone-800 text-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-700 mt-2"
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98400 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Product / Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Mortise Lock CY or BWP Plywood"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Message / Quantity / Dimensions *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify quantity required, finish variant preferred, or general enquiry details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Opening WhatsApp...</span>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 fill-white text-emerald-600" /> Send Enquiry via WhatsApp
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-500" />
          Store Location Map - Old Pallavaram, Chennai
        </h3>
        <div className="w-full h-80 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
          <iframe
            title="Mahaveer Glass and Hardware Store Location"
            src="https://maps.google.com/maps?q=Old%20Pallavaram%20Chennai%20Chetty%20Street&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 filter grayscale contrast-125 brightness-90 hover:filter-none transition-all"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-400">Loading Contact Details...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
