"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/services/api';
import { Phone, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(loginInput, password);
      if (res.data?.token) {
        localStorage.setItem('sivaji_token', res.data.token);
        localStorage.setItem('sivaji_user', JSON.stringify(res.data.user));
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12 sm:py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Sparkles className="w-6 h-6 text-[#C98E2A]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411]">
              Customer Login
            </h1>
            <p className="text-xs text-[#66574F]">
              Access your Diwali orders, track lorry dispatch, and view estimates.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                WhatsApp Phone or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="+91 98765 43210 or email@domain.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#8C7A70] hover:text-[#550C12] transition"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white font-serif font-black text-xs uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              {loading ? <span>Signing In...</span> : <span>Sign In to Account</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#66574F]">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-[#550C12] hover:underline">
              Create New Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
