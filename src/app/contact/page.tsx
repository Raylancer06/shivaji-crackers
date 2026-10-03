"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, Phone, Mail, MapPin, Send, Truck, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Hyderabad',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('sivajiduddempudi42@gmail.com');
  const [phone, setPhone] = useState('+91 83740 44445');

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) {
        if (s.business_email || s.support_email || s.admin_notification_email) {
          setEmail(s.business_email || s.support_email || s.admin_notification_email || 'sivajiduddempudi42@gmail.com');
        }
        if (s.support_phone || s.business_phone) {
          setPhone(s.support_phone || s.business_phone || '+91 83740 44445');
        }
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C1411]">
      <Navbar />

      {/* Hero Header */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#200306] to-[#3D060B] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#F0B543]/40 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#F0B543]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F0B543]">
              Get In Touch
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Contact Sivaji Firecracker
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            Customer order support, delivery assistance, and wholesale society bookings.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D7C5] shadow-sm space-y-6">
              <h3 className="text-xl font-black text-[#1C1411]">
                Customer Support & Enquiries
              </h3>

              <div className="space-y-4 text-xs">
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#E2D7C5]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8ED] text-[#B85D00] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#66574F] block text-[10px] uppercase tracking-wider">Direct Call Helpline</span>
                    <span className="font-black text-base text-[#1C1411]">{phone}</span>
                    <span className="text-[#66574F] block mt-0.5">Mon - Sun (8:00 AM - 10:00 PM)</span>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 p-3 rounded-2xl border border-[#E2D7C5]/50 bg-[#FAF8F5] hover:border-[#E2D7C5] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#550C12] border border-[#E2D7C5] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#66574F] block text-[10px] uppercase tracking-wider">Email Inquiry</span>
                    <span className="font-bold text-sm text-[#1C1411]">{email}</span>
                    <span className="text-[#66574F] block mt-0.5">Wholesale inquiries & society quotes</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-2xl border border-[#E2D7C5]/50 bg-[#FAF8F5]">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#550C12] border border-[#E2D7C5] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#66574F] block text-[10px] uppercase tracking-wider">Business Location</span>
                    <span className="font-bold text-xs text-[#1C1411]">Hyderabad, Telangana, India</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 text-xs text-[#B85D00] flex items-start gap-2.5">
                <Truck className="w-5 h-5 shrink-0 text-[#B85D00]" />
                <p className="leading-relaxed">
                  <strong>Delivery Coverage:</strong> Safe and prompt dispatches across Hyderabad, Secunderabad, Telangana, and South India with order tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2D7C5] shadow-sm">
              <h3 className="text-xl sm:text-2xl font-black text-[#1C1411] mb-2">
                Send Us an Enquiry
              </h3>
              <p className="text-xs text-[#66574F] mb-6">
                Fill in your celebration requirements and our sales manager will reach out via phone within 2 hours.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-[#EBF7F0] border border-[#07542C]/20 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#07542C] mx-auto" />
                  <h4 className="text-base font-black text-[#07542C]">Thank You for Your Enquiry!</h4>
                  <p className="text-xs text-[#66574F]">
                    Your inquiry has been received by our Sivaji Firecracker customer desk. Our representative will contact you at <strong>{formData.phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', city: 'Hyderabad', message: '' });
                    }}
                    className="mt-2 text-xs font-bold text-[#550C12] underline hover:text-[#7B141C]"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#1C1411] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2D7C5] focus:border-[#550C12] outline-none bg-[#FAF8F5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#1C1411] mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2D7C5] focus:border-[#550C12] outline-none bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1C1411] mb-1">City / Delivery Location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad / Secunderabad"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2D7C5] focus:border-[#550C12] outline-none bg-[#FAF8F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1411] mb-1">Your Message or Required Items</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Interested in Family Pack and 30-shot aerial cakes for Hyderabad delivery."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2D7C5] focus:border-[#550C12] outline-none bg-[#FAF8F5]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] text-white font-bold text-sm shadow-regal hover:shadow-deep transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Enquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
