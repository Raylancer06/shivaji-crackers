"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { api, StoreSettings } from '@/services/api';
import {
  Sparkles,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  Flame,
  Award,
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  titleAccent: string;
  tagline: string;
  description: string;
  priceNote: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  quickSku?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'FESTIVAL SPECIALS & WHOLESALE OFFERS',
    title: 'The Regal Light of',
    titleAccent: 'Festive Fireworks',
    tagline: 'Direct Wholesale Pricing • Flat 70% Off Retail MRP',
    description:
      'Authentic festive pyrotechnics from trusted master craftsmen. 100% CSIR-NEERI green certified chemistries with verified QR codes, delivered safely across Hyderabad & Telangana at uninflated wholesale rates.',
    priceNote: 'Wholesale Starting ₹36/box • Flat 70% Off MRP',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQXmjYNnFd_NqJwXa7RXRdB3PSj_YIMYgM82dwW6UYssWqyTcn7P5T8sulXVl4eJslpKl4uR469TnVm0rwwcwhr1NcNj2Cg0_17WkBBGIV3NkThZiqVZaCMn-MMziYWmJBwnM-IG94Ced2KSBRd9dMHvRG5JBqo1tOJOHh6IdpncroQpBv3OnDyrQxNXHDg_SIC5TS8GCQjUjCjS8KqDdO4oxrAL_wTTC9NxQ0BAWNhXTTtk7J_VTP',
    ctaText: 'Open Wholesale Price List',
    ctaLink: '/estimate',
  },
  {
    id: 2,
    badge: 'GRAND NIGHT SKY DISPLAY CAKES',
    title: 'Royal Symphony Multi-Color',
    titleAccent: 'Aerial Repeaters',
    tagline: '30 & 60 Shots Multi-Color Sky Synchronized Fireworks',
    description:
      'Continuous aerial barrages of golden brocades, crimson willows, and turquoise crackling chrysanthemums ascending 120 feet with smokeless titanium formulations.',
    priceNote: '30-Shot Symphony ₹555 (MRP ₹1,850) | 60-Shot Grand Cake ₹1,020',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
    ctaText: 'View Aerial Pyrotechnics',
    ctaLink: '/estimate',
    quickSku: 'PROD-046',
  },
  {
    id: 3,
    badge: 'READY-TO-DISPATCH FAMILY PACKS',
    title: 'Diwali Anandham &',
    titleAccent: 'Platinum Mega Hampers',
    tagline: 'Complete Family Celebration Hampers • 28 to 65 Assorted Varieties',
    description:
      'Complete festival gift boxes containing sparklers, giant flower pots, chakkars, and sky shots, packed securely with heavy parcel wrapping for safe delivery.',
    priceNote: 'Family Pack ₹780 (MRP ₹2,600) | Platinum Box ₹1,560 (MRP ₹5,200)',
    image:
      'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=1600&auto=format&fit=crop&q=80',
    ctaText: 'Instant Add Family Hamper (₹600)',
    ctaLink: '/estimate',
    quickSku: 'PROD-106',
  },
  {
    id: 4,
    badge: '100% LEGAL & ENVIRONMENTAL SAFETY',
    title: 'Certified CSIR-NEERI',
    titleAccent: 'Green QR Pyrotechnics',
    tagline: 'Supreme Court & PESO Approved CSIR-NEERI Green Crackers',
    description:
      'Strict adherence to Hon’ble Supreme Court directives. Low-emission, zero-barium compositions with verifiable QR codes on every box for completely safe family celebrations.',
    priceNote: 'Low Smoke • Low Decibel (<75 dB) • Certified Green Chemistry',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCX5DCcofIiAjAQdBUYR2YWNV8SswqXXbrf37V5q8qIcl6GIHt0B0DRiwLyCqR-Z1F8gVdwrhAuUpzK-VEuxJddiCsapWAYtwQCci1JEzBryndItMCMcBL2DW3t_J8ho_ib9LhnfWKCCCCUskpJw3N7scSROcpBz7fKiGbHxhqiN6CzjV610tJh1yQDsXEmHm0RAXVIj5TZf98FmtKOsddyV8m46hBXFUA7_ufDNstb8DUPkN9rPVuL',
    ctaText: 'Verify Green QR Standards',
    ctaLink: '#safety',
  },
];

