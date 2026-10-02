"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { adminApi } from '@/services/supabaseAdmin';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (authErr) throw authErr;
      if (!data.user) throw new Error('Authentication failed');

      // Verify admin role in customer_profiles
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This account does not have administrative privileges.');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setEmail('admin@sivajifirecrackers.com');
    setPassword('sivajiadmin2026');
    setShowPassword(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#200306] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#C98E2A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#C98E2A]/30 shadow-2xl p-8 relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#550C12] to-[#7B141C] text-[#F0B543] border border-[#C98E2A]/40 flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-black text-[#1C1411]">
            Sivaji Firecracker
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider text-[#B85D00]">
            Store Operations & Admin Portal
          </p>
        </div>

        {/* QA Helper Box */}
        <div className="bg-[#FFF8ED] border border-[#C98E2A]/30 rounded-2xl p-3.5 text-xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-[#550C12]">
              <KeyRound className="w-3.5 h-3.5 text-[#C98E2A] shrink-0" />
              <span>Admin QA Login</span>
            </div>
            <p className="text-[11px] text-[#66574F] mt-0.5 truncate">
              admin@sivajifirecrackers.com
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
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1C1411] mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sivajifirecrackers.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs font-medium text-[#1C1411] focus:outline-none focus:ring-2 focus:ring-[#C98E2A] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1C1411] mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="sivajiadmin2026"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs font-medium text-[#1C1411] focus:outline-none focus:ring-2 focus:ring-[#C98E2A] transition"
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
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] hover:shadow-lg text-white font-serif font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F0B543]" />
                <span>Verifying Admin Rights...</span>
              </>
            ) : (
              <span>Sign In to Admin Portal</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <a
            href="/"
            className="text-xs text-[#66574F] hover:text-[#550C12] font-semibold"
          >
            ← Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
