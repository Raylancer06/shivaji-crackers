"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export const DiwaliCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    // Tick down seconds smoothly
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#3D060B] via-[#550C12] to-[#3D060B] text-white border-y border-[#C98E2A]/40 py-3.5 px-4 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Left Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C98E2A]/20 flex items-center justify-center text-[#F0B543] border border-[#C98E2A]/30">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#F0B543] block">
              Festival Dispatch & Delivery Cutoff
            </span>
            <span className="text-[11px] text-gray-300">
              Seasonal delivery slots filling fast to ensure timely festive arrival
            </span>
          </div>
        </div>

        {/* Countdown Blocks */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-serif">
            <div className="bg-black/40 border border-[#C98E2A]/40 rounded-xl px-2.5 py-1 min-w-[42px] text-center">
              <span className="font-black text-sm sm:text-base text-[#F0B543] block leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block mt-0.5">Days</span>
            </div>
            <span className="text-[#F0B543] font-bold text-xs">:</span>

            <div className="bg-black/40 border border-[#C98E2A]/40 rounded-xl px-2.5 py-1 min-w-[42px] text-center">
              <span className="font-black text-sm sm:text-base text-[#F0B543] block leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block mt-0.5">Hrs</span>
            </div>
            <span className="text-[#F0B543] font-bold text-xs">:</span>

            <div className="bg-black/40 border border-[#C98E2A]/40 rounded-xl px-2.5 py-1 min-w-[42px] text-center">
              <span className="font-black text-sm sm:text-base text-[#F0B543] block leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block mt-0.5">Min</span>
            </div>
            <span className="text-[#F0B543] font-bold text-xs">:</span>

            <div className="bg-black/40 border border-[#C98E2A]/40 rounded-xl px-2.5 py-1 min-w-[42px] text-center">
              <span className="font-black text-sm sm:text-base text-[#10B981] block leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 block mt-0.5">Sec</span>
            </div>
          </div>

          <a
            href="#catalog"
            className="ml-2 hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C98E2A] text-[#1C1411] font-serif font-black text-xs hover:bg-[#F0B543] transition-colors shadow-sm"
          >
            <span>Book Now</span>
          </a>
        </div>
      </div>
    </div>
  );
};
