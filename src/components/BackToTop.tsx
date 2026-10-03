"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  if (pathname?.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (docHeight > 0) {
        const progress = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circular progress parameters
  const size = 44;
  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-5 sm:right-7 z-40 p-2 rounded-full bg-[#550C12] text-[#F0B543] shadow-deep border border-[#C98E2A]/50 hover:border-[#F0B543] flex items-center justify-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#F0B543]/50"
          aria-label="Scroll back to top"
          title="Scroll back to top"
        >
          {/* Circular Scroll Progress Ring */}
          <svg
            className="w-10 h-10 -rotate-90 pointer-events-none"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#goldGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0B543" />
                <stop offset="100%" stopColor="#C98E2A" />
              </linearGradient>
            </defs>
          </svg>

          {/* Up Chevron Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ChevronUp className="w-5 h-5 text-[#F0B543] transition-transform duration-200 group-hover:-translate-y-0.5" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
