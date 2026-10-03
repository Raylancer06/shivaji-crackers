"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Scale, Truck, Phone, Mail } from 'lucide-react';
import { api } from '@/services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('sivajiduddempudi42@gmail.com');
  const [phone, setPhone] = useState('+91 83740 44445');

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) {
        if (s.business_email || s.support_email || s.admin_notification_email) {
          setEmail(s.business_email || s.support_email || s.admin_notification_email || 'sivajiduddempudi42@gmail.com');
        }
        if (s.support_phone || s.business_phone) {
          setPhone(s.support_phone || s.business_phone || '+91 83740 44445');
        }
      }
    });
  }, []);

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
                  src="/logo.svg"
                  alt="Sivaji Firecracker Logo"
                  className="h-full w-full object-contain rounded-full bg-white p-0.5"
                />
              </div>
              <div>
                <span className="font-black text-lg text-[#550C12] tracking-wider block leading-tight">
                  SIVAJI FIRECRACKER
                </span>
                <span className="text-[10px] font-bold text-[#B85D00] uppercase tracking-widest">
                  Factory Direct Wholesale Hub • Hyderabad
                </span>
              </div>
            </div>

            <p className="text-xs text-[#66574F] leading-relaxed max-w-sm">
              Direct factory wholesale pyrotechnics and festival gift boxes crafted by Sivaji Firecracker. Delivering authentic celebrations across Hyderabad, Telangana, and all India with guaranteed NEERI-certified green chemistries and strict regulatory compliance.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 px-2.5 py-1 rounded-lg font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> 100% Genuine Sivaji Dispatch
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-[#FAF7F2] text-[#550C12] border border-[#E2D7C5] px-2.5 py-1 rounded-lg font-bold">
                <Truck className="w-3.5 h-3.5 text-[#C98E2A]" /> Safe & Tracked Delivery
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
                  About Us & Heritage
                </a>
              </li>
              <li>
                <a href="/contact" className="text-[#66574F] hover:text-[#550C12] transition-colors">
                  Contact Us & Hyderabad Hub
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-[#66574F] hover:text-[#550C12] transition-colors flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C98E2A]" />
                  <span>Admin Portal</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Customer Helpline */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1C1411]">
              Customer Service & Orders
            </h4>
            <div className="space-y-2 text-xs text-[#66574F]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#550C12] shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana, India.</span>
              </p>

              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E2D7C5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1C1411]">Customer Support Helpline</span>
                  <span className="text-[10px] font-bold text-[#07542C] bg-[#EBF7F0] px-2 py-0.5 rounded shadow-sm border border-[#A7E2BE]">
                    Mon - Sat
                  </span>
                </div>
                <p className="text-[11px] text-[#66574F]">
                  For orders, wholesale pricing, and delivery inquiries:
                </p>
                <div className="space-y-1.5 pt-1">
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2 bg-[#550C12] hover:bg-[#7B141C] text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F0B543]" />
                    <span>{phone}</span>
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-1.5 bg-white border border-[#E2D7C5] text-[#550C12] hover:bg-[#FAF7F2] rounded-xl font-semibold text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 mb-8">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-[#B85D00] shrink-0 mt-0.5" />
            <p className="text-xs text-[#66574F] leading-relaxed">
              <strong className="text-[#1C1411] font-bold">Statutory Notice:</strong> As per 2018 Supreme Court Order, Online Sale of Firecrackers are NOT permitted. We Value our customers and at the same time, we respect the jurisdiction. We request our customers to Select Your Products in Estimate Page to see your Estimation and Submit the required crackers through the order process. We will contact you within 2 hrs and Confirm the Order through Phone Call. Please Add and Submit Your inquiries and enjoy your Diwali with Sivaji Firecracker. Sivaji Firecracker is an enterprise following 100% legal & statutory compliances and all our facilities are maintained as per the explosive acts. We send the parcels through registered and legal delivery service providers.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E2D7C5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7A70]">
          <p>© 2026 Sivaji Firecracker. All Rights Reserved.</p>
          <p className="text-center sm:text-right">
            Designed & Developed by{' '}
            <a
              href="https://raylancer.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#550C12] hover:text-[#C98E2A] transition-colors hover:underline"
            >
              Raylancer Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
