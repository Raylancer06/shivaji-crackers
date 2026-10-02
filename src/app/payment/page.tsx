import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PaymentContent } from './PaymentContent';

export const metadata = {
  title: 'Payment Information | Sivaji Firecracker',
  description: 'Verified UPI and official payment details for Sivaji Firecracker factory direct orders.',
};

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C1411] flex flex-col justify-between">
      <Navbar />
      <PaymentContent />
      <Footer />
    </main>
  );
}
