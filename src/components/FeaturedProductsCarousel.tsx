"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, Product } from '@/data/products';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Package,
  Volume2,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  Maximize2,
} from 'lucide-react';
import Link from 'next/link';
import { ImageLightboxModal } from './ImageLightboxModal';

// Curated selection of top-selling products across key categories
const FEATURED_IDS = [
  'PROD-105', // Family Gift Box (30 items)
  'PROD-046', // Penta Park multi colour aerials
  'PROD-047', // 2.5" Fancy Aerial pipe
  'PROD-107', // Family Gift Box (50 items)
  'PROD-048', // 3.5" Fancy Pipe
  'PROD-011', // 10cm Electric Sparklers
  'PROD-034', // Flower Pots Special
  'PROD-030', // Hydro Bomb
  'PROD-108', // Family Gift Box (60 items)
  'PROD-045', // 7 Shots colour
  'PROD-005', // Gold Lakshmi
  'PROD-035', // Flower Pots Big
];

export const FeaturedProductsCarousel: React.FC = () => {
  const { addToCart, items } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);

  const fallbackFeatured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
    Boolean
  ) as Product[];

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(fallbackFeatured);

  useEffect(() => {
    let isMounted = true;
    api.getFeaturedProducts().then((data) => {
      if (isMounted && data && data.length > 0) {
        setFeaturedProducts(data);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product, customQty?: number) => {
    const qty = customQty || quantities[product.id] || 1;
    addToCart(product, qty);

    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="featured-products" className="py-16 md:py-24 bg-[#FAF8F5] relative font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 pb-6 border-b border-[#E2D7C5]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] text-[#B85D00] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C98E2A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C98E2A]" />
              <span>Festival Bestsellers & Top Picks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
              Featured Festive Crackers
            </h2>
            <p className="text-xs sm:text-sm text-[#66574F] mt-1 max-w-xl font-normal">
              Direct wholesale pyrotechnics with up to 80% discount savings. Handpicked favorites ready for direct delivery.
            </p>
          </div>

          {/* Navigation Controls & View All Link */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/estimate"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#550C12] hover:text-[#7B141C] border border-[#E2D7C5] bg-white hover:bg-[#F2EBE0] px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <span>View Full Price List (150+)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C98E2A]" />
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-xl bg-white border border-[#E2D7C5] hover:border-[#550C12] text-[#1C1411] hover:text-[#550C12] flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-xl bg-white border border-[#E2D7C5] hover:border-[#550C12] text-[#1C1411] hover:text-[#550C12] flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {featuredProducts.map((product) => {
            const currentQty = quantities[product.id] || 1;
            const cartItem = items.find((item) => item.product.id === product.id);
            const isAdded = addedAnimation[product.id];
            const discountPct = Math.min(80, Math.round(((product.mrp - product.price) / product.mrp) * 100));

            return (
              <div
                key={product.id}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-3xl border border-[#E2D7C5] shadow-regal hover:shadow-deep transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Product Image Frame with Lightbox Trigger */}
                <div
                  className="relative h-48 w-full overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => setLightboxProduct(product)}
                  title="Click to view image zoom and specifications"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-[#7B141C] text-white px-2.5 py-0.5 rounded-full text-xs font-black shadow-md border border-[#F0B543]/40">
                    {discountPct}% OFF
                  </div>

                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                      {product.badge}
                    </div>
                  )}

                  {/* Zoom Overlay Button */}
                  <div className="absolute bottom-9 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/75 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Maximize2 className="w-3 h-3 text-[#F0B543]" />
                      <span>Zoom</span>
                    </span>
                  </div>

                  {/* Ribbon Info */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3 text-[#F0B543]" />
                      {product.pieces}
                    </span>
                    <span className="flex items-center gap-1 text-[#A7E2BE]">
                      <ShieldCheck className="w-3 h-3" />
                      Green QR
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#66574F] mb-1">
                      <span className="font-mono font-bold uppercase tracking-wider text-[#B85D00] text-[11px]">
                        {product.id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#5C4D44] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E2D7C5]">
                        <Volume2 className="w-3 h-3 text-[#07542C]" /> {product.soundLevel}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#1C1411] group-hover:text-[#550C12] transition-colors leading-snug line-clamp-1">
                      <Link href={`/product/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-[11px] font-semibold text-[#7B141C] mt-0.5 truncate">
                      {product.subtitle}
                    </p>

                    <p className="text-xs text-[#66574F] mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing & Add to Cart Controls */}
                  <div className="mt-4 pt-3 border-t border-[#E2D7C5]">
                    <div className="flex items-baseline justify-between mb-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-xl text-[#550C12]">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.mrp}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#07542C] bg-[#EBF7F0] px-2 py-0.5 rounded">
                        Save ₹{product.mrp - product.price}
                      </span>
                    </div>

                    {/* Quantity Stepper & Add Button */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#E2D7C5] rounded-xl bg-[#FAF8F5] p-0.5">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 ${
                          isAdded
                            ? 'bg-[#07542C] text-white shadow-md'
                            : 'bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white shadow-regal'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 animate-bounce" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#F0B543]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                    {cartItem && (
                      <div className="mt-2 text-right">
                        <span className="text-[10px] text-[#07542C] font-bold">
                          In cart: {cartItem.quantity} boxes
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom "View More" Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#200306] via-[#3D060B] to-[#200306] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-regal border border-[#C98E2A]/30">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-[#F0B543] uppercase tracking-wider block">
              Looking for our complete catalog?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Explore All 150+ Crackers & Instant Estimate
            </h3>
            <p className="text-xs text-gray-300 max-w-lg">
              Browse all 16 categories including Sparklers, Ground Chakkars, 120-Shot Cakes, Bombs, and Family Gift Boxes with live price calculations.
            </p>
          </div>

          <Link
            href="/estimate"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C98E2A] via-[#F0B543] to-[#C98E2A] text-[#1C1411] font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>View More Products & Price List</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal with Zoom */}
      <ImageLightboxModal
        isOpen={!!lightboxProduct}
        onClose={() => setLightboxProduct(null)}
        product={lightboxProduct}
        allProducts={featuredProducts}
        onSelectProduct={(p) => setLightboxProduct(p)}
      />
    </section>
  );
};
