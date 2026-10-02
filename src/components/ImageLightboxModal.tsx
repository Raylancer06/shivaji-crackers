"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Package,
  ShieldCheck,
  Volume2,
  ShoppingBag,
  Sparkles,
  Check,
} from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  product,
  allProducts = [],
  onSelectProduct,
}) => {
  const { addToCart, items } = useCart();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Reset zoom when product changes
  useEffect(() => {
    setZoomLevel(1);
    setIsAdded(false);
  }, [product]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNextProduct();
      } else if (e.key === 'ArrowLeft') {
        handlePrevProduct();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, product, allProducts]);

  const handleNextProduct = useCallback(() => {
    if (!product || !allProducts.length || !onSelectProduct) return;
    const currentIndex = allProducts.findIndex((p) => p.id === product.id);
    if (currentIndex !== -1 && currentIndex < allProducts.length - 1) {
      onSelectProduct(allProducts[currentIndex + 1]);
    } else if (currentIndex === allProducts.length - 1) {
      onSelectProduct(allProducts[0]);
    }
  }, [product, allProducts, onSelectProduct]);

  const handlePrevProduct = useCallback(() => {
    if (!product || !allProducts.length || !onSelectProduct) return;
    const currentIndex = allProducts.findIndex((p) => p.id === product.id);
    if (currentIndex > 0) {
      onSelectProduct(allProducts[currentIndex - 1]);
    } else if (currentIndex === 0) {
      onSelectProduct(allProducts[allProducts.length - 1]);
    }
  }, [product, allProducts, onSelectProduct]);

  if (!isOpen || !product) return null;

  const discountPercent = Math.min(
    80,
    Math.round(((product.mrp - product.price) / product.mrp) * 100)
  );

  const cartItem = items.find((i) => i.product.id === product.id);

  const handleAdd = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(2.5, prev + 0.3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(1, prev - 0.3));
  const resetZoom = () => setZoomLevel(1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E2D7C5] flex flex-col md:flex-row max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1C1411] shadow-lg flex items-center justify-center transition-all hover:scale-105"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[#550C12]" />
          </button>

          {/* Left: Image Viewer with Zoom Controls */}
          <div className="relative md:w-3/5 bg-[#140305] flex flex-col items-center justify-center min-h-[320px] md:min-h-[480px] overflow-hidden select-none">
            {/* Zoom Controls Floating Bar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full text-white border border-white/10 shadow-lg text-xs">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
                className="p-1 hover:text-[#F0B543] disabled:opacity-30 disabled:hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="px-1.5 font-mono text-[11px] font-bold hover:text-[#F0B543] transition-colors"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomLevel >= 2.5}
                className="p-1 hover:text-[#F0B543] disabled:opacity-30 disabled:hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Discount Badge */}
            <div className="absolute top-4 right-16 z-10 bg-[#7B141C] text-white px-3 py-1 rounded-full text-xs font-serif font-black shadow-lg border border-[#F0B543]/40">
              {discountPercent}% OFF
            </div>

            {/* Main Interactive Zoomable Image */}
            <div className="w-full h-full flex items-center justify-center p-6 overflow-hidden">
              <motion.img
                key={product.id}
                src={product.image}
                alt={product.name}
                animate={{ scale: zoomLevel }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag={zoomLevel > 1}
                dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
                className={`max-h-[380px] w-auto object-contain rounded-xl shadow-2xl ${
                  zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                }`}
                onClick={() => {
                  if (zoomLevel === 1) zoomIn();
                  else resetZoom();
                }}
              />
            </div>

            {/* Previous & Next Carousel Buttons */}
            {allProducts.length > 1 && onSelectProduct && (
              <>
                <button
                  type="button"
                  onClick={handlePrevProduct}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#550C12] backdrop-blur-md flex items-center justify-center transition-all shadow-lg"
                  aria-label="Previous cracker"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextProduct}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#550C12] backdrop-blur-md flex items-center justify-center transition-all shadow-lg"
                  aria-label="Next cracker"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Interactive hint */}
            <div className="absolute bottom-3 left-0 right-0 text-center text-[11px] text-white/60 pointer-events-none">
              {zoomLevel > 1 ? 'Drag image to pan • Click to reset' : 'Click image or use controls to zoom'}
            </div>
          </div>

          {/* Right: Product Details & Box Specifications */}
          <div className="md:w-2/5 p-6 flex flex-col justify-between bg-[#FAF8F5] overflow-y-auto">
            <div>
              {/* Category & Sound Level Badges */}
              <div className="flex items-center justify-between text-xs text-[#66574F] mb-2">
                <span className="font-mono font-bold uppercase tracking-wider text-[#B85D00] text-[11px] bg-[#FFF8ED] px-2.5 py-0.5 rounded-full border border-[#C98E2A]/30">
                  {product.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#07542C] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full">
                  <Volume2 className="w-3.5 h-3.5" /> {product.soundLevel}
                </span>
              </div>

              {/* Product Title */}
              <h2 className="font-serif text-2xl font-black text-[#1C1411] tracking-tight leading-tight">
                {product.name}
              </h2>
              <p className="text-xs font-semibold text-[#7B141C] mt-1">
                {product.subtitle}
              </p>

              {/* CRITICAL: Box Quantity Specification Badge */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#E2D7C5] shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF8ED] flex items-center justify-center text-[#B85D00] border border-[#C98E2A]/30">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#66574F]">
                      Packaging Specification
                    </div>
                    <div className="text-sm font-black text-[#550C12]">
                      Box Contains: {product.boxQuantity || 1} {product.quantityUnit || 'Pieces'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Green QR Certification */}
              <div className="mt-3 flex items-center gap-2 text-xs text-[#07542C] bg-[#EBF7F0] p-2.5 rounded-xl border border-[#A7E2BE]/50">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#07542C]" />
                <span className="font-medium text-[11px]">
                  100% CSIR-NEERI Green Certified formulation with verifiable QR code.
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#66574F] mt-3.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price & Add to Cart Footer */}
            <div className="mt-6 pt-4 border-t border-[#E2D7C5]">
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif font-black text-2xl text-[#550C12]">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    MRP ₹{product.mrp}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#07542C] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full">
                  Save ₹{product.mrp - product.price} / Box
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`w-full py-3 px-4 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-regal active:scale-95 ${
                    isAdded
                      ? 'bg-[#07542C] text-white'
                      : 'bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#F0B543]" />
                      <span>{cartItem ? `In Cart (${cartItem.quantity}) - Add More` : 'Add Box to Cart'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Statutory Note */}
              <p className="text-[10px] text-center text-[#8C7A70] mt-2.5">
                Wholesale direct gate rate • No payment gateway fee • Express transport booking
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
