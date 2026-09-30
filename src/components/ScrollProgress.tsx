"use client";

import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 pointer-events-none bg-black/5">
      <div
        className="h-full bg-gradient-to-r from-festive-gold via-festive-crimson to-primary transition-all duration-150 ease-out shadow-[0_0_10px_rgba(245,158,11,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
