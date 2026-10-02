"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { api } from '@/services/api';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalBoxes,
    totalMRP,
    totalWholesale,
    totalSavings,
    moqTarget,
    moqMet,
    moqProgress,
  } = useCart();

  const [minCartValue, setMinCartValue] = useState<number>(2000);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [freeShippingEnabled, setFreeShippingEnabled] = useState<boolean>(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(0);

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s) {
        if (s.minimum_cart_value !== undefined) setMinCartValue(s.minimum_cart_value);
        setShippingCharge(s.shipping_charge ?? 0);
        setFreeShippingEnabled(Boolean(s.free_shipping_enabled));
        setFreeShippingThreshold(s.free_shipping_threshold ?? 0);
      }
    }).catch(() => {});
  }, []);

  const isFreeShipping = freeShippingEnabled && freeShippingThreshold > 0 && totalWholesale >= freeShippingThreshold;
  const appliedShipping = isFreeShipping ? 0 : shippingCharge;
  const finalCartTotal = totalWholesale + appliedShipping;

  const isMinMet = minCartValue === 0 || totalWholesale >= minCartValue;
  const shortfall = Math.max(0, minCartValue - totalWholesale);
  const dynamicMoqProgress = minCartValue > 0 ? Math.min(100, Math.round((totalWholesale / minCartValue) * 100)) : 100;

  const handleProceedCheckout = () => {
    if (!isMinMet) return;
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-out Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#E2D7C5]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#E2D7C5] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#550C12] text-[#F0B543] flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif font-black text-base sm:text-lg text-[#1C1411]">
                      Your Cracker Cart
                    </h2>
                    <p className="text-[11px] text-[#66574F]">
                      {totalBoxes} Boxes across {items.length} Selected Varieties
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-700 hover:text-red-800 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Empty Cart"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#F2EBE0] hover:bg-[#E2D7C5] flex items-center justify-center text-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Minimum Order Value Bar */}
              <div className="p-3.5 bg-[#FFF8ED] border-b border-[#E2D7C5]">
                <div className="flex items-center justify-between text-xs font-serif font-bold mb-1.5">
                  <span className="flex items-center gap-1.5 text-[#550C12]">
                    <Truck className="w-3.5 h-3.5 text-[#B85D00]" />
                    <span>Minimum Cart Value Requirement</span>
                  </span>
                  <span className={isMinMet ? 'text-[#07542C] font-black' : 'text-[#B85D00]'}>
                    ₹{totalWholesale.toLocaleString('en-IN')} / ₹{minCartValue.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#E2D7C5] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isMinMet ? 'bg-[#07542C]' : 'bg-[#C98E2A]'
                    }`}
                    style={{ width: `${dynamicMoqProgress}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#66574F] mt-1.5 flex items-center gap-1">
                  {isMinMet ? (
                    <span className="text-[#07542C] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Minimum cart value reached! You can now proceed to checkout.
                    </span>
                  ) : (
                    <span>
                      Add <strong>₹{shortfall.toLocaleString('en-IN')}</strong> more to reach the minimum order value of ₹{minCartValue.toLocaleString('en-IN')}.
                    </span>
                  )}
                </p>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                {items.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#FFF8ED] border border-[#C98E2A]/30 flex items-center justify-center mb-3 text-[#B85D00]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#1C1411]">Your cart is empty</h3>
                    <p className="text-xs text-[#66574F] mt-1 max-w-xs">
                      Explore our premium Sivaji Firecracker collection and add boxes to start shopping.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-5 py-2.5 rounded-xl bg-[#550C12] text-white font-serif font-bold text-xs shadow-md"
                    >
                      Browse Price List
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const lineTotal = item.product.price * item.quantity;
                    const lineMRP = item.product.mrp * item.quantity;

                    return (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 p-3 rounded-2xl border border-[#E2D7C5] bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info & Quantity */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold text-[#1C1411] leading-tight">
                                {item.product.name}
                              </h4>
                              <p className="text-[11px] text-gray-500">
                                {item.product.subtitle}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-[#B85D00] font-bold">
                                  ₹{item.product.price} / box
                                </span>
                                <span className="text-[10px] font-bold text-[#550C12] bg-[#FFF8ED] px-1.5 py-0.5 rounded border border-[#C98E2A]/30">
                                  {item.product.pieces}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            {/* Stepper */}
                            <div className="flex items-center border border-[#E2D7C5] rounded-lg bg-[#FAF7F2] p-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-bold text-xs">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line Total */}
                            <div className="text-right">
                              <span className="font-serif font-black text-xs text-[#550C12]">
                                ₹{lineTotal.toLocaleString('en-IN')}
                              </span>
                              <span className="block text-[10px] text-gray-400 line-through">
                                ₹{lineMRP.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer Summary & Checkout Actions */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-[#E2D7C5] bg-white space-y-3">
                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#66574F]">
                      <span>Total Retail MRP:</span>
                      <span className="line-through">₹{totalMRP.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#07542C] font-bold">
                      <span>Festival Special Discount:</span>
                      <span>-₹{totalSavings.toLocaleString('en-IN')} (Wholesale Savings)</span>
                    </div>
                    <div className="flex justify-between text-[#66574F]">
                      <span>Estimated Delivery:</span>
                      {appliedShipping === 0 ? (
                        <span className="text-[#07542C] font-bold">
                          {isFreeShipping ? 'Free Delivery (Festival Offer)' : 'Free Delivery'}
                        </span>
                      ) : (
                        <span className="font-bold text-[#1C1411]">
                          +₹{appliedShipping.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-serif font-black text-[#1C1411] pt-2 border-t border-[#E2D7C5]">
                      <span>Estimated Total:</span>
                      <span className="text-[#550C12] text-lg font-serif">
                        ₹{finalCartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2 pt-1">
                    {!isMinMet && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Minimum order value is ₹{minCartValue.toLocaleString('en-IN')}. Please add ₹{shortfall.toLocaleString('en-IN')} more to continue.</span>
                      </div>
                    )}

                    <button
                      onClick={handleProceedCheckout}
                      disabled={!isMinMet}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-serif font-bold text-sm shadow-regal transition-all ${
                        isMinMet
                          ? 'bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] text-white hover:shadow-deep cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none'
                      }`}
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-[#8C7A70]">
                    Official PESO & CSIR-NEERI Green Certified Fireworks | Sivaji Firecracker
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
