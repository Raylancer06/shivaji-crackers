"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { api, StoreSettings } from '@/services/api';
import { Product, PRODUCTS, CATEGORIES } from '@/data/products';
import {
  FileDown,
  Printer,
  Search,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Phone,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export default function PriceListPage() {
  const { items, addToCart, updateQuantity, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<{ id: string; label: string; count?: number }[]>([...CATEGORIES]);
  const [settings, setSettings] = useState<Partial<StoreSettings>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getProducts(), api.getCategories(), api.getSettings()])
      .then(([prods, cats, sets]) => {
        if (!isMounted) return;
        if (prods && prods.length > 0) setProducts(prods);
        if (cats && cats.length > 0) {
          const allCount = prods.length;
          const enhancedCats = [
            { id: 'all', label: `All Varieties (${allCount})`, count: allCount },
            ...cats.map((c) => ({
              id: c.id,
              label: `${c.label} (${prods.filter((p) => p.category === c.id).length})`,
              count: prods.filter((p) => p.category === c.id).length,
            })),
          ];
          setCategories(enhancedCats);
        }
        if (sets) setSettings(sets);
      })
      .catch((err) => console.warn('Price list fetch error:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    const existing = items.find((i) => i.product.id === product.id);
    addToCart(product, existing ? existing.quantity + 1 : 1);

    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) return;
    updateQuantity(productId, newQty);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Group products by category for printable view
  const groupedProducts = useMemo(() => {
    const map: Record<string, { label: string; items: Product[] }> = {};
    categories.forEach((c) => {
      if (c.id !== 'all') {
        map[c.id] = { label: c.label.replace(/\s*\(\d+\)$/, ''), items: [] };
      }
    });

    products.forEach((p) => {
      if (!map[p.category]) {
        map[p.category] = { label: p.subtitle || 'General Varieties', items: [] };
      }
      map[p.category].items.push(p);
    });

    return Object.entries(map).filter(([_, group]) => group.items.length > 0);
  }, [products, categories]);

  const supportPhone = settings.support_phone || '+91 83740 44445';
  const cleanPhone = supportPhone.replace(/\s+/g, '');
  const upiId = settings.upi_id || 'sivajiduddempudi422@axl';
  const upiPayee = settings.upi_payee_name || 'Sivaji Duddempudi';

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C1411] flex flex-col justify-between font-sans">
      <Navbar onSearchChange={setSearchTerm} />

      {/* Hero Header Banner */}
      <section className="bg-gradient-to-b from-[#200306] via-[#3D060B] to-[#200306] text-white py-10 sm:py-14 border-b border-[#C98E2A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C98E2A]/20 border border-[#C98E2A]/40 text-[#F0B543] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diwali Festival 2026 • 150+ Varieties</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
                Official Wholesale Price List
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Direct Sivakasi factory wholesale rates with flat 70% to 80% discount on MRP. 100% CSIR-NEERI Green Certified fireworks with Hyderabad express dispatch.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Direct PDF Download Button */}
              <a
                href="/sivaji-firecracker-wholesale-price-list.pdf"
                download="Sivaji-Firecracker-Wholesale-Price-List-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C98E2A] via-[#F0B543] to-[#C98E2A] text-[#1C1411] font-serif font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF Price List</span>
              </a>

              {/* Print Button */}
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4 text-[#F0B543]" />
                <span>Print Price Sheet</span>
              </button>

              {/* Estimate Page Link */}
              <Link
                href="/estimate"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] border border-[#C98E2A]/50 text-white font-bold text-xs shadow-sm transition-all"
              >
                <span>Instant Estimate Sheet</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F0B543]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 w-full flex-1">
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E2D7C5] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search crackers by name, code (e.g. PROD-001) or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E2D7C5] rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C98E2A]/50"
              />
            </div>

            {/* Mobile Category Dropdown */}
            <div className="sm:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E2D7C5] rounded-2xl text-xs font-bold text-[#550C12]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Results Count Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#66574F]">
              <span className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E2D7C5]">
                Showing {filteredProducts.length} of {products.length} Varieties
              </span>
            </div>
          </div>

          {/* Desktop Category Filter Pills */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5 pt-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#550C12] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#5C4D44] hover:bg-[#F2EBE0] border border-[#E2D7C5]/70'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Web Price List Table */}
        <div className="bg-white rounded-3xl border border-[#E2D7C5] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2D7C5] bg-[#FAF8F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-black text-base text-[#1C1411]">
                {selectedCategory === 'all'
                  ? 'All 150+ Festival Cracker Varieties'
                  : categories.find((c) => c.id === selectedCategory)?.label || 'Selected Category'}
              </h2>
              <span className="text-xs text-[#66574F]">
                Flat wholesale direct rates with transparent factory MRP and instant box additions
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20Sivaji%20Firecracker,%20I%20want%20to%20place%20an%20order%20from%20your%20Wholesale%20Price%20List.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-xs hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E2D7C5] text-[#550C12] font-serif font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5 sm:px-4">Code</th>
                  <th className="p-3.5 sm:px-4">Product Name & Type</th>
                  <th className="p-3.5 sm:px-4">Packing / Pieces</th>
                  <th className="p-3.5 sm:px-4 text-right">Factory MRP</th>
                  <th className="p-3.5 sm:px-4 text-right font-black text-[#550C12]">Wholesale Rate</th>
                  <th className="p-3.5 sm:px-4 text-center">Savings</th>
                  <th className="p-3.5 sm:px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D7C5]/50">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#66574F]">
                      No cracker products match your search query. Try another keyword or category.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const cartItem = items.find((i) => i.product.id === product.id);
                    const qty = cartItem ? cartItem.quantity : 0;
                    const discount = product.mrp > 0 ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
                    const isAdded = addedAnimation[product.id];

                    return (
                      <tr key={product.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        {/* SKU */}
                        <td className="p-3.5 sm:px-4 font-mono font-bold text-[#B85D00] whitespace-nowrap">
                          {product.id}
                        </td>

                        {/* Name & Subtitle */}
                        <td className="p-3.5 sm:px-4">
                          <Link
                            href={`/product/${product.id}`}
                            className="font-bold text-[#1C1411] hover:text-[#550C12] hover:underline"
                          >
                            {product.name}
                          </Link>
                          <div className="text-[11px] text-[#7B141C] mt-0.5">{product.subtitle}</div>
                        </td>

                        {/* Packaging */}
                        <td className="p-3.5 sm:px-4 text-stone-600 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E2D7C5] font-medium text-[11px]">
                            {product.pieces || `${product.boxQuantity || 1} ${product.quantityUnit || 'Box'}`}
                          </span>
                        </td>

                        {/* Factory MRP */}
                        <td className="p-3.5 sm:px-4 text-right font-medium text-stone-400 line-through whitespace-nowrap">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </td>

                        {/* Wholesale Price */}
                        <td className="p-3.5 sm:px-4 text-right font-serif font-black text-sm text-[#550C12] whitespace-nowrap">
                          ₹{product.price.toLocaleString('en-IN')}
                        </td>

                        {/* Savings / Discount */}
                        <td className="p-3.5 sm:px-4 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7F0] text-[#07542C] border border-[#A7E2BE]">
                            {discount}% OFF
                          </span>
                        </td>

                        {/* Cart Action */}
                        <td className="p-3.5 sm:px-4 text-center whitespace-nowrap">
                          {qty > 0 ? (
                            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#E2D7C5]">
                              <button
                                onClick={() => handleUpdateQty(product.id, qty - 1)}
                                className="w-6 h-6 rounded-lg bg-white border border-[#E2D7C5] flex items-center justify-center text-stone-600 hover:bg-[#F2EBE0]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-xs px-1 min-w-[20px]">{qty}</span>
                              <button
                                onClick={() => handleUpdateQty(product.id, qty + 1)}
                                className="w-6 h-6 rounded-lg bg-white border border-[#E2D7C5] flex items-center justify-center text-stone-600 hover:bg-[#F2EBE0]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#550C12] hover:bg-[#7B141C] text-white active:scale-95'
                              }`}
                            >
                              {isAdded ? (
                                <span className="inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Added
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Add
                                </span>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DEDICATED PRINTABLE PRICE LIST (Rendered strictly during window.print()) */}
      <div id="printable-price-list" className="hidden print:block p-6 bg-white text-black font-sans">
        {/* Print Header */}
        <div className="border-b-2 border-[#550C12] pb-4 mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-black text-[#550C12] tracking-wide">
              SIVAJI FIRECRACKER
            </h1>
            <p className="text-xs font-bold text-[#B85D00] uppercase tracking-wider">
              Official Festival Wholesale Price List • Diwali 2026
            </p>
            <p className="text-[10px] text-stone-600 mt-1">
              100% CSIR-NEERI Green Certified • Sivakasi Factory Direct Rates • Hyderabad Express Delivery
            </p>
          </div>
          <div className="text-right text-[11px] text-stone-700 space-y-0.5">
            <p className="font-bold text-[#550C12]">Helpline / WhatsApp: {supportPhone}</p>
            <p>UPI ID: {upiId} ({upiPayee})</p>
            <p>Minimum Order: ₹2,000 | Free Delivery &gt; ₹5,000</p>
          </div>
        </div>

        {/* Category Tables for Print */}
        <div className="space-y-4">
          {groupedProducts.map(([catSlug, group]) => (
            <div key={catSlug} className="page-break-inside-avoid">
              <div className="bg-[#550C12] text-white px-3 py-1 font-serif font-bold text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span>{group.label}</span>
                <span className="text-[10px] font-mono text-[#F0B543]">{group.items.length} Items</span>
              </div>

              <table className="w-full text-left text-[9px] border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 text-stone-800 font-bold border-b border-stone-300">
                    <th className="p-1 border-r border-stone-200 w-12 text-center">Code</th>
                    <th className="p-1 border-r border-stone-200">Product Name</th>
                    <th className="p-1 border-r border-stone-200 w-28">Packing</th>
                    <th className="p-1 border-r border-stone-200 w-16 text-right">MRP (₹)</th>
                    <th className="p-1 border-r border-stone-200 w-16 text-right font-black text-[#550C12]">Wholesale (₹)</th>
                    <th className="p-1 border-r border-stone-200 w-14 text-center">Discount</th>
                    <th className="p-1 w-16 text-center">Order Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {group.items.map((prod) => {
                    const discount = prod.mrp > 0 ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) : 0;
                    return (
                      <tr key={prod.id} className="border-b border-stone-200">
                        <td className="p-1 border-r border-stone-200 font-mono font-bold text-center">{prod.id}</td>
                        <td className="p-1 border-r border-stone-200 font-semibold">{prod.name}</td>
                        <td className="p-1 border-r border-stone-200 text-stone-600">{prod.pieces || `${prod.boxQuantity || 1} Box`}</td>
                        <td className="p-1 border-r border-stone-200 text-right text-stone-500">₹{prod.mrp}</td>
                        <td className="p-1 border-r border-stone-200 text-right font-bold text-[#550C12]">₹{prod.price}</td>
                        <td className="p-1 border-r border-stone-200 text-center text-emerald-800 font-bold">{discount}%</td>
                        <td className="p-1 text-center font-mono">______</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Print Footer & Legal Notice */}
        <div className="border-t-2 border-[#550C12] pt-3 mt-6 text-[9px] text-stone-600 page-break-inside-avoid space-y-1.5">
          <p className="font-bold text-[#1C1411]">
            Statutory Notice: As per 2018 Supreme Court Order, online sales of firecrackers are not permitted. Please submit your inquiry through our website or phone/WhatsApp {supportPhone}. We will confirm your order via telephonic verification.
          </p>
          <div className="flex items-center justify-between text-[8px] text-stone-500 pt-1 border-t border-stone-200">
            <span>© 2026 Sivaji Firecracker • Hyderabad, Telangana</span>
            <span>sivajifirecracker.com</span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
