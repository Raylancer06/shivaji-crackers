"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { User, Phone, Mail, Lock, MapPin, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, register } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/account';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      router.replace(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim() || !formData.password_confirmation.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto mb-2 shadow-sm">
          <Sparkles className="w-6 h-6 text-[#C98E2A]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411]">
          Create Account
        </h1>
        <p className="text-xs text-[#66574F]">
          Sign up with Sivaji Firecracker for faster checkout, order history, and tracking.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
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
              disabled={submitting}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Full Name"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
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
              disabled={submitting}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
            Mobile Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              name="phone"
              required
              disabled={submitting}
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="10-digit mobile number"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              disabled={submitting}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password_confirmation"
              required
              minLength={6}
              disabled={submitting}
              value={formData.password_confirmation}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A] disabled:opacity-60"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white font-serif font-black text-xs uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#66574F]">
        Already registered?{' '}
        <Link
          href={`/login${redirectUrl !== '/account' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-bold text-[#550C12] hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12 sm:py-16">
        <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading registration...</div>}>
          <RegisterForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
