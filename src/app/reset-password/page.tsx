"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/services/api';
import { Lock, Mail, Key, Sparkles, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlToken = searchParams.get('token');
    if (urlEmail) setEmail(urlEmail);
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please check your token or request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto mb-2 shadow-sm">
          <Sparkles className="w-6 h-6 text-[#C98E2A]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411]">
          Reset Password
        </h1>
        <p className="text-xs text-[#66574F]">
          Set a new secure password for your Sivaji Firecracker account.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#166534] text-base">Password Reset Successfully!</h3>
            <p className="text-xs text-[#15803D] mt-1">
              Your account password has been updated. You can now sign in with your new credentials.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow transition"
          >
            Sign In Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
              Account Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
              Reset Security Token *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter reset token or paste from email"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
              New Password (min 6 chars) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
            {loading ? <span>Updating Password...</span> : <span>Save New Password</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#66574F]">
        <Link href="/login" className="font-bold text-[#550C12] hover:underline">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-10 sm:py-16">
        <Suspense fallback={<div className="p-8 text-center text-xs text-[#8C7A70]">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
