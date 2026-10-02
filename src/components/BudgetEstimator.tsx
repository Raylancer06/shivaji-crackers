"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import { Sparkles, ShoppingBag, Check, ArrowRight, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackageTier {
  id: string;
  name: string;
  subtitle: string;
  budget: number;
  mrp: number;
  description: string;
  itemsSummary: string;
  itemSkus: { sku: string; qty: number }[];
  tag: string;
}

const TIERS: PackageTier[] = [
  {
    id: 'starter',
    name: 'Diwali Anandham Family Pack',
    subtitle: 'Essential Family Celebration (30 Items + Sparklers)',
    budget: 3120,
    mrp: 10400,
    description: 'Perfect balanced festival pack for a family with sparklers, flower pots, chakkars, and colorful ground spinners.',
    itemsSummary: 'Family Gift Box (30 Items) + 5 Boxes Sparklers + Flower Pots + Ground Chakkars',
    tag: 'Meets Minimum Order',
    itemSkus: [
      { sku: 'PROD-105', qty: 2 },
      { sku: 'PROD-011', qty: 5 },
      { sku: 'PROD-034', qty: 4 },
      { sku: 'PROD-045', qty: 3 },
      { sku: 'PROD-001', qty: 5 },
    ],
  },
  {
    id: 'grand',
    name: 'Sivaji Royal Platinum Hamper',
    subtitle: 'Our Flagship Festive Collection (50 Items + Fancy Aerials)',
    budget: 5250,
    mrp: 17500,
    description: 'Our most popular festive pack with aerial repeaters, sky night cakes, giant pots, multi-color sparklers, and kid novelties.',
    itemsSummary: 'Family Gift Box (50 Items) + Penta Colour Aerials + Night Fountains + Big Pots',
    tag: 'Most Popular Choice',
    itemSkus: [
      { sku: 'PROD-107', qty: 2 },
      { sku: 'PROD-046', qty: 3 },
      { sku: 'PROD-047', qty: 3 },
      { sku: 'PROD-035', qty: 4 },
      { sku: 'PROD-012', qty: 4 },
    ],
  },
  {
    id: 'spectacular',
    name: 'Mega Aerial Night Carnival',
    subtitle: 'Grand Sky Spectacular Display Box (60 Items + Pipe Shots)',
    budget: 9800,
    mrp: 32600,
    description: 'Designed for enthusiasts who want maximum aerial sky fireworks, continuous multi-shot display cakes, and heavy sound.',
    itemsSummary: 'Family Gift Box (60 Items) + 3.5\" Fancy Pipes + Multi-Colour Out + Jumbo Chakkars',
    tag: 'Night Sky Spectacle',
    itemSkus: [
      { sku: 'PROD-108', qty: 2 },
      { sku: 'PROD-048', qty: 5 },
      { sku: 'PROD-047', qty: 5 },
      { sku: 'PROD-030', qty: 4 },
      { sku: 'PROD-036', qty: 4 },
    ],
  },
];

export const BudgetEstimator: React.FC = () => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedTier, setSelectedTier] = useState<PackageTier>(TIERS[1]);
  const [added, setAdded] = useState(false);

  const handleAddBundle = () => {
    selectedTier.itemSkus.forEach(({ sku, qty }) => {
      const product = PRODUCTS.find((p) => p.id === sku) || PRODUCTS[0];
      if (product) {
        addToCart(product, qty);
      }
    });

    setAdded(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4972B', '#7B141C', '#0B8043'],
      });
    } catch (e) {}

    setTimeout(() => {
      setAdded(false);
      setIsCartOpen(true);
    }, 800);
  };

  return (
    <section id="budget-builder" className="py-14 sm:py-20 bg-[#FAF8F5] border-t border-[#E2D7C5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] text-[#B85D00] text-xs font-serif font-bold uppercase tracking-wider mb-2 border border-[#C98E2A]/30">
            <Gift className="w-3.5 h-3.5 text-[#C98E2A]" />
            <span>Instant 1-Click Bundle Calculator</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
            Smart Budget Builder For Families & Societies
          </h2>
          <p className="text-xs sm:text-sm text-[#550C12] font-semibold mt-1">
            Curated Diwali celebration bundles tailored for every budget
          </p>
          <p className="text-xs sm:text-sm text-[#66574F] mt-2 leading-relaxed">
            Don't have time to pick 40 individual crackers? Select your celebration budget below. Our master packers have balanced sparklers, flower pots, and sky shots to give you the highest variety and savings.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const isSelected = selectedTier.id === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier)}
                className={`cursor-pointer rounded-3xl p-6 transition-all duration-300 relative flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white shadow-deep border-[#550C12] ring-2 ring-[#C98E2A]/60 scale-[1.02]'
                    : 'bg-[#FAF8F5] hover:bg-white border-[#E2D7C5] shadow-sm hover:shadow-regal'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-serif text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30">
                    {tier.tag}
                  </span>
                  <span className="font-serif font-black text-xs text-[#07542C] bg-[#EBF7F0] px-2 py-0.5 rounded">
                    Save ₹{(tier.mrp - tier.budget).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-serif font-black text-xl text-[#1C1411]">{tier.name}</h3>
                  <p className="text-xs text-[#7B141C] font-medium mt-0.5">{tier.subtitle}</p>

                  <div className="flex items-baseline gap-2.5 my-4">
                    <span className="font-serif font-black text-3xl text-[#550C12]">
                      ₹{tier.budget.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      MRP ₹{tier.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-[#66574F] leading-relaxed mb-4">{tier.description}</p>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E2D7C5] text-[11px] text-[#1C1411] font-semibold space-y-1 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D00] block">
                      Box Breakdown:
                    </span>
                    <p>{tier.itemsSummary}</p>
                  </div>
                </div>

                {/* Select Radio Pill */}
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#550C12] text-white shadow-sm'
                      : 'bg-white border border-[#E2D7C5] text-[#550C12] hover:bg-[#F2EBE0]'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 text-[#F0B543]" /> : null}
                  <span>{isSelected ? 'Selected Bundle' : 'Select This Pack'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom 1-Click Action Bar */}
        <div className="mt-10 bg-white p-5 sm:p-6 rounded-3xl shadow-regal border border-[#E2D7C5] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#550C12] border border-[#C98E2A]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#C98E2A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base text-[#1C1411]">
                  Ready to Order: {selectedTier.name}
                </h4>
                <span className="text-xs font-serif font-black text-[#550C12]">
                  (₹{selectedTier.budget.toLocaleString('en-IN')})
                </span>
              </div>
              <p className="text-xs text-[#66574F]">
                100% CSIR-NEERI Green Certified • Fast & Safe Delivery to Hyderabad & Telangana
              </p>
            </div>
          </div>

          <button
            onClick={handleAddBundle}
            className={`px-6 py-3.5 rounded-xl font-serif font-bold text-sm text-white shadow-regal hover:shadow-deep transition-all flex items-center gap-2 shrink-0 ${
              added
                ? 'bg-[#07542C]'
                : 'bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>Bundle Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#F0B543]" />
                <span>Add Selected Bundle to Cart</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
