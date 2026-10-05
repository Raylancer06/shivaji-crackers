"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, StoreSettings } from '@/services/api';
import {
  ShoppingBag,
  ShieldCheck,
  Search,
  User,
  Phone,
  LogOut,
  Menu,
  X,
  Home,
  Calculator,
  CreditCard,
  Info,
  PhoneCall,
  Package,
  MessageCircle,
  ChevronRight,
  FileText,
  FileDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC<{ onSearchChange?: (val: string) => void }> = ({ onSearchChange }) => {
  const { totalBoxes, totalWholesale, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Partial<StoreSettings>>({
    announcement_text_1: 'Festival Specials & Seasonal Offers',
    announcement_text_2: '100% CSIR-NEERI Green Certified',
    announcement_text_3: 'Up to 80% Direct Wholesale Savings',
    support_phone: '+91 83740 44445',
  });

  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((s) => {
      if (isMounted && s) setSettings(s);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearchChange) onSearchChange(val);
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Estimate', href: '/estimate', icon: Calculator, badge: 'Wholesale' },
    { label: 'Price List', href: '/price-list', icon: FileText, badge: 'PDF' },
    { label: 'Payment Info', href: '/payment', icon: CreditCard },
    { label: 'About Us', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: PhoneCall },
  ];

  return (
    <>
      {/* Top Luxury Announcement Ribbon (Flows naturally with scroll, completely eliminates header flickering) */}
      <div className="w-full bg-[#3D060B] text-[#F3E7D3] text-[11px] px-3 sm:px-4 py-1.5 font-medium tracking-wider border-b border-[#C98E2A]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse shrink-0" />
            <span className="text-[#F0B543] font-serif font-bold uppercase text-[10px] tracking-widest">
              {settings.announcement_text_1 || 'Festival Specials & Seasonal Offers'}
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">
              {settings.announcement_text_2 || '100% CSIR-NEERI Green Certified'}
            </span>
            <span className="text-white/30 hidden md:inline">•</span>
            <span className="text-[#F0B543] hidden md:inline">
              {settings.announcement_text_3 || 'Up to 80% Direct Wholesale Savings'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <a
              href="/sivaji-firecracker-wholesale-price-list.pdf"
              download="Sivaji-Firecracker-Wholesale-Price-List-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[#F0B543] hover:text-white transition-colors text-[10.5px] font-bold whitespace-nowrap bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded border border-[#F0B543]/30"
              title="Download Complete 2026 Wholesale Price List (PDF)"
            >
              <FileDown className="w-3 h-3 text-[#F0B543]" />
              <span>PDF Price List</span>
            </a>
            <a
              href={`tel:${(settings.support_phone || '+91 83740 44445').replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 text-[#F0B543] hover:text-white transition-colors text-xs font-bold whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#F0B543]" />
              <span className="hidden xs:inline">Helpline:</span> {settings.support_phone || '+91 83740 44445'}
            </a>
          </div>
        </div>
      </div>

      {/* Main Solid Opaque Sticky Header (Stable height, 100% solid white, 0 flicker) */}
      <header className="sticky top-0 z-50 font-sans w-full bg-white shadow-xs">
        <nav className="w-full border-b border-[#E2D7C5] bg-white shadow-xs py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 lg:gap-6">
          {/* Brand Emblem & Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full p-0.5 bg-gradient-to-tr from-[#C98E2A] via-[#F0B543] to-[#550C12] shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/logo.svg"
                alt="Sivaji Firecracker Logo"
                className="h-full w-full object-contain rounded-full bg-white p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs sm:text-sm lg:text-base text-[#550C12] tracking-wider leading-none group-hover:text-[#7B141C] transition-colors whitespace-nowrap">
                SIVAJI FIRECRACKER
              </span>
              <span className="text-[7.5px] sm:text-[8px] lg:text-[9px] font-bold text-[#B85D00] tracking-widest uppercase mt-0.5 whitespace-nowrap">
                Direct Wholesale • Hyderabad Express
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold uppercase tracking-wider text-[#5C4D44] shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`pb-0.5 transition-all whitespace-nowrap ${
                  pathname === link.href
                    ? 'text-[#550C12] border-b-2 border-[#C98E2A]'
                    : 'hover:text-[#550C12] hover:border-b-2 hover:border-[#C98E2A]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions: Search, Account, Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Desktop Search Input */}
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

            {/* Desktop Account / User Section */}
            {user ? (
              <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E2D7C5] p-1 rounded-2xl shadow-sm">
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
                  className="p-1 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-[#550C12] hover:bg-[#FFF8ED] transition"
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
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-regal border border-[#C98E2A]/30 transition-all shrink-0 cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#F0B543]" />
              <span className="hidden xs:inline font-serif font-bold tracking-wide">Cart</span>

              {totalBoxes > 0 ? (
                <span className="font-extrabold text-[#F0B543] font-sans text-xs">
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

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#E2D7C5] text-[#550C12] hover:bg-[#FAF8F5] active:scale-95 transition shadow-sm flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#550C12]" />
              ) : (
                <Menu className="w-5 h-5 text-[#550C12]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-0 bg-black/60 z-40 lg:hidden"
            />

            {/* Menu Slide Down Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 z-50 bg-[#FAF8F5] border-b-2 border-[#C98E2A]/30 shadow-2xl max-h-[85vh] overflow-y-auto lg:hidden"
            >
              <div className="px-4 py-4 space-y-3.5">
                {/* Search Bar for Mobile */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={handleSearch}
                    placeholder="Search crackers, sparklers, sky shots..."
                    className="w-full pl-10 pr-9 py-2.5 text-xs bg-white border border-[#E2D7C5] rounded-xl shadow-xs focus:border-[#C98E2A] focus:ring-1 focus:ring-[#C98E2A] outline-none text-[#1C1411]"
                  />
                  {searchVal && (
                    <button
                      onClick={() => {
                        setSearchVal('');
                        if (onSearchChange) onSearchChange('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Primary Navigation Links */}
                <div className="bg-white rounded-2xl border border-[#E2D7C5] p-2 space-y-1 shadow-xs">
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                          isActive
                            ? 'bg-[#550C12] text-white font-bold'
                            : 'text-[#1C1411] hover:bg-[#FAF8F5] font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-white/15 text-[#F0B543]' : 'bg-[#FAF8F5] text-[#550C12]'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs">{link.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {link.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                isActive
                                  ? 'bg-[#F0B543] text-[#1C1411]'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {link.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={`w-4 h-4 ${isActive ? 'text-white/70' : 'text-gray-400'}`}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Account / Authentication Card */}
                <div className="bg-white rounded-2xl border border-[#E2D7C5] p-3 shadow-xs">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E2D7C5]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#FFF8ED] border border-[#E2D7C5] flex items-center justify-center text-[#550C12]">
                            <User className="w-3.5 h-3.5 text-[#C98E2A]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1C1411]">{user.name}</div>
                            <div className="text-[10px] text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase">
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href="/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#FFF8ED] border border-[#E2D7C5] text-xs font-bold text-[#550C12] text-center flex items-center justify-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5 text-[#C98E2A]" />
                          <span>My Orders</span>
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            await logout();
                            setMobileMenuOpen(false);
                          }}
                          className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#1C1411] mb-1">
                        Customer Account
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold text-center transition"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2 px-3 rounded-xl bg-white border border-[#E2D7C5] hover:bg-[#FAF8F5] text-[#550C12] text-xs font-bold text-center transition"
                        >
                          Register
                        </Link>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#E2D7C5] text-[11px] text-[#66574F] hover:text-[#550C12] flex items-center justify-between transition mt-1"
                      >
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-gray-500" />
                          <span>Track Order Without Account</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* PDF Price List Download in Mobile Menu */}
                <a
                  href="/sivaji-firecracker-wholesale-price-list.pdf"
                  download="Sivaji-Firecracker-Wholesale-Price-List-2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#C98E2A] via-[#F0B543] to-[#C98E2A] text-[#1C1411] text-xs font-serif font-black flex items-center justify-between shadow-xs transition"
                >
                  <span className="flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    <span>Download 2026 Price List (PDF)</span>
                  </span>
                  <span className="text-[10px] bg-[#1C1411] text-white px-2 py-0.5 rounded font-mono">
                    150+ Items
                  </span>
                </a>

                {/* Instant Support & WhatsApp */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://wa.me/918374044445?text=Hi%20Sivaji%20Firecracker%2C%20I%20have%20an%20enquiry%20regarding%20crackers%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="tel:+918374044445"
                    className="py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#E2D7C5] text-[#550C12] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#FFF8ED] transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C98E2A] shrink-0" />
                    <span>Call Helpline</span>
                  </a>
                </div>

                {/* Trust Footer */}
                <div className="pt-1 pb-1 text-center">
                  <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#B85D00] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>100% CSIR-NEERI Certified Green Crackers</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  </>
);
};
