"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Factory,
  CheckCircle2,
  Building,
  MessageCircle,
} from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section id="why-us" className="py-16 md:py-24 bg-[#F2EBE0] border-t border-[#E2D7C5] font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs font-serif font-black uppercase tracking-widest text-[#B85D00] block mb-2">
            Premium Quality & Full Traceability
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
            Why Order Directly from Sivaji Firecracker?
          </h2>
          <p className="text-xs sm:text-sm text-[#550C12] font-semibold mt-1">
            Genuine Master Craftsmanship • Transparent Pricing • Direct Wholesale Rates
          </p>
          <p className="text-xs sm:text-sm text-[#66574F] mt-2 leading-relaxed">
            Preserving festival joy with certified chemical safety, transparent wholesale pricing, and reliable delivery across Hyderabad, Telangana, and South India.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between hover:shadow-xl transition-shadow"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#550C12] border border-[#C98E2A]/30 flex items-center justify-center mb-4 shadow-sm">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1411]">Direct Wholesale Rates</h3>
              <p className="text-xs text-[#66574F] mt-2 leading-relaxed">
                Dispatched straight from Sivaji Firecracker facilities. Bypass layers of local retail markups to enjoy genuine wholesale festival savings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2D7C5]/60 text-[11px] font-bold text-[#B85D00]">
              Zero Middlemen Markup
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between hover:shadow-xl transition-shadow"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF7F0] text-[#07542C] border border-[#A7E2BE] flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1411]">CSIR-NEERI Green QR</h3>
              <p className="text-xs text-[#66574F] mt-2 leading-relaxed">
                Certified low-emission chemical formulations with scannable Green QR on each box. 30-35% lower particulates with zero harmful heavy metal salts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2D7C5]/60 text-[11px] font-bold text-[#07542C]">
              100% Supreme Court Compliant
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between hover:shadow-xl transition-shadow"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mb-4 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1411]">Fast & Safe Delivery</h3>
              <p className="text-xs text-[#66574F] mt-2 leading-relaxed">
                Reliable, compliant dispatch directly to Hyderabad, Secunderabad, and major Telangana & Andhra locations with confirmed order updates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2D7C5]/60 text-[11px] font-bold text-[#550C12]">
              Safe & Tracked Delivery
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between hover:shadow-xl transition-shadow"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FDE8E8] text-[#7B141C] border border-[#F8B4B4] flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1411]">Master Craftsmanship</h3>
              <p className="text-xs text-[#66574F] mt-2 leading-relaxed">
                High-intensity titanium sparks, extended 60-second fountains, and synchronized multi-color sky repeaters hand-crafted by expert pyrotechnic veterans.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2D7C5]/60 text-[11px] font-bold text-[#7B141C]">
              Vibrant Dazzling Colors
            </div>
          </motion.div>
        </motion.div>

        {/* Society & Corporate Tiers Section */}
        <motion.div
          id="society-tiers"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-14 p-6 sm:p-8 bg-white rounded-3xl border border-[#E2D7C5] shadow-regal"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-serif font-bold text-[#B85D00] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4" /> Society & Corporate Bulk Orders
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411] tracking-tight">
                Special Bulk Discounts For Gated Societies & Corporate Offices
              </h3>
              <p className="text-xs sm:text-sm text-[#66574F] leading-relaxed">
                Organizing a community Diwali night in Hyderabad or corporate employee gifting? We provide custom family hamper bags, society banner printing, and direct delivery right to your society security gate.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-[#1C1411]">
                <span className="flex items-center gap-1.5 text-[#07542C]">
                  <CheckCircle2 className="w-4 h-4" /> Orders &gt; ₹25,000: Extra 5% Direct Rebate
                </span>
                <span className="flex items-center gap-1.5 text-[#07542C]">
                  <CheckCircle2 className="w-4 h-4" /> Orders &gt; ₹50,000: Free Priority Delivery
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF7F2] p-6 rounded-3xl border border-[#E2D7C5] flex flex-col gap-3 text-center">
              <h4 className="font-serif text-sm font-black text-[#1C1411]">Need a Custom Society Quotation?</h4>
              <p className="text-xs text-[#66574F]">
                Reach our customer care team directly on WhatsApp for custom billing and Hyderabad delivery timelines.
              </p>
              <a
                href="https://wa.me/918374044445?text=Hi%20Sivaji%20Firecracker%2C%20we%20need%20a%20Diwali%20Bulk%20Quotation%20for%20our%20Gated%20Community%20in%20Hyderabad."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#07542C] hover:bg-[#054022] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Bulk Inquiry (+91 8318270300)</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
