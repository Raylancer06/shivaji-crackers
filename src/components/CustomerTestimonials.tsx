"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, MapPin, Truck, CheckCircle2, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Ananya Rao',
    location: 'Banjara Hills, Hyderabad',
    role: 'Diwali Platinum Box Customer',
    rating: 5,
    text: 'Ordering directly for our Hyderabad home was seamless. We placed the order, received immediate confirmation, and tracking details arrived promptly. The sparklers and Peacock fountains were supreme quality!',
    boxes: 'Platinum Mega Hamper',
    date: 'Diwali Verified Order',
  },
  {
    name: 'Suresh Reddy',
    location: 'Jubilee Hills, Hyderabad',
    role: 'Society Bulk Purchase Lead',
    rating: 5,
    text: 'We placed an order of ₹52,000 for our gated community in Hyderabad. The delivery arrived in pristine condition with safe protective packaging. Real wholesale rate savings of nearly 70%.',
    boxes: 'Society Pallet (65 Items)',
    date: 'Diwali Bulk Order',
  },
  {
    name: 'Rajesh V.',
    location: 'Indiranagar, Bengaluru',
    role: 'Family Customer (3rd Year Buyer)',
    rating: 5,
    text: 'Dispatched safely and delivered to our city in 48 hours. Every flower pot and aerial shot had genuine CSIR-NEERI Green QR stamps. The wholesale savings was absolutely authentic.',
    boxes: '18 Boxes Collection',
    date: 'Diwali Verified Order',
  },
];

export const CustomerTestimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#E2D7C5] font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-serif font-black uppercase tracking-widest text-[#B85D00] block mb-2">
            Verified Customer Trust & Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
            Loved By Families & Communities Across Hyderabad & South India
          </h2>
          <p className="text-xs sm:text-sm text-[#550C12] font-semibold mt-1">
            Authentic customer reviews verified with Sivaji Firecracker dispatch records
          </p>
          <p className="text-xs sm:text-sm text-[#66574F] mt-2 leading-relaxed">
            Over 50,000 satisfied Diwali celebrations since 2008. Read real experiences from customers who ordered direct from Sivaji Firecracker.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {REVIEWS.map((rev, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ duration: 0.35 }}
              className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E2D7C5] shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between hover:border-[#C98E2A]/50"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
