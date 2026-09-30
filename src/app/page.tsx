"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { DiwaliCountdown } from '@/components/DiwaliCountdown';
import { Hero } from '@/components/Hero';
import { BudgetEstimator } from '@/components/BudgetEstimator';
import { FeaturedProductsCarousel } from '@/components/FeaturedProductsCarousel';
import { Features } from '@/components/Features';
import { WayWeWork } from '@/components/WayWeWork';
import { Specifications } from '@/components/Specifications';
import { SafetySection } from '@/components/SafetySection';
import { CustomerTestimonials } from '@/components/CustomerTestimonials';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { LiveOrderTicker } from '@/components/LiveOrderTicker';

export default function Home() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <main className="min-h-screen relative flex flex-col justify-between bg-[#FAF7F2]">
      <Navbar onSearchChange={setGlobalSearch} />
      <Hero />
      <DiwaliCountdown />
      <WayWeWork />
      <BudgetEstimator />
      <FeaturedProductsCarousel />
      <Specifications />
      <Features />
      <SafetySection />
      <CustomerTestimonials />
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <LiveOrderTicker />
    </main>
  );
}
