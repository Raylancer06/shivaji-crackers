"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/services/api';
import { Mail, Sparkles, ArrowRight, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ message: string; reset_token?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessData(null);

    try {
      const res = await api.forgotPassword(email);
      setSuccessData({
        message: res.message || 'Password reset link / token generated successfully.',
        reset_token: res.reset_token,
      });
    } catch (err: any) {
      setError(err.message || 'Unable to request password reset. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-10 sm:py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <KeyRound className="w-6 h-6 text-[#C98E2A]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411]">
              Recover Password
            </h1>
            <p className="text-xs text-[#66574F]">
              Enter your registered email address to receive password reset instructions.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successData ? (
            <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-[#16A34A]" />
                <span>Reset Instructions Ready</span>
              </div>
              <p className="text-xs text-[#15803D]">
                {successData.message}
              </p>
              {successData.reset_token && (
                <div className="pt-2">
                  <Link
                    href={`/reset-password?token=${encodeURIComponent(successData.reset_token)}&email=${encodeURIComponent(email)}`}
                    className="block w-full py-2.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-center font-bold text-xs shadow transition"
                  >
                    Proceed to Reset Password →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Registered Email Address *
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white font-serif font-black text-xs uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
              >
                {loading ? <span>Sending Request...</span> : <span>Send Reset Instructions</span>}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-[#66574F]">
            Remember your credentials?{' '}
            <Link href="/login" className="font-bold text-[#550C12] hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
