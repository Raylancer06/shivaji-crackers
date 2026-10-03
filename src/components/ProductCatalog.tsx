"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Product, PRODUCTS, CATEGORIES } from '@/data/products';
import { api } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { ImageLightboxModal } from './ImageLightboxModal';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  ShieldCheck,
  Volume2,
  Package,
  LayoutGrid,
  TableProperties,
  Printer,
  Maximize2,
} from 'lucide-react';

interface ProductCatalogProps {
  initialSearch?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialSearch = '' }) => {
  const { addToCart, updateQuantity, items } = useCart();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<typeof CATEGORIES>(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([dbProducts, dbCategories]) => {
        if (!isMounted) return;
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }
        if (dbCategories && dbCategories.length > 0) {
          setCategories(dbCategories as any);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch dynamic products, using static fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleManualQty = (productId: string, val: string) => {
    const parsed = parseInt(val, 10);
    setQuantities((prev) => ({
      ...prev,
      [productId]: isNaN(parsed) || parsed < 1 ? 1 : parsed,
    }));
  };

  const handleAddToCart = (product: Product, customQty?: number) => {
    const qty = customQty || quantities[product.id] || 1;
    addToCart(product, qty);

    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'savings') {
      result.sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalog" className="py-16 md:py-24 bg-[#FAF8F5] relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 pb-6 border-b border-[#E2D7C5]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8ED] text-[#B85D00] text-xs font-serif font-bold uppercase tracking-wider mb-2 border border-[#C98E2A]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C98E2A]" />
              <span>Direct Wholesale Allocation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411] tracking-tight">
              Wholesale Crackers Price List & Store
            </h2>
            <p className="text-xs sm:text-sm text-[#66574F] mt-1 max-w-2xl font-normal">
              Direct Wholesale Rates • Up to 80% Discount on Retail MRP • Hyderabad Express Delivery
            </p>
          </div>

          {/* View Mode Switcher: Cards vs Table Price List */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center bg-[#F2EBE0] p-1 rounded-xl border border-[#E2D7C5]">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-[#550C12] text-white shadow-sm'
                    : 'text-[#66574F] hover:text-[#1C1411]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Visual Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#550C12] text-white shadow-sm'
                    : 'text-[#66574F] hover:text-[#1C1411]'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Wholesale Price Sheet</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2D7C5] text-[#550C12] text-xs font-serif font-bold hover:bg-[#F2EBE0] shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Price List</span>
            </button>
          </div>
        </div>

        {/* 2-Column Catalog Layout: Side Tabs on Left + Product Listing on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Sticky Side Tabs */}
          <aside className="lg:col-span-4 xl:col-span-3">
            {/* Mobile Category Dropdown (screens < lg) */}
            <div className="lg:hidden bg-white p-4 rounded-2xl border border-[#E2D7C5] shadow-sm mb-4">
              <label className="block text-xs font-bold text-[#550C12] mb-1.5 uppercase tracking-wider">
                Select Cracker Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#FAF8F5] text-xs font-bold border border-[#E2D7C5] text-[#1C1411] outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Vertical Side Tabs (screens lg+) */}
            <div className="hidden lg:block sticky top-24 bg-white rounded-3xl p-3.5 border border-[#E2D7C5] shadow-regal space-y-1.5">
              <div className="px-3 py-2 mb-1 border-b border-[#E2D7C5] flex items-center justify-between">
                <span className="font-black text-xs text-[#550C12] uppercase tracking-wider">
                  Cracker Categories
                </span>
                <span className="text-[10px] font-bold text-[#B85D00] bg-[#FFF8ED] px-2 py-0.5 rounded-full border border-[#C98E2A]/30">
                  {categories.length} Categories
                </span>
              </div>

              <div className="max-h-[calc(100vh-190px)] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-[#550C12] text-white shadow-md border-l-4 border-l-[#F0B543]'
                          : 'text-[#5C4D44] hover:bg-[#FAF8F5] hover:text-[#1C1411] border border-transparent hover:border-[#E2D7C5]'
                      }`}
                    >
                      <span className="truncate pr-2 font-medium">{cat.label.replace(/\s*\(\d+\)$/, '')}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/20 text-[#F0B543]'
                            : 'bg-[#F2EBE0] text-[#66574F] group-hover:bg-[#E2D7C5]'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Search, Controls & Product Display */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Search & Sort Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-regal border border-[#E2D7C5]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-7 relative">
                  <Search className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by cracker name, SKU, or category..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] text-[#1C1411] text-xs sm:text-sm border border-[#E2D7C5] focus:bg-white focus:border-[#C98E2A] outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-5 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8C7A70] shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#FAF8F5] text-[#1C1411] text-xs font-semibold border border-[#E2D7C5] focus:bg-white focus:border-[#C98E2A] outline-none transition-all"
                  >
                    <option value="popular">Sort: Most Popular Diwali Picks</option>
                    <option value="price-asc">Price: Low to High (Wholesale)</option>
                    <option value="price-desc">Price: High to Low (Wholesale)</option>
                    <option value="savings">Discount: Highest Savings First</option>
                  </select>
                </div>
              </div>

              {/* Active Category Tag & Result Count */}
              <div className="mt-3 pt-3 border-t border-[#E2D7C5]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#550C12]">
                    {categories.find((c) => c.id === selectedCategory)?.label || 'All Crackers'}
                  </span>
                  <span className="text-[#66574F]">({filteredProducts.length} items found)</span>
                </div>
                {(selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-[#B85D00] font-bold hover:underline text-[11px]"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

        {/* View Mode 1: Table Wholesale Price List */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-3xl shadow-regal border border-[#E2D7C5] overflow-hidden">
            <div className="p-4 bg-[#FFF8ED] border-b border-[#E2D7C5] flex items-center justify-between text-xs font-serif font-bold text-[#550C12]">
              <span>SIVAJI FIRECRACKER • OFFICIAL FESTIVAL WHOLESALE PRICE LIST SHEET</span>
              <span className="text-[#B85D00]">Showing {filteredProducts.length} Licensed Products</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1C1411]">
                <thead className="bg-[#FAF8F5] text-[#5C4D44] font-serif font-bold border-b border-[#E2D7C5] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Name & Specifications</th>
                    <th className="p-3">Packaging</th>
                    <th className="p-3">Sound Level</th>
                    <th className="p-3 text-right">Factory MRP</th>
                    <th className="p-3 text-right font-black text-[#550C12]">Wholesale Rate</th>
                    <th className="p-3 text-center">Add Boxes</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D7C5]/50">
                  {filteredProducts.map((product) => {
                    const cartItem = items.find((i) => i.product.id === product.id);
                    const currentQty = cartItem ? cartItem.quantity : quantities[product.id] || 1;

                    return (
                      <tr key={product.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#B85D00] whitespace-nowrap">
                          <Link href={`/product/${product.id}`} className="hover:underline">
                            {product.id}
                          </Link>
                        </td>
                        <td className="p-3">
                          <Link href={`/product/${product.id}`} className="font-bold text-xs text-[#1C1411] hover:text-[#550C12] hover:underline block">
                            {product.name}
                          </Link>
                          <div className="text-[11px] text-[#7B141C] font-normal">{product.subtitle}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-bold text-[11px] text-[#550C12] bg-[#FFF8ED] px-2 py-0.5 rounded border border-[#C98E2A]/30">
                            {product.pieces}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {product.soundLevel}
                          </span>
                        </td>
                        <td className="p-3 text-right text-gray-400 line-through whitespace-nowrap">
                          ₹{product.mrp}
                        </td>
                        <td className="p-3 text-right font-black text-sm text-[#550C12] whitespace-nowrap">
                          ₹{product.price}
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center border border-[#E2D7C5] rounded-lg bg-[#FAF8F5] p-0.5">
                            <button
                              onClick={() => {
                                if (cartItem) {
                                  updateQuantity(product.id, cartItem.quantity - 1);
                                } else {
                                  handleQtyChange(product.id, -1);
                                }
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-bold text-xs">
                              {currentQty}
                            </span>
                            <button
                              onClick={() => {
                                if (cartItem) {
                                  updateQuantity(product.id, cartItem.quantity + 1);
                                } else {
                                  handleQtyChange(product.id, 1);
                                }
                              }}
                              className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-3 py-1 rounded-lg bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-bold text-[11px] shadow-sm transition-all"
                          >
                            {cartItem ? 'Update' : '+ Add'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* View Mode 2: Visual Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredProducts.map((product, index) => {
                const currentQty = quantities[product.id] || 1;
                const cartItem = items.find((item) => item.product.id === product.id);
                const isAdded = addedAnimation[product.id];
                const discountPct = Math.min(80, Math.round(((product.mrp - product.price) / product.mrp) * 100));

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    className="bg-white rounded-3xl border border-[#E2D7C5] shadow-regal hover:shadow-deep transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Top Image Frame with Lightbox Trigger */}
                    <div
                      className="relative h-52 w-full overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => setLightboxProduct(product)}
                      title="Click to view image zoom and specifications"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Wholesale Discount Stamp (≤ 80%) */}
                      <div className="absolute top-3 left-3 bg-[#7B141C] text-white px-2.5 py-0.5 rounded-full text-xs font-serif font-black shadow-md border border-[#F0B543]/40">
                        {discountPct}% OFF
                      </div>

                      {product.badge && (
                        <div className="absolute top-3 right-3 bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/40 px-2.5 py-0.5 rounded-full text-[11px] font-serif font-bold shadow-md">
                          {product.badge}
                        </div>
                      )}

                      {/* Floating Zoom Hint Button */}
                      <div className="absolute bottom-10 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                          <Maximize2 className="w-3 h-3 text-[#F0B543]" />
                          <span>Zoom</span>
                        </span>
                      </div>

                      {/* Bottom Info Ribbon */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-[#F0B543]" />
                          {product.pieces}
                        </span>
                        <span className="flex items-center gap-1 text-[#A7E2BE]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          CSIR-NEERI Green QR
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#66574F] mb-1">
                          <span className="font-mono font-bold uppercase tracking-wider text-[#B85D00]">
                            SKU: {product.id}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#5C4D44] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E2D7C5]">
                            <Volume2 className="w-3 h-3 text-[#07542C]" /> {product.soundLevel}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-[#1C1411] group-hover:text-[#550C12] transition-colors leading-snug">
                          <Link href={`/product/${product.id}`} className="hover:underline">
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-xs font-medium text-[#7B141C] mt-0.5">
                          {product.subtitle}
                        </p>

                        <p className="text-xs text-[#66574F] mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing Block */}
                      <div className="mt-4 pt-3.5 border-t border-[#E2D7C5]">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-serif font-black text-2xl text-[#550C12]">
                              ₹{product.price}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              MRP ₹{product.mrp}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#07542C] bg-[#EBF7F0] px-2 py-0.5 rounded">
                            Save ₹{product.mrp - product.price} / Box
                          </span>
                        </div>

                        {/* Interactive Controls */}
                        <div className="mt-4 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {/* Stepper */}
                            <div className="flex items-center border border-[#E2D7C5] rounded-xl bg-[#FAF7F2] p-1">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(product.id, -1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={currentQty}
                                onChange={(e) => handleManualQty(product.id, e.target.value)}
                                className="w-10 text-center font-bold text-xs sm:text-sm bg-transparent outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleQtyChange(product.id, 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Add to Cart button */}
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-serif font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 ${
                                isAdded
                                  ? 'bg-[#07542C] text-white shadow-md'
                                  : 'bg-gradient-to-r from-[#550C12] to-[#7B141C] hover:from-[#3D060B] hover:to-[#550C12] text-white shadow-regal'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-4 h-4 animate-bounce" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-4 h-4 text-[#F0B543]" />
                                  <span>Add to Cart</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Quick +5 button */}
                          <div className="flex items-center justify-between text-[11px] text-[#66574F]">
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product, 5)}
                              className="text-[#B85D00] font-bold hover:underline"
                            >
                              +5 Quick Add ({5 * product.price}₹)
                            </button>
                            {cartItem && (
                              <span className="text-[#07542C] font-bold">
                                In cart: {cartItem.quantity} boxes
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E2D7C5] p-8">
            <h3 className="font-serif text-lg font-bold text-gray-800">No crackers matched your search</h3>
            <p className="text-xs text-gray-500 mt-1">
              Please adjust your search keywords or click below to view the entire catalogue.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#550C12] text-white font-serif font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Product Image Lightbox Modal with Zoom */}
      <ImageLightboxModal
        isOpen={!!lightboxProduct}
        onClose={() => setLightboxProduct(null)}
        product={lightboxProduct}
        allProducts={filteredProducts}
        onSelectProduct={(p) => setLightboxProduct(p)}
      />
    </section>
  );
};
