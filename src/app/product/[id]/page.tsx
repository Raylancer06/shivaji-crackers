"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  ShieldCheck,
  Volume2,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  ArrowLeft,
  Sparkles,
  Maximize2,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Product, PRODUCTS, CATEGORIES } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ImageLightboxModal } from '@/components/ImageLightboxModal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { CartToast } from '@/components/CartToast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const productId = params?.id as string;

  useEffect(() => {
    if (!productId) return;
    const found = PRODUCTS.find((p) => p.id === productId || p.id.toLowerCase() === productId.toLowerCase());
    if (found) {
      setProduct(found);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-black text-[#550C12]">Product Not Found</h1>
          <p className="text-sm text-[#66574F] mt-2">The cracker you are searching for is not in the active Diwali allocation.</p>
          <Link href="/estimate" className="mt-6 inline-block px-6 py-3 rounded-xl bg-[#550C12] text-white font-serif font-bold text-sm">
            ← Browse Wholesale Price List
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryObj = CATEGORIES.find((c) => c.id === product.category);
  const cartItem = items.find((i) => i.product.id === product.id);
  const discountPercent = Math.min(
    80,
    Math.round(((product.mrp - product.price) / product.mrp) * 100)
  );

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans selection:bg-[#C98E2A] selection:text-white">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs text-[#66574F] mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#550C12] transition">Home</Link>
          <span>/</span>
          <Link href="/estimate" className="hover:text-[#550C12] transition">Crackers Catalog</Link>
          <span>/</span>
          <span className="text-[#B85D00] font-semibold">{categoryObj?.label || product.category}</span>
          <span>/</span>
          <span className="font-bold text-[#1C1411] truncate">{product.name}</span>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-[#E2D7C5] shadow-regal p-6 sm:p-8 lg:p-10">
          {/* Left Column: Interactive Image Frame with Zoom Prompt */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#140305] border border-[#E2D7C5] group cursor-pointer flex items-center justify-center shadow-inner"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />

              {/* Discount Tag */}
              <div className="absolute top-4 left-4 bg-[#7B141C] text-white px-3 py-1 rounded-full text-xs font-serif font-black shadow-lg border border-[#F0B543]/40">
                {discountPercent}% OFF
              </div>

              {/* Zoom Trigger Button Overlay */}
              <button
                type="button"
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition shadow-md"
                aria-label="Open Image Zoom Lightbox"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#F0B543]" />
                <span>Zoom & Gallery</span>
              </button>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                <span className="bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">
                  Click to open High-Res Lightbox
                </span>
              </div>
            </div>

            {/* Packaging Badge Preview */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5] flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#550C12] font-bold">
                <Package className="w-4 h-4 text-[#C98E2A]" />
                <span>Standard Sivakasi Factory Allocation</span>
              </span>
              <span className="font-mono text-[#07542C] font-semibold text-[11px] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full">
                PESO Certified
              </span>
            </div>
          </div>

          {/* Right Column: Information, Box Quantity, Pricing & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, SKU, Sound */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#B85D00] bg-[#FFF8ED] px-2.5 py-0.5 rounded-full border border-[#C98E2A]/30">
                  SKU: {product.id}
                </span>
                <span className="text-xs font-semibold text-[#07542C] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-[#07542C]" />
                  {product.soundLevel}
                </span>
                {product.badge && (
                  <span className="text-xs font-bold text-[#7B141C] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-[#7B141C] mt-1">
                {product.subtitle}
              </p>

              {/* CRITICAL: Explicit Box Quantity Specification Badge */}
              <div className="mt-5 p-4 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/40 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#B85D00] border border-[#C98E2A]/40 shadow-sm shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#66574F]">
                      Box Packaging Specification
                    </div>
                    <div className="text-base sm:text-lg font-black text-[#550C12] mt-0.5">
                      Box Contains: {product.boxQuantity || 1} {product.quantityUnit || 'Pieces'}
                    </div>
                    <p className="text-[11px] text-[#66574F] mt-0.5 leading-snug">
                      Authentic factory sealed unit. Quantity is guaranteed 100% accurate per box.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="mt-5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#66574F] tracking-wider">
                      Wholesale Factory Price (Single Box)
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-serif font-black text-3xl text-[#550C12]">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        MRP ₹{product.mrp}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-xs font-bold text-[#07542C] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#A7E2BE]">
                      Save ₹{product.mrp - product.price} / Box ({discountPercent}% OFF)
                    </span>
                    <div className="text-[10px] text-gray-500 mt-1">
                      Inclusive of all factory direct taxes
                    </div>
                  </div>
                </div>
              </div>

              {/* Green QR Certification Badge */}
              <div className="mt-4 p-3 rounded-2xl bg-[#EBF7F0] border border-[#A7E2BE] flex items-center gap-2.5 text-xs text-[#07542C]">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#07542C]" />
                <span className="font-medium text-[11px] leading-relaxed">
                  100% CSIR-NEERI Green Certified chemical formulation with verifiable QR code and reduced particulate emissions.
                </span>
              </div>

              {/* Description */}
              <div className="mt-4 text-xs text-[#66574F] leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Stepper & Add to Cart Action */}
            <div className="pt-6 border-t border-[#E2D7C5] space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E2D7C5] rounded-2xl bg-[#FAF8F5] p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(-1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-[#1C1411]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 5)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#E2D7C5] text-xs font-bold text-[#550C12] hover:bg-[#FAF8F5] transition"
                  >
                    +5 Boxes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 10)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#E2D7C5] text-xs font-bold text-[#550C12] hover:bg-[#FAF8F5] transition"
                  >
                    +10 Boxes
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-serif font-black text-sm flex items-center justify-center gap-2 transition shadow-regal active:scale-95 ${
                    isAdded
                      ? 'bg-[#07542C] text-white'
                      : 'bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>Added {quantity} Box(es) to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#F0B543]" />
                      <span>
                        {cartItem
                          ? `In Cart (${cartItem.quantity} Boxes) • Add ${quantity} More (₹${product.price * quantity})`
                          : `Add ${quantity} Box(es) to Order • ₹${product.price * quantity}`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Express Delivery Notice */}
              <div className="flex items-center gap-2 text-[11px] text-[#66574F] pt-1">
                <Truck className="w-4 h-4 text-[#B85D00] shrink-0" />
                <span>Safe, compliant dispatch with order tracking across Hyderabad & Telangana.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Handling Instructions */}
        <div className="mt-12 bg-white rounded-3xl border border-[#E2D7C5] p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif font-black text-xl text-[#550C12] mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#C98E2A]" />
            <span>PESO Standard Safety & Firing Guidelines</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5]">
              <div className="font-bold text-[#1C1411] mb-1">1. Keep Distance</div>
              <p className="text-[#66574F]">Always maintain at least 5 meters distance after lighting any pyrotechnic.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5]">
              <div className="font-bold text-[#1C1411] mb-1">2. Water Bucket Nearby</div>
              <p className="text-[#66574F]">Keep two buckets of clean water and sand handy for extinguishing used sparklers.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5]">
              <div className="font-bold text-[#1C1411] mb-1">3. Use Long Agarbatti</div>
              <p className="text-[#66574F]">Ignite fuses using an incense stick (agarbatti) at arm's length. Never use open lighters.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5]">
              <div className="font-bold text-[#1C1411] mb-1">4. Adult Supervision</div>
              <p className="text-[#66574F]">Children must always burst crackers under vigilant adult guidance and wearing cotton clothing.</p>
            </div>
          </div>
        </div>

        {/* Related Category Crackers */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif font-black text-2xl text-[#1C1411] mb-6">
              More {categoryObj?.label || 'Related Crackers'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((rel) => {
                const relDiscount = Math.min(80, Math.round(((rel.mrp - rel.price) / rel.mrp) * 100));
                return (
                  <Link
                    key={rel.id}
                    href={`/product/${rel.id}`}
                    className="bg-white rounded-3xl border border-[#E2D7C5] p-4 shadow-sm hover:shadow-regal transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-video w-full rounded-2xl bg-[#140305] overflow-hidden mb-3 relative flex items-center justify-center">
                        <img src={rel.image} alt={rel.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-2 left-2 bg-[#7B141C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {relDiscount}% OFF
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#B85D00] font-bold">{rel.id}</div>
                      <h3 className="font-bold text-xs text-[#1C1411] group-hover:text-[#550C12] transition line-clamp-1">
                        {rel.name}
                      </h3>
                      <div className="text-[10px] text-[#550C12] font-semibold mt-1">
                        Box Contains: {rel.boxQuantity || 1} {rel.quantityUnit || 'Pieces'}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#E2D7C5] flex items-baseline justify-between">
                      <span className="font-bold text-sm text-[#550C12]">₹{rel.price}</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{rel.mrp}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        product={product}
        allProducts={PRODUCTS}
        onSelectProduct={(p) => router.push(`/product/${p.id}`)}
      />

      <CartDrawer />
      <CheckoutModal />
      <CartToast />
      <Footer />
    </div>
  );
}
