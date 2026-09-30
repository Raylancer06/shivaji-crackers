import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, Building2, Smartphone, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Payment Information | Shivaji Crackers Sivakasi',
  description: 'Verified Bank and UPI payment details for Shivaji Crackers Sivakasi factory direct orders.',
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
            Safe, verified, and transparent banking channels for confirming your Shivaji Crackers Diwali 2025 factory dispatch.
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
                  <span className="font-bold text-[#1C1411] text-sm">SHIVAJI CRACKERS</span>
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
                  <span className="font-medium text-[#1C1411]">Bank of Baroda, Sivakasi Main Branch</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero Transaction Charges</span>
            </div>
          </div>

          {/* Google Pay Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2D7C5] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] border border-[#4285F4]/30 flex items-center justify-center text-[#1A73E8] mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1C1411] mb-1">
                Google Pay (UPI)
              </h3>
              <p className="text-xs text-[#66574F] mb-5">
                Instant UPI transfer using your Google Pay mobile app.
              </p>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D7C5] text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">GPay Mobile Number</span>
                  <span className="font-mono font-black text-base text-[#1A73E8]">+91 8318270300</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Registered Payee</span>
                  <span className="font-bold text-[#1C1411]">Shivaji Crackers / Authorized Billing Desk</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 text-[11px] text-[#1A73E8] font-medium leading-relaxed">
                  Mention your Estimate Order ID in the payment note/remarks.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Instant Confirmation</span>
            </div>
          </div>

          {/* PhonePe Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2D7C5] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED] mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#1C1411] mb-1">
                PhonePe / Paytm (UPI)
              </h3>
              <p className="text-xs text-[#66574F] mb-5">
                Scan or send via any UPI provider to our verified desk number.
              </p>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2D7C5] text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">PhonePe Mobile Number</span>
                  <span className="font-mono font-black text-base text-[#7C3AED]">+91 8318270300</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#66574F] uppercase tracking-wider block">Accepted Apps</span>
                  <span className="font-bold text-[#1C1411]">PhonePe, BHIM, Paytm, Amazon Pay</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 text-[11px] text-[#7C3AED] font-medium leading-relaxed">
                  Share the transaction screenshot directly on WhatsApp after payment.
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2D7C5] flex items-center gap-1.5 text-[11px] font-bold text-[#07542C]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Safe 100% Encrypted UPI</span>
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
              <p className="text-xs text-[#66574F]">Select crackers on our price list and click Get Estimate or WhatsApp Order.</p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">2</span>
              <h4 className="text-sm font-bold text-[#1C1411]">Receive Verification</h4>
              <p className="text-xs text-[#66574F]">Our Sivakasi godown confirms final stock and transport booking slot.</p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">3</span>
              <h4 className="text-sm font-bold text-[#1C1411]">Transfer Amount</h4>
              <p className="text-xs text-[#66574F]">Pay using Bank Transfer, GPay, or PhonePe to +91 8318270300.</p>
            </div>
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#550C12] text-white flex items-center justify-center font-bold text-xs">4</span>
              <h4 className="text-sm font-bold text-[#1C1411]">Lorry Receipt (LR)</h4>
              <p className="text-xs text-[#66574F]">Receive your official road transport tracking receipt for pickup in Hyderabad.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E2D7C5] flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#66574F]">
              Have questions regarding payment? Contact our helpline: <strong className="text-[#1C1411]">+91 8318270300</strong>
            </div>
            <a
              href="https://wa.me/918318270300?text=Hello%20Shivaji%20Crackers%2C%20I%20have%20sent%20a%20payment%20and%20would%20like%20to%20confirm%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#07542C] text-white text-xs font-bold shadow-md hover:bg-[#0B8043] transition-all flex items-center gap-1.5"
            >
              <span>Share Payment Screenshot on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
