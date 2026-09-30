"use client";

import React from 'react';
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
    <section id="why-us" className="py-16 md:py-24 bg-[#F2EBE0] border-t border-[#E2D7C5] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-serif font-black uppercase tracking-widest text-[#B85D00] block mb-2">
            Pure Sivakasi Heritage & Traceability
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
            Why Order Directly from Sivaji Crackers?
          </h2>
          <p className="text-xs sm:text-sm text-[#550C12] font-semibold mt-1">
            Genuine Sivakasi Craftsmanship • Zero Middlemen • Direct Factory Wholesale Rates
          </p>
          <p className="text-xs sm:text-sm text-[#66574F] mt-2 leading-relaxed">
            Preserving festival joy with certified chemical safety, transparent wholesale estimates, and direct transport dispatches across Hyderabad, Telangana, and South India.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#550C12] border border-[#C98E2A]/30 flex items-center justify-center mb-4 shadow-sm">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1411]">Direct Factory Gate</h3>
              <p className="text-xs text-[#66574F] mt-2 leading-relaxed">
                Dispatched straight from our Paraipatti godowns in Sivakasi. Bypass layers of local retail markups to enjoy flat 70% direct factory savings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2D7C5]/60 text-[11px] font-bold text-[#B85D00]">
              Zero Middlemen Markup
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between">
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
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mb-4 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1411]">Heavy Lorry Transport</h3>
              <p className="text-xs text-[#66574F] mt-2 leading-relaxed">
                Licensed heavy road parcel carrier booking directly to Hyderabad, Secunderabad, and major Telangana & Andhra transport terminals with official LR tracking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2D7C5]/60 text-[11px] font-bold text-[#550C12]">
              VRL, ARC, SRS & Kranti Hubs
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2D7C5] shadow-regal flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FDE8E8] text-[#7B141C] border border-[#F8B4B4] flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#1C1411]">Master Craftsmanship</h3>
              <p className="text-xs text-[#66574F] mt-2 leading-relaxed">
                High-intensity titanium sparks, extended 60-second fountains, and synchronized multi-color sky repeaters hand-filled by Sivakasi veterans.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2D7C5]/60 text-[11px] font-bold text-[#7B141C]">
              Vibrant Dazzling Colors
            </div>
          </div>
        </div>

        {/* Society & Corporate Tiers Section */}
        <div id="society-tiers" className="mt-14 p-6 sm:p-8 bg-white rounded-3xl border border-[#E2D7C5] shadow-regal">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-serif font-bold text-[#B85D00] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4" /> Society & Corporate Bulk Orders
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411] tracking-tight">
                Special Bulk Discounts For Gated Societies & Corporate Offices
              </h3>
              <p className="text-xs sm:text-sm text-[#66574F] leading-relaxed">
                Organizing a community Diwali night in Hyderabad or corporate employee gifting? We provide custom family hamper bags, society banner printing, and direct pallet lorry delivery right to your society security gate.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-[#1C1411]">
                <span className="flex items-center gap-1.5 text-[#07542C]">
                  <CheckCircle2 className="w-4 h-4" /> Orders &gt; ₹25,000: Extra 5% Factory Rebate
                </span>
                <span className="flex items-center gap-1.5 text-[#07542C]">
                  <CheckCircle2 className="w-4 h-4" /> Orders &gt; ₹50,000: Free Priority Road Freight
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF7F2] p-6 rounded-3xl border border-[#E2D7C5] flex flex-col gap-3 text-center">
              <h4 className="font-serif text-sm font-black text-[#1C1411]">Need a Custom Society Quotation?</h4>
              <p className="text-xs text-[#66574F]">
                Reach our Sivakasi bulk dispatch coordinator directly on WhatsApp for custom billing and Hyderabad delivery timelines.
              </p>
              <a
                href="https://wa.me/918318270300?text=Hi%20Sivaji%20Crackers%2C%20we%20need%20a%20Diwali%20Bulk%20Quotation%20for%20our%20Gated%20Community%20in%20Hyderabad."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#07542C] hover:bg-[#054022] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Bulk Inquiry (+91 8318270300)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
