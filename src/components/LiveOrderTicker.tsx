"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, MapPin } from 'lucide-react';

const RECENT_ORDERS = [
  { name: 'Karthik S.', city: 'Madurai', item: '10cm Electric Sparklers (10 Boxes)', time: '2m ago' },
  { name: 'Rajesh V.', city: 'Chennai', item: 'Diwali Anandham Family Pack (₹780)', time: '5m ago' },
  { name: 'Swaminathan K.', city: 'Bengaluru', item: 'Platinum Mega Hamper (45 Items)', time: '8m ago' },
  { name: 'Dr. Anand', city: 'Hyderabad', item: '30 Shots Royal Symphony Cake', time: '14m ago' },
  { name: 'Kavitha R.', city: 'Coimbatore', item: 'Giant Ashoka Pots & Chakkars', time: '19m ago' },
];

export const LiveOrderTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_ORDERS.length);
        setVisible(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const order = RECENT_ORDERS[index];

  return (
    <div className="fixed bottom-6 left-6 z-30 hidden xl:block pointer-events-none font-sans">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-md border border-[#E2D7C5] p-3 rounded-2xl shadow-regal flex items-center gap-2.5 max-w-xs pointer-events-auto"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center shrink-0">
              <Flame className="w-3.5 h-3.5 text-[#C98E2A]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-[#66574F]">
                <strong className="text-[#1C1411] font-serif">{order.name}</strong>
                <span>•</span>
                <span className="flex items-center text-[#B85D00] font-semibold truncate">
                  <MapPin className="w-2.5 h-2.5 mr-0.5" />
                  {order.city}
                </span>
                <span>•</span>
                <span className="text-gray-400">{order.time}</span>
              </div>
              <p className="text-[11px] font-bold text-[#550C12] truncate">
                {order.item}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
