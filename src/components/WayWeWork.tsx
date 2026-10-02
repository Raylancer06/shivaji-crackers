"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Truck,
  ArrowRight,
  CheckCircle2,
  Phone,
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  badge: string;
  shortDesc: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Curating Quality Products',
    badge: 'Step 01 • Factory Quality',
    shortDesc: 'Curating Quality Products',
    description:
      'We carefully select a diverse range of high-quality, safe, and eco-friendly crackers from trusted Sivakasi master craftsmen and certified manufacturers.',
    icon: Sparkles,
    highlights: [
      '100% Genuine Sivakasi Factory Direct Stock',
      'Tested for consistent burst timing and spark intensity',
      'Zero counterfeit formulations',
    ],
  },
  {
    id: 2,
    title: 'Ensuring Safety & Compliance',
    badge: 'Step 02 • Legal Standards',
    shortDesc: 'Ensuring Safety & Compliance',
    description:
      'Before any product reaches our shelves, we verify that it complies with all safety regulations, Hon\'ble Supreme Court guidelines, and CSIR-NEERI green cracker standards.',
    icon: ShieldCheck,
    highlights: [
      'CSIR-NEERI Green QR Code on every retail box',
      'Zero Barium and hazardous heavy metal chemistry',
      'Low decibel sound limits (< 75 dB) for family safety',
    ],
  },
  {
    id: 3,
    title: 'Getting Your Crackers (Estimate Selection)',
    badge: 'Step 03 • Wholesale Catalog',
    shortDesc: 'Getting Your Crackers',
    description:
      'Visit our interactive digital price list to explore over 150+ varieties of crackers. Select your favourite items, customize quantities, and view real-time wholesale estimates.',
    icon: ShoppingBag,
    highlights: [
      'Transparent factory wholesale rates with up to 70% off MRP',
      'Instant minimum order threshold checker (₹3,000 Sivakasi MOQ)',
      '1-click family bundle estimators',
    ],
  },
  {
    id: 4,
    title: 'Order Confirmation & Payment',
    badge: 'Step 04 • Fast Verification',
    shortDesc: 'Order Confirmation & Payment',
    description:
      'After submitting your estimate inquiry, our Sivaji Firecracker customer desk contacts you within 2 hours to confirm stock and shares verified payment details (UPI / Bank Transfer).',
    icon: CreditCard,
    highlights: [
      'Quick phone confirmation on +91 83740 44445',
      'Transparent payment via GPay, PhonePe, or NEFT/RTGS',
      'Official printable estimate invoice generated immediately',
    ],
  },
  {
    id: 5,
    title: 'Delivery & Transport Charges',
    badge: 'Step 05 • Lorry Logistics',
    shortDesc: 'Delivery & Charges',
    description:
      'We offer flexible delivery options with registered heavy road transport carriers from Sivakasi directly to Hyderabad, Secunderabad, and regional hubs across Telangana and Pan-India.',
    icon: Truck,
    highlights: [
      'Heavy waterproof 5-layer corrugated carton packaging',
      'Door/Godown pickup at Hyderabad transport terminals',
      'Live Lorry Receipt (LR) tracking shared upon dispatch',
    ],
  },
];

export const WayWeWork: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const current = STEPS.find((s) => s.id === activeStep) || STEPS[0];
  const Icon = current.icon;

  return (
    <section className="py-16 md:py-24 bg-[#F2EBE0]/60 relative border-t border-b border-[#E2D7C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] text-[#B85D00] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C98E2A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C98E2A]" />
            <span>How Sivaji Firecracker Operates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
            The Way We Work
          </h2>
          <p className="text-xs sm:text-sm text-[#66574F] mt-2 font-normal">
            Five simple steps is all it takes to elevate your festival celebration with authentic factory-direct crackers.
          </p>
        </div>

        {/* 5-Step Interactive Navigation Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {STEPS.map((s) => {
            const isActive = s.id === activeStep;
            const StepIcon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(s.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#550C12] text-white border-[#550C12] shadow-regal scale-[1.02]'
                    : 'bg-white/80 hover:bg-white text-[#1C1411] border-[#E2D7C5] hover:border-[#C98E2A]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      isActive
                        ? 'bg-[#F0B543] text-[#1C1411]'
                        : 'bg-[#FAF8F5] text-[#550C12] border border-[#E2D7C5]'
                    }`}
                  >
                    {s.id}
                  </span>
                  <StepIcon
                    className={`w-4 h-4 ${isActive ? 'text-[#F0B543]' : 'text-[#66574F]'}`}
                  />
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-2">
                  {s.shortDesc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2D7C5] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8ED] text-[#B85D00] text-xs font-bold border border-[#C98E2A]/30">
                <span className="w-2 h-2 rounded-full bg-[#C98E2A]" />
                <span>{current.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#1C1411] tracking-tight">
                {current.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#66574F] leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 space-y-2">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#1C1411] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#07542C] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#550C12] to-[#7B141C] text-white text-xs font-bold shadow-md hover:shadow-regal transition-all"
                >
                  <span>Build Your Estimate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="tel:+918374044445"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#550C12] border border-[#E2D7C5] hover:border-[#550C12] text-xs font-bold transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#550C12]" />
                  <span>Helpline (+91 83740 44445)</span>
                </a>
              </div>
            </div>

            {/* Right Visual Feature Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#2A050A] to-[#150204] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[260px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0B543]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F0B543]">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-white/20">0{current.id}</span>
              </div>

              <div className="relative z-10 space-y-2 mt-6">
                <span className="text-[11px] font-bold text-[#F0B543] uppercase tracking-wider block">
                  Sivaji Firecracker Process
                </span>
                <h4 className="text-lg font-bold text-white leading-snug">
                  {current.title}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Transparent, safe, and compliant with all statutory norms from factory gates to your doorstep.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
