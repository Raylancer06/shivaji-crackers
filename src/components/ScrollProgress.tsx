"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollProgress: React.FC = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPct = (totalScroll / windowHeight) * 100;
        setProgress(scrollPct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none bg-black/5">
      <div
        className="h-full bg-gradient-to-r from-[#C98E2A] via-[#F0B543] to-[#550C12] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(240,181,67,0.9)] relative"
        style={{ width: `${progress}%` }}
      >
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F0B543] shadow-[0_0_8px_#FFF,0_0_12px_#F0B543]" />
      </div>
    </div>
  );
};
