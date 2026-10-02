"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';
import {
  X,
  MessageCircle,
  FileText,
  Printer,
  CheckCircle,
  MapPin,
  Phone,
  User,
  Sparkles,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  Package,
  Home,
  Briefcase,
  PlusCircle,
} from 'lucide-react';
import { api, CustomerAddress } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export const CheckoutModal: React.FC = () => {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    totalBoxes,
    totalMRP,
    totalWholesale,
    totalSavings,
    clearCart,
  } = useCart();
  const { user, token } = useAuth();

  // Multi-step: 'details' -> 'upi_payment' -> 'success'
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'upi_payment' | 'success'>('details');

  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>('new');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Hyderabad',
    state: 'Telangana',
    address: '',
    pincode: '500034',
    landmark: '',
    transport: 'Standard Delivery',
    notes: '',
  });

  const [paymentData, setPaymentData] = useState({
    utrNumber: '',
    screenshotFile: null as File | null,
    screenshotPreview: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address_line || '',
        city: prev.city || user.city || 'Hyderabad',
        state: prev.state || user.state || 'Telangana',
        pincode: prev.pincode || user.pincode || '500034',
      }));
    }

    if (token) {
      api.getAddresses(token).then((addresses) => {
        if (Array.isArray(addresses) && addresses.length > 0) {
          setSavedAddresses(addresses);
          const def = addresses.find((a) => a.is_default) || addresses[0];
          setSelectedAddressId(def.id);
          setFormData((prev) => ({
            ...prev,
            name: def.recipient_name || prev.name,
            phone: def.phone || prev.phone,
            address: def.address_line || prev.address,
            city: def.city || prev.city,
            state: def.state || prev.state,
            pincode: def.pincode || prev.pincode,
            landmark: def.landmark || '',
          }));
        }
      }).catch(() => {});
    }
  }, [isCheckoutOpen, user, token]);

  const handleSelectAddress = (addr: CustomerAddress | 'new') => {
    if (addr === 'new') {
      setSelectedAddressId('new');
      setFormData((prev) => ({
        ...prev,
        address: '',
        landmark: '',
        city: 'Hyderabad',
        pincode: '500034',
      }));
    } else {
      setSelectedAddressId(addr.id);
      setFormData((prev) => ({
        ...prev,
        name: addr.recipient_name || prev.name,
        phone: addr.phone || prev.phone,
        address: addr.address_line,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        landmark: addr.landmark || '',
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  const [createdOrder, setCreatedOrder] = useState<{
    orderId: string;
    backendId?: number;
    date: string;
    items: typeof items;
    customer: typeof formData;
    totalMRP: number;
    totalWholesale: number;
    totalSavings: number;
    utrNumber: string;
    screenshotUrl?: string;
    whatsappLink?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentData((prev) => ({
        ...prev,
        screenshotFile: file,
        screenshotPreview: URL.createObjectURL(file),
      }));
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('sivajiduddempudi422@axl');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Step 1 -> Step 2
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setSubmitError('Please fill in your name, contact phone, and delivery address.');
      return;
    }
    setSubmitError('');
    setCheckoutStep('upi_payment');
  };

  // Step 2 -> Complete Order & Submit to Backend
  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.utrNumber.trim()) {
      setSubmitError('Please enter your 12-digit UPI Transaction / UTR Reference number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const fallbackOrderId = `SIV-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let backendOrderId: number | undefined;
    let finalOrderNumber = fallbackOrderId;
    let serverWaLink: string | undefined;

    try {
      // 1. Send Order to Laravel Backend API
      const orderRes = await api.createOrder({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        delivery_address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark,
        transport_hub: formData.transport || 'Standard Delivery',
        customer_notes: formData.notes,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      }, token);

      if (orderRes.data) {
        backendOrderId = orderRes.data.id;
        finalOrderNumber = orderRes.data.order_number;
      }

      // 2. Upload Payment Screenshot & UTR if provided
      if (backendOrderId && paymentData.screenshotFile) {
        const payFormData = new FormData();
        payFormData.append('utr_number', paymentData.utrNumber);
        payFormData.append('screenshot', paymentData.screenshotFile);
        if (paymentData.notes) payFormData.append('notes', paymentData.notes);

        const payRes = await api.confirmPayment(backendOrderId, payFormData, token);
        if (payRes.data?.admin_whatsapp_link) {
          serverWaLink = payRes.data.admin_whatsapp_link;
        }
      }
    } catch (err: any) {
      console.warn('Backend order submission fallback to direct WhatsApp mode:', err);
    }

    // Build the submitted order object
    const finalized = {
      orderId: finalOrderNumber,
      backendId: backendOrderId,
      date: orderDate,
      items: [...items],
      customer: { ...formData },
      totalMRP,
      totalWholesale,
      totalSavings,
      utrNumber: paymentData.utrNumber,
      screenshotUrl: paymentData.screenshotPreview,
      whatsappLink: serverWaLink,
    };

    setCreatedOrder(finalized);
    setCheckoutStep('success');
    setIsSubmitting(false);
    clearCart();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4972B', '#7B141C', '#0B8043', '#F0B543'],
      });
    } catch (err) {
      // Confetti fallback
    }
  };

  // Dispatch full order breakdown to official Admin WhatsApp: +91 83740 44445
  const sendOrderToWhatsApp = () => {
    if (!createdOrder) return;

    if (createdOrder.whatsappLink) {
      window.open(createdOrder.whatsappLink, '_blank');
      return;
    }

    let text = `*CONFIRMED ORDER - SIVAJI FIRECRACKER*\n`;
    text += `*Order ID:* ${createdOrder.orderId}\n`;
    text += `*Date:* ${createdOrder.date}\n\n`;
    text += `*CUSTOMER DETAILS:*\n`;
    text += `*Name:* ${createdOrder.customer.name}\n`;
    text += `*Phone:* ${createdOrder.customer.phone}\n`;
    text += `*Address:* ${createdOrder.customer.address}, ${createdOrder.customer.city}, ${createdOrder.customer.state} - ${createdOrder.customer.pincode}\n`;
    if (createdOrder.customer.landmark) {
      text += `*Landmark:* ${createdOrder.customer.landmark}\n`;
    }
    if (createdOrder.customer.notes) {
      text += `*Notes:* ${createdOrder.customer.notes}\n`;
    }
    text += `\n*PAYMENT VERIFICATION:*\n`;
    text += `*UPI ID Paid:* sivajiduddempudi422@axl\n`;
    text += `*UTR / Ref Number:* ${createdOrder.utrNumber}\n`;
    text += `*Payment Screenshot:* Uploaded to Sivaji Firecracker Admin Portal\n`;
    text += `\n*ORDERED CRACKERS:*\n`;
    createdOrder.items.forEach((item, idx) => {
      const line = item.product.price * item.quantity;
      text += `${idx + 1}. ${item.product.name} (Box: ${item.product.boxQuantity || 1} ${item.product.quantityUnit || 'Pieces'}) x ${item.quantity} boxes = ₹${line}\n`;
    });
    text += `\n*Total MRP:* ₹${createdOrder.totalMRP.toLocaleString('en-IN')}\n`;
    text += `*Wholesale Direct Price:* ₹${createdOrder.totalWholesale.toLocaleString('en-IN')}\n`;
    text += `*Total Savings:* ₹${createdOrder.totalSavings.toLocaleString('en-IN')}\n\n`;
    text += `Please verify my payment in the admin portal and confirm order dispatch.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918374044445?text=${encoded}`, '_blank');
  };

  const closeModal = () => {
    setIsCheckoutOpen(false);
    setCheckoutStep('details');
    setSubmitError('');
    setCreatedOrder(null);
  };

  if (!isCheckoutOpen) return null;

  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `upi://pay?pa=sivajiduddempudi422@axl&pn=Sivaji%20Duddempudi&am=${totalWholesale}&cu=INR&tn=Sivaji%20Diwali%20Order`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2D7C5] overflow-hidden my-6"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#38060A] via-[#550C12] to-[#7B141C] text-white flex items-center justify-between border-b border-[#C98E2A]/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F0B543] animate-pulse" />
                <span className="text-[11px] font-bold text-[#F0B543] uppercase tracking-wider">
                  Diwali 2025 Factory Gate Order
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-white mt-0.5">
                {checkoutStep === 'details' && 'Step 1: Delivery Information'}
                {checkoutStep === 'upi_payment' && 'Step 2: Business UPI Payment'}
                {checkoutStep === 'success' && 'Order Placed & Awaiting Verification'}
              </h2>
            </div>

            <button
              onClick={closeModal}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-[#FFF8ED] px-6 py-2.5 border-b border-[#E2D7C5] flex items-center justify-between text-xs font-bold text-[#550C12]">
            <div className={`flex items-center gap-1.5 ${checkoutStep === 'details' ? 'text-[#B85D00] font-black' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-[#550C12] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Delivery Address</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className={`flex items-center gap-1.5 ${checkoutStep === 'upi_payment' ? 'text-[#B85D00] font-black' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-[#550C12] text-white flex items-center justify-center text-[10px]">2</span>
              <span>UPI Payment & Proof</span>
            </div>
            <span className="text-gray-300">→</span>
            <div className={`flex items-center gap-1.5 ${checkoutStep === 'success' ? 'text-[#07542C] font-black' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-[#07542C] text-white flex items-center justify-center text-[10px]">3</span>
              <span>WhatsApp Admin Link</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
            {submitError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 1: CUSTOMER & DELIVERY DETAILS                  */}
            {/* ---------------------------------------------------- */}
            {checkoutStep === 'details' && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                {savedAddresses.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#550C12] uppercase tracking-wider">
                        Select Delivery Address
                      </span>
                      <span className="text-[11px] text-[#8C7A70]">Saved in Account</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                              isSelected
                                ? 'border-[#C98E2A] bg-[#FFF8ED] shadow-sm ring-1 ring-[#C98E2A]'
                                : 'border-[#E2D7C5] bg-white hover:border-[#C98E2A]/50'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'bg-[#550C12] text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {addr.address_type === 'home' ? <Home className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#1C1411] capitalize">
                                  {addr.address_type} {addr.is_default ? '(Default)' : ''}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#C98E2A]" />}
                              </div>
                              <p className="text-[11px] text-gray-600 line-clamp-1">{addr.recipient_name} ({addr.phone})</p>
                              <p className="text-[11px] text-gray-500 line-clamp-1">{addr.address_line}, {addr.city}</p>
                            </div>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handleSelectAddress('new')}
                        className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                          selectedAddressId === 'new'
                            ? 'border-[#C98E2A] bg-[#FFF8ED] shadow-sm ring-1 ring-[#C98E2A]'
                            : 'border-dashed border-[#E2D7C5] bg-white hover:border-[#C98E2A]/50'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          selectedAddressId === 'new' ? 'bg-[#550C12] text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <PlusCircle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1C1411]">+ Enter New Address</span>
                          <p className="text-[11px] text-gray-500">Custom recipient or location</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      WhatsApp Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Street Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={2}
                        placeholder="Flat / Door No, Apartment name, Street..."
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="e.g. Near Metro Station, Opp. Shiva Temple"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Destination City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="500034"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Optional Order Instructions
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Call before dispatch, pack sparklers carefully..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E2D7C5] bg-white text-xs text-[#1C1411] outline-none focus:border-[#C98E2A]"
                    />
                  </div>
                </div>

                {/* Cart Financial Summary Box */}
                <div className="mt-5 p-4 rounded-2xl bg-white border border-[#E2D7C5] shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Selected Crackers ({totalBoxes} Boxes):</span>
                    <span>₹{totalMRP.toLocaleString('en-IN')} (MRP)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mb-2">
                    <span>Direct Factory Savings (Up to 80%):</span>
                    <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
                    <span className="font-serif font-black text-sm text-[#1C1411]">
                      Net Wholesale Payable:
                    </span>
                    <span className="font-serif font-black text-2xl text-[#550C12]">
                      ₹{totalWholesale.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-black text-sm uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <span>Proceed to UPI Payment (₹{totalWholesale.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: UPI PAYMENT INSTRUCTIONS & PROOF UPLOAD      */}
            {/* ---------------------------------------------------- */}
            {checkoutStep === 'upi_payment' && (
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#C98E2A]/40 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Dynamic QR Code */}
                    <div className="w-44 h-44 rounded-2xl bg-[#FAF8F5] p-2 border border-[#E2D7C5] shrink-0 flex items-center justify-center shadow-inner">
                      <img
                        src={upiQrUrl}
                        alt="Sivaji Firecracker UPI QR"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D00] bg-[#FFF8ED] px-2 py-0.5 rounded-full border border-[#C98E2A]/30">
                        Official Business UPI Account
                      </span>
                      <h3 className="font-serif font-black text-lg text-[#1C1411]">
                        Sivaji Duddempudi
                      </h3>

                      {/* Official Business UPI ID with Copy Button */}
                      <div className="flex items-center gap-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2D7C5]">
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#550C12] select-all flex-1">
                          sivajiduddempudi422@axl
                        </span>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="px-2.5 py-1 rounded-lg bg-[#550C12] hover:bg-[#7B141C] text-white text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3 h-3 text-[#F0B543]" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-xs text-[#66574F]">
                        Exact Order Amount: <strong className="text-[#550C12] text-sm">₹{totalWholesale.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 4 Step Instructions */}
                  <div className="text-[11px] text-[#66574F] bg-[#FFF8ED] p-3 rounded-xl border border-[#C98E2A]/30 space-y-1">
                    <div className="font-bold text-[#550C12]">Payment Steps:</div>
                    <div>1. Open PhonePe, Google Pay, or Paytm.</div>
                    <div>2. Scan QR or transfer exact amount to <code className="font-mono font-bold text-[#550C12]">sivajiduddempudi422@axl</code>.</div>
                    <div>3. Note down the 12-digit UTR / UPI Reference Number.</div>
                    <div>4. Upload payment screenshot below for fast admin verification.</div>
                  </div>
                </div>

                {/* Payment Confirmation Inputs */}
                <div className="bg-white rounded-2xl border border-[#E2D7C5] p-5 shadow-sm space-y-4">
                  <h4 className="font-serif font-bold text-sm text-[#1C1411]">
                    Submit Payment Confirmation
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      12-Digit UPI Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentData.utrNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, utrNumber: e.target.value })}
                      placeholder="e.g. 428901847291"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs font-mono font-bold text-[#1C1411] outline-none focus:border-[#C98E2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                      Upload Payment Screenshot (Optional but recommended)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {paymentData.screenshotPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-[#E2D7C5] p-2 bg-[#FAF8F5] flex items-center justify-between">
                        <img
                          src={paymentData.screenshotPreview}
                          alt="Receipt Preview"
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1 px-3 text-xs">
                          <span className="font-bold text-[#07542C] block">✓ Screenshot Attached</span>
                          <span className="text-[11px] text-gray-500">{paymentData.screenshotFile?.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPaymentData({ ...paymentData, screenshotFile: null, screenshotPreview: '' })}
                          className="text-xs text-red-600 hover:underline px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-[#E2D7C5] hover:border-[#C98E2A] rounded-2xl p-4 text-center bg-[#FAF8F5] transition"
                      >
                        <Upload className="w-6 h-6 text-[#C98E2A] mx-auto mb-1" />
                        <span className="text-xs font-bold text-[#550C12] block">
                          Click to select payment screenshot
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Supports PNG, JPG, JPEG (Max 10MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('details')}
                    className="px-5 py-3 rounded-2xl bg-white border border-[#E2D7C5] text-xs font-bold text-[#550C12] hover:bg-[#FAF8F5] transition"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-black text-sm uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Saving Order & Proof...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#F0B543]" />
                        <span>Confirm Order & Send to Admin WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 3: ORDER CONFIRMED & WHATSAPP ACTION            */}
            {/* ---------------------------------------------------- */}
            {checkoutStep === 'success' && createdOrder && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-black text-2xl text-[#1C1411]">
                    Order Request Submitted!
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                    Status: Payment Verification Pending
                  </div>
                  <p className="text-xs text-[#66574F] max-w-md mx-auto">
                    Your order <strong className="font-mono text-[#B85D00]">{createdOrder.orderId}</strong> has been recorded in our Sivaji Firecracker admin system.
                  </p>
                </div>

                {/* Primary WhatsApp Deep Link to Admin +91 83740 44445 */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 shadow-sm">
                  <div className="text-xs font-bold text-emerald-900">
                    Send Order & Payment Confirmation to Official Admin WhatsApp:
                  </div>
                  <button
                    onClick={sendOrderToWhatsApp}
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Send Order to WhatsApp (+91 83740 44445)</span>
                  </button>
                  <p className="text-[11px] text-emerald-700">
                    Clicking opens WhatsApp with your complete order breakdown and UTR reference pre-filled.
                  </p>
                </div>

                {/* Order Invoice Summary */}
                <div className="bg-white rounded-2xl border border-[#E2D7C5] p-5 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-mono font-bold text-[#B85D00]">{createdOrder.orderId}</span>
                    <span className="text-gray-500">{createdOrder.date}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Deliver To:</span>
                    <strong className="text-[#1C1411]">{createdOrder.customer.name} ({createdOrder.customer.phone})</strong>
                    <div className="text-[#66574F]">{createdOrder.customer.address}, {createdOrder.customer.city}</div>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Payment Reference:</span>
                    <span className="font-mono font-bold text-[#550C12]">UTR: {createdOrder.utrNumber}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-1">
                    {createdOrder.items.map((it) => (
                      <div key={it.product.id} className="flex justify-between items-center text-[11px]">
                        <span>
                          {it.product.name} ({it.product.pieces}) x {it.quantity}
                        </span>
                        <span className="font-bold text-[#550C12]">
                          ₹{it.product.price * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-bold text-sm text-[#1C1411]">
                    <span>Total Amount Paid:</span>
                    <span className="font-serif font-black text-xl text-[#550C12]">
                      ₹{createdOrder.totalWholesale.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E2D7C5] text-[#550C12] font-bold hover:bg-[#FAF8F5] transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    onClick={closeModal}
                    className="px-5 py-2 rounded-xl bg-[#550C12] text-white font-bold hover:bg-[#7B141C] transition"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
