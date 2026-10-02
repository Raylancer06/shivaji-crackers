import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, Building2, Smartphone, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Payment Information | Sivaji Firecracker',
  description: 'Verified Bank and UPI payment details for Sivaji Firecracker factory direct orders.',
};

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C1411]">
      <Navbar />

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bank Transfer Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2D7C5] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 flex items-center justify-center text-[#B85D00] mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1C1411] mb-1">
                Bank Transfer (NEFT / RTGS)
              </h3>
              <p className="text-xs text-[#66574F] mb-5">
                Direct current account transfer for wholesale and family hampers.
              </p>

              <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D7C5] text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Account Name</span>
                  <span className="font-bold text-[#1C1411] text-sm">SIVAJI FIRECRACKER</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Account Number</span>
                  <span className="font-mono font-bold text-[#550C12] text-sm">33090100007686</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">IFSC Code</span>
                  <span className="font-mono font-bold text-[#1C1411]">BARB0SIVAKA</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Bank & Branch</span>
                  <span className="font-medium text-[#1C1411]">Bank of Baroda, Hyderabad Main Branch</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero Transaction Charges</span>
            </div>
          </div>

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
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Official Business UPI ID</span>
                  <span className="font-mono font-black text-sm text-[#550C12] bg-amber-50 p-2 rounded-lg border border-amber-200 block mt-1 select-all">sivajiduddempudi422@axl</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Registered Account Holder</span>
                  <span className="font-bold text-[#1C1411]">Sivaji Duddempudi</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-[#B85D00] font-medium leading-relaxed border border-amber-200">
                  After paying, save the 12-digit UTR number and upload the screenshot.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Instant Confirmation</span>
            </div>
          </div>

          {/* Customer Verification Helpline Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2D7C5] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 flex items-center justify-center text-[#B85D00] mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1C1411] mb-1">
                Customer Verification Desk
              </h3>
              <p className="text-xs text-[#66574F] mb-5">
                Direct verification hotline for orders, UTR submission & lorry booking.
              </p>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D7C5] text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Helpline Number</span>
                  <span className="font-mono font-black text-base text-[#550C12]">+91 83740 44445</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Operating Hours</span>
                  <span className="font-bold text-[#1C1411]">7:00 AM – 11:00 PM (Diwali Season)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-[#B85D00] font-medium leading-relaxed border border-amber-200">
                  After placing your order online, submit payment proof in checkout or account portal.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Verified Direct Line</span>
            </div>
          </div>
        </div>

        {/* 4-Step Instructions After Payment */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-[#E2D7C5] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#B85D00]" />
            <h3 className="text-xl font-black text-[#1C1411]">
              How to Complete Your Order Confirmation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">1</span>
              <h4 className="text-sm font-bold text-[#1C1411]">Build Estimate</h4>
              <p className="text-xs text-[#66574F]">Select crackers on our price list and click Proceed to Checkout.</p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">2</span>
              <h4 className="text-sm font-bold text-[#1C1411]">Pay via UPI</h4>
              <p className="text-xs text-[#66574F]">Transfer exact wholesale total to UPI ID sivajiduddempudi422@axl.</p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">3</span>
              <h4 className="text-sm font-bold text-[#1C1411]">Submit UTR & Proof</h4>
              <p className="text-xs text-[#66574F]">Enter your 12-digit UTR reference and attach payment screenshot.</p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">4</span>
              <h4 className="text-sm font-bold text-[#1C1411]">Dispatch & Tracking</h4>
              <p className="text-xs text-[#66574F]">Admin verifies payment and shares official dispatch updates and tracking details.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E2D7C5] flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#66574F]">
              Have questions regarding payment? Contact our helpline: <strong className="text-[#1C1411]">+91 83740 44445</strong>
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

      <Footer />
    </main>
  );
}
