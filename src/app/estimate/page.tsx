"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCatalog } from '@/components/ProductCatalog';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { LiveOrderTicker } from '@/components/LiveOrderTicker';
import { Sparkles } from 'lucide-react';

export default function EstimatePage() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <main className="min-h-screen relative flex flex-col justify-between bg-[#FAF7F2]">
      <Navbar onSearchChange={setGlobalSearch} />

      <section className="pt-28 pb-10 bg-gradient-to-b from-[#200306] to-[#3D060B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#F0B543]/40 backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F0B543]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F0B543]">
              150+ Direct Sivakasi Crackers
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2">
            Instant Estimate & Wholesale Price List
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto">
            Select crackers from 16 categories, calculate instant wholesale savings, and submit your inquiry with 1-click WhatsApp or printable invoice.
          </p>
        </div>
      </section>

      <ProductCatalog initialSearch={globalSearch} />

      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <LiveOrderTicker />
    </main>
  );
}
