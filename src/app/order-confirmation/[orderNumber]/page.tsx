"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/services/api';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  Package,
  MapPin,
  Phone,
  User,
  Mail,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Clock,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface OrderItemData {
  id: number;
  product_id: string;
  product_name: string;
  category_name?: string;
  box_quantity?: number;
  quantity_unit?: string;
  mrp: number;
  selling_price: number;
  quantity: number;
  total_mrp: number;
  total_selling_price: number;
}

interface OrderData {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  customer_notes?: string;
  total_mrp: number;
  total_selling_price: number;
  discount_amount: number;
  final_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: OrderItemData[];
  paymentConfirmation?: {
    id: number;
    utr_number: string;
    screenshot_url?: string;
    notes?: string;
    verified: boolean;
  };
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderNumber) return;

    let isMounted = true;
    setLoading(true);

    api.getOrder(orderNumber)
      .then((res) => {
        if (isMounted) {
          if (res?.data) {
            setOrder(res.data);
            try {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4972B', '#7B141C', '#0B8043', '#F0B543'],
              });
            } catch (err) {}
          } else {
            setError('Order details could not be retrieved.');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load order:', err);
          setError(err.message || 'Could not find order details.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderNumber]);

  const sendWhatsAppNotification = () => {
    if (!order) return;

    let text = `*SIVAJI FIRECRACKER — ORDER CONFIRMATION*\n`;
    text += `*Order Number:* ${order.order_number}\n`;
    text += `*Date:* ${new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;

    text += `*CUSTOMER DETAILS:*\n`;
    text += `*Name:* ${order.customer_name}\n`;
    text += `*Phone:* ${order.customer_phone}\n`;
    if (order.customer_email) text += `*Email:* ${order.customer_email}\n`;
    text += `*Delivery Address:* ${order.delivery_address}\n`;
    text += `*City/State/Pin:* ${order.city}, ${order.state} - ${order.pincode}\n`;
    if (order.landmark) text += `*Landmark:* ${order.landmark}\n`;
    if (order.customer_notes) text += `*Notes:* ${order.customer_notes}\n`;

    text += `\n*PAYMENT DETAILS:*\n`;
    text += `*UPI ID:* sivajiduddempudi422@axl\n`;
    if (order.paymentConfirmation?.utr_number) {
      text += `*UTR / Ref Number:* ${order.paymentConfirmation.utr_number}\n`;
    }
    text += `*Payment Verification:* Recorded in Admin System\n`;

    text += `\n*ORDER ITEMS:*\n`;
    order.items?.forEach((item, idx) => {
      const boxQty = item.box_quantity || 1;
      const unit = item.quantity_unit || 'Pieces';
      text += `${idx + 1}. ${item.product_name} (${boxQty} ${unit}/box) x ${item.quantity} boxes = ₹${(item.total_selling_price || item.selling_price * item.quantity).toLocaleString('en-IN')}\n`;
    });

    text += `\n*Total MRP:* ₹${order.total_mrp.toLocaleString('en-IN')}\n`;
    text += `*Festival Discount:* ₹${order.discount_amount.toLocaleString('en-IN')}\n`;
    text += `*Final Amount Paid:* ₹${order.final_amount.toLocaleString('en-IN')}\n\n`;
    text += `Please verify my payment in the admin portal and confirm order dispatch. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918374044445?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-20">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#C98E2A] border-t-[#550C12] rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#66574F]">Loading order confirmation details...</p>
          </div>
        ) : error || !order ? (
          <div className="py-16 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-black text-[#1C1411]">
              Order Not Found
            </h2>
            <p className="text-xs sm:text-sm text-[#66574F]">
              {error || `We could not find order ${orderNumber}. Please check your order number or contact support.`}
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/estimate"
                className="px-6 py-2.5 rounded-xl bg-[#550C12] text-white text-xs font-bold font-serif hover:bg-[#7B141C] transition"
              >
                Browse Price List
              </Link>
              <Link
                href="/account"
                className="px-6 py-2.5 rounded-xl bg-white border border-[#E2D7C5] text-[#550C12] text-xs font-bold hover:bg-[#FAF8F5] transition"
              >
                Go to My Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Hero Header */}
            <div className="bg-white rounded-3xl border border-[#E2D7C5] p-6 sm:p-8 text-center space-y-4 shadow-sm relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Payment Verification In Progress</span>
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl font-black text-[#1C1411]">
                  Order Confirmed & Placed!
                </h1>
                <p className="text-xs sm:text-sm text-[#66574F] max-w-lg mx-auto mt-1">
                  Thank you for shopping with <strong className="text-[#550C12]">Sivaji Firecracker</strong>! Your order request has been securely registered in our system.
                </p>
              </div>

              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-[#FAF8F5] border border-[#E2D7C5] rounded-2xl px-4 py-2.5 text-xs text-[#66574F]">
                <div>
                  Order Number: <strong className="font-mono text-[#550C12] text-sm">{order.order_number}</strong>
                </div>
                <div className="hidden sm:inline text-gray-300">•</div>
                <div>
                  Date: <strong className="text-[#1C1411]">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div className="hidden sm:inline text-gray-300">•</div>
                <div>
                  Payment Status: <strong className="text-emerald-700 uppercase">{order.payment_status || 'Submitted'}</strong>
                </div>
              </div>

              {/* Primary WhatsApp Deep Link */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 max-w-xl mx-auto space-y-3">
                <div className="text-xs sm:text-sm font-bold text-emerald-950">
                  Notify Sivaji Firecracker Support on WhatsApp
                </div>
                <p className="text-[11px] sm:text-xs text-emerald-800">
                  Click below to open WhatsApp with your order reference and payment confirmation pre-filled for priority dispatch.
                </p>
                <button
                  onClick={sendWhatsAppNotification}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Order to WhatsApp (+91 83740 44445)</span>
                </button>
              </div>
            </div>

            {/* Printable Order Details Card */}
            <div id="printable-invoice" className="bg-white rounded-3xl border border-[#E2D7C5] p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Header inside invoice */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[#E2D7C5]">
                <div>
                  <h2 className="font-serif font-black text-xl text-[#550C12]">
                    Sivaji Firecracker
                  </h2>
                  <p className="text-xs text-[#66574F]">
                    Hyderabad, Telangana, India • Phone: +91 83740 44445
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-mono font-bold text-sm text-[#550C12]">
                    Invoice #{order.order_number}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery and Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5] text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-[#550C12] uppercase tracking-wider block text-[11px]">
                    Customer Details
                  </span>
                  <div className="flex items-center gap-2 text-[#1C1411] font-semibold">
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span>{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#66574F]">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span>{order.customer_phone}</span>
                  </div>
                  {order.customer_email && (
                    <div className="flex items-center gap-2 text-[#66574F]">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>{order.customer_email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#550C12] uppercase tracking-wider block text-[11px]">
                    Delivery Address
                  </span>
                  <div className="flex items-start gap-2 text-[#1C1411]">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <div>{order.delivery_address}</div>
                      <div>
                        {order.city}, {order.state} - {order.pincode}
                      </div>
                      {order.landmark && (
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Landmark: {order.landmark}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <h3 className="font-serif font-black text-base text-[#1C1411]">
                  Ordered Fireworks ({order.items?.length || 0} Products)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2D7C5] text-[#66574F] font-bold">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3">Packing / Box Pcs</th>
                        <th className="py-2.5 px-3 text-center">Quantity</th>
                        <th className="py-2.5 px-3 text-right">Price / Box</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items?.map((item, idx) => {
                        const boxQty = item.box_quantity || 1;
                        const unit = item.quantity_unit || 'Pieces';
                        const totalLine = item.total_selling_price || item.selling_price * item.quantity;
                        return (
                          <tr key={item.id || idx} className="hover:bg-[#FAF8F5]/50">
                            <td className="py-3 px-3 text-gray-400 font-mono">{idx + 1}</td>
                            <td className="py-3 px-3 font-semibold text-[#1C1411]">
                              <div>{item.product_name}</div>
                              {item.category_name && (
                                <span className="text-[10px] text-gray-500 font-normal">
                                  {item.category_name}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-[#66574F]">
                              <span className="inline-block px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[#B85D00] text-[11px] font-semibold">
                                {boxQty} {unit} / Box
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-[#1C1411]">
                              {item.quantity} {item.quantity === 1 ? 'Box' : 'Boxes'}
                            </td>
                            <td className="py-3 px-3 text-right font-mono">
                              ₹{item.selling_price.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3 text-right font-serif font-black text-[#550C12]">
                              ₹{totalLine.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="pt-4 border-t border-[#E2D7C5] flex flex-col sm:flex-row justify-between items-start gap-4">
                {/* Payment Information */}
                <div className="p-4 rounded-2xl bg-[#FFF8ED] border border-[#C98E2A]/30 text-xs space-y-2 w-full sm:max-w-md">
                  <div className="flex items-center gap-2 font-bold text-[#550C12]">
                    <CreditCard className="w-4 h-4 text-[#C98E2A]" />
                    <span>Payment Verification Details</span>
                  </div>
                  <div className="text-[11px] space-y-1 text-[#66574F]">
                    <div>
                      UPI ID: <strong className="font-mono text-[#1C1411]">sivajiduddempudi422@axl</strong>
                    </div>
                    <div>
                      Payee: <strong>Sivaji Firecracker</strong>
                    </div>
                    {order.paymentConfirmation?.utr_number && (
                      <div>
                        UTR / Transaction ID:{' '}
                        <strong className="font-mono text-[#550C12]">
                          {order.paymentConfirmation.utr_number}
                        </strong>
                      </div>
                    )}
                    <div className="text-emerald-700 font-medium">
                      Status: Verification pending from store admin.
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-[#66574F]">
                    <span>Total MRP:</span>
                    <span className="line-through font-mono">
                      ₹{order.total_mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Festival Discount:</span>
                    <span>-₹{order.discount_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#E2D7C5]">
                    <span className="font-bold text-[#1C1411]">Final Amount:</span>
                    <span className="font-serif font-black text-2xl text-[#550C12]">
                      ₹{order.final_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-3 rounded-2xl bg-white border border-[#E2D7C5] text-[#550C12] text-xs font-bold hover:bg-[#FAF8F5] transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href="/estimate"
                  className="px-5 py-3 rounded-2xl bg-white border border-[#E2D7C5] text-[#1C1411] text-xs font-bold hover:bg-[#FAF8F5] transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C98E2A]" />
                  <span>Order More</span>
                </Link>
                <Link
                  href="/account"
                  className="px-6 py-3 rounded-2xl bg-[#550C12] hover:bg-[#7B141C] text-white font-serif font-black text-xs tracking-wider shadow-regal flex items-center gap-2 transition"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
