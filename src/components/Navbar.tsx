"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ShieldCheck, Search, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC<{ onSearchChange?: (val: string) => void }> = ({ onSearchChange }) => {
  const { totalBoxes, totalWholesale, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearchChange) onSearchChange(val);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 font-sans">
      {/* Top Luxury Announcement Ribbon */}
      <div className="bg-[#3D060B] text-[#F3E7D3] text-[11px] py-1.5 px-4 font-medium border-b border-[#C98E2A]/20 tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse shrink-0" />
            <span className="text-[#F0B543] font-serif font-bold uppercase text-[10px] tracking-widest">
              Diwali 2025 Factory Allocation
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">100% CSIR-NEERI Green Certified</span>
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-[#F0B543] hidden md:inline">Up to 80% Sivakasi Factory Rate</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+918374044445"
              className="inline-flex items-center gap-1.5 text-[#F0B543] hover:text-white transition-colors text-xs font-bold whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#F0B543]" />
              <span>Helpline: +91 83740 44445</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar - Clean Single Line Layout */}
      <nav
        className={`transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-regal py-2 border-[#E2D7C5]'
            : 'bg-[#FAF8F5]/90 backdrop-blur-sm py-3 border-[#E2D7C5]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 lg:gap-6">
          {/* Brand Emblem & Logo */}
          <a href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0.5 bg-gradient-to-tr from-[#C98E2A] via-[#F0B543] to-[#550C12] shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/logo.svg"
                alt="Sivaji Firecracker Logo"
                className="h-full w-full object-contain rounded-full bg-white p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg text-[#550C12] tracking-wider leading-none group-hover:text-[#7B141C] transition-colors whitespace-nowrap">
                SIVAJI FIRECRACKER
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#B85D00] tracking-widest uppercase mt-0.5 whitespace-nowrap">
                Sivakasi Direct • Hyderabad Express
              </span>
            </div>
          </a>

          {/* Navigation Links - Single line guaranteed with whitespace-nowrap */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-bold uppercase tracking-wider text-[#5C4D44] shrink-0">
            <a
              href="/"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Home
            </a>
            <a
              href="/estimate"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Estimate
            </a>
            <a
              href="/payment"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Payment Info
            </a>
            <a
              href="/about"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Contact Us
            </a>
          </div>

          {/* Actions: Search, Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchVal}
                onChange={handleSearch}
                placeholder="Search crackers, SKU..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#F2EBE0] border border-[#E2D7C5] rounded-full w-36 lg:w-44 focus:w-52 focus:bg-white focus:border-[#C98E2A] transition-all outline-none text-[#1C1411]"
              />
            </div>

            {/* Account Icon Button */}
            <Link
              href="/account"
              className="p-2 rounded-xl bg-white border border-[#E2D7C5] text-[#550C12] hover:bg-[#FFF8ED] transition shadow-sm"
              title="Customer Account & Orders"
            >
              <User className="w-4 h-4 text-[#550C12]" />
            </Link>

            {/* Premium Cart Trigger */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-regal border border-[#C98E2A]/30 transition-all shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#F0B543]" />
              <span className="hidden xs:inline font-serif font-bold tracking-wide">Cart</span>

              {totalBoxes > 0 ? (
                <span className="font-extrabold text-[#F0B543] font-sans">
                  ₹{totalWholesale.toLocaleString('en-IN')}
                </span>
              ) : (
                <span className="text-[11px] text-white/70 hidden xs:inline">(0)</span>
              )}

              {/* Animated Badge Count */}
              <AnimatePresence>
                {totalBoxes > 0 && (
                  <motion.span
                    key={totalBoxes}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#C98E2A] text-[#1C1411] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white"
                  >
                    {totalBoxes}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>
    </header>
  );
};
