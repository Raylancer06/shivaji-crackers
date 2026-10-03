"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { ArrowRight } from 'lucide-react';

export const CartToast: React.FC = () => {
  const pathname = usePathname();
  const { lastAddedItem, setIsCartOpen } = useCart();

  const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/checkout');

  return (
    <AnimatePresence>
      {!isExcluded && lastAddedItem && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3.5 flex items-center gap-3 max-w-sm"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img
              src={lastAddedItem.product.image}
              alt={lastAddedItem.product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-festive-green uppercase tracking-wider block">
              Added to Cart!
            </span>
            <h4 className="text-xs font-bold text-gray-900 truncate">
              {lastAddedItem.product.name}
            </h4>
            <p className="text-[11px] text-gray-500">
              +{lastAddedItem.qty} boxes (₹{lastAddedItem.product.price * lastAddedItem.qty})
            </p>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-primary-dark transition-colors shadow-sm"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
