"use client";

import React from 'react';
import { ShieldCheck, MapPin, MessageCircle, Scale, Truck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2D7C5] text-[#1C1411] font-sans">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full p-0.5 bg-gradient-to-tr from-[#C98E2A] via-[#F0B543] to-[#550C12] shadow-sm flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="Sivaji Crackers Logo"
                  className="h-full w-full object-contain rounded-full bg-white p-0.5"
                />
              </div>
              <div>
                <span className="font-black text-lg text-[#550C12] tracking-wider block leading-tight">
                  SHIVAJI CRACKERS
                </span>
                <span className="text-[10px] font-bold text-[#B85D00] uppercase tracking-widest">
                  Sivakasi Factory Direct Hub • Estd 2017
                </span>
              </div>
            </div>

            <p className="text-xs text-[#66574F] leading-relaxed max-w-sm">
              Direct factory wholesale pyrotechnics and festival gift boxes crafted in Sivakasi. Delivering authentic celebrations across Hyderabad, Telangana, and all India with guaranteed NEERI-certified green chemistries and strict regulatory compliance.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 px-2.5 py-1 rounded-lg font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Licensed Sivakasi Dispatch
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF7F2] text-[#550C12] border border-[#E2D7C5] px-2.5 py-1 rounded-lg font-bold">
                <Truck className="w-3.5 h-3.5 text-[#C98E2A]" /> Registered Heavy Transport
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1C1411]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <a href="/" className="text-[#66574F] hover:text-[#550C12] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/estimate" className="text-[#66574F] hover:text-[#550C12] transition-colors">
                  Estimate Price List (150+ Items)
                </a>
              </li>
              <li>
                <a href="/payment" className="text-[#66574F] hover:text-[#550C12] transition-colors">
                  Payment Information (Bank & UPI)
                </a>
              </li>
              <li>
                <a href="/about" className="text-[#66574F] hover:text-[#550C12] transition-colors">
                  About Us & Sivakasi Heritage
                </a>
              </li>
              <li>
                <a href="/contact" className="text-[#66574F] hover:text-[#550C12] transition-colors">
                  Contact Us & Hyderabad Godown
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Testing Helpline */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1C1411]">
              Factory Godown & Test Helpline
            </h4>
            <div className="space-y-2 text-xs text-[#66574F]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#550C12] shrink-0 mt-0.5" />
                <span>Paraipatti Main Road Godown, Sivakasi - 626189, Tamil Nadu, India.</span>
              </p>

              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E2D7C5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1C1411]">Direct WhatsApp Test Desk</span>
                  <span className="text-[10px] font-bold text-[#07542C] bg-[#EBF7F0] px-2 py-0.5 rounded shadow-sm border border-[#A7E2BE]">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[#66574F]">
                  Submit inquiries or test cart orders directly:
                </p>
                <a
                  href="https://wa.me/918318270300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#07542C] hover:bg-[#054022] text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>+91 8318270300</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 mb-8">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-[#B85D00] shrink-0 mt-0.5" />
            <p className="text-xs text-[#66574F] leading-relaxed">
              <strong className="text-[#1C1411] font-bold">Statutory Notice:</strong> As per 2018 Supreme Court Order, Online Sale of Firecrackers are NOT permitted. We Value our customers and at the same time, we respect the jurisdiction. We request our customers to Select Your Products in Estimate Page to see your Estimation and Submit the required crackers through the Get Estimate Button. We will contact you within 2 hrs and Confirm the Order through Phone Call. Please Add and Submit Your enquiries and enjoy your Diwali with Shivaji Crackers. Shivaji Crackers is a shop following 100% legal & statutory compliances and all our shops, go-downs are maintained as per the explosive acts. We send the parcels through registered and legal transport service providers as like every other major Companies in Sivakasi is doing so.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E2D7C5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7A70]">
          <p>© 2025 Shivaji Crackers Sivakasi. All Rights Reserved. Compliant with Explosive Rules.</p>
          <p className="flex items-center gap-1">
            Crafted for Authentic Celebrations with <Heart className="w-3 h-3 text-red-600 fill-red-600" /> in Sivakasi
          </p>
        </div>
      </div>
    </footer>
  );
};
