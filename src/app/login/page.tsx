"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Phone, Lock, Sparkles, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, KeyRound } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/account';

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      if (user.role === 'admin' && redirectUrl === '/account') {
        router.replace('/admin');
      } else {
        router.replace(redirectUrl);
      }
    }
  }, [user, redirectUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim() || !password.trim()) {
      setError('Please enter your WhatsApp phone or email and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const authUser = await login(loginInput.trim(), password.trim());
      if (authUser?.role === 'admin' && redirectUrl === '/account') {
        router.push('/admin');
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
      setSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    setLoginInput('customer@sivajifirecrackers.com');
    setPassword('customer2026');
    setShowPassword(true);
    setError('');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto mb-2 shadow-sm">
          <Sparkles className="w-6 h-6 text-[#C98E2A]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411]">
          Customer Login
        </h1>
        <p className="text-xs text-[#66574F]">
          Access your Sivaji Firecracker orders, view invoices, and manage saved addresses.
        </p>
      </div>

      {/* QA Customer Helper Box */}
      <div className="bg-[#FFF8ED] border border-[#C98E2A]/30 rounded-2xl p-3.5 text-xs flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-[#550C12]">
            <KeyRound className="w-3.5 h-3.5 text-[#C98E2A] shrink-0" />
            <span>Customer QA Login</span>
          </div>
          <p className="text-[11px] text-[#66574F] mt-0.5 truncate">
            customer@sivajifirecrackers.com
          </p>
        </div>
        <button
          type="button"
          onClick={handleAutoFill}
          className="px-3 py-1.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-bold text-[11px] transition shrink-0 shadow-sm"
        >
          Auto Fill
        </button>
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
            WhatsApp Phone or Email *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              disabled={submitting}
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="+91 98765 43210 or email@domain.com"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider">
              Password *
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
              type={showPassword ? 'text' : 'password'}
              required
              disabled={submitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="customer2026"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white font-serif font-black text-xs uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-gray-100 space-y-2 text-xs text-[#66574F]">
        <div>
          Don't have an account yet?{' '}
          <Link
            href={`/register${redirectUrl !== '/account' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="font-bold text-[#550C12] hover:underline"
          >
            Create New Account
          </Link>
        </div>
        <div className="pt-2 border-t border-dashed border-gray-200">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 font-bold text-[#B85D00] hover:text-[#550C12] transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Store Admin Portal Login →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
