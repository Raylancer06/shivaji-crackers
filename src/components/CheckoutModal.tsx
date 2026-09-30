"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<'form' | 'whatsapp'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '+918318270300', // Pre-filled with user requested test number
    city: 'Hyderabad',
    state: 'Telangana',
    address: '',
    pincode: '500034',
    transport: 'VRL Logistics (Hyderabad Hub)',
    notes: '',
  });

  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    date: string;
    items: typeof items;
    customer: typeof formData;
    totalMRP: number;
    totalWholesale: number;
    totalSavings: number;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderId = `SIV-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const order = {
      orderId,
      date,
      items: [...items],
      customer: { ...formData },
      totalMRP,
      totalWholesale,
      totalSavings,
    };

    setSubmittedOrder(order);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4972B', '#7B141C', '#0B8043', '#F0B543'],
      });
    } catch (err) {
      console.log('Confetti triggered', err);
    }
  };

  const sendOrderToWhatsApp = () => {
    if (!submittedOrder) return;

    let text = `*DIWALI 2025 CONFIRMED FACTORY ESTIMATE - SHIVAJI CRACKERS SIVAKASI*\n`;
    text += `*Order ID:* ${submittedOrder.orderId}\n`;
    text += `*Date:* ${submittedOrder.date}\n\n`;
    text += `*CUSTOMER DETAILS:*\n`;
    text += `*Name:* ${submittedOrder.customer.name}\n`;
    text += `*Phone:* ${submittedOrder.customer.phone}\n`;
    text += `*Address:* ${submittedOrder.customer.address}, ${submittedOrder.customer.city}, ${submittedOrder.customer.state} - ${submittedOrder.customer.pincode}\n`;
    text += `*Preferred Transport Hub:* ${submittedOrder.customer.transport}\n`;
    if (submittedOrder.customer.notes) {
      text += `*Notes:* ${submittedOrder.customer.notes}\n`;
    }
    text += `\n*ORDERED CRACKERS:*\n`;
    submittedOrder.items.forEach((item, idx) => {
      const line = item.product.price * item.quantity;
      text += `${idx + 1}. ${item.product.name} x ${item.quantity} boxes = ₹${line}\n`;
    });
    text += `\n*Total MRP:* ₹${submittedOrder.totalMRP.toLocaleString('en-IN')}\n`;
    text += `*Factory Direct Price:* ₹${submittedOrder.totalWholesale.toLocaleString('en-IN')}\n`;
    text += `*Direct Savings:* ₹${submittedOrder.totalSavings.toLocaleString('en-IN')} (70% Off)\n\n`;
    text += `Please send the payment QR code and Sivakasi transport lorry booking LR number for Hyderabad dispatch.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918318270300?text=${encoded}`, '_blank');
  };

  const handleDirectWhatsAppOnly = () => {
    let text = `*DIWALI 2025 INSTANT ORDER INQUIRY - SHIVAJI CRACKERS*\n`;
    text += `*Testing Contact:* +91 8318270300\n`;
    if (formData.name) text += `*Name:* ${formData.name}\n`;
    if (formData.city) text += `*Destination City:* ${formData.city}\n`;
    text += `\n*SELECTED CRACKERS:*\n`;
    items.forEach((item, idx) => {
      const line = item.product.price * item.quantity;
      text += `${idx + 1}. ${item.product.name} x ${item.quantity} boxes = ₹${line}\n`;
    });
    text += `\n*Total Estimate:* ₹${totalWholesale.toLocaleString('en-IN')} (MRP ₹${totalMRP.toLocaleString('en-IN')})\n`;
    text += `\nPlease check stock and inform transport delivery time for Hyderabad.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918318270300?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if (submittedOrder) {
      clearCart();
      setSubmittedOrder(null);
    }
    setIsCheckoutOpen(false);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl shadow-deep max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden z-10 border border-[#E2D7C5]"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] text-white flex items-center justify-between border-b border-[#C98E2A]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <Sparkles className="w-5 h-5 text-[#F0B543]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg">
                {submittedOrder ? 'Official Estimate Generated!' : 'Checkout & Order Confirmation'}
              </h3>
              <p className="text-xs text-white/80">
                Sivakasi Godown Direct Allocation • Helpline: +91 8318270300
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F5]">
          {submittedOrder ? (
            /* Printable Invoice Receipt View */
            <div className="space-y-6">
              <div className="text-center pb-3 border-b border-[#E2D7C5]">
                <div className="w-12 h-12 rounded-full bg-[#EBF7F0] text-[#07542C] mx-auto flex items-center justify-center mb-2 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-black text-[#1C1411]">
                  Thank You, {submittedOrder.customer.name}!
                </h4>
                <p className="text-xs text-[#66574F] mt-0.5">
                  Your estimate invoice has been generated with direct Sivakasi factory wholesale rates.
                </p>
              </div>

              {/* Printable Invoice Block */}
              <div
                id="printable-invoice"
                className="bg-white border-2 border-[#E2D7C5] rounded-2xl p-4 sm:p-5 text-xs text-[#1C1411] space-y-4 shadow-sm"
              >
                {/* Header details */}
                <div className="flex justify-between items-start border-b border-[#E2D7C5] pb-3">
                  <div>
                    <h5 className="font-serif font-black text-base text-[#550C12]">SHIVAJI CRACKERS SIVAKASI</h5>
                    <p className="text-[11px] text-[#7B141C] font-semibold">Direct Factory Gate Wholesale Dispatch</p>
                    <p className="text-[11px] text-[#66574F]">Paraipatti Godown, Sivakasi - 626189, Tamil Nadu</p>
                    <p className="text-[11px] text-[#66574F]">PESO Lic: E/SC/TN/22/8193 | 100% CSIR-NEERI Green Certified</p>
                    <p className="text-[11px] font-bold text-[#07542C]">Helpline: +91 8318270300</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-black text-xs text-[#1C1411] block">ESTIMATE INVOICE</span>
                    <span className="font-mono text-[#B85D00] font-black text-sm">{submittedOrder.orderId}</span>
                    <span className="text-[#66574F] block text-[10px] mt-0.5">{submittedOrder.date}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#FAF8F5] p-3 rounded-xl border border-[#E2D7C5]">
                  <div>
                    <span className="font-bold text-[#66574F]">Customer:</span>{' '}
                    <strong className="text-[#1C1411]">{submittedOrder.customer.name}</strong>
                  </div>
                  <div>
                    <span className="font-bold text-[#66574F]">WhatsApp:</span>{' '}
                    <strong className="text-[#550C12]">{submittedOrder.customer.phone}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold text-[#66574F]">Delivery Destination:</span>{' '}
                    {submittedOrder.customer.address}, {submittedOrder.customer.city},{' '}
                    {submittedOrder.customer.state} - {submittedOrder.customer.pincode}
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold text-[#66574F]">Transport Hub:</span>{' '}
                    <strong className="text-[#B85D00]">{submittedOrder.customer.transport}</strong>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-[#E2D7C5] rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#FAF7F2] text-[#5C4D44] font-serif font-bold border-b border-[#E2D7C5]">
                      <tr>
                        <th className="p-2">Item Description</th>
                        <th className="p-2 text-center">Qty (Boxes)</th>
                        <th className="p-2 text-right">Factory Rate</th>
                        <th className="p-2 text-right font-serif">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2D7C5]/60">
                      {submittedOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td className="p-2">
                            <span className="font-bold text-[#1C1411]">{item.product.name}</span>
                            <span className="block text-[10px] text-gray-500">
                              {item.product.subtitle}
                            </span>
                          </td>
                          <td className="p-2 text-center font-bold">{item.quantity}</td>
                          <td className="p-2 text-right">₹{item.product.price}</td>
                          <td className="p-2 text-right font-serif font-black text-[#550C12]">
                            ₹{item.product.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="space-y-1 text-right text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Retail MRP Sum:</span>
                    <span className="line-through">₹{submittedOrder.totalMRP.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#07542C] font-bold">
                    <span>Factory Wholesale Discount (70%):</span>
                    <span>-₹{submittedOrder.totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-serif font-black text-[#550C12] border-t border-[#E2D7C5] pt-1.5">
                    <span>Net Order Amount:</span>
                    <span className="text-base">₹{submittedOrder.totalWholesale.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={sendOrderToWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#07542C] hover:bg-[#054022] text-white font-bold text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to WhatsApp (+91 8318270300)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#E2D7C5] hover:bg-[#F2EBE0] text-[#1C1411] font-serif font-bold text-sm transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Tabs (Form vs Direct WhatsApp) */
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="flex rounded-2xl bg-[#F2EBE0] p-1 border border-[#E2D7C5]">
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all ${
                    activeTab === 'form'
                      ? 'bg-white text-[#550C12] shadow-sm border border-[#E2D7C5]'
                      : 'text-[#66574F] hover:text-[#1C1411]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Option 1: Complete Delivery Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('whatsapp')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-serif font-bold transition-all ${
                    activeTab === 'whatsapp'
                      ? 'bg-white text-[#07542C] shadow-sm border border-[#E2D7C5]'
                      : 'text-[#66574F] hover:text-[#1C1411]'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Option 2: 1-Click WhatsApp</span>
                </button>
              </div>

              {/* Order Cart Quick Preview */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#E2D7C5] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1C1411] block">
                    Cart: {totalBoxes} Boxes across {items.length} Selected Items
                  </span>
                  <span className="text-[11px] text-[#07542C] font-bold">
                    Wholesale Direct Savings: -₹{totalSavings.toLocaleString('en-IN')} (70% OFF)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif font-black text-base text-[#550C12]">
                    ₹{totalWholesale.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {activeTab === 'form' ? (
                /* Delivery Form */
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">
                        Customer Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Suresh Reddy"
                          className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] focus:ring-1 focus:ring-[#C98E2A] outline-none text-[#1C1411]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">
                        WhatsApp Contact Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 8318270300"
                          className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] focus:ring-1 focus:ring-[#C98E2A] outline-none font-bold text-[#550C12]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">
                        Delivery City / District *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="e.g. Hyderabad, Secunderabad, Warangal..."
                          className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] focus:ring-1 focus:ring-[#C98E2A] outline-none text-[#1C1411]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">Pincode *</label>
                      <input
                        required
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="500034"
                        className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] outline-none text-[#1C1411]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1411] mb-1">
                      Street Address / Colony Landmark *
                    </label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Plot No, Road No, Colony / Society Name"
                      className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] outline-none text-[#1C1411]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] outline-none font-medium text-[#1C1411]"
                      >
                        <option value="Telangana">Telangana (Hyderabad Hub)</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">
                        Preferred Road Transport Hub
                      </label>
                      <select
                        name="transport"
                        value={formData.transport}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] outline-none font-medium text-[#1C1411]"
                      >
                        <option value="VRL Logistics (Hyderabad Hub)">VRL Logistics (Hyderabad Hub)</option>
                        <option value="Kranti Roadways (Hyderabad)">Kranti Roadways (Hyderabad)</option>
                        <option value="Sharma Transports">Sharma Transports</option>
                        <option value="ARC Transports">ARC Transports</option>
                        <option value="SRS Travels & Cargo">SRS Travels & Cargo</option>
                        <option value="Direct Godown Pickup (Sivakasi)">
                          Direct Godown Pickup (Sivakasi)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1C1411] mb-1">
                      Packaging / Society Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Please waterproof wrap, gated community delivery..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E2D7C5] focus:border-[#C98E2A] outline-none resize-none text-[#1C1411]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] text-white font-serif font-bold text-sm shadow-regal hover:shadow-deep transition-all flex items-center justify-center gap-2 border border-[#C98E2A]/30"
                  >
                    <FileText className="w-4 h-4 text-[#F0B543]" />
                    <span>Submit & Generate Sivakasi Invoice</span>
                  </button>
                </form>
              ) : (
                /* Direct WhatsApp Mode */
                <div className="space-y-4 py-2">
                  <div className="p-4 bg-[#EBF7F0] rounded-2xl border border-[#A7E2BE] text-xs text-[#07542C] space-y-2">
                    <p className="font-serif font-bold flex items-center gap-1.5 text-sm">
                      <MessageCircle className="w-4 h-4 text-[#10B981]" />
                      Instant 1-Click WhatsApp Direct Order
                    </p>
                    <p className="leading-relaxed">
                      Clicking below will format your entire selected cart ({totalBoxes} boxes, ₹
                      {totalWholesale.toLocaleString('en-IN')}) and open WhatsApp to our Sivakasi
                      sales test desk at <strong>+91 8318270300</strong> for Hyderabad dispatch.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Suresh Reddy"
                        className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1C1411] mb-1">
                        Your City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Hyderabad"
                        className="w-full px-3 py-2.5 text-xs rounded-xl bg-white border border-[#E2D7C5]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectWhatsAppOnly}
                    className="w-full py-3.5 rounded-xl bg-[#07542C] hover:bg-[#054022] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5 text-[#F0B543]" />
                    <span>Chat & Order on WhatsApp (+91 8318270300)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
