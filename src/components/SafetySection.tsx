"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, ShieldAlert, Check, AlertTriangle, Scale } from 'lucide-react';

export const SafetySection: React.FC = () => {
  return (
    <section id="safety" className="py-16 bg-white border-y border-[#E2D7C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Green QR Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#3D060B] via-[#550C12] to-[#1C1411] text-white p-6 sm:p-8 rounded-3xl shadow-regal relative overflow-hidden border border-[#C98E2A]/30">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C98E2A]/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#F0B543]">
                <QrCode className="w-5 h-5" />
              </span>
              <span className="text-xs font-serif font-black tracking-widest text-[#F0B543] uppercase">
                100% Genuine Green Chemistry
              </span>
            </div>

            <h3 className="font-serif text-2xl font-black text-white tracking-tight">
              CSIR-NEERI Green QR Stamped on Every Box
            </h3>

            <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">
              Every firework manufactured at our Sivakasi godown carries the statutory CSIR-NEERI Green Logo and QR code. Customers can scan the box using any smartphone to instantly inspect the approved chemical formulation certificate.
            </p>

            <div className="mt-6 pt-6 border-t border-white/15 space-y-2.5 text-xs text-gray-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Zero Barium Nitrate & Heavy Metal Salts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Zero Lead, Arsenic or Mercury Adulteration</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Safe sound decibels within statutory PESO limit</span>
              </div>
            </div>
          </div>

          {/* Right: Statutory Compliance & Safe Firing Guidelines */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8ED] text-[#B85D00] text-xs font-serif font-bold border border-[#C98E2A]/30">
              <Scale className="w-4 h-4 text-[#C98E2A]" />
              <span>Hon'ble Supreme Court of India Compliance (Civil Appeal 235-236/2018)</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411] tracking-tight">
              Safety First: Happy, Responsible Diwali Celebrations
            </h3>

            <p className="text-xs sm:text-sm text-[#66574F] leading-relaxed">
              Sivaji Crackers firmly upholds statutory manufacturing guidelines. All pyrotechnics sold on this platform comply with Central Pollution Control Board (CPCB) norms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E2D7C5] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#B85D00] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#1C1411]">Always Fire in Open Areas</h4>
                  <p className="text-[11px] text-[#66574F] mt-0.5">
                    Maintain a minimum 5-meter safety perimeter from trees, vehicles, and wires.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E2D7C5] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] text-[#07542C] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#1C1411]">Adult Supervision</h4>
                  <p className="text-[11px] text-[#66574F] mt-0.5">
                    Ensure young children light sparklers only under adult supervision with cotton clothes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
