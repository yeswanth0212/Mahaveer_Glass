'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, MapPin, Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Building, Clock, ShieldCheck } from 'lucide-react';

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

    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.warn('Failed storing enquiry in DB, redirecting to WhatsApp anyway:', err);
    }

    const waText = `Hello Mahaveer Glass & Plywood Hardware,\n\nI have a product enquiry / quote request:\n• *Name*: ${formData.name}\n• *Phone*: ${formData.phone}\n${formData.email ? `• *Email*: ${formData.email}\n` : ''}${formData.product ? `• *Product*: ${formData.product}\n` : ''}• *Message*: ${formData.message}`;

    const waUrl = `https://wa.me/917871457430?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');

    setSubmitted(true);
    setSubmitting(false);
    setFormData({ name: '', phone: '', email: '', product: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Direct Store Assistance & Quotes
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Store & Get a Quick Quote
        </h1>
        <p className="text-slate-500 text-xs sm:text-base max-w-3xl">
          Get in touch with Mahaveer Glass & Plywood Hardware in Old Pallavaram, Chennai for material quotes, product availability and bulk contractor rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Business Details & Phone Buttons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Store Information
            </h2>

            {/* Address */}
            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Physical Store Address:</p>
                <p className="mt-1 leading-relaxed text-slate-500">
                  No. 21, Chetty Street, Old Pallavaram,<br />
                  Chennai - 600 117, Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Clickable Phone Numbers Grid */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Click to Call Directly:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="tel:7871457430"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-between shadow-sm"
                >
                  <span>78714 57430</span>
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                </a>
                <a
                  href="tel:7845559880"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-between shadow-sm"
                >
                  <span>78455 59880</span>
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                </a>
                <a
                  href="tel:9080457430"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-between shadow-sm"
                >
                  <span>90804 57430</span>
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                </a>
                <a
                  href="tel:7845603776"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-600 text-xs font-bold transition-all flex items-center justify-between shadow-sm"
                >
                  <span>78456 03776</span>
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                </a>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href="https://wa.me/917871457430?text=Hello%20Mahaveer%20Glass%20%26%20Plywood%20Hardware,%20I%20have%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                Send Instant WhatsApp Message
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Enquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900">Send an Online Quote Request</h2>
            <p className="text-xs text-slate-500 mt-1">
              Fill out the form below. Your request will be recorded and forwarded to our WhatsApp team for instant response.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Enquiry Sent to WhatsApp & Saved!</h3>
              <p className="text-xs text-slate-600">
                Your enquiry has been recorded in our store system and opened in WhatsApp for direct messaging.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 mt-2 shadow-sm"
              >
                Send Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98400 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product / Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Mortise Lock CY or BWP Plywood"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Quantity / Dimensions *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify quantity required, finish variant preferred (SS, Brass, Antique), or dimensions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                {submitting ? (
                  <span>Opening WhatsApp...</span>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" /> Send Quote Request via WhatsApp
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Store Location Map - Old Pallavaram, Chennai
        </h3>
        <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <iframe
            title="Mahaveer Glass and Hardware Store Location"
            src="https://maps.google.com/maps?q=Old%20Pallavaram%20Chennai%20Chetty%20Street&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
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
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading Contact Details...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
