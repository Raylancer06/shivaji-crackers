"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/services/api';
import { User, Phone, Mail, Lock, MapPin, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address_line: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    transport_hub: 'VRL Logistics (Hyderabad Hub)',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.register(formData);
      if (res.data?.token) {
        localStorage.setItem('sivaji_token', res.data.token);
        localStorage.setItem('sivaji_user', JSON.stringify(res.data.user));
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12 sm:py-16">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Sparkles className="w-6 h-6 text-[#C98E2A]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411]">
              Create Customer Account
            </h1>
            <p className="text-xs text-[#66574F]">
              Register for direct Sivakasi factory discounts, order tracking, and express Hyderabad delivery.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Anand Sharma"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  WhatsApp Contact Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Password (min 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Default Delivery Street Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                  <textarea
                    name="address_line"
                    rows={2}
                    value={formData.address_line}
                    onChange={handleInputChange}
                    placeholder="Plot / Door No, Street, Landmark..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Preferred Transport Hub
                </label>
                <select
                  name="transport_hub"
                  value={formData.transport_hub}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs font-semibold text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                >
                  <option value="VRL Logistics (Hyderabad Hub)">VRL Logistics (Hyderabad Central Hub)</option>
                  <option value="ARC Parcels (Secunderabad Hub)">ARC Parcels (Secunderabad Hub)</option>
                  <option value="SRS Logistics (Kukatpally Depot)">SRS Logistics (Kukatpally Depot)</option>
                  <option value="Kranti Road Transport (Kacheguda)">Kranti Road Transport (Kacheguda)</option>
                  <option value="Direct Sivakasi Express Lorry">Direct Sivakasi Express Lorry</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white font-serif font-black text-xs uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
            >
              {loading ? <span>Creating Account...</span> : <span>Register & Access Account</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#66574F]">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-[#550C12] hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
