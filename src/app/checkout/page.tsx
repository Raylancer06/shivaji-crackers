"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api, CustomerAddress } from '@/services/api';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  MapPin,
  Phone,
  User,
  Mail,
  Copy,
  Check,
  Upload,
  ArrowRight,
  AlertCircle,
  Home,
  Briefcase,
  PlusCircle,
  ShoppingBag,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const {
    items,
    totalBoxes,
    totalMRP,
    totalWholesale,
    totalSavings,
    clearCart,
  } = useCart();
  const { user, token } = useAuth();

  const [minCartValue, setMinCartValue] = useState<number>(2000);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [freeShippingEnabled, setFreeShippingEnabled] = useState<boolean>(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(0);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | 'new'>('new');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    landmark: '',
    notes: '',
  });

  const [paymentData, setPaymentData] = useState({
    utrNumber: '',
    screenshotFile: null as File | null,
    screenshotPreview: '',
    notes: '',
  });

  // Load backend store settings (Minimum Cart Value, Shipping)
  useEffect(() => {
    api.getSettings().then((settings) => {
      if (typeof settings.minimum_cart_value === 'number') {
        setMinCartValue(settings.minimum_cart_value);
      }
      setShippingCharge(settings.shipping_charge ?? 0);
      setFreeShippingEnabled(Boolean(settings.free_shipping_enabled));
      setFreeShippingThreshold(settings.free_shipping_threshold ?? 0);
    }).catch(() => {});
  }, []);

  // Pre-fill user profile and saved addresses if authenticated
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
  }, [user, token]);

  const handleSelectAddress = (addr: CustomerAddress | 'new') => {
    if (addr === 'new') {
      setSelectedAddressId('new');
      setFormData((prev) => ({
        ...prev,
        address: '',
        landmark: '',
        city: 'Hyderabad',
        state: 'Telangana',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('Screenshot file size must be less than 10MB.');
        return;
      }
      setPaymentData({
        ...paymentData,
        screenshotFile: file,
        screenshotPreview: URL.createObjectURL(file),
      });
      setSubmitError('');
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('sivajiduddempudi422@axl');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const isMinMet = totalWholesale >= minCartValue;
  const shortfall = Math.max(0, minCartValue - totalWholesale);

  const isFreeShipping = freeShippingEnabled && freeShippingThreshold > 0 && totalWholesale >= freeShippingThreshold;
  const appliedShipping = isFreeShipping ? 0 : shippingCharge;
  const finalPayableTotal = totalWholesale + appliedShipping;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (items.length === 0) {
      setSubmitError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!isMinMet) {
      setSubmitError(`Minimum cart value is ₹${minCartValue.toLocaleString('en-IN')}. Please add ₹${shortfall.toLocaleString('en-IN')} more.`);
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setSubmitError('Please fill in your name, contact phone, and delivery address.');
      return;
    }

    if (!paymentData.utrNumber.trim()) {
      setSubmitError('Please enter your 12-digit UPI UTR / Reference Number after making the payment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on backend API
      const orderRes = await api.createOrder({
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim() || undefined,
        delivery_address: formData.address.trim(),
        city: formData.city.trim() || 'Hyderabad',
        state: formData.state.trim() || 'Telangana',
        pincode: formData.pincode.trim() || '500034',
        landmark: formData.landmark.trim() || undefined,
        customer_notes: formData.notes.trim() || undefined,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      }, token);

      const createdOrder = orderRes.data;
      if (!createdOrder || !createdOrder.order_number) {
        throw new Error('Could not generate order confirmation. Please try again.');
      }

      // 2. Upload Payment Proof if provided
      if (paymentData.utrNumber.trim() || paymentData.screenshotFile) {
        try {
          const payFormData = new FormData();
          payFormData.append('utr_number', paymentData.utrNumber.trim());
          if (paymentData.screenshotFile) {
            payFormData.append('screenshot', paymentData.screenshotFile);
          }
          if (paymentData.notes.trim()) payFormData.append('notes', paymentData.notes.trim());

          await api.confirmPayment(createdOrder.id, payFormData, token);
        } catch (payErr) {
          console.warn('Payment proof upload error:', payErr);
        }
      }

      // 3. Clear Cart & Confetti
      clearCart();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4972B', '#7B141C', '#0B8043', '#F0B543'],
        });
      } catch (err) {}

      // 4. Redirect to dedicated order confirmation page
      router.push(`/order-confirmation/${createdOrder.order_number}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order. Please review your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF8ED] text-[#B85D00] border border-[#C98E2A]/30 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1C1411]">
          Your Cart is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#66574F] max-w-md mx-auto">
          Add authentic Sivaji Firecracker products to your cart before proceeding to checkout.
        </p>
        <div className="pt-2">
          <Link
            href="/estimate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-bold text-xs uppercase tracking-wider shadow-regal transition"
          >
            <span>Browse Products & Price List</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `upi://pay?pa=sivajiduddempudi422@axl&pn=Sivaji%20Duddempudi&am=${finalPayableTotal}&cu=INR&tn=Sivaji%20Order`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-8 sm:pb-12">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#C98E2A]" />
          <span className="text-xs font-bold text-[#B85D00] uppercase tracking-wider">
            Secure Ecommerce Checkout
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1411]">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-[#66574F] mt-1">
          Complete your delivery details and submit manual UPI payment confirmation.
        </p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Checkout Form */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Customer Info, Delivery Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Account Status */}
          <div className="bg-white rounded-3xl border border-[#E2D7C5] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#550C12] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h2 className="font-serif font-bold text-base text-[#1C1411]">
                  Customer Information
                </h2>
              </div>
              {user ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Logged In
                </span>
              ) : (
                <div className="text-xs text-[#66574F]">
                  Existing customer?{' '}
                  <Link
                    href="/login?redirect=/checkout"
                    className="font-bold text-[#550C12] hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Recipient Full Name"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com for order invoice"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white rounded-3xl border border-[#E2D7C5] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#550C12] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h2 className="font-serif font-bold text-base text-[#1C1411]">
                  Delivery Address
                </h2>
              </div>
              <span className="text-[11px] text-[#8C7A70] flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#C98E2A]" /> Direct Delivery
              </span>
            </div>

            {/* Saved Addresses Selector (if logged in) */}
            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-bold text-[#550C12] uppercase tracking-wider block mb-2">
                  Select Saved Address
                </span>
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
                          {addr.tag === 'Office' ? <Briefcase className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#1C1411] capitalize">
                              {addr.tag || 'Home'} {addr.is_default ? '(Default)' : ''}
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
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Delivery Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Flat / Door No, Apartment or House Name, Street, Area..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="500034"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
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
                  placeholder="e.g. Near Metro Station"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Order Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Call before delivery, handle sparklers with care..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Manual UPI Payment Instructions */}
          <div className="bg-white rounded-3xl border border-[#E2D7C5] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#550C12] text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h2 className="font-serif font-bold text-base text-[#1C1411]">
                  Manual UPI Payment Instructions
                </h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Direct Merchant Account
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 flex flex-col sm:flex-row items-center gap-5">
              <div className="p-2.5 bg-white rounded-2xl border border-[#E2D7C5] shadow-sm shrink-0">
                <img
                  src={upiQrUrl}
                  alt="UPI QR Code"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D00] block">
                  Scan QR with any UPI App (PhonePe / GPay / Paytm / BHIM)
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <code className="text-xs sm:text-sm font-mono font-bold text-[#550C12] bg-white px-2.5 py-1 rounded-lg border border-[#E2D7C5]">
                    sivajiduddempudi422@axl
                  </code>
                  <button
                    type="button"
                    onClick={copyUpiId}
                    className="p-1.5 rounded-lg bg-white border border-[#E2D7C5] text-[#550C12] hover:bg-[#FAF8F5] transition text-xs flex items-center gap-1"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#66574F]">
                  Payee Name: <strong className="text-[#1C1411]">Sivaji Duddempudi</strong>
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Exact Total Amount to Pay: ₹{finalPayableTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* UTR Input & Screenshot Upload */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  12-Digit UPI UTR / Reference Number *
                </label>
                <input
                  type="text"
                  name="utrNumber"
                  required
                  maxLength={20}
                  value={paymentData.utrNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, utrNumber: e.target.value })}
                  placeholder="e.g. 428901234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2D7C5] bg-[#FAF8F5] font-mono text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]"
                />
                <span className="text-[10px] text-gray-500 block mt-1">
                  Found in your UPI payment receipt (Google Pay, PhonePe, Paytm, BHIM)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">
                  Payment Screenshot (Recommended)
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    id="page-screenshot-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {paymentData.screenshotPreview ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-300 bg-emerald-50/60">
                      <img
                        src={paymentData.screenshotPreview}
                        alt="Payment Proof Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-emerald-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-emerald-900 block truncate">
                          {paymentData.screenshotFile?.name}
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {Math.round((paymentData.screenshotFile?.size || 0) / 1024)} KB • Attached
                        </span>
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
                      onClick={() => document.getElementById('page-screenshot-input')?.click()}
                      className="border-2 border-dashed border-[#E2D7C5] rounded-2xl p-4 text-center cursor-pointer hover:border-[#C98E2A] transition bg-[#FAF8F5]"
                    >
                      <Upload className="w-5 h-5 text-[#C98E2A] mx-auto mb-1" />
                      <span className="text-xs font-bold text-[#550C12] block">
                        Upload Payment Screenshot
                      </span>
                      <span className="text-[10px] text-gray-500">
                        PNG, JPG, JPEG up to 10MB
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E2D7C5] p-6 shadow-sm sticky top-24 space-y-4">
            <h2 className="font-serif font-bold text-base text-[#1C1411] pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-sans font-bold text-[#550C12] bg-[#FFF8ED] px-2.5 py-0.5 rounded-full border border-[#C98E2A]/30">
                {totalBoxes} Boxes Selected
              </span>
            </h2>

            {/* Items scroll area */}
            <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="font-bold text-[#1C1411] block truncate">
                      {item.product.name}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Box of {item.product.boxQuantity || 1} {item.product.quantityUnit || 'Pieces'} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-serif font-black text-[#550C12] shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Total MRP:</span>
                <span>₹{totalMRP.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Festival Savings (Up to 80%):</span>
                <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery / Shipping:</span>
                {appliedShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">
                    {isFreeShipping ? 'Free Delivery (Festival Offer)' : 'Free Delivery'}
                  </span>
                ) : (
                  <span className="font-bold text-[#1C1411]">
                    +₹{appliedShipping.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between pt-3 border-t border-gray-200">
                <span className="font-serif font-black text-sm text-[#1C1411]">
                  Net Payable Amount:
                </span>
                <span className="font-serif font-black text-2xl text-[#550C12]">
                  ₹{finalPayableTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Minimum Cart Validation Note */}
            {!isMinMet && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Minimum order value is ₹{minCartValue.toLocaleString('en-IN')}. Please add ₹{shortfall.toLocaleString('en-IN')} more.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isMinMet}
              className={`w-full py-4 px-6 rounded-2xl font-serif font-black text-sm uppercase tracking-wider shadow-regal flex items-center justify-center gap-2 transition ${
                isMinMet && !isSubmitting
                  ? 'bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] hover:scale-[1.01] active:scale-[0.98] text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#F0B543]" />
                  <span>Place Order & Confirm Payment</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>

            <div className="pt-2 text-center space-y-1">
              <span className="text-[10px] text-gray-500 block">
                Official Sivaji Firecracker Direct Dispatch • Safe Delivery Across Telangana & Pan-India
              </span>
              <span className="text-[10px] text-gray-400 block">
                Order confirmation will be displayed immediately upon submission
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
