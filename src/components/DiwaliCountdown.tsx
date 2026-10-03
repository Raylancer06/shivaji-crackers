"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { api, StoreSettings } from '@/services/api';

export const DiwaliCountdown: React.FC = () => {
  const [settings, setSettings] = useState<Partial<StoreSettings>>({
    countdown_enabled: true,
    countdown_title: 'Festival Dispatch & Delivery Cutoff',
    countdown_subtitle: 'Seasonal delivery slots filling fast to ensure timely festive arrival',
    countdown_target_date: '2026-10-21T18:00:00',
    countdown_button_text: 'Book Now',
    countdown_button_link: '/estimate',
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((s) => {
      if (isMounted && s) setSettings(s);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetStr = settings.countdown_target_date || '2026-10-21T18:00:00';
      const targetTime = new Date(targetStr).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (isNaN(diff) || diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.countdown_target_date]);

  if (settings.countdown_enabled === false) {
    return null;
  }

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
              {settings.countdown_title || 'Festival Dispatch & Delivery Cutoff'}
            </span>
            <span className="text-[11px] text-gray-300">
              {settings.countdown_subtitle || 'Seasonal delivery slots filling fast to ensure timely festive arrival'}
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

          <Link
            href={settings.countdown_button_link || '/estimate'}
            className="ml-2 hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C98E2A] text-[#1C1411] font-serif font-black text-xs hover:bg-[#F0B543] transition-colors shadow-sm cursor-pointer"
          >
            <span>{settings.countdown_button_text || 'Book Now'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
