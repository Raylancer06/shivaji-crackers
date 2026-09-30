"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { totalBoxes, totalWholesale, totalSavings, setIsCartOpen } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (totalBoxes === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md pointer-events-auto font-sans"
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
