"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, ShieldCheck, Search, User, Phone, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC<{ onSearchChange?: (val: string) => void }> = ({ onSearchChange }) => {
  const { totalBoxes, totalWholesale, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
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
              Festival Specials & Seasonal Offers
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">100% CSIR-NEERI Green Certified</span>
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-[#F0B543] hidden md:inline">Up to 80% Direct Wholesale Savings</span>
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
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
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
                Direct Wholesale • Hyderabad Express
              </span>
            </div>
          </Link>

          {/* Navigation Links - Single line guaranteed with whitespace-nowrap */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-bold uppercase tracking-wider text-[#5C4D44] shrink-0">
            <Link
              href="/"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/estimate"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Estimate
            </Link>
            <Link
              href="/payment"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Payment Info
            </Link>
            <Link
              href="/about"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A] pb-0.5 transition-all whitespace-nowrap"
            >
              Contact Us
            </Link>
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

            {/* Account / User Section */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-white border border-[#E2D7C5] p-1 rounded-2xl shadow-sm">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-[#550C12] hover:bg-[#FFF8ED] transition"
                  title="My Account"
                >
                  <User className="w-3.5 h-3.5 text-[#C98E2A]" />
                  <span className="max-w-[90px] sm:max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-[#550C12] hover:bg-[#FFF8ED] transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/account"
                  className="p-2 rounded-xl bg-white border border-[#E2D7C5] text-[#550C12] hover:bg-[#FFF8ED] transition shadow-sm"
                  title="My Account"
                >
                  <User className="w-4 h-4 text-[#550C12]" />
                </Link>
              </div>
            )}

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
