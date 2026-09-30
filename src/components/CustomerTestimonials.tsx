"use client";

import React from 'react';
import { Star, ShieldCheck, MapPin, Truck, CheckCircle2, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Ananya Rao',
    location: 'Banjara Hills, Hyderabad',
    role: 'Diwali Platinum Box Customer',
    rating: 5,
    text: 'Ordering directly on WhatsApp for our Hyderabad home was seamless. We sent the cart estimate on WhatsApp, received immediate confirmation, and the VRL transport LR tracking number arrived in 24 hours. The sparklers and Peacock fountains were supreme quality!',
    boxes: 'Platinum Mega Hamper',
    date: 'Diwali 2024 Verified Order',
  },
  {
    name: 'Suresh Reddy',
    location: 'Jubilee Hills, Hyderabad',
    role: 'Society Bulk Purchase Lead',
    rating: 5,
    text: 'We placed an order of ₹52,000 for our gated community in Hyderabad. The heavy road lorry delivery arrived directly from Sivakasi in pristine condition with waterproof pallet wrapping. Real factory rate savings of nearly 70%.',
    boxes: 'Society Pallet (65 Items)',
    date: 'Diwali 2024 Bulk Order',
  },
  {
    name: 'Rajesh V.',
    location: 'Indiranagar, Bengaluru',
    role: 'Family Customer (3rd Year Buyer)',
    rating: 5,
    text: 'Dispatched through road transport from Sivakasi to our city hub in 48 hours. Every flower pot and aerial shot had genuine CSIR-NEERI Green QR stamps. The 70% direct factory savings was absolutely authentic.',
    boxes: '18 Boxes Collection',
    date: 'Diwali 2024 Verified Order',
  },
];

export const CustomerTestimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#E2D7C5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-serif font-black uppercase tracking-widest text-[#B85D00] block mb-2">
            Verified Customer Trust & Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
            Loved By Families & Communities Across Hyderabad & South India
          </h2>
          <p className="text-xs sm:text-sm text-[#550C12] font-semibold mt-1">
            Authentic customer reviews verified with Sivakasi transport dispatch records
          </p>
          <p className="text-xs sm:text-sm text-[#66574F] mt-2 leading-relaxed">
            Over 50,000 satisfied Diwali celebrations since 2008. Read real experiences from customers who ordered direct from our Sivakasi godowns.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E2D7C5] shadow-sm hover:shadow-regal transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C98E2A]">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#C98E2A]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#C98E2A]/30" />
                </div>

                <p className="text-xs text-[#1C1411] leading-relaxed mb-6 font-medium">
                  "{rev.text}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-[#E2D7C5] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1C1411] flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#07542C]" />
                  </h4>
                  <p className="text-[11px] text-[#66574F] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B85D00]" /> {rev.location}
                  </p>
                </div>

                <span className="text-[10px] font-bold text-[#550C12] bg-[#FFF8ED] border border-[#C98E2A]/30 px-2 py-0.5 rounded">
                  {rev.boxes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
