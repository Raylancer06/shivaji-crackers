"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCatalog } from '@/components/ProductCatalog';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { LiveOrderTicker } from '@/components/LiveOrderTicker';
import { Sparkles, FileDown, FileText } from 'lucide-react';
import Link from 'next/link';

export default function EstimatePage() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <main className="min-h-screen relative flex flex-col justify-between bg-[#FAF7F2]">
      <Navbar onSearchChange={setGlobalSearch} />

      <section className="py-8 sm:py-10 bg-gradient-to-b from-[#200306] to-[#3D060B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#F0B543]/40 backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F0B543]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F0B543]">
              150+ Premium Festive Crackers
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2">
            Instant Estimate & Wholesale Price List
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl mx-auto">
            Select crackers from 16 categories, calculate instant wholesale savings, and complete your order with transparent direct pricing.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/sivaji-firecracker-wholesale-price-list.pdf"
              download="Sivaji-Firecracker-Wholesale-Price-List-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C98E2A] via-[#F0B543] to-[#C98E2A] text-[#1C1411] font-bold text-xs shadow-sm hover:brightness-105 transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF Price List</span>
            </a>
            <Link
              href="/price-list"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#F0B543]" />
              <span>Full Price List Table</span>
            </Link>
          </div>
        </div>
      </section>

      <ProductCatalog initialSearch={globalSearch} />

      <Footer />
      <CartDrawer />
      <LiveOrderTicker />
    </main>
  );
}