export const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const [settings, setSettings] = useState<Partial<StoreSettings>>({
    badge_1_num: '15+',
    badge_1_title: 'Years Festive Craft',
    badge_1_subtitle: 'Trusted Quality Since 2008',
    badge_2_num: '70%',
    badge_2_title: 'Direct Factory Rate',
    badge_2_subtitle: 'Flat Discount on MRP',
    badge_3_title: '100% Green Certified',
    badge_3_subtitle: 'CSIR-NEERI & PESO Lic',
    badge_4_title: 'Fast & Safe Delivery',
    badge_4_subtitle: 'Tracked Dispatches',
  });

  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((s) => {
      if (isMounted && s) setSettings(s);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[current];

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleCtaClick = (s: Slide) => {
    if (s.quickSku) {
      const p = PRODUCTS.find((prod) => prod.id === s.quickSku);
      if (p) {
        addToCart(p, 1);
        setIsCartOpen(true);
        return;
      }
    }
    if (s.ctaLink.startsWith('/')) {
      window.location.href = s.ctaLink;
      return;
    }
    const target = document.querySelector(s.ctaLink);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative py-6 sm:py-8 bg-[#FAF8F5] overflow-hidden font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Slideshow Container Frame */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E2D7C5] min-h-[520px] sm:min-h-[580px] lg:min-h-[600px] flex items-center bg-[#1A0407]">
          {/* Background Images with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="absolute inset-0 z-0"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-45"
              />
              {/* Luxury Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#200306] via-[#200306]/90 to-transparent lg:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#150204] via-transparent to-[#150204]/40" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Content Layer */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-16 max-w-3xl flex flex-col justify-center gap-4 text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#F0B543]/40 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#F0B543] animate-ping" />
                  <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#F0B543]">
                    {slide.badge}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                  {slide.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0B543] via-[#F8D279] to-[#C98E2A]">
                    {slide.titleAccent}
                  </span>
                </h1>

                {/* English Tagline Subheading */}
                <p className="font-serif text-xs sm:text-sm font-bold text-[#F8D279] tracking-wide">
                  {slide.tagline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed max-w-xl font-normal">
                  {slide.description}
                </p>

                {/* Price Callout Banner */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white font-medium">
                  <Flame className="w-4 h-4 text-[#F0B543]" />
                  <span className="font-bold text-[#F0B543]">{slide.priceNote}</span>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleCtaClick(slide)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C98E2A] via-[#F0B543] to-[#C98E2A] text-[#1C1411] font-serif font-black text-xs sm:text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>

                  <a
                    href="https://wa.me/918374044445?text=Hello%20Sivaji%20Firecracker%2C%20I%20would%20like%20to%20inquire%20about%20festival%20wholesale%20crackers%20and%20orders."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#10B981]" />
                    <span>WhatsApp Order (+91 83740 44445)</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next Slide Arrows */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-[#C98E2A] border border-white/20 hover:border-[#C98E2A] text-white hover:text-[#1C1411] backdrop-blur-md flex items-center justify-center transition-all shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Dots / Indicators */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    current === idx ? 'w-6 bg-[#F0B543]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-[#C98E2A] border border-white/20 hover:border-[#C98E2A] text-white hover:text-[#1C1411] backdrop-blur-md flex items-center justify-center transition-all shadow-lg active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean Luxury Credentials Bar Below Slider (Dynamic from Admin Settings) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2D7C5] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8ED] text-[#550C12] border border-[#C98E2A]/30 flex items-center justify-center shrink-0 font-serif font-black text-sm">
              {settings.badge_1_num || '15+'}
            </div>
            <div>
              <span className="font-serif font-bold text-xs text-[#1C1411] block">
                {settings.badge_1_title || 'Years Festive Craft'}
              </span>
              <span className="text-[11px] text-[#66574F]">
                {settings.badge_1_subtitle || 'Trusted Quality Since 2008'}
              </span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2D7C5] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center shrink-0 font-serif font-black text-sm">
              {settings.badge_2_num || '70%'}
            </div>
            <div>
              <span className="font-serif font-bold text-xs text-[#1C1411] block">
                {settings.badge_2_title || 'Direct Factory Rate'}
              </span>
              <span className="text-[11px] text-[#66574F]">
                {settings.badge_2_subtitle || 'Flat Discount on MRP'}
              </span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2D7C5] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#07542C] border border-[#A7E2BE] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <span className="font-serif font-bold text-xs text-[#1C1411] block">
                {settings.badge_3_title || '100% Green Certified'}
              </span>
              <span className="text-[11px] text-[#66574F]">
                {settings.badge_3_subtitle || 'CSIR-NEERI & PESO Lic'}
              </span>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2D7C5] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8ED] text-[#550C12] border border-[#C98E2A]/30 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#C98E2A]" />
            </div>
            <div>
              <span className="font-serif font-bold text-xs text-[#1C1411] block">
                {settings.badge_4_title || 'Fast & Safe Delivery'}
              </span>
              <span className="text-[11px] text-[#66574F]">
                {settings.badge_4_subtitle || 'Tracked Dispatches'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
