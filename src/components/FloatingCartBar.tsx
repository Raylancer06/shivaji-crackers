"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { api, StoreSettings } from '@/services/api';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const pathname = usePathname();
  const { totalBoxes, totalWholesale, totalSavings, setIsCartOpen, isCartOpen, isCheckoutOpen } = useCart();
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState<Partial<StoreSettings>>({
    floating_cart_enabled: true,
    floating_cart_mobile_enabled: false,
    floating_cart_on_estimate: false,
  });

  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((s) => {
      if (isMounted && s) setSettings(s);
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Auto-hide when user scrolls down within 180px of page bottom
      // to guarantee footer credits ("Designed & Developed by Raylancer") & disclaimer are 100% visible
      const isNearBottom = scrollY + windowHeight >= docHeight - 180;

      setShow(scrollY > 250 && !isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Exclude Admin routes
  if (pathname?.startsWith('/admin')) return null;

  // 2. Exclude Checkout route and when Checkout modal is active
  if (pathname?.startsWith('/checkout') || isCheckoutOpen) return null;

  // 3. Exclude when Cart Drawer modal is open
  if (isCartOpen) return null;

  // 4. Exclude Cart route and Order confirmation
  if (
    pathname === '/cart' ||
    pathname?.startsWith('/cart') ||
    pathname?.startsWith('/order-confirmation')
  ) {
    return null;
  }

  // 5. Exclude Estimate page (disabled by default unless explicitly allowed in Admin)
  if (
    (pathname === '/estimate' || pathname?.startsWith('/estimate')) &&
    !settings.floating_cart_on_estimate
  ) {
    return null;
  }

  // 6. Master switch: disabled in settings
  if (settings.floating_cart_enabled === false) return null;

  // 7. No items in cart
  if (totalBoxes === 0) return null;

  // Mobile View Option:
  // If floating_cart_mobile_enabled is false (default), hide on small screens (< 768px) with 'hidden md:block'
  // If true, display on mobile as well with 'block'
  const responsiveVisibility = settings.floating_cart_mobile_enabled ? 'block' : 'hidden md:block';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md pointer-events-auto font-sans ${responsiveVisibility}`}
        >
          <div
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] text-white p-3 sm:p-3.5 rounded-2xl shadow-deep border-2 border-[#C98E2A]/50 flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#F0B543]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-black text-sm sm:text-base">
                    ₹{totalWholesale.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#F0B543] font-bold">
                    ({totalBoxes} Boxes)
                  </span>
                </div>
                <span className="text-[10px] text-white/85 block">
                  You save ₹{totalSavings.toLocaleString('en-IN')} with wholesale direct (70% Off)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#F0B543] text-[#1C1411] px-3.5 py-1.5 rounded-xl font-serif font-extrabold text-xs shadow-sm">
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
