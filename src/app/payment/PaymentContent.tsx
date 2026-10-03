"use client";

import React, { useState, useEffect } from 'react';
import { api, StoreSettings } from '@/services/api';
import {
  Sparkles,
  Building2,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const PaymentContent: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    business_name: 'Sivaji Firecracker',
    business_city: 'Hyderabad',
    business_phone: '+91 83740 44445',
    business_email: 'sivajiduddempudi42@gmail.com',
    minimum_cart_value: 2000,
    upi_id: 'sivajiduddempudi422@axl',
    upi_payee_name: 'Sivaji Duddempudi',
    currency_symbol: '₹',
    shipping_charge: 150,
    free_shipping_enabled: false,
    free_shipping_threshold: 5000,
    budget_builder_enabled: true,
    budget_builder_badge: '',
    budget_builder_title: '',
    budget_builder_subtitle: '',
    budget_builder_description: '',
    bank_transfer_enabled: false,
    bank_account_name: '',
    bank_account_number: '',
    bank_ifsc_code: '',
    bank_name: '',
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  const copyUpiId = () => {
    if (settings.upi_id) {
      navigator.clipboard.writeText(settings.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const showBankTransfer = Boolean(
    settings.bank_transfer_enabled && settings.bank_account_number && settings.bank_account_number.trim() !== ''
  );

  return (
    <>
      {/* Hero Header */}
      <section className="pt-28 pb-14 bg-gradient-to-b from-[#200306] to-[#3D060B] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#F0B543]/40 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#F0B543]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F0B543]">
              Official Payment Methods
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Payment Information
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-200 leading-relaxed font-normal">
            Safe, verified, and transparent payment channels for confirming your Sivaji Firecracker festival order.
          </p>
        </div>
      </section>

      {/* Payment Options Grid */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className={`grid grid-cols-1 ${
            showBankTransfer ? 'md:grid-cols-3' : 'md:grid-cols-2'
          } gap-6`}
        >
          {/* Optional Bank Transfer Card (Shown only when configured & enabled by admin) */}
          {showBankTransfer && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2D7C5] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 flex items-center justify-center text-[#B85D00] mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#1C1411] mb-1">
                  Bank Transfer (NEFT / RTGS)
                </h3>
                <p className="text-xs text-[#66574F] mb-5">
                  Direct current account transfer for wholesale and corporate orders.
                </p>

                <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D7C5] text-xs">
                  {settings.bank_account_name && (
                    <div>
                      <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                        Account Name
                      </span>
                      <span className="font-bold text-[#1C1411] text-sm">
                        {settings.bank_account_name}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                      Account Number
                    </span>
                    <span className="font-mono font-bold text-[#550C12] text-sm">
                      {settings.bank_account_number}
                    </span>
                  </div>
                  {settings.bank_ifsc_code && (
                    <div>
                      <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                        IFSC Code
                      </span>
                      <span className="font-mono font-bold text-[#1C1411]">
                        {settings.bank_ifsc_code}
                      </span>
                    </div>
                  )}
                  {settings.bank_name && (
                    <div>
                      <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                        Bank & Branch
                      </span>
                      <span className="font-medium text-[#1C1411]">
                        {settings.bank_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero Transaction Charges</span>
              </div>
            </div>
          )}

          {/* Google Pay & UPI Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2D7C5] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] border border-[#4285F4]/30 flex items-center justify-center text-[#1A73E8] mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1C1411] mb-1">
                Official Business UPI (All Apps)
              </h3>
              <p className="text-xs text-[#66574F] mb-5">
                Instant UPI payment using Google Pay, PhonePe, Paytm, or BHIM.
              </p>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D7C5] text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                    Official Business UPI ID
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="font-mono font-black text-xs sm:text-sm text-[#550C12] select-all break-all">
                      {settings.upi_id || 'sivajiduddempudi422@axl'}
                    </span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#C98E2A]/40 text-[#550C12] hover:bg-[#FFF8ED] text-[11px] font-bold transition shadow-2xs shrink-0 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#C98E2A]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                    Registered Account Holder
                  </span>
                  <span className="font-bold text-[#1C1411]">
                    {settings.upi_payee_name || 'Sivaji Duddempudi'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-[#B85D00] font-medium leading-relaxed border border-amber-200">
                  After paying, save the 12-digit UTR number and attach the screenshot in your order.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Instant Payment Verification</span>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                GPay • PhonePe • Paytm • BHIM
              </span>
            </div>
          </div>

          {/* Customer Verification Helpline Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2D7C5] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 flex items-center justify-center text-[#B85D00] mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1C1411] mb-1">
                Customer Verification Desk
              </h3>
              <p className="text-xs text-[#66574F] mb-5">
                Direct verification hotline for orders, UTR submission & lorry booking.
              </p>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D7C5] text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                    Helpline Number
                  </span>
                  <a
                    href="tel:+918374044445"
                    className="font-mono font-black text-base text-[#550C12] hover:text-[#7B141C] transition block mt-0.5"
                  >
                    +91 83740 44445
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">
                    Operating Hours
                  </span>
                  <span className="font-bold text-[#1C1411]">
                    7:00 AM – 11:00 PM (Diwali Season)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-[#B85D00] font-medium leading-relaxed border border-amber-200">
                  After placing your order online, submit payment proof in checkout or directly over WhatsApp.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verified Direct Line</span>
              </div>
              <a
                href="https://wa.me/918374044445?text=Hello%20Sivaji%20Crackers%2C%20I%20have%20an%20enquiry%20regarding%20payment%20verification."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-Step Instructions After Payment */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D7C5] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#B85D00]" />
            <h3 className="text-xl font-black text-[#1C1411]">
              How to Complete Your Order Confirmation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h4 className="text-sm font-bold text-[#1C1411]">Build Estimate</h4>
              <p className="text-xs text-[#66574F]">
                Select crackers on our price list and click Proceed to Checkout.
              </p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h4 className="text-sm font-bold text-[#1C1411]">Pay via UPI</h4>
              <p className="text-xs text-[#66574F]">
                Transfer exact wholesale total to UPI ID <strong className="font-mono text-[#550C12]">{settings.upi_id || 'sivajiduddempudi422@axl'}</strong>.
              </p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h4 className="text-sm font-bold text-[#1C1411]">Submit UTR & Proof</h4>
              <p className="text-xs text-[#66574F]">
                Enter your 12-digit UTR reference and attach payment screenshot.
              </p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h4 className="text-sm font-bold text-[#1C1411]">Dispatch & Tracking</h4>
              <p className="text-xs text-[#66574F]">
                Admin verifies payment and shares official dispatch updates and tracking details.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E2D7C5] flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#66574F]">
              Have questions regarding payment? Contact our helpline:{' '}
              <strong className="text-[#1C1411]">+91 83740 44445</strong>
            </div>
            <a
              href="https://wa.me/918374044445?text=Hello%20Sivaji%20Crackers%2C%20I%20have%20sent%20a%20payment%20and%20would%20like%20to%20confirm%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#07542C] text-white text-xs font-bold shadow-md hover:bg-[#0B8043] transition-all flex items-center gap-1.5"
            >
              <span>Share Payment Screenshot on WhatsApp (+91 83740 44445)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
